import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { RegexPattern } from 'src/app/utils/regex';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  loading = false;

  files: File[] = [];
  profileForm!: FormGroup;
  submitted = false;
  profileImage = '';
  editImage = false;
  @Output() closeModel: EventEmitter<any> = new EventEmitter();

  nameRegex = RegexPattern.username;
  mail = RegexPattern.email;

  constructor(
    private formBuilder: FormBuilder,
    private commonServeice: CommonService,
    private authService: AuthService,
    private alert: AlertService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.initForm();
    this.authService.profile({}).subscribe((r: any) => {
      this.profileForm.patchValue({
        email: r.response.userDetail.email,
        image: r.response.userDetail.image,
        gender: r.response.userDetail.gender,
        name: r.response.userDetail.name,
        number: r.response.userDetail.number,
      });
      if (r.response.userDetail.previewUrl == '') {
        this.editImage = true;
      }
      if (r.response.userDetail.previewUrl != '' || r.response.userDetail.previewUrl != null) {
        this.profileImage = r.response.userDetail.previewUrl;
      }
    })
    this.loading = false;
  }

  initForm() {
    this.profileForm = this.formBuilder.group({
      userId: [localStorage.getItem('userId'), [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.mail)]],
      number: [null, [Validators.pattern(/^[6-9]\d{9}$/), Validators.maxLength(10), Validators.minLength(10),Validators.required]],
      image: [null],
      gender: ['', [Validators.required]],
    });
  }
  get profileFormControl(): any {
    return this.profileForm['controls'];
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    this.cdRef.markForCheck();
    this.fileUpload();
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  fileUpload() {
    const formData = new FormData();
    formData.append('uploadFile', this.files[0]);
    this.commonServeice.upload(formData).subscribe((r) => {
      this.profileImage = r.response.previewUrl;
      this.profileForm.patchValue({ image: r.response.url });
      this.editImage = false;
    })
  }

  submit() {
    if (this.profileForm.invalid) {
      this.submitted = true;
    } else {
      this.authService.profileEdit(this.profileForm.value).subscribe((r: any) => {
        if (r.status) {
          // this.alert.fireToastS(r.message[0]);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            // detail: r.message[0]
            detail: 'Profile updated successfully'
          })
          this.closeModel.emit();
        }
      });
    }

  }

}
