import { CartService } from 'src/app/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  catId: string = '';
  loading = true;
  productList: Product[] = [];
  categories: any[] = [];
  selectedCategory: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private titleService: Title,
    private metaService: Meta,
  ) {

  }

  ngOnInit(): void {

    this.route.params.subscribe((r) => {
      this.catId = this.route.snapshot.paramMap.get('id') || '';
      this.getProduct(this.catId);
      this.cartService.addCartCount();
    })

    this.cartService.productLoad$.subscribe((r) => {
      if (r == true) {
        this.init();
      }
    })

    // this.loading = false;
  }

  init() {
    this.loading = true;
    this.catId = this.route.snapshot.paramMap.get('id') || '';
    this.getProduct(this.catId);
  }

  getProduct(catId: any) {
    this.loading = true;
    let latLngData: any = localStorage.getItem('lat_lng');
    let latLng = JSON.parse(latLngData)
    let data = {
      category: catId,
      userLat: latLng.lat || '',
      userLong: latLng.lng || '',
      uniqTkn: this.cartService.uniqueToken
    };
    // console.log(data);
    this.productService.getProducts(data.userLat, data.userLong, data.category, data.uniqTkn).subscribe((r: any) => {
      // console.log(r);
      this.productList = r.response.products;
      this.categories = r.response.categories;
      const index = this.categories.findIndex((category: any) => {
        this.titleService.setTitle(category.meta_tag.title_tag);
        this.metaService.updateTag({ name: 'title', content: category.meta_tag.title_tag });
        this.metaService.updateTag({ name: 'keywords', content: category.meta_tag.keywords });
        this.metaService.updateTag({ name: 'description', content: category.meta_tag.description });
        return category.selected === true;
      });
      this.selectedCategory = this.categories[index].category;
      this.loading = false;
    });
  }

}
