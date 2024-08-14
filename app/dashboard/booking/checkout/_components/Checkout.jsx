"use client";
import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import {
  pickupLocationState,
  dropLocationState,
  stopsState,
  pickupCoordsState,
  dropCoordsState,
  dateState,
  timeState,
  weightState,
  itemDescriptionState,
  specialInstructionsState,
  paymentStatusState,
  amountState,
  statusState,
  paymentIdState,
  otpCodeState,
  walletState,
  orderTypeState,
  lengthState,
  heightState,
  widthState,
  routeState,
  receiverNameState,
  receiverNumberState,
  detailedPickupAddressState,
  detailedDropOffAddressState,
  detailedStopsAddressState,
} from '@/recoil/store';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import * as schema from '@/utils/schema';
import moment from 'moment';
import { eq, and } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { fetchTravelRouteAndDistance } from '@/utils/distance';

const generateOrderId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
  return `#UC${randomNum}`;
};

const formatLocationWithDetails = (location, details, coords) => {
  const { houseNo, floor, landmark } = details;
  let formattedLocation = '';

  if (houseNo) formattedLocation += `House No: ${houseNo}, `;
  if (floor) formattedLocation += `Floor: ${floor}, `;
  if (landmark) formattedLocation += `Landmark: ${landmark}, `;
  formattedLocation += `${location}`;

  return formattedLocation;
};

