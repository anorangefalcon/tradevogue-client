  import { Component } from '@angular/core';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent {
  order: any [] = [
    { product_name: "Pikachu Oversized Jersey", category: "Oversized T-shirt", color: 'pink', qty: "200", size: "X", price: "1190"},
    { product_name: "Pikachu Oversized Jersey", category: "Oversized T-shirt", color: 'blue', qty: "100", size: "XL", price: "1190"},
    { product_name: "Pikachu Oversized Jersey", category: "Oversized T-shirt", color: 'green', qty: "150", size: "XXL", price: "1190"}
  ]
}
