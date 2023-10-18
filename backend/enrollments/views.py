from datetime import datetime
from django.shortcuts import render
from rest_framework.views import APIView, Response
from courses.models import Course
from courses.serializers import CourseListViewSerializer
from .models import Enrollment,Payment
from .serializers import EnrollmentSerializer,PaymentSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import razorpay
import json
from django.conf import settings
from enrollments.models import Payment, Enrollment

# Create your views here.


class GetEnrollment(APIView):
    def get(self,request):
        user = request.user
        course_id = request.query_params.get('id')
        try:
            enrollment = Enrollment.objects.get(student_id=user.id, course_id=course_id)
            # If the enrollment exists, return True
            return Response({"enrollment": True})
        except Enrollment.DoesNotExist:
            # If the enrollment does not exist, return False
            return Response({"enrollment": False})
        except Exception as e:
            # Handle other exceptions (e.g., database errors) as needed
            print("Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Enroll(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        course_id = request.query_params.get('id')
        user = request.user
        
        try:
            course = Course.objects.get(id=course_id)
            print(course)
            try:
                existing_enrollment = Enrollment.objects.get(student_id=user.id, course_id=course_id)
                return Response({"error":"Already enrolled"})
            except:
                if course.is_free:
                    data = {
                        'student_id': user.id,
                        'course_id':course.id,
                        'enrollment_date':datetime.now()
                    }
                    print(data)
                    serializer = EnrollmentSerializer(data=data)
                    if serializer.is_valid():
                        print("Free course valide serializer")
                        serializer.save()
                        print(serializer.data)
                        return Response(serializer.data, status= status.HTTP_200_OK)
                else:
                    data = self.start_payment(course,user)
                    return Response(data)
        except Exception as e :
            return Response({"message": str(e)})
            # self.start_payment(course,user)
        
        # return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
        return Response({"message":'error'})

    # def start_payment(self,course,user):
    #     print("entered start payment")
    #     course_name = course.title
    #     amount = course.enrollment_fee

    #     client = razorpay.Client(auth=(settings.PUBLIC_KEY, settings.SECRET_KEY))


    #     payment = client.order.create({"amount": int(amount), 
    #                                "currency": "INR", 
    #                                "payment_capture": "1"})
    #     print("payment : ",payment)
        
    #     enrollment = Enrollment.objects.create(student_id = user,
    #                                            course_id = course,
    #                                            enrollment_date = datetime.now())
        
    #     serializer = EnrollmentSerializer(enrollment)
    #     print("serializer data : ",serializer.data)
    #     print("serializer error : ",serializer.errors)

    #     data = {
    #         "payment":payment,
    #         "enrollment":serializer.data
    #     }
    #     print("final data : ",data)

    #     return Response(data)
    def start_payment(self, course, user):
        print("inside start payment")
        try:
            print("inside start payment try block")
            course_name = course.title
            amount = course.enrollment_fee

            client = razorpay.Client(auth=(settings.PUBLIC_KEY, settings.SECRET_KEY))
            print("client : ",client)

            payment = client.order.create({
                "amount": int(amount)*100,
                "currency": "INR",
                "payment_capture": 1
            })
            print("payment : ",payment)

            start_payment_data = {
                "payment": payment,
                "course_id": course.id
            }
            print("data : ", start_payment_data)


            #To save payment information in the database.
            payment_data = {
                "amount":amount,
                "payment_id":payment['id'],
                "payment_date":datetime.now().date(),
                "payment_method":"Razorpay",
                "student_id":user.id,
                "course_id":course.id
            }

            payment_serializer = PaymentSerializer(data=payment_data)
            if payment_serializer.is_valid():
                payment_serializer.save()
            else:
                print(payment_serializer.errors)


            return (start_payment_data)
        except Exception as e:
            print("Exception in start_payment:", str(e)) 
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# class PaymentSuccess(APIView):
#     def post(self,request):
#         res = json.loads(request.data["response"])

#         enroll_id = ""
#         raz_pay_id = ""
#         raz_signature = ""

#         for key in res.keys():
#             if key == 'razorpay_order_id':
#                 enroll_id = res[key]
#             elif key == 'razorpay_payment_id':
#                 raz_pay_id = res[key]
#             elif key == 'razorpay_signature':
#                 raz_signature = res[key]
#         data = {
#             'razorpay_order_id': enroll_id,
#             'razorpay_payment_id': raz_pay_id,
#             'razorpay_signature': raz_signature
#         }
#         print(data)

#         return Response(data)

class PaymentSuccess(APIView):
    def post(self, request):
        try:
            user = request.user
            course_id = request.query_params.get('id')
            course = Course.objects.get(id=course_id)
        except:
            return Response({"message":"course or user error"})

        try:
            
            res = json.loads(request.data["response"])
            enroll_id = res.get('razorpay_order_id')
            raz_pay_id = res.get('razorpay_payment_id')
            raz_signature = res.get('razorpay_signature')

            # Verify the payment and update enrollment status as needed

            data = {
                'razorpay_order_id': enroll_id,
                'razorpay_payment_id': raz_pay_id,
                'razorpay_signature': raz_signature
                }
            
            client = razorpay.Client(auth=(settings.PUBLIC_KEY, settings.SECRET_KEY))

            check = client.utility.verify_payment_signature(data)
            print(check)

            if check :
                payment = Payment.objects.get(payment_id=enroll_id)
                print("payment",payment)
                payment.payment_status = True
                payment.pay_id_to_refund = raz_pay_id
                payment.save()
                enrollment_data = {
                    "student_id":user.id,
                    "course_id":course.id,
                    'enrollment_date':datetime.now(),
                    "payment":payment.id
                }
                enroll_serializer = EnrollmentSerializer(data=enrollment_data)
                if enroll_serializer.is_valid():
                    enroll_serializer.save()
                else:
                    print(enroll_serializer.errors)
                




                return Response({"message": "Payment success"}, status=status.HTTP_200_OK)
            else:
                print("Redirect to error url or error page")
                return Response({'error': 'Something went wrong'})
            
            
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GetEnrolledCourses(APIView):
    def get(self, reqest):
        user = reqest.user
        
        enrollments = Enrollment.objects.filter(student_id=user.id)
        enrollment_serializer = EnrollmentSerializer(enrollments, many=True)
        courses = []
        for enrollment in enrollment_serializer.data:
            course = Course.objects.get(id=enrollment['course_id'])
            courses.append(course)
        course_serializer = CourseListViewSerializer(courses, many = True)
        return Response(course_serializer.data)


def PaymentRefund(course_id):
    client = razorpay.Client(auth=(settings.PUBLIC_KEY, settings.SECRET_KEY))
    try:
        course = Course.objects.get(id=course_id)
        print(course)
        if not course.is_free:
            payments = Payment.objects.filter(course_id=course_id)
            print(payments)
            for payment in payments:
                print(payment.pay_id_to_refund)
                refund = client.payment.refund(payment.pay_id_to_refund, {"amount":payment.amount*100})
                # print(refund)
                if refund.get('status') == "processed":
                    print("refund success")
                    enroll = Enrollment.objects.get(payment=payment.id)
                    print(enroll)
                    enroll.delete()
                    payment.delete()
                else:
                    print("refund failed")
    except Exception as e:
        print(e)



