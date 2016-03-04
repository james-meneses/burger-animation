(function(){
	'use strict'

	var buttons = document.querySelectorAll('.c-hamburger')
	console.log('bt', buttons)

	// forEach method, could be shipped as part of an Object Literal/Module
	var forEach = function (array, callback, scope) {
	  for (var i = 0; i < array.length; i++) {
	    callback.call(scope, i, array[i]) // passes back stuff we need
	  }
	}


	forEach(buttons, function(idx, el){
		console.log('el', el)
		el.addEventListener('click', function(ev){
			this.classList.toggle('is-active')
		})
	})

}) ();
