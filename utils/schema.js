import { pgTable, serial, text, varchar, integer, json, boolean } from "drizzle-orm/pg-core";

export const UserData = pgTable('UserData', {
  user_id: serial('user_id').primaryKey(),
  email: varchar('email', 255).notNull().unique(),
  phoneNumber: varchar('phoneNumber', 20),
  wallet: varchar('wallet').default('0'),
  unicappCoins: integer('unicappCoins').default(0),
  savedAddresses: json('savedAddresses').default('{}'),
  createdAt: varchar('createdAt'),
  isAdmin: boolean('isAdmin').default(false),
  role: varchar('role', 50),
  onboarded: boolean('onboarded').default(false),
  verified: boolean('verified').default(false),
  preferredTimeSlot: varchar('preferredTimeSlot', 50).default('')
});

  
export const OrderData = pgTable('OrderData', {
    order_id: varchar('order_id').primaryKey(),
    userEmail: varchar('userEmail').notNull(),
    pickupLocation: text('pickupLocation').notNull(),
    dropLocation: text('dropLocation').notNull(),
    stops: text('stops'),
    pickupCoords: text('pickupCoords'),
    dropCoords: text('dropCoords'),
    date: varchar('date').notNull(),
    time: varchar('time'),
    weight: varchar('weight'),
    itemDescription: text('itemDescription'),
    specialInstructions: text('specialInstructions'),
    status: varchar('status'),
    paymentStatus: varchar('paymentStatus'),
    amount: varchar('amount').notNull(), // Amount stored as string
    paymentId: varchar('paymentId'),
    otp: varchar('otp'),
    createdAt: varchar('createdAt'),
    phone: varchar('phone'),
    order_type: varchar('order_type'),
    delivery_type: varchar('delivery_type'),
    length: varchar('length'),
    height: varchar('height'),
    width: varchar('width'),
    route: varchar('route'),
    shipping_service: varchar('shipping_service'),
    Tracking_number: varchar('Tracking_number'),
    Tracking_link: varchar('Tracking_link'),
    user_role: varchar('user_role'),
    receiverName: varchar('receiverName'),
    receiverPhone: varchar('receiverPhone'),
});

export const TransactionData = pgTable('TransactionData', {
  transaction_id: varchar('transaction_id').primaryKey(),
  userEmail: varchar('userEmail').notNull(),
  amount: varchar('amount').notNull(), // Amount stored as string
  date: varchar('date').notNull(),
  description: varchar('description').notNull(),
});

export const OrganizationData = pgTable('OrganizationData', {
  organization_id: varchar('organization_id').primaryKey(),
  organizationName: varchar('organizationName', 255).notNull(),
  businessType: varchar('businessType', 255).notNull(),
  organizationAddress: varchar('organizationAddress').notNull(),
  dateOfJoining: varchar('dateOfJoining').notNull(),
  userEmail: varchar('userEmail').notNull(),
});
