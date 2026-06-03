import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from '../global-data.service';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http:HttpClient, private globalDataService:GlobalDataService) {}

  GetRecentOutfit(){    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetRecentOutfit', {});
  }

  getClosets() {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetClosets', {});
  }
}