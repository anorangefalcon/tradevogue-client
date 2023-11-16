import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SocialsService } from 'src/app/shared/services/custom-UI/socials.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  constructor(private http: HttpClient, private socialService: SocialsService) { }

  username: String = '';
  posts: any = [];
  image_loaded: boolean = false;

  accID!: String;
  access_token!: String;

  ngOnInit() {
    this.socialService.getSocials().subscribe((socialData: any) => {
      this.accID = socialData.instagram.accountID;
      this.access_token = socialData.instagram.accessToken;

      this.fetchFromMeta();
    })
  }

  fetchFromMeta() {
    this.http.get('https://graph.instagram.com/' + this.accID + '?fields=username,media&access_token=' + this.access_token).subscribe((data: any) => {
      this.username = data.username;
      let i = 0;
      for (let postID of data.media.data) {
        this.http.get('https://graph.instagram.com/' + postID.id + '?fields=media_type,media_url,permalink&access_token=' + this.access_token)
          .subscribe((data: any) => {

            if (i > 8) {
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