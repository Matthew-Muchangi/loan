import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  customers: { firstname: string; lastname: string; phonenumber: string; nationalid: string; }[] = [];
  totalCustomers: number = 0;
  totalLoans: number = 0;
  loanChart: any;

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
      this.createLoanChart();
    });
  }

  loadLoanCount(): void {
    this.loanService.getLoans().subscribe(loans => {
      this.totalLoans = loans.length;
      this.createLoanChart();
    });
  }

  createLoanChart(): void {
    if (this.loanChart) {
      this.loanChart.destroy();
    }

    this.loanChart = new Chart('loanBarChart', {
      type: 'bar',
      data: {
        labels: ['Total Customers', 'Total Loans'],
        datasets: [{
          label: 'Loan Statistics',
          data: [this.totalCustomers, this.totalLoans],
          backgroundColor: ['#007bff', '#28a745'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
