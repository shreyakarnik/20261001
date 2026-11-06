/* the red fill on the calculator sliders, up to each handle */
(function () {
  function paint() {
    document.querySelectorAll('.calc-box input[type=range]').forEach(function (r) {
      r.style.setProperty('--fill', (r.value - r.min) / (r.max - r.min) * 100 + '%');
    });
  }
  document.addEventListener('input', paint);
  document.addEventListener('click', function () { setTimeout(paint); });
  paint();
})();
