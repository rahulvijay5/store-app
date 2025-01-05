import { TeaType, TeaSize } from '../constants/prices';

export interface CartItem {
  type: TeaType;
  size: TeaSize;
  quantity: number;
  price: number;
}

export type TypeOfCart = CartItem[];

export interface Counts {
  Reg250: number;
  Reg500: number;
  Reg1000: number;
  Sup250: number;
  Sup500: number;
  Sup1000: number;
}

export interface Order {
  userId: number;
  totalPrice: number;
  totalWeight: number;
  pickupDate: Date;
  Reg250: number;
  Reg500: number;
  Reg1000: number;
  Sup250: number;
  Sup500: number;
  Sup1000: number;
}

