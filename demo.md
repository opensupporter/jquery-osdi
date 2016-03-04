---
layout: default
title: jQuery OSDI Demo

---
# jQuery OSDI Demo
	                
The jQuery OSDI plugin implements non-authenticated POST via AJAX against OSDI-compliant API endpoints.
	                
The plugin is called on a form and can contain various options, explained in more detail [here](https://github.com/opensupporter/jquery-osdi). See the demo below for some examples on how it can be used.

{% include simple-code.md %}	
	                
## Simple Form Example
                    
In this example, the plugin is called over a form with default options. It will use the form's `action` attribute as the OSDI API endpoint to POST to, and it will use the data entered in the form inputs (which are specially named so the plugin can pick them up) as the POST body. It will tell the server to send an autoresponse email as well (which is the default).

{% include simple-example-head.html %}		
{% include simple-code.md %}				
{% include simple-example-foot.html %}		
					
[Back to top...](#)

					
## Custom Example
                    
In this example, the plugin is called with custom options, including a custom built body JSON instead of one derived from the form inputs directly, a custom endpoint instead of the one specified by the form's `action` attribute, custom AJAX event handlers, the `add_tags` option, and the autoresponse is suppressed.
					
{% include custom-example.html %}
					
[Back to top...](#)

{% include javascripts.html %}