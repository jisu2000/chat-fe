import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';

import { AuthService } from '../../service/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule, MatDialogModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() open = false;
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    private router: Router
  ) { }

  toggleMenu() {
    console.log("Toggling menu");
    this.open = !this.open;
    this.toggleSidenav.emit();
  }

  openLoginModal() {
    this.dialog.open(LoginModalComponent, {
      width: '400px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      panelClass: 'custom-login-dialog-container'
    });
  }

  logout() {
    if (this.open) {
      this.toggleSidenav.emit();
    }
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
