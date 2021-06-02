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
	let zoomedEl, currentImg;

	// gallery item template
	const itemTemplate = ( item ) => {
		if ( ! item.model )
			return '';

		const photos = ( item.image_url || item.image_id || '' ).split(','),
			  [ ...flags ] = item.flags.toUpperCase();

		let html = `
			<div class="item" data-year="${ item.year }" data-series="${ item.series }" data-part="${ item.part_no }" data-flags="${ item.flags }">
				<div class="photo">
		`;

		for ( const photo of photos )
			if ( photo )
				html += `<img src="${ photo.startsWith('http') ? photo : 'https://lh3.googleusercontent.com/pw/' + photo + '=w1400' }" loading="lazy">`;

		html += `
					<div class="number">${ item.year_no }</div>
					<div class="part">${ item.part_no }</div>
					<div class="flags">
						${ flags.includes('N') ? '<i class="flag-new" title="Novo!"></i>' : '' }
						${ flags.includes('S') ? '<i class="flag-star" title="Track Stars"></i>' : '' }
						${ flags.includes('T') ? '<i class="flag-th" title="Treasure Hunter"></i>' : '' }
						${ flags.includes('$') ? '<i class="flag-sth" title="SUPER TREASURE HUNTER"></i>' : '' }
						${ flags.includes('P') ? '<i class="flag-premium" title="Premium"></i>' : '' }
					</div>
				</div>
				<div class="model">${ item.model }</div>
				<div class="info">${ item.year } ${ item.series } ${ item.series_no ? '(' + item.series_no + ')' : '' }</div>
			</div>
		`;

		return html;
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

	// alternate between wishlist and collection when clicking on title
	const title = $('#title');
	title.addEventListener( 'click', () => {
		const active = title.classList.toggle( 'wishlist' );
		wishlist.classList.toggle( 'hide', ! active );
		collection.classList.toggle( 'hide', active );
		doSearch(); // clear search
	});

	// show/hide submenus on hover or click
	$$('.menu > li').forEach( el => {
		el.addEventListener( 'mouseover', () => el.classList.add( 'active' ) );
		el.addEventListener( 'mouseout', () => el.classList.remove( 'active' ) );
		el.addEventListener( 'click', () => el.classList.toggle( 'active' ) );
	});

	const mobileMenu = $('#mobile_menu');
	mobileMenu.addEventListener( 'click', () => mobileMenu.classList.toggle( 'active' ) );
	$('#menu_close').addEventListener( 'click', () => mobileMenu.classList.remove( 'active' ) );

	$$('.menu li li').forEach( el => {
		el.addEventListener( 'click', () => mobileMenu.classList.remove( 'active' ) );
	});

	// set event listeners for searches
	searchBox.addEventListener( 'keyup', doSearch );
	$$('[data-search]').forEach( el => el.addEventListener( 'click', () => doSearch( el.dataset.search ) ) );

	// zoom image on click
	document.addEventListener( 'click', evt => {
		zoomedEl = evt.target.closest('.item');
		if ( zoomedEl ) {
			const meta = zoomedEl.dataset,
				  [ ...flags ] = meta.flags.toUpperCase();

			$('#info').innerHTML = `
				<span>${ meta.part }</span>
				<span>${ zoomedEl.querySelector('.model').innerText }</span>
				<span>${ meta.year }</span>
				${ flags.includes('N') ? '<span>Novo!</span>' : '' }
				${ flags.includes('C') ? '<span>Coleção</span>' : '' }
				${ flags.includes('S') ? '<span>Track Stars</span>' : '' }
				${ flags.includes('T') ? '<span>TREASURE HUNT</span>' : '' }
				${ flags.includes('$') ? '<span>SUPER TREASURE HUNT</span>' : '' }
				${ flags.includes('P') ? '<span>PREMIUM</span>' : '' }
			`;
			const img = zoomedEl.querySelector('img');
			if ( img ) {
				$('#zoom').src = img.src;
				currentImg = 1;
				modal.classList.remove('hide');
			}
		}
	});

	// navigate thru zoomed images
	const navModal = ( evt, dir = 1 ) => {
		// when called by touch event handlers, `evt` is null/undefined
		// we check this here to avoid trigering a 'click' event as well
		if ( evt )
			evt.stopPropagation();

		// check if there are more pictures of the current item
		const photos  = zoomedEl.querySelectorAll('img'),
			  nextImg = currentImg + dir;

		if ( nextImg > 0 && nextImg <= photos.length ) {
			currentImg = nextImg;
			$('#zoom').src = photos[ currentImg - 1 ].src;
			return;
		}

		// move to next/previous gallery item
		let sibling = zoomedEl;
		do {
			// find sibling item in the desired direction - if none, select the modal window (quits zoom)
			sibling = sibling[ dir == -1 ? 'previousElementSibling' : 'nextElementSibling' ] || modal;
 		// repeat if item is hidden or has no photo, until reaching the end (sibling == modal)
		} while ( ( sibling.classList.contains('hide') || ! sibling.querySelector('img') ) && sibling !== modal );
		sibling.click();
	}

	$('#prev').addEventListener( 'click', evt => navModal( evt, -1 ) );
	$('#next').addEventListener( 'click', navModal );

	// enable swipe left/right on modal
/*
	let touchStartX = 0;

	modal.addEventListener( 'touchstart', evt => touchStartX = evt.changedTouches[0].screenX );
	modal.addEventListener( 'touchend', evt => {
		const touchEndX = evt.changedTouches[0].screenX;
		if ( touchEndX > touchStartX )
			navModal( null, -1 );
		else if ( touchEndX < touchStartX )
			navModal();
	});
*/
	// hide modal window when clicked
	modal.addEventListener( 'click', () => modal.classList.add('hide') );
})();
