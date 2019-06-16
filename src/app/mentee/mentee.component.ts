import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {ServerService, Search} from '../../server.service';

@Component({
  selector: 'app-mentee',
  templateUrl: './mentee.component.html',
  styleUrls: ['./mentee.component.css']
})
export class MenteeComponent implements OnInit {

  mentees: [];
  imageSrc: any;
  photo:any;
  searchBy: Search = {
    name: '',
    category: '',
    field: ''
  }

  constructor( private serverService: ServerService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.serverService.mentees().subscribe(
      mentees => {
        this.mentees = mentees.mentees
        console.log(this.mentees)
      }
    ),
    err => {
      console.error(err);
    }
  }

getProfileImage(id) {
 return this.serverService.getProfileImage(id).subscribe(response => {
    console.log(response);
    this.imageSrc = response
  })
}

findMentee() {
  console.log(this.searchBy)
  this.serverService.mentee(this.searchBy).subscribe(
    mentees => {
      this.mentees = mentees.mentees
      console.log(this.mentees)
    }
  ),
  err => {
    console.error(err);
  }

}

}
