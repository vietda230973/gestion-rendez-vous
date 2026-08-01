import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  afficherErreur(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['snackbar-erreur'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  afficherSucces(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-succes'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}