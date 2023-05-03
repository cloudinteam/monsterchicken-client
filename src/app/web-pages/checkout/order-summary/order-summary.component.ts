import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
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
    // this.loadCart();
    this.loadSummary();
    this.initCouponForm();
    this.activeMenu.checkoutMenu.next('summary');
    this.activeMenu.addressSuccess.next(true);
    this.activeMenu.summarySuccess.next(false);
    this.cartService.cartCount.subscribe(() => {
      this.init();
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
      userId: [localStorage.getItem('userId'), [Validators.required]],
    })
  }
  get couponFormControls(): any {
    return this.couponForm['controls'];
  }

  // loadCart() {
  //   this.loading = true;
  //   this.cartService.getCart({}).subscribe((r: any) => {
  //     this.cart = r.response.cart;
  //     let cartId: any[] = [];
  //     this.cart.forEach( (item: any) => {
  //       // this.cartIds.push(item.cartId);
  //       cartId.push(item.cartId)
  //       this.cdRef.markForCheck();
  //     })
  //     // console.log(cartId);
  //     this.cartIds = cartId;
  //     if (this.cartIds.length = 0) {
  //       this.alert.fireToastF('Cart Empty!');
  //       setTimeout(() => {
  //         this.router.navigate(['/']);
  //       }, 100);
  //     }
  //     this.loadSummary();
  //   });
  // }

  loadSummary() {
    // console.log(this.cartIds);

    let id: any = localStorage.getItem('cartIds');
    let cartIds = JSON.parse(id)

    this.loading = true;
    let data = {
      cartId: cartIds
    }
    console.log(data);
    // let data = {
    //   cartId: ids,
    //   promoCode: this.couponForm.value.promoCode
    // }
    this.checkoutService.getCheckout(data).subscribe((r: any) => {
      this.data = r;
      this.shippingAddress = r.response.isAddressAvailable;
      this.orderSummary = r.response.checkOutData;
      this.totalCount = r.response.totalCount;
      this.totalCartPrice = r.response.totalCartPrice;
      this.deliveryCharge = r.response.deliveryCharge;
      this.grandTotal = r.response.grandTotal;
      this.loading = false;
      this.cdRef.markForCheck();
    })
  }

  applyCoupon() {
    // console.log(this.couponForm.value);
    console.log(this.promoCode)
    // if (this.couponForm.invalid) {
    //   this.submitted = true;
    // }

    this.submitted = true;

    if (this.promoCode !== '') {
      let id: any = localStorage.getItem('cartIds');
      let cartIds = JSON.parse(id)
      let data = {
        cartId: cartIds,
        promoCode: this.promoCode
      }
      console.log(data);
      this.loading = true;
      this.checkoutService.getCheckout(data).subscribe((r: any) => {
        this.data = r;
        this.shippingAddress = r.response.isAddressAvailable;
        this.orderSummary = r.response.checkOutData;
        this.totalCount = r.response.totalCount;
        this.totalCartPrice = r.response.totalCartPrice;
        this.discountPrice = r.response.discountPrice;
        this.deliveryCharge = r.response.deliveryCharge;
        this.grandTotal = r.response.grandTotal;
        this.loading = false;
        this.cdRef.markForCheck();
      })
    } else {
      this.alert.fireToastF('Invalid Promocode')
    }

  }

  validate(field: any) {
    if (
      ((this.couponForm.controls[field].invalid) ||
        (this.couponForm.controls[field].invalid &&
          (this.couponForm.controls[field].dirty ||
            this.couponForm.controls[field].touched))) &&
      this.couponForm.controls[field].errors
    ) {
      return true;
    }
    return false;
  }

}
