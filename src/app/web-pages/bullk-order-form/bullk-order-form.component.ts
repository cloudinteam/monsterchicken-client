import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'bullk-order-form',
  templateUrl: './bullk-order-form.component.html',
  styleUrls: ['./bullk-order-form.component.scss'],
})
export class BullkOrderFormComponent implements OnInit {

  loading = false;
  bulkOrderForm!: FormGroup;
  productArray!: FormArray<any>
  isChecked: boolean = false;
  states: any = [];
  city: any = [];
  country: any = [];
  selectedState: any = null;
  bulkOrder: any = [];
  submitted = false;

  productOptions: any[] = [];
  prPage = 1;
  prLoading = false;
  totalProductOptions!: number;
  prOptLoaded = false;

  categoryOptions: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cs: CommonService,
    private alert: AlertService,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getStates();
    // this.getCountry();
    this.getCategoryOptions();
    // this.getProductOptions();
    this.initForm();
    this.add();
  }

  initForm() {
    this.bulkOrderForm = this.formBuilder.group({
      // bulkOrder: [null, [Validators.required]],
      country: [103, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(6), Validators.minLength(6),] ],
      institutionName: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)] ],
      email: ['', [Validators.required, Validators.email]],
      number1: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10), Validators.minLength(10)] ],
      // number2: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10), Validators.minLength(10)] ],
      address: ['', [Validators.required, Validators.minLength(15)] ],
      productData: this.formBuilder.array([]),
      // productData: new FormArray([ new FormControl("")])
    })
  }

  // get productFormArray(): FormArray {
  //   return <FormArray>this.bulkOrderForm.get("productData") as FormArray<any>;
  // }

  get productFormArray(): FormArray {
    return this.bulkOrderForm.get("productData") as FormArray;
  }

  get form(): any {
    return this.bulkOrderForm['controls'];
  }

  get productDataFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]]
    });
  }

  add() {
    this.productFormArray.push(this.productDataFormGroup);
  }

  delete(index: number): void {
    this.productFormArray.removeAt(index);
  }

  getStates() {
    let obj = {
      version: 0.1,
    };
    this.cs.getStates(obj).subscribe((r: any) => {
      this.states = r.response.states;
    });
  }

  getCountry() {
    let obj = {
      version: 1,
    };

    this.cs.getCountry(obj).subscribe((r: any) => {
      this.country = r.response.countries;
    });
  }

  getCategoryOptions() {
    this.productService.getCategoryOptions({}).subscribe((r: any) => {
      // console.debug(r);
      this.categoryOptions = r.response.categories;
    })
  }

  loadProductOptions($event: any) {
    console.log($event);
    this.getProductOptions($event.value);
  }

  onChangeHandler(selectedState: any) {
    this.selectedState = selectedState;
    this.selectedState === null ? '' : this.getCity();
  }

  getCity() {
    let obj = {
      stateId: this.selectedState,
    };

    this.cs.getCity(obj).subscribe((r: any) => {
      this.city = r.response.cities;
    });
  }

  validate(field: any) {
    if (
      ((this.isChecked && this.bulkOrderForm.controls[field].invalid) ||
        (this.bulkOrderForm.controls[field].invalid &&
          (this.bulkOrderForm.controls[field].dirty ||
            this.bulkOrderForm.controls[field].touched))) &&
      this.bulkOrderForm.controls[field].errors
    ) {
      return true;
    }
    return false;
  }

  validateProduct(productForm: any, field: any) {

    if (
      productForm.value[field] === null
    ) {
      return true;
    }
    return false

  }

  bulkOrderSubmit() {
    this.submitted = true;
    if (this.bulkOrderForm.invalid) {

      this.isChecked = true;
      return;
    }

    let obj = {
      bulkOrderDetails: this.bulkOrderForm.value,
    };

    this.productService.bulkOrderSubmit(obj.bulkOrderDetails).subscribe((r) => {
      if (r.status) {
        this.alert.fireToastS(r.message[0]);
        this.submitted = false;
        this.bulkOrderForm.reset();
        this.ngOnInit();
      } else this.alert.fireToastF(r.message[0]);
    });
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

  optionsProduct(categoryId: string): [] {

    let data = {
      categoryId: categoryId,
    };
    this.productService.getProductOptions(data).subscribe((r: any) => {
      // console.log(r)
      this.totalProductOptions = r.response.totalProducts;

      if (r.response.products.length == 0) {
        this.alert.fireToastN('No products' ,'Category has no products', 'pi pi-exclamation-circle');
      }

      return r.response.products;
    });
    return [];
  }

  // ================================================================================================
  // Product Options
  // ================================================================================================
  getProductOptions(categoryId: string) {
    let data = {
      categoryId: categoryId,
    };
    this.productService.getProductOptions(data).subscribe((r: any) => {
      this.productOptions = [];
      this.productOptions = r.response.products;
      // console.log(r)
      this.totalProductOptions = r.response.totalProducts;

      if (this.productOptions.length == 0) {
        this.alert.fireToastN('No products' ,'Category has no products', 'pi pi-exclamation-circle');
      }

      // this.role = r.role;
      // if(!this.edit) {
      //   this.initOptions(this.role);
      // }
      this.cdRef.markForCheck();
    });
  }
  onProductScroll(productSelect: NgSelectComponent) {
    // console.log("SCroll Triggered");
    if (this.productOptions.length < this.totalProductOptions) {
      this.loadMoreProductOptions(productSelect);
    }
  }
  onProductScrollEnd(productSelect: NgSelectComponent) {
    if (this.productOptions.length < this.totalProductOptions) {
      this.loadMoreProductOptions(productSelect);
    }
  }
  loadMoreProductOptions(productSelect: NgSelectComponent) {
    // productSelect.close();
    this.prPage++;
    let data = {
      page: this.prPage,
    };

    this.productService.getProductOptions(data).subscribe((r: any) => {
      if (r.response.products.length > 0) {
        this.prLoading = true;

        r.response.products.forEach((product: any) => {
          if (!this.productOptions.find((p) => p.id == product.id)) {
            this.productOptions.push(product);
          }
        });

        let len = this.productOptions.length;
        let more = this.productOptions.slice(
          len,
          r.response.products.length + len
        );

        // using timeout here to simulate backend API delay
        setTimeout(() => {
          this.prLoading = false;
          this.productOptions = this.productOptions.concat(more);
        }, 200);
        this.cdRef.markForCheck();
      }
      this.cdRef.markForCheck();
    });
  }
  searchPr($event: any) {
    // console.log($event);
    let data = {
      page: 1,
      search: $event.term,
    };

    this.productService.getProductOptions(data).subscribe((r: any) => {
      // console.log(r);
      if (r.response.products.length > 0) {
        this.productOptions = [];
        this.productOptions = r.response.products;

        let len = this.productOptions.length;
        let more = this.productOptions.slice(
          len,
          r.response.products.length + len
        );

        // using timeout here to simulate backend API delay
        setTimeout(() => {
          this.prOptLoaded = false;
          this.productOptions = this.productOptions.concat(more);
          // console.info(this.productOptions);
        }, 200);
        this.cdRef.markForCheck();
      }
    });
  }
  poOpen(productSelect: NgSelectComponent) {
    // if (!this.prOptLoaded) {
    //   this.prPage = 0;
    //   this.productOptions = [];
    //   this.loadMoreProductOptions(productSelect);
    // }
    // this.prOptLoaded = true;
    // this.cdRef.markForCheck();
  }



}
