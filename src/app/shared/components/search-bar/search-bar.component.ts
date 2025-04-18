import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchBarComponent {

  @Input() onButtonClick: any = false;
  @Input() searchClear: Boolean = false;
  @Input() searchPlaceholder: any = 'Search...';
  @Output() searchQuery$ = new EventEmitter<string>();

  @Output() typingJustStarted$ = new EventEmitter<Boolean>(false);

  @ViewChild('searchValue') searchValue: any;

  searchQuery: any = '';
  private searchText$ = new BehaviorSubject<string>('');
  private emitNow: Boolean = false;

  constructor(private router: Router){}
  ngOnInit() {
    this.searchIt();
  }

  ngOnChanges() {
    if (this.searchClear) {
      this.searchValue.nativeElement.value = '';
    }
  }

  typed(e: Event) {
    this.searchQuery = (<HTMLInputElement>e.target).value;
    this.searchQuery = this.searchQuery.trim();

    this.typingJustStarted$.emit(true);
    this.emitNow = true;

    if (!this.onButtonClick) this.searchText$.next(this.searchQuery);
    if (this.onButtonClick == 'navbar'){ 
      this.searchText$.next(this.searchQuery);
    }
  }

  Search_icon_clicked(){
    this.searchIt(false);
    this.typingJustStarted$.emit(true);
  }
  

  subscribedValue!:Subscription
  searchIt(instant: Boolean = false) {
    let delay = instant ? 0 : 500;
    if (this.onButtonClick === true) this.searchText$.next(this.searchQuery);
   
  this.subscribedValue=this.searchText$
      .pipe(
        debounceTime(delay),
        distinctUntilChanged()
      )
      .subscribe((searchText: string) => {
        if (this.emitNow) {
          this.searchQuery$.emit(searchText);
        }
      });
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.onButtonClick == 'navbar') {
      this.searchText$.next(this.searchQuery);
    }
  }

  ngOnDestroy(): void {
    this.subscribedValue.unsubscribe();
  }

}