export class Track {
  id: string;
  title: string;
  paroles: string;
  message: string;
  artiste: string;
}

export type CreateTrackDto = Omit<Track, 'id'> & { file: File };
