import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent implements OnInit {
  relatedProductsList: Product[] = [];
  loading = false;
  product_id: string = '';
  product!: Product;
  params!: any;
  disableAdd = false;

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 3,
      showNavigators: true,
      showIndicators: false,
    },
    {
      breakpoint: '990px',
      numVisible: 2,
      numScroll: 2,
      showNavigators: false,
      showIndicators: true,
    },
    {
      breakpoint: '600px',
      numVisible: 1,
      numScroll: 1,
      showNavigators: false,
      showIndicators: true,
    },
  ]

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 2500,
    // navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false,
    dots: true,
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private cdRef: ChangeDetectorRef,
    private alert: AlertService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.cartService.productLoad$.subscribe((r) => {
      if (r == true) {
        this.init();
      } else {
        this.init();
      }
    });
  }

  init() {
    this.loading = true;
    this.product_id = this.route.snapshot.paramMap.get('id') || '';
    this.params = this.route.snapshot.queryParamMap || '';
    // this.params = this.router.getCurrentNavigation()
    this.getProduct();
  }

  getProduct() {
    this.productService.viewProduct(this.params.params, this.cartService.uniqueToken).subscribe((r: any) => {
      this.product = r.response.products[0];
      // console.log(this.product)
      this.getRelatedProducts(this.product);
      this.loading = false;
    });
  }

  getRelatedProducts(product: Product) {
    this.loading = true;
    let data = {
      near_by_branch: product.near_by_branch,
      uniqueToken: this.cartService.uniqueToken
    };
    this.productService.getRelatedProducts(data).subscribe((r: any) => {
      this.relatedProductsList = r.response.products;
      const index = this.relatedProductsList.findIndex((product: any) => {
        return product.product_id === this.product.product_id;
      });
      this.relatedProductsList.splice(index, 1);
      this.cdRef.markForCheck();
      this.loading = false;
    });
  }

  addCart(product: Product) {
    this.disableAdd = true;
    this.loading = true;
    let data = {}
    if (this.authService.isLoggedIn()) {
      data = {
        product_id: product.product_id,
        branch_user_id: product.near_by_branch,
        quantity: 1,
      }
    }

    if (!this.authService.isLoggedIn()) {
      data = {
        product_id: product.product_id,
        branch_user_id: product.near_by_branch,
        quantity: 1,
        unique_token: this.cartService.uniqueToken
      }
    }
    this.cartService.addCart(data).subscribe((r: any) => {
      this.cartService.addCartCount();
      // this.alert.fireToastS('Prooduct added to cart');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item added to cart',
      });
      // this.loaded.emit();
      this.afterCart(product);
      this.loading = false;
      this.disableAdd = false;
    });

  }

  cartNumber($event: any, product: Product) {
    this.disableAdd = true;
    this.loading = true;

    let data = {}
    if (this.authService.isLoggedIn()) {
      data = {
        product_id: product.product_id,
        branch_user_id: product.near_by_branch,
        quantity: $event.value,
      }
    }

    if (!this.authService.isLoggedIn()) {
      data = {
        product_id: product.product_id,
        branch_user_id: product.near_by_branch,
        quantity: $event.value,
        unique_token: this.cartService.uniqueToken
      }
    }

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

  }

  afterCart(product: Product) {
    let data = {
      productId: product.product_id,
      nearByBranch: product.near_by_branch,
    };
    this.productService.viewProduct(data, this.cartService.uniqueToken).subscribe((r: any) => {
      this.product = r.response.products[0];
      this.cdRef.markForCheck();
    });
  }
}
