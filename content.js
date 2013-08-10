window.onload= function () {
    
  addChangeEvent("s1");
	addChangeEvent("s2");
	addChangeEvent("s3");
	addChangeEvent("b1");
	addChangeEvent("b2");
	addChangeEvent("b3");
	
	document.getElementById("b1").checked = false;
	
	chrome.storage.sync.get({v3:20,v2:60,v1:90,b1:true,b2:true,b3:true}, function(item){
	
		document.getElementById("s3").value = item.v3
		document.getElementById("s2").value = item.v2
		document.getElementById("s1").value = item.v1
				
		document.getElementById("b1").checked = item.b1;
		document.getElementById("b2").checked = item.b2;
		document.getElementById("b3").checked = item.b3;
		
		refresh();
	
	});
	
	
    
}

function addChangeEvent(id){

	if(window.addEventListener) {
        document.getElementById(id).addEventListener('change', refresh, false);
    } else if (window.attachEvent){
        document.getElementById(id).attachEvent("onchange", refresh);
    }
    
}

function refresh(){
	
    chrome.extension.getBackgroundPage().changeThreshold(document.getElementById("s1").value, document.getElementById("s2").value, document.getElementById("s3").value, document.getElementById("b1").checked, document.getElementById("b2").checked, document.getElementById("b3").checked);
    
    chrome.storage.sync.set({'v1': document.getElementById("s1").value, 'v2': document.getElementById("s2").value, 'v3': document.getElementById("s3").value,'b1':document.getElementById("b1").checked,'b2':document.getElementById("b2").checked,'b3':document.getElementById("b3").checked});
    
}
