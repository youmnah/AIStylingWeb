import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from '../../global-data.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  
  constructor(private http:HttpClient, private globalDataService:GlobalDataService) {}
  
  GetProfilePic() {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetProfilePicture', {});
  }
}