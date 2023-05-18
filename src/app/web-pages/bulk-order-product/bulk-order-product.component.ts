import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'bulk-order-product',
  templateUrl: './bulk-order-product.component.html',
  styleUrls: ['./bulk-order-product.component.scss']
})
export class BulkOrderProductComponent implements OnInit {

  @Input() categoryOptions: any = [];
  @Input() submitted: boolean = false;
  @Input() index!: number;
  @Input() productForm!: FormGroup;

  @Output() delete: EventEmitter<any> = new EventEmitter();

  productOptions: any = [];

  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit(): void {

  }

  getFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  remove(index: number) {
    this.delete.emit(index);
  }

  getProductsOptions($event: any) {
    this.productService.getProductOptions({ categoryId: $event.value }).subscribe((r: any) => {
      console.log(r);
      this.productOptions = r.response.products;
    })
  }

  public keyPressNumbers(w: any) {
    var charCode = w.which ? w.which : w.keyCode;
    if (charCode < 48 || charCode > 57) {
      w.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
