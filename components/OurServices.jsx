import { LucideArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';

function OurServices() {
  const router = useRouter();
  return (
    <div className='bg-[#fefae060]'>
      <div className='flex flex-col items-center gap-10 border-solid bg-[#ffffffa3] px-4 md:px-8 pb-5 pt-16 mt-10 mb-10 mx-4 md:mx-12 lg:mx-24 rounded-3xl shadow-lg transition-all duration-300 ease-in-out'>
        <span className='bg-[#7cc4f851] text-[#4B8EBF] rounded-lg py-2 px-3 font-generalMedium transition-all duration-300 ease-in-out text-sm md:text-base'>
          OUR SERVICES
        </span>
        <div className='text-center transition-all duration-300 ease-in-out'>
          <h2 className='text-[#000000] font-filson text-2xl md:text-4xl lg:text-6xl'>
            One-stop solution for 
          </h2>
          <h2 className='text-[#000000] font-filson text-2xl md:text-4xl lg:text-6xl'>
            your delivery needs
          </h2>
        </div>

        <div className='text-center transition-all duration-300 ease-in-out'>
          <span className='font-generalRegular text-base md:text-lg lg:text-2xl'>
            A Trusted{' '}
            <span className='font-generalRegular text-[#9E3CE1] text-base md:text-lg lg:text-2xl'>
              delivery
            </span>{' '}
            partner,connecting all over India.
          </span>
        </div>

        {/* Service Cards for Small Screens */}
        <div className='grid grid-cols-2 gap-3 md:hidden mb-6 mt-6 mx-2 md:mx-8 md:px-12 lg:px-56 transition-all duration-300 ease-in-out'>
          <div className='flex flex-col items-center transition-all duration-300 ease-in-out'>
            <div className='bg-[#F8EBAB] h-36 w-36 md:h-60 md:w-60 rounded-2xl flex justify-center items-center transition-all duration-300 ease-in-out'>
              <Image src={'/images/groupimage.png'} height={140} width={140} alt="Pickup & Drop" />
            </div>
            <div className='w-36 md:w-60 mt-1 hover:cursor-pointer transition-all duration-300 ease-in-out' onClick={() => router.replace('/Pickup-and-drop')}>
              <span className='flex flex-row justify-between bg-black rounded-2xl p-1'>
                <span className='font-generalRegular text-white py-2 px-2 space-x-1 text-sm'>
                  Pickup & Drop
                </span>
                <Button className="rounded-full bg-[#9E3CE1] border-spacing-1 p-1 hover:bg-[#9E3CE1] transition-all duration-300 ease-in-out">
                  <LucideArrowUpRight />
                </Button>
              </span>
            </div>
          </div>
          
          <div className='flex flex-col items-center transition-all duration-300 ease-in-out'>
            <div className='bg-[#F8EBAB] h-36 w-36 md:h-60 md:w-60 rounded-2xl flex justify-center items-center transition-all duration-300 ease-in-out'>
              <Image src={'/images/delivery.png'} height={48} width={120} alt="Intercity Courier" />
            </div>
            <div className='w-36 md:w-60 mt-1 hover:cursor-pointer transition-all duration-300 ease-in-out' onClick={() => router.replace('/courier')}>
              <span className='flex flex-row justify-between bg-black rounded-2xl p-1'>
                <span className='font-generalRegular text-white py-2 px-2 space-x-1 text-xs'>
                  Intercity Courier
                </span>
                <Button className="rounded-full bg-[#9E3CE1] border-spacing-1 p-1 hover:bg-[#9E3CE1] transition-all duration-300 ease-in-out" onClick={() => router.replace('/courier')}>
                  <LucideArrowUpRight />
                </Button>
              </span>
            </div>
          </div>
        </div>

        {/* Service Cards for Larger Screens */}
        <div className='hidden md:flex flex-col md:flex-row gap-7 mb-8 mt-8 mx-4 md:mx-8 md:px-12 lg:px-56 transition-all duration-300 ease-in-out'>
          <div className='flex flex-col items-center transition-all duration-300 ease-in-out'>
            <div className='bg-[#F8EBAB] h-40 w-40 md:h-60 md:w-60 rounded-2xl flex justify-center items-center transition-all duration-300 ease-in-out'>
              <Image src={'/images/groupimage.png'} height={200} width={200} alt="Pickup & Drop" />
            </div>
            <div className='w-40 md:w-60 mt-0 hover:cursor-pointer transition-all duration-300 ease-in-out' onClick={() => router.replace('/Pickup-and-drop')}>
              <span className='flex flex-row justify-between bg-black rounded-2xl p-2'>
                <span className='font-generalRegular text-white py-2 px-2 space-x-1 text-base md:text-lg sm:text-xs'>
                  Pickup & Drop
                </span>
                <Button className="rounded-full bg-[#9E3CE1] border-spacing-1 p-2 hover:bg-[#9E3CE1] transition-all duration-300 ease-in-out">
                  <LucideArrowUpRight />
                </Button>
              </span>
            </div>
          </div>
          <div className='flex flex-col items-center transition-all duration-300 ease-in-out'>
            <div className='bg-[#F8EBAB] h-40 w-40 md:h-60 md:w-60 rounded-2xl flex justify-center items-center transition-all duration-300 ease-in-out'>
              <Image src={'/images/delivery.png'} height={60} width={150} alt="Intercity Courier" />
            </div>
            <div className='w-40 md:w-60 mt-0 hover:cursor-pointer transition-all duration-300 ease-in-out' onClick={() => router.replace('/courier')}>
              <span className='flex flex-row justify-between bg-black rounded-2xl p-2'>
                <span className='font-generalRegular text-white py-2 px-2 space-x-1 text-base md:text-lg'>
                  Intercity Courier
                </span>
                <Button className="rounded-full bg-[#9E3CE1] border-spacing-1 p-2 hover:bg-[#9E3CE1] transition-all duration-300 ease-in-out" onClick={() => router.replace('/courier')}>
                  <LucideArrowUpRight />
                </Button>
              </span>
            </div>
          </div>
          <div className='flex flex-col items-center transition-all duration-300 ease-in-out'>
            <div className='bg-[#F8EBAB] h-40 w-40 md:h-60 md:w-60 rounded-2xl flex justify-center items-center transition-all duration-300 ease-in-out'>
              <Image src={'/images/clock.png'} height={110} width={194} alt="API Integration" />
            </div>
            <div className='w-40 md:w-60 mt-0 hover:cursor-pointer transition-all duration-300 ease-in-out' onClick={() => router.replace('/businesses')}>
              <span className='flex flex-row justify-between bg-black rounded-2xl p-2'>
                <span className='font-generalRegular text-white py-2 px-2 space-x-1 text-base md:text-lg'>
                  Convenient Time slot
                </span>
                <Button className="rounded-full bg-[#9E3CE1] border-spacing-1 p-2 hover:bg-[#9E3CE1] transition-all duration-300 ease-in-out">
                  <LucideArrowUpRight />
                </Button>
              </span>
            </div>
          </div>
          <div className='flex flex-col items-center transition-all duration-300 ease-in-out'>
            <div className='bg-[#F8EBAB] h-40 w-40 md:h-60 md:w-60 rounded-2xl flex justify-center items-center transition-all duration-300 ease-in-out'>
              <Image src={'/images/delman.png'} height={90} width={170} alt="Last-mile Delivery" />
            </div>
            <div className='w-40 md:w-60 mt-0 hover:cursor-pointer transition-all duration-300 ease-in-out' onClick={() => router.replace('/businesses')}>
              <span className='flex flex-row justify-between bg-black rounded-2xl p-2'>
                <span className='font-generalRegular text-white py-2 px-2 space-x-1 text-base md:text-lg'>
                  Last-mile Delivery
                </span>
                <Button className="rounded-full bg-[#9E3CE1] border-spacing-1 p-2 hover:bg-[#9E3CE1] transition-all duration-300 ease-in-out" onClick={() => router.replace('/businesses')}>
                  <LucideArrowUpRight />
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurServices;
