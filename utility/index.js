
export function filterByValue(haystack, needle) {
	let haystackArray = Object.values(haystack); 
	
	const filtered = Object.entries(haystack).filter(([key, value]) => value.includes(needle));
	return Object.fromEntries(filtered);
}

export async function getTrelloList({ fetch, id }) {
	let list = await fetch(`https://api.trello.com/1/lists/${ id }/cards?key=${ process.env.TRELLO_KEY }&token=${ process.env.TRELLO_TOKEN }`);
	return await list.json();
}

export async function getTrelloLabels({ fetch, id }) {
	let labels = await fetch(`https://api.trello.com/1/labels/${ id }?key=${ process.env.TRELLO_KEY }&token=${ process.env.TRELLO_TOKEN }`);
	return await labels.json();
}

