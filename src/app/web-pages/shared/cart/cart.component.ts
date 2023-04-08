import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

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

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart({}).subscribe((r: any) => {
      // console.log(r);
      this.cart = r.response.cart;
      this.totalCount = r.response.totalCount;
      this.totalCartPrice = r.response.totalCartPrice;
      this.deliveryCharge = r.response.deliveryCharge;
      this.grandTotal = r.response.grandTotal;
      this.cartService.cartCount.next({count: this.totalCount, total: this.totalCartPrice})
      this.loading = false;
    });
  }

  checkout() {
    console.log(this.authService.isLoggedIn());
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.login.emit();
    }
  }

  updated() {
    this.loadCart();
    // console.log('from cart');
  }


}
