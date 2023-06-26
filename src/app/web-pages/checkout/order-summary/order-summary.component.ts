import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
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
  paymentMethod = '';

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private alert: AlertService,
    private activeMenu: ActiveMenuService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
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
              detail: r.message[0]
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

  checkout() {
    this.loading = true;
    if (this.paymentMethod == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Choose payment method'
      })
    } else {
      let data = {
        promo_code: this.promoCodeId,
      }
      this.checkoutService.cartCheckout(data).subscribe((r: any) => {
        if (r.status) {
          // this.router.navigate(['/checkout/payment/' + r.orderId]);
          this.payment(r.orderId);
        }
      });
    }
    this.loading = false;
  }

  payment(orderId: string) {
    this.loading = true;
    if (this.paymentMethod == '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Choose payment method'
      })
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
        }
      })

    }

  }

  removePromo() {
    this.loading = true;
    this.promoCode = '';
    this.promoCodeId = '';
    this.loadSummary();
  }

}
