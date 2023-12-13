import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  /** The total number of records */
  @Input()
  collectionSize!: number;

  /** The number of records to display */
  @Input()
  pageSize!: number;

  /** Current page */
  @Input()
  currentPage: number = 1;

  /** The number of buttons to show either side of the current page */
  @Input()
  maxSize = 1;

  /** Display the First/Last buttons */
  @Input()
  firstLastButtons = true;

  /** Display the Next/Previous buttons */
  @Input()
  nextPreviousButtons = true;

  /** Display small pagination buttons */
  @Input()
  small = false;

  @Output() activePage: any = new EventEmitter<number>();

  totalPages: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
  }

  get maxVisiblePages(): number {
    return Math.min(this.totalPages.length, this.maxSize * 2 + 1);
  }

  showEllipsisBefore(index: number): boolean {
    const totalPages = this.totalPages.length;
    const shouldShow = totalPages > 1;
    return index === 1 && shouldShow && this.currentPage > 1;
  }

  showEllipsisAfter(index: number): boolean {
    const totalPages = this.totalPages.length;
    const shouldShow = totalPages > 1;
    return (
      index === totalPages - 1 &&
      shouldShow &&
      this.currentPage < totalPages - 1
    );
  }

  shouldShowPage(index: number): boolean {
    return (
      index + 1 >= this.currentPage - this.maxSize &&
      index + 1 <= this.currentPage + this.maxSize
    );
  }

  showFirstEllipsis(): boolean {
    return this.currentPage < this.totalPages.length;
  }

  showLastEllipsis(): boolean {
    return this.currentPage < this.totalPages.length - 2;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
  }

  /** Set page number */
  selectPageNumber(pageNumber: number) {
    this.currentPage = pageNumber;
    this.activePage.emit(this.currentPage);
  }

  /** Set next page number */
  next() {
    const nextPage = this.currentPage + 1;
    nextPage <= this.totalPages.length && this.selectPageNumber(nextPage);
  }

  /** Set previous page number */
  previous() {
    const previousPage = this.currentPage - 1;
    previousPage >= 1 && this.selectPageNumber(previousPage);
  }
}
