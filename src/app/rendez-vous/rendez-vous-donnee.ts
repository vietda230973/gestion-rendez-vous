export type RendezVousDonnee = {
  id?: number | null,
  titre?: string | null,
  client?: string | null,
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