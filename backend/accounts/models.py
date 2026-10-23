from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = [("student", "Student"), ("teacher", "Teacher")]
    role = models.CharField(max_length=10, choices=ROLES, default="student")
    teacher = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="students")
