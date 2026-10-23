from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializers import SignupSerializer, UserSerializer

def _auth_payload(user):
    token, _ = Token.objects.get_or_create(user=user)
    return {"token": token.key, "user": UserSerializer(user).data}

@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    s = SignupSerializer(data=request.data); s.is_valid(raise_exception=True)
    return Response(_auth_payload(s.save()), status=201)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    user = authenticate(username=request.data.get("email", "").lower(), password=request.data.get("password", ""))
    if not user:
        return Response({"detail": "Incorrect email or password."}, status=400)
    return Response(_auth_payload(user))

@api_view(["GET"])
def me(request):
    return Response(UserSerializer(request.user).data)
