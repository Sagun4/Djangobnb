from django.db.models import Exists, OuterRef
from django.http import JsonResponse
from rest_framework.decorators import api_view,authentication_classes,permission_classes


from .forms import PropertyForm
from .models import Property, Reservation
from .serializers import PropertySerializer
from .serializers import PropertiesDetailSerializer
from .serializers import ReservationListSerializer
from useraccount.models import User
from rest_framework_simplejwt.tokens import AccessToken

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_list(request):

    try:
        token = request.META['HTTP_AUTHORIZATION'].split('Bearer ')[1]
        token = AccessToken(token)
        user_id = token.payload['user_id']
        user = User.objects.get(id=user_id)
    except Exception as e:
        print('Error decoding token:', e)
        user = None  
    print('User:', user)

    favourites = []
    properties = Property.objects.all().annotate(
        is_booked_annotated=Exists(Reservation.objects.filter(property=OuterRef('pk')))
    )

    favorites = request.GET.get('favorites', '')
    landlord_id = request.GET.get('landlord_id')

    country = request.GET.get('country', '')
    category = request.GET.get('category', '')
    checkin_date = request.GET.get('checkIn', '')
    checkout_date = request.GET.get('checkOut', '')
    bedrooms = request.GET.get('numBedrooms', '')
    guests = request.GET.get('numGuests', '')
    bathrooms = request.GET.get('numBathrooms', '')

    print('country', country)

    if checkin_date and checkout_date:
        conflicting_properties = Reservation.objects.filter(
            start_date__lte=checkout_date,
            end_date__gte=checkin_date
        ).values_list('property_id', flat=True)

        properties = properties.exclude(id__in=conflicting_properties)

    if landlord_id:
        properties = properties.filter(landlord__id=landlord_id)

    if favorites and user:
        properties = properties.filter(favourited=user)

    if guests:
        properties = properties.filter(guests__gte=guests)
    
    if bedrooms:
        properties = properties.filter(bedrooms__gte=bedrooms)
    
    if bathrooms:
        properties = properties.filter(bathrooms__gte=bathrooms)
    
    if country:
        properties = properties.filter(country=country)
    
    if category and category != 'undefined':
        properties = properties.filter(category=category)
        
    if user:
        favourites = list(user.favourited_properties.values_list('id', flat=True))

    serializer = PropertySerializer(properties, many=True)       
         
    return JsonResponse({
        'data': serializer.data,
        'favourites': favourites
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
    
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_reservations(request, property_id):    
    try:
        property = Property.objects.get(id=property_id)
        reservations = Reservation.objects.filter(property=property)
        serializer = ReservationListSerializer(reservations, many=True)
        return JsonResponse({
            'data': serializer.data
        }, safe=False)
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
    
@api_view(['POST'])
def book_property(request, pk):
    try:
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        number_of_nights = request.data.get('number_of_nights')
        guests = request.data.get('guests')
        total_price = request.data.get('total_price')

        property = Property.objects.get(pk=pk)

        # Check for date conflicts (overlap check)
        conflicting_reservations = Reservation.objects.filter(
            property=property,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        
        if conflicting_reservations.exists():
            return JsonResponse({
                'success': False,
                'error': 'This property is already booked for the selected dates.'
            })

        Reservation.objects.create(
            property=property,
            guest=request.user,
            start_date=start_date,
            end_date=end_date,
            number_of_nights=number_of_nights,
            guests=guests,
            total_price=total_price,
            created_by=request.user
        )

        # Send notification to the landlord
        if property.landlord:
            try:
                from channels.layers import get_channel_layer
                from asgiref.sync import async_to_sync
                channel_layer = get_channel_layer()
                if channel_layer:
                    async_to_sync(channel_layer.group_send)(
                        f'user_{str(property.landlord.id)}',
                        {
                            'type': 'booking_notification',
                            'property_id': str(property.id),
                            'property_title': property.title,
                            'guest_name': request.user.name or request.user.email,
                        }
                    )
            except Exception as e:
                print('Error sending booking notification to landlord:', e)

        return JsonResponse({
            'success': True
        })

    except Exception as e:
        print('Error booking property:', e)
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)
    

@api_view(['POST'])
def toggle_favourite(request, pk):
    try:
        property = Property.objects.get(pk=pk)
        if request.user in property.favourited.all():
            property.favourited.remove(request.user)
            favourited = False
        else:
            property.favourited.add(request.user)
            favourited = True

        return JsonResponse({
            'success': True,
            'favourited': favourited
        })

    except Exception as e:
        print('Error toggling favourite:', e)
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)