import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``,
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  // @ViewChild('txtSearchInput')
  // public searchInput!: ElementRef<HTMLInputElement>;

  private dbouncer: Subject<string> = new Subject<string>();
  private dbouncerSubscription?: Subscription;

  @Input()
  public placeholder: string = '';

  @Input()
  public initialValue: string = '';

  @Output()
  public onSearch: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    this.dbouncerSubscription = this.dbouncer
    .pipe(
      debounceTime(300)
    )
    .subscribe((value) => {
      this.onDebounce.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.dbouncerSubscription?.unsubscribe();
  }

  searchValue(term: string) {
    // const term: string = this.searchInput.nativeElement.value;
    this.onSearch.emit(term);
  }

  onKeyPress(searchTerm: string): void {
    // console.log(searchTerm);
    this.dbouncer.next(searchTerm);
    // this.onSearch.emit(searchTerm);
  }
}
