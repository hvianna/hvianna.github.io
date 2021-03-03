/**
 * A searchable gallery using Google Sheets as a simple database
 *
 * by Henrique Vianna - https://henriquevianna.com
 */

import * as Papa from 'https://cdn.skypack.dev/papaparse';

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQA88VnFS7YDPOU9k8zT5Iax3Ju-6J3z4vkJhy9vdyw0Z1kK6j45I-r1THtmfy7_--LF3h4oYSrqk-l/pub?gid=0&single=true&output=csv';

// selector shorthand functions
const $  = document.querySelector.bind( document );
const $$ = document.querySelectorAll.bind( document );

// globals
const container = $('#container');
const searchBox = $('#search');
const modal     = $('#modal');
const count     = $('#count');
const loading   = $('#loading');

let series = [];
let years  = [];
let total  = 0;

/**
 * Search function
 * to search only on a specific field use the format "field:value" (without quotes) in the search string
 */
function doSearch( event ) {
	if ( typeof event == 'object' ) {
		if ( event.code == 'Escape' )
			searchBox.value = '';
	}
	else
		searchBox.value = event || '';

	let [ field, value ] = searchBox.value.toLowerCase().split(':');
	if ( value === undefined )
		[ value, field ] = [ field, value ];

	// iterate over gallery items and hide those that don't match the search string
	$$('.item').forEach( item => {
		const text = ( field ? item.dataset[ field ] : item.innerText ).toLowerCase();
		item.classList.toggle( 'hide', value.length > 1 && ! text.includes( value ) );
	});

	count.innerText = $$('.item:not(.hide)').length;
}

// Initialization

(function () {
	Papa.parse( sheetURL, {
		download: true,
		header: true,
		step: result => {
			// add new item to the gallery
			const item = result.data;
			const photo = item.image_id ? `https://lh3.googleusercontent.com/pw/${item.image_id}=w1400` : 'nopic.webp';

			container.innerHTML += `
				<div class="item" data-year="${ item.year }" data-series="${ item.series }" data-part="${ item.part_no }">
					<div class="photo">
						<img src="${ photo }" loading="lazy">
						<div class="number">${ item.year_no }</div>
						<div class="part">${ item.part_no }</div>
					</div>
					<div class="title">${ item.model }</div>
					<div class="info">${ item.year } ${ item.series } (${ item.series_no })</div>
				</div>
			`;

			// save different series and years for menu
			if ( ! series.includes( item.series ) )
				series.push( item.series );
			if ( ! years.includes( item.year ) )
				years.push( item.year );

			total++;
		},
		complete: () => {
			loading.classList.add('hide');
			count.innerText = total;
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
			$$('.photo').forEach( el => el.addEventListener( 'click', () => {
				$('#zoom').src = el.querySelector('img').src;
				modal.classList.remove('hide');
			}) );
		},
		error: err => {
			loading.innerText = `Error loading database: ${err}`;
			loading.classList.add('error');
		}
	});

	// set event listeners for the search box
	searchBox.addEventListener( 'keyup', doSearch );
	$('#clear').addEventListener( 'click', () => doSearch() );

	// hide modal window when clicked
	modal.addEventListener( 'click', () => modal.classList.add('hide') );
})();
