import * as utils from './utils';
import './popup';

utils.ajax({
	url: 'https://jsonplaceholder.typicode.com/users',
	mode: 'cors'
})
.then(response => { console.log(response); return response.json(); })
.then(data => console.log(data));