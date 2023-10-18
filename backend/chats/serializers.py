from rest_framework import serializers
from .models import Message
from users.models import CustomUser as User
from userprofile.models import Profile
from courses.models import Course

class MessageSerializer(serializers.ModelSerializer):
    message = serializers.CharField(source='content')
    user_id = serializers.IntegerField(source='sender_id')
    user_name = serializers.CharField(source = 'sender.name')
    class Meta:
        model = Message
        fields = ['message', 'user_id','user_name']

class ChatListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    image = serializers.ImageField()
    course = serializers.CharField()
    course_id = serializers.IntegerField()
    class Meta:
        fields = "__all__"

class ReceiverDetailsSerializer(serializers.Serializer):
    name = serializers.CharField()
    image  = serializers.ImageField()
    class Meta:
        fields = "__all__"

class CourseDetailsSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source = 'instructor_id.name')
    class Meta:
        model = Course
        fields = ["title", 'id', 'instructor_name', 'thumbnail']