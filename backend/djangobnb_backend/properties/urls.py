from django.urls import path
from . import api

urlpatterns = [
 path('', api.property_list, name='property-list'),
 path('create/', api.create_property, name='create-property'),
 path('<uuid:property_id>/', api.property_detail, name='property-detail'),

]