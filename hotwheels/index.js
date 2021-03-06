/**
 * A searchable gallery using Google Sheets as a simple database
 *
 * by Henrique Vianna - https://henriquevianna.com
 */

import * as Papa from 'https://cdn.skypack.dev/papaparse';

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQA88VnFS7YDPOU9k8zT5Iax3Ju-6J3z4vkJhy9vdyw0Z1kK6j45I-r1THtmfy7_--LF3h4oYSrqk-l/pub?gid=0&single=true&output=csv';
const wishesURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQA88VnFS7YDPOU9k8zT5Iax3Ju-6J3z4vkJhy9vdyw0Z1kK6j45I-r1THtmfy7_--LF3h4oYSrqk-l/pub?gid=1657118775&single=true&output=csv';

// selector shorthand functions
const $  = document.querySelector.bind( document );
const $$ = document.querySelectorAll.bind( document );

// globals
const searchBox  = $('#search');
const count      = $('#count');

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

	// search only on the selected gallery - collection or wishlist
	const target = collection.classList.contains('hide') ? wishlist : collection;

	// iterate over gallery items and hide those that don't match the search string
	// if search string is empty, "unhide" all items on both galleries
	( value === '' ? document : target).querySelectorAll('.item').forEach( item => {
		const text = ( field ? item.dataset[ field ] : item.innerText ).toLowerCase();
		item.classList.toggle( 'hide', value.length && ! text.includes( value ) );
	});

	// show count for displayed items
	count.innerText = target.querySelectorAll('.item:not(.hide)').length;
}

// Initialization

(function () {

	const collection = $('#collection');
	const wishlist   = $('#wishlist');
	const modal      = $('#modal');
	const loading    = $('#loading');

	let series = [];
	let years  = [];
	let total  = 0;

	// gallery item template
	const itemTemplate = ( item ) => {
		const photo = item.image_url || ( item.image_id ? `https://lh3.googleusercontent.com/pw/${item.image_id}=w1400` : '' );
		return `
			<div class="item" data-year="${ item.year }" data-series="${ item.series }" data-part="${ item.part_no }" data-th="${ item.flg_th }">
				<div class="photo">
					${ photo ? '<img src="' + photo + '" loading="lazy">' : '' }
					<div class="number">${ item.year_no }</div>
					<div class="part">${ item.part_no }</div>
				</div>
				<div class="model">${ item.model }</div>
				<div class="info">${ item.year } ${ item.series } ${ item.series_no ? '(' + item.series_no + ')' : '' }</div>
			</div>
		`;
	}

	// load collection spreadsheet
	Papa.parse( sheetURL, {
		download: true,
		header: true,
		step: result => {
			// add new item to the gallery
			const item = result.data;
			collection.innerHTML += itemTemplate( item );

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
		},
		error: err => {
			loading.innerText = `Error loading database: ${err}`;
			loading.classList.add('error');
		}
	});

	// load wishlist spreadsheet
	Papa.parse( wishesURL, {
		download: true,
		header: true,
		complete: result => {
			// populate the gallery
			const data = result.data;
			data.forEach( item => wishlist.innerHTML += itemTemplate( item ) );
		}
	});

	// show/hide wishlist
	const wishlistBtn = $('#wishlist_toggle');
	const title = $('#title');
	const toggleWishlist = ( force ) => {
		const active = wishlistBtn.classList.toggle( 'wishlist', force );
		wishlist.classList.toggle( 'hide', ! active );
		collection.classList.toggle( 'hide', active );
		title.classList.toggle( 'wishlist', active );
		count.innerText = ( active ? wishlist : collection ).querySelectorAll('.item:not(.hide)').length;
	}

	wishlistBtn.addEventListener( 'click', () => toggleWishlist() );

	// clicking the title leads back to the main gallery and clear any search
	title.addEventListener( 'click', () => {
		toggleWishlist( false );
		doSearch();
	});

	// show/hide submenus on hover or click
	$$('.menu > li:not([id])').forEach( el => {
		el.addEventListener( 'mouseover', () => el.classList.toggle( 'active', true ) );
		el.addEventListener( 'mouseout', () => el.classList.toggle( 'active', false ) );
		el.addEventListener( 'click', () => el.classList.toggle( 'active' ) );
	});

	// set event listeners for the search box
	searchBox.addEventListener( 'keyup', doSearch );
	$('#clear').addEventListener( 'click', () => doSearch() );

	// zoom image on click
	document.addEventListener( 'click', evt => {
		const el = evt.target.closest('.photo');
		if ( el ) {
			const img = el.querySelector('img');
			if ( img ) {
				$('#zoom').src = img.src;
				modal.classList.remove('hide');
			}
		}
	});

	// hide modal window when clicked
	modal.addEventListener( 'click', () => modal.classList.add('hide') );
})();
