from rest_framework import serializers
from users.models import CustomUser as User
from userprofile.models import Profile
from courses.models import Course, Lesson, Category
from enrollments.models import Enrollment
from course_progress.models import Progress
from .models import InstructorApplication

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    phone = serializers.CharField()
    email = serializers.EmailField()
    is_instructor = serializers.BooleanField()
    is_admin = serializers.BooleanField()
    is_active = serializers.BooleanField()
    image = serializers.ImageField()

    class Meta:
        fields = "__all__"

class InstructorViewCourse(serializers.ModelSerializer):

    enrolled_students_count = serializers.SerializerMethodField(read_only=True)
    enrolled_students = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = ['id','title','thumbnail', 'enrolled_students_count', 'enrolled_students']

    def get_enrolled_students_count(self, obj):
        enrolled_students = Enrollment.objects.filter(course_id=obj).count()
        return enrolled_students

    def get_enrolled_students(self, obj):
        enrolled_students = Enrollment.objects.filter(course_id=obj)
        enrolled_students_data = []

        for enrollment in enrolled_students:
            student_id = enrollment.student_id_id
            try:
                student_profile = Profile.objects.get(user_id=student_id)
                student_data = {
                    'student_name': enrollment.student_id.name,
                    'student_image': student_profile.image.url if student_profile.image else None,
                }

                # Calculate the number of completed lessons and course progress.
                lessons = Lesson.objects.filter(course=obj)
                completed_lessons = 0
                for lesson in lessons:
                    progress = Progress.objects.filter(student_id=student_id, lesson=lesson).first()
                    if progress and progress.completed:
                        completed_lessons += 1

                course_progress = 0
                if lessons.count() > 0:
                    course_progress = int((completed_lessons / lessons.count()) * 100)

                student_data['student_progress'] = course_progress
                enrolled_students_data.append(student_data)
            except Profile.DoesNotExist:
                enrolled_students_data.append({
                    'student_name': enrollment.student_id.name,
                    'student_image': None,
                    'student_progress': 0,  # Set progress to 0 for students without profiles
                })
        
        return enrolled_students_data


class InstructorSerializer(serializers.Serializer):
    courses = InstructorViewCourse(many=True)

    id = serializers.IntegerField()
    name = serializers.CharField()
    is_active = serializers.BooleanField()
    image = serializers.ImageField()

    class Meta:
        fields = "__all__"

class ViewCourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor_id.name", read_only=True)
    # instructor_image =  serializers.CharField(source='instructor_id.profile', read_only = True)
    instructor_image = serializers.SerializerMethodField(read_only=True)
    enrolled_students = serializers.SerializerMethodField(read_only=True)
    

    class Meta:
        model = Course
        fields = ['id','thumbnail','title', 'instructor_name', 'is_free', 'enrollment_fee', 'is_blocked', 'instructor_image', 'enrolled_students']

    def get_instructor_image(self, obj):
        # Get the instructor_id from the serialized data
        instructor_id = obj.instructor_id_id

        # Retrieve the instructor's profile
        try:
            instructor_profile = Profile.objects.get(user_id=instructor_id)
            
            # Check if the instructor has an image
            if instructor_profile.image:
                return instructor_profile.image.url

        except Profile.DoesNotExist:
            pass  # Handle the case where the instructor's profile doesn't exist or has no image
        
        return None  # Return None if no image is found
    
    
    def get_enrolled_students(self, obj):
        # Get all the enrolled students for the current course
        enrolled_students = Enrollment.objects.filter(course_id=obj)

        # Serialize the enrolled students' names and images
        enrolled_students_data = []
        for enrollment in enrolled_students:
            student_id = enrollment.student_id_id
            try:
                student_profile = Profile.objects.get(user_id=student_id)
                enrolled_students_data.append({
                    'student_name': enrollment.student_id.name,
                    'student_image': student_profile.image.url if student_profile.image else None,
                })
            except Profile.DoesNotExist:
                enrolled_students_data.append({
                    'student_name': enrollment.student_id.name,
                    'student_image': None,
                })

        return enrolled_students_data
    
class PendingRequestSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.name')
    applicant_id = serializers.CharField(source = 'applicant.id')
    application_status = serializers.CharField(source = 'status')

    class Meta:
        model = InstructorApplication
        fields = ["applicant_name", "applicant_id", "application_status"]

class GetEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'