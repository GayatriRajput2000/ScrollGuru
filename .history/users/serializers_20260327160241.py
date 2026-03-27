from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone', 'avatar', 'streak_days', 'coins']
        read_only_fields = ['id', 'streak_days', 'coins']