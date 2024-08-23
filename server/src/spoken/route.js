import express from 'express';
import getSpokenInstance from './index.js';

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const Spoken = await getSpokenInstance();
        res.send(Spoken.list());
    } catch (error) {
        res.status(500).send('Error initializing Spoken: ' + error.message);
    }
});

router.get('/save', async (req, res) => {
    try {
        const Spoken = await getSpokenInstance();
        res.send(Spoken.list());
    } catch (error) {
        res.status(500).send('Error initializing Spoken: ' + error.message);
    }
});

router.get('/find-command', async (req, res) => {
    try {
        const { lang, text } = req.query;

        if (!lang || !text) return res.status(400).send('You should provide a phrase and the language of that phrase');

        const Spoken = await getSpokenInstance();
        const result = Spoken.findComand({ text: req.query.text }, lang);

        if (result == null) return res.status(404).send('No matches found for phrase: "' + text + '"; ' + lang);

        res.send(result);
    } catch (error) {
        res.status(500).send('Error processing command: ' + error.message);
    }
});

export default router;