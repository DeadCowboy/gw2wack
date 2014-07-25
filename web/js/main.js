
(function () {

	// ----- VARS ----- //
	var iconMin = "icon-minus-sign-alt";
	var iconMax = "icon-plus-sign-alt";
	
	
	// ----- FUNCTIONS ----- //
	function init() {
		console.log( "init" );
		
		$("#overlay").removeClass( "hide" );
		$("#overlay").hide();
		
		var minHeight = $(window).height() - $("header").outerHeight() - $("footer").outerHeight();
		$("#main").css( "min-height", minHeight );
		
		$("#nav-about").on( "click", onNavClick );
		$(".match-map-toggle").on( "click", onToggleClick );		
		$("#overlay-close button").on( "click", onCloseClick );
	
	};
	
	function toggleMap( id ) {
		console.log( "toggleMap: " + id );
		
		var elem = $( "#" + id );
		var icon = elem.find( ".match-map-toggle i" );
		var list = elem.find( "ul" );
		
		// Expand
		if ( icon.hasClass( iconMax ) ) {
		
			icon.removeClass( iconMax );
			icon.addClass( iconMin );
			list.removeClass( "match-map-toggle-off" );
		
		// Collapse
		} else {
			
			icon.removeClass( iconMin );
			icon.addClass( iconMax );
			list.addClass( "match-map-toggle-off" );
		
		}
	
	};
	
	function showOverlay() {
		console.log( "showOverlay" );
	
		$("#overlay").fadeIn();
	
	};
	
	function hideOverlay() {
		console.log( "hideOverlay" );
	
		$("#overlay").hide();
	
	};
	
	
	// ----- EVENT LISTENERS ----- //
	function onReady() {
	
		init();
		
	};
	
	function onLoad() {
		console.log( "onLoad" );
		
	};
	
	function onNavClick(e) {
		console.log( "onNavClick" );
		
		e.preventDefault();
		showOverlay();
	
	};
	
	function onCloseClick(e) {
		console.log( "onCloseClick" );
		
		e.preventDefault();
		hideOverlay();
	
	};
	
	function onToggleClick(e) {
		console.log( "onToggleClick" );
		
		var id = $(e.currentTarget).parent().attr( "id" );
		toggleMap( id );
		
	};
	
	// ----- INIT ----- //
	$(document).ready( onReady );
	$(window).load( onLoad );

})();






















