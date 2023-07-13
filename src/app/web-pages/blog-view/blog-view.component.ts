import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.scss']
})
export class BlogViewComponent implements OnInit {

  loading = false;
  blog: any;
  postt_id: string = '';

  constructor(
    private posts: BlogService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.postt_id = this.route.snapshot.paramMap.get('id') || '';
    this.loading = true;
    this.init();
  }

  init() {
    this.loading = true;

    this.posts.viewPost(this.postt_id).subscribe((r: any) => {
      console.log(r);
      this.blog = r.response.post;
      this.loading = false;
    })
  }

}
