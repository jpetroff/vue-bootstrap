(function(w){
"use strict";
// File /Users/john/SyncDocs/reps/vue-bootstrap/src/js/preamble.js

w.Components = {}
// End of /Users/john/SyncDocs/reps/vue-bootstrap/src/js/preamble.js
})(window);
(function(w){
"use strict";
// File /Users/john/SyncDocs/reps/vue-bootstrap/src/components/popup.js

w.Components['popup-modal'] = {
	template: "<transition name=modal><div class=popup-modal><div class=popup-modal__wrapper @click.stop.self=\"$emit(\'close\')\"><div class=popup-modal__container><div class=popup-modal__header><slot name=header>default header</slot></div><div class=popup-modal__body><slot name=body>default body</slot></div><div class=popup-modal__footer><slot name=footer>default footer <button class=popup-modal__default-button @click=\"$emit(\'close\')\">OK</button></slot></div></div></div></div></transition>"
}

// End of /Users/john/SyncDocs/reps/vue-bootstrap/src/components/popup.js
})(window);
(function(w){
"use strict";
// File /Users/john/SyncDocs/reps/vue-bootstrap/src/components/text-field.js

w.Components['text-field'] = {
	template: '<div class=text-field :class=\"{\n	\'text-field_error\': validator.$error,\n	\'text-field_has-input\': focus || value\n}\"><div class=disabled-overlay></div><input :value=value @input=updateValue($event.target.value) @focus=\"focus = true\" @blur=\"focus = false\" type=text class=text-field__input id=text-field-field__destination name=destination><label class=text-field__label for=text-field-field__destination>{{message}}</label></div>',
	props: [
		'label',
		'label-error',
		'value',
		'validator'
	],
	created: function() {
		this.triggerError = _.debounce(_.bind(this.validator.$touch, this), 500)
	},
	data: function() {
		return {
			focus: false
		}
	},
	computed: {
		message: function() {
			if (this.validator.$error) {
				return this.labelError
			} else {
				return this.label
			}
		}
	},
	methods: {
		updateValue: function(value) {
			this.validator.$reset()
			this.$emit('input', value)
			this.triggerError()
		}
	}
}

// End of /Users/john/SyncDocs/reps/vue-bootstrap/src/components/text-field.js
})(window);
(function(w){
"use strict";
// File /Users/john/SyncDocs/reps/vue-bootstrap/src/apps/app-form.js

w.app = new Vue({
	template: "<div id=form-test><text-field label-error=\"Input a valid email\" label=Email v-model=email :validator=$v.email></text-field><text-field label-error=\"Input ‘John’\" label=Name v-model=name :validator=$v.name></text-field></div>",
	mixins: [window.vuelidate.validationMixin],
	data: {
		email: '',
		name: ''
	},
	validations: {
		email: {
			email: window.validators.email,
			required: window.validators.required
		},
		name: {
			text: function(val) {
				return(val == 'John')
			}
		}
	},
	components: {
		'text-field': Components['text-field']
	}
});

// End of /Users/john/SyncDocs/reps/vue-bootstrap/src/apps/app-form.js
})(window);
(function(w){
"use strict";
// File /Users/john/SyncDocs/reps/vue-bootstrap/src/apps/app-popup.js

w.popup = new Vue({
	template: "<div id=popup><a href=# @click.prevent=\"showModal = true\">Open</a><popup-modal v-show=showModal @close=\"showModal = false\"><div slot=body>Text</div></popup-modal></div>",
	data: {
		showModal: true
	},
	components: {
		'popup-modal': Components['popup-modal']
	}
});

// End of /Users/john/SyncDocs/reps/vue-bootstrap/src/apps/app-popup.js
})(window);
(function(w){
"use strict";
// File /Users/john/SyncDocs/reps/vue-bootstrap/src/js/main.js

w.app.$mount('#form-test')

w.popup.$mount('#popup')

console.log('!');
// End of /Users/john/SyncDocs/reps/vue-bootstrap/src/js/main.js
})(window);