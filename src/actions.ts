import { Alert } from 'react-native';
import { cartStore } from './state/cartStore';
import { navigationStore } from './navigationStore';
import { Action } from './types';

export const handleAction = async (action: Action): Promise<void> => {
  switch (action.type) {
    case 'ADD_TO_CART': cartStore.add(action.payload.id); return;
    case 'DEEP_LINK': navigationStore.navigate(action.payload.url); return;
    case 'APPLY_MYSTERY_GIFT_COUPON': Alert.alert('Mystery unlocked', `${action.payload.coupon} applied to your cart.`); return;
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
};
