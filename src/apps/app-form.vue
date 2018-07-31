<template>
<div id="form-test">
	<text-field label-error="Input a valid email" label="Email" v-model="email" :validator="$v.email"></text-field>
	<text-field label-error="Input ‘John’" label="Name" v-model="name" :validator="$v.name"></text-field>
</div>
</template>

<script>
	w.app = new Vue({
		template: "<%= template %>",
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
</script>