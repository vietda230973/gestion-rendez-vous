import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientDonnee, RendezVousCreation, RendezVousDonnee } from '../rendez-vous-donnee';
import { Input, Output, EventEmitter } from '@angular/core';
import { RendezvousListService } from '../../rendez-vous-list/rendez-vous-list.service';
import { SimpleChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientService } from '../../client/client.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../erreur/notification.service';

@Component({
  selector: 'app-rendez-vous-form',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './rendez-vous-form.html',
  styleUrl: './rendez-vous-form.scss',
})
export class RendezVousForm implements OnInit, OnChanges {
  private formBuilder = inject(FormBuilder);
  
  @Input() clientAEditer: RendezVousDonnee | null = null;
  @Output() enregistre = new EventEmitter<RendezVousDonnee>();
  @Output() annule = new EventEmitter<void>();
  enCours = false;
  erreur: string | null = null;

  clients: ClientDonnee[] = [];
  chargementClients = true;

  rendezvousForm = this.formBuilder.group({
    id :  this.formBuilder.control<number | null>({ value: null, disabled: true }),
    titre: this.formBuilder.control<string | null>(''),
    client: this.formBuilder.control<number | null>(null),
    dateDebut: this.formBuilder.control<string | null>(null),
    dateFin: this.formBuilder.control<string | null>(null),
  })

  constructor(private rendezvousListService: RendezvousListService, private clientService: ClientService, private notificationService : NotificationService) {
    this.rendezvousForm.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe();
  }

  get modeEdition(): boolean {
    return !!this.clientAEditer;
  }

  ngOnInit(): void {
    this.patchFormSiEdition();
    this.chargerClients();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientAEditer'] && this.rendezvousForm) {
       this.patchFormSiEdition();
    }
  }

  private chargerClients(): void {
    this.chargementClients = true;
    this.clientService.getTousLesClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.chargementClients = false;
      },
      error: () => {
        this.erreur = 'Erreur lors du chargement des clients';
        this.chargementClients = false;
      }
    });
  }

  private patchFormSiEdition(): void {
    if (this.clientAEditer) {
  
      this.rendezvousForm.patchValue({
        id : this.clientAEditer.id,
        titre: this.clientAEditer.titre,
        client: this.clientAEditer.client,
        dateDebut: this.clientAEditer.dateDebut,
        dateFin : this.clientAEditer.dateFin,
      });
    } else {
      this.rendezvousForm.reset();
    }
  }

   onSubmit(): void {
    
    this.enCours = true;
    this.erreur = null;
   
    const valeurs: RendezVousCreation = {
      titre: this.rendezvousForm.value.titre || null,
      client: this.rendezvousForm.value.client || null,
      dateDebut: this.rendezvousForm.value.dateDebut! ,
      dateFin: this.rendezvousForm.value.dateFin!
    };

   const requete = this.modeEdition
      ? this.rendezvousListService.modifierRendezVous(this.clientAEditer!.id!, valeurs)
      : this.rendezvousListService.creer(valeurs);

   requete.subscribe({
      next: (client) => {
        this.enCours = false;
        this.enregistre.emit(client);
        this.notificationService.afficherSucces("Rendez vous est enregsitré.");
      },
      error: (err: HttpErrorResponse) => {
        this.enCours = false;
        this.erreur = err.error?.message ?? "Erreur lors de l'enregistrement du rendez vous";
      }
    });
  }

  onAnnuler(): void {
    this.rendezvousForm.reset();
    this.annule.emit();
  }
}
