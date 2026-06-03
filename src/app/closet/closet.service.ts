import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from '../global-data.service';

@Injectable({
  providedIn: 'root'
})
export class ClosetService {

  constructor(private http:HttpClient, private globalDataService:GlobalDataService) {}
  
  getClosets() {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetClosets', {});
  }

  getCloset(ClosetId) {
    var data = {"ClosetID": ClosetId};     
    return this.http.post(this.globalDataService.ApiBaseUrl + '/GetClosetandDetails', { data });
  }
   
  saveCloset(closetName, ClosetId) {  
    var data = { "ClosetName": closetName, "ClosetID": ClosetId };  
    return this.http.post(this.globalDataService.ApiBaseUrl + '/SaveEditCloset', { data });
  }

  saveItem(data) {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/SaveEditItem', {data});    
  }

  checkImage(file) {  
    const formData = new FormData();
    formData.append('file', file);  
    return this.http.post('https://apisdp.digitalsp.net/AI_Services_API/Image/Detection', formData);    
  }

  deleteCloset(ClosetId) {
    var data = {"ClosetID": ClosetId};     
    return this.http.post(this.globalDataService.ApiBaseUrl + '/DeleteCloset', { data });
  }
  
  EditClosetOrder(data) {  
    return this.http.post(this.globalDataService.ApiBaseUrl + '/EditClosetOrder', data);
  }
   
  PreferredItem(ItemID, Preferred) {  
    var data = { "ItemID": ItemID, "Preferred": Preferred };
    return this.http.post(this.globalDataService.ApiBaseUrl + '/PreferredItem', { data });
  }
   
  ArchiveItem(ItemID, Archive) {  
    var data = { "ItemID": ItemID, "Archive": Archive };
    return this.http.post(this.globalDataService.ApiBaseUrl + '/ArchiveItem', { data });
  }

  Favorite() {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/FavoriteItems', {});
  }

  Archive() {    
    return this.http.post(this.globalDataService.ApiBaseUrl + '/Archive', {});
  }
}