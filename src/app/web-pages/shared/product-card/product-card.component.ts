import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { LocalcartService } from 'src/app/services/localcart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent implements OnInit {

  @Input() product!: Product;
  @Output() loaded: EventEmitter<any> = new EventEmitter();

  loading = false;
  cartQuantity: number = 0;
  cartProductCount: number = 0;
  disableAdd = false;

  constructor(
    private cartService: CartService,
    private localCartService: LocalcartService,
    private alert: AlertService,
    private router: Router,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private messageService: MessageService,
  ) {

  }

  ngOnInit(): void {

    if (localStorage.getItem('localCart') != null) {
      this.disableAdd = true;
      let localCart = this.localCartService.getLocalCart
      localCart.forEach((cartItem: any) => {
        if (cartItem.productId == this.product.productId) {
          this.product.cartProductQuantity = cartItem.quantity;
        }
      })
      this.disableAdd = false;
    }
  }

  addCart(product: Product) {
    this.disableAdd = true;
    this.loading = true;

    if (this.authService.isLoggedIn()) {
      let data = {
          productId: product.productId,
          nearByBranch: product.nearByBranch,
          quantity: 1,
        };
      this.cartService.addCart({carts:[data]}).subscribe((r: any) => {
        this.cartService.addCartCount();
        // this.alert.fireToastS('Item added to cart');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item added to cart'
        })
        // this.loaded.emit();
        this.afterCart(product);
        this.loading = false;
        this.disableAdd = false;
      });
    }

    if (!this.authService.isLoggedIn()) {
      this.addLocalCart(product);
    }

  }

  addLocalCart(product: Product) {
    this.disableAdd = true;

    let localCart: any[] = [];
    let cartItem = {
      productId: product.productId,
      productName: product.productName,
      unit: product.productUnit + product.productUnitType,
      maxQuantity: product.maxQuantity,
      categoryId: product.categoryId,
      nearByBranch: product.nearByBranch,
      totalPrice: product.price,
      quantity: (product.cartProductQuantity > 0) ? product.cartProductQuantity : 1,
    }

    if (localStorage.getItem('localCart') != null) {

      let localCart = this.localCartService.getLocalCart

      var status = localCart.some(function(el: any) {
        return (el.productId === product.productId);
      });

      if (status) {
        const index = localCart.findIndex( (cart: any) => {
          return cart.productId === product.productId;
        });
        ++localCart[index].quantity;
        this.product.cartProductQuantity = localCart[index].quantity;
      } else if (!status) {
        localCart.push(cartItem);
        this.product.cartProductQuantity = cartItem.quantity;
      }

      localStorage.setItem('localCart', JSON.stringify(localCart));
      this.localCartService.setCartTotal();
      // this.alert.fireToastS('Item added to cart');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item added to cart'
      })
      this.loading = false;
      this.disableAdd = false;
    } else {
      localCart.push(cartItem);
      this.product.cartProductQuantity = cartItem.quantity;
      localStorage.setItem('localCart', JSON.stringify(localCart));
      this.localCartService.setCartTotal();
      // this.alert.fireToastS('Item added to cart');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item added to cart'
      })
      this.loading = false;
      this.disableAdd = false;
    }


  }



  afterCart(product: Product) {
    let data = {
      productId: product.productId,
      nearByBranch: product.nearByBranch,
    };
    this.productService.viewProduct(data).subscribe((r: any) => {
      this.product = r.response.productDetail;
    });
  }

  viewProduct(product: Product) {
    this.router.navigate(['/product/' + product.productId], { queryParams: { productId: product.productId, nearByBranch: product.nearByBranch, } });
  }

  viewCat(id: string) {
    this.router.navigate(['/category/' + id]);
  }

  cartNumber($event: any, product: Product) {
    // console.log($event.value, id);
    this.disableAdd = true;
    this.loading = true;


    if (this.authService.isLoggedIn()) {
      let data = [{
        productId: product.productId,
        quantity: $event.value,
        nearByBranch: product.nearByBranch,
      }];
      this.cartService.addCart({carts:data}).subscribe((r: any) => {
        this.cartService.addCartCount();
        // this.alert.fireToastS(r.message[0]);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message[0]
        })
        // this.loaded.emit();
        this.afterCart(product);
        this.loading = false;
        this.disableAdd = false;
      });
    }

    if (!this.authService.isLoggedIn()) {
      this.cartLocalCount($event, product);
    }

  }

  cartLocalCount($event: any, product: Product) {
    this.disableAdd = true;
    let localCart = this.localCartService.getLocalCart
    const index = localCart.findIndex( (cart: any) => {
      return cart.productId === product.productId;
    });

    if ($event.value != 0) {
      localCart[index].quantity = $event.value;
    } else {
      localCart.splice(index, 1);
      this.product.cartProductQuantity = 0;
    }

    if (localCart.length > 0) {
      localStorage.setItem('localCart', JSON.stringify(localCart));
    } else {
      localStorage.removeItem('localCart');
    }

    this.localCartService.setCartTotal();
    this.loading = false;
    this.disableAdd = false;

  }

}

