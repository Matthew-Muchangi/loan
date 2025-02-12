import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customers: { id: number; name: string; email: string }[] = [];
  isEditing: boolean = false;
  selectedCustomerIndex: number | null = null;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // Subscribe to customer updates
    this.customerService.customers$.subscribe((customers) => {
      this.customers = customers;
    });
  }

  addCustomer(): void {
    if (this.customerForm.valid) {
      if (this.isEditing && this.selectedCustomerIndex !== null) {
        this.customerService.updateCustomer(this.selectedCustomerIndex, this.customerForm.value);
        this.isEditing = false;
        this.selectedCustomerIndex = null;
      } else {
        this.customerService.addCustomer({
          id: this.customers.length + 1,
          ...this.customerForm.value,
        });
      }

      this.customerForm.reset();
    }
  }

  deleteCustomer(customer: { id: number; name: string; email: string }): void {
    this.customerService.deleteCustomer(customer);
  }

  editCustomer(customer: { id: number; name: string; email: string }, index: number): void {
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
    });
    this.isEditing = true;
    this.selectedCustomerIndex = index;
  }
}
