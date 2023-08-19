import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.css']
})
export class CardTemplateComponent {

  // product: any = {
  //   name: 'Product Name',
  //   price: 0,
  //   oldPrice: '',
  //   image: '',
  //   sizes: [],
  // }

  @Input() product: any = {};

  // ngOnInit(){
  //   this.product = this.productInput;
  // }
}
