import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  customers: { firstname: string; lastname: string; phonenumber: string; nationalid: string; }[] = [];
  totalCustomers: number = 0;
  totalLoans: number = 0;
overdueLoans: any;

  constructor(
    private customerService: CustomerService,
    private loanService: LoanService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerService.customers$.subscribe((customers) => {
      this.customers = customers;
      this.loadCustomerCount();
      
    });
    this.loadLoanCount();
  }

  loadCustomerCount(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.totalCustomers = customers.length;
    });
  }

  loadLoanCount(): void {
    this.loanService.getLoans().subscribe(loans => {
      this.totalLoans = loans.length;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']); // Redirect to dashboard after logout
  }
}
