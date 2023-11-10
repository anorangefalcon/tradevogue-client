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
  constructor(private salesService: SalesService){
    this.salesService.getSales().subscribe((data: any) => {
      this.saleData = data;
    })
  }
}
