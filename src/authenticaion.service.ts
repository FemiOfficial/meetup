import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'
import { map, first, retry } from 'rxjs/operators';
import { Router } from '@angular/router';


export interface UserDetails {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    mobile: string,
    password: string,
    country: string,
    field: string,
    category: string,
    qualifications: string,
    interests: string,
    role: string,
    exp: number
}

interface TokenResponse {
    token: string
}

export interface TokenPayload {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    mobile: string,
    password: string,
    country: string,
    category: string,
    qualifications: string,
    interests: string,
    role: string,
    exp: number

}

@Injectable()
export class AuthenticationService {
    private token: string

    constructor(private http: HttpClient, private router: Router) {}

    private saveToken(token: string): void {
        console.log(token)
        localStorage.setItem('userToken', token)
        this.token = token;
    }

    public getToken(): string {
        if(!this.token) {
            this.token = localStorage.getItem('userToken')
        }

        return this.token;
    }

    public getUserDetails(): UserDetails {
       const token = this.getToken()
      
       let payload
       
       if(token) {
           payload = token.split('.')[1]
           payload = window.atob(payload)
           return JSON.parse(payload)
       } else {
           return null;
       }
    }

    public isLoggedIn(): boolean {
        const user = this.getUserDetails()
        if(user) {
            return user.exp > Date.now() /1000
        } else {
            return false
        }
       //return false
    }

    public register(user: TokenPayload): Observable<any> {
        const base = this.http.post('/api/users/register', user)

        const request = base.pipe(
            map((data: TokenResponse) => {
                if(data.token) {
                    this.saveToken(data.token)
                }
                return data
            })
        )
        return request;
    }

    public login(user: TokenPayload): Observable<any> {
        const base = this.http.post('/api/users/login', user)

        const request = base.pipe(
            map((data: TokenResponse) => {
                if(data.token) {
                    this.saveToken(data.token)
                }
                return data
            })
        )
        return request;
    }

    public profile(): Observable<any> {
        console.log(this.getToken())
        return this.http.post('/api/users/profile', {}, {
            headers: { Authorization: `${this.getToken()}`}
        })
    }

    public update

    public logOut(): void {
        this.http.post('/api/users/logout', {}, {
            headers: { Authorization: `${this.getToken()}`}
        })
        this.token = '';
        window.localStorage.removeItem('userToken')
        this.router.navigateByUrl('/')
        return 
    }

}