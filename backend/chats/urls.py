from django.urls import path
from .views import GetMessages, GetChatList, GetReceiverDetails, GetCourseDetails, GetCommunityMessages

urlpatterns = [
    path('get_messages/', GetMessages.as_view(), name="get_messages"),
    path('get_community_messages/', GetCommunityMessages.as_view(), name="get_community_messages"),
    path('get_chat_list/', GetChatList.as_view(), name='get_chat_list'),
    path('get_receiver_details/', GetReceiverDetails.as_view(), name="get_reciever_details"),
    path('get_course_details/', GetCourseDetails.as_view(), name="get course details"),
]