import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../component/custom-snackbar/custom-snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private snackBar: MatSnackBar) { }

    showSnackbar(message: string, color: string, vPos: MatSnackBarVerticalPosition = 'bottom', hPos: MatSnackBarHorizontalPosition = 'center') {
        this.show(message, color, vPos, hPos);
    }

    showToast(message: string, color: string, vPos: MatSnackBarVerticalPosition = 'top', hPos: MatSnackBarHorizontalPosition = 'right') {
        this.show(message, color, vPos, hPos);
    }

    private show(message: string, color: string, vPos: MatSnackBarVerticalPosition, hPos: MatSnackBarHorizontalPosition) {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: { message, color },
            duration: 3000,
            horizontalPosition: hPos,
            verticalPosition: vPos,
            panelClass: ['custom-snackbar-panel'] // Helper class if we need to remove default styles
        });
    }
}
