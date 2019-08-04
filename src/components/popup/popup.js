import Vue from 'vue';
console.log('popup');

Vue.component('popup-modal', 
{
	template: "<transition name=modal><div class=popup-modal :class=\"[\'popup-modal_shadow-\'+shadowSize, \'popup-modal_animate-\'+animationType, \'popup-modal_close-\'+semanticCloseDirection.toString() ]\"><div class=popup-modal__wrapper @click.stop.self=\"$emit(\'close\')\"><div class=popup-modal__container><div class=popup-modal__header><slot name=header>default header</slot></div><div class=popup-modal__body><slot name=body>default body</slot></div><div class=popup-modal__footer><slot name=footer>default footer <button class=popup-modal__default-button @click=\"$emit(\'close\')\">Ok</button></slot></div></div></div></div></transition>",
	props: {
		'shadowSize': {
			type: Number,
			default: 5
		},
		'animationType': {
			validator: function (value) {
				// The value must match one of these strings
				console.log(value);
				return ['down', 'back'].indexOf(value) !== -1
			},
			default: 'down'
		},
		'semanticCloseDirection': {
			type: Boolean,
			default: false
		}
	}
});
