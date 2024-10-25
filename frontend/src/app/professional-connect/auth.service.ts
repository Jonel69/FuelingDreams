import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; pass: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  register(userDetails: {
    f_name: string;
    l_name: string;
    email: string;
    phone_no: string;
    dob: string;
    gender: string;
    country: string;
    address: string;
    pass: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userDetails);
  }

  // New methods for password recovery
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-reset-code`, { email, code });
  }

  resendResetCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resend-reset-code`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { token, newPassword, confirmNewPassword });
  }

  // Add method to fetch countries
  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/countries`);
  }
}
