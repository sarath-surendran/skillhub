from django.contrib import admin
from .models import Message, CommunityMessage
# Register your models here.
admin.site.register(Message)
admin.site.register(CommunityMessage)