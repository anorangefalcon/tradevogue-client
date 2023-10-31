import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLinksService } from '../../services/router-links.service';
import { Router } from '@angular/router';
import { SocialsService } from '../../services/custom-UI/socials.service';
import { FetchDataService } from '../../services/fetch-data.service';
import { UtilsModule } from 'src/app/utils/utils.module';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent {

  socialsData! : any;

  constructor(private routerService: RouterLinksService, private router: Router, private socialsService: SocialsService, private fetchDataService : FetchDataService, private backendUrls : UtilsModule) {}

  ngOnInit(){
    this.socialsService.getSocials().subscribe((data:any)=>{
      this.socialsData = data;
    });
    const body = {
      parameter : "all"
    }
    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.uniqueProductFields, body).subscribe(
      (data: any) => {
        this.categories = data.data.category;
      }
    )
  }

  @ViewChild('cancellation') cancellation!: ElementRef;

  categories : [] = [];


  scrollToElementInComponentB() {  
    console.log(this.cancellation.nativeElement);
    
    // if (this.cancellation) {
    //   console.log("inside");
      
    //   this.cancellation.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
  }

  
  show(el: any) {
    if (el == 'profile') {
      
      this.routerService.updateShowData('profile');
      console.log("show data called by order history")
    }

    else {
    
      this.routerService.updateShowData('orders');
      console.log("show data called by order history")
    }
    
  }

}
