import express, { response } from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";


const USER_API = express.Router();

const users = [];

USER_API.get('/:id', (req, res) => {
    /// TODO: Return user object


    const user = users[req.params.id];
    if (user) {
        console.log(user);  //send/json same shit
        res.json(user);
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send('User not found');
    }

})

USER_API.post('/', (req, res) => {
    // TODO: CreateUser

    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {
        const user = new User();
        user.name = name;
        user.email = email;

        ///TODO: Do not save passwords.
        user.pswHash = password;

        ///TODO: Does the user exist?

        let exists = false;

        if (!exists) {
            users.push(user);
            res.status(HttpCodes.SuccesfullRespons.Ok).send(user);
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }
 

});

USER_API.put('/:id', (req, res) => {
    // TODO: Edit/Update user
    // ADDED

    //const { id } = req.params;
    const { name, email, password } = req.body;
    //const userIndex = users.findIndex(user => user.id === parseInt(id));

    const userIndex = req.params.id;

    if (userIndex >= users.length) {
        return res.status(HttpCodes.ClientSideErrorRespons.NotFound).send('User not found');
    }

    const user = users[userIndex];
    user.name = name || user.name;
    user.email = email || user.email;
    user.pswHash = password || user.pswHash;
    users[userIndex] = user;

    res.json(user);
})

USER_API.delete('/:id', (req, res) => {
    // TODO: Delete User
    // ADDED
    //const { id } = req.params;
    //const userIndex = users.findIndex(user => user.id === parseInt(id));
    const userIndex = req.params.id;

    if (userIndex >= users.length) {
        return res.status(HttpCodes.ClientSideErrorRespons.NotFound).send('User not found');
    }

    users.splice(userIndex, 1);
    res.send(`User with ID ${userIndex} deleted`);
})

export default USER_API
