import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'bullk-order-form',
  templateUrl: './bullk-order-form.component.html',
  styleUrls: ['./bullk-order-form.component.scss'],
})
export class BullkOrderFormComponent implements OnInit {
  loading = false;
  bulkOrderForm!: FormGroup;
  productArray!: FormArray<any>;
  isChecked: boolean = false;
  states: any = [];
  districts: any = [];
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getStates();
    this.getCategoryOptions();
    this.initForm();
    // this.add();
  }

  initForm() {
    this.bulkOrderForm = this.formBuilder.group({
      // bulkOrder: [null, [Validators.required]],
      country: [103, [Validators.required]],
      state: [null, [Validators.required]],
      district: [null, [Validators.required]],
      city: [null, [Validators.required]],
      pinCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.maxLength(6),
          Validators.minLength(6),
        ],
      ],
      institutionName: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z ]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      number1: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      address: ['', [Validators.required, Validators.minLength(15)]],
      quantity: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      // productData: this.formBuilder.array([]),
    });
  }

  // get productFormArray(): FormArray {
  //   return <FormArray>this.bulkOrderForm.get("productData") as FormArray<any>;
  // }

  get productFormArray(): FormArray {
    return this.bulkOrderForm.get('productData') as FormArray<FormGroup>;
  }

  get form(): any {
    return this.bulkOrderForm['controls'];
  }

  // get productDataFormGroup(): FormGroup {
  //   return this.formBuilder.group({
  //     id: [null, [Validators.required]],
  //     category: [null, [Validators.required]],
  //     quantity: [null, [Validators.required]]
  //   });
  // }

  getFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  // add() {
  //   this.productFormArray.push(this.productDataFormGroup);
  // }

  // delete(index: number): void {
  //   this.productFormArray.removeAt(index);
  // }

  getStates() {
    let obj = {
      version: 0.1,
    };
    this.cs.getStates(obj).subscribe((r: any) => {
      this.states = r.response.states;
    });
  }

  getDistricts($event: any) {
    let params = {
      stateId: $event.value,
    };
    this.cs.getDistrict(params).subscribe((r: any) => {
      this.districts = r.response.districts;
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

  getCity($event: any) {
    let obj = {
      stateId: this.form['state'].value,
      districtId: $event.value,
    };
    this.cs.getCity(obj).subscribe((r: any) => {
      this.city = r.response.cities;
    });
  }

  getCategoryOptions() {
    this.productService.getCategoryOptions({}).subscribe((r: any) => {
      // console.debug(r);
      this.categoryOptions = r.response.categories;
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
    if (productForm.value[field] === null) {
      return true;
    }
    return false;
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
        // this.alert.fireToastS(r.message[0]);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message[0],
        });
        this.submitted = false;
        this.bulkOrderForm.reset();
        this.ngOnInit();
      } else {
        // this.alert.fireToastF(r.message[0]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: r.message[0],
        });
      }
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

  optionsProduct($event: any) {
    // console.log($event);
    let data = {
      categoryId: $event.value,
    };
    this.productService.getProductOptions(data).subscribe((r: any) => {
      // console.log(r)
      this.productOptions = r.response.products;
      this.totalProductOptions = r.response.totalProducts;

      if (r.response.products.length == 0) {
        // this.alert.fireToastN('No products', 'Category has no products', 'pi pi-exclamation-circle');
        this.messageService.add({
          severity: 'info',
          summary: 'No products',
          detail: 'Category has no products',
        });
      }

      return r.response.products;
    });
    return [];
  }
}
