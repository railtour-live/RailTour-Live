
var platform_name = '';
var platform_version = '';
var initialized = false;
var screenheight = 0;
var footeroffset = 0;


var state = new Object()
state.name = '';
state.credits = '';
state.last = '';
state.email = '';
state.phone = '';
state.user = '';
state.password = '';
state.phone = '';
state.confirmed = '';
state.sms = '';
state.code = '';
state.registered = '';
state.tours = '';
state.promook = '';
state.badge = '';

function resetvars() {
    state.name = '';
    state.credits = '';
    state.last = '';
    state.email = '';
    state.phone = '';
    state.user = '';
    state.password = '';
    state.phone = '';
    state.confirmed = '';
    state.sms = '';
    state.code = '';
    state.registered = '';
    state.tours = '';
    state.promook = '';
    state.badge = '';
}

//var phoneName = device.uuid;

//var activeSection = 'HOME';
var GLOBAL_SERVER = 'https://www.railtour-live.co.uk/app/mobile.php';
var appBusy = false;

function preventBehavior(e) 
{ 
    e.preventDefault(); 
}


//document.addEventListener("touchmove", preventBehavior, false);

$("#pageHome").live('pagehide', forcerefresh);
$("#pageLogin").live('pagehide', forcerefresh);
$("#pageTours").live('pagehide', forcerefresh);
$("#pageProfile").live('pagehide', forcerefresh);
$("#pageSettings").live('pagehide', forcerefresh);
$("#pageUpdates").live('pagehide', forcerefresh);
$("#pageHelp").live('pagehide', forcerefresh);
$("#pageConfirm").live('pagehide', forcerefresh);

$("#pageHome").live('pagebeforecreate', addmarkup);
$("#pageLogin").live('pagebeforecreate', loginaddmarkup);
$("#pageTours").live('pagebeforecreate', addmarkup);
$("#pageProfile").live('pagebeforecreate', addmarkup);
$("#pageSettings").live('pagebeforecreate', addmarkup);
$("#pageUpdates").live('pagebeforecreate', addmarkup);
$("#pageHelp").live('pagebeforecreate', addmarkup);
$("#pageConfirm").live('pagebeforecreate', loginaddmarkup);


$(document).bind('pagechange', beforechange);

function onDeviceReady() {
    
    platform_name = device.platform;
	platform_version = parseFloat(device.version);
	screenheight =  $(window).height();
	initialized=true;
    
    if(typeof(invokeString) != "undefined" && invokeString.length > 0 &&  invokeString[0] == '{') {
        //push notification
        console.warn('push-notification!: ' + invokeString);
        navigator.notification.alert(JSON.stringify(['push-notification!', invokeString]));
    }
    
    var pushNotification = window.plugins.pushNotification;
    pushNotification.registerDevice({alert:true, badge:true, sound:true, appid:"4fdf2fdb648095.31460530", appname:"RailTour-Live"},
                                    function(status) {
                                    console.warn('registerDevice:%o', status);
                                    //navigator.notification.alert(JSON.stringify(['registerDevice', status]));
                                    },
                                    function(status) {
                                    console.warn('failed to register :%o', status);
                                    //navigator.notification.alert(JSON.stringify(['failed to register ', status]));
                                    });
    
    pushNotification.setApplicationIconBadgeNumber(0);
    
    
}




function getbalance() {
    showspinner('Checking Balance...');
    jQuery.post(GLOBAL_SERVER,({phone : state.phone , action: 'BALANCE'}),
                function( data ) {
                if(data != "") {
                state.credits = data;
                hidespinner();
                } else {
                navigator.notification.alert("Check you are connected to the internet.", null, "Network Error","OK");
                hidespinner();
                }        
                });
}

function gettours() {
showspinner('Getting Latest Tour Listings...');
    jQuery.post(GLOBAL_SERVER,({action: 'TOURS'}),
                function( data ) {
                if(data != "") {
                    $('#TourListings').html(data).listview('refresh');
                    hidespinner();
                } else {
                    navigator.notification.alert("Check you are connected to the internet.", null, "Network Error","OK");
                    hidespinner();
                }        
                });
}

function getupdates() {
    showspinner('Getting Latest Tour Updates...');
    jQuery.post(GLOBAL_SERVER,({phone : state.phone , action: 'RECIEVEDUPDATES'}),
                function( data ) {
                if(data != "") {
                $('#TourUpdates').html(data).listview('refresh');
                hidespinner();
                } else {
                navigator.notification.alert("Check you are connected to the internet.", null, "Network Error","OK");
                hidespinner();
                }        
                }); 
}

function getheader() {
	
	var header = '';
    
	if (IsLoggedIn() == false) {
		header = header + '<a href="info.html" data-iconpos="notext" id="help" data-icon="info" data-theme="b"></a><H1>Login</H1>';
	} else {
		header = header
        + '<a href="info.html" data-iconpos="notext" id="help" data-icon="info" data-theme="b"></a><H2>Credit &pound;'
        + state.credits
        + '</H2><a href="login.html" data-role="button" data-theme="b" onClick="doLogout()">Logout</a>';
	}
	return (header);
}

function getupdatecount() {
    jQuery.post(GLOBAL_SERVER,({phone : state.phone , action: 'UPDATECOUNT'}),
                function( data ) {
                if(data != "") {
                state.badge = data;
                } else {
                state.badge = '0';
                }        
                }); 
}

