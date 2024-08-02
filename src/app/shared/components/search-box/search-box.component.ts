import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent {

  // @ViewChild('txtSearchInput')
  // public searchInput!: ElementRef<HTMLInputElement>;

  @Input()
  public placeholder: string = '';

  @Output()
  public onSearch: EventEmitter<string> = new EventEmitter<string>();

  searchValue(term: string) {
    // const term: string = this.searchInput.nativeElement.value;
    this.onSearch.emit(term);
  }
}
