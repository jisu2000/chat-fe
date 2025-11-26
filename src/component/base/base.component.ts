import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'base-component',
  standalone: true,
  imports: [NavbarComponent
    ,
    MatSidenavModule,
    NavbarComponent,
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  sidenavOpened = false;

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
