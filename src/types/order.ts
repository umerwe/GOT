export interface OrderProduct {
    id: number;
    product_id: number;
    product: {
        id: number;
        title: string;
        image: string;
    };
    order_id: number;
    price: string | number;
    quantity: number;
    discount_on_item: string;
    discount_type: string;
    tax_amount: string;
    total_add_on_price: string;
    order_amount: number;
}

export interface Order {
    id: number;
    order_amount: string;
    coupon_discount_amount: string;
    coupon_discount_title: string | null;
    payment_status: "paid" | "unpaid" | string;
    order_status: "pending" | "delivered" | "canceled" | string;
    total_tax_amount: string;
    payment_method: string;
    order_note: string | null;
    order_type: string;
    delivery_address: string | null;
    user: {
        id: number;
        name: string;
        email: string;
    };
    vendor: {
        id: number;
        name: string | null;
        email: string;
    };
    order_details: OrderProduct[];
    created_at: string;
    updated_at: string;
}