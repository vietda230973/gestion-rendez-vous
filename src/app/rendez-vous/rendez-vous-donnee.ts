export type RendezVousDonnee = {
  id?: number | null,
  titre?: string | null,
  client?: number | null,
  clientNom?: string | null,
  clientPrenom?: string | null,
  dateDebut?: string | null,
  dateFin?: string | null,
};

export interface RendezVousLsPage {
  donnees: RendezVousDonnee[];
  total: number;
  page: number;
  limit: number;
}

export interface RendezVousLsParams {
  page: number;
  limit: number;
  recherche?: string;
}

export interface ClientDonnee {
  id: number;
  nom: string;
  prenom: string;
}

export interface RendezVousCreation {
  id?: number | null,
  titre: string | null;
  client: number | null;
  dateDebut: string | null;
  dateFin: string | null;
}