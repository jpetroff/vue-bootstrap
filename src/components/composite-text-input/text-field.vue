<template>
	<div class="text-field"
	:class="{
		'text-field_error': validator.$error,
		'text-field_has-input': focus || value
	}">
		<div class="disabled-overlay"></div>
		<input
			:value="value"
			@input="updateValue($event.target.value)"
			@focus="focus = true"
			@blur="focus = false"
			type="text"
			class="text-field__input"
			id="text-field-field__destination"
			name="destination"
		>
		<label class="text-field__label" for="text-field-field__destination">{{message}}</label>
	</div>
</template>

<script type="text/javascript">
import Vue from 'vue';

Vue.component('text-field', 
{
	template: '<%=template%>',
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
});
</script>