export interface Product {
  product_id: string;
  name: string;
  stock: number;
  max_order_count: number;
  product_category: {
    category: string,
    category_code: string,
    image_url: [
      {
        file_name: string,
        file_url: string
      }
    ],
    product_type: string,
    status: number,
    product_category_id: string
  };
  price: {
    product_type: string,
    price: number,
    price_id: string
  };
  total_cart_price: number;
  description: string;
  mc_unit: {
    name: string,
    code: string,
    status: number,
    unit_id: string
  };
  unit: number;
  status: number;
  cart_product_quantity: number;
  image_url: [
    {
      file_name: string,
      file_url: string
    }
  ];
  near_by_branch: string;
  brand: {
    brand: string,
    brand_code: string,
    brand_image: {
      file_name: string,
      file_url: string
    },
    status: number,
    brand_id: string,
    states: [
      {
        name: string,
        value: number,
        code: string
      }
    ]
  };
  brand_id: number;
}

