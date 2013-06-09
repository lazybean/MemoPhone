(function(){
  var clickEvent = "touchstart" in document.documentElement ? "touchstart" : "click";

  [].forEach.call(document.getElementsByClassName('icon-close'), function (el) {
    el.addEventListener(clickEvent, closeApp); 
  });

  function closeApp(evt) {
    evt.preventDefault();
    console.log('Close app');
    window.close();
  }
}());
