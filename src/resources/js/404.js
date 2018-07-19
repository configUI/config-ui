$(function(e){
	var x=document.documentElement.clientHeight;
	var y=e(".header").outerHeight();
	e("#parallax_wrapper").css("height",x-y+"px");
	e("#parallax_wrapper").css("left",50+"%");
	e(".scene_1").plaxify({"xRange":0,"yRange":0,"invert":true}),
	e(".scene_2").plaxify({"xRange":70,"yRange":20,"invert":true}),
	e(".scene_3").plaxify({"xRange":0,"yRange":40,"invert":true}),
	e.plax.enable();
	e(document).ready(function(){});
	window.setInterval(function(){
  $('.duck-animation').delay(100).css('background-position-x','-1000px').animate({'background-position-x':'2000px'},50000,'linear');
}, 100);
});
