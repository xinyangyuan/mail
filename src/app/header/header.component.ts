import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isSender: boolean;
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isSender = this.authService.getSenderStatus();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
