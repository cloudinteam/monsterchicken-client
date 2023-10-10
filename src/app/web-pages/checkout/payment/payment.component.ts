import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, map } from 'rxjs';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { NetworkService } from 'src/app/services/network.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  loading = false;
  orderId: string = '';
  data!: any;

  totalCount: number = 0;
  totalCartPrice: number = 0;
  discountPrice: number = 0;
  deliveryCharge: number = 0;
  grandTotal: number = 0;

  paymentMethod = '';

  currentUser = {
    email: '',
    gender: '',
    name: '',
    number: null,
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private activeMenu: ActiveMenuService,
    private activatesRoute: ActivatedRoute,
    private productService: ProductService,
    private checkoutService: CheckoutService,
    private alertService: AlertService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
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

    this.loadCurrentUser();

    // this.activeMenu.checkoutMenu.next('payment');
    // this.activeMenu.addressSuccess.next(true);
    // this.activeMenu.summarySuccess.next(true);
    this.loading = false;
    this.cdRef.markForCheck();
  }

  getOrderDetail(orderId: string) {
    this.productService.getOrderDetail(orderId).subscribe((r: any) => {
      this.data = r;
      this.totalCartPrice = r.response.total_amount;
      this.discountPrice = r.response.order.discount_amount;
      this.deliveryCharge = r.response.order.delivery_charge;
      this.grandTotal = r.response.order.total_amount;
    })
  }

  loadCurrentUser() {
    this.authService.profile({}).subscribe((r: any) => {
      this.currentUser = {
        email: r.response.userDetail.email,
        gender: r.response.userDetail.gender,
        name: r.response.userDetail.name,
        number: r.response.userDetail.number,
      }
    })
  }

  async payment() {

    if (this.paymentMethod == '') {
      // this.alertService.fireToastF('Choose payment method');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Choose payment method'
      })

    }

    if (this.paymentMethod == "cash_on_delivery") {
      let data = {
        order_id: this.orderId,
        amount: this.grandTotal,
        status: 'COD',
        method: "cash_on_delivery",
      }

      this.checkoutService.payment(data, this.orderId).subscribe((r: any) => {
        if (r.status) {
          // this.alertService.fireToastS('Order placed');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order placed'
          })
          this.router.navigate(['/account/order-history']);
        }
      })

    }

    if (this.paymentMethod == "online_pay") {
      let data = {
        order_id: this.orderId,
        amount: this.grandTotal,
        status: 'Online Payment',
        method: "online_pay",
      }

      let body = JSON.stringify({
        amount: this.grandTotal,
        udf: 'status',
        contact_number: this.currentUser.number,
        email_id: this.currentUser.email,
        currency: 'INR',
        mtx: this.orderId
      })

      try {
        const data = await this.checkoutService.onlinePayment(body);
        console.log(data); // 'Data from Promise'
      } catch (error) {
        console.error(error); // Handle errors if necessary
      }

      // this.checkoutService.onlinePayment(body).subscribe((r: any) => {
        // console.log(r);
        // if (r.status) {
        //   // this.alertService.fireToastS('Order placed');
        //   this.messageService.add({
        //     severity: 'success',
        //     summary: 'Success',
        //     detail: 'Order placed'
        //   })
        //   this.router.navigate(['/account/order-history']);
        // }
      // })
    }

  }

}
