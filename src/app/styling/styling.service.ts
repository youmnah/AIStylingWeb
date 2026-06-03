import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from '../global-data.service';

@Injectable({
  providedIn: 'root'
})
export class StylingService {

  constructor(private http:HttpClient, private globalDataService:GlobalDataService) {}

  GetStylingDetails() {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetStylingDetails', {});
  }

  getClosets() {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetClosets', {});
  }

  GenerateOutfit(data) {      
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GenerateOutfit', data);    
  }

  GetOutfitsSuggestions(data) {      
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetOutfitsSuggestions', data);
  }

  SaveOutfit(data) {      
    return this.http.post(this.globalDataService.ApiBaseUrl + '/SaveOutfit', { data });    
  }
}