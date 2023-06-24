import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { NetworkService } from './network.service';
import { EncryptService } from './encrypt.service';
import { AlertService } from './alert.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(
    private http: HttpClient,
    private es: EncryptService,
    private router: Router,
    private alert: AlertService,
    private messageService: MessageService
  ) {}

  hash(): any {
    return localStorage.getItem('_h_key') || '';
    // return localStorage.getItem('userId') || '';
  }

  lat(): any {
    return localStorage.getItem('userLat') || '';
  }

  long(): any {
    return localStorage.getItem('userLong') || '';
  }

  postApiCallAuth(url: string, body: object) {
    let hash = {
      deviceId: this.hash(),
      requestFrom: 'web',
      userLat: this.lat(),
      userLong: this.long(),
      Accept: 'application/json',
      Authorization: 'Bearer ' + NetworkService.authToken(),
    };
    body = Object.assign(hash, body);
    let obj = this.es.dataIn(body);
    return this.http
      .post(url, obj, {
        headers: NetworkService.getAuthHeader(),
      })
      .pipe(
        map((r: any) => {
          let result: any = this.es.unmaskData(r);
          if (result.status == true) {
            return result;
          } else {
            // this.alert.fireToastF(result.message[0]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: result.message[0]
            })
            return result;
          }
        }),
        catchError((err) => {
          let data: any = this.es.unmaskData(err.error);
          if (err.status == 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unauthorized'
            })
            this.router.navigate(['']);
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            location.reload();
          }
          if (err.status == 500 || err.status == 429) {
            // this.alert.fireToastF('Something went wrong');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong'
            })
          }
          if (err.status == 422) {
            // this.alert.fireToastN('Invaid Input', data.message[0], 'pi pi-exclamation-circle');
            this.messageService.add({
              severity: 'info',
              summary: 'Invaid Input',
              detail: data.message[0]
            })
          }

          // this.alert.fireToastF(data.message[0]);
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: data.message[0]
          // })
          return err;
        })
      );
  }

  putApiCallAuth(url: string, body: object) {
    let hash = {
      deviceId: this.hash(),
      requestFrom: 'web',
      userLat: this.lat(),
      userLong: this.long(),
      Accept: 'application/json',
      Authorization: 'Bearer ' + NetworkService.authToken(),
    };
    body = Object.assign(hash, body);
    let obj = this.es.dataIn(body);
    return this.http
      .put(url, obj, {
        headers: NetworkService.getAuthHeader(),
      })
      .pipe(
        map((r: any) => {
          let result: any = this.es.unmaskData(r);
          if (result.status == true) {
            return result;
          } else {
            // this.alert.fireToastF(result.message[0]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: result.message[0]
            })
            return result;
          }
        }),
        catchError((err) => {
          let data: any = this.es.unmaskData(err.error);
          if (err.status == 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unauthorized'
            })
            this.router.navigate(['']);
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            location.reload();
          }
          if (err.status == 500 || err.status == 429) {
            // this.alert.fireToastF('Something went wrong');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong'
            })
          }
          if (err.status == 422) {
            // this.alert.fireToastN('Invaid Input', data.message[0], 'pi pi-exclamation-circle');
            this.messageService.add({
              severity: 'info',
              summary: 'Invaid Input',
              detail: data.message[0]
            })
          }

          // this.alert.fireToastF(data.message[0]);
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: data.message[0]
          // })
          return err;
        })
      );
  }

  postApiCallNoAuth(url: string, body: object) {
    let hash = {
      deviceId: this.hash(),
      requestFrom: 'web',
      userLat: this.lat(),
      userLong: this.long(),
    };
    body = Object.assign(hash, body);
    let obj = this.es.dataIn(body);
    return this.http
      .post(url, obj, {
        headers: NetworkService.getHeader(),
      })
      .pipe(
        map((r: any) => {
          let result: any = this.es.unmaskData(r);
          if (result.status) {
            return result;
          } else {
            // this.alert.fireToastF(result.message[0]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: result.message[0]
            })
            return result;
          }
        }),
        catchError((err) => {
          if (err.status == 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unauthorized'
            })
            this.router.navigate(['']);
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            location.reload();
          }
          if (err.status == 500 || err.status == 429) {
            // this.alert.fireToastF('Something went wrong');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong'
            })
          }
          let data: any = this.es.unmaskData(err.error);
          // this.alert.fireToastF(data.message[0]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.message[0]
          })
          return '';
        })
      );
  }

  getApiCallAuth(url: string): any {
    return this.http
      .get(url, {
        headers: NetworkService.getAuthHeader(),
      })
      .pipe(
        map((r: any) => {
          let result: any = this.es.unmaskData(r);
          if (result.status == true) {
            return result;
          } else {
            // alert('Failed to ' + errMsg + ' ' + result.response.message[0]);
            // this.alert.fireToastF(result.message[0]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: result.message[0]
            })
          }
        }),
        catchError((err) => {
          let data: any = this.es.unmaskData(err.error);
          if (err.status == 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unauthorized'
            })
            this.router.navigate(['']);
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            location.reload();
          }
          if (err.status == 500 || err.status == 429) {
            // this.alert.fireToastF('Something went wrong');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong'
            })
          }
          if (err.status == 422) {
            // this.alert.fireToastN('Invaid Input', data.message[0], 'pi pi-exclamation-circle');
            this.messageService.add({
              severity: 'info',
              summary: 'Invaid Input',
              detail: data.message[0]
            })
          }
          return err;
        })
      );
  }

  postApiCallAuthNE(url: string, body: object) {
    return this.http
      .post(url, body, {
        headers: NetworkService.getAuthHeader(),
      })
      .pipe(
        map((r: any) => {
          if (r.status == true) {
            return r;
          } else {
            // this.alert.fireToastF(r.message[0]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: r.message[0]
            })
          }
        }),
        catchError((err) => {
          if (err.status == 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unauthorized'
            })
            this.router.navigate(['']);
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            location.reload();
          }
          if (err.status == 500 || err.status == 429) {
            // this.alert.fireToastF('Something went wrong');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong'
            })
          }
          return '';
        })
      );
  }

  postApiCallAuthNEE(url: string, body: object) {
    let header = new HttpHeaders({
      Accept: "application/json",
      Authorization: "Bearer " + NetworkService.authToken(),
    }).set('Access-Control-Allow-Origin', '*');
    return this.http
      .post(url, body, {
        headers: header,
      })
      .pipe(
        map((r: any) => {
          let result: any = this.es.unmaskData(r);
          return result;
          // if (r.status == true) {
          //   return r;
          // } else {
          //   this.alert.fireToastF(r.response.message[0]);
          // }
        }),
        catchError((err) => {
          let data: any = this.es.unmaskData(err.error);
          // this.alert.fireToastF(data.message[0]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.message[0]
          })
          return "";
        })
      );
  }

  getApiCallAuthNE(url: string): any {
    return this.http
      .get(url, {
        headers: NetworkService.getAuthHeader(),
      })
      .pipe(
        map((r: any) => {
          return r;
        }),
        catchError((err) => {
          if (err.status == 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unauthorized'
            })
            this.router.navigate(['']);
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            location.reload();
          }
          if (err.status == 500 || err.status == 429) {
            // this.alert.fireToastF('Something went wrong');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong'
            })
          }
          return '';
        })
      );
  }

  deleteApiCallAuth(url: string): any {
    return this.http
      .delete(url, {
        headers: NetworkService.getAuthHeader(),
      })
      .pipe(
        map((r: any) => {
          let result: any = this.es.unmaskData(r);
          if (result.status == true) {
            return result;
          } else {
            // alert('Failed to ' + errMsg + ' ' + result.response.message[0]);
            // this.alert.fireToastF(result.message[0]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: result.message[0]
            })
          }
        }),
        catchError((err) => {
          let data: any = this.es.unmaskData(err.error);
          if (err.status == 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unauthorized'
            })
            this.router.navigate(['']);
            localStorage.removeItem('accessToken');
            sessionStorage.clear();
            location.reload();
          }
          if (err.status == 500 || err.status == 429) {
            // this.alert.fireToastF('Something went wrong');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong'
            })
          }
          if (err.status == 422) {
            // this.alert.fireToastN('Invaid Input', data.message[0], 'pi pi-exclamation-circle');
            this.messageService.add({
              severity: 'info',
              summary: 'Invaid Input',
              detail: data.message[0]
            })
          }
          return err;
        })
      );
  }

}
