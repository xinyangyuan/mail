import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Constructor:
  constructor(private authService: AuthService, private router: Router) {}

  // OnInit:
  ngOnInit() {
    if (this.authService.autoSignIn()) {
      this.router.navigate(['mails']);
    }
  }
}
