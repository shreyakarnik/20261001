/* ============================================================
   "LET'S TALK!" LEAD-CAPTURE FORM — shared component
   ------------------------------------------------------------
   The same form is used in two places:
   1. An overlay injected once per page. Every element carrying
      data-talk-trigger (nav "Let's Talk!" pill, hero CTA, kiosk
      page CTAs, ...) opens it instead of navigating to
      contact.html. The anchors keep their normal
      href="contact.html" as a no-JS fallback.
   2. Inline on the page, wherever an element carries
      data-talk-inline (e.g. the home page, after "What's Included?").

   HUBSPOT SETUP: replace TALK_HUBSPOT_PORTAL_ID / TALK_HUBSPOT_FORM_GUID
   below with your real portal ID + form GUID (HubSpot > your form >
   Share > Embed code). Field names on the left of fieldMap below
   must match your HubSpot form's internal field names.
   ============================================================ */
(function(){
  var TALK_HUBSPOT_PORTAL_ID = "YOUR_PORTAL_ID";
  var TALK_HUBSPOT_FORM_GUID = "YOUR_FORM_GUID";

  // `id` keeps the checkbox/label pairs unique when the form appears twice on a page.
  function formMarkup(id){
    return ''
    + '      <form class="tm-form">'
    + '        <div class="tm-row">'
    + '          <div class="tm-group"><label>Email</label><input type="email" name="email" required></div>'
    + '          <div class="tm-group"><label>Last Name</label><input type="text" name="lastname" required></div>'
    + '        </div>'
    + '        <div class="tm-row">'
    + '          <div class="tm-group"><label>First Name</label><input type="text" name="firstname" required></div>'
    + '          <div class="tm-group"><label>Email</label><input type="text" name="email2"></div>'
    + '        </div>'
    + '        <div class="tm-row single">'
    + '          <div class="tm-group">'
    + '            <label>Country</label>'
    + '            <select name="country" required>'
    + '              <option value="">Please Select</option>'
    + '              <option>Canada</option>'
    + '              <option>United States</option>'
    + '              <option>Mexico/Costa Rica</option>'
    + '              <option>Outside of North America</option>'
    + '            </select>'
    + '          </div>'
    + '        </div>'
    + '        <p class="tm-note">Contact us for detailed specifications, site requirements, and pricing. The more details you provide, the better we can assist you.</p>'
    + '        <div class="tm-extra">'
    + '          <div class="tm-row">'
    + '            <div class="tm-group"><label>Company Name</label><input type="text" name="company"></div>'
    + '            <div class="tm-group"><label>Role</label><input type="text" name="role"></div>'
    + '          </div>'
    + '          <div class="tm-row">'
    + '            <div class="tm-group"><label>Address</label><input type="text" name="address"></div>'
    + '            <div class="tm-group"><label>City</label><input type="text" name="city"></div>'
    + '          </div>'
    + '          <div class="tm-row">'
    + '            <div class="tm-group"><label>Province/State</label><input type="text" name="province"></div>'
    + '            <div class="tm-group"><label>Postal/Zip Code</label><input type="text" name="postal"></div>'
    + '          </div>'
    + '          <div class="tm-row single">'
    + '            <div class="tm-group"><label>What Region/Market/Country Are You Interested In Developing? <span class="hint">Please be as specific as possible</span></label><input type="text" name="region_interest"></div>'
    + '          </div>'
    + '          <div class="tm-row">'
    + '            <div class="tm-group"><label>Units Interested</label>'
    + '              <select name="num_units"><option value="">Please Select</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select>'
    + '            </div>'
    + '            <div class="tm-group"><label>Unencumbered Cash Available</label>'
    + '              <select name="investment"><option value="">Please Select</option><option>$1,000,000+</option><option>$500,000 - $1,000,000</option><option>$100,000 - $500,000</option><option>&lt; $100,000</option></select>'
    + '            </div>'
    + '          </div>'
    + '          <div class="tm-row single">'
    + '            <div class="tm-group"><label>How Did You First Hear About PFX?</label>'
    + '              <select name="referral"><option value="">Please Select</option><option>Facebook</option><option>Instagram</option><option>Google</option><option>Web Search</option><option>News Article</option><option>Word of Mouth</option><option>Other</option></select>'
    + '            </div>'
    + '          </div>'
    + '          <div class="tm-row single">'
    + '            <div class="tm-group"><label>Additional Information (Optional) <span class="hint">Let us know if there is any additional information you\'d like to share!</span></label><textarea name="additional_info"></textarea></div>'
    + '          </div>'
    + '          <p class="tm-consent">By checking the boxes below, you consent to receive periodic email or SMS communications from PizzaForno and allow our team to reach out and provide information about our licensing opportunity. You may opt out at any time.</p>'
    + '          <div class="tm-checkbox-grid">'
    + '          <div class="tm-checkbox-row"><input type="checkbox" id="' + id + 'ConsentEmail" name="consent_email"><label for="' + id + 'ConsentEmail">I agree to receive email communications</label></div>'
    + '          <div class="tm-checkbox-row"><input type="checkbox" id="' + id + 'ConsentSms" name="consent_sms"><label for="' + id + 'ConsentSms">I agree to receive SMS communications</label></div>'
    + '          </div>'
    + '        </div>'
    + '        <div class="tm-actions">'
    + '          <button type="submit" class="tm-submit">Submit Inquiry</button>'
    + '          <button type="button" class="tm-add-more">Add More Information +</button>'
    + '        </div>'
    + '      </form>';
  }

  var HEAD = ''
    + '      <div class="tm-head">'
    + '        <h2>Ready to Explore Automation?</h2>'
    + '        <p>Contact us for detailed specifications, site requirements, and pricing. The more details you provide, the better we can assist you.</p>'
    + '      </div>';
  var BADGE = '      <span class="tm-badge">1 min</span>';
  var SHOW_LESS = '    <button type="button" class="tm-show-less">Show Less</button>';

  var OVERLAY_MARKUP = ''
    + '<div class="tm-overlay" id="talkOverlay" aria-hidden="true">'
    + '  <div class="tm-wrap">'
    + '    <div class="tm-card">'
    + '      <button type="button" class="tm-close" id="talkClose" aria-label="Close">X</button>'
    + HEAD + BADGE + formMarkup('talk')
    + SHOW_LESS
    + '    </div>'
    + '  </div>'
    + '</div>';

  var INLINE_MARKUP = ''
    + '  <div class="tm-wrap">'
    + '    <div class="tm-card">'
    + HEAD + BADGE + formMarkup('talkInline')
    + '    </div>'
    + '  </div>';

  // Wires up the two-stage expand/collapse and HubSpot submit for one form instance.
  // opts.onSuccess runs after a successful submit (e.g. to close the overlay).
  // opts.onAddMore replaces the in-place expand (the inline form opens the overlay instead).
  // opts.onShowLess runs instead of collapsing, when set and returning true.
  function wireForm(root, opts){
    opts = opts || {};
    var badge     = root.querySelector('.tm-badge');
    var extra     = root.querySelector('.tm-extra');
    var actions   = root.querySelector('.tm-actions');
    var addMore   = root.querySelector('.tm-add-more');
    var showLess  = root.querySelector('.tm-show-less');
    var form      = root.querySelector('.tm-form');
    var submitBtn = root.querySelector('.tm-submit');

    function expand(){
      extra.classList.add('open');
      actions.classList.add('tm-expanded');
      if(showLess) showLess.classList.add('open');
      badge.textContent = '3 mins';
    }
    function collapse(){
      extra.classList.remove('open');
      actions.classList.remove('tm-expanded');
      if(showLess) showLess.classList.remove('open');
      badge.textContent = '1 min';
    }

    addMore.addEventListener('click', opts.onAddMore || expand);
    if(showLess) showLess.addEventListener('click', function(){
      if(!(opts.onShowLess && opts.onShowLess())) collapse();
    });

    form.addEventListener('submit', function(event){
      event.preventDefault();
      var data = new FormData(form);

      // Map this site's field names -> HubSpot internal field names.
      var fieldMap = {
        email: "email",
        lastname: "lastname",
        firstname: "firstname",
        country: "country",
        company: "company",
        role: "jobtitle",
        address: "address",
        city: "city",
        province: "state",
        postal: "zip",
        region_interest: "region_of_interest",
        num_units: "number_of_units",
        investment: "investment_range",
        referral: "how_did_you_hear_about_us",
        additional_info: "additional_information"
      };

      var fields = [];
      Object.keys(fieldMap).forEach(function(localName){
        var val = data.get(localName);
        if(val !== null && val !== ""){
          fields.push({ name: fieldMap[localName], value: val });
        }
      });

      var payload = {
        fields: fields,
        context: { pageUri: window.location.href, pageName: document.title }
      };
      var endpoint = "https://api.hsforms.com/submissions/v3/integration/submit/"
        + TALK_HUBSPOT_PORTAL_ID + "/" + TALK_HUBSPOT_FORM_GUID;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(function(res){
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry';
        if(res.ok){
          alert("Thanks! Your inquiry has been submitted.");
          form.reset();
          collapse();
          if(opts.onSuccess) opts.onSuccess();
        } else {
          alert("Something went wrong submitting the form. Please try again.");
        }
      })
      .catch(function(){
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry';
        alert("Something went wrong submitting the form. Please try again.");
      });
    });

    return { form: form, expand: expand, collapse: collapse };
  }

  // Copies every same-named field value from one form to another.
  function copyValues(from, to){
    Array.prototype.forEach.call(from.elements, function(el){
      if(!el.name || !to.elements[el.name]) return;
      var target = to.elements[el.name];
      if(el.type === 'checkbox') target.checked = el.checked;
      else target.value = el.value;
    });
  }

  function init(){
    document.body.insertAdjacentHTML('beforeend', OVERLAY_MARKUP);

    var overlay  = document.getElementById('talkOverlay');
    var closeBtn = document.getElementById('talkClose');

    // The inline form that opened the overlay via "Add More Information", if any.
    var openedFrom = null;

    function openModal(e){
      if(e) e.preventDefault();
      openedFrom = null;
      show();
    }
    function show(){
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('tm-locked');
    }
    function closeModal(){
      // Carry anything typed in the overlay back to the inline form it came from.
      if(openedFrom){ copyValues(modal.form, openedFrom.form); modal.collapse(); openedFrom = null; }
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('tm-locked');
    }

    document.querySelectorAll('[data-talk-trigger]').forEach(function(el){
      el.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
    var modal = wireForm(overlay, {
      onSuccess: function(){
        if(openedFrom){ openedFrom.form.reset(); openedFrom = null; }
        closeModal();
      },
      // Opened from an inline form: "Show Less" returns to that form.
      onShowLess: function(){
        if(!openedFrom) return false;
        closeModal();
        return true;
      }
    });

    document.querySelectorAll('[data-talk-inline]').forEach(function(el){
      el.classList.add('tm-inline');
      el.innerHTML = INLINE_MARKUP;
      var inline = wireForm(el, {
        // Open the full overlay, already expanded, with what's been typed so far.
        onAddMore: function(){
          modal.form.reset();
          copyValues(inline.form, modal.form);
          modal.expand();
          openedFrom = inline;
          show();
        }
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
