/*
 * Shidel Dev - Chrome Leap Tools - v0.1
 * Copyright (c) 2013 Andrew Shidel - shidel.com, contact@shidel.com
 */
 

var WIDTH = 230;

var fingers = new Array();
var set = false;
var count = 0;

var start = 0;

var listenLeft = false; var listenRight = false; var getReady = 0;

var count2 = 0;

var s1 = 1; var s2 = 1; var s3 = 1; var s4 = 50;

var diff = 15; var normal = 96.5;

var diff2 = WIDTH/3; var diff3 = diff2;

var b1 = true; var b2 = true; var b3 = true; var b4 = true;

var st = 0;

var vexit = 0; var vexitT = 0;

var inside = false;

var inFOR = 0;

var interval; var startScroll = 0; var endScroll = 0;

var pastx, pasty, pastz;

var distance = 0; var fake = 100;


Leap.loop(function(frame) {
	
	if (frame.hands === undefined ) { 
	  var handsLength = 0 
	} else {
	  var handsLength = frame.hands.length;
	}

	for (var handId = 0, handCount = handsLength; handId != handCount; handId++) {
		
		var hand = frame.hands[handId];
		
		var x = Math.floor(hand.palmPosition[0]);
		var y = Math.floor(hand.palmPosition[2]);
		var z = Math.floor(hand.palmPosition[1]);
	
		var j = 0;
		
		for (var i = 0; i < hand.pointables.length; i++){
          	fingers[j] = hand.pointables[i].tipPosition[0];
          	j++;
          	fingers[j] = hand.pointables[i].tipPosition[1];
          	j++;
          	fingers[j] = hand.pointables[i].tipPosition[2];
          	j++;
        }
        
        if (b4){
        
       
        
        if (hand.pointables.length == 2 && y < 100 && handsLength == 1){
        	
        	
        	
        	clearInterval(interval);
        	
        	
        	
        	inside = true;
        	
        	//if (inFOR > 10){        
        	
        	vexit = hand.pointables[0].tipVelocity[1]
        	        	
        	if (st != 0 && Math.abs(hand.pointables[0].tipVelocity[2]) < 100){
        	
        		var scroll = ((fingers[1] - st)*s4)/8;
        	        		
        		chrome.tabs.executeScript({
    				code: "window.scrollBy(0,"+ scroll + ");"
  				});
  				
  				
  				
  			}
  			
  			//}
  			
  			inFOR++;
  			
  			st = fingers[1];
        
        }else{
        	inFOR = 0;
        	if (inside){
        		
        		inside = false;
        		
        		if (vexit < 0) vexit *= 10;
        		
        		       		
        		
        		interval = setInterval(function(){
        		
        			chrome.tabs.executeScript({
    					code: "window.scrollBy(0,"+ (vexit/30)*(s4/50) + ");"
  					});
  					
  					if (vexit < 0){
  						vexit += 10;
  					}else{
  						vexit -= 10;
  					}
  					
  					if ( Math.abs(vexit) < 10 ){
  						vexit = 0;
  						clearInterval(interval);
  					}
        		
        		},10);
        	
        	}
        	st = 0;
        	
        
        }
        
        }
        
        
        if (handsLength == 2 && Math.abs(hand.pointables[0].tipVelocity[2]) < 100){
        	
        	var td = dst2(frame.hands[0].palmPosition[0],frame.hands[0].palmPosition[1],frame.hands[0].palmPosition[2],frame.hands[1].palmPosition[0],frame.hands[1].palmPosition[1],frame.hands[1].palmPosition[2])
        	
        	if (distance != 0){
        		var zoomBy = td - distance;
        		if (zoomBy < 10){       	
        			if (fake > 5){
        				fake += zoomBy;
        				
        			chrome.tabs.executeScript({
        				code: "document.body.style.zoom = "+fake+"+'%';"
        			});
        			}else{
        				fake++;
        			}
        			
        		}
        		
        	}
        	
        	distance = td
        	
        }else{
        	distance = 0;
        }
        
        if (b3){
        
        var p1 = new Point(fingers[0],fingers[1],fingers[2]);
        var p2 = new Point(fingers[3],fingers[4],fingers[5]);
        var p3 = new Point(fingers[6],fingers[7],fingers[8]);
        
        /*
        if (hand.pointables.length == 1){
        
        	chrome.tabs.executeScript({
        		code:"var body = document.getElementsByTagName('body')[0];if(document.getElementById('apdiv7') == null){body.innerHTML += '<div id=apdiv7 style=position:absolute;background-color:#000;width:50px;height:50px;border-radius:25px;z-index:1100;top:200px;left:200px;></div>';}else{document.getElementById('apdiv7').style.left = "+fingers[0]+"+'px';document.getElementById('apdiv7').style.top = "+fingers[1]+"+'px';}"
        		//code:"var body = document.getElementsByTagName('body')[0];body.innerHTML += '<div></div>'"
        	});
        }
        */
        
        
        
        
        if (hand.pointables.length == 3 || hand.pointables.length == 4){
        	        	
			var ave = Math.abs(average(p1,p2,p3));
        	        	
        	if (!set){ 
        		
        		if (ave > normal + diff) set = true;
        		
        	}
        	
        }
        
		
		if (set){
			
			count++; 
			        	
        	var ave = Math.abs(average(p1,p2,p3));
        	
			if (ave < normal - diff && count > 5*(1/s3)){
				remove();
				set = false;
				count = 0;
			}
			
		}
		
		if (hand.pointables.length < 3){
		
			count2++;
			 
			if (count2 > 8){
				set = false;
				count = 0;
				count2 = 0;
			}
		} 
		
		}
		
		if (b1 || b2){
		
		var x1 = fingers[0];
		if (hand.pointables.length == 4 || hand.pointables.length == 5){
		
			getReady = 0;
			
			
			if (x < WIDTH/3 && !listenLeft && b1){
			
				listenLeft = true;
				start = x;
				
			}			
			
			if (x > 0-WIDTH/3 && !listenRight && b2){
			
				listenRight = true;
				start = x;
			
			}
			
			
			if (listenLeft){
				
				if (x > start+diff2){
					
					chrome.tabs.executeScript({
    					code: 'history.back()'
  					});
  					
					listenLeft = false;
					
				}
					 
				
			}
			
			if (listenRight){
			
				if (x < start-diff3){					
					
					chrome.tabs.executeScript({
    					code: 'history.forward()'
  					});
  					
					listenRight = false;
				}
			
			}
			
		
		}else{
			getReady++;
			if (getReady >= 3){
				listenLeft = false;
				listenRight = false;
			}
			
			
			
		}
   	}
   	
   	pastx = x;
   	pasty = y;
   	pastz = z;
   	
	}
	
});

