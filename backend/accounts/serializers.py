from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "email", "role"]

class SignupSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    role = serializers.ChoiceField(choices=["student", "teacher"])
    teacher_email = serializers.EmailField(required=False, allow_blank=True)

    def validate_email(self, v):
        if User.objects.filter(username=v.lower()).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return v.lower()

    def create(self, d):
        teacher = User.objects.filter(email=d.get("teacher_email", "").lower(), role="teacher").first() if d.get("teacher_email") else None
        return User.objects.create_user(username=d["email"], email=d["email"], password=d["password"],
                                        first_name=d["name"], role=d["role"], teacher=teacher)
