
gx.extensions = {};
gx.extensions.web = (function ($) {	
	return {		
		initialize: function() {
			this.events.attach();
		},
		
		events: {
			attach: function() {				
				gx.fx.obs.addObserver('popup.afterclose', this, gx.extensions.web.popup.onPopupClose);
				gx.fx.obs.addObserver('gx.onready', this, gx.extensions.web.webevents.onReady);
				gx.fx.obs.addObserver('gx.onunload', this, gx.extensions.web.webevents.onUnload);
				gx.fx.obs.addObserver('gx.onerror', this, gx.extensions.web.webevents.onError);
			}
		},
		
		dialogs: {
			showAlert: function(message) {
				alert(message);
			},
			showConfirm: function(message) {
				var response = confirm(message);
				gx.fx.obs.notify('gx.extensions.web.dialogs.onconfirmclosed', [response]);
			}
		},
		
		interop: {
			runJS: function(script) {
				eval(script);
			},
			logDebug: function(message) {
				console.log(message);
			},
			logError: function(message) {
				console.error(message);
			},
		
		},
		webevents: {
			onReady: function() {
				gx.fx.obs.notify('gx.extensions.web.webevents.onready');
			},
			onUnload: function() {
				gx.fx.obs.notify('gx.extensions.web.webevents.onunload');
			},
			onError: function() {
				
			}
		},
		history: {
				goBack: function() {
					window.history.back();
				},
				goForward: function() {
					window.history.forward();
				},
				pushState: function(resourceName) {
					var stateObj = { current: location.href, next: resourceName};
					history.pushState(stateObj, "", resourceName);
				},
				replaceState: function (resourceName) {
					var stateObj = { current: location.href, next: resourceName};
					history.replaceState(stateObj, "", resourceName);
				}
		},
		
		window: {
			defaultWindowName: 'gxWindowName',
			openedWindows: {},
			
			close: function (windowName) {
				windowName = windowName || this.defaultWindowName;
				var w = this.openedWindows[windowName];
				if (w) {
					w.close();
					delete this.openedWindows[windowName];
				}
			}, 
			
			open: function (url, name, opts) {		
				var specs = "",
					askFocus,
					targets = "",
					name = name || this.defaultWindowName;
										
				if (opts) {
					opts.Appearance = opts.Appearance || { ui: {}};
					opts.Advanced = opts.Advanced || {};
					opts.Position = opts.Position || {};
					var ui = opts.Appearance,
						height = ui.Height, 
						width = ui.Width,
						showToolbar = gx.lang.gxBoolean(ui.ShowToolBar),
						isResizable = gx.lang.gxBoolean(ui.Resizable),
						showMenuBar =  gx.lang.gxBoolean(ui.ShowMenuBar),
						hideScrollBars = gx.lang.gxBoolean(ui.HideScrollBars),
						fitToScreen = gx.lang.gxBoolean(ui.FitToScreen),
						fullScreen = gx.lang.gxBoolean(ui.Fullscreen),
						copyhistory = gx.lang.gxBoolean(opts.Advanced.CopyHistory),
						top = opts.Position.Top,
						left = opts.Position.Left,
						customPosition = opts.Position.CustomPosition;
						
													        	        
	        if (fitToScreen) {
	            width = (screen.width - 25);
	            height = (screen.height - 160);
	        }

	        function convert(value) { if (value == true || value == 1 || value == "1") return 'yes'; else if (value == false || value == 0 || value == "0") return 'no'; return value; }

	        function addAttribute(property, value, defValue) {
	            if ((defValue != value || typeof (defValue) == 'undefined') && property && property != "") {
	                return property + "=" + convert(value) + ",";
	            }
	            else return "";
	        }

	        if (!gx.lang.emptyObject(width))
	            specs += addAttribute("width", width);
	        if (!gx.lang.emptyObject(height))
	            specs += addAttribute("height", height);

	        specs += addAttribute("toolbar", showToolbar, true);
	        //specs += addAttribute("location", url, true);                
	        specs += addAttribute("menubar", showMenuBar, true);
	        specs += addAttribute("scrollbars", !hideScrollBars);
	        specs += addAttribute("resizable", isResizable);        
	        specs += addAttribute("fullscreen", fullScreen, false);
	        specs += addAttribute("copyhistory", copyhistory, false);
					if (customPosition){
						specs += addAttribute("top", top);
						specs += addAttribute("left", left);
					}
				}
        var win;
        if (gx.lang.emptyObject(targets) || targets.length == 0) {					
            win = window.open(url, name, specs);
						win.onbeforeunload = function ()
						{ 
							gx.fx.obs.notify('extensions.web.window.onclose', [name]);
						};
						this.openedWindows[name] = win;
            if (win && askFocus) {
							win.focus();
						}
        }
        else {
            var i = 0;
            for (i = 0; i < targets.length; i++) {
                win = window.open(targets[i].Target, name, specs);

            }
        }       			
		}
	},
	popup: {
		close: function () {
			gx.popup.getPopup().close([]);
		},
		resize: function (width, height) {
			
		},
		onPopupClose: function () {			
			gx.fx.obs.notify('extensions.web.popup.onpopupclosed', [arguments[0].url.replace(".aspx", "")]);
		}
	}
	};
})(gx.$);

gx.extensions.web.initialize();
