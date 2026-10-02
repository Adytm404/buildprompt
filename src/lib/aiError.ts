import { AIError } from '@/lib/aiClient';
import { getAIConfig } from '@/lib/aiConfig';

export function describeAIError(error: unknown): string {
  if (error instanceof AIError) {
    switch (error.code) {
      case 'auth':
        return 'Kunci API (API key) ditolak oleh server (401). Periksa VITE_AI_API_KEY di berkas .env.';
      case 'network':
        return `Tidak dapat menghubungi server AI di ${getAIConfig().baseUrl}. Pastikan server AI sedang berjalan.`;
      case 'timeout':
        return 'AI tidak merespons tepat waktu. Silakan coba lagi.';
      case 'parse':
        return 'Respons AI tidak dapat dibaca sebagai format JSON yang valid.';
      case 'http':
        return error.message || 'Server AI mengembalikan galat.';
      case 'aborted':
        return 'Permintaan dibatalkan.';
      default:
        return error.message;
    }
  }
  return error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
}
