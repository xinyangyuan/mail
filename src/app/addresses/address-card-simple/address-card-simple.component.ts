import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-card-simple',
  templateUrl: './address-card-simple.component.html',
  styleUrls: ['./address-card-simple.component.css']
})
export class AddressCardSimpleComponent implements OnInit {
  folders = [
    {
      name: 'Photos',
      updated: new Date('1/1/16')
    }
  ];

  notes = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16')
    }
  ];

  constructor() {}

  ngOnInit() {}
}
