import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((erreur: HttpErrorResponse) => {
      const message = extraireMessageErreur(erreur);
      notificationService.afficherErreur(message);
      return throwError(() => erreur);
    })
  );
};

function extraireMessageErreur(erreur: HttpErrorResponse): string {
  // Le backend Spring Boot renvoie souvent { message, error, status, timestamp }
  if (erreur.error?.message) {
    return erreur.error.message;
  }
  if (erreur.status === 0) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
  }
  if (erreur.status === 404) {
    return 'Ressource introuvable.';
  }
  if (erreur.status === 500) {
    return 'Erreur interne du serveur. Veuillez réessayer.';
  }
  return `Une erreur est survenue (code ${erreur.status}).`;
}