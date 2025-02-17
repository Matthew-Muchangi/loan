import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface Loan {
  customer: any;
  id?: number;  // Optional for new loans
  principalAmount: number;
  interestRate: number;
  repaymentPeriod: string;
  duedate: string;
  startdate: string;
  frequency: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private loanUrl = 'http://172.16.8.12:8000/loans';
  private loansSubject = new BehaviorSubject<Loan[]>([]);
  loans$ = this.loansSubject.asObservable();

  constructor(private http: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.loanUrl);
  }

  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.loanUrl}/${id}`);
  }

  addLoan(loan: Loan): Observable<Loan> {
    return this.http.post<Loan>(this.loanUrl, loan);
  }

  updateLoan(id: number, loan: Partial<Loan>): Observable<Loan> {
    return this.http.put<Loan>(`${this.loanUrl}/${id}`, loan);
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.loanUrl}/${id}`);
  }
}
