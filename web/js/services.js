


/**********************************************************
 * WORLD SERVICE
 *
 */
angular.module( "app" ).factory( "WorldService", function( $rootScope, $http ) {

	// AngularJS by default adds extra HTTP headers with cross domain requests.
	//delete $http.defaults.headers.common[ "X-Requested-With" ];
	
	
	// ----- PRIVATE VARS ----- //
	var world;
	var worldNames;
	var service = {};
	
	
	// ----- CONSTANTS ----- //
	service.NAME = "WorldService";
	
	
	// ----- EVENTS ----- //
	service.UPDATE = service.NAME + "Update";
	
	
	// ----- GET / SET FUNCTIONS ----- //
	service.getWorld = function() {
	
		return world;
	
	};
	
	service.setWorld = function( value ) {
	
		world = value;
		$rootScope.$broadcast( service.UPDATE, world );
	
	};
	
	
	// ----- FUNCTIONS ----- //	
	service.loadWorlds = function( callback ) {
		console.log( "WorldService: loadWorlds" );
		
		/*
		if ( !worldNames ) {
		
			var url = "https://api.guildwars2.com/v1/world_names.json";
			if ( !Modernizr.cors ) url = "json-proxy.php?url=" + url;
			
			$http.get( url ).success( function( data, status, headers, config ) {
			
				worldNames = data;
				callback( worldNames );
				
			} ).error( function( data, status, headers, config ) {
			
				console.log( data );
				console.log( "^ error: " + status );
				console.log( headers );
				console.log( config );
			
			} );
			
		} else {
			
			callback( worldNames );
		
		}
		*/
		
		if ( !worldNames ) {
		
			var url = "data/world_names.json";
			$http.get( url ).success( function( data ) {
				
				worldNames = data;
				callback( worldNames );
				
			} );
			
		} else {
			
			callback( worldNames );
		
		}
	
	};
	
	service.lookupWorld = function( id ) {
		console.log( "WorldService: lookupWorld: " + id );
	
		if ( worldNames ) {
		
			var i;
			var length = worldNames.length;
			var world;
			
			for ( i = 0; i < length; i++ ) {
			
				world = worldNames[i];
				if ( world.id == id ) return world;
			
			}
		
		}	
	
	};
	
	service.lookupWorldName = function( id ) {
		console.log( "WorldService: loadWorldName: " + id );
	
		if ( worldNames ) {
		
			var i;
			var length = worldNames.length;
			var world;
			
			for ( i = 0; i < length; i++ ) {
			
				world = worldNames[i];
				if ( world.id == id ) return world.name;
			
			}
		
		}	
	
	};
	
	
	// ----- RETURN ----- //
	return service;

} );


/**********************************************************
 * MATCH SERVICE
 *
 */
angular.module( "app" ).factory( "MatchService", function( $rootScope, $http ) {

	
	// ----- PRIVATE VARS ----- //
	var matches;
	var matchId;
	var matchDetails;	
	var service = {};
	
	
	// ----- CONSTANTS ----- //
	service.NAME = "MatchService";
	
	
	// ----- EVENTS ----- //
	service.MATCHES_UPDATE = service.NAME + "matchesUpdate";
	service.MATCH_DETAILS_UPDATE = service.NAME + "matchDetailsUpdate";
	
	
	// ----- GET / SET FUNCTIONS ----- //
	service.getMatches = function() {
	
		return matches;
	
	};
	
	service.setMatches = function( value ) {
		console.log( "MatchService: setMatches" );
	
		matches = value;
		$rootScope.$broadcast( service.MATCHES_UPDATE, matches );
			
	};
	
	service.getMatchId = function() {
	
		return matchId;
	
	};
	
	service.getMatchDetails = function() {
	
		return matchDetails;
	
	};
	
	service.setMatchDetails = function( value ) {
		console.log( "MatchService: setMatchDetails" );
	
		matchDetails = value;
		$rootScope.$broadcast( service.MATCH_DETAILS_UPDATE, matchDetails );
			
	};
	
	
	// ----- FUNCTIONS ----- //
	service.loadMatches = function( callback ) {
		console.log( "MatchService: loadMatches" );
	
		if ( !matches ) {
		
			var url = "https://api.guildwars2.com/v1/wvw/matches.json";
			if ( !Modernizr.cors ) url = "json-proxy.php?url=" + url;
			
			$http.get( url ).success( function( data ) {
				
				service.setMatches( data );
				callback( matches );
				
			} );
			
		} else {
			
			callback( matches );
		
		}
	
	};
	
	service.loadMatchDetails = function( matchId, callback ) {
		console.log( "MatchService: loadMatchsDetail" );
	
		var url = "https://api.guildwars2.com/v1/wvw/match_details.json?match_id=" + matchId;
		if ( !Modernizr.cors ) url = "json-proxy.php?url=" + url;
		
		$http.get( url ).success( function( data ) {
			
			service.setMatchDetails( data );
			callback( matchDetails );
			
		} );
	
	};
	
	service.loadMatchDetailsByWorldId = function( worldId, callback ) {
		console.log( "MatchService: loadMatchDetailsByWorldId" );
	
		if ( matches ) {
		
			var i;
			var length = matches.wvw_matches.length;
			var match;
			
			for ( i = 0; i < length; i++ ) {
			
				match = matches.wvw_matches[i];
				
				if ( match.red_world_id == worldId ||
					 match.blue_world_id == worldId ||
					 match.green_world_id == worldId ) {
					
					matchId = match.wvw_match_id;
					service.loadMatchDetails( matchId, callback );
					
					break;
					
				}
			
			}		
		
		}
	
	};
	
	service.lookupWorldId = function( matchId, color ) {
		console.log( "MatchService: lookupWorldId: " + matchId + ", " + color );
	
		if ( matches ) {
		
			var i;
			var length = matches.wvw_matches.length;
			var match;
		
			for ( i = 0; i < length; i++ ) {
			
				match = matches.wvw_matches[i];

				if ( match.wvw_match_id == matchId ) {
				
					return match[ color.toLowerCase() + "_world_id" ];
				
				}
			
			}
		
		}
	
	};
	
	service.lookupWorldColor = function( worldId ) {
	
		if ( matches ) {
		
			var i;
			var length = matches.wvw_matches.length;
			var match;
			
			for ( i = 0; i < length; i++ ) {
			
				match = matches.wvw_matches[i];
				
				if ( match.red_world_id == worldId ) return "Red";
				else if ( match.blue_world_id == worldId ) return "Blue";
				else if ( match.green_world_id == worldId ) return "Green";
			
			}			
		
		}	
	
	};
	
	// ----- RETURN ----- //
	return service;

} );


