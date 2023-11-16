import { Component, TemplateRef, ViewChild } from '@angular/core';
import { UtilsModule } from '../utils/utils.module';
import { FetchDataService } from '../shared/services/fetch-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialsService } from '../shared/services/custom-UI/socials.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('hero') hero!: TemplateRef<any>;
  @ViewChild('collection') collection!: TemplateRef<any>;
  @ViewChild('deal') deal!: TemplateRef<any>;
  @ViewChild('latestProducts') latestProducts!: TemplateRef<any>;
  @ViewChild('offers') offers!: TemplateRef<any>;
  @ViewChild('productCarousel') productCarousel!: TemplateRef<any>;

  layout: any[] = [];
  subscribeForm: FormGroup;
  socialsData! : any;
  loading: Boolean = false;

  constructor(private fb: FormBuilder, private backendUrls: UtilsModule, private fetchDataService: FetchDataService, private socialsService: SocialsService) {
    this.subscribeForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
    })
  }

  ngOnInit(){
    this.loading = true;
    this.fetchDataService.HTTPGET(this.backendUrls.URLs.getHomeLayout)
    .subscribe((data: any)=>{
      this.layout = (data.layout).filter((item: any) => item.active);
      this.loading = false;
    });

    this.socialsService.getSocials().subscribe((res:any)=>{
      this.socialsData = res;
    });
    
  }

  async onSubscribe() {
    try {
      const body = {
        email: this.subscribeForm.get('email')?.value
      }
       this.fetchDataService.HTTPPOST(this.backendUrls.URLs.subscribeMail, body)
    }
    catch (error) {
    }
  }

  getTemplate(item: string): TemplateRef<any> {
    switch (item) {
      case 'hero':
        return this.hero;
      case 'collection':
        return this.collection;
      case 'deal':
        return this.deal;
      case 'latestProducts':
        return this.latestProducts;
      case 'offers':
        return this.offers;
      case 'productCarousel':
        return this.productCarousel;
      default:
        return null!;
    }
  }
}
