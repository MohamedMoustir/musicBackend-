
export type MusicCategory = 'Pop' | 'Rock' | 'Rap' | 'Jazz' | 'Classical' | 'Electro' | 'Other';
export interface Track {
    id?: number;
    title: string;
    artist: string;
    description: string;
    category: MusicCategory; 
    duration: number; 
    addedDate: Date;          
    file: Blob;    
    streamUrl?: string;           
    cover?: Blob;

}

export interface CreateTrackDTO{
    title: string;
    artist: string;
    description: string;
    category: MusicCategory;
    cover?: File;

}

export type ServiceStatus = 'idle' | 'loading' | 'error' | 'success';