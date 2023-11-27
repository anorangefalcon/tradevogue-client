import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BannerService } from 'src/app/shared/services/custom-UI/banner.service';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeroComponent {

  bannerData : any;

  constructor (private bannerService: BannerService, private router: Router) {}

  ngOnInit(){    
    this.bannerService.getBanners().subscribe((data: any) => {      
      this.bannerData = data.filter((banner: any)=> banner['active'] == true)      
    })

  }
  
  getLink(link: string){
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
