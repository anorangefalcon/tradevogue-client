import { Component } from '@angular/core';
import { SalesService } from 'src/app/shared/services/custom-UI/sales.service';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent {
  saleData: any;
  constructor(private salesService: SalesService){
    this.salesService.getSales().subscribe((data: any) => {
      this.saleData = data;
      console.log(this.saleData, "sale data");
    })
  }
}