var st = 0;

function changeThreshold(ts1,ts2,ts3,ts4,bt1,bt2,bt3,bt4){
	
	s1=(ts1/50);
	s2=ts2/50;
	s3=ts3/50;
	
	//ts4 -= (ts4-50)*2;
	
	s4=ts4;
	
	b1 = bt1;
	b2 = bt2;
	b3 = bt3;
	b4 = bt4;	
	
	if (s3 < 1){
		s3 = s3 + (1-s3)/3 
	}else{
		s3 = s3 - (s3-1)/3
	}
	
	diff = (22*(1/s3))/2;
	
	diff2 = (WIDTH/3)/s1;
	diff3 = (WIDTH/3)/s2;
	
}

function remove(){
	
	clearInterval(interval);
	
	var numTabs;
	
	chrome.tabs.getAllInWindow(null, function(tabs) {
    	numTabs = tabs.length;
    
	if (numTabs != 1){
	chrome.tabs.getSelected(function(tab) {
    	chrome.tabs.remove(tab.id, function() { });
	}); 
	}else{
		chrome.tabs.update({url: "http://google.com"})
	}
	});
}

function Point(x1,y1,z1){

	var x = x1;
	var y = y1;
	var z = z1;
	
	this.X = function(){
		return x;
	}
	
	this.Y = function(){
		return y;
	}
	
	this.Z = function(){
		return z;
	}

}

function dst(p1, p2){
	
	return Math.sqrt( Math.pow(p1.X()-p2.X(),2) + Math.pow(p1.Y()-p2.Y(),2) + Math.pow(p1.Z()-p2.Z(),2) ); 

}

function dst2(x,y,z,x2,y2,z2){
	var p1 = new Point(x,y,z);
	var p2 = new Point(x2,y2,z2); 
	return Math.sqrt( Math.pow(p1.X()-p2.X(),2) + Math.pow(p1.Y()-p2.Y(),2) + Math.pow(p1.Z()-p2.Z(),2) ); 

}

function average(p1,p2,p3){
	
	return (dst(p1,p2)+dst(p1,p3)+dst(p2,p3))/3;

}
