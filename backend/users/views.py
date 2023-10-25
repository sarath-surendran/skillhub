from django.shortcuts import render
from rest_framework.views import APIView,Response
from rest_framework import permissions, status, serializers
from .serializers import UserRegisterSerializer,UserViewSerializer
from .models import CustomUser, ForgotPassword
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.core.mail import send_mail
from userprofile.models import Profile
import re

# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["id"] = user.id
        token['name'] = user.name
        # token['email'] = user.email
        # token['phone'] = user.phone
        token['is_admin'] =  user.is_admin
        token['is_instructor'] = user.is_instructor
        token['email_verified'] = user.email_verified
        token['is_active'] = user.is_active
        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        serializer = UserRegisterSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        verification_token = get_random_string(length=32)
        print(verification_token)

        user = serializer.create(serializer.validated_data)
        user.email_verification_token = verification_token
        user.save()
        profile = Profile.objects.create(user=user)
        profile.save()

        # user = UserViewSerializer(user)
        # return Response(user.data, status=status.HTTP_201_CREATED)

        # verification_link = reverse('email_verification', args=[verification_token])
        # verification_url = f'http://localhost:3000{verification_link}' 
        verification_url = f'http://localhost:3000/register/email_verified/{verification_token}/'

        subject = 'Email Verification'
        message = f'Click the following link to verify your email: {verification_url}'
        from_email = 'sarathcm0@gmail.com'  # Replace with your sending email address
        recipient_list = [user.email]

        send_mail(subject, message, from_email, recipient_list)

        return Response({"message":"user registered. Please check you email for verification"}, status=status.HTTP_201_CREATED)
    
class EmailVerification(APIView):
    def get(self, request):
        token = request.query_params.get('token')
        print("token : ",token)
        try:
            user = CustomUser.objects.get(email_verification_token=token)
            user.email_verified = True
            user.email_verification_token = ''#(Here somehow 2 requests are coming. thats why error occurs.)
            user.save()  
            serialized_user = UserViewSerializer(user)  
            return Response(serialized_user.data, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"message": "Invalid token or user not found."}, status=status.HTTP_400_BAD_REQUEST)

class ChangePassword(APIView):
    def post(self, request):
        user = request.user
        try:
            User = CustomUser.objects.get(id= user.id)
            current_password = request.data.get("current_password")
            new_password = request.data.get("new_password")
            if len(new_password) < 8:
                raise serializers.ValidationError("Password must be at least 8 characters long")
        
            if not re.search(r'[!@#$%^&*(),.?":{}|<>]', new_password):
                raise serializers.ValidationError("Password must contain at least one special character")
            
            if not any(char.isdigit() for char in new_password):
                raise serializers.ValidationError("Password must contain at least one numeric digit")
           
            if User.check_password(current_password):
                User.set_password(new_password)
                User.save()
                print("success")
            
                return Response({"testing ": "success"}, status=status.HTTP_200_OK)
            else:
                return Response({"testing":"failed, Password doesn't match"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"testing":"failed"}, status=status.HTTP_400_BAD_REQUEST)
        
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        print(request.data)
        try:
            user = CustomUser.objects.get(email=email)
            
            if user:
                token = get_random_string(length=32)
                ForgotPassword.objects.create(user=user, token=token)
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            return Response({"message":"User doesnot exist"}, status= status.HTTP_400_BAD_REQUEST)

class ForgotPasswordConfirmView(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        if len(new_password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', new_password):
            raise serializers.ValidationError("Password must contain at least one special character")
        
        if not any(char.isdigit() for char in new_password):
                raise serializers.ValidationError("Password must contain at least one numeric digit")
        try:
            password_reset = ForgotPassword.objects.get(token = token)
            user = password_reset.user
            user.set_password(new_password)
            user.save()
            password_reset.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            raise serializers.ValidationError("Token error")

class GoogleAuthRegister(APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        google_id = int(request.data.get('google_id'))
        password = f"googleAuth@{google_id}"
        confirm_password = password

        user = CustomUser.objects.filter(email = email).exists()
        if user:
            return Response({"message":"user exist"})     
        else:
            data = {
                "name":name,
                "email": email,
                "password":password,
                "confirm_password": confirm_password,
                "phone":"",
                # "email_verified":True
                
            }
            serializer = UserRegisterSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                verified_user = CustomUser.objects.get(email=email)
                verified_user.email_verified = True
                verified_user.save()
                profile = Profile.objects.create(user=verified_user)
                profile.save()
                return Response({"message":"user saved"})
            else:
                print(serializer.errors)
                return Response(serializer.errors)

