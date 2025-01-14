// Settings

// change this to "south" for the southern hemisphere
// var locale = "north"
var cmdloc

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

function seasonChange(loc) {
	if ( loc == "north" ) {
		Utils.server.runCommand('season set '+seasonsNorth[month])
	} else if ( loc == "south" ) {
		Utils.server.runCommand('season set '+seasonsSouth[month])
	}
}

ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event

	event.register
		(Commands.literal('locale') // The name of the command
			.requires(s => s.hasPermission(2)) // Check if the player has operator privileges
			.executes(ctx => {
				//the variable holding the current locale is cmdloc
				let player = ctx.source.player;
				//player.displayClientMessage(Component.white('the current hemisphere is'+cmdloc+"ern"));
				Utils.server.runCommand('say you are in the '+cmdloc+"ern hemisphere")
				return 1
			})
			.then(
				Commands.argument(
					'hemisphere', 
					Arguments.STRING.create(event)
				) // the selected hemisphere  --  must be north or south
				.executes(ctx => {
					let player = ctx.source.player;
					var newloc = Arguments.STRING.getResult(ctx, 'hemisphere');
					if (newloc == "north" || newloc == "south") {
						cmdloc = newloc
						Utils.server.runCommand("say set server to "+newloc+"ern hemisphere")
					} else {
						//player.displayClientMessage(Component.white('hemisphere must be \'north\' or \'south\''));
						Utils.server.runCommand('say hemisphere must be \'north\' or \'south\'');
						Utils.server.runCommand('say youre input was: ' + newloc);
					}
					return 1
				})
			)
		)
	}
)

ServerEvents.loaded(event => {
	if (!event.server.persistentData.locale) {
		event.server.persistentData.locale = "north"
	}
	cmdloc = event.server.persistentData.locale
	Utils.server.runCommand('gamerule doSeasonCycle false')
	seasonChange(event.server.persistentData.locale)
	if ( event.server.persistentData.locale == "north" ) {
		console.info(`server started the current season is ` + seasonsNorth[month])
		//Utils.server.runCommand(`say server started the current season is ` + seasonsNorth[month])
	} else if ( event.server.persistentData.locale == "south" ) {
		console.info(`server started the current season is ` + seasonsSouth[month])
		//Utils.server.runCommand(`say server started the current season is ` + seasonsSouth[month])
	} else {
		console.error('script settings set incorrectly: please set locale to \'north\' or \'south\'')
		//Utils.server.runCommand('tellraw @a [\"\",{\"text\":\"script settings set incorrectly:\",\"color\":\"red\",\"underlined\":true,\"bold\":true},\" please set locale to \'north\' or \'south\'\"\]')
	}
})

ServerEvents.tick(event => {
	if (event.server.persistentData.locale != cmdloc) {
		event.server.persistentData.locale = cmdloc
		seasonChange(event.server.persistentData.locale)
	}
	newMonth = new Date().getMonth()
	if (newMonth != month) {
		month = newMonth
		if (month == 2 || month == 5 || month == 8 || month == 11) { // javascript months go from 0 to 11 instead of 1 to 12
			Utils.server.runCommand(`say the seasons are changing`)
		}
		seasonChange(event.server.persistentData.locale)
	}
})
