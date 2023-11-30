import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Injectable } from '@angular/core';
import { FetchDataService } from '../../services/fetch-data.service';

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

  constructor(private fetchData: FetchDataService){}
  
  ngOnInit(){
    console.log(this.orderInfo);

    if(typeof(this.orderInfo) == 'string'){
        
    }
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
