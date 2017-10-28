//For Full Screen
function requestFullScreen(element) {
 // Supports most browsers and their versions.
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod)
    requestMethod.call(element);
}

function closeFullScreen(element){
  var requestMethod = element.cancelFullScreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.msCancelFullScreen;

  if (requestMethod)
    requestMethod.call(element);
}

