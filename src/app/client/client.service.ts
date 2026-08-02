import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ClientDonnee } from "../rendez-vous/rendez-vous-donnee";


@Injectable({ providedIn: 'root' })
export class ClientService {
  private apiUrl = 'http://localhost:8080/clients';

  constructor(private http: HttpClient) {}

  getTousLesClients(): Observable<ClientDonnee[]> {
     return this.http.get<ClientDonnee[]>(`${this.apiUrl}/tous`);
  }
}