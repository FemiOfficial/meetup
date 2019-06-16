import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import {ServerService, Search} from '../../server.service';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.css']
})
export class MentorComponent implements OnInit {

  mentees: [];
  searchBy: Search = {
    name: '',
    category: '',
    field: ''
  }

  constructor(private serverService: ServerService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.serverService.mentors().subscribe(
      mentees => {
        this.mentees = mentees.mentees
        console.log(this.mentees)
      }
    ),
    err => {
      console.error(err);
    }
  }

findMentee() {
  console.log(this.searchBy)
  this.serverService.mentor(this.searchBy).subscribe(
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
