export class Track {
  public id!: string;
  public title!: string;
  public paroles!: string;
  public message!: string;
  public artiste!: string;
}

export type CreateTrackDto = Omit<Track, 'id'> & { file: File };
