import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-custom-snackbar',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './custom-snackbar.component.html',
    styleUrl: './custom-snackbar.component.css'
})
export class CustomSnackbarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string, color: string }) { }
}
