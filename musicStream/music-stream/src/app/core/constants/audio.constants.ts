

export const AUDIO_CONSTANTS = {
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_MIME_TYPES: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg'
  ],

  ERRORS: {
    INVALID_FORMAT: 'Format non supporté. Utilisez MP3, WAV ou OGG.',
    FILE_TOO_LARGE: (max: number) => `Fichier trop volumineux. La taille max est de ${max}MB.`,
    METADATA_ERROR: 'Impossible de lire les métadonnées audio. Fichier corrompu ?',
    UNKNOWN_ERROR: "Une erreur inconnue est survenue."
  }
}