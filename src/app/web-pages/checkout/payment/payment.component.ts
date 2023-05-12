import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  loading = false;
  orderId: string = '';

  totalCount: number = 0;
  totalCartPrice: number = 0;
  discountPrice: number = 0;
  deliveryCharge: number = 0;
  grandTotal: number = 0;

  paymentMethod = '';

  constructor(
    private cdRef: ChangeDetectorRef,
    private activeMenu: ActiveMenuService,
    private activatesRoute: ActivatedRoute,
    private productService: ProductService,
    private checkoutService: CheckoutService,
    private alertService: AlertService,
    private router: Router,
  ) {
    this.activeMenu.checkoutMenu.next('payment');
    this.activeMenu.addressSuccess.next(true);
    this.activeMenu.summarySuccess.next(true);
    this.cdRef.markForCheck();
  }

  ngOnInit(): void {

    this.activatesRoute.params.subscribe(() => {
      this.orderId = this.activatesRoute.snapshot.paramMap.get('orderId') || '';
      this.getOrderDetail(this.orderId);
    })

    // this.activeMenu.checkoutMenu.next('payment');
    // this.activeMenu.addressSuccess.next(true);
    // this.activeMenu.summarySuccess.next(true);
    this.loading = false;
    this.cdRef.markForCheck();
  }

  getOrderDetail(orderId: string) {
    this.productService.getOrderDetail(orderId).subscribe((r: any) => {
      console.log(r);
      this.totalCartPrice = r.response.total_amount;
      this.discountPrice = r.response.order.offers?.discount_amount;
      this.deliveryCharge = r.response.order.delivery_charge;
      this.grandTotal = r.response.order.grand_total;
    })
  }

  payment() {

    if (this.paymentMethod == '') {
      this.alertService.fireToastF('Choose payment method');
    }

    if (this.paymentMethod == "cash_on_delivery") {
      let data = {
        order_id: this.orderId,
        amount: this.grandTotal,
        status: 'COD',
        method: "cash_on_delivery",
      }

      this.checkoutService.payment(data).subscribe((r: any) => {
        console.log(r);

        if (r.status) {
          this.alertService.fireToastS('Order placed');
          this.router.navigate(['/']);
        }
      })

    }

  }

}
