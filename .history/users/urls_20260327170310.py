from django.urls import path
from .views import UserListView, UserCreateView, UserDetailView
from users.token import PhoneTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from django.conf import settings
from django.conf.urls.static import static
from users.token import PhoneTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


# Custom JWT view using phone as username
class PhoneTokenObtainPairView(TokenObtainPairView):
    serializer_class = PhoneTokenObtainPairSerializer


urlpatterns = [
    path('list/', UserListView.as_view(), name='user-list'),
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('api/token/', PhoneTokenObtainPairView.as_view(), name='token_obtain_pair'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)