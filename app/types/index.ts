export interface ArchivePhoto {
  id?: string;
  url: string;
  event?: string;
  desc?: string;
  photog?: string;
  photogKey?: string;
  date?: string;
  year?: string | number;
  photoYear?: string | number;
  eraTitle?: string;
  eraOrigin?: string;
}

export interface EraItem {
  id: string;
  title: string;
  type?: string;
  art?: string;
}