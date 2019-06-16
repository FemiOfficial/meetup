import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import {AuthenticationService, UserDetails} from '../../../authenticaion.service';
import {ServerService} from '../../../server.service';

import { from } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: UserDetails
  relations: []

  constructor(private auth: AuthenticationService, private serverService: ServerService,
    private router: Router) { }

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user
      },
      err => {
        console.error(err)
      }
    )

    this.serverService.relationships().subscribe(
      relations => {
        this.relations = relations.users
        console.log(this.relations)
      }
    ),
    err => {
      console.error(err);
    }
  }

}
