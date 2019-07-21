import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isSender: boolean;
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isSender = this.authService.getSenderStatus();
  }

  // Method: toggle side navigation
  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  // Method: sign out
  onSignOut() {
    this.authService.signOut();
    this.router.navigate(['']);
  }
}
