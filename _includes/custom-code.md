```html
<form id="custom-demo" action="/" method="post">
  <label>First Name:</label>
  <select name="first" id="first">
    <option value="">[choose one]</option>
    <option value="Adam">Adam</option>
    <option value="Eve">Eve</option>
  </select>
  
  <label>Email Address:</label>
  <input type="text" name="email_address" id="email" />
  
  <button type="submit" id="custom_submit" value="Submit" class="btn-primary btn">Submit</button>
  
  <div id="success"></div>
</form>
<script type="text/javascript">
$(document).ready(function() {
  $('#custom-demo').osdi({
    endpoint: "https://osdi-sample-system.com/api/v1/petitions/41e14e41-3ba5-4304-8b6e-2dddcd528f98/signatures",
    body: function() {
      return {
        "person": {
          "given_name": $('#first').val(),
          "email_addresses": [
            {
              "address": $('#email').val()
            }
          ]
        },
        "add_tags": [
          "volunteer"
        ]
      }
    },
    done: function(data, textStatus, jqXHR) {
      console.log('done');
      $('#success').html('<p><strong>It worked!</strong></p>');
    },
    fail: function(jqXHR, textStatus, errorThrown) {
      $('#success').html('<p><strong>It failed!</strong></p>');
    },
    always: function(data_jqXHR, textStatus, jqXHR_errorThrown) {
      console.log('always');
    }
  });
});
</script>
```