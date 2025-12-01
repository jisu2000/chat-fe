import { Component, Inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../service/notification.service';
import { AuthService } from '../../service/auth-service.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@Component({
  selector: 'login-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  loginForm: FormGroup;
  hide = signal(true);
  loading = signal(false);



  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      employee_id: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        this.loading.set(true);
        await this.authService.login(this.loginForm.value.employee_id, this.loginForm.value.password);
        this.dialogRef.close(this.loginForm.value);
        this.loading.set(false);
      } catch (error) {
        this.loading.set(false);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
