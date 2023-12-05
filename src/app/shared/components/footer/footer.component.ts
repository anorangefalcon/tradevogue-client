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

  socialsData!: any;
  theme: Boolean = false;

  constructor(private routerService: RouterLinksService,
    private router: Router,
    private socialsService: SocialsService,
    private fetchDataService: FetchDataService, private backendUrls: UtilsModule) {
    this.fetchDataService.themeColor$.subscribe((color) => {
      this.theme = color;
    })
  }

  ngOnInit() {
    (<HTMLMetaElement>document.getElementById('meta-description')).content = "TradeVogue Terms & Conditions"
    this.socialsService.getSocials().subscribe((data: any) => {
      this.socialsData = data;
    });
    const body = {
      parameter: "all"
    }
    this.fetchDataService.HTTPPOST(this.backendUrls.URLs.uniqueProductFields, body).subscribe(
      (data: any) => {
        this.categories = data.data.category;
      }
    )


  }


  categories: [] = [];
  show(el: any) {
    if (el == 'profile') {
      this.routerService.updateShowData('profile');
    }
    else {
      this.routerService.updateShowData('orders');
    }

  }


}
