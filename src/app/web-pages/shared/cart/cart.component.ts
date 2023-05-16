import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { LocalcartService } from 'src/app/services/localcart.service';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  loading = false;
  itemsLoading = false;
  billLoading = false;
  footerLoading = false;

  cart: any[] = [];
  totalCount: number = 0;
  totalCartPrice: number = 0;
  deliveryCharge: number = 0;
  grandTotal: number = 0;

  @Output() login: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private cartService: CartService,
    private localCartService: LocalcartService,
    private authService: AuthService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.loading = true;

    if (this.authService.isLoggedIn()) {
      // Update Local_Cart to DB
      this.localCartService.pushLocalCartToLive();
      this.loadCart();
    } else {
      this.loadLocalCart();
    }

  }

  loadLocalCart() {
    this.loading = true;

    let cartData: any = localStorage.getItem('localCart');
    let localCart = JSON.parse(cartData)

    this.cart = localCart;
    this.totalCount = localCart.length;
    this.totalCartPrice = this.localCartService.getCartGrandTotal - this.deliveryCharge;
    this.grandTotal = this.localCartService.getCartGrandTotal;

    this.loading = false;

  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe((r: any) => {
      // console.log(r);
      this.cart = r.response.cart;
      this.totalCount = r.response.totalCartCount;
      this.totalCartPrice = r.response.totalCartPrice;
      // this.deliveryCharge = r.response.deliveryCharge;
      this.grandTotal = r.response.grandTotal;
      this.cartService.cartCount.next({ count: this.totalCount, total: this.totalCartPrice })
      this.cartItems();
      this.loading = false;
    });
  }

  checkout() {
    if (this.authService.isLoggedIn() && this.cart != null) {
      let ids: any = localStorage.getItem('cartIds');
      let cartIds = JSON.parse(ids)

      this.close.emit();
      this.router.navigate(['/checkout']);
    } else {
      if (!this.authService.isLoggedIn()) {
        // this.login.emit();
        this.close.emit();
      this.router.navigate(['/checkout']);
      } else if (this.cart == null) {
        this.alert.fireToastF('Cart is empty');
      }
    }
  }

  updated() {
    if (this.authService.isLoggedIn()) {
      this.loadCart();
    } else {
      this.loadLocalCart();
    }
  }

  cartItems() {
    localStorage.removeItem('cartIds');
    let cartIds: any[] = [];
    this.cart.forEach(item => {
      cartIds.push(item.cartId);
    })

    let idString = JSON.stringify(cartIds);
    localStorage.setItem('cartIds', idString);
  }

}
