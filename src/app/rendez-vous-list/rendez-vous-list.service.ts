import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RendezVousCreation, RendezVousDonnee, RendezVousLsPage, RendezVousLsParams } from '../rendez-vous/rendez-vous-donnee';

@Injectable({
  providedIn: 'root'
})

export class RendezvousListService {
  private apiUrl = 'http://localhost:8080/rendezvous';

  constructor(private http: HttpClient) {}

  getRendezVousList(): Observable<RendezVousDonnee[]> {
    return this.http.get<RendezVousDonnee[]>(this.apiUrl);
  }

  supprimerRendezVous(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  modifierClient(id: number, rendezvous: Omit<RendezVousCreation, 'id'>): Observable<RendezVousDonnee> {
    console.log("modifier client" + id);
    return this.http.put<RendezVousDonnee>(`${this.apiUrl}/update/${id}`, rendezvous);
  }

  creer(rdv: RendezVousCreation): Observable<RendezVousDonnee> {
    return this.http.post<RendezVousDonnee>(`${this.apiUrl}/create`, rdv);
  }


  getClientsPagines(params: RendezVousLsParams): Observable<RendezVousLsPage> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('limit', params.limit);

    if (params.recherche) {
      httpParams = httpParams.set('recherche', params.recherche);
    }
    
    return this.http.get<RendezVousLsPage>(`${this.apiUrl}/page`, { params: httpParams });
  }
}