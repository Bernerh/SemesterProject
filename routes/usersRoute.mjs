import express, { response } from "express";
import User from "../modules/user.mjs";
import { HttpCodes, HTTPMethods } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import Chalk from "chalk";
import { passwordStrengthColor } from "../modules/SuperLogger.mjs";
import bcrypt from 'bcrypt';
//import DBManager from "../modules/storageManager.mjs";

const USER_API = express.Router();
const users = [];

const addPasswordStrengthColor = (req, res, next) => {
    const user = users[parseInt(req.params.id, 10)];
    if (user) {
        req.colorizedPassword = passwordStrengthColor(user.pswHash);
    }
    next();
};

USER_API.get("/:id", addPasswordStrengthColor, (req, res) => {
    const userIndex = parseInt(req.params.id, 10);
    const user = users[userIndex];
    if (user) {
        const userString = `User { 
            name: "${Chalk.green(user.name)}", 
            email: "${Chalk.blue(user.email)}",
            pswHash: "${req.colorizedPassword}" 
        }`;
        SuperLogger.log(userString, SuperLogger.LOGGING_LEVELS.NORMAL);
        res.json({ name: user.name, email: user.email });
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found");
    }
});

const checkPasswordStrength = (req, res, next) => {
    const { password } = req.body;
    if (!password || password.length < 5) {
        SuperLogger.log("Too weak password", SuperLogger.LOGGING_LEVELS.IMPORTANT);
        return res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Password is too weak. It must be at least 5 characters long.");
    }
    next();
};


USER_API.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        try {
            console.log("The password I wrote was: " + password);
            console.log("Users password is: " + user.pswHash);

            const match = await bcrypt.compare(password, user.pswHash);
          
            /*DELETE 3 LOGS*/
            SuperLogger.log(`Attempting login for user: ${user.email}`); //NEW
            SuperLogger.log(`Hashed password for ${user.email}: ${user.pswHash}`,);//NEW
            SuperLogger.log(`Password match for ${user.email}: ${match}`);//NEW
            
            if (match) {
                const userId = users.indexOf(user);
                res.status(HttpCodes.SuccesfullRespons.Ok).json({ success: true, id: userId, name: user.name, email: user.email });
                // Session or token?
            } else {
                res.status(HttpCodes.ClientSideErrorRespons.Unauthorized).json({ success: false, message: "Invalid email or password" });
            }
        } catch (error) {
            res.status(HttpCodes.ClientSideErrorRespons.InternalServerError).json({ success: false, message: "An error occurred during login." });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).json({ success: false, message: "User not found" });
    }
});


USER_API.post("/", checkPasswordStrength, async (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User();
            user.name = name;
            user.email = email;
            user.pswHash = hashedPassword; // Save hashed password

            let exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (!exists) {
                users.push(user);
                SuperLogger.log(`Created user: ${name}`, SuperLogger.LOGGING_LEVELS.IMPORTANT);

                res.status(HttpCodes.SuccesfullRespons.Ok).send({ name: user.name, email: user.email });
            } else {
                res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("User already exists");
            }
        } catch (error) {
         
            res.status(HttpCodes.ClientSideErrorRespons.InternalServerError).send("An error occurred while creating the user.");
        }
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Missing data fields");
    }
});

USER_API.put("/:id", (req, res) => {
    const { name, email, password } = req.body;
    const userIndex = req.params.id;

    if (userIndex >= users.length) {
        return res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found");
    }

    const user = users[userIndex];
    user.name = name || user.name;
    user.email = email || user.email;
    user.pswHash = password || user.pswHash;
    users[userIndex] = user;

    res.json(user);
})

USER_API.delete("/:id", (req, res) => {
    const userIndex = Number(req.params.id);

    if (userIndex < 0 || userIndex >= users.length) {
        SuperLogger.log(`User with index: ${userIndex} not found`, SuperLogger.LOGGING_LEVELS.IMPORTANT);
        return res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found");
    }

    users.splice(userIndex, 1);
    SuperLogger.log(`Deleted user at index: ${userIndex}`, SuperLogger.LOGGING_LEVELS.IMPORTANT);
    res.send(`User with ID ${userIndex} deleted`);
})

export default USER_API;