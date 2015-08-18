var body = document.querySelector('body');
var hamburger = document.querySelector('.hamburger');
var hamAssist = document.querySelector('.hamburger-assist');

Element.prototype.addClass = function(className) {
  if (this.classList)
    this.classList.add(className);
  else
    this.className += ' ' + className;
};

Element.prototype.removeClass = function(className) {
  if (this.classList)
    this.classList.remove(className);
  else
    this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
};

Element.prototype.hasClass = function(className) {
  if (this.classList)
    return this.classList.contains(className);
  else
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.className);
};

hamburger.addEventListener('click', function() {
  if (body.hasClass('nav-open'))
    body.removeClass('nav-open');
  else
    body.addClass('nav-open');
});

hamAssist.addEventListener('click', function() {
  body.removeClass('nav-open');
});

// enforce HTTPS
var h = window.location.host;
var local = h.indexOf('localhost') > -1 || h.indexOf('127.0.0.1') > -1;
if (window.location.protocol !== "https:" && !local)
  window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
