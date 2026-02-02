export type MusicCategory = 'Pop' | 'Rock' | 'Rap' | 'Jazz' | 'Classical' | 'Electro' | 'Other';


export interface Track {
    id: number;          
    title: string;
    artist: string;
    description?: string; 
    category: MusicCategory; 
    duration?: number;   
    addedDate: string;  

    streamUrl: string;  
    coverUrl?: string;   

   
}

export interface CreateTrackDTO {
    title: string;
    artist: string;
    description?: string;
    category: MusicCategory;
    file: File;          
    cover?: File;        
    isFavorite?: boolean;
}

export type ServiceStatus = 'idle' | 'loading' | 'error' | 'success';