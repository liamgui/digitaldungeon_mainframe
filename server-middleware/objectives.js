// import WebSocket from 'ws';
// import { v4 as uuidv4 } from 'uuid';

// import fetch from 'node-fetch';

// import { getTrelloList, getTrelloLabels } from "../utility";

// let websockets = new Map();

// // const ws = new WebSocket('ws://localhost:3000'); 

// // ws.addEventListener('open', (event) => {
// 	// 	websocket = event
// 	// 	console.log(event);
// 	// });
// const wss = new WebSocket.Server({ port: 3001 });
// // process.on('uncaughtException', () => {
// // })
// wss.on('connection', (ws) => {
// 	const id = uuidv4();
// 	websockets.set(ws, {id});
// 	ws.on("message", data => {
// 		console.log(`Received Data: ${data}`)
// 	})
// })

// let listId = '61ef5d8a6306c104fa7d7a93';


// export default async function (req, res, next) {

// 	// if (req.method === 'POST') {
// 	// 	const body = []
// 	// 	req.on('data', (chunk) => {
// 	// 		body.push(chunk)
// 	// 	})
// 	// 	req.on('end', () => {
// 	// 		const objectives = JSON.parse(body);
// 	// 		[...websockets.keys()].forEach(client => {
// 	// 			client.send(JSON.stringify(objectives));
// 	// 		})
// 	// 	})
// 	// } else 
// 	if (req.method === 'GET') {
		
// 		let list = await getTrelloList({fetch, id: listId});

// 		// console.log(list);
// 		let labelPromises = [];
// 		let labelIds = [];
// 		for(let item of list) {
// 			item.idLabels.forEach(async (labelId) => {
// 				if (!labelIds.includes(labelId)) { 
// 					labelIds.push(labelId);
// 					let result = getTrelloLabels({fetch, id: labelId});
// 					labelPromises.push(result);
// 				}
// 			});
// 		}
// 		let labels = await Promise.all(labelPromises);
// 		let data = {list: list, labels: labels};

// 		// let labels = await getTrelloLabels({fetch, id});
// 		[...websockets.keys()].forEach(client => {
// 			client.send(JSON.stringify(data));
// 		})
// 	}

// 	res.statusCode = 200
// 	res.end()
// }
