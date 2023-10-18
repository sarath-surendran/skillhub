from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from .serializers import LessonSerializer,CourseSerializer, CategorySerializer, CourseListViewSerializer, LessonViewSerializer,CourseUpdateSerializer, Fullcourseserializer
from .models import Category, Course, Lesson
from users.models import CustomUser
import firebase_admin
from firebase_admin import credentials, storage
from django.conf import settings
from google.auth.exceptions import GoogleAuthError
import json
from enrollments.views import PaymentRefund

# Create your views here.


class CreateCourseWithLessons(APIView):
    # def upload_video_to_external_service(self, video_file):
    #     try:
    #         # Initialize Firebase Admin SDK
    #         cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    #         firebase_admin.initialize_app(cred, {'storageBucket': settings.FIREBASE_STORAGE_BUCKET})
            
    #         # Get a reference to the Firebase Storage bucket
    #         bucket = storage.bucket()
            
    #         # Upload the video file
    #         video_blob = bucket.blob(f'lesson_videos/{video_file.title}')#here original was video_blob = bucket.blob(f'lesson_videos/{video_file.name}')
    #         video_blob.upload_from_file(video_file)
            
    #         # Get the URL for the uploaded video
    #         video_url = video_blob.public_url
    #         print(video_url)
            
			
    #         return video_url
    #     except GoogleAuthError:
    #         # Handle Firebase authentication error
    #         return None
    def post(self,request,format = None):
        print('User id is :',request.user.id)
        course_data = request.POST.copy()
        
        print('files : ',request.FILES)
        course_data['thumbnail'] = request.FILES.get('thumbnail')
        # course_data = request.data.copy() # original, worked code
	
        course_data.pop('lessons', None)
        print('request : ',request.POST)
        lessons_data_json = request.POST.get('lessons')
        print('lesson_data_json : ',lessons_data_json)
        lessons_data = json.loads(lessons_data_json)
		

        # lessons_data = request.data.get('lessons') # original, worked code
        # video_file = request.FILES.get('video') # original, worked code
        print('course data :',course_data)
        print('lessons data :',lessons_data)

        try:
            course_data['instructor_id'] = request.user.id
            print('ins_id : ', course_data['instructor_id'])
            # course_data['instructor_id'] = 3
            course_data['category_id'] = int(course_data['category_id'])
            print('ctgry_id : ', course_data['category_id'])
            # course_data['category_id'] = 1
        except:
            return Response({"message":["Enter valid details"]},status=status.HTTP_400_BAD_REQUEST)

        course_serializer = CourseSerializer(data = course_data)
        if course_serializer.is_valid():
            print("valid course serializer")
            # return Response({"message": "valid course"})
            course_instance = course_serializer.save()
            for index,lesson_data in enumerate(lessons_data):
                lesson_data['course'] = course_instance.id
                #lesson_data['content_video_url'] = None
            print(lesson_data)
            lesson_serializer = LessonSerializer(data = lessons_data, many = True)
            if lesson_serializer.is_valid():
                print('valid lesson serializer')
                # for index, lesson_data in enumerate(lessons_data):
                #     # lesson_data['course'] =  course_instance.id
                #     if f'lesson_videos[{index}]' in request.FILES:
                #         video_file = request.FILES[f'lesson_videos[{index}]']
                #         video_url = self.upload_video_to_external_service(video_file)
                #         lesson_data['content_video_url'] = video_url if video_url else None
                #     else:
                #         lesson_data['content_video_url'] = None
                #         print("no video")
                
                lesson_serializer.save()
                #lesson_serializer.save()
                return Response({"message": "Course and lessons created successfully"}, status=status.HTTP_201_CREATED)
            else:
                print('invalid lesson serializer')
                print(lesson_serializer.errors)
                course_instance.delete()
                return Response(lesson_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(course_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # return Response({"message": "course invalid"})
	
            
    
    # def upload_video_to_external_service(self, video_file):
    #     try:
    #         s3 = boto3.client('s3')
    #         video_key = f'lesson_videos/{video_file.name}'
    #         s3.upload_file(video_file.temporary_file_path(), settings.AWS_STORAGE_BUCKET_NAME, video_key)
    #         video_url = f'{settings.MEDIA_URL}{video_key}'
    #         return video_url
    #     except NoCredentialsError:
    #         # Handle AWS credentials error
    #         return None
	
	
	

        

class CategoryView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CoureseView(APIView):
    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseListViewSerializer(courses, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LessonView(APIView):
    def get(self, request):
        id = request.query_params.get('id')
        lessons = Lesson.objects.filter(course=id).order_by('id')
        serializer = LessonViewSerializer(lessons, many = True)
        return Response(serializer.data, status= status.HTTP_200_OK)

class UpdateLesson(APIView):
    def get_object(self, lesson_id):
        try:
            return Lesson.objects.get(id = lesson_id)
        except Lesson.DoesNotExist:
            return Response({"messege" : "lesosn doesnot exist"}, status=status.HTTP_404_NOT_FOUND)
    
    def get(self, request):
        lesson_id = request.query_params.get('id')
        lesson = self.get_object(lesson_id)
        serializer = LessonSerializer(lesson)
        return Response(serializer.data)
    
    def put(self, request):
        lesson_id = request.query_params.get('id')
        lesson = self.get_object(lesson_id)
        print("updated lesson : ",request.data)
        serializer = LessonSerializer(lesson, data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status= status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AddLesson(APIView):
    def post(self, request):
        # course_id = request.query_params.get('id')
        lesson_data = request.data
        print('add lesson data : ',lesson_data)
        # lesson_data['course'] = course_id
        serializer = LessonSerializer(data=lesson_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class DeleteLesson(APIView):
    def delete(self, request):
        lesson_id = request.query_params.get('id')
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            lesson.delete()
            return Response({"message":"Lesson deleted successfully"},status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"message": "Lesson doesnot exist"})


class DeleteCourse(APIView):
    def delete(self,request):
        course_id = request.query_params.get('id')
        try:
            course = Course.objects.get(id=course_id)
            if not course.is_free:
                PaymentRefund(course_id)
            course.delete()
            return Response({"message":"Course deleted"},status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"message": "Course doesnot exist"})
        
class UpdateCourse(APIView):
    def get_object(self, course_id):
        try:
            return Course.objects.get(id = course_id)
        except Course.DoesNotExist:
            return Response({"messege" : "Course doesnot exist"}, status=status.HTTP_404_NOT_FOUND)
    
    def get(self, request):
        course_id = request.query_params.get('id')
        course = self.get_object(course_id)
        serializer = CourseUpdateSerializer(course)
        return Response(serializer.data)
    
    def put(self, request):
        course_id = request.query_params.get('id')
        course = self.get_object(course_id)
        # course['thumbnail'] = request.FILES.get('thumbnail')
        if 'thumbnail' in request.FILES:
            # Handle the thumbnail update here
            course.thumbnail = request.FILES['thumbnail']
        print("updated course : ",request.data)
        serializer = CourseUpdateSerializer(course, data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status= status.HTTP_200_OK)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CategorywiseCourses(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories,many=True)

        data = []

        for category in categories:
            category_data = {
                'id': category.id,
                'name': category.name,
                'courses': CourseSerializer(category.courses.all().order_by('id')[:3], many=True).data
            }
            # category_data['courses'] = CourseSerializer(category.courses.all()[:3], many=True).data
            data.append(category_data)
            
        
        return Response(data, status=status.HTTP_200_OK)
    
class CategorywiseFullCourses(APIView):
    def get(self, request):
        category_id = request.query_params.get('id')
        courses = Course.objects.filter(category_id_id=category_id)
        print(courses)
        serializer = Fullcourseserializer(courses, many = True)
        
        return Response(serializer.data)

    
class CourseDetails(APIView):
    def get(self,request):
        course_id = request.query_params.get('id')
        course = Course.objects.get(id=course_id)
        serializer = CourseSerializer(course)
        # print("serializer : ",serializer.data["instructor_id"])
        
        instructor = CustomUser.objects.get(id=serializer.data["instructor_id"])
        # data = {'course':serializer.data, 'instructor':instructor}
        data = []
        data.append(serializer.data)
        data.append({'instructor':instructor.name, 'instructor_id':instructor.id})
        # print(data)
        # serializer.data.append({'instructor':instructor})
        # print("serializer : ",serializer.data["instructor_id"])
        return Response(data, status=status.HTTP_200_OK)
    
class GetCategory(APIView):
    def get(self, request):
        id = request.query_params.get('id')
        category = Category.objects.get(id = id)
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)