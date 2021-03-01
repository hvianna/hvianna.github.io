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

// globals
const searchBox = $('#search');
const modal = $('#modal');
let series = [];
let years = [];

/**
 * Search function
 * if the search string follows the format 'field:value' it will search only on the specific field
 */
function doSearch( event ) {
	if ( typeof event == 'object' ) {
		if ( event.code == 'Esc' )
			searchBox.value = '';
	}
	else
		searchBox.value = event || '';

	let [ field, value ] = searchBox.value.toLowerCase().split(':');
	if ( value == undefined )
		[ value, field ] = [ field, value ];

	$$('.item').forEach( item => {
		const text = ( field ? item.dataset[ field ] : item.innerText ).toLowerCase();
		item.classList.toggle( 'hide', value.length > 1 && ! text.includes( value ) );
	});

	$('#count').innerText = $$('.item:not(.hide)').length;
}

// Initialization

(function () {
	Papa.parse( sheetURL, {
		download: true,
		header: true,
		complete: result => {
			const data = result.data;
			const container = $('#container');

			//populate the gallery
			data.forEach( item => {
				const photo = item.image_id ? `https://lh3.googleusercontent.com/pw/${item.image_id}=w1400` : item.image_url;
				container.innerHTML += `
					<div class="item" data-year="${ item.year }" data-series="${ item.series }">
						<img src="${ photo }" loading="lazy">
						<div class="title">${ item.model }</div>
						<div class="info">${ item.year } ${ item.series }</div>
					</div>
				`;

				if ( ! series.includes( item.series ) )
					series.push( item.series );
				if ( ! years.includes( item.year ) )
					years.push( item.year );
			});

			$('#loading').classList.add('hide');

			// update and show items count
			const count = $('#count');
			count.innerText = data.length;
			count.parentNode.classList.remove('hide');

			// update submenus
			const yearMenu = $('#year_menu');
			years.sort().forEach( item => yearMenu.innerHTML += `<li>${item}</li>` );
			for ( const el of yearMenu.children )
				el.addEventListener( 'click', () => doSearch( `year:${ el.innerText }` ) );

			const seriesMenu = $('#series_menu');
			series.sort().forEach( item => seriesMenu.innerHTML += `<li>${item}</li>` );
			for ( const el of seriesMenu.children )
				el.addEventListener( 'click', () => doSearch( `series:${ el.innerText }` ) );

			// set event listeners to zoom image on click
			$$('.item').forEach( el => el.addEventListener( 'click', () => {
				$('#zoom').src = el.querySelector('img').src;
				modal.classList.remove('hide');
			}) );
		}
	});

	// set event listeners for the search box
	searchBox.addEventListener( 'keyup', doSearch );
	$('#clear').addEventListener( 'click', () => doSearch() );

	// hide modal window when clicked
	modal.addEventListener( 'click', () => modal.classList.add('hide') );
})();
