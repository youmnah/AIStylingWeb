import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from '../global-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {   
  constructor(private http:HttpClient, private globalDataService:GlobalDataService) {}
  
  getProfile() {      
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetProfileParameter', {});
  }

  SaveProfile(data) {         
    return this.http.post(this.globalDataService.ApiBaseUrl + '/SaveEditProfile', { data });
  }

  SaveProfileImage(file) {  
    const formData = new FormData();
    formData.append('file', file);          
    return this.http.post('https://apisdp.digitalsp.net/AI_Services_API/Image/Profile', formData); 
  }
}