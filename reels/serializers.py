from rest_framework import serializers
from reels.models import Reel, ReelLike, Comment


class ReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reel
        fields = "__all__"
        
        
        
class ReelLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelLike
        fields = ["id", "user", "reel"]
        read_only_fields = ["user"]
    
    
class CommentSerializer(serializers.ModelSerializer):

    user_phone = serializers.CharField(source="user.phone", read_only=True)
    class Meta:
        model = Comment
        fields = ["id", "user_phone", "text", "created_at"]