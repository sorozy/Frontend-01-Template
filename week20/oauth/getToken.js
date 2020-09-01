{
	let code = '2d42dd130934c630fb12';
	let state = 'abc123';
	let client_secret = '4c5a4e7da4511009b369155ba06f1eddb6f6874a';
	let client_id = 'Iv1.a626c41089306117';
	let redirect_uri = encodeURIComponent('http://localhost:8080');

	let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

	let xhr = new XMLHttpRequest();
	xhr.open(
		'POST',
		`https://github.com/login/oauth/access_token?${params}`,
		true
	);

	xhr.send(null);

	xhr.addEventListener('readystatechange', function () {
		if (xhr.readyState === 4) {
			console.log(xhr.responseText);
		}
	});
}
