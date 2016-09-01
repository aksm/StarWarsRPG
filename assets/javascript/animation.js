
// Copyright 2011 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas;
var context;
var images = {};
var totalResources = 15;
var numResourcesLoaded = 0;
var rlInterval = "";
var fps = 30;
var charX = 100;
var charY = 185;
var char2X = 170;
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 2;
var breathInterval = setInterval(updateBreath, 1000 / fps);
var maxEyeHeight = 14;
var curEyeHeight = maxEyeHeight;
var eyeOpenTime = 0;
var timeBtwBlinks = 4000;
var blinkUpdateTime = 200;                    
var blinkTimer = setInterval(updateBlink, blinkUpdateTime);
var fpsInterval = setInterval(updateFPS, 1000);
var numFramesDrawn = 0;
var curFPS = 0;
var jumping = false;
var thrusting = false;
var parrying = false;
var parts = ["leftArm",
"legs",
"torso",
"rightArm",
"head",
"hair",		
"leftArm-jump",
"legs-jump",
"rightArm-jump",
"leftArm-thrust",
"rightArm-thrust",
"torso-thrust",
"legs-thrust",
"head-thrust",
"hair-thrust"];

function updateFPS() {
	
	curFPS = numFramesDrawn;
	numFramesDrawn = 0;
}
function prepareCanvas(canvasDiv, canvasWidth, canvasHeight, characters)
{
	numResourcesLoaded = 0;
	totalResources = 15*characters.length;
	$.each(characters, function(k, v){
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var character = v;
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', character);
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8and lower. Otherwise we could have used:
	
	canvas.width = canvas.width; // clears the canvas 
	context.fillText("loading...", 40, 140);
	
	$.each(parts, function(key, val) {
		loadImage(character, val, characters);
	});
	});		
}

function loadImage(character, name, characters) {

	images[character+name] = new Image();
  	images[character+name].onload = function() { 
	  	resourceLoaded(character, characters);
  	}
  	images[character+name].src = "assets/images/animationImages/" + character + "player" + name + ".png";
	}

function resourceLoaded(character, characters) {

  	numResourcesLoaded += 1;
  	if(numResourcesLoaded === totalResources) {
		rlInterval = setInterval(function() {redraw(characters)}, 1000 / fps);
  	}
}

