import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class InvoiceTemplateComponent {

  @Input() orderInfo: any;
  @ViewChild('invoicePage') content!: ElementRef;
  
  ngOnInit(){
    console.log("HELLO", this.orderInfo);
  }

  printInvoice(){
    window.print();
  }

  public open(){
    document.getElementById('invoicePage')?.classList.add('pop_open');
    // this.content.nativeElement.classList.add('pop_open');
  }

  public close(){
    document.getElementById('invoicePage')?.classList.remove('pop_open');
    // this.content.nativeElement.classList.remove('pop_open');
  }
}
