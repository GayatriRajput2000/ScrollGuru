from django.urls import path
from .views import UserListView, UserCreateView, UserDetailView
from rest_framework_simplejwt.token import PhoneTokenObtainPairView


urlpatterns = [
    path('list/', UserListView.as_view(), name='user-list'),
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('api/token/', PhoneTokenObtainPairView.as_view(), name='token_obtain_pair'),
]