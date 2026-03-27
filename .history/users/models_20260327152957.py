from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    phone = models.CharField(max_length=15, unique=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    streak_days = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "phonw"

    def __str__(self):
        return self.phone