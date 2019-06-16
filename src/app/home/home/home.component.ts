import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthenticationService, TokenPayload } from 'src/authenticaion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


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
