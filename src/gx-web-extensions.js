
gx.extensions = {};
gx.extensions.web = (function ($) {
	return {
		initialize: function () {
			this.events.attach();
		},

		events: {
			attach: function () {
				var opts = { doNotDelete:true };
				gx.fx.obs.addObserver('popup.afterclose', this, gx.extensions.web.popup.onPopupClose, opts);
				gx.fx.obs.addObserver('gx.onready', this, gx.extensions.web.webevents.onReady, opts);
				gx.fx.obs.addObserver('gx.onunload', this, gx.extensions.web.webevents.onUnload, opts);
				gx.fx.obs.addObserver('gx.onerror', this, gx.extensions.web.webevents.onError, opts);				
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
				console.log('extensions.web ERROR', err.code, err.message);
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
		},

		util: {
			debounceNotifier: function () {
				gx.fx.obs.notify('gx.extensions.web.util.debounceevent', []);
			},

			debounce: function(wait) {
				this.debouncerFnc = this.debouncerFnc || this.debounceImpl.apply(this, [this.debounceNotifier, wait]);
				this.debouncerFnc();
			},

			debounceImpl: function(func, wait, immediate) {
				var timeout;
				return function() {
					var context = this, args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate) func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			}
		},

		timer: {
			installed: false,
			started: false,
			startedTime: false,
			interval: false,

			start: function (intervalTimeInMilliseconds) {
				if (!this.started) {
					this.started = true;
					this.startedTime = new Date();
					this.interval = setInterval(this.onTimeElapsed.closure(this, []), intervalTimeInMilliseconds);
					if (!this.installed) {
						gx.spa.addObserver('onnavigatestart', this, this.stop.closure(this));
					}
					this.installed = true;
				}
			},

			stop: function () {
				if (this.started) {
					clearInterval(this.interval);
					this.started = false;
				}
			},
			
			onTimeElapsed: function () {
				var elapsedTimeMilliseconds = (new Date().getTime() - this.startedTime.getTime());
				gx.fx.obs.notify('gx.extensions.web.timer.ontimeelapsed', [elapsedTimeMilliseconds]);
			}
		},

		notification: {
			defaultName: 'default',
			msgs: {},
			show: function (id, notificationInfo) {
				if (arguments.length === 2) {
					this.showRequest(id, notificationInfo)
				}
				else {
					var notificationInfo = {
						body : arguments[2] || '',
						title: arguments[1] || '',
						image: arguments[3] || ''
					};
					this.showRequest(arguments[0], notificationInfo);
				}
			},

			hide: function(id) {
				if (!("Notification" in window)) {
					return;
				}
				id = id || this.defaultName;
				var n = this.msgs[id];
				if (n) {
					n.close();
					delete this.msgs[id];
				}
			},

			requestPermission: function() {
				this.showRequest();
			},

			showRequest: function(id, notificationInfo) {
				id = id || this.defaultName;
				if (notificationInfo)
					notificationInfo = this.ensureNotificationInfo(notificationInfo);
				
				if (!("Notification" in window)) {
					console.log("This browser does not support desktop notifications");
				  }
				  else if (Notification.permission === "granted") {
					if (notificationInfo) {
						this.msgs[id] = new Notification(notificationInfo.title, notificationInfo);
					}
				  }
				  else if (Notification.permission !== "denied") {
					var msgsList = this.msgs;
					Notification.requestPermission().then(function (permission) {
						if (notificationInfo) {
							msgsList[id] = new Notification(notificationInfo.title, notificationInfo);
						}
						
						gx.fx.obs.notify('gx.extensions.web.notification.onrequestpermission', [permission]);
						
					});
				  }
				  else {
					  console.log("Notification permission is denied");
				  }
			},

			ensureNotificationInfo: function (notificationInfo) {
				var key, keys = Object.keys(notificationInfo);
				var n = keys.length;
				var newobj= {}
				while (n--) {
					key = keys[n];
					if (notificationInfo[key] !== '')
						newobj[key.charAt(0).toLowerCase() + key.slice(1)] = notificationInfo[key];
				}
				return newobj;
			}
		}
	};
})(gx.$);


gx.evt.onready(window, function () {gx.extensions.web.initialize();});

gx.extensions.web.initialize();