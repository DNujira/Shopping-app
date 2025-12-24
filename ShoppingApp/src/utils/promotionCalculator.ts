import { CartItem } from "../types/product";

export interface PromotionResult {
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
  discountCode?: number;
  finalTotalWithCode?: number;
  itemBreakdown: ItemBreakdown[];
}

export interface ItemBreakdown {
  id: number;
  name: string;
  price: number;
  quantity: number;
  numberOfPairs: number;
  remainingUnits: number;
  discountPerPair: number;
  totalDiscount: number;
  subtotalBeforeDiscount: number;
  subtotalAfterDiscount: number;
}

export function calculatePairDiscountPromotion(
  cart: CartItem[],
  code: string
): PromotionResult {
  let totalSubtotal = 0;
  let totalDiscountAmount = 0;
  let finalTotal = 0;
  let totalWithCode = 0;
  let discountCode = 0;
  const itemBreakdown: ItemBreakdown[] = [];

  // คำนวณสำหรับแต่ละสินค้า
  cart.forEach((item) => {
    const { price, quantity } = item;

    // คำนวณจำนวนคู่และจำนวนที่เหลือ
    const numberOfPairs = Math.floor(quantity / 2);
    const remainingUnits = quantity % 2;

    // คำนวณส่วนลด
    const pairPrice = price * 2;
    const discountPerPair = pairPrice * 0.05;
    const totalDiscountForItem = numberOfPairs * discountPerPair;

    // คำนวณราคารวม
    const subtotalBeforeDiscount = price * quantity;
    const subtotalAfterDiscount = subtotalBeforeDiscount - totalDiscountForItem;

    // เก็บข้อมูลรายละเอียด
    itemBreakdown.push({
      id: item.id,
      name: item.name,
      price,
      quantity,
      numberOfPairs,
      remainingUnits,
      discountPerPair,
      totalDiscount: totalDiscountForItem,
      subtotalBeforeDiscount,
      subtotalAfterDiscount,
    });

    // รวมยอด
    totalSubtotal += subtotalBeforeDiscount;
    totalDiscountAmount += totalDiscountForItem;
    finalTotal = totalSubtotal - totalDiscountAmount;

    if (code === "freshket555") {
      totalWithCode = finalTotal - 555;
      discountCode = 555;
    }
  });

  return {
    subtotal: totalSubtotal,
    totalDiscount: totalDiscountAmount,
    finalTotal: finalTotal - discountCode,
    discountCode,
    finalTotalWithCode: totalWithCode,
    itemBreakdown,
  };
}
