import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceTemplateComponent {

  @Input() orderInfo: any;
  
  ngOnInit(){
    console.log("HELLO", this.orderInfo);
  }

  printInvoice(){

  }
}
