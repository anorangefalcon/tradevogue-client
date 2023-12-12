import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UtilsModule } from 'src/app/utils/backend-urls';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  constructor(private http: HttpClient, private backendUrls: UtilsModule) {}

  username: String = '';
  posts: any = [];
  images_loaded: boolean = false;

  accID!: String;
  access_token!: String;

  ngOnInit() {
   this.http.get((this.backendUrls.URLs.getInstagram)).subscribe((data: any) => {
      this.username = data.username;
      this.posts = data.posts;
      this.images_loaded = true;
    });
  }

}