from rest_framework import serializers
from .models import Review_and_Ratings

class AddReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review_and_Ratings
        fields = "__all__"

class ReviewAndRatingsSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True) 

    class Meta:
        model = Review_and_Ratings
        fields = ['id', 'user_name', 'course', 'review', 'rating']