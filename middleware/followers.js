export default async function () {

	//follower code

	const followersResponse = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${ $config.CHANNEL_ID }`, {
		// credentials: 'same-origin',
		method: 'GET',
		// mode: 'no-cors',
		headers: {
			'Client-ID': $config.TWITCH_CLIENT_ID,
			'Authorization': `Bearer ${ $config.TWITCH_APP_ACCESS_TOKEN }`
		}
	});

	const followers = await followersResponse.json();
}