const Checkout = () => {
  const router = useRouter();
  const pickupLocation = useRecoilValue(pickupLocationState);
  const dropLocation = useRecoilValue(dropLocationState);
  const stops = useRecoilValue(stopsState);
  const pickupCoords = useRecoilValue(pickupCoordsState);
  const dropCoords = useRecoilValue(dropCoordsState);
  const date = useRecoilValue(dateState);
  const time = useRecoilValue(timeState);
  const weight = useRecoilValue(weightState);
  const itemDescription = useRecoilValue(itemDescriptionState);
  const specialInstructions = useRecoilValue(specialInstructionsState);
  const paymentStatus = useRecoilValue(paymentStatusState);
  const amount = useRecoilValue(amountState);
  const status = useRecoilValue(statusState);
  const paymentId = useRecoilValue(paymentIdState);
  const otpCode = useRecoilValue(otpCodeState);
  const wallet = useRecoilValue(walletState);
  const setPaymentStatus = useSetRecoilState(paymentStatusState);
  const setAmount = useSetRecoilState(amountState);
  const setStatus = useSetRecoilState(statusState);
  const setPaymentId = useSetRecoilState(paymentIdState);
  const setWallet = useSetRecoilState(walletState);
  const orderType = useRecoilValue(orderTypeState);
  const length = useRecoilValue(lengthState);
  const height = useRecoilValue(heightState);
  const width = useRecoilValue(widthState);
  const route = useRecoilValue(routeState);
  const setRoute = useSetRecoilState(routeState);
  const receiverName = useRecoilValue(receiverNameState);
  const receiverPhone = useRecoilValue(receiverNumberState);
  const detailedPickupAddress = useRecoilValue(detailedPickupAddressState);
  const detailedDropOffAddress = useRecoilValue(detailedDropOffAddressState);
  const detailedStopsAddress = useRecoilValue(detailedStopsAddressState);
  const { user } = useUser();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [inserted, setInserted] = useState(false);
  const [distance, setDistance] = useState(0); // State for distance

  const routeOptions = [
    { label: 'By Surface', basePrice: 55, gstRate: 0.18 },
    { label: 'By Air', basePrice: 120, gstRate: 0.18 },
  ];

  const fetchDistance = async (pickupCoords, dropCoords, stops) => {
    if (!pickupCoords || !dropCoords || !pickupCoords.latitude || !pickupCoords.longitude || !dropCoords.latitude || !dropCoords.longitude) {
      return 0;
    }
  
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
    // Create an array of all the coordinates: Pickup -> Stops -> Drop
    const coordinates = [
      `${pickupCoords.longitude},${pickupCoords.latitude}`,
      ...stops.map(stop => `${stop.location.longitude},${stop.location.latitude}`),
      `${dropCoords.longitude},${dropCoords.latitude}`,
    ].join(';');
  
    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?access_token=${accessToken}&geometries=geojson`;
  
    try {
      const response = await axios.get(url);
      if (response.data.trips && response.data.trips[0] && response.data.trips[0].distance !== undefined) {
        const distance = response.data.trips[0].distance / 1000; // Convert to kilometers
        return distance;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error fetching optimized distance from Mapbox:', error);
      return 0;
    }
  };
  

  useEffect(() => {
    const fetchWalletAmount = async () => {
      try {
        const email = user?.primaryEmailAddress?.emailAddress;
        const fetchedUser = await db
          .select()
          .from(schema.UserData)
          .where(eq(schema.UserData.email, email))
          .execute();
        const walletAmount = parseFloat(fetchedUser[0].wallet).toFixed(2); // Parse and fix to 2 decimal places
        setWallet(walletAmount);
      } catch (error) {
        console.error('Error fetching wallet amount:', error);
      }
    };

    if (user) {
      fetchWalletAmount();
    }
  }, [user, setWallet]);

  useEffect(() => {
    const calculateFare = async () => {
      if (orderType === 'Pickup & Drop') {
        const basePrice = 40;
        const { distance } = await fetchTravelRouteAndDistance(pickupCoords, dropCoords, stops);
        setDistance(distance);
        let totalAmount = basePrice;
  
        if (distance > 2 && distance <= 10) {
          totalAmount += (distance - 2) * 16;
        } else if (distance > 10) {
          totalAmount += 8 * 16 + (distance - 10) * 10;
        }
  
        setAmount(parseFloat(totalAmount.toFixed(2))); // Fix to 2 decimal places
      } else if (orderType === 'Courier') {
        const selectedRoute = routeOptions.find(option => option.label === route);
        if (selectedRoute) {
          const volumetricWeight = (length * width * height) / 5000;
          const chargeableWeight = Math.max(weight, volumetricWeight);
          const baseAmount = chargeableWeight * selectedRoute.basePrice;
          const gstAmount = baseAmount * selectedRoute.gstRate;
          const totalAmount = (baseAmount + gstAmount).toFixed(2);
          setAmount(parseFloat(totalAmount));
        }
      }
    };
  
    calculateFare();
  }, [pickupCoords, dropCoords, stops, route, orderType, setAmount, length, width, height, weight]); // Add stops to the dependency array
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => console.error('Razorpay SDK could not be loaded.');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const updateUserWallet = async (email, newWalletAmount) => {
    try {
      await db
        .update(schema.UserData)
        .set({ wallet: newWalletAmount.toFixed(2) })
        .where(eq(schema.UserData.email, email))
        .execute();
    } catch (error) {
      console.error('Error updating wallet amount:', error);
    }
  };

  const insertOrderData = async ({
    order_id,
    email,
    pickupLocation,
    dropLocation,
    stops,
    pickupCoords,
    dropCoords,
    date,
    time,
    weight,
    itemDescription,
    specialInstructions,
    status,
    paymentStatus,
    amount,
    paymentId,
    otp,
    phone = '',
    order_type,
    length,
    height,
    width,
    route,
    shipping_service = '',
    Tracking_number = '',
    Tracking_link = '',
    receiverName,
    receiverPhone,
  }) => {
    try {
      const createdAt = moment().format('YYYY-MM-DD');
      console.log('Inserting order data with ID:', order_id);

      const existingOrder = await db
        .select()
        .from(schema.OrderData)
        .where(and(
          eq(schema.OrderData.userEmail, email),
          eq(schema.OrderData.pickupLocation, pickupLocation),
          eq(schema.OrderData.dropLocation, dropLocation),
          eq(schema.OrderData.date, date),
          eq(schema.OrderData.amount, amount)
        ))
        .execute();

      if (existingOrder.length > 0) {
        console.log('Order already exists');
        return null;
      }

      let fetchedUser = await db
        .select()
        .from(schema.UserData)
        .where(eq(schema.UserData.email, email))
        .execute();

      if (fetchedUser.length === 0) {
        console.log('User does not exist. Creating new user.');
        await db.insert(schema.UserData).values({
          email,
          phoneNumber: '',
          createdAt,
          savedAddresses: '{}',
          unicappCoins: 0,
        }).execute();

        fetchedUser = await db
          .select()
          .from(schema.UserData)
          .where(eq(schema.UserData.email, email))
          .execute();
      }

      const userRole = fetchedUser[0]?.role;

      const resp = await db.insert(schema.OrderData).values({
        order_id,
        userEmail: email,
        pickupLocation,
        dropLocation,
        stops: stops || '',
        pickupCoords: pickupCoords || '',
        dropCoords: dropCoords || '',
        date,
        time: time || '',
        weight: weight || '',
        itemDescription: itemDescription || '',
        specialInstructions: specialInstructions || '',
        status,
        paymentStatus,
        amount: amount,  // Storing the original amount before wallet deduction
        paymentId,
        otp,
        createdAt,
        phone,
        order_type,
        length: length || '',
        height: height || '',
        width: width || '',
        route: orderType === 'Pickup & Drop' ? 'By Surface' : route || '',
        shipping_service,
        Tracking_number,
        Tracking_link,
        user_role: userRole,
        receiverName,
        receiverPhone,
      }).execute();

      console.log('Order inserted successfully:', resp);
      return resp;
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Razorpay SDK is not loaded yet. Please try again.');
      return;
    }

    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const generatedOrderId = generateOrderId();
      let originalAmount = parseFloat(amount).toFixed(2); // Store the original amount before deduction and ensure it's fixed to 2 decimal places
      let amountToPay = originalAmount;

      // Append detailed addresses to the main addresses
      const finalPickupLocation = formatLocationWithDetails(pickupLocation, detailedPickupAddress, pickupCoords);
      const finalDropLocation = formatLocationWithDetails(dropLocation, detailedDropOffAddress, dropCoords);
      const finalStops = stops.map((stop, index) => formatLocationWithDetails(stop.address, detailedStopsAddress[index] || {}, stop.location));

      if (useWallet) {
        let walletFloat = parseFloat(wallet);
        if (walletFloat >= amountToPay) {
          await updateUserWallet(email, walletFloat - amountToPay);
          setWallet((walletFloat - amountToPay).toFixed(2));
          await insertOrderData({
            order_id: generatedOrderId,
            email,
            pickupLocation: finalPickupLocation,
            dropLocation: finalDropLocation,
            stops: JSON.stringify(finalStops),
            pickupCoords,
            dropCoords,
            date,
            time,
            weight,
            itemDescription,
            specialInstructions,
            status: 'Pending',
            paymentStatus: 'Paid',
            amount: originalAmount, // Save the original amount in the database
            paymentId: 'Wallet',
            otp: otpCode,
            order_type: orderType,
            length,
            height,
            width,
            route,
            receiverName,
            receiverPhone,
          });
          router.push('/dashboard/booking/confirmation');
          return;
        } else {
          amountToPay -= walletFloat;
          await updateUserWallet(email, 0);
          setWallet('0.00');
        }
      }

      const { data: order } = await axios.post('/api/new-order', { amount: amountToPay });
      const { id: order_id, currency, amount: amountInPaisa } = order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaisa,
        currency,
        name: 'Unicapp Logistics',
        description: 'Test Transaction',
        image: '/images/purpleonwhite.svg',
        order_id,
        handler: async (response) => {
          try {
            setPaymentStatus('Paid');
            setPaymentId(response.razorpay_payment_id);

            if (!inserted) {
              await insertOrderData({
                order_id: generatedOrderId,
                email,
                pickupLocation: finalPickupLocation,
                dropLocation: finalDropLocation,
                stops: JSON.stringify(finalStops),
                pickupCoords,
                dropCoords,
                date,
                time,
                weight,
                itemDescription,
                specialInstructions,
                status: 'Pending',
                paymentStatus: 'Paid',
                amount: originalAmount, // Save the original amount in the database
                paymentId: response.razorpay_payment_id,
                otp: otpCode,
                order_type: orderType,
                length,
                height,
                width,
                route,
                receiverName,
                receiverPhone,
              });

              setInserted(true);
            }

            router.push('/dashboard/booking/confirmation');
          } catch (error) {
            alert('Payment was successful, but there was an error updating the order status.');
          }
        },
        prefill: {
          name: user?.fullName || 'Guest',
          email: user?.primaryEmailAddress?.emailAddress || 'guest@example.com',
          contact: user?.phoneNumber || '',
        },
        theme: {
          color: '#9E3CE1',
        },
      };

      if (amountToPay > 0) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      alert('Something went wrong with the payment. Please try again.');
    }
  };

  return (
    <div className='p-10 translate-x-20 translate-y-20'>
      {orderType === 'Pickup & Drop' ? (
        <>
          <div className='mb-5 w-full'>
          <h2 className="text-base font-generalMedium text-[#8B14CC] translate-x-0.5">STEP 6/6</h2>
          <div className="flex mt-4 mb-9 -translate-x-1.5">
            <div className="w-14 h-1 bg-[#8B14CC] rounded mx-2"></div>
            <div className="w-14 h-1 bg-[#8B14CC] rounded mx-2"></div>
            <div className="w-14 h-1 bg-[#8B14CC] rounded mx-2"></div>
            <div className="w-14 h-1 bg-[#8B14CC] rounded mx-2"></div>
            <div className="w-14 h-1 bg-[#8B14CC] rounded mx-2"></div>
            <div className="w-14 h-1 bg-[#8B14CC] rounded mx-2"></div>
          </div>
        </div>
          <h2 className='text-5xl font-generalSemiBold'>Pricing</h2>
          <div className='mt-5 flex flex-col w-96 gap-3'>
            <div className=' flex flex-row justify-between'>
              <p>Trip Fare ({distance.toFixed(1)} kms)</p>
              <p> ₹{amount}</p> {/* Amount is already fixed to 2 decimal places */}
            </div>
            <div className=' flex flex-row justify-between'>
              <span>Standard fee (upto 2.0 kms)</span>
              <p>₹40</p>
            </div>
            {distance > 2 && distance <= 10 && (
              <div className=' flex flex-row justify-between'>
                <span>From 2.0 to 10.0 kms</span>
                <p>₹10/km</p>
              </div>
            )}
            {distance > 10 && (
              <>
                <div className=' flex flex-row justify-between'>
                  <span>From 2.0 to 10.0 kms</span>
                  <p>₹10/km</p>
                </div>
                <div className=' flex flex-row justify-between'>
                  <span>Every additional km (rate/km)</span>
                  <p>₹16/km</p>
                </div>
              </>
            )}
            <div className=' flex flex-row justify-between'>
              <span>Total</span>
              <p>₹{amount}</p> {/* Amount is already fixed to 2 decimal places */}
            </div>
          </div>
          <div className='flex items-center mt-5'>
            <input
              type='checkbox'
              id='useWallet'
              checked={useWallet}
              onChange={() => setUseWallet(!useWallet)}
              className='mr-2'
            />
            <Label htmlFor='useWallet'>Use credits from my wallet (₹{wallet})</Label> {/* Wallet is already fixed to 2 decimal places */}
          </div>
        </>
      ) : (
        <>
          <div className="mb-5">
            <h2 className="text-base font-generalMedium text-[#8B14CC] translate-x-0.5">STEP 5/5</h2>
            <div className="flex mt-4 mb-9 -translate-x-1.5">
              <div className="w-16 h-1 bg-[#8B14CC] rounded mx-2"></div>
              <div className="w-16 h-1 bg-[#8B14CC] rounded mx-2"></div>
              <div className="w-16 h-1 bg-[#8B14CC] rounded mx-2"></div>
              <div className="w-16 h-1 bg-[#8B14CC] rounded mx-2"></div>
              <div className="w-16 h-1 bg-[#8B14CC] rounded mx-2"></div>
            </div>
          </div>
          <h2 className='text-5xl font-generalSemiBold'>Pricing</h2>
          <div className="mt-5 w-96 rounded-2xl">
            {routeOptions.map((option) => {
              const gst = option.basePrice * option.gstRate;
              const totalPrice = (option.basePrice + gst).toFixed(2);
              return (
                <div
                  key={option.label}
                  className={`flex flex-col items-start p-4 mb-4 border ${route === option.label ? 'border-[#461364] border-2' : 'border-gray-300'} rounded-2xl cursor-pointer`}
                  onClick={() => {
                    setRoute(option.label);
                    setAmount(totalPrice);
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 mr-4 ${route === option.label ? 'bg-[]' : 'bg-gray-300'} rounded-sm flex items-center justify-center translate-x-80 -translate-y-8`}>
                      {route === option.label && <div className="w-full h-6 bg-[#8D26CA] rounded-sm text-white"><Check size={23} strokeWidth={1.75} /></div>}
                    </div>
                    <div>
                      <h3 className="text-sm font-generalMedium">{option.label}</h3>
                      <div className='flex flex-row gap-2 mt-2'>
                      <p className="text-2xl text-black">{`₹${totalPrice}`}</p><p className='text-xs text-black mt-2 text-opacity-50'> including GST charges</p>
                      </div>
                      <p className="text-base text-gray-500 mt-2">{`Delivery in ${option.delivery}`}</p>
                      <p className="text-xs text-black text-opacity-50">Same-day dispatch</p>
                    </div>
                  </div>
                  {route === option.label && (
                    <div className="mt-2 ml-10">
                      <div className="text-sm text-black text-opacity-75 mt-2 flex flex-col gap-3">
                        <div className='flex flex-row justify-between gap-10'>
                          <span>Courier charges:</span>
                          <span>₹{option.basePrice.toFixed(2)}</span>
                        </div>
                        <div className='flex flex-row justify between gap-24'>
                          <span>GST Charges:</span>
                          <span>{option.gstRate * 100}%</span>
                        </div>
                        <div className='flex flex-row justify between gap-32'>
                          <span>Total:</span>
                          <span>₹{totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className='flex items-center mt-5'>
            <input
              type='checkbox'
              id='useWallet'
              checked={useWallet}
              onChange={() => setUseWallet(!useWallet)}
              className='mr-2'
            />
            <Label htmlFor='useWallet'>Use credits from my wallet (₹{wallet})</Label> {/* Wallet is already fixed to 2 decimal places */}
          </div>
        </>
      )}
      <div className='mt-10 flex justify-start gap-3'>
        <Button
          className='py-6 px-4 rounded-xl border border-gray-300 bg-white text-black hover:bg-white hover:text-black'
          onClick={() => router.push('/dashboard/booking/verification')}
        >
          <span className='text-2xl rounded-2xl'><ChevronLeft size={20} /></span>
        </Button>
        <Button
          className='py-6 px-10 w-80 rounded-xl bg-[#8B14CC] text-white text-center hover:bg-[#8D26CA] hover:text-white'
          onClick={handlePayment}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
