{
	let xhr = new XMLHttpRequest();
	xhr.open(
		'GET',
		`https://api.github.com/user`,
		true
	);
  xhr.setRequestHeader('Authorization', 'token 64ddd0929337c6cbd8e3fa27770a2c987d458a3d');
	xhr.send(null);

	xhr.addEventListener('readystatechange', function () {
		if (xhr.readyState === 4) {
			console.log(xhr.responseText);
		}
	});
}
