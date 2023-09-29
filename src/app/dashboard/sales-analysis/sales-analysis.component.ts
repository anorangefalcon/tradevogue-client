import { Component } from '@angular/core';

@Component({
  selector: 'app-sales-analysis',
  templateUrl: './sales-analysis.component.html',
  styleUrls: ['./sales-analysis.component.css']
})
export class SalesAnalysisComponent {
  data: any[] = [1,2,3,4,5,6];
  selectedoptions: any = 2;

  result(e: any){
    console.log(e);
  }
}
