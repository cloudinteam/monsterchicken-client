import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { LocalcartService } from 'src/app/services/localcart.service';
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
    private localCartService: LocalcartService,
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
    // console.log(this.params)
    this.productService.viewProduct(this.params.params).subscribe((r: any) => {
      // console.log(r);
      this.product = r.response.products[0];
      this.getRelatedProducts(this.product);
      this.loading = false;
    });
  }

  getRelatedProducts(product: Product) {
    this.loading = true;
    let latLngData: any = localStorage.getItem('lat_lng');
    let latLng = JSON.parse(latLngData);
    let data = {
      near_by_branch: product.near_by_branch,
      limit: 10,
    };
    this.productService.getRelatedProducts(data).subscribe((r: any) => {
      this.relatedProductsList = r.response.related_products;
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
        unique_token: 'this.localCartService.uniqueToken'
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

  addLocalCart(product: Product) {
    this.disableAdd = true;
    let localCart: any[] = [];
    let cartItem = {
      product_id: product.product_id,
      name: product.name,
      unit: product.unit,
      unitType: product.mc_unit.name,
      imageUrl: [product.image_url[0].file_url],
      max_order_count: product.max_order_count,
      categoryId: product.product_category.product_category_id,
      near_by_branch: product.near_by_branch,
      totalPrice: product.price,
      price: product.price,
      quantity:
        product.cart_product_quantity > 0 ? product.cart_product_quantity : 1,
    };

    if (localStorage.getItem('localCart') != null) {
      let localCart = this.localCartService.getLocalCart;

      var status = localCart.some(function (el: any) {
        return el.product_id === product.product_id;
      });

      if (status) {
        const index = localCart.findIndex((cart: any) => {
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
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item added to cart',
      });
      this.loading = false;
      this.disableAdd = false;
    } else {
      localCart.push(cartItem);
      this.product.cart_product_quantity = cartItem.quantity;
      localStorage.setItem('localCart', JSON.stringify(localCart));
      this.localCartService.setCartTotal();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item added to cart',
      });
      this.loading = false;
      this.disableAdd = false;
    }
  }

  cartNumber($event: any, product: Product) {
    this.disableAdd = true;
    this.loading = true;

    if (this.authService.isLoggedIn()) {
      let data = [
        {
          product_id: product.product_id,
          quantity: ($event.value == null) ? 1 : $event.value,
          near_by_branch: product.near_by_branch,
        },
      ];
      this.cartService.addCart({ carts: data }).subscribe((r: any) => {
        this.cartService.addCartCount();
        // this.alert.fireToastS(r.message[0]);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message[0],
        });
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

    let localCart = this.localCartService.getLocalCart;
    const index = localCart.findIndex((cart: any) => {
      return cart.product_id === product.product_id;
    });

    if ($event.value != 0) {
      localCart[index].quantity = ($event.value == null) ? 1 : $event.value;
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

  afterCart(product: Product) {
    let data = {
      product_id: product.product_id,
      near_by_branch: product.near_by_branch,
    };
    this.productService.viewProduct(data).subscribe((r: any) => {
      this.product = r.response.productDetail;
      this.cdRef.markForCheck();
    });
  }
}
