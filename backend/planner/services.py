"""Scheduling, weekly reports and AI helper logic."""
from collections import defaultdict
from datetime import datetime, time, timedelta
import requests
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from .models import Block

def _dt(day, hour, minute=0):
    return timezone.make_aware(datetime.combine(day, time(hour, minute)))

def generate_week(user, topics, chores, hobbies, session_minutes=30, replace=True):
    """Build 7 days: meals, study (round-robin topics), chores, hobbies and rest."""
    if replace:
        Block.objects.filter(user=user, start__gte=timezone.now(), completed=False).delete()
    topics, chores, hobbies = topics or ["AZ-900 Review"], chores or ["Tidy room"], hobbies or ["Free time"]
    made, t = [], 0
    for d in range(7):
        day = timezone.localdate() + timedelta(days=d)
        def add(title, cat, hour, mins, topic="", minute=0):
            made.append(Block(user=user, title=title, category=cat, topic=topic, start=_dt(day, hour, minute),
                              end=_dt(day, hour, minute) + timedelta(minutes=mins)))
        add("Breakfast", "meal", 7, 30, minute=30)
        add(chores[d % len(chores)], "chore", 8, 45)
        for hr in (9, 10, 15):  # concentration windows
            topic = topics[t % len(topics)]; t += 1
            add(f"Study: {topic}", "study", hr, session_minutes, topic)
        add("Lunch", "meal", 12, 45)
        add("Rest / nap", "rest", 13, 30, minute=30)
        add(hobbies[d % len(hobbies)], "hobby", 17, 60)
        add("Dinner", "meal", 19, 45)
    Block.objects.bulk_create(made)
    return len(made)

def weekly_report(user):
    since = timezone.now() - timedelta(days=7)
    study = Block.objects.filter(user=user, category="study", start__gte=since, start__lte=timezone.now())
    total, done = study.count(), study.filter(completed=True).count()
    minutes = sum(b.focus_minutes for b in study)
    by_topic = defaultdict(lambda: [0, 0])
    for b in study:
        by_topic[b.topic][0] += 1; by_topic[b.topic][1] += b.completed
    topics = [{"topic": k, "planned": v[0], "done": v[1], "rate": round(100 * v[1] / v[0])} for k, v in by_topic.items()]
    rate = round(100 * done / total) if total else 0
    weak = [t["topic"] for t in topics if t["rate"] < 60]
    feedback = []
    if not total: feedback.append("No study sessions were scheduled this week. Generate a plan to get started.")
    elif rate >= 80: feedback.append("Excellent consistency! You are on track for AZ-900.")
    elif rate >= 50: feedback.append("Good progress. Try to finish the sessions you skip, even if short.")
    else: feedback.append("Many sessions were missed. Shorten sessions or move them to your best concentration time.")
    if weak: feedback.append("Needs attention: " + ", ".join(weak) + ".")
    if minutes < 150 and total: feedback.append("Aim for at least 150 focused minutes per week.")
    return {"student": user.first_name, "planned": total, "completed": done, "rate": rate,
            "focus_minutes": minutes, "topics": topics, "feedback": feedback}

def send_report(user):
    r = weekly_report(user)
    body = (f"Weekly study report for {r['student']}\n\nSessions: {r['completed']}/{r['planned']} ({r['rate']}%)\n"
            f"Focused minutes: {r['focus_minutes']}\n\nFeedback:\n- " + "\n- ".join(r["feedback"]))
    to = [user.email] + ([user.teacher.email] if user.teacher else [])
    send_mail(f"AZ-900 weekly report: {r['student']}", body, None, to)
    return r

def ask_ai(question):
    key = settings.ANTHROPIC_API_KEY
    if not key:
        return "AI Study Buddy is in demo mode. Set ANTHROPIC_API_KEY to enable answers. Tip: Azure is Microsoft's cloud platform offering IaaS, PaaS and SaaS."
    res = requests.post("https://api.anthropic.com/v1/messages", timeout=40,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        json={"model": "claude-sonnet-4-6", "max_tokens": 600,
              "system": "You are a friendly AZ-900 Azure Fundamentals tutor. Explain simply with a short example.",
              "messages": [{"role": "user", "content": question}]})
    res.raise_for_status()
    return res.json()["content"][0]["text"]

def dashboard_stats(user):
    """Progress statistics for the dashboard: 7-day chart, totals, streak, readiness."""
    now, today = timezone.now(), timezone.localdate()
    study = Block.objects.filter(user=user, category="study")
    past = study.filter(start__lte=now)
    daily = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        qs = [b for b in past if timezone.localtime(b.start).date() == day]
        daily.append({"day": day.strftime("%a"), "planned": len(qs), "completed": sum(b.completed for b in qs),
                      "minutes": sum(b.focus_minutes for b in qs)})
    streak, d = 0, today
    done_days = {timezone.localtime(b.start).date() for b in past if b.completed}
    if d not in done_days: d -= timedelta(days=1)
    while d in done_days: streak += 1; d -= timedelta(days=1)
    topics = defaultdict(lambda: [0, 0])
    for b in past:
        topics[b.topic or "General"][0] += 1; topics[b.topic or "General"][1] += b.completed
    topic_rates = [{"topic": k, "rate": round(100 * v[1] / v[0])} for k, v in topics.items()]
    total, done = past.count(), past.filter(completed=True).count()
    return {"daily": daily, "streak": streak, "total_sessions": total, "completed_sessions": done,
            "overall_rate": round(100 * done / total) if total else 0,
            "total_minutes": sum(b.focus_minutes for b in past), "upcoming": study.filter(start__gt=now, completed=False).count(),
            "readiness": round(sum(t["rate"] for t in topic_rates) / len(topic_rates)) if topic_rates else 0,
            "topics": sorted(topic_rates, key=lambda t: t["rate"])}
