from django.utils import timezone
from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Progress
from users.models import CustomUser as User
from courses.models import Course, Lesson
from enrollments.models import Enrollment

# Create your views here.

class MarkLessonAsCompleted(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        lesson_id = request.query_params.get('id')
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            # student_id = 2
            # student=User.objects.get(id=student_id)
            student = request.user
            progress, created = Progress.objects.get_or_create(student=student, lesson=lesson)
            if not progress.completed:
                progress.completed = True
                # progress.completed_at = timezone.now
                progress.save()
            return Response({'message':"Lesson marked as complete"})
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found."}, status=status.HTTP_404_NOT_FOUND)

def update_enrollment_status(enrollment):
    print('function called')
    course = enrollment.course_id
    print(course)
    lessons = course.lessons.all()
    print(lessons)
    student = enrollment.student_id
    not_completed = Progress.objects.filter(student=student, lesson__in=lessons, completed=False).count()
    print(not_completed)
    if not_completed == 0:
        enrollment.is_completed = True
        print(enrollment.is_completed)
        enrollment.save()
def GetCompletedCourse(course, student):
    try:
        lessons = Lesson.objects.filter(course=course)
        data = []
        for lesson in lessons:
            try:
                progress, created = Progress.objects.get_or_create(lesson=lesson, student=student)
                if progress.completed:
                    data.append(lesson.id)
                
            except:
                return Response({"error":"progress not found"}, status=status.HTTP_400_BAD_REQUEST)
        return data
    except:
        return Response({"error":"Lesson not found"}, status=status.HTTP_400_BAD_REQUEST)

class GetAllCompletedLessons(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
            course_id = request.query_params.get('id')
            # student_id = 2
            # student=User.objects.get(id=student_id)
            student = request.user
            try:
                course = Course.objects.get(id=course_id)
                data = GetCompletedCourse(course,student)
                print(data)
                enrollment = Enrollment.objects.get(student_id=student, course_id=course)
                update_enrollment_status(enrollment)
                
                return Response({"data":data}, status=status.HTTP_200_OK)
            except:
                return Response({"error":"course cannot be found"},status=status.HTTP_400_BAD_REQUEST)
        # except:
        #     return Response({"error":"course cannot be found"},status=status.HTTP_400_BAD_REQUEST)

class GetProgress(APIView):
    permission_classes = [IsAuthenticated]
    print('fetched progress')
    def get(self, request):
        course_id = request.query_params.get('id')
        student = request.user
        # student_id = 2
        # student=User.objects.get(id=student_id)
        try:
            course = Course.objects.get(id=course_id)
            completed_lessons = len(GetCompletedCourse(course,student))
            all_lessons = Lesson.objects.filter(course=course).count()
            progress = int((completed_lessons/all_lessons)*100)
            return Response({"progress":progress},status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({'error':'error getting course'})
