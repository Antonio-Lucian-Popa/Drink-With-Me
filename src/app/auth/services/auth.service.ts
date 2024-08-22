import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { jwtDecode } from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';
import { CreateUser } from '../../shared/interfaces/create-user';

export interface Token {
  token: string;
  refresh_token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL_LINK = environment.apiUrl + '/api/v1';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(payload: any): Observable<Token | null> {
    return this.http.post<Token>(`${this.URL_LINK}/auth/login`, payload).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.token); // Store JWT token
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of(null); // Return null in case of error
      })
    );
  }

  register(userData: CreateUser, file?: File): Observable<any> {
    const formData = new FormData();

    // Append user data with explicit Content-Type for the JSON part
    const userBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
    formData.append('userDto', userBlob);

    // Append file if present
    if (file) {
      formData.append('file', file, file.name);
    } else {
      formData.append('file', new Blob([]), 'empty');
    }

    return this.http.post(`${this.URL_LINK}/auth/register`, formData, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  validateToken(token: string): Observable<boolean> {
    console.log(token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<boolean>(`${this.URL_LINK}/auth/validate-token`, {}, { headers });
  }


  isJwtExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000; // JS deals with dates in milliseconds since epoch
    return Date.now() >= expirationDate;
  }

  async getToken(): Promise<string | null> {
    return await localStorage.getItem('jwt') ?? null; // Ensures that `undefined` is converted to `null`
  }

  async getUserId(): Promise<string | null> {
    const token = await this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.userId;
    }
    return null;
  }

  isAuthenticated(): Observable<boolean> {
    return from(this.getToken()).pipe(
      switchMap(token => {
        if (token && !this.isJwtExpired(token)) {
          return this.validateToken(token);
        } else {
          return of(false);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.URL_LINK}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('jwt');
      }),
      catchError(this.handleError)
    );
  }

  getUserInfo(userId: string): Observable<any> {
    const URL_LINK = environment.apiUrl + '/api/v1/users';
    return this.http.get<any>(`${URL_LINK}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the error according to your application's needs
    return throwError(error.message || 'Server error');
  }
}
