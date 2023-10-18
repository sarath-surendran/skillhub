from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from .models import Review_and_Ratings
from.serializers import AddReviewSerializer, ReviewAndRatingsSerializer

# Create your views here.

class AddReview(APIView):
    def post(self, request):
        # user = request.user
        print(request.data)
        serializer = AddReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"review created"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response({"error":"error creating review"}, status=status.HTTP_400_BAD_REQUEST)

class ViewReview(APIView):
    def get(self, request):
        course_id = request.query_params.get("id")
        try:
            reviews = Review_and_Ratings.objects.filter(course=course_id)
            reviews_list = list(reviews)
            # serializer = AddReviewSerializer(data=reviews_list, many = True)
            # if serializer.is_valid():
            #     print(serializer.data)
            # else:
            #     print(serializer.errors)
            serialized_reviews = [ReviewAndRatingsSerializer(review).data for review in reviews]
            print(serialized_reviews)
            return Response(serialized_reviews,status=status.HTTP_200_OK)
        except:
            return Response({"error":"error getting reviews"}, status=status.HTTP_400_BAD_REQUEST)