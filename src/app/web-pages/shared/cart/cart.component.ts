import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert.service';
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
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private alert: AlertService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadCart();
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
      this.loading = false;
    });
  }

  checkout() {
    if (this.authService.isLoggedIn() && this.cart != null) {
      this.close.emit();
      this.router.navigate(['/checkout']);
    } else {
      if (!this.authService.isLoggedIn()) {
        // this.login.emit();
        this.close.emit();
      this.router.navigate(['/checkout']);
      } else if (this.cart == null) {
        // this.alert.fireToastF('Cart is empty');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Cart is empty'
        })
      }
    }
  }

  updated() {
    this.loadCart();
  }

}
