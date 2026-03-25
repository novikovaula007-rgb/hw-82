export interface IAlbum {
    _id: string;
    title: string,
    artist: string,
    release_year: number,
    description: string | null,
    image: string | null
}

export interface IAlbumMutation extends IAlbum{
    artist: IArtist,
}

export interface IArtist {
    _id: string;
    name: string,
    description: string | null,
    photo: string | null
}

export interface ITrack {
    _id: string;
    title: string,
    duration: string,
    album: string,
    track_number: number
}