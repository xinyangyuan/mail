import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrls: ['./navigation-list.component.css']
})
export class NavigationListComponent implements OnInit {
  senderStatus: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.senderStatus = this.authService.getSenderStatus();
  }
}
