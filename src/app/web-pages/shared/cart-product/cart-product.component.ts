import { AuthService } from 'src/app/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { LocalcartService } from 'src/app/services/localcart.service';

@Component({
  selector: 'cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.scss']
})
export class CartProductComponent implements OnInit {

  @Input() cartItem: any;
  @Input() itemNo: number = 1;
  @Output() update: EventEmitter<any> = new EventEmitter();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private localCartService: LocalcartService,
  ) {

  }

  ngOnInit(): void {

  }

  cartNumber($event: any, cartItem: Product, cartId: string) {
    // console.log($event.value);
    // console.log(productId);
    // console.log(cartId);

    if (this.authService.isLoggedIn()) {
      let data = [{
        cartId: cartId,
        productId: cartItem.productId,
        quantity: $event.value,
        nearByBranch: cartItem.nearByBranch,
      }];
      this.cartService.addCart({carts: data}).subscribe((r: any) => {
        this.update.emit();
      });
    } else if (!this.authService.isLoggedIn()) {
      console.log(1)
      let localCart = this.localCartService.getLocalCart

      const index = localCart.findIndex( (cart: any) => {
        return cart.productId === cartItem.productId;
      });

      if ($event.value != 0) {
        localCart[index].quantity = $event.value;
      } else {
        localCart.splice(index, 1);
      }

      if (localCart.length > 0) {
        localStorage.setItem('localCart', JSON.stringify(localCart));
      } else {
        localStorage.removeItem('localCart');
      }

      this.localCartService.setCartTotal();
      this.update.emit();
    }


  }

  removeItem(productId: string) {
    let data = [{
      productId: productId,

      status: 'remove'
    }];
    this.cartService.addCart({carts: data}).subscribe((r: any) => {
      this.update.emit();
    });
  }


}
