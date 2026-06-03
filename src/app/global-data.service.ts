import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastService } from './toast/toast.service';

@Injectable({
  providedIn: 'root'
})

export class GlobalDataService {  
  fireLoader = new Subject();
  isLoading : boolean;
  ApiBaseUrl = "https://apisdp.digitalsp.net/AI_Services_API/v1";

  constructor(private toastService: ToastService) {  }

  setIsLoading(bool) {
    this.fireLoader.next(bool);
    setTimeout(() => {
      this.isLoading = bool;
    }, 0);
  }

  handleMessages(msg, classname, time) {
    this.toastService.show(msg, {classname: classname.toLowerCase(), delay:time}); 
  }

  HandleError(response) {
    this.setIsLoading(false);

    if (response.status === 401){
      this.handleMessages("Unauthorized username or password", "danger toast show", 5000);      
      return false;
    }
    else if(response.status === 200)
      return true;    
    else if(response.status === 600){
      var resp = JSON.parse(response._body);
      if(resp.Message && resp.Message != undefined && resp.Message.Show == true) {
        this.handleMessages(resp.Message,"danger toast show", 5000);        
      }
      return false;
    }
    else {
      this.handleMessages("Error status:" + response.status , "danger toast show", 5000);
      return false;
    }
  } 
}