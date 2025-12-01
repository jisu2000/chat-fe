import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { RouterOutlet, RouterLink } from '@angular/router';
import { SidenavComponent } from "../sidenav/sidenav.component";

@Component({
  selector: 'base-component',
  standalone: true,
  imports: [NavbarComponent,
    MatSidenavModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink, SidenavComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  sidenavOpened = false;

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
