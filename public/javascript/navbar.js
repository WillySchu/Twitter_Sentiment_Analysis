$(document).ready($(function(){
  const path = window.location.pathname;
  const all = /.*/;
  $('.navbar li a[href=\'' + path + '\']').parents('li').addClass('active');
}));
