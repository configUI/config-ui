// function valMethod(methodName) {
//   if (methodName.startsWith('/')) {
//     return "Method Name should not starts with forward slash.";
//   }

//   return '';
// }

var validationObj = (function () {

  return {
    valMethod: function (methodName) {
      if (methodName.startsWith('/')) {
        return "Method Name should not starts with forward slash.";
      }
    
      return '';
    },
    valPort: function (portVal) {
      if(portVal < 0 || portVal > 65535) {
        return "Port should be greater than 0 or less than 65535.";
      }
      
      return '';
    }
  }

})(validationObj || {})
