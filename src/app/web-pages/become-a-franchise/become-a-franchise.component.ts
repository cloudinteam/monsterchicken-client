import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'become-a-franchise',
  templateUrl: './become-a-franchise.component.html',
  styleUrls: ['./become-a-franchise.component.scss']
})
export class BecomeAFranchiseComponent implements OnInit {

  loading = false;
  becomeFranchise!: FormGroup;
  states: any = [];
  districts: any = [];
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private cs: CommonService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.getStates();
    this.initForm();
  }

  initForm() {
    this.becomeFranchise = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)] ],
      email: ['', [Validators.required, Validators.email]],
      number: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10), Validators.minLength(10)]],
      state: [null, [Validators.required]],
      district: [null, [Validators.required]],
      pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(6), Validators.minLength(6),] ],
      address: ['', [Validators.required, Validators.minLength(15)] ],
      message: [null],
    })
  }

  get form(): any {
    return this.becomeFranchise['controls'];
  }

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
      stateId: $event.value
    }
    this.cs.getDistrict(params).subscribe((r: any) => {
      this.districts = r.response.districts;
    })
  }

  keyPressNumbers(w: any) {
    var charCode = w.which ? w.which : w.keyCode;
    if (charCode < 48 || charCode > 57) {
      w.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  franchiseSubmit() {

    this.submitted = true;

    if (this.becomeFranchise.invalid) {
      return;
    } else {
      console.log(this.becomeFranchise.value);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form submitted check console'
      })
    }



    /* this.productService.bulkOrderSubmit(obj.bulkOrderDetails).subscribe((r) => {
      if (r.status) {
        // this.alert.fireToastS(r.message[0]);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: r.message[0]
        })
        this.submitted = false;
        this.becomeFranchise.reset();
        this.ngOnInit();
      } else {
        // this.alert.fireToastF(r.message[0]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: r.message[0]
        })
      }
    }); */
  }


}
