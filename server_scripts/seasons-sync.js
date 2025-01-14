// Settings

// change this to "south" for the southern hemisphere
var locale = "north"

// Code

var month = new Date().getMonth()
var newMonth
var seasonsNorth = [ // for servers in the northern hemisphere
	"mid_winter",
	"late_winter",
	"early_spring",
	"mid_spring",
	"late_spring",
	"early_summer",
	"mid_summer",
	"late_summer",
	"early_autumn",
	"mid_autumn",
	"late_autumn",
	"early_winter"
]

var seasonsSouth = [ // for servers in the southern hemisphere
	"mid_summer",
	"late_summer",
	"early_autumn",
	"mid_autumn",
	"late_autumn",
	"early_winter",
	"mid_winter",
	"late_winter",
	"early_spring",
	"mid_spring",
	"late_spring",
	"early_summer"
]

function seasonChange() {
	if ( locale == "north" ) {
		Utils.server.runCommand('season set '+seasonsNorth[month])
	} else if ( locale == "south" ) {
		Utils.server.runCommand('season set '+seasonsSouth[month])
	}
}

ServerEvents.loaded(event => {
	Utils.server.runCommand('gamerule doSeasonCycle false')
	seasonChange()
	if ( locale == "north" ) {
		console.info(`server started the current season is ` + seasonsNorth[month])
		//Utils.server.runCommand(`say server started the current season is ` + seasonsNorth[month])
	} else if ( locale == "south" ) {
		console.info(`server started the current season is ` + seasonsSouth[month])
		//Utils.server.runCommand(`say server started the current season is ` + seasonsSouth[month])
	} else {
		console.error('script settings set incorrectly: please set locale to \'north\' or \'south\'')
		//Utils.server.runCommand('tellraw @a [\"\",{\"text\":\"script settings set incorrectly:\",\"color\":\"red\",\"underlined\":true,\"bold\":true},\" please set locale to \'north\' or \'south\'\"\]')
	}
})

ServerEvents.tick(event => {
	newMonth = new Date().getMonth()
	if (newMonth != month) {
		month = newMonth
		if (month == 2 || month == 5 || month == 8 || month == 11) { // javascript months go from 0 to 11 instead of 1 to 12
			Utils.server.runCommand(`say the seasons are changing`)
		}
		seasonChange()
	}
})