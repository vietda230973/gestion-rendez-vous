import { Component } from '@angular/core';
import { RendezVousForm } from './rendez-vous-form/rendez-vous-form';

@Component({
  selector: 'app-rendez-vous',
  imports: [
    RendezVousForm
  ],
  templateUrl: './rendez-vous.html',
  styleUrl: './rendez-vous.scss',
})
export class RendezVous {

}
