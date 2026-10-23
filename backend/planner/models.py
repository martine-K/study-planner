from django.conf import settings
from django.db import models

class Block(models.Model):
    CATEGORIES = [("study", "Study"), ("chore", "Home chore"), ("hobby", "Hobby"), ("meal", "Meal"), ("rest", "Rest")]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blocks")
    title = models.CharField(max_length=120)
    category = models.CharField(max_length=10, choices=CATEGORIES)
    topic = models.CharField(max_length=120, blank=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    completed = models.BooleanField(default=False)
    focus_minutes = models.PositiveIntegerField(default=0)
    reminded = models.BooleanField(default=False)
    class Meta:
        ordering = ["start"]
