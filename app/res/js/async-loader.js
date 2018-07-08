/// ShipShape  >  js  >  async-loader
/// 	Progressively enhances HTML links to load the page asynchronously and
/// 	replace the current page using CSS transitions and animations.


/// Handles a click event on any element and triggers the async loader on
/// links.
function handleEvent(e, element) {
	// If the element passed is undefined, set it to the event target.
	if (element == undefined) {
		element = e.target;
	}
	// Check if the current element is a link.
	if (element.nodeName == 'A') {
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
function loadPage(url) {
	// Initialize an HTTP request.
	let xhr = new XMLHttpRequest();
	// Tell it that we expect an HTML document back.
	xhr.responseType = 'document';
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
					// Replace the old page content with the new page content.
					contentB.innerHTML = contentA.innerHTML;
				} else {
					// If the response is invalid, try to load it normally in
					// the browser.
					window.location.reload();
				}
				return;
			}
			return;
		}
		// Has the response been opened successfully?
		if (xhr.readyState == 1) {
			// Add the requested url to the browser history.
			window.history.pushState(undefined, "", url);
			return;
		}
	});
	// Tell the request where it needs to go.
	xhr.open('GET', url, true);
	// Send it off!
	xhr.send();
}

document.addEventListener('click', handleEvent);

