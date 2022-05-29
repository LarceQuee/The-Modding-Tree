let modInfo = {
	name: "The Distance Incremental Tree",
	id: "mymod",
	author: "LarceQuee",
	pointsName: "nothing",
	modFiles: ["layers.js", "tree.js", "reward.js", "functions.js", "achievements.js","automation.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.5",
	name: "Dimension of Collapse",
}

let changelog = `<h1>Changelog:</h1><br><br>
	<font size=5 color="orange">v0.5</font><br>
		- Added new Row Achievements.<br>
		- Added Universal Collapse layer.
		- Added 12 Milestones.<br>
		- Added a new Fuelbot in Automation layer.<br>
		- Current endgame 250000 Cavaders.<br>
		- 18, 28, 38 Achievements can be earned.<br>
		- Remake Rocket gain formula.<br><br>
	<font size=5 color="orange">v0.4</font><br>
		- Added 32(29 can possible) Achievements.<br>
		- Added Automation layer.<br>
		- Various code changed.<br><br>
	<font size=5 color="orange">v0.3</font><br>
		- Added Time Reversal layer.<br>
		- Added 10(4 unuseful) upgrades.<br>
		- Current endgame 50 Mpc distance.<br>
		- Various code changed.(Maybe reset the game)<br><br>
	<font size=5 color="orange">v0.2</font><br>
		- Added Rockets layer.<br>
		- Added Rocket Fuel buyable.<br>
		- Current endgame until 1 Tm distance.<br>
		- Added number formating <b>formatDistance</b><br><br>
	<font size=4 color="red">v0.1.1</font><br>
		- Fixed endgame.<br><br>
	<font size=5 color="orange">v0.1</font><br>
		- Added 2 buyables.<br>
		- Added 2 layers.<br>
		- Current endgame until 5e6 distance.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.uc.points.gte(250000)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}