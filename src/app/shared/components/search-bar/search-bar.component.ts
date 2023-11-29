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

  private searchQuery: any = '';
  private searchText$ = new BehaviorSubject<string>('');
  private emitNow: Boolean = false;

  ngOnInit(){
    this.searchIt();
  }

  typed(e: Event) {
    this.searchQuery = (<HTMLInputElement>e.target).value;
    this.searchQuery = this.searchQuery.trim();
    this.emitNow = true;

    if(!this.onButtonClick) this.searchText$.next(this.searchQuery);
  }

  searchIt(instant: Boolean = false){
    const delay = instant ? 0 : 500;
    if(this.onButtonClick) this.searchText$.next(this.searchQuery);
    
    this.searchText$
      .pipe(
        debounceTime(delay),
        distinctUntilChanged()
      )
      .subscribe((searchText: string) => {  
        if(this.emitNow){
          this.searchQuery$.emit(searchText);
        }      
      });
  }

}