/**********************************************************
 * OBJECTIVE SERVICE
 *
 */
angular.module( "app" ).factory( "ObjectiveService", function( $http ) {

	
	// ----- PRIVATE VARS ----- //
	var objectives;
	var service = {};
	
	
	// ----- CONSTANTS ----- //
	service.NAME = "ObjectivesService";
	
	
	// ----- GET / SET FUNCTIONS ----- //
	service.getObjectives = function() {
	
		return objectives;
	
	};
	
	
	// ----- FUNCTIONS ----- //
	service.loadObjectives = function( callback ) {
	
		if ( !objectives ) {
		
			var url = "data/objective_names.json";
			$http.get( url ).success( function( data ) {
				
				objectives = data;
				callback( objectives );
				
			} );
			
		} else {
			
			callback( objectives );
		
		}
	
	};
	
	service.lookupObjective = function( id ) {
	
		if ( objectives ) {
		
			var i;
			var length = objectives.length;
			var obj;
			
			for ( i = 0; i < length; i++ ) {
			
				obj = objectives[i];
				if ( obj.id == id ) return obj;
			
			}
		
		}	
	
	};
	
	
	// ----- RETURN ----- //
	return service;

} );


/**********************************************************
 * GUILD DETAILS SERVICE
 *
 */
angular.module( "app" ).factory( "GuildDetailsService", function( $http ) {

	
	// ----- PRIVATE VARS ----- //
	var guilds = {};
	var service = {};
	
	
	// ----- CONSTANTS ----- //
	service.NAME = "GuildDetailsService";
	
	
	// ----- GET / SET FUNCTIONS ----- //
	
	
	// ----- FUNCTIONS ----- //
	service.loadGuildDetails = function( id, callback ) {
		console.log( "GuildDetailsService: loadGuildDetails: " + id );
		
		var key = id.replace( "-", "" );
		
		if ( !guilds[key] ) {
		
			guilds[key] = {};
		
			var url = "https://api.guildwars2.com/v1/guild_details.json?guild_id=" + id;
			if ( !Modernizr.cors ) url = "json-proxy.php?url=" + url;
			
			$http.get( url ).success( function( data ) {
				
				guilds[key] = data;
				callback( guilds[key] );
				
			} );
			
		} else {
		
			callback( guilds[key] );
			
		}
	
	};
	
	service.lookupGuildDetails = function( id ) {
	
		var key = id.replace( "-", "" );
		
		if ( guilds[key] )
			return guilds[key];
		else
			return null;
	
	};
	
	service.lookupGuildName = function( id ) {
	
		var key = id.replace( "-", "" );
		
		if ( guilds[key] )
			return guilds[key].guild_name;
		else
			return null;
	
	};
	
	service.lookupGuildTag = function( id ) {
	
		var key = id.replace( "-", "" );
		
		if ( guilds[key] )
			return guilds[key].tag;
		else
			return null;
	
	};

	
	// ----- RETURN ----- //
	return service;

} );