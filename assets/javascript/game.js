// Declare object
var game = {

	// Characters
	players: {
		leia: {name: "Leia Organa", hp: 120, ap: 8, cap: 8, pic: "assets/images/leia.png"},
		//vader: {name: "Darth Vader", hp: 180, ap: 8, cap: 6, pic: "assets/images/vader.jpg"},
		rey: {name: "Rey", hp: 100, ap: 10, cap: 5, pic: "assets/images/rey.jpg"},
		//padme: {name: "Padmé Amidala", hp: 100, ap: 6, cap: 3, pic: "assets/images/padme.jpg"},
		aurra: {name: "Aurra Sing", hp: 180, ap: 2, cap: 25, pic: "assets/images/aurra.png"},
		zam: {name: "Zam Wesell", hp: 150, ap: 4, cap: 20, pic: "assets/images/zam.jpg"}
	
	},

	// Gameplay variables
	fighters: [],
	// player: "",
	playerhp: 0,
	playerap: 0,
	opponent: "",
	opponenthp: 0,
	characters: [],
	opponentsLeft: true,
	backgrounds: ["assets/images/bk1.jpg", "assets/images/bk2.jpg", "assets/images/bk3.jpg", "assets/images/bk4.jpg", "assets/images/bk5.jpg"],
	// jQuery html elements
	playerElement: $('#player'),
	opponentsElement: $('#opponents'),
	defenderElement: $('#defender'),
	fightStatus: $('#fight-status'),
	canvasDiv: $('#canvasDiv'),
	transitionDiv: $('#transition-text'),
	audioAttack: document.getElementById("audio-attack"),
	audioStart: document.getElementById("audio-start"),
	audioAttackWin: document.getElementById("audio-attackwin"),
	audioGameover: document.getElementById("audio-gameover"),
	audiowinRound: document.getElementById("audio-winround"),
	audiowinGame: document.getElementById("audio-wingame"),

	// functions
	// Display array of available characters
	choosePlayer: function(e) {
		e.empty();
 		clearInterval(rlInterval);
		prepareCanvas(document.getElementById("canvasDiv"), 240, 220, game.characters);
	},

	// Update player and opponent variables and html elements
	updatePlayers: function(c) {
		if(this.fighters[0] == null) {
	 		this.fighters.push(c);
	 		this.playerhp = this.players[this.fighters[0]].hp;
	 		this.playerap = this.players[this.fighters[0]].ap;
	 		$("#"+this.fighters[0]).addClass("picked-player");
	 		this.characters.splice(this.characters.indexOf(this.fighters[0]),1);
	 	} else if (this.fighters[1] == null && this.fighters[0] != null) {
	 		this.fighters.push(c);
	 		this.opponenthp = this.players[this.fighters[1]].hp;
	 		$("#"+this.fighters[1]).addClass("picked-opponent");
	 		this.characters.splice(this.characters.indexOf(this.fighters[1]),1);
			$(".background-container").css("background-image", "url('"+game.backgrounds[Math.floor(Math.random() * (4 - 0 + 1))]+"')");
			setTimeout(function() {this.canvasDiv.empty()}.bind(this), 500);
	 		clearInterval(rlInterval);
			setTimeout(function() {prepareCanvas(document.getElementById("canvasDiv"), 300, 300, this.fighters)}.bind(this),1000);
			setTimeout(function() {this.audioStart.play();}.bind(this),1000);
	 	}
	},

	// Update fight variables and statuses
	fight: function() {
		if (this.fighters[0] != null && this.fighters[1] != null && this.opponenthp > 0 && this.playerhp > 0) {
			this.opponenthp = Math.max(0, this.opponenthp - this.playerap);
			if(!(this.opponenthp == 0)) {
				this.playerhp = Math.max(0, this.playerhp - game.players[this.fighters[1]].cap);
			}
			this.playerap = this.playerap + game.players[this.fighters[0]].ap;
			if (this.playerhp == 0) {
				setTimeout(gameOver, 2300);
				setTimeout(function() {this.audioGameover.play()}.bind(this),2500);
				setTimeout(function() {this.transitionDiv.empty()}.bind(this),6500);
				setTimeout(function() {this.restart();}.bind(this),6500);
			} else if (this.characters.length > 0 && this.opponenthp == 0) {
				setTimeout(pickNext, 2300);
				setTimeout(function() {this.audiowinRound.play()}.bind(this),2500);
				setTimeout(function() {this.transitionDiv.empty()}.bind(this),5000);
				setTimeout(function() {this.fighters.splice(1, 1)}.bind(this),5000);
				setTimeout(function() {this.choosePlayer(this.canvasDiv)}.bind(this),5000);
				// setTimeout(function() {$(".background-container").css("background-image", "url('"+game.backgrounds[Math.floor(Math.random() * (4 - 0 + 1))]+"')")},5500);
			} else if (this.characters.length < 1 && this.opponenthp == 0) {
				setTimeout(winGame, 2300);
				setTimeout(function() {this.audiowinGame.play()}.bind(this),2500);
				setTimeout(function() {this.transitionDiv.empty()}.bind(this),6500);
				setTimeout(function() {this.restart()}.bind(this),6500);
			}
		}
	},

	// Clear game variables and restart
	restart: function() {
		this.playerhp = 0;
		this.playerap = 0;
		this.opponenthp = 0;
		this.characters = [];
		this.fighters = [];

		this.init();
	},

	// Start game
	init: function() {
		$.each(this.players, function(k, v) {
			game.characters.push(k);
		});
		this.choosePlayer(this.canvasDiv);
	}
}

// Game function calls
$(document).ready(function(){
	// Hide game elements for intro
	$(".gameplay").hide();
	$('link[rel="stylesheet"][href="assets/css/style.css"]').prop('disabled', true);

	// Hide intro elements
	$("#intro").mouseup(function() {
		var audio = document.getElementById("introAudio");
		$(this).hide();
		audio.pause();
		$('link[rel="stylesheet"][href="assets/css/intro.css"]').prop('disabled', true);
		$('link[rel="stylesheet"][href="assets/css/style.css"]').prop('disabled', false);
		$(".gameplay").show();
	});

	// Initialize character array
	game.init();
	$('body').on("click", "canvas",function() {
		var c = $(this).attr("id");
		game.updatePlayers(c);
		if($(this).attr("class") == "fighter0")
		{
			game.fight();
			thrust(parry);
		}
	});
 });