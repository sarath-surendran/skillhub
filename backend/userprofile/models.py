from django.db import models
from users.models import CustomUser

# Create your models here.

class Profile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="profile")
    image = models.ImageField(upload_to='user_profile_image', null= True,blank=True,default='user_profile_image/images.png')
    qualification = models.CharField(max_length=255, blank=True, null=True)
    employement = models.CharField(max_length=255, blank=True, null=True)