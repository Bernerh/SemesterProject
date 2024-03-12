import express from 'express';
import DBManager from '../modules/storageManager.mjs'; 
import { verifyToken } from '../modules/token.mjs'; 

export const CARDS_API = express.Router();

CARDS_API.post('/create', verifyToken, async (req, res) => {

    console.log(req.body);

    await DBManager.createCard(req.body);

    res.status(200).end();
});

CARDS_API.get('/all', verifyToken, async (req, res) => {

    const cardSets = await DBManager.getCards();
    res.status(200).json(cardSets);
});

CARDS_API.get('/:id', verifyToken, async (req, res) => {
    console.log(req.params.id);
    const card = await DBManager.getCardInfo(req.params.id);

    res.status(200).json(card);
});
export default CARDS_API;