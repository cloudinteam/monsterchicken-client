export interface Product {

  productId: string;
  productName: string;
  stock: number;
  maxQuantity: number;
  categoryName: string;
  categoryId: string;
  price: number;
  discountPrice: number;
  description: string;
  productUnit: number;
  productUnitType: string;
  status: number;
  wishlist: boolean;
  cartlist: boolean;
  cartProductQuantity: number;
  imageUrl: any[];
  nearByBranch: string;
  brand: string;
  brandId: string;
}

