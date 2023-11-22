import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SalesService } from 'src/app/shared/services/custom-UI/sales.service';
import { RouterModule } from '@angular/router';

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
  constructor(public salesService: SalesService){
    this.salesService.getSales().subscribe((data: any) => {

      console.log(data, "offer data");
      

      data.forEach((element: any) => {
        element['hover'] = false;
      });
      
      this.saleData = data;
    })
  }
}
