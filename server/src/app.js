import path from 'path';
import axios from 'axios';
import express from 'express';
import { createServer } from 'http';
import fs from 'fs';
import dotenv from 'dotenv'; // Import dotenv using ES module syntax

// Define the configEnv function at the top of the file
function configEnv() {
	const local = path.resolve(path.dirname(''), '..', '.env.local');
	const dev = path.resolve(path.dirname(''), '..', 'server', '.env');

	const hasLocal = fs.existsSync(local);

	// Use dotenv with import syntax
	dotenv.config({ path: hasLocal ? local : dev });
}

// Call configEnv to configure the environment variables
configEnv();

import SpokenRouter from './spoken/route.js';

const app = express();
const http = createServer(app);

// If needed, uncomment the following line to include custom headers
// import { configureHeaders } from './headers.js';
// configureHeaders(app);

app.use('/spoken', SpokenRouter);

app.get('/api/azure/token', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');

	const speechKey = process.env.SPEECH_KEY;
	const speechEndpoint = process.env.ENDPOINT;
	const speechRegion = process.env.REGION;
	
	let customModel = undefined;

	if (req.query.lang === 'en-US') {
		customModel = process.env.CUSTOM_MODEL_ENGLISH;
	}

	if (!speechKey) {
		return res.status(401).send({ message: 'ENV variables not configured!' });
	}

	const headers = {
		headers: {
			'Ocp-Apim-Subscription-Key': speechKey,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	try {
		const tokenResponse = await axios.post(speechEndpoint, null, headers);
		res.status(200).send({ token: tokenResponse.data, region: speechRegion, endpointId: customModel });
	} catch (err) {
		console.error(err);
		res.status(401).send({ message: 'There was an error authorizing your azure speech-to-text key.' });
	}
});

app.use(express.static(path.resolve(path.dirname(''), '..', 'server', 'public')));
app.use('*', (req, res) => res.sendFile(path.resolve(path.dirname(''), '..', 'server', 'public', 'index.html')));

http.listen(process.env.PORT || 3000, () => {
	console.log('[server.app] Listening on port *:3000');
	console.log('[server.app] To access the web version demo you can visit: http://localhost:3000/webapp/');
	console.log('[server.app] To start the electron client run: npm --prefix client start');
	console.log('[server.app] To start the development server run: npm --prefix webapp start');
	console.log('[server.app] Don’t forget to edit /server/.env with your Azure speech-to-text API keys');
});