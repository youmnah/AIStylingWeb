import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private skipUrls = [
    'https://api64.ipify.org','https://api.weatherapi.com'
  ];
  constructor(private authService: AuthService) {
    window.addEventListener('hashchange', () => {            
        this.authService.clearToken();
        window.location.reload();
      });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {     
    const token = this.authService.getToken();
    const shouldSkip = this.skipUrls.some(url => req.url.startsWith(url));

    let authReq = req;
    if (token && !shouldSkip) {      
      authReq = req.clone({        
        setHeaders: { access_token: `${token}` }         
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          return this.authService.clearToken().pipe(
            switchMap(() => {
              const newToken = this.authService.getToken();

              const retryReq = req.clone({
                setHeaders: { access_token: `${newToken}` }
              });
              return next.handle(retryReq);
            }),
            catchError(refreshError => {
              this.isRefreshing = false;
              this.authService.clearToken();
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}