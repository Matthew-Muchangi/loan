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
  filteredCustomers: any[] = [];
  isEditing = false;
  editingCustomerId: number | null = null;
  searchTerm: string = '';
  itemsPerPage: number = 10;

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
      this.filterCustomers();
    });
  }

  filterCustomers(): void {
    this.filteredCustomers = this.customers.filter(customer =>
      (customer.firstname && customer.firstname.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (customer.lastname && customer.lastname.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (customer.phonenumber && customer.phonenumber.includes(this.searchTerm)) ||
      (customer.nationalid && customer.nationalid.includes(this.searchTerm))
    ).slice(0, this.itemsPerPage);
  }

  updatePagination(): void {
    this.filterCustomers();
  }

  addOrUpdateCustomer(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const customerData = {
      firstname: this.customerForm.value.firstname,
      lastname: this.customerForm.value.lastname,
      phonenumber: this.customerForm.value.phonenumber,
      nationalid: this.customerForm.value.nationalid,
      loans: this.customerForm.value.loans,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (this.isEditing && this.editingCustomerId !== null) {
      this.customerService.updateCustomer(this.editingCustomerId, { id: this.editingCustomerId, ...customerData }).subscribe(() => {
        this.loadCustomers();
        this.resetForm();
      });
    } else {
      this.customerService.addCustomer(customerData).subscribe((newCustomer) => {
        this.customers.push(newCustomer);
        this.resetForm();
        this.filterCustomers();
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
      nationalid: customer.nationalid,
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
    this.router.navigate(['']);
  }
}
