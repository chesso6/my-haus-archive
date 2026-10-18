export interface ArchivePhoto {
  id?: string;
  url: string;
  event?: string;
  desc?: string;
  photog?: string;
  photogKey?: string;
  date?: string;
  eraTitle?: string;
  eraOrigin?: string;
}

export interface EraItem {
  id: string;
  title: string;
  type?: string;
  art?: string;
}