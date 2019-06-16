import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


import {AuthenticationService, TokenPayload} from '../../../authenticaion.service';
import { from } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: Boolean = false;


  credentials: TokenPayload = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
    country: '',
    category: '',
    qualifications: '',
    interests: '',
    role: '',
    exp: 0
  }

  constructor(private auth: AuthenticationService, 
    private router: Router, private snackBar: MatSnackBar){ }

  login() {

    this.loading = true;

    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/')
        this.loading = false;

      },
      err => {
        console.error(err)
        console.error(err.error.error)
        this.snackBar.open(`${err.error.error}`, 'OK', {
          duration: 3000,
        });
        this.loading = false;
      }
    )
  }
  
  ngOnInit() {
  }

}
