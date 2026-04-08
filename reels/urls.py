from django.urls import path
from .views import (
    ReelListView,
    ReelCreateView,
    ToggleLikeView,
    CommentListView,
    CommentCreateView,
    CreatorReelListView,
)

urlpatterns = [
    path('', ReelListView.as_view(), name='reel-list'),
    path('create/', ReelCreateView.as_view(), name='reel-create'),
    path("<int:reel_id>/like/", ToggleLikeView.as_view()),
    path("<int:reel_id>/comments/", CommentListView.as_view()),
    path("<int:reel_id>/comment/", CommentCreateView.as_view()),
    path("creator/<int:user_id>/", CreatorReelListView.as_view()),
]
