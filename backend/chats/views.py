from django.shortcuts import render
from rest_framework.views import Response, APIView
from rest_framework import status
from .models import Message,CommunityMessage
from .serializers import MessageSerializer, ChatListSerializer, ReceiverDetailsSerializer, CourseDetailsSerializer
from rest_framework.permissions import IsAuthenticated
from users.models import CustomUser as User
from courses.models import Course,Lesson
from enrollments.models import Enrollment
from userprofile.models import Profile

# Create your views here.

class GetMessages(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        # user_id = 2
        # user = User.objects.get(id=user_id)
        receiver_id = int(request.query_params.get('receiver'))
        course_id = (request.query_params.get('course'))
        user_ids = sorted([user.id, receiver_id])
        room_name = f"room_{user_ids[0]}_{user_ids[1]}_on_course_{course_id}"
        try:
            
            messages = Message.objects.filter(chat_room=room_name)
           
            serializer = MessageSerializer(messages, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": str(e)},status=status.HTTP_400_BAD_REQUEST)
        

class GetChatList(APIView):
    def get(self, request):
        instructor = request.user
        # instructor_id = 3
        # instructor = User.objects.get(id = instructor_id)
        try:
            courses = Course.objects.filter(instructor_id = instructor.id)
            data = []
            for course in courses:
                enrollments = Enrollment.objects.filter(course_id=course)
                for enrollment in enrollments:
                    student_profile = Profile.objects.get(user=enrollment.student_id)
                    user_data = {
                        "id":enrollment.student_id.id,
                        "name":enrollment.student_id.name,
                        "course":course.title,
                        "course_id":course.id,
                        "image": student_profile.image if student_profile else None
                    }
                    serializer = ChatListSerializer(user_data)
                    data.append(serializer.data)
            
            # serializer = ChatListSerializer(enrollment_list, many = True)
            return Response(data, status= status.HTTP_200_OK)
            # return Response({"message":"success"})
        except Exception as e:
            print(e)
            return Response({"error":"error getting courses"}, status= status.HTTP_400_BAD_REQUEST)

class GetReceiverDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        receiver_id = request.query_params.get('receiver')
        # receiver_id = 3
        try:
            profile = Profile.objects.get(user_id=receiver_id)
            data = {
                "name":profile.user.name,
                "image":profile.image
            }
            serializer = ReceiverDetailsSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e,status=status.HTTP_400_BAD_REQUEST)

class GetCourseDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        course_id = request.query_params.get('id')
        course = Course.objects.get(id = course_id)
        print(course)
        serializer = CourseDetailsSerializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetCommunityMessages(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        course_id = request.query_params.get('id')
        room_name = f"community_room_on_course_{course_id}"

        try:
            
            messages = CommunityMessage.objects.filter(chat_room=room_name)
           
            serializer = MessageSerializer(messages, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"community_message": str(e)},status=status.HTTP_400_BAD_REQUEST)
