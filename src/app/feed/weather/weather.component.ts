import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  standalone: false
})
export class WeatherComponent implements OnInit {
  userIp: string = '';
  location: string = '';
  weather: [{ "date": "", "temp": "", "icon": "", "weatherCode": "" }]

  constructor(private weatherService:WeatherService) { }

  ngOnInit(): void {
    this.weatherService.getIPAddress().subscribe((response) => {
      var tempResponse = JSON.parse(JSON.stringify(response));           
      this.userIp = tempResponse.ip;      
      this.getweather(this.userIp);
    });   
  }

  getweather(userIp){
    this.weatherService.getWeather(userIp).subscribe((response) => {
      var tempResponse = JSON.parse(JSON.stringify(response));      
      this.location = tempResponse.location.name + "/" + tempResponse.location.country;
      this.weather = this.extractWeatherData(tempResponse.forecast);
      localStorage.setItem('weather',  JSON.stringify(this.weather));
    });
  }

  extractWeatherData(forecast: any): any {
    return forecast.forecastday.map((day: any) => ({
      date: this.formatDate(day.date),
      temp: `${Math.round(day.day.mintemp_c)}/${Math.round(day.day.maxtemp_c)}°C`,
      icon: day.day.condition.icon,
      weatherCode: day.day.condition.text,
      today: this.isToday(new Date(day.date))
    }));
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };  
    return date.toLocaleDateString("en-US", options).replace(",", "");
  }
}