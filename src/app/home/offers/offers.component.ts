import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SalesService } from 'src/app/shared/services/custom-UI/sales.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./offers.component.css']
})
export class OffersComponent {
  saleData: any;
  color: any = 'white';
  isHovered: boolean = false;
  constructor(public salesService: SalesService,private router:Router){
    this.salesService.getSales().subscribe((data: any) => {

      data.forEach((element: any) => {
        element['hover'] = false;
      });
      
      this.saleData = data;
    })
  }

  getLink(link: any){
   link= link.split('/').slice(3);
   let navigateUrl=''
    link.forEach((el:any,i:number)=>{
      navigateUrl+=el;
      if(i!=link.length-1){
        navigateUrl+='/'
      }
    })   
    this.router.navigateByUrl(navigateUrl);
  }
}
