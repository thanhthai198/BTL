export type OrderType = {
  id: string;
  _id: string;
  amount: number;
  salesorder_type: string;
  salesorder_status: 'delivery' | 'accept' | 'pending' | 'completed' | 'cancel' | 'confirm';
  salesorder_source: 'APPMOBILE' | 'BUSINESSORDER';
  salesorder_no: string;
  order_datetime: string;
};
