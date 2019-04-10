function setFont() {
	var font = document.getElementById('font-selector').value.match(/([\w\s]*)\(?(\d*)\)?/);
	var style = 'font-family: "' + font[1].trim() + '", sans-serif';
	if ( font[2] )
		style += '; font-weight: ' + font[2];
	document.body.style = style;
}

window.onload = setFont();
