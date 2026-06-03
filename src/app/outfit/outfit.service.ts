import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from '../global-data.service';

@Injectable({
  providedIn: 'root'
})
export class OutfitService {

  constructor(private http:HttpClient, private globalDataService:GlobalDataService) {}
  
  GetMonthlyOutfits(data) {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetMonthlyOutfits', { data });
  }

  MostWorn(data) {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetMostWornItems', { data });
  }
}