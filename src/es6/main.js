import { ajax } from './utils';
import Vue from 'vue';
import './_components';

ajax({
	url: 'https://jsonplaceholder.typicode.com/users',
	mode: 'cors'
})
.then(response => { console.log(response); return response.json(); })
.then(data => console.log(data));

var App = new Vue({
	el: '#app'
});