import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  loading = false;
  orders: any[] = [
    {
        order_id: "yVEeJhDttf2vE7Z4p8RhSw==",
        order_number: "MCO1",
        total_price: 64,
        created_at: "2023-04-20T12:49:12.000000Z",
        status: "Packing for Delivery",
        status_code: 2
    },
    {
        order_id: "LzBk_IDmI5f6yuhu5S1LUw==",
        order_number: "MCO2",
        total_price: 500,
        created_at: "2023-04-20T12:49:30.000000Z",
        status: "Packing for Delivery",
        status_code: 2
    }
];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    this.productService.getOrderHistory().subscribe((r: any) => {
      console.log(r);
      this.loading = false;
    })
  }

  viewOrder(id: string) {
    console.log(id);
  }

}
