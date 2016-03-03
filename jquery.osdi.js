/************************************************************
	
	jQuery OSDI Plugin
	
	Submit forms to OSDI-compatible systems using OSDI's non-authenticated POST functions and triggers. Requires jQuery 1.8 or above. More info on OSDI at http://opensupporter.org/
	
	Version: 0.1.0
	Last Updated: February 24, 2016
	Authors: Jason Rosenbaum
	Repository & License: 
	
************************************************************/

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "osdi",
			defaults = {
				autoresponse: true,
				done: function() {},
				fail: function() {},
				always: function() {},
				status: "subscribed",
				ajax_options: {
					type: "POST",
					dataType: 'json',
					contentType: 'application/json'
				}
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			//console.log($element.length);
			this.$element = $(element);

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init(this.$element);
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function($element) {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example bellow
				
				// validate to make sure we can use this form on a basic level
				if (this.validate_form( $element )) {
					this.form_submit($element, this);
				}
			},
			validate_form: function( $element ) {
				//console.log($element);
				if (!$element.is('form')) {
					console.log('JQUERY OSDI ERROR: The DOM element passed to the jQuery OSDI plugin is not a form. The jQuery OSDI plugin only supports form elements.');		
					return false;
				} else {
					return true;
				}
			},
			form_submit: function ( $element, that ) {
				$element.on('submit', function() {
					
					// can we submit the form?
					if (that.validate_submit( $element )) {
						var	body,
							endpoint,
							ajax_options,
							done,
							fail,
							always;
						
						body = that.create_body($element);
						
						if (that.settings.endpoint && that.settings.endpoint != '') {
							endpoint = that.settings.endpoint;
						} else {
							endpoint = $element.attr('action');
						}
						
						ajax_options = {
							url: endpoint,
							data: JSON.stringify(body),
						}
						
						ajax_options = $.extend( ajax_options, that.settings.ajax_options ); 
						
						done = that.settings.done;
						fail = that.settings.fail;
						always = that.settings.always;
						
						//console.log(body);
						//console.log(JSON.stringify(body));
						//console.log(endpoint);
						//console.log(ajax_options);
						//console.log(done);
						//console.log(fail);
						//console.log(always);
						
						that.perform_ajax(ajax_options, done, fail, always);
					}
					
					// stop normal form submission
					return false;
				});
			},
			validate_submit: function( $element ) {
				if (this.validate_endpoint($element) && this.validate_add_tags()
				) {
					return true;
				} else {
					return false;
				}
			},
			validate_endpoint: function ( $element ) {
				//console.log($element);
				//console.log(!this.settings.endpoint);
				//console.log(!$element.attr('action'));
				if (!this.settings.endpoint && !$element.attr('action')) {
					console.log('JQUERY OSDI ERROR: An endpoint is required. Either set the endpoint option with a string when calling the jQuery OSDI plugin, or give your form an action attribute with the endpoint as its value.');
					return false;
				} else {
					return true;
				}
			},
			validate_add_tags: function() {
				//console.log(this.settings.add_tags);
				//console.log(this.settings.add_tags.length);
				//console.log(this.settings.add_tags);
				//console.log(!$.isArray(this.settings.add_tags));
				//console.log(this.settings.add_tags.length <= 0);
				if (this.settings.add_tags) {
					if (!$.isArray(this.settings.add_tags) || !this.settings.add_tags.length > 0) {
						console.log('JQUERY OSDI ERROR: The add_tags option is not a valid array of at least one element. You must pass an array with at least one element to the jQuery OSDI plugin to add tags.');
						return false;
					} else {
						return true;
					}
				} else {
					return true;
				}
			},
			create_body: function( $element ) {
				var	body,
					autoresponse,
					email_address,
					postal_address,
					postal_addresses,
					phone_number,
					add_tags;
				
				if (this.settings.body) {
					body = this.settings.body();
				} else {
					body = {
						"person" : {}
					}
					
					if (this.settings.autoresponse) {
						autoresponse = {
							"triggers" : {
								"autoresponse" : {
									"enabled" : true
								}
							}
						}
						
						$.extend( body, autoresponse );
					}
					
					if (this.settings.add_tags) {
						add_tags = {
							"add_tags": this.settings.add_tags
						};
						
						$.extend( body, add_tags );
					}
					
					if ($element.find('input[name="family_name"]').length && $element.find('input[name="family_name"]').val() != '') {
						body.person.family_name = $element.find('input[name="family_name"]').val();
					}
					
					if ($element.find('input[name="given_name"]').length && $element.find('input[name="given_name"]').val() != '') {
						body.person.given_name = $element.find('input[name="given_name"]').val();
					}
					
					if ($element.find('input[name="email_address"]').length && $element.find('input[name="email_address"]').val() != '') {
						email_address = {
							"email_addresses" : [ 
								{ 
									"address" : $element.find('input[name="email_address"]').val() 	
								}
							]
						};
						
						$.extend( body.person, email_address );
						
						// add status here, if we have email
						if (this.settings.status) {
							body.person.email_addresses[0].status = this.settings.status;
						}
					}
					
					if (
						   	($element.find('input[name="street"]').length && $element.find('input[name="street"]').val() != '') 
						|| 	($element.find('input[name="locality"]').length && $element.find('input[name="locality"]').val() != '') 
						||	($element.find('input[name="region"]').length && $element.find('input[name="region"]').val() != '') 
						|| 	($element.find('input[name="postal_code"]').length && $element.find('input[name="postal_code"]').val() != '')
						|| 	($element.find('input[name="country"]').length && $element.find('input[name="country"]').val() != '')
					) {
						postal_address = {};
						
						if ($element.find('input[name="street"]').length && $element.find('input[name="street"]').val() != '') {
							postal_address.address_lines = [
								$element.find('input[name="street"]').val()
							];
						}
						
						if ($element.find('input[name="locality"]').length && $element.find('input[name="locality"]').val() != '') {
							postal_address.locality = $element.find('input[name="locality"]').val();
						}
						
						if ($element.find('input[name="region"]').length && $element.find('input[name="region"]').val() != '') {
							postal_address.region = $element.find('input[name="region"]').val();
						}
						
						if ($element.find('input[name="postal_code"]').length && $element.find('input[name="postal_code"]').val() != '') {
							postal_address.postal_code = $element.find('input[name="postal_code"]').val();
						}
						
						if ($element.find('input[name="country"]').length && $element.find('input[name="country"]').val() != '') {
							postal_address.country = $element.find('input[name="country"]').val();
						}
						
						postal_addresses = {
							"postal_addresses" : [
								postal_address
							]
						};
						
						$.extend( body.person, postal_addresses );
					}
					
					if ($element.find('input[name="phone_number"]').length && $element.find('input[name="phone_number"]').val() != '') {
						phone_number = {
							"phone_numbers" : [ 
								{ 
									"number" : $element.find('input[name="phone_number"]').val() 	
								}
							]
						};
						
						$.extend( body.person, phone_number );
					}
					
				}
				
				return body;
			},
			perform_ajax: function(ajax_options, done, fail, always) {
				$.ajax(
					ajax_options
				).done(function(data, textStatus, jqXHR) {
					done(data, textStatus, jqXHR);
				}).fail(function(jqXHR, textStatus, errorThrown) {
					fail(jqXHR, textStatus, errorThrown);
				}).always(function(data_jqXHR, textStatus, jqXHR_errorThrown) {
					always(data_jqXHR, textStatus, jqXHR_errorThrown)
				});
			}	
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );