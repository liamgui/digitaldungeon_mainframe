
export default async function ({store, axios}) {
	const socket = new WebSocket('ws://localhost:3001');

	// console.log(socket);
	// Connection opened
	socket.addEventListener('open', function (event) {
		console.log("connected to ws objectives")
		// heartbeat(socket);
	});

	// socket.addEventListener('ping', () => {heartbeat(socket)});

	// socket.addEventListener('close', function clear() {
	// 	clearTimeout(socket.pingTimeout)
	// })
	// Listen for messages
	socket.addEventListener('message', function (event) {
		let data = JSON.parse(event.data);
		console.log('Message from server ', data);
		store.commit('objectives/setList', data.list);
		store.commit('objectives/setLabels', data.labels);
	});

}
