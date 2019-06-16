import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import {AuthenticationService, TokenPayload} from '../../../authenticaion.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css', './css-slider.css']
})
export class BannerComponent implements OnInit {

  credentials: TokenPayload = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
    role: '',
    country: '',
    category: '',
    qualifications: '',
    interests: '',
    exp: 0,

  }

  constructor(private auth: AuthenticationService, 
    private router: Router){ }

  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/profile')
      },
      err => {
        console.error(err)
      }
    )
  }
  

  ngOnInit() {
  }

}
