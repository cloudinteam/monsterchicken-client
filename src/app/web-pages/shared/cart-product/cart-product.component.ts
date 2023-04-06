import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

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
  ) {

  }

  ngOnInit(): void {

  }

  cartNumber($event: any, productId: string, cartId: string) {
    // console.log($event.value);
    // console.log(productId);
    // console.log(cartId);
    let data = {
      productId: productId,
      quantity: $event.value
    };
    this.cartService.addCart(data).subscribe((r: any) => {
      this.update.emit();
    });
  }

  removeItem(productId: string) {
    let data = {
      productId: productId,
      status: 'remove'
    };
    this.cartService.addCart(data).subscribe((r: any) => {
      this.update.emit();
    });
  }


}
