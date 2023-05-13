import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const Toast2 = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  constructor() { }

  fireToastS(title: string) {
    Toast.fire({
      icon: 'success',
      // iconHtml: '<img src="../assets/img/success.svg" width="20px"/>',
      title: title,
    });
  }
  fireToastF(title: string) {
    Toast.fire({
      icon: 'error',
      // iconHtml: '<img src="../assets/img/fail.svg" width="20px"/>',
      title: title,
      color: '#EF4739',
    });
  }

  // fireToastN(title: any, description: any, img: any) {
  //   Toast.fire({
  //     // icon: 'error',
  //     iconHtml:
  //       '<img src="' +
  //       img.toString() +
  //       '" width="50px; border-color: #0000;"/>',
  //     title: title,
  //     // text:description,
  //     color: '#333',
  //   });
  // }

  fireToastN(title: any, description: any, icon: any) {
    Toast.fire({
      // icon: 'error',
      iconHtml:
        '<i class="' +
        icon.toString() +
        '" width="50px; border-color: #0000;"></i>',
      title: title,
      // text:description,
      color: '#333',
    });
  }

  fireToastButtom(title: any) {
    Toast2.fire({
      icon: 'success',
      // iconHtml: '<img src="../assets/img/success.svg" width="20px"/>',
      title: title,
    });
  }

  fireClose() {
    Swal.fire({
      title: 'Comming Soon!',
      // html: 'I will close in <b></b> milliseconds.',
      iconHtml: '<img src="../../assets/img/appstore.svg" width="100px"/>',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }
}
