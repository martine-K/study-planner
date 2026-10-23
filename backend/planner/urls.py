from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter(); router.register("blocks", views.BlockViewSet, basename="block")
urlpatterns = [path("", include(router.urls)), path("generate/", views.generate), path("report/", views.report),
               path("assistant/", views.assistant), path("stats/", views.stats), path("teacher/students/", views.teacher_students)]
