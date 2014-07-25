
/**********************************************************
 * APP CONTROLLER
 *
 */
function AppController( $scope, WorldService ) {
	
	
};

/**********************************************************
 * WORLD CONTROLLER
 *
 */
function WorldController( $scope, WorldService ) {

	var baseUrl = "http://gw2wack.mercilessgames.com/";

	$scope.display = true;
	$scope.worldsNA = [];
	$scope.worldsEU = [];
	
	$scope.getWorlds = function() {
		console.log( "WorldController: getWorlds" );
		
		WorldService.loadWorlds( $scope.processWorlds );
	
	};
	
	$scope.getUrlParameters = function() {
	
		var query = location.search.slice( 1, location.search.length ).split( "&" );
		var parameters = {};
		
		var i;
		var length = query.length;
		var ary;
		
		for ( i = 0; i < length; i++ ) {
		
			ary = query[i].split( "=" );
			parameters[ ary[0] ] = ary[ 1 ];
		
		}
		
		return parameters;
	
	};
	
	$scope.processWorlds = function( data ) {
		console.log( "WorldController: processWorlds" );	
		
		// Get ID from Hash
		var id = location.hash.slice( 1, location.hash.length );
		
		// Get ID from Address Query
		//var id = $scope.getUrlParameters().id;
		var isIdValid = false;
	
		// Sort Alphabetically
		data.sort( function( a, b ) {
		
			if ( a.name < b.name ) return -1;
			if ( a.name > b.name ) return 1;
			return 0;
			
		} );
	
		// Push to Region
		var i;
		var length = data.length;
		var world;
		
		for ( i = 0; i < length; i++ ) {
		
			world = data[i];
		
			if ( world.id.indexOf( "1" ) == 0 ) {
			
				$scope.worldsNA.push( world );
				
			} else {
			
				$scope.worldsEU.push( world );
			
			}
			
			if ( world.id == id &&
				 isIdValid == false ) {
				
				isIdValid = true;
				
			}
			
		}
		
		// Auto Select World from ID
		if ( isIdValid ) {
		
			var world = WorldService.lookupWorld( id );
			WorldService.setWorld( world );
			$scope.display = false;
		
		}
	
	};
	
	
	// ----- ADD LISTENERS ----- //
	$scope.$on( WorldService.UPDATE, function( e, world ) {
		console.log( "WorldController: onWorldServiceUpdate" );
		
		if ( world ) {
		
			$scope.display = false;
			
		} else {
		
			$scope.display = true;
		
		}
		
	});
	
	
	// ----- EVENT LISTENERS ----- /
	$scope.onWorldSelect = function( world ) {
		console.log( "WorldService: onWorldSelect: " + world.id );
		
		WorldService.setWorld( world );

		location.hash = world.id;
		
	};
	
	// ----- INIT ----- //
	$scope.getWorlds();
	
};

/**********************************************************
 * MATCH CONTROLLER
 *
 */
