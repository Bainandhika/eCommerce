export interface Delivery {
  delivery_id: string;
  order_id: string | null;
  courier_id: string | null;
  pick_up_date: string | null;
  delivered_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateDeliveryInput {
  delivery_id: string;
  order_id?: string | null;
  courier_id?: string | null;
  pick_up_date?: string | null;
  delivered_date?: string | null;
}

export interface UpdateDeliveryInput {
  order_id?: string | null;
  courier_id?: string | null;
  pick_up_date?: string | null;
  delivered_date?: string | null;
}
