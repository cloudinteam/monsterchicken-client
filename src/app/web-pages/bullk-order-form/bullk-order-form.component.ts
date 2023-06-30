import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AlertService } from 'src/app/services/alert.service';
import { ProductService } from 'src/app/services/product.service';
import { MessageService } from 'primeng/api';
import { RegexPattern } from 'src/app/utils/regex';

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

  submitted = false;

  productOptions: any[] = [];

  categoryOptions: any[] = [];

  alphaSpace = RegexPattern.username;
  mail = RegexPattern.email;
  phone = RegexPattern.phone;
  numeric = RegexPattern.onlyNumbers;

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
    this.getBulkProducts();
    this.initForm();
    // this.add();
  }

  initForm() {
    this.bulkOrderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaSpace)]],
      state_id: [null, [Validators.required]],
      district_id: [null, [Validators.required]],
      taluk: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaSpace)]],
      pincode: ['', [Validators.required, Validators.pattern(this.numeric), Validators.maxLength(6), Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(15)]],
      phone_no_1: ['', [Validators.required, Validators.pattern(this.phone), Validators.maxLength(10), Validators.minLength(10)]],
      phone_no_2: ['', [Validators.required, Validators.pattern(this.phone), Validators.maxLength(10), Validators.minLength(10)]],
      mail: ['', [Validators.required, Validators.email, Validators.pattern(this.mail)]],
      message: [''],
      product_id: [null, [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern(this.numeric)]],

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
    this.cs.getStates().subscribe((r: any) => {
      this.states = r.response.states;
    });
  }

  getDistricts($event: any) {
    let params = {
      stateId: $event.value,
    };
    this.cs.getDistrict(params.stateId).subscribe((r: any) => {
      this.districts = r.response.districts;
    });
  }

  getBulkProducts() {
    this.productService.getBulkProductOptions().subscribe((r: any) => {
      this.productOptions = r.response.products;
    })
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

    this.productService.bulkOrderSubmit(this.bulkOrderForm.value).subscribe((r) => {
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
}
