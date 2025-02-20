import ApiService from "./src/services/API.service";
import GraphQLService from "./src/services/GraphQL.service";
import dotenv from "dotenv";
dotenv.config();

const api = new ApiService();

// api.get7TVUserByTwitchId("123456789").then(user => {
//     console.log(user);
// }).catch(err => {
//     console.error(err);
// });

const token = process.env.GRAPHQL_TOKEN;
if (!token) throw new Error("No GraphQL token provided");

const gql = new GraphQLService(token);

gql.getUserRoles("01G11FCKR00009CQBFJ3AG22RG").then(user => {
    console.log(user);
}).catch(err => {
    console.error(err);
});