function redraw(characters) {
	if (game.fighters.length == 2) {
		var p = game.fighters[0];
		var o = game.fighters[1];
		var pcanvas = document.getElementById(p);
		var pcontext = pcanvas.getContext("2d");
		var ocanvas = document.getElementById(o);
		var ocontext = ocanvas.getContext("2d");
	}

	$.each(characters, function(k, character) {
		var x = charX;
		var y = charY;
		var jumpHeight = 45;
		canvas = document.getElementById(character);
		if(game.fighters.length == 2) {
			$("#"+character).addClass("fighter"+k);
		}
		context = canvas.getContext("2d");
  
		canvas.width = canvas.width; // clears the canvas 

		context.font = "900 30px Droid Sans";
		context.fillStyle = "#ffff00";
		context.textAlign = "center";
		context.fillText(game.players[character].name, canvas.width/2, 30);
		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.strokeText(game.players[character].name, canvas.width/2, 30);
		context.textAlign = "end";
    	if(game.fighters.length == 2 && k == 1) {
			context.fillText(game.opponenthp+" HP", 200, 250);
			context.strokeText(game.opponenthp+" HP", 200, 250);
		} else if(game.fighters.length == 2 && k == 0) {
			context.fillText(game.playerhp+" HP", 200, 250);
			context.strokeText(game.playerhp+" HP", 200, 250);			
		} else {
			context.fillText(game.players[character].hp+" HP", 90, 185);
			context.strokeText(game.players[character].hp+" HP", 90, 185);			
		}

    	if(game.fighters.length == 2 && k == 1) {
			// translate context to correct position on canvas
    		context.translate(300, 0);

    		// flip context horizontally
    		context.scale(-1, 1);
		}
		// Draw shadow
		drawEllipse(x + 40, y + 29, 160 - breathAmt, 6, context);

      	if(game.fighters.length == 2) {
			if (thrusting) {
				pcontext.drawImage(images[p+"leftArm-thrust"], x + 50, y - 34 - breathAmt);
				ocontext.drawImage(images[o+"leftArm"], x + 44, y - 88 - breathAmt);
			} else if (parrying) {
				ocontext.drawImage(images[o+"leftArm-thrust"], x + 50, y - 34 - breathAmt);
				pcontext.drawImage(images[p+"leftArm"], x + 44, y - 88 - breathAmt);
			} else if (!jumping && !thrusting){
				pcontext.drawImage(images[p+"leftArm"], x + 44, y - 88 - breathAmt);
				ocontext.drawImage(images[o+"leftArm"], x + 44, y - 88 - breathAmt);
			} else if (!jumping && !parrying){
				ocontext.drawImage(images[o+"leftArm"], x + 44, y - 88 - breathAmt);
				pcontext.drawImage(images[p+"leftArm"], x + 44, y - 88 - breathAmt);
			}
		} else {
			context.drawImage(images[character+"leftArm"], x + 44, y - 88 - breathAmt);
		}

	
      	if(game.fighters.length == 2) {
			if (thrusting) {
				pcontext.drawImage(images[p+"legs-thrust"], x, y);
				ocontext.drawImage(images[o+"legs"], x, y);
			} else if (parrying) {
				ocontext.drawImage(images[o+"legs-thrust"], x, y);
				pcontext.drawImage(images[p+"legs"], x, y);
			} else if (!jumping && !thrusting){
				pcontext.drawImage(images[p+"legs"], x, y);
				ocontext.drawImage(images[o+"legs"], x, y);
			} else if (!jumping && !parrying){
				ocontext.drawImage(images[o+"legs"], x, y);
				pcontext.drawImage(images[p+"legs"], x, y);
			}
		} else {
			context.drawImage(images[character+"legs"], x, y);			
		}

      	if(game.fighters.length == 2) {
			if (thrusting) {
				pcontext.drawImage(images[p+"torso-thrust"], x + 10, y - 50);
				ocontext.drawImage(images[o+"torso"], x, y - 50);
			} else if (parrying) {
				ocontext.drawImage(images[o+"torso-thrust"], x + 10, y - 50);
				pcontext.drawImage(images[p+"torso"], x, y - 50);
			} else if (!thrusting){
				pcontext.drawImage(images[p+"torso"], x, y - 50);
				ocontext.drawImage(images[o+"torso"], x, y - 50);
			} else if (!parrying){
				ocontext.drawImage(images[o+"torso"], x, y - 50);
				pcontext.drawImage(images[p+"torso"], x, y - 50);
			}
		} else {
			context.drawImage(images[character+"torso"], x, y - 50);
		}

      	if(game.fighters.length == 2) {
			if (thrusting) {
				pcontext.drawImage(images[p+"head-thrust"], x - 5, y - 125 - breathAmt);
				pcontext.drawImage(images[p+"hair-thrust"], x - 32, y - 138 - breathAmt);
	    		ocontext.drawImage(images[o+"head"], x - 10, y - 125 - breathAmt);
				ocontext.drawImage(images[o+"hair"], x - 37, y - 138 - breathAmt);
			} else if (parrying) {
				ocontext.drawImage(images[o+"head-thrust"], x - 5, y - 125 - breathAmt);
				ocontext.drawImage(images[o+"hair-thrust"], x - 32, y - 138 - breathAmt);
	    		pcontext.drawImage(images[p+"head"], x - 10, y - 125 - breathAmt);
				pcontext.drawImage(images[p+"hair"], x - 37, y - 138 - breathAmt);
			} else if (!thrusting){
	    		pcontext.drawImage(images[p+"head"], x - 10, y - 125 - breathAmt);
				pcontext.drawImage(images[p+"hair"], x - 37, y - 138 - breathAmt);
	     		ocontext.drawImage(images[o+"head"], x - 10, y - 125 - breathAmt);
				ocontext.drawImage(images[o+"hair"], x - 37, y - 138 - breathAmt);
			} else if (!parrying){
	    		ocontext.drawImage(images[o+"head"], x - 10, y - 125 - breathAmt);
				ocontext.drawImage(images[o+"hair"], x - 37, y - 138 - breathAmt);
	     		pcontext.drawImage(images[p+"head"], x - 10, y - 125 - breathAmt);
				pcontext.drawImage(images[p+"hair"], x - 37, y - 138 - breathAmt);
			}
		} else {
	    	context.drawImage(images[character+"head"], x - 10, y - 125 - breathAmt);
			context.drawImage(images[character+"hair"], x - 37, y - 138 - breathAmt);			
		}

	
		if(game.fighters.length == 2) {
			if (thrusting) {
				pcontext.drawImage(images[p+"rightArm-thrust"], x + 5, y - 42 - breathAmt);
				ocontext.drawImage(images[o+"rightArm"], x - 15, y - 42 - breathAmt);
			} else if (parrying) {
				ocontext.drawImage(images[o+"rightArm-thrust"], x + 5, y - 42 - breathAmt);
				pcontext.drawImage(images[p+"rightArm"], x - 15, y - 42 - breathAmt);
			} else if (!jumping && !thrusting){
				pcontext.drawImage(images[p+"rightArm"], x - 15, y - 42 - breathAmt);
				ocontext.drawImage(images[o+"rightArm"], x - 15, y - 42 - breathAmt);
			} else if (!jumping && !parrying){
				ocontext.drawImage(images[o+"rightArm"], x - 15, y - 42 - breathAmt);
				pcontext.drawImage(images[p+"rightArm"], x - 15, y - 42 - breathAmt);
			}
		} else {
			context.drawImage(images[character+"rightArm"], x - 15, y - 42 - breathAmt);
		}

		if(game.fighters.length == 2) {
		 	if (thrusting) {
		 		drawEllipse(x + 62, y - 70 - breathAmt, 8, curEyeHeight, pcontext); // Left Eye
		 		drawEllipse(x + 73, y - 74 - breathAmt, 8, curEyeHeight, pcontext); // Right Eye
		 		drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight, ocontext); // Left Eye
		 		drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight, ocontext); // Right Eye
		 	} else if (parrying) {
		 		drawEllipse(x + 62, y - 70 - breathAmt, 8, curEyeHeight, ocontext); // Left Eye
		 		drawEllipse(x + 73, y - 74 - breathAmt, 8, curEyeHeight, ocontext); // Right Eye
		 		drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight, pcontext); // Left Eye
		 		drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight, pcontext); // Right Eye
		 	} else if (!thrusting){
		 		drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight, pcontext); // Left Eye
		 		drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight, pcontext); // Right Eye
		 		drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight, ocontext); // Left Eye
		 		drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight, ocontext); // Right Eye
		 	} else if (!parrying){
		 		drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight, ocontext); // Left Eye
		 		drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight, ocontext); // Right Eye
		 	}
		 } else {
			drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight, context); // Left Eye
			drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight, context); // Right Eye			
		 }
	});
}

