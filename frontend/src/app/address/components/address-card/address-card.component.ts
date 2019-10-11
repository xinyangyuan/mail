import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Address } from '../../models/address.model';

@Component({
  selector: 'app-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.css']
})
export class AddressCardComponent {
  // Attributes
  @Input() address: Address;
  @Output() selected = new EventEmitter<MouseEvent>();

  // Method: emit button select clicked
  onSelect() {
    this.selected.emit();
  }
}
