import axios from 'axios';
import { UserBadge, UserPaint, UserRoles, EmoteData, EmotesData, AddEmoteData } from '../types/7tv/gql.types';
import { PlatformType, GetEmotesMethod, GetEmoteMethod } from '../types/7tv/types';

export default class GraphQLService {
    constructor(private token: string) {}

    private async execute<T>(operation: string, variables: Record<string, any> = {}): Promise<T> {
        const response = await axios.post(
            'https://7tv.io/v4/gql',
            {
                query: operation,
                variables,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.token}`,
                },
            }
        );

        if (response.data.errors) {
            const errorMessages = response.data.errors.map((error: any) => error.message).join('\n');
            throw new Error(errorMessages);
        }

        return response.data.data;
    }

    private async query<T = any>(query: string, variables: Record<string, any> = {}): Promise<T> {
        return this.execute<T>(query, variables);
    }

    private async mutate<T = any>(mutation: string, variables: Record<string, any> = {}): Promise<T> {
        return this.execute<T>(mutation, variables);
    }

    // =======================
    // Example GraphQL queries
    // =======================

    async getUserRoles(userId: string): Promise<UserRoles | null> {
        const query = `query Users {
                users {
                    user(id: "${userId}") {
                        roleIds
                    }
                }
            }`;

        return this.query(query)
            .then((data) => {
                return data.users.user.roleIds;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async getUserIdByPlatform(userId: string, platform: PlatformType): Promise<string | null> {
        const query = `query Users {
                  users {
                      userByConnection(platform: ${platform}, platformId: "${userId}") {
                          id
                      }
                  }
              }`;
        return this.query(query)
            .then((data) => {
                return data.users.userByConnection.id;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async UserGetPaint(userId: string): Promise<UserPaint | null> {
        const query = `
        query Users {
          users {
              user(id: "${userId}") {
                  style {
                      activePaint {
                          id
                          name
                          description
                          tags
                          createdById
                          updatedAt
                          searchUpdatedAt
                      }
                  }
              }
          }
      }`;
        return this.query(query)
            .then((data) => {
                return data.users.user.style.activePaint;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async UserGetBadge(userId: string): Promise<UserBadge | null> {
        const query = `
      query Users {
        users {
            user(id: "${userId}") {
                style {
                    activeBadge {
                        id
                        name
                        description
                        tags
                        createdById
                        updatedAt
                        searchUpdatedAt
                    }
                }
            }
        }
    }`;
        return this.query(query)
            .then((data) => {
                return data.users.user.style.activeBadge;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async GetEmotesByAuthor(author: string): Promise<EmotesData | null> {
        const query = `
          query Users {
              users {
                  user(id: "${author}") {
                      ownedEmotes {
                          id
                          ownerId
                          defaultName
                          tags
                          imagesPending
                          aspectRatio
                          deleted
                          updatedAt
                          searchUpdatedAt
                      }
                  }
              }
          }`;

        return this.query(query)
            .then((data) => {
                return data.users.user.ownedEmotes;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async GetEmotesByName(emoteName: string): Promise<EmotesData | null> {
        const query = `
      query Emotes {
        emotes {
            search(query: "${emoteName}", sort: { order: DESCENDING, sortBy: TOP_ALL_TIME }) {
                totalCount
                pageCount
                items {
                    id
                    ownerId
                    defaultName
                    tags
                    imagesPending
                    aspectRatio
                    deleted
                    updatedAt
                    searchUpdatedAt
                }
            }
        }
    }`;

        return this.query(query)
            .then((data) => {
                return data.users.user.ownedEmotes;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async GetEmotesBy(method: GetEmotesMethod, param: string): Promise<EmotesData | null> {
        if (method === GetEmotesMethod.Author) return this.GetEmotesByAuthor(param);
        if (method === GetEmotesMethod.Name) return this.GetEmotesByName(param);
        throw new Error('Method not found');
    }

    async GetEmoteBy(method: GetEmoteMethod, param: string): Promise<EmoteData | null> {
        if (method === GetEmoteMethod.EmoteId) return this.GetEmoteById(param);
        if (method === GetEmoteMethod.Name) return this.GetEmoteByName(param);
        throw new Error('Method not found');
    }

    async GetEmoteById(emoteId: string): Promise<EmotesData | null> {
      const query = `
        query Emotes {
            emotes {
                emote(id: "${emoteId}") {
                    id
                    ownerId
                    defaultName
                    tags
                    imagesPending
                    aspectRatio
                    deleted
                    updatedAt
                    searchUpdatedAt
                }
            }
        }`;

      return this.query(query)
          .then((data) => {
            return data.emotes.emote;
          })
          .catch((err) => {
              console.log(err);
              return null;
          });
  }
    async GetEmoteByName(emoteName: string): Promise<EmotesData | null> {
      const query = `
      query Emotes {
          emotes {
              search(query: "${emoteName}", sort: { order: DESCENDING, sortBy: TOP_ALL_TIME }) {
                  totalCount
                  pageCount
                  items {
                      id
                      ownerId
                      defaultName
                      tags
                      imagesPending
                      aspectRatio
                      deleted
                      updatedAt
                      searchUpdatedAt
                  }
              }
          }
      }`;

      return this.query(query)
          .then((data) => {
            return data.emotes.search.items[0];
          })
          .catch((err) => {
              console.log(err);
              return null;
          });
  }

    async GetActiveEmoteSet(UserId: string): Promise<EmotesData | null> {
        const query = `
    query Users {
        users {
            user(id: "${UserId}") {
                style {
                    activeEmoteSetId
                }
            }
        }
    }`;

        return this.query(query)
            .then((data) => {
                return data.users.user.style.activeEmoteSetId;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }

    async AddEmoteToSet(SetId: string, EmoteId: string): Promise<AddEmoteData | null> {
        const query = `
          mutation EmoteSets {
            emoteSets {
                emoteSet(id: "${SetId}") {
                    addEmote(
                        id: { emoteId: "${EmoteId}" }
                        zeroWidth: false
                        overrideConflicts: false
                    ) {
                        id
                        name
                        tags
                        capacity
                        ownerId
                        kind
                        updatedAt
                        searchUpdatedAt
                        description
                    }
                }
            }
        } `;

        return this.query(query)
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
    }
}
