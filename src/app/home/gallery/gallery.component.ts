import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  constructor(private http: HttpClient) { }

  username: String = '';
  posts: any = [];
  image_loaded: boolean = false;

  // we will expire this later and generate new to save securely.
  accID: String = '17841462170148259';
  access_token: String = 'IGQWROcXZAYQlRfOW95eWp0emVkY1pmYS1vWXA2bV9qZAGx5YW53N1UxQk1YTGJBMzByYl9Db2xydElWNXdaMlp4ZAUt3ekFQal81dzJ2aEJJbDBfbUhUcC1YdU9JaFJsQTVOd1BpY0hrWTBJRGltOU1tSF92U0IwRzQZD';


  ngOnInit() {
    this.http.get('https://graph.instagram.com/' + this.accID + '?fields=username,media&access_token=' + this.access_token).subscribe((data: any) => {

      this.username = data.username;
      let i = 0;
      for (let postID of data.media.data) {
        this.http.get('https://graph.instagram.com/' + postID.id + '?fields=media_type,media_url,permalink&access_token=' + this.access_token)
          .subscribe((data: any) => {
            if(i > 8){
              return;
            }

            if (data.media_type === 'IMAGE' || data.media_type === 'CAROUSEL_ALBUM') {
              i += 1;
              this.posts.push({
                postLink: data.permalink,
                imageLink: data.media_url
              });
            }
            this.image_loaded = true;
          });
      }
    });

  }

}