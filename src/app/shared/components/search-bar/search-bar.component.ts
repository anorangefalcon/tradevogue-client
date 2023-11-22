import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent {

  @Input() onButtonClick: Boolean = false;
  @Input() searchPlaceholder: any = 'Search...';
  @Output() searchQuery$ = new EventEmitter <string>();

  private searchText$ = new BehaviorSubject<string>('');

  ngOnChanges(){
    if(this.onButtonClick === false){
      this.searchIt();
    }
  }

  typed(e: Event) {
    let searchText = (<HTMLInputElement>e.target).value;
    searchText = searchText.trim();
    this.searchText$.next(searchText);
  }

  searchIt(instant: Boolean = false){
    const delay = instant ? 0 : 500;
    
    this.searchText$
      .pipe(
        debounceTime(delay),
        distinctUntilChanged()
      )
      .subscribe((searchText: string) => {        
        this.searchQuery$.emit(searchText);
      });
  }

}
