import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private commonServeice: CommonService,
    private authService: AuthService,
    private alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.authService.profile({}).subscribe((r: any) => {
      console.log(r);
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
  }

  initForm() {
    this.profileForm = this.formBuilder.group({
      userId: [localStorage.getItem('userId'), [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      number: [null, [Validators.maxLength(13),Validators.required]],
      image: [null],
      gender: ['', [Validators.required]],
    });
  }
  get profileFormControl(): any {
    return this.profileForm['controls'];
  }

  onSelect(event: any) {
    // console.log(event);
    this.files.push(...event.addedFiles);
    this.fileUpload();
  }

  onRemove(event: any) {
    // console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  fileUpload() {
    console.log('uploader');
    const formData = new FormData();
    formData.append("uploadFile", this.files[0]);
    this.commonServeice.upload(formData).subscribe((r) => {
      console.log(r);
      this.profileImage = r.response.previewUrl;
      this.profileForm.patchValue({ image: r.response.url });
      this.editImage = false;
    })
  }

  submit() {

    if (this.profileForm.invalid) {
      this.submitted = true;
      // return true;
    }
    this.authService.profileEdit(this.profileForm.value).subscribe((r: any) => {
      if (r.status) {
        this.alert.fireToastS(r.message[0]);
        this.closeModel.emit();
      }
    });
  }

}
