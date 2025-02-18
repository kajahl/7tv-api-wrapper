export interface Emote {}

export interface EmoteSet {
    id: string;
    name: string;
    flags: number;
    tags: string[];
    immutable: boolean;
    privileged: boolean;
    emotes: Emote[];
    emote_count: number;
    capacity: number;
    owner: any; // Define the type of owner if known
}

export interface SevenTVUser {
    id: string;
    username: string;
    display_name: string;
    created_at: number;
    avatar_url: string;
    style: {
        color: number;
        paint_id: string;
    };
    emote_sets: EmoteSet[];
    editors: any[]; // Define the type of editors if known
    roles: string[];
    connections: any[]; // Define the type of connections if known
}

export interface Get7TVUserByTwitchIdResponse {
    id: string;
    platform: string;
    username: string;
    display_name: string;
    linked_at: number;
    emote_capacity: number;
    emote_set_id: string;
    emote_set: EmoteSet;
    user: SevenTVUser;
}