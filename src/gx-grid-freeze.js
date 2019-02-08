function _classCallCheck(n, t) {
    if (!(n instanceof t)) throw new TypeError("Cannot call a class as a function");
}
var _createClass, WebGridExtension;
(function(n) {
    n.fn.tableHeadFixer = function(t) {
        function i() {
            function e() {
                var r = n(i.table),
                    t;
                i.head && (i.left > 0 && (t = r.find("thead tr"), t.each(function(t, r) {
                    u(r, function(t) {
                        n(t).css("z-index", i["z-index"] + 1)
                    })
                })), i.right > 0 && (t = r.find("thead tr"), t.each(function(t, r) {
                    f(r, function(t) {
                        n(t).css("z-index", i["z-index"] + 1)
                    })
                })));
                i.foot && (i.left > 0 && (t = r.find("tfoot tr"), t.each(function(t, r) {
                    u(r, function(t) {
                        n(t).css("z-index", i["z-index"])
                    })
                })), i.right > 0 && (t = r.find("tfoot tr"), t.each(function(t, r) {
                    f(r, function(t) {
                        n(t).css("z-index", i["z-index"])
                    })
                })))
            }

            function o() {
                var t = n(i.parent),
                    r = n(i.table);
                t.append(r);
                t.css({
                    "overflow-x": "auto",
                    "overflow-y": "auto"
                });
                t.scroll(function() {
                    var u = t[0].scrollWidth,
                        f = t[0].clientWidth,
                        e = t[0].scrollHeight,
                        o = t[0].clientHeight,
                        n = t.scrollTop(),
                        r = t.scrollLeft();
                    i.head && this.find("thead tr > *").css("top", n);
                    i.foot && this.find("tfoot tr > *").css("bottom", e - o - n);
                    i.left > 0 && i.leftColumns.css("left", r);
                    i.right > 0 && i.rightColumns.css("right", u - f - r)
                }.bind(r))
            }

            function s() {
                var t = n(i.table).find("thead"),
                    f = t.find("tr"),
                    u = t.find("tr > *");
                r(u);
                u.css({
                    position: "relative"
                })
            }

            function h() {
                var t = n(i.table).find("tfoot"),
                    f = t.find("tr"),
                    u = t.find("tr > *");
                r(u);
                u.css({
                    position: "relative"
                })
            }

            function c() {
                var e = n(i.table),
                    t, f;
                i.leftColumns = n();
                t = e.find("tr");
                t.each(function(n, t) {
                    u(t, function(n) {
                        i.leftColumns = i.leftColumns.add(n)
                    })
                });
                f = i.leftColumns;
                f.each(function(t, i) {
                    var i = n(i);
                    r(i);
                    i.css({
                        position: "relative"
                    })
                })
            }

            function l() {
                var t = n(i.table),
                    s = i.right,
                    f;
                i.rightColumns = n();
                var e = t.find("thead").find("tr"),
                    o = t.find("tbody").find("tr"),
                    u = null;
                e.each(function(n, t) {
                    a(t, function(t) {
                        n === 0 && (u = t);
                        i.rightColumns = i.rightColumns.add(u)
                    })
                });
                o.each(function(n, t) {
                    v(t, function(n) {
                        i.rightColumns = i.rightColumns.add(n)
                    })
                });
                f = i.rightColumns;
                f.each(function(t, i) {
                    var i = n(i);
                    r(i);
                    i.css({
                        position: "relative"//,
                        //"z-index": "9999"
                    })
                })
            }

            function r(t) {
                t.each(function(t, i) {
                    var i = n(i),
                        e = n(i).parent(),
                        u = i.css("background-color"),
                        r, f;
                    u = u == "transparent" || u == "rgba(0, 0, 0, 0)" ? null : u;
                    r = e.css("background-color");
                    r = r == "transparent" || r == "rgba(0, 0, 0, 0)" ? null : r;
                    f = r ? r : "white";
                    f = u ? u : f;
                    i.css("background-color", f)
                })
            }

            function u(t, r) {
                for (var o = i.left, f = 1, u = 1; u <= o; u = u + f) {
                    var s = f > 1 ? u - 1 : u,
                        e = n(t).find("> *:nth-child(" + s + ")"),
                        h = e.prop("colspan");
                    e.cellPos().left < o && r(e);
                    f = h
                }
            }

            function f(t, r) {
                for (var o = i.right, f = 1, u = 1; u <= o; u = u + f) {
                    var s = f > 1 ? u - 1 : u,
                        e = n(t).find("> *:nth-last-child(" + s + ")"),
                        h = e.prop("colspan");
                    r(e);
                    f = h
                }
            }

            function a(t, r) {
                for (var o = i.right, f = 1, u = 1; u <= o; u = u + f) {
                    var s = f > 1 ? u - 1 : u,
                        e = n(t).find("> *:nth-last-child(" + s + ")"),
                        h = e.prop("colspan");
                    r(e);
                    f = h
                }
            }

            function v(t, r) {
                for (var o = i.right, f = 1, u = 1; u <= o; u = u + f) {
                    var s = f > 1 ? u - 1 : u,
                        e = n(t).find("> *:nth-last-child(" + s + ")"),
                        h = e.prop("colspan");
                    r(e);
                    f = h
                }
            }
            var i = n.extend({}, {
                head: !0,
                foot: !1,
                left: 0,
                right: 0,
                "z-index": 0
            }, t);
            i.table = this;
            i.parent = n(i.table).parent();
            o();
            i.head == !0 && s();
            i.foot == !0 && h();
            i.left > 0 && c();
            i.right > 0 && l();
            e();
            n(i.parent).trigger("scroll");
            n(window).resize(function() {
                n(i.parent).trigger("scroll")
            })
        }
        return this.each(function() {
            i.call(this)
        })
    }
})(jQuery),
function(n) {
    function t(t) {
        var i = [];
        t.children("tr").each(function(t, r) {
            n(r).children("td, th").each(function(r, u) {
                for (var h = n(u), e = h.attr("colspan") | 0, o = h.attr("rowspan") | 0, s, f, c, e = e ? e : 1, o = o ? o : 1; i[t] && i[t][r]; ++r);
                for (s = r; s < r + e; ++s)
                    for (f = t; f < t + o; ++f) i[f] || (i[f] = []), i[f][s] = !0;
                c = {
                    top: t,
                    left: r
                };
                h.data("cellPos", c)
            })
        })
    }
    n.fn.cellPos = function(n) {
        var i = this.first(),
            u = i.data("cellPos"),
            r;
        return (!u || n) && (r = i.closest("table, thead, tbody, tfoot"), t(r)), i.data("cellPos")
    }
}(jQuery);
_createClass = function() {
    function n(n, t) {
        for (var i, r = 0; r < t.length; r++) i = t[r], i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(n, i.key, i)
    }
    return function(t, i, r) {
        return i && n(t.prototype, i), r && n(t, r), t
    }
}();
WebGridExtension = function() {
    function n() {
        _classCallCheck(this, n)
    }
    return _createClass(n, null, [{
        key: "freezeColumnsAdvanced",
        value: function(n, t, i, r, u) {
            var s = gx.O.getGrid(n),
                h = "#" + s.gridName + "ContainerTbl",
                f = $("#" + s.gridName + "ContainerTbl"),
                e = f.closest("div"),
                o;
			e.width('auto');
            f.width(f.width());
            r && e.css({
                width: r
            });
            u && f.height() > u && e.css({
                height: u
            });
            e.css("overflow", "auto");
            f.tableHeadFixer({
                left: t,
                right: i
            });
            gx.runtimeTemplates || (o = f.css("backgroundColor"), o && $(h + " th").css("backgroundColor", o), $.each($(h + " th"), function(n, t) {
                var i = $(t);
                i.css("backgroundColor") && i.css("backgroundColor") != "rgba(0, 0, 0, 0)" || $(t).css("backgroundColor", "white")
            }));
			 
            gx.fx.obs.addObserver('grid.onafterrender', this, this.freezeColumnsAdvanced.closure(this, [n, t, i, r, u]), {single:true});
            
        }
    }, {
        key: "freezeColumns",
        value: function(n, t, i) {
            return this.freezeColumnsAdvanced(n, t, 0, i)
        }
    }]), n
}()
