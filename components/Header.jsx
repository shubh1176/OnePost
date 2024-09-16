"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, CircleUserRound, WalletMinimal, LogOut, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/clerk-react';

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="bg-[#8D14CE] flex justify-between items-center px-4 py-7">
      <div>
        <Image src={''} width={150} height={40} alt="Logo" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 md:gap-4">
        <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20 text-sm md:text-lg">
          Home
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-white text-sm md:text-lg p-2 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-20">
            Services <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg rounded-md mt-2 p-2">
            <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => router.push('/Pickup-and-drop')}>
              Pickup & Drop
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => router.replace('/courier')}>
              Intercity Courier
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
              API Integration
            </DropdownMenuItem>
            <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => router.push('/businesses')}>
              Last-mile Delivery
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20 text-sm md:text-lg" onClick={() => router.push('/businesses')}>
          For Business
        </Button>
        {/* 
        <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20 text-sm md:text-lg" onClick={() => router.push('/about')}>
          About Us
        </Button>
        <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20 text-sm md:text-lg" onClick={() => router.push('/contact')}>
          Contact
        </Button>
        */}
      </div>

      {/* User Menu */}
      <div className="hidden md:flex items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-white text-xs md:text-sm p-2 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-20">
              {user.fullName || 'Guest'} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-lg rounded-md mt-2 p-2">
              <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer gap-2" onClick={() => router.push('/dashboard')}>
                <CircleUserRound /> Account
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer gap-2" onClick={() => router.push('/dashboard/wallet')}>
                <WalletMinimal /> Wallet
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer gap-2" onClick={() => signOut()}>
                <LogOut /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20 text-xs md:text-md" onClick={() => router.replace('/dashboard')}>
              Log In
            </Button>
            <Button className="text-xs md:text-md text-[#470A68] bg-white hover:bg-[#9E3CE1] hover:text-white" onClick={() => router.replace('/dashboard')}>
              Sign up
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex md:hidden items-center space-x-2">
        <button onClick={toggleDrawer} className="text-white focus:outline-none">
          {drawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="absolute top-0 right-0 w-3/4 h-screen bg-[#8D14CE] z-50 flex flex-col items-start p-4 transition-transform duration-300 transform translate-x-0">
          <div className="flex justify-between w-full mb-8">
            <button onClick={toggleDrawer} className="text-white focus:outline-none">
              <X size={24} />
            </button>
          </div>

          {/* User Menu in Drawer */}
          <div className="w-full mb-8">
            {user ? (
              <div className="flex flex-col space-y-4 w-full">
                <Button variant="ghost" className="text-white text-left hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/dashboard'); toggleDrawer(); }}>
                  <CircleUserRound /> Account
                </Button>
                <Button variant="ghost" className="text-white text-left hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/dashboard/wallet'); toggleDrawer(); }}>
                  <WalletMinimal /> Wallet
                </Button>
                <Button variant="ghost" className="text-white text-left hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { signOut(); toggleDrawer(); }}>
                  <LogOut /> Sign Out
                </Button>
              </div>
            ) : null}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 w-full text-left">
            <Button variant="ghost" className="text-white text-left w-full hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/'); toggleDrawer(); }}>
              Home
            </Button>
            <Button variant="ghost" className="text-white text-left w-full hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/Pickup-and-drop'); toggleDrawer(); }}>
              Pickup & Drop
            </Button>
            <Button variant="ghost" className="text-white text-left w-full hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/courier'); toggleDrawer(); }}>
              Intercity Courier
            </Button>
            <Button variant="ghost" className="text-white text-left w-full hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/businesses'); toggleDrawer(); }}>
              Last-mile Delivery
            </Button>
            {/* 
            <Button variant="ghost" className="text-white text-left w-full hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/about'); toggleDrawer(); }}>
              About Us
            </Button>
            <Button variant="ghost" className="text-white text-left w-full hover:bg-white hover:bg-opacity-20 text-lg" onClick={() => { router.push('/contact'); toggleDrawer(); }}>
              Contact
            </Button>
            */}
          </nav>
        </div>
      )}
    </div>
  );
}

export default Header;


