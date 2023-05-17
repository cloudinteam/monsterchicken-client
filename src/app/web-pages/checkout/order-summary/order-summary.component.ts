import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  loading = false;
  submitted = false;
  cart: any;
  cartIds: any[] = [];

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

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private alert: AlertService,
    private activeMenu: ActiveMenuService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loading = true;
    let id: any = localStorage.getItem('cartIds');
    this.cartIds = JSON.parse(id);

    if (this.cartIds == null) {
      this.alert.fireToastF('Cart empty');
      this.router.navigate(['/']);
    }

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
    let id: any = localStorage.getItem('cartIds');
    var cartIds = JSON.parse(id);
    if (this.cartIds.length == 0 || this.cartIds == null) {
      this.alert.fireToastF('Cart empty');
      this.router.navigate(['/']);
    } else {
      this.loading = true;
      let data = {
        cartId: this.cartIds,
      }

      this.checkoutService.cartSummary().subscribe((r: any) => {
        this.data = r;
        this.shippingAddress = r.response.isAddressAvailable;
        this.orderSummary = r.response.cartData;
        this.totalCount = r.response.totalCount;
        this.totalCartPrice = r.response.grandTotal;
        this.deliveryCharge = r.response.deliveryCharge;
        this.grandTotal = r.response.grandTotal;
        this.discountPrice = 0;
        this.outOfStock = r.response.outOfStock;
        this.submitted = false;
        this.couponForm.patchValue({
          subTotal: this.totalCartPrice
        })

        this.loading = false;
        this.cdRef.markForCheck();
      });
    }
  }

  applyCoupon() {

    this.submitted = true;
    if (this.couponForm.invalid) {
      this.submitted = true;
    }

    if (this.couponForm.value.promoCode !== '') {
      let id: any = localStorage.getItem('cartIds');
      let cartIds = JSON.parse(id);
      let data = {
        promoCode: this.couponForm.value.promoCode,
        subTotal: this.totalCartPrice
      };
      console.log(this.couponForm.value);
      this.loading = true;
      this.checkoutService.promoCode(data).subscribe((r: any) => {
        console.log(r)
        if (r.status) {
          if (r.offer) {
            this.alert.fireToastS(r.message[0]);
            this.promoCodeId = r.offer.offer_id;
            this.discountPrice = r.offer.cart_discount_amount;
            this.grandTotal = this.totalCartPrice - r.offer.cart_discount_amount;
          } else {
            this.couponForm.patchValue({
              promoCode: ''
            })
            this.alert.fireToastF(r.message[0]);
          }
        } else if (!r.status) {
          this.loadSummary();
        }
      }, (error: any) => {
        console.log(error);
      })
    } else {
      this.alert.fireToastF('Invalid Promocode');
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
    let id: any = localStorage.getItem('cartIds');
    let cartIds = JSON.parse(id);
    let data = {
      // cartId: cartIds,
      // addressId: this.shippingAddress.address.id,
      // userId: localStorage.getItem('userId'),
      promoCodeId: this.promoCodeId,
    };
    console.log(data)
    this.checkoutService.cartCheckout(data).subscribe((r: any) => {
      console.log(r);
      if (r.status) {
        localStorage.removeItem('cartIds');
        this.router.navigate(['/checkout/payment/' + r.orderId]);
      }
    });
    this.loading = false;
  }

}
