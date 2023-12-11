import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent {

  @Input() onButtonClick: Boolean = false;  
  @Input() searchClear: Boolean = false;
  @Input() searchPlaceholder: any = 'Search...';
  @Output() searchQuery$ = new EventEmitter <string>();
  @ViewChild('searchValue') searchValue: any;

  searchQuery: any = '';
  private searchText$ = new BehaviorSubject<string>('');
  private emitNow: Boolean = false;

  ngOnInit(){
    this.searchIt();
  }



  ngOnChanges() {
    console.log("changes called in search bar");
    if(this.searchClear){
      this.searchValue.nativeElement.value='';
    }
   
  }

  typed(e: Event) {
    console.log('e come up si ',e);
    
    this.searchQuery = (<HTMLInputElement>e.target).value;
    this.searchQuery = this.searchQuery.trim();
    this.emitNow = true;

    if(!this.onButtonClick) this.searchText$.next(this.searchQuery);
  }

  searchIt(instant: Boolean = true){
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