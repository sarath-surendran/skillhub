from django.shortcuts import render
from rest_framework.views import APIView,Response
from rest_framework import permissions, status
from .serializers import UserRegisterSerializer,UserViewSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.name
        token['email'] = user.email
        token['phone'] = user.phone
        token['is_admin'] =  user.is_admin
        token['is_instructor'] = user.is_instructor
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
        user = serializer.create(serializer.validated_data)
        user = UserViewSerializer(user)
        return Response(user.data, status=status.HTTP_201_CREATED)