import { Component } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {

  loading = false;
  categories: Category[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadData();
  }

  loadData() {
    this.productService.getCategories().subscribe((r: any) => {
      // console.log(r);
      this.categories = r.categories;
      this.loading = false;
    })
  }

  viewCategory(id: string) {
    console.log('Cat Id'+id);
  }
}
