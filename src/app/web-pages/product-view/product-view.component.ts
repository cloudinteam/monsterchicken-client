import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  relatedProductsList: Product[] = []
  loading = false;
  productId: string = '';
  product!: any;
  params!: any;
  disableAdd = false;

  responsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '990px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '600px',
        numVisible: 1,
        numScroll: 1
    }
];

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
  ) { }

  ngOnInit(): void {

    this.cartService.productLoad$.subscribe((r) => {
      if (r == true) {
        this.init();
      } else {
        this.init();
      }
    })

  }

  init() {
    this.loading = true;
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.params = this.route.snapshot.queryParamMap || '';
    this.getProduct();
  }

  getProduct() {
    this.productService.viewProduct(this.params.params).subscribe((r: any) => {
      this.product = r.response.productDetail;
      this.getRelatedProducts(this.product)
      this.loading = false;
    });
  }

  getRelatedProducts(product: Product) {
    this.loading = true;
    let latLngData: any = localStorage.getItem('lat_lng');
    let latLng = JSON.parse(latLngData)
    let data = {
      nearByBranch: product.nearByBranch,
      limit: 10
    }
    this.productService.getRelatedProducts(data).subscribe((r: any) => {
      this.relatedProductsList = r.response.related_products;
      const index = this.relatedProductsList.findIndex( (product: any) => {
        return product.productId === this.product.productId;
      });
      this.relatedProductsList.splice(index, 1);
      this.cdRef.markForCheck();
      this.loading = false;
    });
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
        // this.alert.fireToastS('Prooduct added to cart');
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
      unit: product.productUnit,
      unitType: product.productUnitType,
      imageUrl: [product.imageUrl[0]],
      maxQuantity: product.maxQuantity,
      categoryId: product.categoryId,
      nearByBranch: product.nearByBranch,
      totalPrice: product.price,
      price: product.price,
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
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item added to cart'
      })
      this.loading = false;
      this.disableAdd = false;
    }

  }

  cartNumber($event: any, product: Product) {
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
      localCart[index].totalPrice = $event.value * localCart[index].price;
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

  afterCart(product: Product) {
    let data = {
      productId: product.productId,
      nearByBranch: product.nearByBranch,
    };
    this.productService.viewProduct(data).subscribe((r: any) => {
      this.product = r.response.productDetail;
      this.cdRef.markForCheck();
    });
  }
}
