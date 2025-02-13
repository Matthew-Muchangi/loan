import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
updateLoan(_t52: { id: number; amount: number; term: number; }) {
throw new Error('Method not implemented.');
}
  loanForm!: FormGroup;
  loans: { id: number; amount: number; term: number }[] = [];
  isEditing: boolean = false;
  selectedLoanIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      amount: [0, Validators.required],
      term: [0, Validators.required]
    });

    // Load saved loans from localStorage
    const savedLoans = localStorage.getItem('loans');
    if (savedLoans) {
      this.loans = JSON.parse(savedLoans);
    }
  }

  addLoan(): void {
    if (this.loanForm.valid) {
      if (this.isEditing && this.selectedLoanIndex !== null) {
        // Update existing loan
        this.loans[this.selectedLoanIndex] = {
          ...this.loans[this.selectedLoanIndex],
          ...this.loanForm.value
        };
        this.isEditing = false;
        this.selectedLoanIndex = null;
      } else {
        // Add new loan
        this.loans.push({
          id: this.loans.length + 1,
          ...this.loanForm.value
        });
      }

      // Save to localStorage
      this.saveLoans();

      this.loanForm.reset();
    }
  }

  deleteLoan(loan: { id: number; amount: number; term: number }): void {
    this.loans = this.loans.filter(l => l.id !== loan.id);
    this.saveLoans();
  }

  editLoan(loan: { id: number; amount: number; term: number }, index: number): void {
    this.loanForm.patchValue({
      amount: loan.amount,
      term: loan.term
    });
    this.isEditing = true;
    this.selectedLoanIndex = index;
  }

  private saveLoans(): void {
    localStorage.setItem('loans', JSON.stringify(this.loans));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']); // Redirect to dashboard after logout
  }
}
