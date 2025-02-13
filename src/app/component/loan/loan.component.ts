import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from 'src/app/services/loan.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
addLoan() {
throw new Error('Method not implemented.');
}
  loanForm: FormGroup;
  loans: any[] = [];
  isEditing = false;
  editingLoanId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      amount: ['', Validators.required],
      rate: ['', Validators.required],
      repayment: ['', Validators.required],
      date: ['', Validators.required],
      frequency: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe((data) => {
      this.loans = data;
    });
  }

  addOrUpdateLoan(): void {
    if (this.loanForm.invalid) {
      return;
    }

    const loanData = {
      amount: this.loanForm.value.amount,
      rate: this.loanForm.value.rate,
      repayment: this.loanForm.value.repayment,
      date: this.loanForm.value.date,
      frequency: this.loanForm.value.frequency,
      status: this.loanForm.value.status,
      created_at: new Date(),
      updated_at: new Date(),
    };

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
      amount: loan.amount,
      rate: loan.rate,
      repayment: loan.repayment,
      date: loan.date,
      frequency: loan.frequency,
      status: loan.status,
    });
  }

  deleteLoan(loan: any): void {
    if (confirm(`Are you sure you want to delete this loan?`)) {
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
