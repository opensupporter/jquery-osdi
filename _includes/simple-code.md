```html
<form id="simple-demo" action="https://osdi-sample-system.com/api/v1/petitions/41e14e41-3ba5-4304-8b6e-2dddcd528f98/signatures"  method="post">
  <label>First Name:</label>
  <input type="text" name="given_name" />
  
  <label>Last Name:</label>
  <input type="text" name="family_name" />
  
  <label>Email Address:</label>
  <input type="text" name="email_address"/>
  
  <label>Street Address:</label>
  <input type="text" name="street" />
  
  <label>City:</label>
  <input type="text" name="locality" />
  
  <label>State (two digits):</label>
  <input type="text" name="region" />
  
  <label>Zip/Postal Code:</label>
  <input type="text" name="postal_code" />
  
  <label>Country (two digits):</label>
  <input type="text" name="country" />
  
  <label>Phone Number:</label>
  <input type="text" name="phone_number"  />

  <label>Member Number:</label>
  <input type="text" name="custom[member_number]">

  <label>Is Member</label>
  <label><input type="radio" name="custom[is_member]" value="1"> Yes</label>
  <label><input type="radio" name="custom[is_member]" value="0"> No</label>

  <button type="submit" id="simple_submit" value="Submit" class="btn-primary btn">Submit</button>
</form>

<script type="text/javascript">
$(document).ready(function() {
  $('#simple-demo').osdi();
});
</script>
```