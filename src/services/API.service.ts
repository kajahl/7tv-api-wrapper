import axios from "axios";
import { Get7TVUserByTwitchIdResponse, SevenTVUser } from "../types/7tv/types";

export default class ApiService {

    constructor() {}

    async get7TVUserByTwitchId(twitchUserId: string): Promise<SevenTVUser | null> {
        const response = await axios.get<Get7TVUserByTwitchIdResponse>(`https://7tv.io/v3/users/twitch/${twitchUserId}`);
        if (response.status !== 200) {
            console.error(`Error fetching 7tv ID for user ${twitchUserId}: ${response.statusText}`);
            return null;
        }
        const data = response.data;
        return data.user;
    }

    async get7TVUserBy7TvId(sevenTvUserId: string): Promise<SevenTVUser | null> {
        try {
            const response = await axios.get<SevenTVUser>(`https://7tv.io/v3/users/${sevenTvUserId}`);
            if (response.status !== 200) {
                console.error(`Error fetching 7TV user by ID ${sevenTvUserId}: ${response.statusText}`);
                return null;
            }
            return response.data;
        } catch (error) {
            console.error(`Error fetching 7TV user by ID ${sevenTvUserId}:`, error);
            return null;
        }
    }
}
