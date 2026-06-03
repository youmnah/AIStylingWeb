import { Component } from '@angular/core';
import { GlobalDataService } from './global-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'AI Styling';
    
  constructor(public globalDataService: GlobalDataService) {}

  ngOnInit(): void {}
}