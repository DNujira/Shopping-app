import { CartItem } from '../types/product';

export interface PromotionResult {
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
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

/**
 * คำนวณโปรโมชั่น: ส่วนลด 5% สำหรับการซื้อสินค้าชนิดเดียวกันเป็นคู่
 *
 * Logic:
 * 1. จัดกลุ่มสินค้าตาม product ID
 * 2. สำหรับแต่ละสินค้า:
 *    - คำนวณจำนวนคู่ที่ได้ส่วนลด = Math.floor(quantity / 2)
 *    - คำนวณจำนวนที่เหลือ = quantity % 2
 *    - ส่วนลดต่อคู่ = (price * 2) * 0.05
 *    - ส่วนลดรวม = numberOfPairs * discountPerPair
 *    - ราคาหลังหักส่วนลด = (numberOfPairs * price * 2) - totalDiscount + (remaining * price)
 * 3. รวมราคาทั้งหมดของทุกสินค้า
 *
 * @param cart - รายการสินค้าในตะกร้า
 * @returns ผลลัพธ์การคำนวณโปรโมชั่น
 */
export function calculatePairDiscountPromotion(cart: CartItem[]): PromotionResult {
  let totalSubtotal = 0;
  let totalDiscountAmount = 0;
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
  });

  return {
    subtotal: totalSubtotal,
    totalDiscount: totalDiscountAmount,
    finalTotal: totalSubtotal - totalDiscountAmount,
    itemBreakdown,
  };
}

/**
 * ฟอร์แมตตัวเลขให้เป็นรูปแบบเงิน (เช่น 1,234.56)
 */
export function formatCurrency(amount: number): string {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * สร้างข้อความอธิบายรายละเอียดสินค้า
 */
export function getItemDescription(item: ItemBreakdown): string {
  if (item.numberOfPairs === 0) {
    return `${item.quantity} unit × ฿${item.price}`;
  }

  let description = '';

  // อธิบายคู่ที่ได้ส่วนลด
  if (item.numberOfPairs > 0) {
    description += `${item.numberOfPairs} pair${item.numberOfPairs > 1 ? 's' : ''} (discount ฿${formatCurrency(item.totalDiscount)})`;
  }

  // อธิบาย unit ที่เหลือ
  if (item.remainingUnits > 0) {
    if (description) description += ' + ';
    description += `${item.remainingUnits} unit`;
  }

  return description;
}
