"""Run every minute (cron / Task Scheduler): python manage.py send_reminders"""
from datetime import timedelta
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.utils import timezone
from planner.models import Block

class Command(BaseCommand):
    help = "Email students 30 minutes before a study block."
    def handle(self, *a, **o):
        now = timezone.now()
        due = Block.objects.filter(category="study", reminded=False, completed=False,
                                   start__gt=now, start__lte=now + timedelta(minutes=30)).select_related("user")
        for b in due:
            send_mail("Study session in 30 minutes", f"Hi {b.user.first_name}, '{b.title}' starts at "
                      f"{timezone.localtime(b.start):%H:%M}. Get your water and notes ready!", None, [b.user.email])
            b.reminded = True; b.save(update_fields=["reminded"])
        self.stdout.write(f"{due.count()} reminder(s) processed")
