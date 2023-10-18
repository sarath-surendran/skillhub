from django.urls import re_path
from . import consumers

websocket_urlpatterns_notifications = [
    re_path(r'ws/instructor_application/(?P<user_id>\d+)/$', consumers.InstructorApplicationConsumer.as_asgi()),
]