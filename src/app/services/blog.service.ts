import { Injectable } from '@angular/core';
import { ApiCallService } from './api-call.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private api: ApiCallService,
  ) { }

  getPosts(page: number = 1) {
    return this.api.getApiCallAuth(NetworkService.getPosts(page));
  }

  viewPost(id: string) {
    return this.api.getApiCallAuth(NetworkService.viewPost(id));
  }

}
