import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  @Input() showCategory = true;
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
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {

    if (localStorage.getItem('localCart') != null) {
      this.disableAdd = true;
      let localCart = this.localCartService.getLocalCart
      localCart.forEach((cartItem: any) => {
        if (cartItem.productId == this.product.product_id) {
          this.product.cart_product_quantity = cartItem.quantity;
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
          productId: product.product_id,
          nearByBranch: product.near_by_branch,
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
      product_id: product.product_id,
      name: product.name,
      unit: product.unit,
      unitType: product.mc_unit.name,
      image_url: [product.image_url[0].file_url],
      max_order_count: product.max_order_count,
      categoryId: product.product_category.product_category_id,
      near_by_branch: product.near_by_branch,
      totalPrice: product.price.price,
      price: product.price,
      quantity: (product.cart_product_quantity > 0) ? product.cart_product_quantity : 1,
    }

    if (localStorage.getItem('localCart') != null) {

      let localCart = this.localCartService.getLocalCart

      var status = localCart.some(function(el: any) {
        return (el.product_id === product.product_id);
      });

      if (status) {
        const index = localCart.findIndex( (cart: any) => {
          return cart.product_id === product.product_id;
        });
        ++localCart[index].quantity;
        this.product.cart_product_quantity = localCart[index].quantity;
      } else if (!status) {
        localCart.push(cartItem);
        this.product.cart_product_quantity = cartItem.quantity;
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
      this.product.cart_product_quantity = cartItem.quantity;
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
      product_id: product.product_id,
      near_by_branch: product.near_by_branch,
    };
    this.productService.viewProduct(data).subscribe((r: any) => {
      this.product = r.response.productDetail;
    });
  }

  viewProduct(product: Product) {
    this.router.navigate(['/product/' + product.product_id], { queryParams: { productId: product.product_id, nearByBranch: product.near_by_branch, } });
    this.cdRef.markForCheck();
  }

  viewCat(id: string) {
    this.router.navigate(['/category/' + id]);
    this.cdRef.markForCheck();
  }

  cartNumber($event: any, product: Product) {
    // console.log($event.value, id);
    this.disableAdd = true;
    this.loading = true;


    if (this.authService.isLoggedIn()) {
      let data = [{
        product_id: product.product_id,
        quantity: $event.value,
        near_by_branch: product.near_by_branch,
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
      return cart.productId === product.product_id;
    });

    if ($event.value != 0) {
      localCart[index].quantity = $event.value;
      localCart[index].totalPrice = $event.value * localCart[index].price;
    } else {
      localCart.splice(index, 1);
      this.product.cart_product_quantity = 0;
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

