export interface ArchivePhoto {
  id?: string;
  url: string;
  event?: string;
  desc?: string;
  photog?: string;
  photogKey?: string;
  date?: string;
  sessionKey?: string;
  eraId?: string;
}

export interface EraItem {
  id: string;
  title: string;
  type?: string;
  art?: string;
}