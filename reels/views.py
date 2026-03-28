from rest_framework import generics, permissions
from .models import Reel
from .serializers import ReelSerializer


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
        