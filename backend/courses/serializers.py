from rest_framework import serializers
from .models import Course,Lesson,Category

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'
    
    def validate(self,data):
        title = data.get('title')
        video = data.get('content_video_url')
        if len(title) < 2:
            raise serializers.ValidationError("Name should contain more than 2 chacter")

        if len(video)<15:
            raise serializers.ValidationError("Please upload video properly.")
        
        return data

class LessonListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        lesson_mapping = {lesson.id: lesson for lesson in instance}
        data_mapping = {item['id']: item for item in validated_data}

        ret = []
        for lesson_id, data in data_mapping.items():
            lesson = lesson_mapping.get(lesson_id, None)
            if lesson is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(lesson, data))

        for lesson_id, lesson in lesson_mapping.items():
            if lesson_id not in data_mapping:
                lesson.delete()

        return ret

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many = True,required=False)
    
    class Meta:
        model = Course
        fields = '__all__'
        ##########################
        list_serializer_class = LessonListSerializer 

    def validate(self, data):
        is_free = data.get('is_free', True)
        enrollment_fee = data.get('enrollment_fee')


        if not is_free and enrollment_fee is None:
            raise serializers.ValidationError("Enrollment fee is required for non-free courses.")
        
        # if enrollment_fee < 0:
        #     raise serializers.ValidationError("Enrollment fee must be a Positive number")

        return data
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class CourseListViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title','id','thumbnail']
class LessonViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['title','id','content_video_url','course']

class CourseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['title','description','is_free','enrollment_fee','course_duration','course_highlight','course_objective','prerequisites','thumbnail','instructor_id','category_id']

    def validate(self, data):
        is_free = data.get("is_free", True)
        enrollment_fee = data.get('enrollment_fee')

        if not is_free and enrollment_fee is None:
            raise serializers.ValidationError("Enrollment fee is required for non-free courses.")

        # if enrollment_fee < 0:
        #     raise serializers.ValidationError("Enrollment fee must be a Positive number")

        return data
    
class Fullcourseserializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"