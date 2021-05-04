export type IVoucher = {
  id: string;
  promotion_name: string;
  promotion_no: string;
  promotion_type: 'default';
  description: string | null;
  expire_at: number;
  small_image: string;
};
