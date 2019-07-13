import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AddressService } from './addresses/address.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mail';

  constructor(private authService: AuthService, private addressService: AddressService) {}

  ngOnInit() {
    // auto sign-in when app is initialized
    // this.authService.autoSignIn();
  }
}
