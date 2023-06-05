import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  loading = false;
  contactForm!: FormGroup;
  states: any = [];
  districts: any = [];
  submitted = false;

  mapMarker: google.maps.LatLngLiteral = {
    lat: 11.232943,
    lng: 78.159087,
  }
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    clickable: false,
  }
  zoom = 17;

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
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)] ],
      email: ['', [Validators.required, Validators.email]],
      number: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(10), Validators.minLength(10)]],
      company: ['', [Validators.minLength(3)] ],
      message: [null],
    })
  }

  get form(): any {
    return this.contactForm['controls'];
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

  contactFormSubmit() {

    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    } else {
      this.formsService.submitContactForm(this.contactForm.value).subscribe((r: any) => {
        if (r.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'We received your query',
            detail: 'We will contact you shortly'
          })
          this.submitted = false;
          this.contactForm.reset();
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
