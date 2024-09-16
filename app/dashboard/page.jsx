"use client";
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import * as schema from '@/utils/schema';
import moment from 'moment';
import { eq, and } from 'drizzle-orm';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, CircleUserRound, ShieldCheck, Truck, WalletMinimal, ChevronUp, Menu, X, LogOut, ChevronDown, UserRound } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Modal, Button } from '@/components/ui'; // Assuming you have a Modal and Button component
import { preferredTimeSlotState } from '@/store'; // Recoil state for preferredTimeSlot

const svgArray = [
  '/images/loading1.svg',
  '/images/loading2.svg',
  '/images/loading3.svg',
  '/images/loading4.svg',
  '/images/loading5.svg'
];

const LoadingComponent = () => {
  const [currentSvgIndex, setCurrentSvgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSvgIndex((prevIndex) => (prevIndex + 1) % svgArray.length);
    }, 200); // Change SVG every 200ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">
        <Image src={svgArray[currentSvgIndex]} alt="Loading animation" width={50} height={50} />
      </div>
      <div>
        <span className="text-lg font-medium">Loading</span>
      </div>
    </div>
  );
};

function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk(); // Add signOut from Clerk
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [individualOrders, setIndividualOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [activeTab, setActiveTab] = useState('pickupDrop'); // Active tab state
  const [timeSlotModalOpen, setTimeSlotModalOpen] = useState(false); // State for modal
  const [preferredTimeSlot, setPreferredTimeSlot] = useRecoilState(preferredTimeSlotState); // Time slot state

  const timeSlots = [
    '09:00 - 10:00 AM',
    '10:00 - 11:00 AM',
    '11:00 - 12:00 PM',
    '12:00 - 01:00 PM',
    '01:00 - 02:00 PM',
    '02:00 - 03:00 PM',
    '03:00 - 04:00 PM',
    '04:00 - 05:00 PM',
    '05:00 - 06:00 PM',
  ];

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          console.log('Fetching user data for email:', user.primaryEmailAddress.emailAddress);
          const email = user.primaryEmailAddress.emailAddress;

          // Fetch user data
          const fetchedUser = await db
            .select()
            .from(schema.UserData)
            .where(eq(schema.UserData.email, email))
            .execute();

          console.log('Fetched user data:', fetchedUser);

          if (fetchedUser.length === 0) {
            console.log('User does not exist, redirecting to role selection');
            router.push('/dashboard/onboarding/role');
            return;
          }

          const userData = fetchedUser[0];
          setUserData(userData);

          if (!userData.onboarded) {
            console.log('User is not onboarded, redirecting to role selection');
            router.push('/dashboard/onboarding/role');
            return;
          }

          if (userData.onboarded && !userData.verified) {
            console.log('User is onboarded but not verified, redirecting to number verification');
            router.push('/dashboard/onboarding/number-verification');
            return;
          }

          if (userData.role === 'Business' && userData.verified) {
            console.log('User is a verified business, checking organization data');
            const orgData = await db
              .select()
              .from(schema.OrganizationData)
              .where(eq(schema.OrganizationData.userEmail, email))
              .execute();

            console.log('Fetched organization data:', orgData);

            if (orgData.length === 0) {
              console.log('Business user has not completed organization onboarding, redirecting to organization onboarding');
              router.push('/dashboard/onboarding/business/organisation');
              return;
            }
          }

          // Fetch orders for Business
          console.log('Fetching orders for email:', email);
          const fetchedOrders = await db
            .select()
            .from(schema.OrderData)
            .where(eq(schema.OrderData.userEmail, email))
            .execute();

          console.log('Fetched orders:', fetchedOrders);

          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders);

          // Fetch orders for Individual role
          const fetchedIndividualOrders = await db
            .select()
            .from(schema.OrderData)
            .where(and(eq(schema.OrderData.userEmail, email), eq(schema.OrderData.user_role, 'Individual')))
            .execute();

          console.log('Fetched individual orders:', fetchedIndividualOrders);

          setIndividualOrders(fetchedIndividualOrders);

          // Open the modal if preferredTimeSlot is empty
          if (!userData.preferredTimeSlot) {
            setTimeSlotModalOpen(true);
          }
        } catch (error) {
          console.error('Error fetching user data and orders:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (statusFilter) {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    } else {
      setFilteredOrders(orders);
    }
  }, [statusFilter, orders]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-500';
      case 'Out for delivery':
        return 'bg-green-100 text-green-500';
      case 'In-Transit':
        return 'bg-yellow-100 text-yellow-500';
      case 'Delivered':
        return 'bg-green-200 text-green-700';
      case 'Completed':
        return 'bg-gray-200 text-gray-700';
      case 'Return to Origin (RTO)':
        return 'bg-red-100 text-red-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const toggleRole = async (newValue) => {
    if (userData) {
      const newRole = newValue ? 'Business' : 'Individual';
      
      try {
        // Update role in the database
        await db
          .update(schema.UserData)
          .set({ role: newRole })
          .where(eq(schema.UserData.email, userData.email))
          .execute();

        // Update state with new role
        setUserData({ ...userData, role: newRole });
        window.location.reload();  // Refresh the page
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    }
  };

  const handleTimeSlotChange = (e) => {
    setPreferredTimeSlot(e.target.value);
  };

  const handleConfirmTimeSlot = async () => {
    if (userData && preferredTimeSlot) {
      try {
        // Update the user's preferred time slot in the database
        await db
          .update(schema.UserData)
          .set({ preferredTimeSlot })
          .where(eq(schema.UserData.email, userData.email))
          .execute();

        // Close the modal after updating
        setTimeSlotModalOpen(false);

        // Optionally reload or update the user data in state
        setUserData({ ...userData, preferredTimeSlot });
      } catch (error) {
        console.error('Error updating preferred time slot:', error);
      }
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const orderCount = (status) => orders.filter(order => order.status === status).length;

  const filteredIndividualOrders = activeTab === 'pickupDrop'
    ? individualOrders.filter(order => order.order_type === 'Pickup & Drop')
    : individualOrders.filter(order => order.order_type === 'Courier');

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-20 bg-gradient-to-b from-[#470a68] to-[#8D14CE] text-white w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 mt-7 ml-3">
          <Image src={'/images/yellowcaplogo.svg'} height={50} width={150} alt="Logo" onClick={() => router.replace('/')} className="hover:cursor-pointer" />
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <nav className="mt-4">
            <ul>
              <li>
                <a href="/dashboard" className="flex py-2 px-4 rounded items-center gap-2 mb-2 hover:bg-[#c964cf] bg-[#c964cf]">
                  <CircleUserRound /> Account
                </a>
              </li>
              <li>
                <a href="/dashboard/wallet" className="py-2 px-4 rounded flex items-center gap-2 mb-2 hover:bg-[#c964cf]">
                  <WalletMinimal /> Wallet
                </a>
              </li>
              {userData?.isAdmin && (
                <li>
                  <a href="/dashboard/admin-panel" className="py-2 px-4 rounded flex items-center gap-2 mb-2 hover:bg-[#c964cf]">
                    <ShieldCheck /> Admin Panel
                  </a>
                </li>
              )}
              <li className="">
                {/* Sign Out Button for small screens */}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 py-2 px-4 text-left w-full hover:bg-[#c964cf]"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Header for Large Screens */}
        <header className="hidden lg:flex items-center justify-between pt-4 pb-3 px-4 bg-white w-full mb-10">
          <div className="flex items-center space-x-4 lg:justify-between w-full">
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <button
              onClick={() => router.push('/dashboard/booking/location')}
              className="px-4 py-2 bg-[#FFDD00] font-filson text-black rounded-xl hover:bg-[#ffdd00c9]"
            >
              + Book a new pickup
            </button>
            <div className="flex items-center space-x-2">
              {userData && (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={userData.role === 'Business'}
                    onCheckedChange={toggleRole}
                    id="role-switch"
                  />
                  <label htmlFor="role-switch" className="text-lg font-semibold">
                    {userData.role === 'Business' ? 'Business' : 'Individual'}
                  </label>
                </div>
              )}
              <div className="hidden lg:flex items-center border-2 rounded-lg py-2 px-3">
                {/* Combined Dropdown for account, wallet, and sign out */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-lg">
                    {user?.fullName || 'Guest'}
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Content based on role */}
        {userData?.role === 'Business' ? (
          <div className="flex-1">
            <h1 className="text-4xl font-generalSemiBold mb-4 ml-6">Welcome {user?.firstName} 👋</h1>
            <div className="p-4 mb-4 -translate-x-3.5 ml-6">
              <h3 className="text-2xl font-generalMedium mb-5">Orders Summary</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-3xl shadow bg-white text-center flex flex-col h-40">
                  <div className="flex flex-row justify-between">
                    <p className="text-gray-500 font-filson">Total Orders</p>
                    <Image src={'/images/Truck.svg'} width={30} height={30} alt="Truck" />
                  </div>
                  <p className="text-4xl font-bold mt-10">{orders.length}</p>
                </div>
                <div className="p-4 rounded-3xl shadow bg-white text-center flex flex-col h-40">
                  <div className="flex flex-row justify-between">
                    <p className="text-gray-500 font-filson">Order Placed</p>
                    <Image src={'/images/Boxes.svg'} width={30} height={30} alt="Boxes" />
                  </div>
                  <p className="text-4xl font-bold mt-10">{orderCount('Order Placed')}</p>
                </div>
                <div className="p-4 rounded-3xl shadow bg-white text-center flex flex-col h-40">
                  <div className="flex flex-row justify-between">
                    <p className="text-gray-500 font-filson">In-Transit</p>
                    <Image src={'/images/return.svg'} width={30} height={30} alt="Return" />
                  </div>
                  <p className="text-4xl font-bold mt-10">{orderCount('In-Transit')}</p>
                </div>
                <div className="p-4 rounded-3xl shadow bg-white text-center flex flex-col h-40">
                  <div className="flex flex-row justify-between">
                    <p className="text-gray-500 font-filson">Return to Origin (RTO)</p>
                    <Image src={'/images/chart.svg'} width={30} height={30} alt="Chart" />
                  </div>
                  <p className="text-4xl font-bold mt-10">{orderCount('Return to Origin (RTO)')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow ml-6 mr-6">
              <div className="flex justify-between font-filson items-center mb-4">
                <h3 className="text-xl font-filson">Orders</h3>
                <div className="flex items-center">
                  <label htmlFor="status-filter" className="block text-gray-700 mr-2">Filter by Status:</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <button className="px-4 py-2 font-filson bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100">
                        {statusFilter || "Select Status"}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setStatusFilter("")}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Order Placed")}>Order Placed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Out for delivery")}>Out for delivery</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("In-Transit")}>In-Transit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Delivered")}>Delivered</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Return to Origin (RTO)")}>Return to Origin (RTO)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {filteredOrders.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-filson">Order ID</TableHead>
                          <TableHead className="font-filson">Delivery Type:</TableHead>
                          <TableHead className="font-filson">Date</TableHead>
                          <TableHead className="font-filson">Weight</TableHead>
                          <TableHead className="font-filson">Status</TableHead>
                          <TableHead className="font-filson">Special Instructions</TableHead>
                          <TableHead className="font-filson">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentOrders.map((order) => (
                          <>
                            <TableRow key={order.order_id} onClick={() => setExpandedOrderId(order.order_id === expandedOrderId ? null : order.order_id)}>
                              <TableCell>{order.order_id}</TableCell>
                              <TableCell>{order.deliveryType || 'N/A'}</TableCell>
                              <TableCell>{moment(order.date).format('LL')}</TableCell>
                              <TableCell>{order.weight} kg</TableCell>
                              <TableCell className="flex items-center mt-2">
                                <div className={`${getStatusStyle(order.status)} rounded-2xl px-4`}>
                                  <span>{order.status}</span>
                                </div>
                              </TableCell>
                              <TableCell>{order.specialInstructions}</TableCell>
                              <TableCell>₹{order.amount}</TableCell>
                            </TableRow>
                            {expandedOrderId === order.order_id && (
                              <TableRow key={`${order.order_id}-details`}>
                                <TableCell colSpan={11}>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                                    <div className="flex flex-col border rounded-lg bg-white px-4 py-2 pb-6">
                                      <div className='flex flex-row gap-2 mt-3'>
                                        <Truck size={20} strokeWidth={1.25} /> <h4 className="font-bold mb-4"> Order Details</h4>
                                      </div>
                                      <p><strong>Order Date:</strong> {moment(order.date).format('LL')}</p>
                                      <p><strong>Delivery Type:</strong> {order.deliveryType || 'N/A'}</p>
                                      <p><strong>Delivery Fees:</strong> {order.deliveryFees || 'N/A'}</p>
                                      <p><strong>Weight / Dimension:</strong> {order.weight || 'N/A'} kg ({order.length}cm x {order.width}cm x {order.height}cm)</p>
                                    </div>
                                    <div className="flex flex-col border rounded-lg bg-white px-4 py-2 pb-6">
                                      <div className='flex flex-row gap-2 mt-3'>
                                        <UserRound size={20} strokeWidth={1.25} /> <span className="font-bold mb-4">Customer Information</span>
                                      </div>
                                      <div className='flex flex-row justify-between'>
                                        <p className='text-sm'><strong>From:</strong> {order.pickupLocation || 'N/A'}</p>
                                        <p className='text-sm'><strong>To:</strong> {order.dropLocation || 'N/A'}</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-col border rounded-lg bg-white px-4 py-2 pb-6">
                                      <div className='flex flex-row gap-2 mt-3'>
                                        <Truck size={20} strokeWidth={1.25} /><h4 className="font-bold mb-4"> Delivery Information</h4>
                                      </div>
                                      <p><strong>Shipped Through:</strong> {order.shipping_service || 'N/A'}</p>
                                      <p><strong>Tracking Number:</strong> {order.Tracking_number || 'N/A'}</p>
                                      <p><strong>Tracking Link:</strong> {order.Tracking_link || 'N/A'}</p>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className='mt-2'>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button className="px-4 py-3 font-filson bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 flex flex-row gap-1">
                              {itemsPerPage} <ChevronUp />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setItemsPerPage(5)}>5</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemsPerPage(10)}>10</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemsPerPage(15)}>15</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemsPerPage(20)}>20</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemsPerPage(50)}>50</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="px-4 py-2 rounded hover:cursor-pointer"
                    >
                      <ChevronLeft />
                    </button>
                    <span className="text-gray-700">
                      {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredOrders.length)} of ${filteredOrders.length} Orders`}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="px-4 py-2 rounded hover:cursor-pointer"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-700">No orders found.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full p-6 bg-gray-50">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 hidden sm:block">Welcome {user?.firstName} 👋</h1>

            <div className="flex flex-col items-center w-full space-y-8">
              {/* Orders Section */}
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-semibold text-gray-700">Your Orders</h2>
                </div>

                <div className="lg:hidden mb-6">
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={() => setActiveTab('pickupDrop')}
                      className={`text-lg px-4 py-2 focus:outline-none ${activeTab === 'pickupDrop' ? 'bg-white text-[#0094B2]' : 'bg-white text-black'}`}
                    >
                      Pickup & Drop
                    </button>
                    <button
                      onClick={() => setActiveTab('courier')}
                      className={`text-lg px-4 py-2 rounded-r-full focus:outline-none ${activeTab === 'courier' ? 'bg-white text-[#0094B2]' : 'bg-white text-black'}`}
                    >
                      Courier
                    </button>
                  </div>

                <div className="space-y-4">
                  {filteredIndividualOrders.slice(0, 4).map((order) => (
                    <div
                      key={order.order_id}
                      className={`bg-black bg-opacity-5 rounded-lg p-4 cursor-pointer ${expandedOrderId === order.order_id ? 'bg-black bg-opacity-5' : ''}`}
                      onClick={() => setExpandedOrderId(order.order_id === expandedOrderId ? null : order.order_id)}
                    >
                      <div className="flex justify-between">
                        <div className="w-full">
                          <div className="flex items-center mb-2">
                            <Image src={'/images/arrowupgreen.svg'} height={25} width={25} alt="Pickup Location" />
                            <p className="text-lg ml-2 font-generalMedium overflow-hidden truncate max-w-full">
                              {order.pickupLocation || 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-center mb-2">
                            <Image src={'/images/arrowdownred.svg'} height={25} width={25} alt="Drop Location" />
                            <p className="text-lg ml-2 font-generalMedium overflow-hidden truncate max-w-full">
                              {order.dropLocation || 'N/A'}
                            </p>
                          </div>
                          <div className="border-t border-dashed w-full border-black mb-7"></div> {/* Adjusted width to w-full */}
                        </div>
                      </div>
                      <div className='flex flex-row justify-between'>
                        <p className="text-gray-600 text-xs mt-2">{moment(order.date).format('LL')}</p>
                        <p className={`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status || 'N/A'}
                        </p>
                      </div>
                      {expandedOrderId === order.order_id && (
                        <div className="mt-4">
                          <p className="text-sm"><strong>Order ID:</strong> {order.order_id}</p>
                          <p className="text-sm"><strong>Weight/Dimension:</strong> {order.weight || 'N/A'} kg ({order.length}cm x {order.width}cm x {order.height}cm)</p>
                          <p className="text-sm"><strong>Delivery Fees:</strong> ₹{order.amount}</p>
                          <p className="text-sm"><strong>Special Instructions:</strong> {order.specialInstructions || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                </div>
                {/* Table for Large Screens */}
                {individualOrders.length > 0 && (
                  <div className="hidden lg:block overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader className="bg-gray-100">
                        <TableRow>
                          <TableHead className="text-gray-600">Order ID</TableHead>
                          <TableHead className="text-gray-600">Date</TableHead>
                          <TableHead className="text-gray-600">Order Type</TableHead>
                          <TableHead className="text-gray-600">Status</TableHead>
                          <TableHead className="text-gray-600">Weight</TableHead>
                          <TableHead className="text-gray-600">Special Instructions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-200">
                        {individualOrders.map((order) => (
                          <TableRow key={order.order_id} className="hover:bg-gray-50 transition-colors duration-200">
                            <TableCell className="py-4 text-gray-800">{order.order_id}</TableCell>
                            <TableCell className="py-4 text-gray-800">{moment(order.date).format('LL')}</TableCell>
                            <TableCell className="py-4 text-gray-800">{order.order_type || 'N/A'}</TableCell>
                            <TableCell className="py-4 text-gray-800">
                              <span className={`px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                                {order.status || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 text-gray-800">{order.weight || 'N/A'} kg</TableCell>
                            <TableCell className="py-4 text-gray-800">{order.specialInstructions || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Saved Addresses Section */}
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl hidden lg:block">
                <h2 className="text-3xl font-semibold text-gray-700 mb-4">Saved Addresses</h2>
                <p className="text-gray-600 mb-6">No saved addresses found</p>
                <button
                  onClick={() => router.push('/dashboard/account')}
                  className="px-6 py-2 bg-[#F5F5F5] text-black rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  + Add a new address
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Time Slot Modal */}
      {timeSlotModalOpen && (
        <Modal isOpen={timeSlotModalOpen} onClose={() => setTimeSlotModalOpen(false)}>
          <div className="p-4">
            <h2>Select Your Preferred Time Slot</h2>
            <select
              value={preferredTimeSlot}
              onChange={handleTimeSlotChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleConfirmTimeSlot} disabled={!preferredTimeSlot}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
    </div>
  );
}

export default DashboardPage;
