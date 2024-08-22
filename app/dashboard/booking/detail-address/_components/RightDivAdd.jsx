"use client";
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  detailedPickupAddressState,
  detailedDropOffAddressState,
  stopsState,
  detailedStopsAddressState,
} from '@/recoil/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function RightDivAdd() {
  const [detailedPickupAddress, setDetailedPickupAddress] = useRecoilState(detailedPickupAddressState);
  const [detailedDropOffAddress, setDetailedDropOffAddress] = useRecoilState(detailedDropOffAddressState);
  const [stops] = useRecoilState(stopsState);
  const [detailedStopsAddress, setDetailedStopsAddress] = useRecoilState(detailedStopsAddressState);

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateFields = () => {
    const newErrors = {};

    if (!detailedPickupAddress.houseNo) {
      newErrors.pickupHouseNo = 'House number for Pickup is required';
    }

    if (!detailedDropOffAddress.houseNo) {
      newErrors.dropOffHouseNo = 'House number for Drop-off is required';
    }

    stops.forEach((_, index) => {
      if (!detailedStopsAddress[index]?.houseNo) {
        newErrors[`stopHouseNo-${index}`] = `House number for Stop ${index + 1} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStopDetailsChange = (index, field, value) => {
    const updatedStopsDetails = [...detailedStopsAddress];
    
    if (!updatedStopsDetails[index]) {
      updatedStopsDetails[index] = { houseNo: '', floor: '', landmark: '' };
    }
    
    updatedStopsDetails[index] = {
      ...updatedStopsDetails[index],
      [field]: value,
    };
    
    setDetailedStopsAddress(updatedStopsDetails);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`stopHouseNo-${index}`]: '',
    }));
  };
  
  const handleContinue = () => {
    if (validateFields()) {
      router.push('/dashboard/booking/date-time');
    }
  };

  return (
    <div className="flex flex-col justify-center bg-white items-start h-full p-5 sm:p-8 lg:p-10 w-full max-w-3xl mx-auto lg:pt-16">
      <div className="mb-5 w-full">
        <h2 className="text-base font-generalMedium text-[#8B14CC]">STEP 2/6</h2>
        <div className="flex mt-4 mb-6">
          <div className="w-14 h-1 bg-[#8B14CC] rounded mx-1"></div>
          <div className="w-14 h-1 bg-[#8B14CC] rounded mx-1"></div>
          <div className="w-14 h-1 bg-gray-300 rounded mx-1"></div>
          <div className="w-14 h-1 bg-gray-300 rounded mx-1"></div>
          <div className="w-14 h-1 bg-gray-300 rounded mx-1"></div>
          <div className="w-14 h-1 bg-gray-300 rounded mx-1"></div>
        </div>
        <h1 className="text-3xl font-bold">Add more address details</h1>
        <p className="mt-2 text-lg font-generalRegular">Enter house number, floor, etc.</p>
      </div>

      <div className="w-full mt-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block mb-2 font-generalRegular">Pickup details</label>
          <Input
            placeholder="House no."
            className="mb-3 w-full h-12 rounded-xl"
            value={detailedPickupAddress.houseNo}
            onChange={(e) => {
              setDetailedPickupAddress({ ...detailedPickupAddress, houseNo: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, pickupHouseNo: '' }));
            }}
          />
          {errors.pickupHouseNo && <p className="text-red-500">{errors.pickupHouseNo}</p>}
          <Input
            placeholder="Floor"
            className="mb-3 w-full h-12 rounded-xl"
            value={detailedPickupAddress.floor}
            onChange={(e) => setDetailedPickupAddress({ ...detailedPickupAddress, floor: e.target.value })}
          />
          <Input
            placeholder="Nearby landmark (optional)"
            className="w-full h-12 rounded-xl"
            value={detailedPickupAddress.landmark}
            onChange={(e) => setDetailedPickupAddress({ ...detailedPickupAddress, landmark: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2 font-generalRegular">Drop-off details</label>
          <Input
            placeholder="House no."
            className="mb-3 w-full h-12 rounded-xl"
            value={detailedDropOffAddress.houseNo}
            onChange={(e) => {
              setDetailedDropOffAddress({ ...detailedDropOffAddress, houseNo: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, dropOffHouseNo: '' }));
            }}
          />
          {errors.dropOffHouseNo && <p className="text-red-500">{errors.dropOffHouseNo}</p>}
          <Input
            placeholder="Floor"
            className="mb-3 w-full h-12 rounded-xl"
            value={detailedDropOffAddress.floor}
            onChange={(e) => setDetailedDropOffAddress({ ...detailedDropOffAddress, floor: e.target.value })}
          />
          <Input
            placeholder="Nearby landmark (optional)"
            className="w-full h-12 rounded-xl"
            value={detailedDropOffAddress.landmark}
            onChange={(e) => setDetailedDropOffAddress({ ...detailedDropOffAddress, landmark: e.target.value })}
          />
        </div>

        {stops.map((_, index) => (
          <div className="col-span-2" key={index}>
            <label className="block mb-2 font-generalRegular">{`Delivery Point ${index + 1} details`}</label>
            <Input
              placeholder="House no."
              className="mb-3 w-full h-12 rounded-xl"
              value={detailedStopsAddress[index]?.houseNo || ''}
              onChange={(e) => handleStopDetailsChange(index, 'houseNo', e.target.value)}
            />
            {errors[`stopHouseNo-${index}`] && <p className="text-red-500">{errors[`stopHouseNo-${index}`]}</p>}
            <Input
              placeholder="Floor"
              className="mb-3 w-full h-12 rounded-xl"
              value={detailedStopsAddress[index]?.floor || ''}
              onChange={(e) => handleStopDetailsChange(index, 'floor', e.target.value)}
            />
            <Input
              placeholder="Nearby landmark (optional)"
              className="w-full h-12 rounded-xl"
              value={detailedStopsAddress[index]?.landmark || ''}
              onChange={(e) => handleStopDetailsChange(index, 'landmark', e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-start mt-10 gap-3 w-full">
        <Button
          variant="outline"
          className="py-4 px-4 rounded-xl border border-gray-300 text-gray-600"
          onClick={(e) => {
            e.preventDefault();
            router.push('/dashboard/booking/location');
          }}
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          className="py-4 px-6 rounded-xl w-96 bg-[#8B14CC] text-white text-center hover:bg-[#8D26CA] hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            handleContinue();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default RightDivAdd;