function drawEllipse(centerX, centerY, width, height, ctext) {
	ctext.beginPath();
  
	ctext.moveTo(centerX, centerY - height/2);
  
	ctext.bezierCurveTo(
		centerX + width/2, centerY - height/2,
		centerX + width/2, centerY + height/2,
		centerX, centerY + height/2);

	ctext.bezierCurveTo(
		centerX - width/2, centerY + height/2,
		centerX - width/2, centerY - height/2,
		centerX, centerY - height/2);
 
	ctext.fillStyle = "black";
	ctext.fill();
	ctext.closePath();	
}

function updateBreath() { 
				
	if (breathDir === 1) {  // breath in
		breathAmt -= breathInc;
		if (breathAmt < -breathMax) {
			breathDir = -1;
		}
	} else {  // breath out
		breathAmt += breathInc;
		if(breathAmt > breathMax) {
			breathDir = 1;
		}
	}
}

function updateBlink() { 
				
	eyeOpenTime += blinkUpdateTime;
	
	if(eyeOpenTime >= timeBtwBlinks){
		blink();
	}
}

function blink() {

	curEyeHeight -= 1;
	if (curEyeHeight <= 0) {
		eyeOpenTime = 0;
		curEyeHeight = maxEyeHeight;
	} else {
		setTimeout(blink, 10);
	}
}

