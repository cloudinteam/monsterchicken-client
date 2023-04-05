export interface Product {

  productId: string;
  productName: string;
  stock: number;
  maxQuantity: number;
  categoryName: string;
  categoryId: string;
  price: string;
  discountPrice: string;
  description: string;
  unit: string;
  status: number;
  wishlist: boolean;
  cartlist: boolean;
  cartProductQuantity: number;
  imageUrl: any[];

}

