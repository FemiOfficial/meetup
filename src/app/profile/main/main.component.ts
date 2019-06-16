import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';
import { MatSnackBar } from '@angular/material';


import { Router } from '@angular/router';

import {AuthenticationService, UserDetails} from '../../../authenticaion.service';
import {ServerService, ResponseRequest} from '../../../server.service';

export interface DialogData {
  message_sender: string;
  message_recipient: string;
  message: string;
}


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  message_sender: number;
  message_recipient: number;
  message: string;


  details: UserDetails
  relations: []
  pendingRequests: []
  messages: []
  response: ResponseRequest


  constructor(private auth: AuthenticationService, private serverService: ServerService,
    private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user
        this.message_sender = this.details.id;
      },
      err => {
        console.error(err)
      }
    )

    this.serverService.relationships().subscribe(
      relations => {    
        this.relations = relations.users
      }
    ),
    err => {
      console.error(err);
    }

    this.serverService.pendingRequests().subscribe(
      relations => {
        
        this.pendingRequests = relations.users
        console.log(this.pendingRequests)
      }
    ),
    err => {
      console.error(err);
    }

    this.serverService.getAllMessages().subscribe(
      messaages => {
        
        this.messages = messaages.message
        console.log(this.messages)
      }
    ),
    err => {
      console.error(err);
    }
  }

  openDialog(id: number, firstname: string, lastname: string): void {
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '500px',
      data: {
        recipient_name: firstname.toUpperCase() + ' ' + lastname.toUpperCase(),
        message_sender: this.message_sender, 
        message: '',
        message_recipient: id
       }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  acceptRequest(id) {
    this.response = {
      requestID: id,
      status: '1'
    }
    console.log(this.response)
    this.serverService.respondRequest(this.response).subscribe(),
    err => {
      console.error(err);
    }
    this.snackBar.open('Request Accepted', 'OK', {
      duration: 3000,
    });

    location.reload()
  }

  declineRequest(id) {
    this.response = {
      requestID: id,
      status: '2'
    }
    console.log(this.response)
    this.serverService.respondRequest(this.response).subscribe(),
    err => {
      console.error(err);
    }
    this.snackBar.open('Request Delinced', 'OK', {
      duration: 3000,
    });

    location.reload()
  }

}