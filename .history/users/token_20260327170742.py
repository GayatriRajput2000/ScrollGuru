from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['phone'] = user.phone
        return token

    def validate(self, attrs):
        # Use phone instead of username
        phone = attrs.get('phone')
        password = attrs.get('password')
        user = User.objects.filter(phone=phone).first()
        if user and user.check_password(password):
            data = super().validate({'username': user.username, 'password': password})
            return data
        raise Exception('No active account found with the given credentials')