import { Component, OnInit } from '@angular/core';
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

  constructor(
    private cartService: CartService
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
      this.loading = false;
    });
  }

  checkout() {

  }

  updated() {
    this.loadCart();
    // console.log('from cart');
  }



}
