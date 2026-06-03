import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];

  constructor() { }

  show(textOrTpl, options) {
    this.toasts.push({ textOrTpl, ...options });
    setTimeout(() => {
      this.remove(textOrTpl);    
    }, options.delay);
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t.textOrTpl !== toast);
  }
}