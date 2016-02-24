# jquery-osdi
The jQuery OSDI plugin implements non-authenticated POST via AJAX against OSDI-compliant API endpoints. It can be used to send in data to OSDI-compliant APIs.

*Version 0.1.0*

#Overview & Requirements

The jQuery OSDI plugin attaches to form DOM markup and processes form input to send to OSDI-compliant APIs via AJAX. It can be used to create frontend forms that submit data over an OSDI-complaint API to a remote server.

The plugin makes use of OSDI's non-authenticated POST features, so an API key or other type of authentication is not required, making this plugin suitable for frontend implementations.

The plugin expects to POST to one of the OSDI helper endpoints, which can accept non-authenticated POSTs according to the spec. For more information about the OSDI format, see [the documentation here](http://opensupporter.github.io/osdi-docs/).

The jQuery OSDI plugin is called on form tags. It can automatically pick up data from the form tag and underlying inputs, in which case special input names are used, or you can specify exactly the body to use in the form of a function that returns JSON to be POSTed via AJAX. Additional options and AJAX callback handlers can be added as well.

The jQuery OSDI plugin requires jQuery version 1.8 or later.

#Basic Usage & Demo

Include jQuery and the plugin javascript file, then call the jQuery OSDI plugin on a form:

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js" type="text/javascript"></script> 
<script src="jquery.osdi.js" type="text/javascript"></script>

<script type="text/javascript">
$(document).ready(function() {
	$('form').osdi();
});
</script>
```

A demo with more examples is available in the `demo.html` file in the repository.


#Options

The jQuery OSDI plugin can take various options on initialization. They are:

| Name          | Type      | Default      	| Description
|-----------    |-----------|--------------	|------------
|endpoint		|string     |Your form's <code>action</code> attribute.	| The endpoint to POST to.
|body		|function     |Created from your form's inputs. (See [below](#form-input-names) for special naming conventions.)	| A function that returns the JSON that will be POSTed to the endpoint. Should be valid OSDI for the endpoint, typically OSDI helper POST format containing at least a person object. [See the OSDI documentation form more information and examples.](http://opensupporter.github.io/osdi-docs/)
|autoresponse		|boolean     |true	| Whether the receiving server should asked to send an email autoresponse.
|add_tags		|array     |	| An array of tags the server should be asked to add to the person.
|done		|function     |	| A function to be executed after a successful AJAX POST. A passthrough for jQuery's [.done](http://api.jquery.com/jquery.ajax/) callback. Can have the same arguments, <code>data</code>, <code>textStatus</code>, and <code>jqXHR</code>.
|fail		|function     |	| A function to be executed after a failed AJAX POST. A passthrough for jQuery's [.fail](http://api.jquery.com/jquery.ajax/) callback. Can have the same arguments, <code>jqXHR</code>, <code>textStatus</code>, and <code>errorThrown</code>.
|always		|function     |	| A function to be executed after an AJAX POST, no matter success or failure. A passthrough for jQuery's [.always](http://api.jquery.com/jquery.ajax/) function. Can have the same arguments, <code>data|jqXHR</code>, <code>textStatus</code>, and <code>jqXHR|errorThrown</code>.
|ajax_options		|object     |	| An object to be passed through to jQuery's <code>$.ajax()</code> function. See [jQuery's documentation](http://api.jquery.com/jquery.ajax/) for available options.


#Form Input Names

If you omit the <code>body</code> option, the jQuery OSDI plugin will attempt to create an OSDI-compliant JSON body to POST for you, using the inputs in your form. Specifically, it will create an inline [person object](http://opensupporter.github.io/osdi-docs/people.html) to use as part of the OSDI helper format. Use these special names on your form inputs to tell the plugin which input corresponds to which piece of data:

| Form Name          | OSDI Field      | Description
|-----------    |-----------|--------------
|given_name		|given_name     |The person's first name.
|family_name		|family_name     |The person's last name.
|email_address		|email_addresses[address]     |The person's email address.
|street		|postal_addresses[address_lines[]]     |The person's street address.
|locality		|postal_addresses[locality]     |The person's city or other local administrative area.
|region		|postal_addresses[region]     |State or subdivision codes according to ISO 3166-2 (Final 2 alpha digits).
|postal_code		|postal_addresses[postal_code]     |The region specific postal code, such as a zip code.
|country		|postal_addresses[country]     |The country code according to ISO 3166-1 Alpha-2.
|phone_number		|phone_numbers[number]     |The phone number of the person. Must including country code and must be numeric characters only.