from datetime import timedelta
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import User
from .models import Block
from .serializers import BlockSerializer
from . import services

class BlockViewSet(viewsets.ModelViewSet):
    serializer_class = BlockSerializer
    def get_queryset(self):
        return Block.objects.filter(user=self.request.user)
    def perform_create(self, s):
        s.save(user=self.request.user)

@api_view(["POST"])
def generate(request):
    d = request.data
    n = services.generate_week(request.user, d.get("topics"), d.get("chores"), d.get("hobbies"), int(d.get("session_minutes", 30)))
    return Response({"created": n})

@api_view(["GET", "POST"])
def report(request):
    if request.method == "POST":
        return Response(services.send_report(request.user))
    return Response(services.weekly_report(request.user))

@api_view(["POST"])
def assistant(request):
    q = (request.data.get("question") or "").strip()
    if not q: return Response({"detail": "Ask a question."}, status=400)
    try: return Response({"answer": services.ask_ai(q)})
    except Exception: return Response({"answer": "The assistant is unavailable right now. Please try again."})

@api_view(["GET"])
def teacher_students(request):
    if request.user.role != "teacher": return Response({"detail": "Teachers only."}, status=403)
    return Response([{"id": s.id, "email": s.email, **services.weekly_report(s)} for s in request.user.students.all()])

@api_view(["GET"])
def stats(request):
    return Response(services.dashboard_stats(request.user))
