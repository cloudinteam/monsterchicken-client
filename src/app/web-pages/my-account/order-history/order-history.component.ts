import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    this.productService.getOrderHistory().subscribe((r: any) => {
      this.orders = r.response.orders;
      this.loading = false;
    })
  }

  viewInvoice(id: string) {
    // this.productService.getOrderInvoice(id).subscribe((r: any) => {
    //   console.log(r)
    // })
    window.open(this.productService.getOrderInvoice(id), '_blank')
  }

  paymentBtn(order: any) {
    if (order.payment == null) {
      return true
    }
    if (order.payment != null) {
      if (order.payment.captured == 0 && order.payment.method == 'cash_on_delivery') {
        return false;
      }
      if (order.payment.captured == 0 && order.payment.method == 'online_pay') {
        return true;
      }
    }
    return false;
  }

  pay(id: string) {
    this.router.navigate(['/checkout/payment/' + id]);
  }

}
