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
  styleUrls: ['./order-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  deliveryCharge: number = 0;
  grandTotal: number = 0;

  couponForm!: FormGroup;

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
    this.loadCart();
    this.initCouponForm();
    this.activeMenu.checkoutMenu.next('summary');
    this.activeMenu.addressSuccess.next(true);
    this.activeMenu.summarySuccess.next(false);
    this.cartService.cartCount.subscribe(() => {
      this.init();
    })
  }

  init() {
    this.loadCart();
    this.initCouponForm();
  }

  initCouponForm() {
    this.couponForm = this.formBuilder.group({
      couponCode: ['', [Validators.required]],
      userId: [localStorage.getItem('userId'), [Validators.required]],
    })
  }
  get couponFormControls(): any {
    return this.couponForm['controls'];
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart({}).subscribe((r: any) => {
      this.cart = r.response.cart;
      let cartId: any[] = [];
      this.cart.forEach( (item: any) => {
        this.cartIds.push(item.cartId);
        cartId.push(item.cartId)
        this.cdRef.markForCheck();
      });
      if (this.cartIds.length = 0) {
        this.alert.fireToastF('Cart Empty!');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 100);
      }
      this.loadSummary(cartId)
    });
  }

  loadSummary(ids: any = []) {
    this.loading = true;
    this.checkoutService.getCheckout({ cartId: ids }).subscribe((r: any) => {
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
    if (this.couponForm.invalid) {
      this.submitted = true;
    }


  }

}
