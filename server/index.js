const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");

const schema = require("./schema");
const users = [{id: 1, username: "Kira", age: 25}]  // Imitation dataBase

const app = express();
app.use(cors());

const createUser = (input) => {
    const id = Date.now();
    return {
        id, ...input
    }
};


const root = {
    getAllUsers: () => users,
    getUser: ({id}) => users.find(user => user.id === id),
    createUser: ({input}) => {
        const user = createUser(input)
        users.push(user)
        return user
    }
};

app.use("/graphql", graphqlHTTP({
    graphiql: true, 
    schema,
    rootValue: root
}));

app.listen(5000, () => console.log("server started on port 5000"));