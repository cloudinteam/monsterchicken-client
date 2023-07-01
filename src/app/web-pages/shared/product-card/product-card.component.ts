import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
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


  }

  addCart(product: Product) {
    this.disableAdd = true;
    this.loading = true;

    let data = {
      product_id: product.product_id,
      branch_user_id: product.near_by_branch,
      quantity: 1,
      unique_token: this.cartService.uniqueToken
    }

    this.cartService.addCart(data).subscribe((r: any) => {
      this.cartService.addCartCount();
      // this.alert.fireToastS('Prooduct added to cart');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product added to cart successfully',
      });
      // this.loaded.emit();
      this.afterCart(product);
      this.loading = false;
      this.disableAdd = false;
    });

  }

  afterCart(product: Product) {
    let data = {
      productId: product.product_id,
      nearByBranch: product.near_by_branch,
    };
    this.productService.viewProduct(data, this.cartService.uniqueToken).subscribe((r: any) => {
      this.product = r.response.products[0];
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

    let data = {
      product_id: product.product_id,
      branch_user_id: product.near_by_branch,
      quantity: ($event.value > 0) ? $event.value : ($event.value <= 0) ?? 1,
      unique_token: this.cartService.uniqueToken
    }

    if ($event.value > 0) {
      this.cartService.addCart(data).subscribe((r: any) => {
        this.cartService.addCartCount();
        // this.alert.fireToastS('Prooduct added to cart');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Cart updated',
        });
        // this.loaded.emit();
        this.afterCart(product);
        this.loading = false;
        this.disableAdd = false;
      });
    } else {
      this.product.cart_product_quantity == 1;
      this.loading = false;
      this.disableAdd = false;
    }


  }

  disableKey(event: KeyboardEvent) {
    event.preventDefault();
  }

}

