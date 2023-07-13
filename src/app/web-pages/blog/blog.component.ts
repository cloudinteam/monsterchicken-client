import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  loading = false;
  blog: any[] = [];

  first: number = 1;
  rows: number = 10;
  total: number = 120;

  constructor(
    private posts: BlogService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.loading = true;
    this.init();
  }

  onPageChange(event: any) {
    this.first = event.page + 1;
    this.rows = event.rows;
    // console.log(event)
    this.blog = [];
    this.init();
  }

  init() {
    this.loading = true;

    this.posts.getPosts(this.first).subscribe((r: any) => {
      // console.log(r);
      this.blog = r.response.Post.data;
      this.total = r.response.Post.total;
      this.loading = false;

    })
  }

  viewBlog(id: string) {
    console.log(id);
    this.router.navigate(['/blog/' + id]);
  }

}
