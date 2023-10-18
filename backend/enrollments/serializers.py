from rest_framework import serializers
from .models import Enrollment, Payment

class EnrollmentSerializer(serializers.ModelSerializer):
    # enrollment_date = serializers.DateTimeField(format="%d %B %Y %I:%M %p")
    class Meta:
        model = Enrollment
        fields = "__all__"
        

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"