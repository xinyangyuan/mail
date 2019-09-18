import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-inline',
  templateUrl: './card-inline.component.html',
  styleUrls: ['./card-inline.component.css']
})
export class CardInlineComponent implements OnInit {
  // Attributes
  @Input() color = '#e45';

  constructor() {}

  ngOnInit() {}
}
