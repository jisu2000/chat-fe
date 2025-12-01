import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../environments/environment';
import { WebSocketService } from './web-socket.service';

import { User } from '../model/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  public user$ = this.userSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  public socket: WebSocket | null = null;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    // private wsService: WebsocketService
    private webSocketService: WebSocketService
  ) {
    this.checkExistingLogin();
  }

  /** Check token on app load */
  private checkExistingLogin() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.loadingSubject.next(false);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<{ data: User }>(`${environment.BE_URL}/api/v1/auth/current_user`, {
        headers,
      })
      .subscribe({
        next: (res) => {
          const currentUser = res.data;
          this.userSubject.next(currentUser);

          // connect WebSocket
          // this.socket = this.wsService.connect(token);
          this.webSocketService.connect(token);

          this.snackbar.open(`Reconnected as ${currentUser.full_name}`, 'OK', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackbar.open('Session expired. Please login again.', 'Close', {
            duration: 3000,
          });
          localStorage.removeItem('token');
          this.userSubject.next(null);
        },
        complete: () => this.loadingSubject.next(false),
      });
  }

  /** Login */
  login(employee_id: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const payload = { employee_id, password };
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http
        .post<{ data: { accessToken: string } }>(
          `${environment.BE_URL}/api/v1/auth/user/login_user`,
          payload,
          { headers }
        )
        .subscribe({
          next: async (res) => {
            const token = res.data.accessToken;
            localStorage.setItem('token', token);

            // fetch current user
            const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
            this.http
              .get<{ data: User }>(
                `${environment.BE_URL}/api/v1/auth/current_user`,
                { headers }
              )
              .subscribe({
                next: (userRes) => {
                  const loggedUser = userRes.data;
                  this.userSubject.next(loggedUser);

                  // connect WebSocket
                  // this.socket = this.wsService.connect(token);

                  this.webSocketService.connect(token);

                  this.snackbar.open(`Welcome ${loggedUser.full_name}`, 'OK', {
                    duration: 5000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                  });

                  resolve();
                },
                error: () => {
                  reject('Failed to load user');
                },
              });
          },
          error: () => {
            this.snackbar.open('Invalid credentials', 'Close', {
              duration: 3000,
            });
            reject('Invalid login');
          },
        });
    });
  }

  /** Logout */
  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // this.wsService.disconnect();
    this.webSocketService.disconnect();

    this.snackbar.open('Disconnected from WebSocket', 'OK', { duration: 2000 });
    this.snackbar.open('Logged out successfully', 'OK', { duration: 2000 });
  }

  get user(): User | null {
    return this.userSubject.value;
  }

  get loading(): boolean {
    return this.loadingSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
