import { Component, OnInit} from '@angular/core';
// import $ from 'jquery';
// import 'select2/dist/css/select2.min.css';
// import 'select2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  ngOnInit(): void {
    $('#datatable1').DataTable({
      pagingType: 'numbers',
      pageLength: 8,
    }); 

    // $('.inventory_status').select2();
  }

}
 