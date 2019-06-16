import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {AuthenticationService, TokenPayload} from '../../../authenticaion.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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
    exp: 0
  }

  constructor(private auth: AuthenticationService, 
    private router: Router){ }

  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/')
      },
      err => {
        console.error(err)
      }
    )
  }
  
  ngOnInit() {
  }

}
