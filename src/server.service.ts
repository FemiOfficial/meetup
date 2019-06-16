import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'
import { map, first, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

import {AuthenticationService, TokenPayload} from './authenticaion.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface Message {
    recipient: string,
    message: string
}

export interface Search {
    name: string,
    field: string,
    category: string
}

export interface Profile {
    firstname: string,
    lastname: string,
    email: string,
    category: string,
    qualifications: string,
    field: string,
    interests: string,
    mobile: string
}

export interface ResponseRequest {
    requestID: string,
    status: string
}

@Injectable()
export class ServerService {
    private token: string

    constructor(private http: HttpClient, private router: Router,
         private auth: AuthenticationService,
         private sanitizer: DomSanitizer) {}


    public relationships(): Observable<any> {
        return this.http.post('/api/users/relationships', {} ,{
            headers: { Authorization: `${this.auth.getToken()}`}
        })
    }

    public sendMessage(message: Message): Observable<any> {
        return this.http.post('/api/users/messages/sendMessage', {message} ,{
            headers: { Authorization: `${this.auth.getToken()}`}
        })
    }
    
    public pendingRequests(): Observable<any> {
        return this.http.post('/api/users/pendingRequest', {} ,{
            headers: { Authorization: `${this.auth.getToken()}`}
        })
    }

    public mentees(): Observable<any> {
        return this.http.post('/api/users/mentees', {} ,{
            headers: { Authorization: `${this.auth.getToken()}`}
        })
    }

    public mentee(search: Search): Observable<any> {
        return this.http.post('/api/users/findMentee', {search} ,{
            headers: { Authorization: `${this.auth.getToken()}`}
        })
    }

    public mentors(): Observable<any> {
        return this.http.post('/api/users/mentors', {} ,{
            headers: { Authorization: `${this.auth.getToken()}`}
        })
    }

    public mentor(search: Search): Observable<any> {
        return this.http.post('/api/users/findMentor', {search} ,{
            headers: { Authorization: `${this.auth.getToken()}`}
        })
    }

    public getBio(id): Observable<any> {
        return this.http.post(`/api/users/bio/${id}`, {})
    }

    public checkRelationship(id): Observable<any> {
        return this.http.post(`/api/users/checkRelationship/${id}`, {},
        {headers: { Authorization: `${this.auth.getToken()}`}
      })
    }

    public sendRequest(id): Observable<any> {
        return this.http.post(`/api/users/sendRequest/${id}`, {},
        {headers: { Authorization: `${this.auth.getToken()}`}
      })
    }

    public respondRequest(response: ResponseRequest): Observable<any> {
        return this.http.post(`/api/users/respondRequest`, {response},
            {headers: { Authorization: `${this.auth.getToken()}`}
        })
    }

    public getProfileImage(id): Observable<any>{
        return this.http.post(`/api/users/getprofilepic/${id}`, {},
            {headers: { Authorization: `${this.auth.getToken()}`},
            responseType: 'blob'
       })
       .pipe(map(
           blob => {
             let urlCreator = window.URL;
             return this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
           }))
    }

    public getAllMessages():Observable<any> {
        return this.http.post(`/api/users/messages/allmessages`, {},
        {headers: { Authorization: `${this.auth.getToken()}`}
    })
    }

    public updateProfile(firstname, lastname, mobile, email, field, qualifications,
        category, interests, country):Observable<any> {
        let data = {
            firstname: firstname ,
            lastname:lastname,
            mobile:mobile, 
            email:email, 
            field:field, 
            qualifications:qualifications,
            category:category, 
            interests:interests,
            country: country
        }
        console.log(data)
        return this.http.post(`/api/users/updateProfile`, data,
        {headers: { Authorization: `${this.auth.getToken()}`}
    })
    }
}
