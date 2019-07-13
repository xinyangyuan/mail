import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrls: ['./navigation-list.component.css']
})
export class NavigationListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onClose() {
    this.closeSidenav.emit();
  }
}
