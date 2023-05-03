import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  loading = false;
  orders: any[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    this.productService.getOrderHistory().subscribe((r: any) => {
      console.log(r.response);
      this.orders = r.response
      this.loading = false;
    })
  }

  viewInvoice(id: string) {
    // /order/{ orderId } /generate-pdf

    this.productService.getOrderInvoice(id)
    window.open(this.productService.getOrderInvoice(id), '_blank')
    // console.log(this.productService.getOrderInvoice(id))

  }

}
