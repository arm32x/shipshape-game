/// ShipShape  >  js  >  async-loader
/// 	Progressively enhances HTML links to load the page asynchronously and
/// 	replace the current page using CSS transitions and animations.


/// Determines whether or not to enable the async loader.
const ASYNC_LOADER_ENABLED = false;

/// Handles a click event on any element and triggers the async loader on
/// links.
function handleEvent(e, element) {
	// If the element passed is undefined, set it to the event target.
	if (element == undefined) {
		element = e.target;
	}
	// Check if the current element is a link without 'data-noasync'.
	if (element.nodeName == 'A' && element.getAttribute('data-noasync') == undefined) {
		// If is is, continue validation checks.
		if (!element.hasAttribute('href')) return;
		if (!element.href.startsWith(window.location.protocol + '//' + window.location.host)) return;
		// Prevent the default link handler from activating.
		e.preventDefault();
		// Load the page.
		loadPage(element.href);
	} else {
		// If it is not, make sure that it isn't the top-level node.
		if (element.parentNode != null) {
			// If it isn't, recursively call this function on it's parent.
			return handleEvent(e, element.parentNode);
		} else {
			// If it is, don't do anything else.
			return;
		}
	}
}

/// Asynchronously loads a page from a url and injects it into the DOM.
let animI; let animO;
function loadPage(url) {
	// Initialize an HTTP request.
	let xhr = new XMLHttpRequest();
	// Tell it that we expect an HTML document back.
	xhr.responseType = 'document';
	/// Replace the page content and finish the loading animation.
	function replacePage(contentA, contentB) {
		// Replace the old page content with the new page content.
		contentB.innerHTML = contentA.innerHTML;
		// Finish the loading animation (display the end part) and make sure no
		// other animations are playing.
		if (animI != undefined) animI.pause();
		if (animO != undefined) animO.pause();
		animI = anime({
			targets    : '#shp-content',
			translateY : 0,
			opacity    : 1.00,
			easing     : [ 0.0, 0.0, 0.2, 1.0 ],
			duration   : 200
		});
	}
	// Add a listener to track the request.
	xhr.addEventListener('readystatechange', (e) => {
		// Check if the response has arrived yet.
		if (xhr.readyState == 4) {
			// Has it arrived successfully?
			if (xhr.status == 200) {
				// Make sure it has the right stuff.
				let valid = true;
				let response = xhr.response;
				if (response == null) valid = false;
				let contentA = response.getElementById('shp-content');
				if (contentA == null) valid = false;
				let contentB = document.getElementById('shp-content');
				if (contentB == null) valid = false;
				// Check if the preceding tests passed.
				if (valid) {
					// Is the animation completed?
					if (animO.completed) {
						replacePage(contentA, contentB);
					} else {
						// Wait for the animation to complete.
						animO.complete = () => {
							replacePage(contentA, contentB);
						};
					}
				} else {
					// If the response is invalid, try to load it normally in
					// the browser.
					window.location.reload();
				}
			}
			return;
		}
		// Has the response been opened successfully?
		if (xhr.readyState == 1) {
			// Add the requested url to the browser history.
			window.history.pushState(undefined, "", url);
			// Start the loading animation and make sure no other animations
			// are playing.
			if (animI != undefined) animI.pause();
			if (animO != undefined) animO.pause();
			animO = anime({
				targets    : '#shp-content',
				translateY : 16,
				opacity    : 0.00,
				easing     : [ 0.4, 0.0, 1.0, 1.0 ],
				duration   : 150
			});
			return;
		}
	});
	// Tell the request where it needs to go.
	xhr.open('GET', url, true);
	// Send it off!
	xhr.send();
}

// Enables the async loader.
if (ASYNC_LOADER_ENABLED) document.addEventListener('click', handleEvent);
