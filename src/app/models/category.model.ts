export interface Category {
  product_category_id: string;
  category: string;
  image_url: [
    {
      file_url: string;
    }
  ]
  product_count: number;
  status: number;
}
