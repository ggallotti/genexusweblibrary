
gx.extensions = {};
gx.extensions.web = (function ($) {
	return {
		initialize: function () {
			this.events.attach();
		},

		events: {
			attach: function () {
				gx.fx.obs.addObserver('popup.afterclose', this, gx.extensions.web.popup.onPopupClose);
				gx.fx.obs.addObserver('gx.onready', this, gx.extensions.web.webevents.onReady);
				gx.fx.obs.addObserver('gx.onunload', this, gx.extensions.web.webevents.onUnload);
				gx.fx.obs.addObserver('gx.onerror', this, gx.extensions.web.webevents.onError);
			}
		},

		dialogs: {
			showAlert: function (message) {
				alert(message);
			},
			showConfirm: function (message) {
				var response = confirm(message);
				gx.fx.obs.notify('gx.extensions.web.dialogs.onconfirmclosed', [response]);
			}
		},

		interop: {
			runJS: function (script) {
				eval(script);
			},
			logDebug: function (message) {
				console.log(message);
			},
			logError: function (message) {
				console.error(message);
			},

		},
		webevents: {
			onReady: function () {
				gx.fx.obs.notify('gx.extensions.web.webevents.onready');
			},
			onUnload: function () {
				gx.fx.obs.notify('gx.extensions.web.webevents.onunload');
			},
			onError: function () {}
		},
		history: {
			goBack: function () {
				window.history.back();
			},
			goForward: function () {
				window.history.forward();
			},
			pushState: function (resourceName) {
				var stateObj = {
					current: location.href,
					next: resourceName
				};
				history.pushState(stateObj, "", resourceName);
			},
			replaceState: function (resourceName) {
				var stateObj = {
					current: location.href,
					next: resourceName
				};
				history.replaceState(stateObj, "", resourceName);
			}
		},

		geolocation: {
			isSupported: function() {
				if ("geolocation" in navigator) {
					return true;
				  } else {
					console.log("Geolocation is not supported in this browser");
					return false;
				  }
			},

			onSuccess: function(position) {
				var crd = position.coords;
				var gxGeolocation = crd.latitude + "," + crd.longitude;
				var gxPosition = {Time: new Date(position.timestamp), Location: gxGeolocation, Heading: crd.heading, Speed: crd.speed, Precision: crd.accuracy};
				gx.fx.obs.notify('extensions.web.geolocation.onLocationChanged', [gxPosition]);
			},

			onError: function(err) {
				console.log(`ERROR(${err.code}): ${err.message}`);
				gx.fx.obs.notify('extensions.web.geolocation.onError', [err.code, err.message]);
			},

			requestLocation: function(options) {
				if (this.isSupported()) {
					if (options) {
						options.timeout = (!options.timeout)? 'Infinity': options.timeout;
					}
					navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options);
				}
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
				var specs = [],
				askFocus,
				targets = "",
				name = name || this.defaultWindowName;

				if (opts) {
					var ui = opts.Appearance || {},
					position = opts.Position || {},
					advanced = opts.Advanced || {}
					height = ui.Height,
					width = ui.Width,
					showToolbar = gx.lang.gxBoolean(ui.ShowToolBar),
					isResizable = gx.lang.gxBoolean(ui.Resizable),
					showMenuBar = gx.lang.gxBoolean(ui.ShowMenuBar),
					hideScrollBars = gx.lang.gxBoolean(ui.HideScrollBars),
					fitToScreen = gx.lang.gxBoolean(ui.FitToScreen),
					fullScreen = gx.lang.gxBoolean(ui.FullScreen),
					copyhistory = gx.lang.gxBoolean(advanced.CopyHistory),
					top = position.Top,
					left = position.Left,
					customPosition = position.CustomPosition;

					if (fitToScreen) {
						width = (screen.width - 25);
						height = (screen.height - 160);
					}

					function convert(value) {
						if (value == true || value == 1 || value == "1")
							return 'yes';
						else if (value == false || value == 0 || value == "0")
							return 'no';
						return value;
					}

					function addAttribute(property, value, defValue) {
						if ((defValue != value || typeof(defValue) == 'undefined') && property && property != "") {
							specs.push(property + "=" + convert(value));
						}
					}

					if (!gx.lang.emptyObject(width))
						addAttribute("width", width);
					if (!gx.lang.emptyObject(height))
						addAttribute("height", height);

					addAttribute("toolbar", showToolbar, false);
					addAttribute("location", showToolbar);
					addAttribute("menubar", showMenuBar, false);
					addAttribute("scrollbars", !hideScrollBars);
					addAttribute("resizable", isResizable);
					addAttribute("fullscreen", fullScreen, false);
					addAttribute("copyhistory", copyhistory, false);
					if (customPosition) {
						addAttribute("top", top);
						addAttribute("left", left);
					}
				}
				var win;
				if (gx.lang.emptyObject(targets) || targets.length == 0) {
					console.log("Opening window", url, name, specs.join(","))
					win = window.open(url, name, specs.join(","));
					win.onbeforeunload = function () {
						gx.fx.obs.notify('extensions.web.window.onclose', [name]);
					};
					this.openedWindows[name] = win;
					if (win && askFocus) {
						win.focus();
					}
				} else {
					var i = 0;
					for (i = 0; i < targets.length; i++) {
						win = window.open(targets[i].Target, name, specs.join(","));
					}
				}
			}
		},
		popup: {
			close: function () {
				gx.popup.getPopup().close([]);
			},
			resize: function (width, height) {},
			onPopupClose: function () {
				gx.fx.obs.notify('extensions.web.popup.onpopupclosed', [arguments[0].url.replace(".aspx", "")]);
			}
		}
	};
})(gx.$);

gx.extensions.web.initialize();
