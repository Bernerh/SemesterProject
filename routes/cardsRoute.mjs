import express from 'express';
import DBManager from '../modules/storageManager.mjs';
import { verifyToken } from '../modules/token.mjs';

export const CARDS_API = express.Router();

CARDS_API.post('/create', verifyToken, async (req, res) => {

    const card = {};
    card.cardName = req.body.cardName;
    card.wordSentence = {};
    card.meaning = {};

    for (let i = 0; i < req.body.wordSentence.length; i++) {
        card.wordSentence[i] = req.body.wordSentence[i];
    }

    for (let i = 0; i < req.body.meaning.length; i++) {
        card.meaning[i] = req.body.meaning[i];
    }

    console.log(card);

    await DBManager.createCard(card);

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

CARDS_API.delete('/:cardId', verifyToken, async (req, res) => {
    const card = await DBManager.getCardInfo(req.params.cardId);

    if (!card) {
        return res.status(404).json({ message: 'Card not found' });
    }

    await DBManager.deleteCard(req.params.cardId);

    res.status(200).json({ message: 'Card deleted successfully' });
});