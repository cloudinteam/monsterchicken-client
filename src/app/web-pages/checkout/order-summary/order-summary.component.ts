import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
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
  cart: any;
  cartIds: any[] = [];

  data: any;
  orderSummary: any;
  shippingAddress: any;
  totalCount: number = 0;
  totalCartPrice: number = 0;
  deliveryCharge: number = 0;
  grandTotal: number = 0;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private alert: AlertService,
    private activeMenu: ActiveMenuService,
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.activeMenu.checkoutMenu.next('summary');
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
      this.data = r.response;
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

}