function getfooter() {
    var actHome='';
    var actTours='';
    var actProfile='';
    var actSettings='';
    var actUpdates='';

    getupdatecount();
    
    if (activeSection=='HOME') actHome='class="ui-btn-active"';
    if (activeSection=='TOURS') actTours='class="ui-btn-active"';
    if (activeSection=='PROFILE') actProfile='class="ui-btn-active"';
    if (activeSection=='SETTINGS') actSettings='class="ui-btn-active"';
    if (activeSection=='UPDATES') actUpdates='class="ui-btn-active"';

    var foot = '<div data-role="navbar" class="nav-glyphish-example" data-grid="d">\
    <ul class="ui-grid-b">\
    <li class="ui-block-a"><a href="#" onClick="goHome();" data-theme="b" '+actHome+' data-role="button" id="Bhome" data-icon="custom">Home</a></li>\
    <li class="ui-block-b"><a href="#" onClick="goTours();" data-theme="b" '+actTours+' data-role="button" id="Btours" data-icon="custom">Tours</a></li>\
    <li class="ui-block-c"><a href="#" onClick="goProfile();" data-theme="b" '+actProfile+' data-role="button" id="Bprofile" data-icon="custom">Profile</a></li>\
    <li class="ui-block-d"><a href="#" onClick="goSettings();" data-theme="b" '+actSettings+' data-role="button" id="Bsettings" data-icon="custom">Settings</a></li>\
    <li class="ui-block-e"><a href="#" onClick="goUpdates();" data-theme="b" '+actUpdates+' data-role="button" id="Bupdate" data-icon="custom">\
    <div class="badger-outter" id="Badger"><div class="badger-inner"><p class="badger-badge" id="Badge">'+state.badge+'</p></div></div>Updates</a></li>\
    </ul>\
    </div>';

    return(foot);
    
}

function isApple(minver) {
	if ( (platform_name.indexOf("iPhone")>-1) || (platform_name.indexOf("iPad")>-1) ) {
		if (platform_version<=(minver)) return(true);
	}
	return(false);
}

function forcerefresh(event, ui){
	var page = jQuery(event.target);
	page.remove();
    
}

function loginaddmarkup(event,data) {
	addmarkup(event,data);
    $('.ui-block-b').addClass('ui-disabled');
	$('.ui-block-c').addClass('ui-disabled');
	$('.ui-block-d').addClass('ui-disabled');
	$('.ui-block-e').addClass('ui-disabled');
}

function addmarkup(event, data) {
	appBusy = false;
	
	var page = $(event.handleObj.selector);
	var header = page.find("#mainheader").first();;
	header.html(getheader);
    header.fixedtoolbar({
                        tapToggle : false
                        });
    
	var footer = page.find("#mainfooter").first();
	footer.html(getfooter(''));
    footer.fixedtoolbar({
                        tapToggle : false
                        });
}

function beforechange(event, data) {
	if ($.mobile.activePage != undefined)
		currentpageid = ($.mobile.activePage).attr('id');
}

function doLogout() {
	state.name = '';
	resetvars();
	searchcount=0;
	$('#contentLoginInfo').html('&nbsp;');
    $('.ui-block-b').addClass('ui-disabled');
    $('.ui-block-c').addClass('ui-disabled');
    $('.ui-block-d').addClass('ui-disabled');
    $('.ui-block-e').addClass('ui-disabled');
}

function IsLoggedIn() {
	if (state.name == '') {
        $('.ui-block-b').addClass('ui-disabled');
        $('.ui-block-c').addClass('ui-disabled');
        $('.ui-block-d').addClass('ui-disabled');
        $('.ui-block-e').addClass('ui-disabled');
		return (false);
	} else
		return (true);
}

function showspinner(msg) {
	$.mobile.loadingMessageTextVisible = true;
	$.mobile.loadingMessageTheme = 'a';
	$.mobile.loadingMessage = msg;
	$.mobile.showPageLoadingMsg();
}

function hidespinner() {
	$.mobile.loadingMesasge = 'Loading...';
	$.mobile.hidePageLoadingMsg();
    
}

function setupAjaxErrorHandler(dest) {
	$.ajaxSetup({
                error : function(x, e) {
                $(dest).css("color", " red");
                if (x.status == 0) {
				$(dest).html('You are offline!!\n Please Check Your Network.');
                } else if (x.status == 404) {
				$(dest).html('Requested URL not found.');
                } else if (x.status == 500) {
				$(dest).html('Internal Server Error.');
                } else if (e == 'parsererror') {
				$(dest).html('Error.\nParsing JSON Request failed.');
                } else if (e == 'timeout') {
				$(dest).html('Request Time out.');
                } else {
				$(dest).html(x.responseText);
                }
                hidespinner();
                }
                
                });
};

function serializeSession($form, $action) {
	var q = $form.serialize();
	q = q + "&username=" + state.user + "&password=" + state.password
    + "&action=" + $action;
	return (q);
}


function goHome() {
	if (!IsLoggedIn()) {
		$.mobile.changePage('login.html');
	} else {
        $.mobile.changePage('home.html');

    }
}
    
function goProfile() {
	if (state.name == "") {
		$.mobile.changePage('login.html');
		return true;
	} else {
		$.mobile.changePage('profile.html');
	}	
}

function goUpdates() {
	if (state.name == "") {
		$.mobile.changePage('login.html');
		return true;
	} else {
		$.mobile.changePage('updates.html');
	}	
}

function goSettings() {
	if (state.name == "") {
		$.mobile.changePage('login.html');
		return true;
	} else {
		$.mobile.changePage('settings.html');
	}	
}

function goTours() {
	if (state.name == "") {
		$.mobile.changePage('login.html');
		return true;
	} else {
		$.mobile.changePage('tours.html');
	}	
}

function getStoredUser() {
	return(window.localStorage.getItem("User"));
}

function setStoredUser(user) {
	window.localStorage.setItem("User", user);
    
}
