import ApiService from "./src/services/API.service";

const api = new ApiService();

api.get7TVUserByTwitchId("123456789").then(user => {
    console.log(user);
}).catch(err => {
    console.error(err);
});