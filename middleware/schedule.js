
export default async function ({ store, redirect, $config, $trivia }) {

	const schedule = await fetch(`https://api.twitch.tv/helix/schedule?broadcaster_id=${ $config.CHANNEL_ID }`, {
		// credentials: 'same-origin',
		method: 'GET',
		// mode: 'no-cors',
		headers: {
			'Client-ID': $config.TWITCH_CLIENT_ID,
			'Authorization': `Bearer ${ $config.TWITCH_APP_ACCESS_TOKEN }`
		}
	});

	console.log(await schedule.json());
}