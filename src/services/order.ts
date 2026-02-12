import api from "@/lib/axios"   
interface OrderProduct {
  product_id: number;
  quantity: number;
  price: number;
}

interface OrderPayload {
  order_amount: number;
  payment_method: "stripe" | string;
  payment_status: "paid" | string;
  delivery_address: string;
  order_note: string | null;
  vendor_id: number | string;
  transaction_id: string;
  coupon_code: string | null;
  products: OrderProduct[];
}

export const getOrderList = async (currentPage: number = 1) => {
    const { data } = await api.get(`/order-list?page=${currentPage}`)
    return data
}
export const saveOrder = async (form: OrderPayload) => {
    const { data } = await api.post("/save-order", form)
    return data
}