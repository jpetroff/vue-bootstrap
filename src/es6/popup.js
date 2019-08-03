import Vue from 'vue';
import '../components/popup/popup';

var popupApp = new Vue({
	el:'#popup',
	data: {
		showModal: true
	}
});

export {popupApp};