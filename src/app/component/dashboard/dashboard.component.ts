import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  customers: { id: number; name: string; email: string }[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.customers$.subscribe((customers) => {
      this.customers = customers;
    });
  }
}
