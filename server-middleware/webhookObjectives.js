import fetch from 'node-fetch';

export default async function (req, res, next) {

	fetch('http://localhost:3000/api/objectives', {
		method: "GET"
	});

	res.statusCode = 200;
	res.end()
}
