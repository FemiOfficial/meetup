import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material'
;import { Router } from '@angular/router';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


import {AuthenticationService, UserDetails} from '../../../authenticaion.service';
import {ServerService, Profile} from '../../../server.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  imageSrc:any;
  details: UserDetails;
  profile: Profile;
  updateForm: FormGroup;
  

  constructor(private auth: AuthenticationService, private serverService: ServerService,
    private router: Router,  private snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.createForm();
     }

    public uploader: FileUploader = new FileUploader({url: '/api/users/upload', itemAlias: 'photo',
        headers: [{ name: 'Authorization', value: `${this.auth.getToken()}`}] 
    });


  ngOnInit() {

    this.auth.profile().subscribe(
      user => {
        this.details = user
        this.updateForm.get('firstname').setValue(this.details.firstname);
        this.updateForm.get('lastname').setValue(this.details.lastname);
        this.updateForm.get('mobile').setValue(this.details.mobile);
        this.updateForm.get('email').setValue(this.details.email);
        this.updateForm.get('interests').setValue(this.details.interests);
        this.updateForm.get('qualifications').setValue(this.details.qualifications);
        this.updateForm.get('field').setValue(this.details.field);
        this.updateForm.get('category').setValue(this.details.category);
        this.updateForm.get('country').setValue(this.details.country);
        
      },
      err => {
        console.error(err)
      }
    )

    this.serverService.getProfileImage(this.auth.getUserDetails().id).subscribe(response => {
      console.log(response);
      this.imageSrc = response
    })


    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');
     };
  }

  createForm() {
    this.updateForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      mobile: ['', Validators.required],
      field: ['', Validators.required],
      category: ['', Validators.required],
      qualifications: ['', Validators.required],
      country: ['', Validators.required],
      interests: '',
    
    });
  }

  updateProfile(firstname, lastname, mobile, email, field, qualifications,
    category, interests, country) {
    this.serverService.updateProfile(firstname, lastname, mobile, email, field, qualifications,
      category, interests, country).subscribe(() => {
      this.snackBar.open('Profile updated successfully', 'OK', {
        duration: 3000,
      });
    }),
    err => {
      console.error(err);
    }

  }
}
