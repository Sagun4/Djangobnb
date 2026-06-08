from django.urls import path
from . import api

urlpatterns = [
    path('', api.property_list, name='property-list'),
    path('create/', api.create_property, name='create-property'),
    path('create', api.create_property),
    path('<uuid:property_id>/', api.property_detail, name='property-detail'),
    path('<uuid:property_id>', api.property_detail),
    path('<uuid:pk>/book/', api.book_property, name='book-property'),
    path('<uuid:pk>/book', api.book_property),
    path('<uuid:property_id>/reservations/', api.property_reservations, name='property-reservations'),
    path('<uuid:property_id>/reservations', api.property_reservations),
    path('<uuid:pk>/toggle_favourite/', api.toggle_favourite, name='toggle-favourite'),
    path('<uuid:pk>/toggle_favourite', api.toggle_favourite),
]