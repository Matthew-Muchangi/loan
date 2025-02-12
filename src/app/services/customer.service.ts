import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersSource = new BehaviorSubject<{ id: number; name: string; email: string }[]>(this.getStoredCustomers());
  customers$ = this.customersSource.asObservable();

  constructor() {}

  private getStoredCustomers(): { id: number; name: string; email: string }[] {
    const savedCustomers = localStorage.getItem('customers');
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  }

  private saveToLocalStorage(customers: { id: number; name: string; email: string }[]): void {
    localStorage.setItem('customers', JSON.stringify(customers));
  }

  addCustomer(customer: { id: number; name: string; email: string }): void {
    const currentCustomers = this.customersSource.value;
    const updatedCustomers = [...currentCustomers, customer];
    this.customersSource.next(updatedCustomers);
    this.saveToLocalStorage(updatedCustomers);
  }

  deleteCustomer(customer: { id: number; name: string; email: string }): void {
    const updatedCustomers = this.customersSource.value.filter(c => c !== customer);
    this.customersSource.next(updatedCustomers);
    this.saveToLocalStorage(updatedCustomers);
  }

  updateCustomer(index: number, updatedCustomer: { id: number; name: string; email: string }): void {
    const currentCustomers = this.customersSource.value;
    currentCustomers[index] = updatedCustomer;
    this.customersSource.next([...currentCustomers]);
    this.saveToLocalStorage(currentCustomers);
  }
}
