import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  loanForm: FormGroup;
  loans: any[] = [];
  customers: any[] = []; // Store fetched customers
  isEditing = false;
  editingLoanId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private customerService: CustomerService, // Inject CustomerService
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      customerId: ['', Validators.required], // Add customer selection
      amount: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      repayment: ['', Validators.required],
      date: ['', Validators.required],
      frequency: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLoans();
    this.loadCustomers(); // Fetch customers on init
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe((data) => {
      console.log('Loans API Response:', data);
      this.loans = data;
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((data) => {
      console.log('Customers API Response:', data);
      this.customers = data;
    });
  }

  addOrUpdateLoan(): void {
    if (this.loanForm.invalid) {
      return;
    }

    const loanData = {
      customerId: this.loanForm.value.customerId, // Ensure customer ID is included
      amount: this.loanForm.value.amount,
      rate: this.loanForm.value.rate,
      repayment: this.loanForm.value.repayment,
      date: this.loanForm.value.date,
      frequency: this.loanForm.value.frequency,
      status: this.loanForm.value.status
    };

    console.log('Submitting Loan Data:', loanData);

    if (this.isEditing && this.editingLoanId !== null) {
      this.loanService.updateLoan(this.editingLoanId, { id: this.editingLoanId, ...loanData }).subscribe(() => {
        this.loadLoans();
        this.resetForm();
      });
    } else {
      this.loanService.addLoan(loanData).subscribe((newLoan) => {
        this.loans.push(newLoan);
        this.resetForm();
      });
    }
  }

  editLoan(loan: any): void {
    this.isEditing = true;
    this.editingLoanId = loan.id;
    this.loanForm.patchValue({
      customerId: loan.customerId, // Set selected customer in form
      amount: loan.amount,
      rate: loan.rate,
      repayment: loan.repayment,
      date: loan.date,
      frequency: loan.frequency,
      status: loan.status
    });
  }

  deleteLoan(loan: any): void {
    if (confirm(`Are you sure you want to delete loan #${loan.id}?`)) {
      this.loanService.deleteLoan(loan.id).subscribe(() => {
        this.loadLoans();
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingLoanId = null;
    this.loanForm.reset();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
