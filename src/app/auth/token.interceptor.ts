import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { from, mergeMap } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // List of URLs to exclude from token attachment
  const excludedUrls = ['/register', '/sign-in', '/sign-up'];

  // Check if the request URL is in the excluded list
  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req); // Skip adding the token for excluded URLs
  } else {
    return from(auth.getToken()).pipe(
      mergeMap(token => {
        if (token) {
          if (auth.isJwtExpired(token)) {
            auth.logout();
            router.navigate(['/sign-in']);
          } else {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
        } else {
          router.navigate(['/sign-in']);
        }
        return next(req);
      })
    );
  }
};
