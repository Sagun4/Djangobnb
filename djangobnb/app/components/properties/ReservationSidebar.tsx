'use client';
import{useState , useEffect} from 'react';
import DatePicker from '../forms/Calendar';
import { Range } from 'react-date-range';
import {format} from 'date-fns';
import apiService from '@/app/services/apiService';
import useLoginModal from '@/app/hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import {differenceInDays ,eachDayOfInterval } from 'date-fns';
import { da } from 'date-fns/locale';
const initialDateRange= {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

export type Property = {
    id: string;
    guests: number;
    price_per_night: number;
};

interface ReservationSidebarProps {
 userId: string | null,  
 property: Property;
}

const ReservationSidebar : React.FC<ReservationSidebarProps> = ({ property , userId }) => {
    const loginModal = useLoginModal();
    const router = useRouter();

    const price = parseFloat(String(property.price_per_night));
    const [fee, setFee] = useState<number>(0);
    const [nights, setNights] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    
    const [minDate, setMinDate] = useState<Date>(new Date());
    const [bookedDates, setBookedDates] = useState<Date[]>([]);

    const [guests, setGuests] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const guestsRange = Array.from({ length: property.guests }, (_, i) => i + 1);

    const performBooking = async () => {
        console.log('performBooking', userId);
        setError(null);

        if (userId) {
            if (dateRange.startDate && dateRange.endDate) {
                try {
                    const range = eachDayOfInterval({
                        start: dateRange.startDate,
                        end: dateRange.endDate
                    });
                    
                    const hasOverlap = range.some(date => 
                        bookedDates.some(bookedDate => 
                            date.getFullYear() === bookedDate.getFullYear() &&
                            date.getMonth() === bookedDate.getMonth() &&
                            date.getDate() === bookedDate.getDate()
                        )
                    );

                    if (hasOverlap) {
                        setError('This property is already booked for the selected dates.');
                        return;
                    }
                } catch (e) {
                    console.log('Error checking date overlap:', e);
                }

                const formData = new FormData();
                formData.append('guests', guests.toString());
                formData.append('start_date', format(dateRange.startDate, 'yyyy-MM-dd'));
                formData.append('end_date', format(dateRange.endDate, 'yyyy-MM-dd'));
                formData.append('number_of_nights', nights.toString());
                formData.append('total_price', totalPrice.toString());

                const response = await apiService.post(`/api/properties/${property.id}/book/`, formData);

                if (response.success) {
                    console.log('Booking successful');
                    router.push('/?booking_success=true');
                } else {
                    console.log('Something went wrong...');
                    setError(response.error || 'Something went wrong. Please try again.');
                }
            }
        } else {
            loginModal.onOpen();
        }
    }

    const _setDateRange = (selection :any) => {
        setError(null);
        const newStartDate = new Date(selection.startDate);
        const newEndDate = new Date(selection.endDate);

        if (newEndDate <= newStartDate) {
           newEndDate.setDate(newStartDate.getDate() + 1);
        }
        setDateRange({
          ...dateRange,
          startDate: newStartDate,
          endDate: newEndDate,
        });
    };

    const getReservations = async () => {
        const response = await apiService.get(`/api/properties/${property.id}/reservations/`);
        const reservations = response.data || [];

        let dates: Date[] = [];

        reservations.forEach((reservation: any) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.start_date + 'T00:00:00'),
                end: new Date(reservation.end_date + 'T00:00:00')
            });
            dates = [...dates, ...range];  
        })
        setBookedDates(dates);

    }

    useEffect(() => {
        getReservations();
    }, [property.id]);

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInDays(
                dateRange.endDate,
                dateRange.startDate
            );
            if (dayCount && price) {
                const _fee = ((price * dayCount) / 100) * 5;
                setFee(_fee);
                setTotalPrice(price * dayCount + _fee);
                setNights(dayCount);
            } else {
                const _fee = (price / 100) * 5;
                setFee(_fee);
                setTotalPrice(price + _fee);
                setNights(1);
            }
        }
    }, [dateRange, price]);
    return (
        <aside className="mt-6 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
            <h2 className="mb-5 text-2xl">${price.toFixed(2)} per night</h2>
            <DatePicker
                value={dateRange}
                onChange={(value) => _setDateRange(value.selection)}
                bookedDates={bookedDates}
            />
            <div className="mb-6 p-3 border border-gray-400 rounded-xl">
                <label className="mb-2 block font-bold text-xs">Guests</label>

                <select 
                value={guests}
                onChange={(e) => {
                    setGuests(parseInt(e.target.value));
                    setError(null);
                }}
                className="w-full -ml-1 text-xm">
                    {guestsRange.map((num) => (
                        <option key={num} value={num}>
                            {num} {num === 1 ? 'guest' : 'guests'}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-airbnb text-white rounded-xl text-sm font-semibold transition-all duration-300">
                    {error}
                </div>
            )}

            <div
                onClick={performBooking} 
            className="w-full mb-6 py-6 text-center text-white bg-airbnb hover:bg-airbnb-dark rounded-xl cursor-pointer">Book</div>

            <div className="mb-4 flex justify-between align-center">
                <p>${price.toFixed(2)} * {nights} nights</p>

                <p>${(price * nights).toFixed(2)}</p>
            </div>

            <div className="mb-4 flex justify-between align-center">
                <p>Djangobnb fee</p>

                <p>${fee.toFixed(2)}</p>
            </div>

            <hr />

            <div className="mt-4 flex justify-between align-center font-bold">
                <p>Total</p>

                <p>${totalPrice.toFixed(2)}</p>
            </div>
        </aside>
    )
}

export default ReservationSidebar;