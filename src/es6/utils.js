import 'promise-polyfill';
import 'whatwg-fetch';
import _ from 'underscore';

export function ajax(opts) {
	let options = _.extend({
		method: 'GET', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, cors, *same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'include', // include, *same-origin, omit
		headers: {
				// 'Content-Type': 'application/json',
				// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrer: 'no-referrer', // no-referrer, *client
		// body: JSON.stringify(data), // body data type must match "Content-Type" header
	}, _.omit(opts, 'url'));

	return fetch(opts.url, options);
}