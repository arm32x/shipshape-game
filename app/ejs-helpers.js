/// ShipShape -> ejs-helpers
/// 	Some helpers for use in EJS templates.

const HTMLTag = require('html-tag');


module.exports = {
	button(text, { element = 'button', type = 'text', raised = false, light = false, icon = null, classes = [ ], attributes = { } } = { }) {
		return HTMLTag(
			element, {
				...attributes,
				class: [
					'shp-button',
					type != 'text' ? 'shp-button--' + type : '',
					raised ? 'shp-button--raised' : '',
					light ? 'shp-button--light' : '',
					icon != null ? 'shp-button--with-icon' : '',
				].concat(classes).join(' ').replace(/\s+/g, ' ').trim()
			}, [
				icon != null ? HTMLTag('i', { class: 'shp-button__icon material-icons' }, icon) : '',
				HTMLTag('span', { class: 'rippleJS' }),
				text
			].join('')
		);
	},
	navigationLink(text, href, buttonOptions) {
		return this.button(text, Object.assign(buttonOptions, {
			element: 'a',
			attributes: { href },
			classes: [ 'shp-navigation__item' ]
		}));
	}
};