function jump() {
	
	if (!jumping) {
		jumping = true;
		setTimeout(land, 500);
	}

}
function land() {
	
	jumping = false;

}

function thrust(callback) {
	if(game.opponenthp == 0) {
		game.audioAttackWin.play();
	} else {
		game.audioAttack.play();
	}

	if (!thrusting) {
		thrusting = true;
		setTimeout(recoverThrust, 1500);
	}
	callback();
}

function parry() {

	if (!parrying && game.opponenthp > 0) {
		parrying = true;
		setTimeout(recoverParry, 2500);
	}

}

function recoverThrust() {
	thrusting = false;
}

function recoverParry() {
	parrying = false;
}
function gameOver() {
	var gocanvas = document.createElement('canvas');
	var gocontext = gocanvas.getContext("2d");
	gocanvas.setAttribute('class', 'transition');
	document.getElementById('transition-text').appendChild(gocanvas);

	gocontext.font = "900 50px Droid Sans";
	gocontext.fillStyle = "#000";
	gocontext.textAlign = "center";
	gocontext.fillText("GAME OVER", gocanvas.width/2, gocanvas.height/2);
	gocontext.strokeStyle = "#ffff00";
	gocontext.lineWidth = 2;
	gocontext.strokeText("GAME OVER", gocanvas.width/2, gocanvas.height/2);
	gocontext.font = "500 20px Droid Sans";
	gocontext.fillText("Channel the force and try again.", gocanvas.width/2, (gocanvas.height/2)+45);
	gocontext.strokeText("Channel the force and try again.", gocanvas.width/2, (gocanvas.height/2)+45);
}
function pickNext() {
	var pncanvas = document.createElement('canvas');
	var pncontext = pncanvas.getContext("2d");
	pncanvas.setAttribute('class', 'transition');
	document.getElementById('transition-text').appendChild(pncanvas);

	pncontext.font = "900 50px Droid Sans";
	pncontext.fillStyle = "#000";
	pncontext.textAlign = "center";
	pncontext.fillText("YOU WIN", pncanvas.width/2, pncanvas.height/2);
	pncontext.strokeStyle = "#ffff00";
	pncontext.lineWidth = 2;
	pncontext.strokeText("YOU WIN", pncanvas.width/2, pncanvas.height/2);
	pncontext.font = "500 20px Droid Sans";
	pncontext.fillText("Choose another opponent.", pncanvas.width/2, (pncanvas.height/2)+45);
	pncontext.strokeText("Choose another opponent.", pncanvas.width/2, (pncanvas.height/2)+45);	
}
function winGame() {
	var wgcanvas = document.createElement('canvas');
	var wgcontext = wgcanvas.getContext("2d");
	wgcanvas.setAttribute('class', 'transition');
	document.getElementById('transition-text').appendChild(wgcanvas);

	wgcontext.font = "900 50px Droid Sans";
	wgcontext.fillStyle = "#000";
	wgcontext.textAlign = "center";
	wgcontext.fillText("YOU WIN", wgcanvas.width/2, wgcanvas.height/2);
	wgcontext.strokeStyle = "#ffff00";
	wgcontext.lineWidth = 2;
	wgcontext.strokeText("YOU WIN", wgcanvas.width/2, wgcanvas.height/2);
	wgcontext.font = "500 20px Droid Sans";
	wgcontext.fillText("Play again.", wgcanvas.width/2, (wgcanvas.height/2)+45);
	wgcontext.strokeText("Play again.", wgcanvas.width/2, (wgcanvas.height/2)+45);	
}