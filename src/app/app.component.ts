import { Component } from '@angular/core';
import { SocialsService } from './shared/services/custom-UI/socials.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  'title': 'tradevogue';

  constructor(private brandService: SocialsService) { }

  ngOnInit(): void {

    // this.brandService.getSocials().subscribe((data: any)=>{
    //   console.log(data, 'heree');
    // })
      
  }

}