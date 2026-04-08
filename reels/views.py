from rest_framework import generics, permissions
from .models import Follow, Reel, User
from .serializers import ReelSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Reel, ReelLike
from .models import Comment
from .serializers import CommentSerializer
from rest_framework import generics
from rest_framework.decorators import action
from rest_framework.response import Response




class ReelListView(generics.ListAPIView):
    queryset = Reel.objects.all().order_by("-created_at")
    serializer_class = ReelSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReelCreateView(generics.CreateAPIView):
    queryset = Reel.objects.all()
    serializer_class = ReelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
        
        
        
class ToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, reel_id):
        reel = Reel.objects.get(id=reel_id)
        like, created = ReelLike.objects.get_or_create(
            user=request.user,
            reel=reel
        )

        if created:
            reel.likes += 1
            reel.save()
            return Response({"message": "Liked"})

        like.delete()
        reel.likes -= 1
        reel.save()

        return Response({"message": "Unliked"})
    

class CommentListView(generics.ListAPIView):

    serializer_class = CommentSerializer

    def get_queryset(self):
        reel_id = self.kwargs["reel_id"]
        return Comment.objects.filter(reel_id=reel_id).order_by("-created_at")
    

class CommentCreateView(generics.CreateAPIView):

    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        reel_id = self.kwargs["reel_id"]

        serializer.save(
            user=self.request.user,
            reel_id=reel_id
        )
        
class CreatorReelListView(generics.ListAPIView):
    serializer_class = ReelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        return Reel.objects.filter(
            creator_id=user_id
        ).order_by("-created_at")
        
    
    
@action(detail=True, methods=["post"])
def follow(self, request, pk=None):
    user_to_follow = User.objects.get(pk=pk)

    Follow.objects.get_or_create(
        follower=request.user,
        following=user_to_follow
    )

    return Response({"status":"followed"})