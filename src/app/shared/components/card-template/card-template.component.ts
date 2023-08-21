import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.css']
})
export class CardTemplateComponent {

  product_info: any = {
    name: 'Product Name',
    price: 0,
    oldPrice: 0,
    image: '',
    sizes: [],
  }

  @Input() product: any = {};


  ngOnInit(){
    this.product_info = this.product;
    // console.log(this.product.oldPrice);
  }
}
