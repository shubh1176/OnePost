import { atom } from 'recoil';

export const pickupLocationState = atom({
  key: 'pickupLocationState',
  default: '',
});

export const dropLocationState = atom({
  key: 'dropLocationState',
  default: '',
});

export const stopsState = atom({
  key: 'stopsState',
  default: [],
});

export const pickupCoordsState = atom({
  key: 'pickupCoordsState',
  default: null,
});

export const dropCoordsState = atom({
  key: 'dropCoordsState',
  default: null,
});

export const isPickupDialogOpenState = atom({
  key: 'isPickupDialogOpenState',
  default: false,
});

export const isDropDialogOpenState = atom({
  key: 'isDropDialogOpenState',
  default: false,
});

export const openStopDialogState = atom({
  key: 'openStopDialogState',
  default: null,
});

export const dateState = atom({
  key: 'dateState',
  default: new Date(),
});

export const timeState = atom({
  key: 'timeState',
  default: 'Within 30 mins',
});

export const weightState = atom({
  key: 'weightState',
  default: '',
});

export const itemDescriptionState = atom({
  key: 'itemDescriptionState',
  default: '',
});

export const specialInstructionsState = atom({
  key: 'specialInstructionsState',
  default: '',
});

export const paymentStatusState = atom({
  key: 'paymentStatusState',
  default: 'Unpaid',
});

export const amountState = atom({
  key: 'amountState',
  default: 0,
});

export const statusState = atom({
  key: 'statusState',
  default: 'Pending',
});

export const paymentIdState = atom({
  key: 'paymentIdState',
  default: '',
});

export const otpCodeState = atom({
  key: 'otpCodeState',
  default: '',
});

export const orderTypeState = atom({
  key: 'orderTypeState',
  default: 'Pickup & Drop',
});

export const lengthState = atom({
  key: 'lengthState',
  default: '',
});

export const heightState = atom({
  key: 'heightState',
  default: '',
});

export const widthState = atom({
  key: 'widthState',
  default: '',
});

export const routeState = atom({
  key: 'routeState',
  default: '',
});

export const walletState = atom({
  key: 'walletState',
  default: 0,
});

export const roleState = atom({
  key: 'roleState',
  default: 'Individual',
});

export const onboardedState = atom({
  key: 'onboardedState',
  default: false,
});

export const verifiedState = atom({
  key: 'verifiedState',
  default: false,
});

export const phoneNumberState = atom({
  key: 'phoneNumberState',
  default: '',
});


export const organizationNameState = atom({
  key: 'organizationNameState',
  default: '',
});

export const organizationTypeState = atom({
  key: 'organizationTypeState',
  default: '',
});


export const organizationAddressState = atom({
  key: 'organizationAddressState',
  default: '',
});

export const receiverNumberState = atom({
  key: 'receiverNumberState',
  default: '',
});

export const receiverNameState = atom({
  key: 'receiverNameState',
  default: '',
});


export const detailedPickupAddressState = atom({
  key: 'detailedPickupAddressState',
  default: { houseNo: '', floor: '', landmark: '' },
});

export const detailedDropOffAddressState = atom({
  key: 'detailedDropOffAddressState',
  default: { houseNo: '', floor: '', landmark: '' },
});

export const detailedStopsAddressState = atom({
  key: 'detailedStopsAddressState',
  default: [],
});


export const distanceState = atom({
  key: 'distanceState',
  default: 0,
});

export const showPriceDetailsState = atom({
  key: 'showPriceDetailsState',
  default: false,
});

export const preferredTimeSlotState = atom({
  key: 'preferredTimeSlotState',
  default: '',
});
