from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Reel(models.Model):
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reels"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    video = models.FileField(upload_to="reels/videos/")
    thumbnail = models.ImageField(upload_to="reels/thumbnails/", null=True, blank=True)

    category = models.CharField(max_length=50)

    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    

class ReelLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reel = models.ForeignKey(
        Reel,
        on_delete=models.CASCADE,
        related_name="reel_likes"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "reel")
        

class Comment(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    reel = models.ForeignKey(
        Reel,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.phone} - {self.text[:20]}"