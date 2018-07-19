function navigate(){
	 var url = document.URL;
    url = url.split("/resources/SamlUserDoesnotExist.html")[0] +"?loginFromadmin=true&requestFrom=errorPage";
     console.log("url" ,url);
	window.open(url,"_self");

}