from django.urls import path

from dj_rest_auth.views import LoginView, LogoutView
from . import api

from .views import CustomRegisterView

urlpatterns = [
    path('register/', CustomRegisterView.as_view(), name='rest_register'),
    path('login/', LoginView.as_view(), name='rest_login'),
    path('logout/', LogoutView.as_view(), name='rest_logout'),
    path('myreservations/', api.reservations_list, name='reservations-list'),
    path('<uuid:pk>/', api.landlord_detail, name='landlord-detail'),
]