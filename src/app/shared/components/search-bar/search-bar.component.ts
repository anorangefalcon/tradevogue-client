import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent {

  @Input() searchPlaceholder: string = 'Search...';
  @Output() searchQuery$ = new EventEmitter <string>();

  private searchText$ = new Subject<string>();

  constructor() {
    this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchText: string) => {
        this.searchQuery$.emit(searchText);
      });
   }

  typed(e: Event) {
    let searchText = (<HTMLInputElement>e.target).value;
    searchText = searchText.trim();
    this.searchText$.next(searchText);
  }
}