function MatchController( $scope, WorldService, MatchService, ObjectiveService, GuildDetailsService ) {


	// ----- PUBLIC VARS ----- //
	$scope.display = false;
	$scope.selectedWorld = WorldService.getWorld();
	
	$scope.worlds;
	$scope.eternalBattlegrounds = {};
	
	
	// ----- PRIVATE VARS ------ //
	var timer;
	var TIMER_REFRESH = 30000;

	
	// ----- LOAD / PROCESS FUNCTIONS ----- //
	// 1. Load Matches
	$scope.loadMatches = function() {
		MatchService.loadMatches( $scope.processMatches );
	};
	
	$scope.processMatches = function( data ) {
		$scope.loadObjectives();
	};
	
	// 2. Load Objectives
	$scope.loadObjectives = function() {
		ObjectiveService.loadObjectives( $scope.processObjectives );
	};
	
	$scope.processObjectives = function( data ) {
		$scope.loadMatchDetails( $scope.selectedWorld.id );
	};
	
	// 3. Load Match Details
	$scope.loadMatchDetails = function( worldId ) {
		console.log( "MatchController: loadMatchDetails" );
		
		MatchService.loadMatchDetailsByWorldId( worldId, $scope.processMatchDetails );		
	
	};
	
	$scope.processMatchDetails = function( data ) {
		console.log( "MatchController: processMatchDetails" );
		
		$scope.updateMatch();
		$scope.updateMatchDetails( data );
		$scope.show();
		
	};
	
	// ----- TIMER ----- //
	$scope.startTimer = function() {
		console.log( "MatchController: startTimer" );
	
		timer = setInterval( $scope.onTimer, TIMER_REFRESH );
	
	};
	
	$scope.stopTimer = function() {
		console.log( "MatchController: stopTimer" );
	
		clearInterval( timer );
	
	};
	
	$scope.onTimer = function() {
		console.log( "MatchController: onTimer" );
		
		MatchService.loadMatchDetails( MatchService.getMatchId(), $scope.processMatchDetails );
	
	};
	
	
	// ----- ANIMATION ----- //
	$scope.show = function() {
		console.log( "MatchController: show" );
		
		if ( !$scope.display ) {
		
			$scope.display = true;
			$scope.startTimer();
			
		}
		
	};
	
	$scope.hide = function() {
		console.log( "MatchController: hide" );
		
		$scope.display = false;
		$scope.stopTimer();
	
	};
	
	
	// ----- UPDATE FUNCTIONS ----- //	
	/**
	 * Update the details of the match that won't change.
	 */
	$scope.updateMatch = function() {
		console.log( "MatchController: updateMatch" );
	
		var matchId = MatchService.getMatchId();
		
		$scope.worlds = [];
		
		// Red World
		$scope.worlds.push( { 
			color: "red", 
			name: WorldService.lookupWorldName( MatchService.lookupWorldId( matchId, "red" ) )
		} );
		
		// Blue World
		$scope.worlds.push( { 
			color: "blue", 
			name: WorldService.lookupWorldName( MatchService.lookupWorldId( matchId, "blue" ) )
		} );
		
		// Green World
		$scope.worlds.push( { 
			color: "green", 
			name: WorldService.lookupWorldName( MatchService.lookupWorldId( matchId, "green" ) )
		} );
	
	};
	
	/**
	 * Update the details of the match that are dynamic.
	 */
	$scope.updateMatchDetails = function ( matchDetails ) {
		console.log( "MatchController: updateMatchDetails" );
	
		
		// Red World
		$scope.worlds[0].points = 0;
		$scope.worlds[0].totalpoints = parseInt( matchDetails.scores[0] );
		$scope.worlds[0].fortifications = { camp:0, tower:0, keep:0, castle:0 };
		$scope.worlds[0].objectives = [];
		
		// Blue World
		$scope.worlds[1].points = 0;
		$scope.worlds[1].totalpoints = parseInt( matchDetails.scores[1] );
		$scope.worlds[1].fortifications = { camp:0, tower:0, keep:0, castle:0 };
		$scope.worlds[1].objectives = [];
		
		// Green World
		$scope.worlds[2].points = 0;
		$scope.worlds[2].totalpoints = parseInt( matchDetails.scores[2] );
		$scope.worlds[2].fortifications = { camp:0, tower:0, keep:0, castle:0 };
		$scope.worlds[2].objectives = [];
		
		// Eternal Battlegrounds
		$scope.eternalBattlegrounds = [];
		
		
		// Loop Stuff
		var i;
		var lengthI = matchDetails.maps.length;
		var map;
		
		var j;
		var lengthJ;
		var obj;
		var objDetails;
		var guildDetails;
		
		for ( i = 0; i < lengthI; i++ ) {
		
			map = matchDetails.maps[i];
			lengthJ = map.objectives.length;
			
			for ( j = 0; j < lengthJ; j++ ) {
			
				objDetails = ObjectiveService.lookupObjective( map.objectives[j].id );
				
				if ( objDetails ) {
				
					obj = {
						id: map.objectives[j].id,
						dir: objDetails.direction,
						name: objDetails.full_name,
						owner: map.objectives[j].owner.toLowerCase(),
						points: parseFloat( objDetails.points ),
						type: objDetails.type
					};
					
					// Push to Coresponding Map
					if ( map.type.toLowerCase().indexOf( "red" ) > -1 )
						$scope.worlds[0].objectives.push( obj );
						
					else if ( map.type.toLowerCase().indexOf( "blue" ) > -1 )
						$scope.worlds[1].objectives.push( obj );
						
					else if ( map.type.toLowerCase().indexOf( "green" ) > -1 )
						$scope.worlds[2].objectives.push( obj );
						
					else 
						$scope.eternalBattlegrounds.push( obj );

					// Tally Fortifications & Points
					if ( obj.owner == "red" ) {
					
						$scope.worlds[0].fortifications[ obj.type ]++;
						$scope.worlds[0].points += obj.points;
						
					} else if ( obj.owner == "blue" ) {
					
						$scope.worlds[1].fortifications[ obj.type ]++;
						$scope.worlds[1].points += obj.points;
						
					} else if ( obj.owner == "green" ) {
					
						$scope.worlds[2].fortifications[ obj.type ]++;
						$scope.worlds[2].points += obj.points;
						
					}
					
				}
				
			}
			
		}
		
		// Sort Objectives
		$scope.eternalBattlegrounds.sort( sortObjectives );
		$scope.worlds[0].objectives.sort( sortObjectives );
		$scope.worlds[1].objectives.sort( sortObjectives );
		$scope.worlds[2].objectives.sort( sortObjectives );
		
		// Sort Worlds
		$scope.worlds.sort( sortWorlds );
	
	};
	
	
	// ----- UTIL FUNCTIONS ----- //
	function sortWorlds( a, b ) {
	
		if ( a.totalpoints < b.totalpoints ) return 1;
		if ( a.totalpoints > b.totalpoints ) return -1;
		return 0;
	
	};
	
	function sortObjectives( a, b ) {
	
		if ( a.points < b.points ) return 1;
		if ( a.points > b.points ) return -1;
		if ( a.dir < b.dir ) return 1;
		if ( a.dir > b.dir ) return -1;
		return 0;
	
	};
	
	
	// ----- ADD LISTENERS ----- //
	$scope.$on( WorldService.UPDATE, function( e, world ) {
		console.log( "MatchController: onWorldServiceUpdate" );
		
		if ( world ) {
		
			$scope.selectedWorld = world;
			$scope.loadMatches();
			
		} else {
		
			$scope.hide();
		
		}
		
	});
	
	
	// ----- EVENT LISTENERS ----- //
	$scope.onWorldSelect = function() {
		console.log( "MatchService: onWorldSelect" );
		
		WorldService.setWorld( undefined );
		location.hash = "";
	
	};
	
	// ----- INIT ----- //

};
