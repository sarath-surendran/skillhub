from django.shortcuts import render
from .serializer import ProfileSerializer
from .models import Profile
from users.models import CustomUser
from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from admin_user.models import InstructorApplication

# Create your views here.

class ProfileView(APIView):
    def get(self, request):
        user = request.user
        try:
            User = CustomUser.objects.get(id=user.id)
            profile = Profile.objects.get(user=User)
            
            data = {
                "name": User.name,
                "email":User.email,
                "phone": User.phone,
                "image": profile.image.url,
                'qualification': profile.qualification,
                'employement': profile.employement
            }
            return Response(data, status= status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message":"Profile doesnot exist"})

    
    
    def post(self, request):
        user = request.user
        try:
            profile = Profile.objects.get(user= user)
            profile.user = user
            print(profile)
            request.data["user"]=user.id
            print(request.data)
            serializer = ProfileSerializer(profile, data= request.data)
            if serializer.is_valid():
                print('serializer is valid')
                serializer.save()
                return Response({"message":"Profile successfully edited"},status=status.HTTP_202_ACCEPTED)
            else:
                print(serializer.errors)
        except Exception as e:
            print(e)
            return Response({"message":"profile does not exist"})


class ApplyForInstructor(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        applicant = request.user
        application, created = InstructorApplication.objects.get_or_create(applicant=applicant)
        if created:
            return Response({"message":"Application submitted for approval"}, status=status.HTTP_200_OK)
        elif application.status == 'rejected':
            return Response({"message":"Your Application is Rejected"})
        else:
            return Response({"message":"Application already submitted"})
