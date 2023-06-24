import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {

  loading = false;
  itemsLoading = false;
  billLoading = false;
  footerLoading = false;

  cart: any[] = [];
  totalCount: number = 0;
  totalCartPrice: number = 0;
  deliveryCharge: number = 0;
  grandTotal: number = 0;

  // @Output() login: EventEmitter<any> = new EventEmitter();
  // @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.loading = true;
    this.loadCart();
    this.loading = false;
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe((r: any) => {
      this.cart = r.response.data.carts;
      this.totalCount = r.response.data.total_cart_count;
      this.totalCartPrice = r.response.data.total_cart_price;
      // this.deliveryCharge = r.response.deliveryCharge;
      this.grandTotal = r.response.data.total_cart_price;
      this.cartService.cartCount.next({ count: this.totalCount, total: this.totalCartPrice })
      this.loading = false;
    });
  }

  checkout() {
    this.loading = true;
    this.router.navigateByUrl('/checkout');

    // if (this.authService.isLoggedIn() && this.cart != null) {
    //   console.log('1');
    //   // this.close.emit();
    //   this.loading = false;
    //   this.router.navigate(['/checkout']);
    // } else {
    //   if (!this.authService.isLoggedIn()) {
    //     console.log('2');
    //     // this.login.emit();
    //     // this.close.emit();
    //     this.loading = false;
    //     this.router.navigate(['/checkout']);
    //   } else if (this.cart == null) {
    //     console.log('3');
    //     // this.alert.fireToastF('Cart is empty');
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Cart is empty'
    //     })
    //   }
    // }
  }

  updated() {
    this.loadCart();
  }

}
