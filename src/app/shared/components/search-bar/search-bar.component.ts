import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FetchDataService } from '../../services/fetch-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent {

  @Input() searchPlaceholder: string = 'Search...';
  @Input() searchWhat: any = 'products';


  constructor(private fetchData: FetchDataService, private router: Router) { }

  search(e: Event) {
    let searchText = (<HTMLInputElement>e.target).value;
    if (this.searchWhat === 'products') {
      searchText = searchText.trim()
      if (searchText === '') {
        this.router.navigateByUrl('/');
        
      }
      else {
        this.router.navigateByUrl(`/explore?search=${searchText}`);
      }
    }
  }
}
