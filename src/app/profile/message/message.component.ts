import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ServerService, Message} from '../../../server.service';
import { MatSnackBar } from '@angular/material';



export interface DialogData {
  message_sender: string;
  message_recipient: string;
  message: string;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  message: Message = {
   recipient: '',
   message: ''
  }

  messageForm: FormGroup;
  constructor(
    private snackBar: MatSnackBar,
    public serverService: ServerService,
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 

  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendMessage(): void {
    console.log(this.message);
    this.message.recipient = this.data.message_recipient;
    this.serverService.sendMessage(this.message).subscribe(
      () => {
        this.snackBar.open('Message Sent Successfully', 'OK', {
          duration: 3000,
        });
        this.dialogRef.close();
      },
      err => {
        console.error(err)
      }
    )
  }

}
