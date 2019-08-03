import Vue from 'vue';
console.log('popup');

Vue.component('popup-modal', 
{
	template: "<transition name=modal><div class=popup-modal><div class=popup-modal__wrapper @click.stop.self=\"$emit(\'close\')\"><div class=popup-modal__container><div class=popup-modal__header><slot name=header>default header</slot></div><div class=popup-modal__body><slot name=body>default body</slot></div><div class=popup-modal__footer><slot name=footer>default footer <button class=popup-modal__default-button @click=\"$emit(\'close\')\">OK</button></slot></div></div></div></div></transition>"
});
