import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransformOptions } from 'filestack-js';
import { ImageTransformPipe } from 'src/app/shared/Pipe/image-transform.pipe';
@Component({
  standalone: true,
  selector: 'app-hero',

  imports: [CommonModule, CarouselModule, RouterModule, ImageTransformPipe],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeroComponent {

  bannerData: any;
  transformOptions: TransformOptions = {

    resize: {
      height: 1000
    },
    pjpg: {
      quality: 60,
      metadata: true,
    }
  };

  constructor(private bannerService: BannerService, private imageService: ImageUploadService, private router: Router) { }

  ngOnInit() {
    this.bannerService.getBanners().subscribe((data: any) => {
      this.bannerData = data.filter((banner: any) => banner['active'] == true)
    })

  }

  getLink(link: string) {
    const toLink = '/' + link.split('/')[3];
    this.router.navigateByUrl(toLink);
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    navSpeed: 400,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
}
