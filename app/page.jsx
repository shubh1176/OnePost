// pages/index.js (Home Page)
"use client";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from "../components/Header";

// Load non-essential components lazily to improve loading performance
const Faq = dynamic(() => import("@/components/Faq"));
const Footer = dynamic(() => import("@/components/Footer"));
const OurServices = dynamic(() => import("@/components/OurServices"));
const WhyUs = dynamic(() => import("@/components/WhyUs"));

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 justify-center bg-[#F1EDEA]">
      <div className="relative">
        <Header />
        <div className="text-center bg-gradient-to-b h-auto md:h-[90vh] from-[#8D14CE] to-[#470A68] text-white pb-16 md:pb-24 pt-8 rounded-br-3xl rounded-bl-3xl flex flex-col justify-center items-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex flex-col gap-2 mb-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-filson">
                <span className="bg-[#F5E27B] text-center pt-1 px-2 sm:pt-2 sm:px-3 lg:pt-3 lg:px-4 font-filson inline-flex rounded-2xl text-[#202020]">
                  Deliver
                </span>{" "}
                any item, any time
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-filson">with just a few clicks!</h1>
            </div>
            <p className="mt-4 sm:mt-6 text-md sm:text-lg md:text-xl lg:text-2xl font-generalLight">
              No need to step out, ship with ease using our <br className="hidden md:block" /> doorstep pickup and delivery service.
            </p>
          </div>

          {/* Responsive Image Loading and Positioning */}
          <div className="absolute top-24 sm:top-32 md:top-44 left-24 sm:left-32 md:left-64 w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20 transform -translate-x-1/2 rotate-0">
            <Image src={'/images/flower.svg'} alt="Flower Bouquet" fill objectFit="contain" priority />
          </div>
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-9 right-32 sm:right-48 md:right-96 w-8 sm:w-10 md:w-12 lg:w-16 h-8 sm:h-10 md:h-12 lg:h-16 transform translate-x-1/2 rotate-12">
            <Image src={'/images/lunchbox.svg'} alt="Lunch Box" fill objectFit="contain" priority />
          </div>
          <div className="absolute bottom-16 sm:bottom-24 md:bottom-44 left-16 sm:left-20 md:left-32 w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20 transform -translate-x-1/2 rotate-12">
            <Image src={'/images/book.svg'} alt="Book" fill objectFit="contain" priority />
          </div>
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-48 sm:left-64 md:left-96 w-12 sm:w-16 md:w-20 lg:w-28 h-12 sm:h-16 md:h-20 lg:h-28 transform -translate-x-1/2 rotate-12">
            <Image src={'/images/charger.svg'} alt="Charger" fill objectFit="contain" priority />
          </div>
          <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-24 sm:left-32 md:left-56 w-10 sm:w-12 md:w-16 lg:w-24 h-10 sm:h-12 md:h-16 lg:h-24 transform -translate-x-1/2 rotate-0">
            <Image src={'/images/drink.svg'} alt="Coffee Cup" fill objectFit="contain" priority />
          </div>
          <div className="absolute bottom-20 sm:bottom-28 md:bottom-44 left-28 sm:left-40 md:left-80 w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20 transform -translate-x-1/2 rotate-0">
            <Image src={'/images/Medicines1.svg'} alt="Medicines" fill objectFit="contain" priority />
          </div>
          <div className="absolute top-20 sm:top-24 md:top-48 right-24 sm:right-32 md:right-64 w-10 sm:w-16 md:w-20 lg:w-28 h-10 sm:h-16 md:h-20 lg:h-28 transform translate-x-1/2 rotate-4">
            <Image src={'/images/dress.svg'} alt="Dress" fill objectFit="contain" priority />
          </div>
          <div className="absolute top-32 sm:top-40 md:top-60 right-16 sm:right-20 md:right-32 w-10 sm:w-12 md:w-16 lg:w-24 h-10 sm:h-12 md:h-16 lg:h-24 transform translate-x-1/2 rotate-0">
            <Image src={'/images/key.svg'} alt="Key" fill objectFit="contain" priority />
          </div>
          <div className="absolute bottom-16 sm:bottom-20 md:bottom-28 right-24 sm:right-32 md:right-80 w-10 sm:w-12 md:w-16 lg:w-24 h-10 sm:h-12 md:h-16 lg:h-24 transform translate-x-1/2 rotate-0">
            <Image src={'/images/grocery.svg'} alt="Grocery Basket" fill objectFit="contain" priority />
          </div>
          <div className="absolute top-60 sm:top-80 md:top-96 right-8 sm:right-12 md:right-24 w-8 sm:w-10 md:w-12 lg:w-16 h-8 sm:h-10 md:h-12 lg:h-16 transform translate-x-1/2 rotate-0">
            <Image src={'/images/envelop.svg'} alt="Envelope" fill objectFit="contain" priority />
          </div>

          <div className="mt-6 md:mt-10 hover:cursor-pointer">
            <Image 
              src={'/images/getEst.svg'} 
              width={90} height={60} 
              className="w-24 h-16 md:w-48 md:h-28" 
              alt="Pickup" 
              onClick={() => router.push('/estimate')} 
              priority 
            />
          </div>
        </div>
      </div>
      
      {/* Eliminate unnecessary space */}
      <div className="bg-[#fefae060] rounded-sm">
        <OurServices />
      </div>

      <div>
        <WhyUs />
      </div>

      <div className="relative flex flex-col content-center items-center mt-10 mx-7 md:mt-20 lg:mt-32 mb-10 md:mb-20 lg:mb-32">
        <div className="relative">
          {/* Responsive Image for the sticker */}
          <Image 
            src={'/images/sticker.svg'} 
            height={300} 
            width={350} 
            className="h-auto w-auto sm:h-[400px] sm:w-[450px] md:h-[600px] md:w-[650px] lg:h-[850px] lg:w-[1050px]" 
            priority={true} 
            alt="Sticker"
          />
          
          {/* Responsive positioning for the icon */}
          <div className="absolute bottom-10 sm:bottom-20 md:bottom-30 lg:bottom-40 right-10 sm:right-20 md:right-40 lg:right-60 w-8 sm:w-10 md:w-14 lg:w-20 h-8 sm:h-10 md:h-14 lg:h-20 transform translate-x-4 sm:translate-x-6 -translate-y-2 sm:-translate-y-4 rotate-0">
            <Image 
              src={'/images/iconblack.svg'} 
              height={30} 
              width={30} 
              className="h-auto w-auto sm:h-[40px] sm:w-[45px] md:h-[60px] md:w-[70px] lg:h-[90px] lg:w-[90px]" 
              priority={true} 
              alt="Icon"
            />
          </div>
        </div>
      </div>


      <div className="flex flex-col content-center items-center mt-10 md:mt-20 mb-10"> {/* Adjusted bottom margin */}
        <div>
          <span className="font-filson text-[#000000] text-3xl md:text-5xl">Wondering how to </span>
          <span className="font-filson text-[#9E3CE1] text-3xl md:text-5xl">use</span>
          <span className="font-filson text-[#000000] text-3xl md:text-5xl"> it?</span>
        </div>
        <span className="font-generalRegular mb-5 md:mb-10 text-lg md:text-2xl mt-2 md:mt-5">Don't worry, it's easy ;)</span>
        <Image src={'/images/howtouse.svg'} height={450} width={500} className="md:h-[900px] md:w-[1100px]" loading="lazy" />
      </div>

      <div className="mt-10 md:mt-20 mb-10">
        <Faq />
      </div>

    <Footer />
    
    </div>
  );
}
