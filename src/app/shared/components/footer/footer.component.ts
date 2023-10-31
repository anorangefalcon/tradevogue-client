import { Component } from '@angular/core';
import { RouterLinksService } from '../../services/router-links.service';
import { Router } from '@angular/router';
import { SocialsService } from '../../services/custom-UI/socials.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent {

  socialsData! : any;

  constructor(private routerService: RouterLinksService, private router: Router, private socialsService: SocialsService) {}

  ngOnInit(){
    this.socialsService.getSocials().subscribe((data:any)=>{
      this.socialsData = data;
    });
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
