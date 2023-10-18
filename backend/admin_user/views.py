from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from users.models import CustomUser as User
from courses.models import Category, Course, Lesson
from enrollments.models import Enrollment, Payment
from userprofile.models import *
from .serializers import *
from courses.serializers import *
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from .models import InstructorApplication

# Create your views here.

class ViewAllUsers(APIView):
    permission_classes = [IsAdminUser, IsAuthenticated]
    def get(self, request):
        users = User.objects.all().order_by('id')
        data = []
        for user in users:
            profile = Profile.objects.get(user=user.id)
            user_data = {
                'id': user.id,
                'name':user.name,
                'phone': user.phone,
                'email':user.email,
                'is_instructor': user.is_instructor,
                'is_admin': user.is_admin,
                'is_active': user.is_active,
                'image': profile.image if profile else None
            }
            serializer = UserSerializer(user_data)
            data.append(serializer.data)
        return Response(data, status= status.HTTP_200_OK)
    
class ViewAllInstructors(APIView):
    permission_classes = [IsAdminUser, IsAuthenticated]
    def get(self, request):
        instructors = User.objects.filter(is_instructor=True).order_by('id')
        
        data = []
        for instructor in instructors:
            profile = Profile.objects.get(user=instructor.id)
            courses = Course.objects.filter(instructor_id = instructor.id)
            instructor_data = {
                'id': instructor.id,
                'name':instructor.name,
                'is_active': instructor.is_active,
                'courses':courses,
                'image': profile.image if profile else None
            }
            serializer = InstructorSerializer(instructor_data)
            data.append(serializer.data)
        return Response(data, status= status.HTTP_200_OK)

    
class ViewAllCourses(APIView):
    permission_classes = [IsAdminUser, IsAuthenticated]
    def get(self,request):
        courses = Course.objects.all().order_by('id')
        serializer = ViewCourseSerializer(courses, many = True)
        return Response(serializer.data, status= status.HTTP_200_OK)
    
class ViewLessonsOfACourse(APIView):
    permission_classes = [IsAdminUser, IsAuthenticated]
    def get(self, request):
        course_id = request.query_params.get('id')
        lessons = Lesson.objects.filter(course_id=course_id).order_by('id')
        serializer = LessonViewSerializer(lessons, many = True)
        return Response(serializer.data, status= status.HTTP_200_OK)

class BlockUser(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    def patch(self, request):
        user_id = request.query_params.get('id')
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        return Response({"message":"Success"}, status= status.HTTP_204_NO_CONTENT)

class BlockCourse(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def patch(self, request):
        course_id = request.query_params.get('id')
        course = Course.objects.get(id=course_id)
        course.is_blocked = not course.is_blocked
        course.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MakeAdmin(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def post(self, request):
        user_id = request.query_params.get('id')
        try:
            user = User.objects.get(id=user_id)
            user.is_admin = True
            user.save()
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class MakeInstructor(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def post(self, request):
        user_id = request.query_params.get('id')
        try:
            user = User.objects.get(id=user_id)
            user.is_instructor = True
            user.save()
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class SuspendInstructor(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def post(self, request):
        user_id = request.query_params.get('id')
        try:
            user = User.objects.get(id=user_id)
            user.is_instructor = False
            user.save()
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class GetPendingRequests(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request):
        pending_requests = InstructorApplication.objects.filter(status = "pending")
        serializer = PendingRequestSerializer(pending_requests, many=True)
        return Response(serializer.data, status= status.HTTP_200_OK)
    
class RejectRequest(APIView):
    permission_classes = [IsAdminUser, IsAuthenticated]
    def post(self, request):
        rejected_user_id = request.query_params.get('id')
        try:
            application = InstructorApplication.objects.get(applicant_id = rejected_user_id)
            application.status = 'rejected'
            application.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error': e})
        
class AcceptRequest(APIView):
    permission_classes = [IsAdminUser, IsAuthenticated]
    def post(self, request):
        accepted_user_id = request.query_params.get('id')
        print(accepted_user_id)
        try:
            application = InstructorApplication.objects.get(applicant_id = accepted_user_id)
            application.status = 'approved'
            application.save()
            accepted_user = User.objects.get(id = accepted_user_id)
            accepted_user.is_instructor = True
            accepted_user.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error':e}, status= status.HTTP_400_BAD_REQUEST)

class GetPaidCourseEnrollment(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request):
        try:
            payed_enrollments = Enrollment.objects.filter(payment__isnull=False)
            serializer = GetEnrollmentSerializer(payed_enrollments, many = True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':e}, status=status.HTTP_400_BAD_REQUEST)

class GetFreeEnrollments(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    def get(self, request):
        try:
            payed_enrollments = Enrollment.objects.filter(payment__isnull=True)
            serializer = GetEnrollmentSerializer(payed_enrollments, many = True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':e}, status=status.HTTP_400_BAD_REQUEST)