
$(document).ready(function(){
	$("#intro").mouseup(function() {
		var audio = document.getElementById("introAudio");
		$(this).hide();
		audio.pause();
	});
});