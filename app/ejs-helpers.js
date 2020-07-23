/// ShipShape  >  ejs-helpers
/// 	Some helpers for use in EJS templates.

const HTMLTag = require('html-tag');


module.exports = {
	button(text, { element = 'button', type = 'text', raised = false, light = false, dark = false, icon = null, classes = [ ], attributes = { } } = { }) {
		return HTMLTag(
			element, {
				...attributes,
				class: [
					'shp-button',
					type != 'text' ? 'shp-button--' + type : '',
					raised ? 'shp-button--raised' : '',
					light ? 'shp-button--light' : '',
					dark ? 'shp-button--dark' : '',
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
			classes: [ 'shp-navigation__item' ].concat(buttonOptions.classes).join(' ').replace(/\s+/g, ' ').trim()
		}));
	},
	iconButton(icon, { element = 'button', light = false, classes = [ ], attributes = { } } = { }) {
		return HTMLTag(
			element, {
				...attributes,
				class: [
					'shp-icon-button',
					light ? 'shp-icon-button--light' : ''
				].concat(classes).join(' ').replace(/\s+/g, ' ').trim()
			}, [
				HTMLTag('i', { class: 'shp-icon-button__icon material-icons' }, icon),
				HTMLTag('span', { class: 'rippleJS' })
			].join('')
		);
	}
};

