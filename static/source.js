var mca = require('minecraft-mca');
var mcRegion = require('minecraft-region');
var fs = require('fs');
var binaryXHR = require('binary-xhr');
var fly = require('voxel-fly');
var bedrock = require('voxel-bedrock');
var ModalDialog = require('voxel-modal-dialog');
var vkeys = require('vkeys');
var Modal = require('voxel-modal');
var registry = require('voxel-registry');
var createPlugins = require('voxel-plugins');
var consoleWidget = require('console-widget')();


//var materials = [["adminium"], "stationary_lava", "stone", "dirt", "redstone_ore", "coal_ore", "gravel", "iron_ore", "double_stone_slab", "grass", "sandstone", "stone_slab", "stone_pressure_plate", "brick", "glass", "iron_door", "wall_sign", "nether_brick_fence", "glowstone", "torch", "wool", "glass_pane", "wood", "wooden_stairs", "bookshelf", "ladder", "nether_brick_stairs", "wooden_plank", "fence", "stone_brick_stairs", "workbench", "wooden_door", "jukebox", "stone_brick", "chest", "iron_block", "furnace", "brick_stairs", "wooden_pressure_plate", "cobblestone", "clay", "fence_gate", "stationary_water", "minecart_track", "powered_rail", "colored_wool", "leaves", "lapis_lazuli_ore", "gold_ore", "obsidian", "brown_mushroom", "redstone_torch_on", "moss_stone", "monster_spawner", "diamond_ore", "signpost", "gold_block", "white_wool", "orange_wool", "magenta_wool", "light_blue_wool", "yellow_wool", "lime_wool", "pink_wool", "dark_gray_wool", "light_gray_wool", "light_blue_wool", "purple_wool", "dark_blue_wool", "brown_wool", "green_wool", "red_wool", "black_wool"]

var pos = [258, 100, 250];
var regionX = Math.floor((pos[0] >> 4) / 32);
var regionZ = Math.floor((pos[2] >> 4) / 32);
var regionFile = 'region/r.' + regionX + '.' + regionZ + '.mca';

var game = require('voxel-hello-world')({
	generate: function(x, y, z){return 0},
	textures: './textures/',
	materials: [['grass', 'dirt', 'grass_dirt'], 'brick', 'dirt', 'bedrock'],
	materialFlatColor: false,
	chunkSize: 16
})

var createPlayer = require('voxel-player')(game);
/*
var player = createPlayer('player.png');
player.possess();
player.yaw.position.set(pos[0], pos[1], pos[2]); 
*/
class BlankModal extends Modal {
  constructor(game, opts) {
    super(game, Object.assign(opts, {element: getCover() }));

    function getCover() {
      // an example modal element
	/*
      const cover = document.createElement('iframe');
      //cover.style.visibility = 'hidden';
      //cover.style.position = 'absolute';
      //cover.style.top = '100px';    // give some room for user to click outside of to close
      cover.setAttribute('src', 'index.html');
      cover.setAttribute('width', '100%');
      cover.setAttribute('height', '100%');
      document.body.appendChild(cover);
	*/
	const cover = document.createElement('i');
	document.body.appendChild(cover);
	return cover;
    }
}
}

function popup(contents){
	var diaList = $(contents);
	diaList.dialog();
}

function testblock(x, y, z){
	var coords = [x, y, z];
	if(Math.ceil(game.controls.target().avatar.position.x) == coords[0] && Math.ceil(game.controls.target().avatar.position.y) == coords[1] && Math.ceil(game.controls.target().avatar.position.z) == coords[2]){
		return true;
	}else{
		return false;	
	}
}

const blankbox = new BlankModal(game, {});

window.game = game; // for console debugging
var makeFly = fly(game);
makeFly(game.controls.target()).startFlying();
window.types = {};

game.controls.target().avatar.position.copy({x: pos[0], y: pos[1], z: pos[2]});
game.once('tick', function() {
  binaryXHR(regionFile, function(err, data) {
    if (err) return console.error('xhr err', err)
    var region = mcRegion(data, regionX, regionZ)
    window.region = region;
    var opts = {ymin: 0, onVoxel: function(x, y, z, block, chunkX, chunkZ) {
      var type = block.type;
      if (window.types[type]) window.types[type]++
      else window.types[type] = 1
      if (type === "colored_wool") {
        type = block.data;
      }
      game.setBlock([(chunkX * 16) + x, y, (chunkZ * 16) + z], type);
      //console.log(type)
      console.log('test');
    }}
    var view = mca(region, opts);
    //view.loadAll();
    view.loadNearby(pos, game.chunkDistance)
    window.view = view;
  })
})

function continueMsg(){
	consoleWidget.log("(Press 'f' to continue)");
}

var page = 0;
var goal = "talking";

window.addEventListener('keydown', function(e){
	if(vkeys[e.keyCode] == "e"){
		//console.log(game.controls.target().avatar.position);
		if(testblock(264, 100, 251) == true){
			if(goal == "greenTiletut"){
				consoleWidget.log("Great Job!");
				page = 6; //Insure Previous Page
				goal = "talking";
				continueMsg();
			}	
		}
	}
	if(vkeys[e.keyCode] == "f"){
		if(goal == "talking"){
		page = page + 1;
		if(page == 1){
			consoleWidget.log("You in a facility designed to challange the brain");
			consoleWidget.log("(Press 'f' to continue)");
		}
		if(page == 2){
			consoleWidget.log("The test subject..I mean your goal");
			consoleWidget.log("is to learn about pressure");
			continueMsg();
		}
		if(page == 3){
			consoleWidget.log("Let Me show you how it works");
			continueMsg();
		}
		if(page == 4){
			consoleWidget.log("The green tile ahead is a task pad");
			continueMsg();
		}
		if(page == 5){
			consoleWidget.log("They give you information, task, or allow you to interact");
			consoleWidget.log("Just by walking on them and press the 'E' key");
			continueMsg();
		}
		if(page == 6){
			consoleWidget.log("Try It!");
			consoleWidget.log("(Complete the task)");
			goal = "greenTiletut";
		}
		if(page == 7){
			consoleWidget.log("Task Pads usually give you a dialog");
			consoleWidget.log("(Press 'f' to see)");
		}
		if(page == 8){
			blankbox.open();
			var tutDialog = $('<div stype="background-color: gray"><h1>Great!</h1><br><p>Now press close to leave</p></div>');
			goal = "tutDialog";
			$(tutDialog).dialog({
				close: function(){consoleWidget.log("You are no longer in need of training"); goal = "talking"; continueMsg();}
			});
		}
		if(page == 9){
			consoleWidget.log("You are now free to leave lexi!");
			consoleWidget.log("(To Continue, walk to the living room and sit down by pressing 'E')");
		}
	}
	}
	//console.log('test');
});

consoleWidget.open();
consoleWidget.log("Hello");
consoleWidget.log("(Press 'f' to continue)");
