import axios from 'axios';
import { UserBadge, UserPaint, UserRoles } from '../types/7tv/gql.types';
import { PlatformType } from '../types/7tv/types';

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
}
