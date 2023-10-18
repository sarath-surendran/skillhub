from django.urls import re_path
from . import consumers


websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<reciever_id>\d+)/(?P<user_id>\d+)/(?P<course_id>\d+)/$", consumers.ChatConsumer.as_asgi()),
    re_path(r"ws/community_chat/(?P<course_id>\d+)/(?P<user_id>\d+)/$", consumers.CommunityChatConsumer.as_asgi()),


]