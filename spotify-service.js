// Spotify API Service
// Şarkı arama ve seçim için

class SpotifyService {
    constructor() {
        // Spotify Web API (Client Credentials kullanır)
        this.clientId = 'YOUR_SPOTIFY_CLIENT_ID'; // Spotify Developer'dan alacaksınız
        this.clientSecret = 'YOUR_SPOTIFY_CLIENT_SECRET';
        this.accessToken = null;
        this.tokenExpiry = null;
        
        // Demo şarkı listesi (Spotify API olmadan çalışması için)
        this.demoSongs = [
            {
                id: 'demo1',
                name: 'Perfect',
                artists: [{ name: 'Ed Sheeran' }],
                album: { name: '÷ (Divide)', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 263400,
                popularity: 95,
                external_urls: { spotify: 'https://open.spotify.com/track/demo1' }
            },
            {
                id: 'demo2',
                name: 'Thinking Out Loud',
                artists: [{ name: 'Ed Sheeran' }],
                album: { name: 'x (Multiply)', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 281560,
                popularity: 90,
                external_urls: { spotify: 'https://open.spotify.com/track/demo2' }
            },
            {
                id: 'demo3',
                name: 'A Thousand Years',
                artists: [{ name: 'Christina Perri' }],
                album: { name: 'The Twilight Saga', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 285000,
                popularity: 88,
                external_urls: { spotify: 'https://open.spotify.com/track/demo3' }
            },
            {
                id: 'demo4',
                name: 'Can\'t Help Myself',
                artists: [{ name: 'Four Tops' }],
                album: { name: 'Greatest Hits', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 164000,
                popularity: 85,
                external_urls: { spotify: 'https://open.spotify.com/track/demo4' }
            },
            {
                id: 'demo5',
                name: 'Marry Me',
                artists: [{ name: 'Train' }],
                album: { name: 'Save Me, San Francisco', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 240000,
                popularity: 82,
                external_urls: { spotify: 'https://open.spotify.com/track/demo5' }
            },
            {
                id: 'demo6',
                name: 'İstanbul\'da Sonbahar',
                artists: [{ name: 'Duman' }],
                album: { name: 'Duman', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 285000,
                popularity: 80,
                external_urls: { spotify: 'https://open.spotify.com/track/demo6' }
            },
            {
                id: 'demo7',
                name: 'Gel',
                artists: [{ name: 'Barış Manço' }],
                album: { name: 'Greatest Hits', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 220000,
                popularity: 85,
                external_urls: { spotify: 'https://open.spotify.com/track/demo7' }
            },
            {
                id: 'demo8',
                name: 'Sevdim Seni Bir Kere',
                artists: [{ name: 'Sezen Aksu' }],
                album: { name: 'Klasikler', images: [{ url: 'https://via.placeholder.com/50' }] },
                duration_ms: 275000,
                popularity: 88,
                external_urls: { spotify: 'https://open.spotify.com/track/demo8' }
            }
        ];
        
        console.log('🎵 Spotify Service başlatıldı (Demo modu)');
    }

    // Şarkı ara (önce demo listesinde, sonra Spotify API'de)
    async searchSongs(query, limit = 8) {
        try {
            console.log(`🔍 Şarkı aranıyor: "${query}"`);
            
            // Demo listesinde ara
            const demoResults = this.searchInDemoSongs(query);
            
            if (demoResults.length > 0) {
                console.log(`✅ Demo listesinde ${demoResults.length} şarkı bulundu`);
                return demoResults.slice(0, limit);
            }

            // Demo'da bulunamazsa Spotify API'yi dene
            const spotifyResults = await this.searchSpotifyAPI(query, limit);
            
            if (spotifyResults.length > 0) {
                console.log(`✅ Spotify'da ${spotifyResults.length} şarkı bulundu`);
                return spotifyResults;
            }

            // Hiçbir yerde bulunamazsa random öner
            console.log('📀 Hiç sonuç bulunamadı, öneriler gösteriliyor');
            return this.getRandomSuggestions(limit);

        } catch (error) {
            console.error('🎵 Şarkı arama hatası:', error);
            return this.getRandomSuggestions(limit);
        }
    }

    // Demo şarkı listesinde ara
    searchInDemoSongs(query) {
        const searchTerm = query.toLowerCase();
        return this.demoSongs.filter(song => 
            song.name.toLowerCase().includes(searchTerm) ||
            song.artists[0].name.toLowerCase().includes(searchTerm) ||
            song.album.name.toLowerCase().includes(searchTerm)
        );
    }

    // Spotify API'de ara
    async searchSpotifyAPI(query, limit) {
        try {
            // Access token kontrolü
            if (!this.accessToken || this.isTokenExpired()) {
                await this.getAccessToken();
            }

            const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=TR`;
            
            const response = await fetch(searchUrl, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`Spotify API hatası: ${response.status}`);
            }

            const data = await response.json();
            return data.tracks?.items || [];

        } catch (error) {
            console.warn('⚠️ Spotify API kullanılamıyor:', error.message);
            return [];
        }
    }

    // Spotify Access Token al
    async getAccessToken() {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(this.clientId + ':' + this.clientSecret)}`
                },
                body: 'grant_type=client_credentials'
            });

            if (!response.ok) {
                throw new Error('Token alma hatası');
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);
            
            console.log('🔑 Spotify access token alındı');

        } catch (error) {
            console.warn('⚠️ Spotify token alma hatası:', error);
            throw error;
        }
    }

    // Token süresi kontrol et
    isTokenExpired() {
        return !this.tokenExpiry || Date.now() >= this.tokenExpiry;
    }

    // Rastgele öneriler getir
    getRandomSuggestions(limit) {
        const shuffled = [...this.demoSongs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    }

    // Popüler düğün şarkıları getir
    getPopularWeddingSongs() {
        return this.demoSongs.filter(song => song.popularity > 85);
    }

    // Türkçe şarkılar getir
    getTurkishSongs() {
        const turkishArtists = ['Duman', 'Barış Manço', 'Sezen Aksu'];
        return this.demoSongs.filter(song => 
            turkishArtists.some(artist => 
                song.artists[0].name.includes(artist)
            )
        );
    }

    // Şarkı süresini formatla
    formatDuration(durationMs) {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Şarkı detaylarını formatla
    formatSongDetails(song) {
        return {
            id: song.id,
            title: song.name,
            artist: song.artists[0].name,
            album: song.album.name,
            duration: this.formatDuration(song.duration_ms),
            image: song.album.images?.[0]?.url || 'https://via.placeholder.com/50',
            spotifyUrl: song.external_urls?.spotify || '#',
            popularity: song.popularity || 0
        };
    }

    // Test fonksiyonu
    async testSearch() {
        console.log('🧪 Spotify arama testi başlatılıyor...');
        
        const testQueries = ['perfect', 'türkçe', 'wedding', 'love'];
        
        for (const query of testQueries) {
            const results = await this.searchSongs(query, 3);
            console.log(`"${query}" için ${results.length} sonuç:`, results.map(s => s.name));
        }
    }
}

// Global olarak kullanılabilir hale getir
window.SpotifyService = SpotifyService;
