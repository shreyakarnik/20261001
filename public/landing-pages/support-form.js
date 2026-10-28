/* ============================================================
   CUSTOMER SUPPORT FORM (home page, #support)
   ------------------------------------------------------------
   Posts to HubSpot like the "Let's Talk!" form (talk-modal.js).
   HUBSPOT SETUP: replace SUPPORT_HUBSPOT_PORTAL_ID / SUPPORT_HUBSPOT_FORM_GUID
   with your portal ID + the support form's GUID. Names on the left of
   fieldMap are this form's; on the right, HubSpot's internal names.
   ============================================================ */
(function(){
  var SUPPORT_HUBSPOT_PORTAL_ID = "14495142";
  var SUPPORT_HUBSPOT_FORM_GUID = "e609c377-9403-4c70-98d9-f41de1bc57a3";   /* https://share.hsforms.com/15gnDd5QDTHCY2fQd4bxXow8moiu */

  var form = document.getElementById('supForm'); if (!form) return;
  var btn = form.querySelector('.sup-submit'), done = document.getElementById('supDone');

  form.addEventListener('submit', function(event){
    event.preventDefault();
    var data = new FormData(form);
    var fieldMap = {
      email: "email",
      phone: "phone",
      firstname: "firstname",
      lastname: "lastname",
      country: "country2",
      location: "which_location_is_this_for_",
      message: "message"
    };
    var fields = [];
    Object.keys(fieldMap).forEach(function(k){
      var v = data.get(k);
      if (v !== null && v !== "") fields.push({ name: fieldMap[k], value: v });
    });

    btn.disabled = true; btn.textContent = 'Sending...';
    fetch("https://api.hsforms.com/submissions/v3/integration/submit/" + SUPPORT_HUBSPOT_PORTAL_ID + "/" + SUPPORT_HUBSPOT_FORM_GUID, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: fields, context: { hutk: (document.cookie.match(/(?:^|; )hubspotutk=([^;]+)/) || [])[1], pageUri: location.href, pageName: document.title } })
    })
    .then(function(res){
      btn.disabled = false; btn.textContent = 'Send Message';
      if (!res.ok) throw 0;
      form.reset(); form.hidden = true; done.hidden = false;
    })
    .catch(function(){
      btn.disabled = false; btn.textContent = 'Send Message';
      alert("Something went wrong sending your message. Please try again, or call us on +1-888-603-8363.");
    });
  });
})();
