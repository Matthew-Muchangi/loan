import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customers: any[] = [];
  isEditing = false;
  editingCustomerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phonenumber: ['', Validators.required],
      nationalid: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }

  addOrUpdateCustomer(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const customerData = {
      id: this.editingCustomerId || 0,
      firstname: this.customerForm.value.firstname,
      lastname: this.customerForm.value.lastname,
      phonenumber: this.customerForm.value.phonenumber,
      nationalid: this.customerForm.value.nationalid,
      created_at: new Date(),
      updated_at: new Date()
    };

    if (this.isEditing && this.editingCustomerId !== null) {
      this.customerService.updateCustomer(this.editingCustomerId, customerData).subscribe(() => {
        this.loadCustomers();
        this.resetForm();
      });
    } else {
      this.customerService.addCustomer(customerData).subscribe(() => {
        this.loadCustomers();
        this.resetForm();
      });
    }
  }

  editCustomer(customer: any): void {
    this.isEditing = true;
    this.editingCustomerId = customer.id;
    this.customerForm.patchValue({
      firstname: customer.firstname,
      lastname: customer.lastname,
      phonenumber: customer.phonenumber,
      nationalid: customer.nationalid
    });
  }

  deleteCustomer(customer: any): void {
    if (confirm(`Are you sure you want to delete ${customer.firstname} ${customer.lastname}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe(() => {
        this.loadCustomers();
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingCustomerId = null;
    this.customerForm.reset();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']); // Redirect to dashboard after logout
  }
}
