import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface Loan {
  id: number;
  amount: string;
  rate: string;
  repayment: string;
  date: Date;
  frequency: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://172.16.8.24:8080/loans';
  private loansSubject = new BehaviorSubject<Loan[]>([]);
  loans$ = this.loansSubject.asObservable();

  constructor(private http: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  addLoan(loan: Omit<Loan, 'id'>): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan);
  }

  updateLoan(id: number, loan: Loan): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${id}`, loan);
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
