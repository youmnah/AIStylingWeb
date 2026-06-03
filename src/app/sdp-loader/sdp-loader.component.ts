import { Component, OnInit, Input } from '@angular/core';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'app-sdp-loader',
  templateUrl: './sdp-loader.component.html',
  styleUrls: ['./sdp-loader.component.scss'],
  standalone: false
})
export class SdpLoaderComponent implements OnInit {

  @Input() showLoader: boolean;
  @Input() fromDashboard: boolean;
  topPositionDynamic = 0;

  constructor(private globalData: GlobalDataService) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    var that = this
    window.addEventListener("scroll", function(event) { 
        var scroll_y = this.scrollY; 
        var scroll_x = this.scrollX; 
        that.topPositionDynamic = this.scrollY;
    }); 

    this.globalData.fireLoader.subscribe(
      (modifiedList: []) => {        
        if(modifiedList){
          body.classList.add('body-loader');
          body.classList.remove('body-scroll-loader');
        }
        else{
          body.classList.remove('body-loader');
          body.classList.add('body-scroll-loader');
        }
      }
    ); 
  }
}