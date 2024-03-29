import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, map } from 'rxjs';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { NetworkService } from 'src/app/services/network.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  loading = false;
  submitted = false;
  cart: any;

  data: any;
  orderSummary: any;
  shippingAddress: any;
  totalCount: number = 0;
  totalCartPrice: number = 0;
  discountPrice: number = 0;
  deliveryCharge: number = 0;
  grandTotal: number = 0;

  couponForm!: FormGroup;
  promoCode: string = '';
  promoCodeId: string = '';
  outOfStock: boolean = true;
  placeOrderBtn: boolean = false;
  paymentMethod = '';

  currectDate: Date = new Date();
  tomorrowDate: Date = new Date();
  selectedDate = (this.currectDate.getHours() < 19) ? 'today' : 'tomorrow';

  deliverySlot = {
    schedule_date: '',
    schedule_from_time: '',
    schedule_to_time: ''
  };

  currentUser = {
    email: '',
    gender: '',
    name: '',
    number: null,
  }

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private alert: AlertService,
    private activeMenu: ActiveMenuService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private productService: ProductService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.tomorrowDate.setDate(this.currectDate.getDate() + 1);

    // console.log((this.currectDate.getHours() >= 14 && this.currectDate.getHours() < 16));

    (this.currectDate.getHours() >= 8 && this.currectDate.getHours() < 10) ? this.selectedSlot(this.currectDate, '08:00:00', '10:00:00'): '';
    (this.currectDate.getHours() >= 10 && this.currectDate.getHours() < 12) ? this.selectedSlot(this.currectDate, '10:00:00', '12:00:00'): '';
    (this.currectDate.getHours() == 12 && this.currectDate.getHours() < 14) ? this.selectedSlot(this.currectDate, '12:00:00', '14:00:00'): '';
    (this.currectDate.getHours() >= 14 && this.currectDate.getHours() < 16) ? this.selectedSlot(this.currectDate, '14:00:00', '16:00:00'): '';
    (this.currectDate.getHours() >= 16 && this.currectDate.getHours() < 19) ? this.selectedSlot(this.currectDate, '16:00:00', '19:00:00'): '';
    (this.currectDate.getHours() >= 19 && this.currectDate.getHours() > 19) ? this.selectedSlot(this.tomorrowDate, '08:00:00', '10:00:00'): '';

    this.placeOrderBtn = false;
    this.loading = true;

    // this.loadCart();
    this.loadSummary();
    this.initCouponForm();
    this.activeMenu.checkoutMenu.next('summary');
    this.activeMenu.addressSuccess.next(true);
    this.activeMenu.summarySuccess.next(false);
    this.cartService.cartCount.subscribe(() => {
      this.init();
    });
    this.cartService.productLoad$.subscribe((r) => {
      if (r == true) {
        this.loadSummary()
      }
    })
    this.cdRef.markForCheck();
  }

  init() {
    // this.loadCart();
    this.initCouponForm();
    this.loadCurrentUser();
  }

  initCouponForm() {
    this.couponForm = this.formBuilder.group({
      promoCode: ['', [Validators.required]],
      subTotal: [null, [Validators.required]],
      userId: [localStorage.getItem('userId'), [Validators.required]],
    });
  }
  get couponFormControls(): any {
    return this.couponForm['controls'];
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

  loadSummary() {

    this.checkoutService.cartSummary().subscribe((r: any) => {
      this.data = r;
      this.shippingAddress = r.response.is_address_available;
      this.orderSummary = r.response.cart_data;
      this.totalCount = r.response.totalCount;
      this.totalCartPrice = r.response.grand_total;
      this.deliveryCharge = r.response.delivery_charge;
      this.grandTotal = r.response.grand_total;
      this.discountPrice = 0;
      this.outOfStock = r.response.outOfStock;
      this.submitted = false;
      this.couponForm.patchValue({
        subTotal: this.totalCartPrice
      })

      this.loading = false;
      this.cdRef.markForCheck();
      if (this.orderSummary.length <= 0) {
        this.router.navigate(['/account/order-history']);
      }
    });
    // }
  }

  applyCoupon() {

    this.submitted = true;
    if (this.couponForm.invalid) {
      this.submitted = true;
    }

    if (this.couponForm.value.promoCode !== '') {
      let data = {
        promo_code: this.couponForm.value.promoCode,
        sub_total: this.totalCartPrice
      }
      this.loading = true;
      this.checkoutService.promoCode(data).subscribe((r: any) => {
        if (r.status) {
          if (r.offer) {
            // this.alert.fireToastS(r.message[0]);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              // detail: r.message[0],
              detail: 'Promo code applied successfully'
            })
            this.promoCode = this.couponFormControls.promoCode.value;
            this.promoCodeId = r.offer.offer_id;
            this.discountPrice = r.offer.cart_discount_amount;
            this.grandTotal = this.totalCartPrice - r.offer.cart_discount_amount;
            this.submitted = false;
            this.couponForm.patchValue({
              promoCode: ''
            })
          } else {
            this.couponForm.patchValue({
              promoCode: ''
            })
            // this.alert.fireToastF(r.message[0]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: r.message[0]
            })
          }
        } else if (!r.status) {
          this.loadSummary();
        }
      }, (error: any) => {
        console.log(error);
      })
    } else {
      // this.alert.fireToastF('Invalid Promocode');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Promocode'
      })
    }
    this.loading = false;
  }

  validate(field: any) {
    if (
      (this.couponForm.controls[field].invalid ||
        (this.couponForm.controls[field].invalid &&
          (this.couponForm.controls[field].dirty ||
            this.couponForm.controls[field].touched))) &&
      this.couponForm.controls[field].errors
    ) {
      return true;
    }
    return false;
  }

  selectedSlot(date: Date, from: string, to: string) {
    this.deliverySlot = {
      schedule_date: date.toISOString().slice(0,10),
      schedule_from_time: from,
      schedule_to_time: to
    }
  }

  checkout() {
    this.placeOrderBtn = true;
    this.loading = true;
    if (this.paymentMethod == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Choose payment method'
      })
      this.placeOrderBtn = false;
    } else if (this.deliverySlot.schedule_from_time == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Choose delivery slot'
      })
      this.placeOrderBtn = false;
    } else {
      let data = {
        promo_code_id: this.promoCodeId,
        schedule_date: this.deliverySlot.schedule_date,
        schedule_from_time: this.deliverySlot.schedule_from_time,
        schedule_to_time: this.deliverySlot.schedule_to_time
      }
      this.checkoutService.cartCheckout(data).subscribe((r: any) => {
        if (r.status) {
          this.deliverySlot = {
            schedule_date: '',
            schedule_from_time: '',
            schedule_to_time: ''
          }
          // this.router.navigate(['/checkout/payment/' + r.orderId]);
          this.payment(r.orderId);
        }
      });
    }
    this.loading = false;
  }

  async payment(orderId: string) {
    this.loading = true;
    if (this.paymentMethod == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Choose payment method'
      })
      this.placeOrderBtn = false;
    }

    if (this.paymentMethod == "cash_on_delivery") {
      let data = {
        order_id: orderId,
        amount: this.grandTotal,
        status: 'COD',
        method: "cash_on_delivery",
      }

      this.checkoutService.payment(data, orderId).subscribe((r: any) => {
        if (r.status) {
          this.cartService.addCartCount();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order placed'
          })
          this.router.navigate(['/account/order-history']);
          this.loading = false;
          this.placeOrderBtn = false;
        }
      })
    }

    if (this.paymentMethod == "online_pay") {
      let data = {
        order_id: orderId,
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
        mtx: orderId
      })

      try {
        const data = await this.checkoutService.onlinePayment(body);
        console.log(data); // 'Data from Promise'
      } catch (error) {
        console.error(error); // Handle errors if necessary
      }

      // this.checkoutService.onlinePayment(body).subscribe((r: any) => {
      //   console.log(r);
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

  removePromo() {
    this.loading = true;
    this.promoCode = '';
    this.promoCodeId = '';
    this.loadSummary();
  }

}
