import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-career-page',
  templateUrl: './career-page.component.html',
  styleUrls: ['./career-page.component.scss']
})
export class CareerPageComponent implements OnInit {

  loading = false;
  careerForm!: FormGroup;
  submitted = false;
  files: File[] = [];
  fileError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private cs: CommonService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.careerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)] ],
      email: ['', [Validators.required, Validators.email]],
      number: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10), Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(15)] ],
      message: [null],
      resume: [null]
    })
  }

  get form(): any {
    return this.careerForm['controls'];
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

  onSelect(event: any) {
    // console.log(event.target.files[0]);
    let size = event.target.files[0].size;
    let type = event.target.files[0].type;

    if (type != "application/pdf") {
      this.fileError = 'Only PDF format accepted';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Only PDF format accepted'
      })
    }

    if (size > 2621440) {
      this.fileError = 'The file should be below 2.5MB';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The file should be below 2.5MB'
      })
    }

    if (size < 2621440 && type == "application/pdf") {
      this.fileError = '';
      this.files.push(event.target.files[0]);
      this.cdRef.markForCheck();
      this.fileUpload();
    }

  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  fileUpload() {
    const formData = new FormData();
    formData.append('uploadFile', this.files[0]);
    this.cs.upload(formData).subscribe((r) => {
      // console.log(r);
      // this.profileImage = r.response.previewUrl;
      this.careerForm.patchValue({ resume: r.response.url });
    })
  }

  careerSubmit() {

    this.submitted = true;

    if (this.careerForm.invalid) {
      return;
    } else {
      console.log(this.careerForm.value);
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
