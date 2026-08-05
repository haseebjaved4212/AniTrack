export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

export interface Anime {
    mal_id: number;
    title: string;
    synopsis: string | null;
    image_url: string | null;
    episodes: number | null;
    status: string | null;
    score: number | null;
}

export interface UserAnimeEntry {
    mal_id: number;
    user_id: number;
    status: string;
    progress: number;
    rating: number | null;
    notes: string | null;
    added_at: string;
    updated_at: string;
    anime?: Anime; // Attached when fetching entries
}

export interface Stats {
    total_anime: number;
    total_episodes: number;
    average_rating: number;
    status_distribution: Record<string, number>;
}

export interface PaginationMeta {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
        count: number;
        total: number;
        per_page: number;
    };
}

export interface AnimeSearchResponse {
    pagination?: PaginationMeta;
    data: Anime[];
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}
