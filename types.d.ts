export interface IAlbum {
    title: string,
    artist: string,
    release_year: number,
    description: string | null,
    image: string | null
}

export interface IArtist {
    name: string,
    description: string | null,
    photo: string | null
}

export interface ITrack {
    title: string,
    duration: string,
    album: string
}

export interface IUserFields {
    username: string,
    password: string,
    token: string
}