import jwt from 'jsonwebtoken';
import { HttpCodes } from './httpConstants.mjs';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) {
        
        return res.status(HttpCodes.ClientSideErrorRespons.Forbidden).send("A token is required for authentication");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        
        if (err) {
            return res.status(HttpCodes.ClientSideErrorRespons.Forbidden).send("TokenError");
        }

        req.user = decoded;

        next();
    })
};
