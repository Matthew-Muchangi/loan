import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from 'src/app/services/loan.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  loanForm: FormGroup;
  loans: any[] = [];
  customers: any[] = [];
  isEditing = false;
  editingLoanId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private customerService: CustomerService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      customer: ['', Validators.required],  
      principalAmount: [0, [Validators.required, Validators.min(1)]],
      interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      repaymentPeriod: ['', Validators.required],
      duedate: ['', Validators.required],
      // startdate: ['', Validators.required],
      // frequency: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLoans();
    this.loadCustomers();
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe((data) => {
      this.loans = data.map(loan => ({
        id: loan.id,
        customer: loan.customer, // Ensure customerId is included
        principalAmount: loan.principalAmount,
        interestRate: loan.interestRate,
        repaymentPeriod: loan.repaymentPeriod,
        duedate: loan.duedate,
        // startdate: loan.startdate,
        // frequency: loan.frequency,
        status: loan.status
      }));
      console.log(this.loans); // Debugging to check if customerId exists
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data) => {
        this.customers = data;
        console.log(this.customers)
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  addOrUpdateLoan(): void {
    if (this.loanForm.invalid) {
      console.warn('Form is invalid:', this.loanForm.errors);

      return;
    }

    const loanData = this.loanForm.value;

    if (this.isEditing && this.editingLoanId !== null) {
      this.loanService.updateLoan(this.editingLoanId, { id: this.editingLoanId, ...loanData }).subscribe(() => {
        this.loadLoans();
        this.resetForm();
        console.log('Its working', loanData);
      });
    } else {
      this.loanService.addLoan(loanData).subscribe(
        (newLoan) => {
          this.loans.push(newLoan);
          this.resetForm();
          console.log('Its working',loanData);

        },
        (error) => {
          console.error('Error adding loan:', error);
        }
      );
    }
  }

  editLoan(loan: any): void {
    this.isEditing = true;
    this.editingLoanId = loan.id;
    this.loanForm.patchValue(loan);
  
    // Fetch customer details based on loan.customerId
    if (loan.customer) {
      this.customerService.getCustomerById(loan.customer).subscribe(
       
        (error) => {
          console.error('Error fetching customer details:', error);
        }
      );
    }
  }
  

  deleteLoan(loan: any): void {
    if (confirm(`Are you sure you want to delete Loan ID: ${loan.id}?`)) {
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
