import { Component, OnInit } from '@angular/core';
import { RendezvousListService } from './rendez-vous-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RendezVousDonnee } from '../rendez-vous/rendez-vous-donnee';
import { RendezVousForm } from '../rendez-vous/rendez-vous-form/rendez-vous-form';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-rendez-vous-list',
  imports: [
    CommonModule,
    FormsModule,
    RendezVousForm,
    MatPaginatorModule
  ],
  templateUrl: './rendez-vous-list.html',
  styleUrl: './rendez-vous-list.scss',
})
export class RendezVousList implements OnInit {

  rendezvouslist: RendezVousDonnee[] = [];
  recherche: string = '';
  triColonne: keyof RendezVousDonnee = 'titre';
  triAscendant: boolean = true;
  chargement: boolean = true;
  erreur: string | null = null;

  afficherFormulaire = false;
  clientEnEdition: RendezVousDonnee | null = null;

  // --- Pagination serveur (mat-paginator) ---
  pageActuelle: number = 0; // mat-paginator est 0-indexé
  taillePage: number = 10;
  taillesPageDisponibles: number[] = [5, 10, 25, 50];
  totalElements: number = 0;

   private rechercheSubject = new Subject<string>();

  constructor(private rendezvousListService: RendezvousListService) {

  }

  ngOnInit(): void {
    this.rechercheSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageActuelle = 0;
        this.chargerClients();
      });

    this.chargerClients();
  }

  chargerClients(): void {
    this.chargement = true;
    this.rendezvousListService.getClientsPagines({
        page: this.pageActuelle, 
        limit: this.taillePage,
        recherche: this.recherche.trim() || undefined
      })
      .subscribe({
        next: (resultat) => {
          this.rendezvouslist = resultat.donnees;
          this.totalElements = resultat.total;
          this.chargement = false;
        },
        error: () => {
          this.erreur = 'Erreur lors du chargement des rendez vous';
          this.chargement = false;
        }
      });
  }

  onRechercheChange(): void {
    this.rechercheSubject.next(this.recherche);
  }

  // --- Événement mat-paginator ---
  onPageChange(event: PageEvent): void {
    this.pageActuelle = event.pageIndex;
    this.taillePage = event.pageSize;
    this.chargerClients();
  }

  ouvrirAjout(): void {
    this.clientEnEdition = null;
    this.afficherFormulaire = true;
  }
  
  supprimerRendez(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce client ?')) return;

    this.rendezvousListService.supprimerRendezVous(id).subscribe({
      next: () => {
        const dernierePageDevientVide = this.rendezvouslist.length === 1 && this.pageActuelle > 0;
        if (dernierePageDevientVide) {
          this.pageActuelle--;
        }
        this.chargerClients();
     },
      error: () => {
        this.erreur = 'Erreur lors de la suppression';
      }
    });
  }

  ouvrirEdition(client: RendezVousDonnee): void {
    this.clientEnEdition = client;
    this.afficherFormulaire = true;
  }

  onClientEnregistre(client: RendezVousDonnee): void {
    console.log("onClientEnregistre " + client.id);
    this.chargerClients();
    this.fermerFormulaire();
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
    this.clientEnEdition = null;
  }

}
