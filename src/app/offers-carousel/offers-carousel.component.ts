import { Component } from '@angular/core';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { UtilsModule } from '../utils/utils.module';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-offers-carousel',
  templateUrl: './offers-carousel.component.html',
  styleUrls: ['./offers-carousel.component.css']
})
export class OffersCarouselComponent {
//   allOffers:any[]=[];
//   translate:Boolean=false;
//   currentIndex:number=1;
//   Previousarray:any[]=[];
//   RightArray:any[]=[];
//   createArray(){
//     console.log('currentIndex is ',this.currentIndex);
    
//     this.Previousarray=new Array(this.currentIndex).fill(0);
//     this.RightArray=new Array(this.allOffers.length-(this.currentIndex+this.Previousarray.length));
//     console.log('right array length is ',this.RightArray);
    
//   }

//   // In your Angular component
// entries = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

//   constructor(private fetchdataService:FetchDataService,private BackendUrls:UtilsModule){
//     this.fetchdataService.HTTPGET(this.BackendUrls.URLs.getOffers).subscribe((data:any) => {
//       this.allOffers = data;
//       console.log('ALLOFfer sis ',this.allOffers);
//       this.createArray();
      
//     });
//   }


//   ChangeIndex(index:any){
//     console.log('hello---->');
    
//     this.translate=true;
//     setTimeout(()=>{
//       this.currentIndex=index;
//       // this.translate=false;
//     },2000)
//   }
customOptions: any = {
  loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: true,
  navSpeed: 700,
  navText: ['', ''],
  responsive: {
    0: {
      items: 1
    },
    400: {
      items: 2
    },
    740: {
      items: 3
    },
    940: {
      items: 4
    }
  },
  nav: true
}


}
