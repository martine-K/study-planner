"""Run weekly (e.g. Sunday 18:00): python manage.py send_weekly_reports"""
from django.core.management.base import BaseCommand
from accounts.models import User
from planner.services import send_report

class Command(BaseCommand):
    help = "Email weekly performance report to each student and their teacher."
    def handle(self, *a, **o):
        for s in User.objects.filter(role="student"): send_report(s)
