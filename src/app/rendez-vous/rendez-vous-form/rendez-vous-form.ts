import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RendezVousDonnee } from '../rendez-vous-donnee';
import { Input, Output, EventEmitter } from '@angular/core';
import { RendezvousListService } from '../../rendez-vous-list/rendez-vous-list.service';
import { SimpleChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-rendez-vous-form',
  imports: [
    ReactiveFormsModule
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

  rendezvousForm = this.formBuilder.group({
    id : [0],
    titre: [''],
    client: [''],
    dateDebut: [''],
    dateFin: ['']  
  })

  constructor(private rendezvousListService: RendezvousListService ) {
    this.rendezvousForm.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe();
  }

  ngOnInit(): void {
    this.patchFormSiEdition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientAEditer'] && this.rendezvousForm) {
      this.patchFormSiEdition();
    }
  }

  private patchFormSiEdition(): void {
    if (this.clientAEditer) {
      console.log("patchFormSiEdition " + this.clientAEditer!.id!);
      this.rendezvousForm.patchValue(this.clientAEditer);
    } 
  }

  onSubmit(): void {
    
    this.enCours = true;
    this.erreur = null;
    const valeurs = this.rendezvousForm.value;

    const requete = this.rendezvousListService.modifierClient(this.clientAEditer!.id!, valeurs);
    console.log("onSubmit");
    requete.subscribe({
      next: (client) => {
        this.enCours = false;
        this.enregistre.emit(client);
      },
      error: (err: HttpErrorResponse) => {
        this.enCours = false;
        this.erreur = err.error?.message ?? "Erreur lors de l'enregistrement du rendez vous";
      }
    });
  }

  onAnnuler(): void {
    console.log("onAnnuler");
    this.rendezvousForm.reset({ titre: "" });
    this.annule.emit();
  }
}
