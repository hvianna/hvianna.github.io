/**
 * A simple searchable gallery/database using Google Sheets + Papa Parse
 *
 * by Henrique Vianna - https://henriquevianna.com
 */

import * as Papa from 'https://cdn.skypack.dev/papaparse';

const sheetURL  = 'https://docs.google.com/spreadsheets/d/161po8KEyBB9FxmOOfat4dfKGt3uO8wL6uZ9i4v2QXnU/pub?gid=0&single=true&output=csv';

// selector shorthand functions
const $  = document.querySelector.bind( document );
const $$ = document.querySelectorAll.bind( document );

const searchBox = $('#search');

function doSearch( event ) {
	if ( event.code == 'Esc' )
		searchBox.value = '';

	const searchStr = searchBox.value.toLowerCase();
	const items = $$('.item');

	items.forEach( item => {
		const text = item.innerText.toLowerCase();
		item.classList.toggle( 'hide', searchStr.length > 1 && ! text.includes( searchStr ) );
	});
}

/*
	initialization - populate the gallery and set event listeners for the search box
*/

(function () {
	Papa.parse( sheetURL, {
		download: true,
		header: true,
		complete: result => {
			const data = result.data;
			const container = $('#container');

			data.forEach( item => {
				container.innerHTML += `
					<div class="item">
						<img src="${ item.image_url }" loading="lazy">
						<div class="title">${ item.model }</div>
						<div class="info">${ item.year } ${ item.series }</div>
					</div>
				`;
			});

			$('#count').innerText = `(${ data.length })`;
		}
	});

	searchBox.addEventListener( 'keyup', doSearch );
	$('#clear').addEventListener( 'click', () => doSearch( {code: 'Esc'} ) );
})();
