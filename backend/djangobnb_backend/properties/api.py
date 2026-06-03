from django.http import JsonResponse
from rest_framework.decorators import api_view,authentication_classes,permission_classes
from .forms import PropertyForm
from .models import Property
from .serializers import PropertySerializer
from .serializers import PropertiesDetailSerializer

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_list(request):
    properties = Property.objects.all()
    serializer = PropertySerializer(properties, many=True)
    return JsonResponse({
        'data': serializer.data
    }) 

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_detail(request, property_id):
    try:
        property = Property.objects.get(id=property_id)
        serializer = PropertiesDetailSerializer(property)
        return JsonResponse({
            'data': serializer.data
        })
    except Property.DoesNotExist:
        return JsonResponse({
            'error': 'Property not found'
        }, status=404)

@api_view(['POST'])
def create_property(request):
    form = PropertyForm(request.POST, request.FILES)
    if form.is_valid():
        property = form.save(commit=False)
        property.landlord = request.user
        property.save()
        serializer = PropertySerializer(property)
        return JsonResponse({
            'success': True,
            'data': serializer.data
        })
    else:
        return JsonResponse({
            'success': False,
            'errors': form.errors
        })