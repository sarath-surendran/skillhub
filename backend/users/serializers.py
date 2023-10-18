import re
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()
class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = "__all__"

    def validate(self, data):
        password = data['password']
        confirm_password =  data['confirm_password']
        if password != confirm_password:
            raise serializers.ValidationError("Passwords must be same")
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError("Password must contain at least one special character")
        
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError("Password must contain at least one numeric digit")
        return data
    
    # def validate_name(self,value):


    def create(self, validated_data):
        
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            
           **validated_data
        )
        return user
    
class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','email','phone']

# class ChangePasswordSerializer(serializers.Serializer):
#     new_password = serializers.CharField()
    
#     def validate(self, value):
#         print("serializer")
#         print("Validating new_password:", value)
        # if len(value) < 8:
        #     raise serializers.ValidationError("Password must be at least 8 characters long")
        
        # if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
        #     raise serializers.ValidationError("Password must contain at least one special character")
        
        # if not any(char.isdigit() for char in value):
        #     raise serializers.ValidationError("Password must contain at least one numeric digit")
#         return value

