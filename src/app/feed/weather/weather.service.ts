import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http:HttpClient) {}

  getIPAddress() {
    return this.http.get('https://api64.ipify.org?format=json');
  }

  getWeather(IP){
    return this.http.get('https://api.weatherapi.com/v1/forecast.json?key=9a61ade6194045a4b4c124437252002&q=' + IP + '&days=3&aqi=no&alerts=no', {});
  }
}