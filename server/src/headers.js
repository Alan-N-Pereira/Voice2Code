import cors from 'cors';

export default function config(app) {
	return process.env.PROD !== 'TRUE' ? dev(app) : prod(app);
}

function dev(app) {
	console.log('[server.app] Running on development mode!');

	// Enable CORS for react-dev-server
	app.use(cors());
}