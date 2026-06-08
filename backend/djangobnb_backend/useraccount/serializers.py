from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from .models import User

class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(required=False, allow_blank=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        email = self.validated_data.get("email", "")
        username = self.validated_data.get("username") or email
        name = self.validated_data.get("name") or username or email
        data["username"] = username
        data["name"] = name
        return data

    def save(self, request):
        user = super().save(request)
        email = self.validated_data.get("email", "")
        if not user.username:
            user.username = self.validated_data.get("username") or email
        if not user.name:
            user.name = self.validated_data.get("name") or user.username or email
        user.save()
        return user
    
class UserDetailSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'avatar_url',
        ]

    def get_name(self, obj):
        name = obj.name
        if not name or '@' in name:
            email = obj.email or name or ""
            prefix = email.split('@')[0]
            clean_name = prefix.replace('.', ' ').replace('_', ' ').replace('-', ' ')
            return clean_name.title()
        return name

