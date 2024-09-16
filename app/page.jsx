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
        <div className="text-center bg-gradient-to-b h-auto md:h-[80vh] lg:h-[60vh] from-[#8D14CE] to-[#470A68] text-white pb-16 md:pb-24 pt-8 rounded-br-3xl rounded-bl-3xl flex flex-col justify-center items-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex flex-col gap-2 mb-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-filson">
                <span className="bg-[#F5E27B] text-center pt-1 px-2 sm:pt-2 sm:px-3 lg:pt-3 lg:px-4 font-filson inline-flex rounded-2xl text-[#202020]">
                  OnePost
                </span>{" "}
                "Post"
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-filson">
                with few clicks!
              </h1>
            </div>
           {/*
            <p className="mt-4 sm:mt-6 text-md sm:text-lg md:text-xl lg:text-2xl font-generalLight">
              No need to step out, ship with ease using our <br className="hidden md:block" /> doorstep pickup and delivery service.
            </p>
            */}
          </div>

          {/* Responsive Image Loading and Positioning */}

        </div>

      </div>
      
      {/* Eliminate unnecessary space */}
      
      <div className="bg-[#fefae060] rounded-sm">
        <OurServices />
      </div>


      {/*
      <div>
        <WhyUs />
      </div>
      */}

      <div className="relative flex flex-col items-center mt-10 mx-4 sm:mx-7 md:mt-20 lg:mt-32 mb-10 md:mb-20 lg:mb-32">
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
          {/* Responsive Image for the sticker */}
          {/*
          <Image 
            src={'/images/sticker.svg'} 
            layout="responsive"
            width={1050} 
            height={850} 
            className="h-auto w-full" 
            priority={true} 
            alt="Sticker"
            sizes="(max-width: 640px) 300px, (max-width: 768px) 450px, (max-width: 1024px) 650px, 1050px"
          />
          */}
          {/* Responsive positioning for the icon */}
          <div className="absolute bottom-[10%] sm:bottom-[15%] md:bottom-[20%] lg:bottom-[25%] right-[5%] sm:right-[10%] md:right-[15%] lg:right-[20%] w-8 sm:w-10 md:w-14 lg:w-20 h-8 sm:h-10 md:h-14 lg:h-20 transform translate-x-[5%] sm:translate-x-[10%] -translate-y-1 sm:-translate-y-2 md:-translate-y-4 lg:-translate-y-6 rotate-0">
            {/*
            <Image 
              src={'/images/iconblack.svg'} 
              layout="responsive"
              width={70} 
              height={70} 
              className="h-auto w-full sm:-translate-x-9 sm:-translate-y-8" 
              priority={true} 
              alt="Icon"
              sizes="(max-width: 640px) 30px, (max-width: 768px) 45px, (max-width: 1024px) 70px, 90px"
            />
            */}
          </div>  
        </div>
      </div>



      <div className="flex flex-col content-center items-center mt-10 md:mt-20 mb-10"> {/* Adjusted bottom margin */}
        <div>
          <span className="font-filson text-[#000000] text-3xl md:text-5xl">Wondering how to </span>
          <span className="font-filson text-[#9E3CE1] text-3xl md:text-5xl">use</span>
          <span className="font-filson text-[#000000] text-3xl md:text-5xl"> it?</span>
        </div>
        <span className="font-generalRegular mb-5 md:mb-10 text-lg md:text-2xl mt-2 md:mt-5">Don't worry, it's easy ;</span>
        <Image 
          src={'/images/howtouse.svg'} 
          height={800} 
          width={800} 
          className="md:h-[900px] md:w-[1100px]" 
          loading="lazy" 
          sizes="(max-width: 640px) 450px, (max-width: 1024px) 900px, 1100px"
        />
      </div>
      
      {/*
      <div className="mt-10 md:mt-20 mb-10">
        <Faq />
      </div>
      */}
    
    
    </div>
  );
}
