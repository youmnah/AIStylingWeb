import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { GlobalDataService } from './global-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class AuthService {  
  token:any = {};

  constructor(private http:HttpClient, private globalDataService:GlobalDataService, private router: Router) {}

  initializeLogin(): Promise<void> {
    return new Promise((resolve) => {
      const token = this.getToken();
      if (token) {
        resolve();
        return;
      }
  
      const hashValue = window.location.hash.substring(1);
      if (hashValue) {
        this.getAccessToken(hashValue).subscribe((response) => {
          const temp = JSON.parse(JSON.stringify(response));
          const newToken = {
            access_token: temp["access_token"],
            localExpiryTime: new Date(temp["expires"]).toUTCString()
          };
          this.token = newToken;
          localStorage.setItem('AItoken', JSON.stringify(newToken));
          resolve();
        }, () => resolve());
      } else {
        resolve();
      }
    });
  }

  login(): string | null{
    const hashValue = window.location.hash.substring(1);    
    if (hashValue) {    
      this.getAccessToken(hashValue).subscribe((response) => {        
        var tempResponse = JSON.parse(JSON.stringify(response));
        this.token = tempResponse;
        this.token.localExpiryTime = new Date(tempResponse["expires"]).toUTCString();
        this.token.access_token = tempResponse["access_token"];        
        window.localStorage.setItem('AItoken', JSON.stringify(this.token));
        return this.token.access_token;
      });      
    }
    else
      return "";
  }

  getToken(): string | null {    
    const token = localStorage.getItem('AItoken');
    return token ? JSON.parse(token).access_token : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAccessToken(hash: string){           
    var params = {
      "hash":hash
    }    
    let headers = new HttpHeaders({'Content-type': 'application/json'});
      
    return this.http.post(this.globalDataService.ApiBaseUrl + '/SignIn', params, { headers: headers });      
  }

  clearToken(): Observable<void> {
    if (typeof localStorage !== 'undefined'){
      try{    
        if(window.localStorage.getItem('AItoken') !== undefined){
          window.localStorage.removeItem('AItoken');
          window.localStorage.clear();
          this.login();
        }
      } catch(e){}
    }

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }
}