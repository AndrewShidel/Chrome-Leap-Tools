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
        
        
        var p1 = new Point(fingers[0],fingers[1],fingers[2]);
        var p2 = new Point(fingers[3],fingers[4],fingers[5]);
        var p3 = new Point(fingers[6],fingers[7],fingers[8]);
        
        
        if (hand.pointables.length == 3 || hand.pointables.length == 4){
        	        	
			var ave = Math.abs(average(p1,p2,p3));
        	        	
        	if (!set){ 
        		
        		if (ave > 100) set = true;
        		
        	}
        	
        }
        
		
		if (set){
			
			count++; 
			        	
        	var ave = Math.abs(average(p1,p2,p3));
        	
			if (ave < 85 && count > 5){
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
		
		var x1 = fingers[0];
		if (hand.pointables.length == 4 || hand.pointables.length == 5){
		
			getReady = 0;
			if (x < WIDTH/3 && !listenLeft){
			
				listenLeft = true;
				start = x;
				
			}			
			
			if (x > 0-WIDTH/3 && !listenRight){
			
				listenRight = true;
				start = x;
			
			}
			
			
			if (listenLeft){
				
				if (x > start+WIDTH/3){
					
					chrome.tabs.executeScript({
    					code: 'history.back()'
  					});
  					
  					
					listenLeft = false;
					
				}
					 
				
			}
			
			if (listenRight){
			
				if (x < start-WIDTH/3){					
					
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
	
});

function remove(){

	chrome.tabs.getSelected(function(tab) {
    	chrome.tabs.remove(tab.id, function() { });
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

function average(p1,p2,p3){
	
	return (dst(p1,p2)+dst(p1,p3)+dst(p2,p3))/3

}