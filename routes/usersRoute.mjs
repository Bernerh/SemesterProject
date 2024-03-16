import express, { response } from "express";
import User from "../modules/user.mjs";
import { HttpCodes, HTTPMethods } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import Chalk from "chalk";
import { passwordStrengthColor } from "../modules/SuperLogger.mjs";
import bcrypt from 'bcrypt';
import DBManager from "../modules/storageManager.mjs";
import { verifyToken } from "../modules/token.mjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
    const user = await DBManager.findUser(email);
    console.log(user);
    if (user) {

        console.log("The password I wrote was: " + password);
        console.log("Users password is: " + user.password);

        const match = await bcrypt.compare(password, user.password);

        SuperLogger.log(`Attempting login for user: ${user.email}`);
        SuperLogger.log(`Hashed password for ${user.email}: ${user.pswHash}`,);
        SuperLogger.log(`Password match for ${user.email}: ${match}`);

        if (match) {
            const userId = users.indexOf(user);
           
            const token = jwt.sign(
                { userId: user.id,},
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(HttpCodes.SuccesfullRespons.Ok).json({
                success: true,
                id: userId,
                name: user.name,
                email: user.email,
                token
            });

            SuperLogger.log(`User logged in and token generated for: ${user.email}`, SuperLogger.LOGGING_LEVELS.IMPORTANT); 

        } else {
            res.status(HttpCodes.ClientSideErrorRespons.Unauthorized).json({ success: false, message: "Invalid email or password" });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).json({ success: false, message: "User not found" });
    }
});


USER_API.post("/", checkPasswordStrength, async (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {

        const hashedPassword = await bcrypt.hash(password, 10);
        let user = new User();
        user.name = name;
        user.email = email;
        user.pswHash = hashedPassword; // Save hashed password

        let exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (!exists) {
            user = await user.save(); //TO DATABASE
            //users.push(user); //LOCAL

            SuperLogger.log(`Created user: ${name}`, SuperLogger.LOGGING_LEVELS.IMPORTANT);

            res.status(HttpCodes.SuccesfullRespons.Ok).send({ name: user.name, email: user.email });
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("User already exists");
        }

    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Missing data fields");
    }
});

USER_API.put("/", verifyToken, async (req, res) => {
    const { name, email, password } = req.body;
        console.log(req.user);
        const currentUser = await DBManager.findUserById(req.user.userId);

        if (!currentUser) {
            return res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found");
        }
     
        let hashedPassword;

        if (password != ""){
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await DBManager.updateUser({
            id: req.user.userId,
            name: name || currentUser.name,
            email: email || currentUser.email,
            pswHash: hashedPassword || currentUser.password,
        });

        res.status(HttpCodes.SuccesfullRespons.Ok).json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
})

USER_API.delete("/", verifyToken, async (req, res) => {
    const deleteTheUser = await DBManager.deleteUser(req.user.userId); 

    res.send("Test");
})

export default USER_API;