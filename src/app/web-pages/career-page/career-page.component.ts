import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { FormsService } from 'src/app/services/forms.service';
import { RegexPattern } from 'src/app/utils/regex';

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

  alphaSpace = RegexPattern.username;
  mailPattern = RegexPattern.email;
  phone = RegexPattern.phone;

  constructor(
    private formBuilder: FormBuilder,
    private cs: CommonService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private formsService: FormsService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.careerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.alphaSpace)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.mailPattern)]],
      number: ['', [Validators.required, Validators.pattern(this.phone), Validators.maxLength(10), Validators.minLength(10)]],
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
      this.fileError = 'Only PDF file accepted';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Only PDF file accepted'
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
      this.formsService.submitCareerForm(this.careerForm.value).subscribe((r: any) => {
        if (r.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'We received your query',
            detail: 'We will contact you shortly'
          })
          this.submitted = false;
          this.careerForm.reset();
          this.ngOnInit();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: r.message[0]
          })
        }
      });
    }
  }

}
