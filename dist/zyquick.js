<<<<<<< HEAD:dist/ngquick.js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	!function () {
	    "use strict";
	    function ensure(obj, name) {
	        return name ? obj ? obj[name] ? obj[name] : obj : {} : obj;
	    }

	    function ensureObjStr(obj, str) {
	        if (!obj || !str) return obj;
	        str = str.split(".");
	        for (var i = 0, l = str.length; l > i; i++) obj[str[i]] && (obj = obj[str[i]]);
	        return obj;
	    }

	    function ensureArray(obj, arrayName) {
	        if (obj) {
	            for (var newObj = obj, newName = "", i = 0, l = arrayName.length; l > i; i++) {
	                var temp = ensure(newObj, arrayName[i]);
	                if (!temp) break;
	                newObj = temp;
	                0 != i && (newName += ".");
	                newName += arrayName[i];
	            }
	            return {
	                newObj: newObj,
	                level: i,
	                newName: newName
	            };
	        }
	    }

	    function spliceDot(dotString) {
	        return dotString.split(".");
	    }

	    function extendDeep(dst) {
	        angular.forEach(arguments, function (obj) {
	            obj !== dst && angular.forEach(obj, function (value, key) {
	                angular.isObject(dst[key]) || angular.isArray(dst[key]) ? extendDeep(dst[key], value) : dst[key] = angular.copy(value);
	            });
	        });
	        return dst;
	    }

	    function ReplaceFirstUpper(str) {
	        str = str.toLowerCase();
	        return str.replace(convertUpperPattern, function (m) {
	            return m.toUpperCase();
	        });
	    }

	    function pollingService(env, $http, $q) {
	        return {
	            polling: function (params) {
	                params.close = function () {
	                    clearInterval(params.timer);
	                    clearInterval(params.timer2);
	                };
	                params.pollingRunning = function () {
	                    var deferred = $q.defer();
	                    $http.get(env.prefix + params.url).then(function (response) {
	                        params.funTrue(response.data) ? deferred.resolve(response.data) : deferred.notify(response.data);
	                    }, function (response) {
	                        deferred.reject(response);
	                    });
	                    return deferred.promise;
	                };
	                params.timer = setInterval(function () {
	                    params.pollingRunning().then(function (resolve) {
	                        params.close();
	                        params.resFun(resolve);
	                    }, function (rejected) {
	                        params.close();
	                        params.rejFun(rejected);
	                    }, function (notify) {
	                        params.notFun(notify);
	                    });
	                }, params.interval);
	                params.max && (params.timer2 = setInterval(function () {
	                    close();
	                }, params.max));
	            }
	        };
	    }

	    function StringToDate(DateStr) {
	        var converted = Date.parse(DateStr), myDate = new Date(converted);
	        if (isNaN(myDate)) {
	            var arrays = DateStr.split("-");
	            myDate = new Date(arrays[0], --arrays[1], arrays[2]);
	        }
	        return myDate;
	    }

	    function checkType(key, value) {
	        var result;
	        if (angular.isDate(value)) return "date";
	        try {
	            intPattern.test(value) ? result = parseInt(value) : floatPattern.test(value) && (result = parseFloat(value));
	        } catch (e) {
	        }
	        return angular.isNumber(result) ? /^1[3|5|7|8] \d{9}$/.test(result) ? "phone" : /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(result) ? "id" : /^\d{4}$/.test(result) ? "number" : "text" : -1 != key.toLowerCase().indexOf("date") || -1 != key.toLowerCase().indexOf("time") || datePattern.test(result) || angular.isDate(result) ? "date" : "text";
	    }

	    function searchPageInit(pageObj) {
	        pageObj = pageObj ? pageObj : {};
	        pageObj[Exp.current] = 1;
	        pageObj[Exp.current_start] = 1;
	        pageObj[Exp.size] = 5;
	        return pageObj;
	    }

	    function pagingObj() {
	        return {
	            restrict: "E",
	            replace: !1,
	            require: ["?^tables"],
	            link: function (scope, element, attrs, ctrl) {
	                ctrl[0] && angular.isFunction(ctrl[0].setPaging) && ctrl[0].setPaging(element);
	            }
	        };
	    }

	    function searchObj() {
	        return {
	            restrict: "E",
	            replace: !1,
	            require: ["?^tables"],
	            link: function (scope, element, attrs, ctrl) {
	                ctrl[0] && angular.isFunction(ctrl[0].setSearchObj) && ctrl[0].setSearchObj(element);
	            }
	        };
	    }

	    function submitDirect() {
	        return {
	            restrict: "A",
	            require: ["^forms"],
	            link: commit
	        };
	    }

	    function cacheProvider() {
	        var $$cacheStatusPlaceholder = {
	            orderType: [],
	            tagCreateInvoiceType: ["int", "date"]
	        };
	        this.setOptions = function (options) {
	            cp($$cacheStatusPlaceholder, options);
	        };
	        this.$get = function () {
	            return {
	                setCache: function (newData) {
	                    $$cacheStatusPlaceholder = newData;
	                },
	                getOrderType: function () {
	                    return $$cacheStatusPlaceholder.orderType;
	                }
	            };
	        };
	    }

	    function validationProvider() {
	        var validProviderOptions = {};
	        this.setConfiguration = function (options) {
	            cp(validProviderOptions, options);
	        };
	        this.$get = ["$timeout", "ngMessenger", "env", "$resource", function ($timeout, ngMessenger, env, $resource) {
	            return {
	                valid: function (config) {
	                    angular.isArray(config) || (config = [config]);
	                    for (var i = 0, obj = config, l = obj.length; l > i; i++) {
	                        config = obj[i];
	                        config.scope.timer = config.scope.$watch(config.model, function (newVal, oldVal) {
	                            if (newVal.length > 0) {
	                                config.cannot && !config.cannot.test(newVal) && eval("config.scope." + config.model + "=oldVal");
	                                if (config.url) $resource(env.prefix + config.url).get(newVal).$promise.then(function (result) {
	                                    config.success && angular.isFunction(config.success) && config.success();
	                                }, function (i) {
	                                    config.error && angular.isFunction(config.error) && config.error();
	                                    config.message && ngMessenger.displayErrorMessage(config.message);
	                                }); else {
	                                    config.todo && (config.bool = config.todo.test(newVal));
	                                    config.bool && config.success && angular.isFunction(config.success) && config.success();
	                                    !config.bool && config.error && angular.isFunction(config.error) && config.error();
	                                    !config.bool && config.message && ngMessenger.displayErrorMessage(config.message);
	                                }
	                            }
	                        }, !0);
	                        config.scope.$on("destroy", function () {
	                            config.scope.timer && (config.scope.timer = null);
	                        });
	                    }
	                }
	            };
	        }];
	    }

	    function inspirationData(data) {
	        if (angular.isArray(data) && data.length > 0) for (var i = 0, l = data.length; l > i; i++) _.forEach(data[i], function (value, key) {
	            (key.toLowerCase().indexOf("time") > 0 || key.toLowerCase().indexOf("date") > 0) && (data[i][key] = new Date(data[i][key]).toLocaleDateString() + new Date(data[i][key]).toLocaleTimeString());
	        });
	        return data;
	    }

	    function dynamicPart() {
	        return {
	            restrict: "E",
	            replace: !1,
	            scope: {
	                template: "="
	            }
	        };
	    }

	    var moduleName = "ngtables", Exp = {
	        current: "current",
	        size: "_limit",
	        current_start: "_start",
	        current_end: "_end",
	        total: "total",
	        range: "range",
	        limit_end: "limit_end"
	    }, INTEGER_REGEXP = /^\-?\d*$/, convertUpperPattern = /\b(\w)|\s(\w)/g, floatPattern = /^\d+(\.\d+)?$/, intPattern = /^[0-9]*$/, EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, datePattern = /^(\d{4})\.(0?[1-9]|1[0-2])\.((0?[1-9])|((1|2)[0-9])|30|31)$/;
	    pollingService.$inject = ["env", "$http", "$q"];
	    var pendingCtrl = ["$scope", "$resource", "$element", "$attrs", "$transclude", "$http", "$q", function ($scope, $resource, $element, $attrs, $transclude, $http, $q) {
	        this.start = function () {
	        };
	    }], pendingDirect = ["$resource", "$compile", "env", function ($resource, $compile, env) {
	        return {
	            restrict: "E",
	            replace: !1,
	            scope: {
	                requestUrl: "=",
	                processUrl: "=",
	                timeout: "=",
	                interval: "="
	            },
	            template: "",
	            require: ["polling"],
	            controller: pendingCtrl,
	            link: function (scope, element, attrs, ctrl) {
	            }
	        };
	    }], postLinkStart = function (scope, element, attr, ctrl) {
	        element.bind("click", function () {
	            ctrl[0].start();
	        });
	    }, startPending = ["$resource", "$compile", "env", function ($resource, $compile, env) {
	        return {
	            restrict: "A",
	            require: ["^polling"],
	            link: postLinkStart
	        };
	    }], commit = function (scope, element, attr, ctrl) {
	        element.bind("click", function () {
	            ctrl[0].send();
	        });
	    }, cp = angular.extend, copy = angular.copy, formsDirect = ["$resource", "$compile", "env", "ngMessenger", function ($resource, $compile, env, ngMessenger) {
	        return {
	            restrict: "E",
	            replace: !1,
	            scope: {
	                data: "=",
	                action: "=",
	                url: "@",
	                durl: "@",
	                query: "=",
	                key: "@",
	                validConfig: "="
	            },
	            require: ["forms"],
	            link: function (scope, element, attrs, ctrl) {
	                var action = cp(cp({}, scope.action), scope);
	                action && action.validConfig && _.forEach(scope.action.validConfig, function (config, key) {
	                    scope.$watch("data." + key, function (newVal, oldVal) {
	                        config.replacePattren.test(newVal) ? config.keyObj = newVal : config.keyObj = oldVal;
	                        if (config.url) $resource(env.prefix + config.url).get(newVal).$promise.then(function (result) {
	                            config.success && angular.isFunction(config.success) && config.success();
	                        }, function (i) {
	                            config.error && angular.isFunction(config.error) && config.error();
	                            config.message && ngMessenger.displayErrorMessage(config.message);
	                        }); else {
	                            config.bool = config.pattren.test(newVal);
	                            config.bool && config.success && angular.isFunction(config.success) && config.success();
	                            !config.bool && config.error && angular.isFunction(config.error) && config.error();
	                            !config.bool && config.message && ngMessenger.displayErrorMessage(config.message);
	                        }
	                        scope.data[key] = config.keyObj;
	                    });
	                });
	                action.durl && $resource(env.prefix + action.durl).get(action.query).$promise.then(function (result) {
	                    scope.data = scope.key ? ensureArray(result, spliceDot(scope.key)).newObj : result;
	                    ctrl[0].setData(scope.data);
	                }, function (i) {
	                    action.error && angular.isFunction(action.error) && action.error();
	                });
	                ctrl[0].setAction(action);
	                ctrl[0].setData(scope.data);
	                ctrl[0].linkElement(element);
	            },
	            controller: function ($scope, $resource, $element, $attrs, $transclude) {
	                this.iterator = {};
	                this.data = {};
	                this.action = {};
	                this.linked = {};
	                this.urlRestPattern = {};
	                this.manageMenter = {};
	                this.send = function () {
	                    var act = this.action;
	                    "PUT" == act.method ? $resource(env.prefix + this.action.url, null, {
	                        update: {
	                            method: "PUT"
	                        }
	                    }).update(this.data).$promise.then(function (result) {
	                            act.success && angular.isFunction(act.success) && act.success(result);
	                        }, function (error) {
	                            error && act.error && angular.isFunction(act.error) && act.error(error);
	                        }) : "GET" == act.method ? $resource(env.prefix + this.action.url).get(this.data).$promise.then(function (result) {
	                        act.success && angular.isFunction(act.success) && act.success(result);
	                    }, function (error) {
	                        error && act.error && angular.isFunction(act.error) && act.error(error);
	                    }) : $resource(env.prefix + this.action.url).save(this.data).$promise.then(function (result) {
	                        act.success && angular.isFunction(act.success) && act.success(result);
	                    }, function (error) {
	                        error && act.error && angular.isFunction(act.error) && act.error(error);
	                    });
	                };
	                this.setUrlRestPattern = function (d) {
	                    this.urlRestPattern = d;
	                };
	                this.setData = function (d) {
	                    this.data = d;
	                };
	                this.setAction = function (e) {
	                    this.action = e;
	                };
	                this.errorMessage = function (a) {
	                    this.iterator = cp(this.iterator, a);
	                    return this.iterator;
	                };
	                this.getMessage = function () {
	                    return this.iterator;
	                };
	                this.linkElement = function (ele) {
	                    this.linked = ele;
	                };
	            }
	        };
	    }], scopeFilter = ["$scope", "$resource", "$element", "$attrs", "$transclude", function ($scope, $resource, $element, $attrs, $transclude) {
	        $scope.$on("$destroy", function () {
	            if (this !== null) {
	                delete this.searchObj;
	                delete this.tle;
	                delete this.paging;
	            }
	        });
	        this.setSearchObj = function (e) {
	            this.searchObj = this.searchObj || {};
	            this.searchObj[$scope.dataName] = e;
	        };
	        this.getSearchObj = function () {
	            return this.searchObj && this.searchObj[$scope.dataName];
	        };
	        this.setTle = function (e) {
	            this.tle = this.tle || {};
	            this.tle = e;
	        };
	        this.getTle = function () {
	            return this.tle;
	        };
	        this.setPaging = function (e) {
	            this.paging = this.paging || {};
	            this.paging[$scope.dataName] = e;
	        };
	        this.getPaging = function () {
	            return this.paging && this.paging[$scope.dataName];
	        };
	    }], i18n_cn_zh = {
	        query: "查询",
	        number: "选择数量"
	    }, tablesDirect = ["$resource", "$compile", "env", "$timeout", function ($resource, $compile, env, $timeout) {
	        return {
	            restrict: "E",
	            replace: !1,
	            scope: {
	                data: "=",
	                action: "=",
	                url: "@",
	                key: "@",
	                tle: "=",
	                dataName: "@data",
	                plugin: "=",
	                urlRest: "=",
	                multiSelect: "=",
	                multiSelectNum: "="
	            },
	            priority: 100,
	            require: ["tables"],
	            compile: function (element, attrs, transclude, ctrl) {
	                var ele = element[0], template = "", table = "<table class='" + attrs["class"] + "'  cellspacing='" + attrs.cellspacing + "'>";
	                template = table + template + "</table>";
	                for (var i = 0, l = ele.classList.length; l > i; i++) element.removeClass(ele.classList[0]);
	                var temp = element.html().trim(), pg = "<paging";
	                if (-1 != temp.indexOf(pg)) {
	                    temp = element.html().replace(pg, template + pg);
	                    element.html("").append(temp);
	                } else element.append(template);
	                return {
	                    pre: function (scope, element, attrs, ctrl) {
	                        function signMark(ele) {
	                            return !angular.equals(sign, ele) && !!(sign = copy(ele));
	                        }

	                        function convertShadowShow(result) {
	                            scope.data = ensureArray(result, spliceDot(scope.key)).newObj;
	                            if (scope.data && scope.data.length > 0) {
	                                scope.show = scope.data;
	                                scope.show = inspirationData(scope.show);
	                                scope.review = result;
	                                return scope.show;
	                            }
	                        }

	                        function renderVisualReal(result) {
	                            convertShadowShow(result);
	                            if (scope.show && !(scope.show && scope.show.length < 1)) {
	                                if (ctrl[0] && angular.isFunction(ctrl[0].getSearchObj) && ctrl[0].getSearchObj()) {
	                                    template = "<div class='row'>";
	                                    _.forEach(scope.tle, function (value, key) {
	                                        if (scope.show) {
	                                            var type = checkType(key, scope.show);
	                                            if ("date" == type) {
	                                                template += "<label style='width:100px'>" + value + "</label><input type='" + type + "' class='calender form-control'   style='width:200px;display: inline;padding:0px;height:28px;margin:6px;' ng-model='query.start" + ReplaceFirstUpper(key) + "' />";
	                                                template += "   -   <input type='" + type + "' class='calender form-control' style='width:200px;display: inline;padding:0px;height:28px;margin:6px;'   ng-model='query.end" + ReplaceFirstUpper(key) + "' />";
	                                            } else if ("number" == type) if (scope.config && scope.config.range) {
	                                                template += "<label style='width:100px'>" + value + "</label><input  type='" + type + "' class='form-control'  style='width:150px;display:inline;padding:0px;height:28px;margin:6px;'  ng-model='query.min" + ReplaceFirstUpper(key) + "' />";
	                                                template += "   -   <input  type='" + type + "'  class='form-control'  style='width:150px;display: inline;padding:0px;height:28px;margin:6px;'  ng-model='query.max" + ReplaceFirstUpper(key) + "' />";
	                                            } else template += "<label style='width:100px'>" + value + "</label><input  type='" + type + "'  class='form-control'  style='width:200px;display: inline;padding:0px;height:28px;margin:6px;'  ng-model='query." + key + "' />"; else template += "<label style='width:100px'>" + value + "</label><input class='form-control' style='width:200px;display: inline;padding:0px;height:28px;margin:6px;' type='" + type + "' ng-model='query." + key + "' />";
	                                            template += "<br/>";
	                                        }
	                                    });
	                                    template += "<span class=\"jumpsure\" ng-click='doQuery()'>" + i18n_cn_zh.query + "</span>";
	                                    var search = "</search>";
	                                    origin = origin.replace(search, template + search);
	                                }
	                                if (ctrl[0] && angular.isFunction(ctrl[0].getPaging) && ctrl[0].getPaging()) {
	                                    scope.config = {};
	                                    scope.config[Exp.current_start] = result[Exp.current_start] ? result[Exp.current_start] : 1;
	                                    scope.config[Exp.total] = result[Exp.total] ? result[Exp.total] : 5;
	                                    scope.config[Exp.size] = result[Exp.size] ? result[Exp.size] : 5;
	                                    scope.config[Exp.current] = scope.config[Exp.current_start] && scope.config[Exp.size] ? scope.config[Exp.current_start] / scope.config[Exp.size] : 1;
	                                    scope.config[Exp.current] = scope.config[Exp.current] >= 1 ? scope.config[Exp.current] : 1;
	                                    var start = "<div style='text-align: center'>", over = "</div>", current = "<span ng-bind='config." + Exp.current + "'></span>", first = ("" + scope.config[Exp.total],
	                                    "" + scope.config[Exp.size], "<span class=\"jumpsure\" ng-click='pagingFirst()'>|<</span>"), previous = "<span class=\"jumpsure\" ng-click='pagingPrevious()'><</span>", next = "<span class=\"jumpsure\"   ng-click='pagingNext()'>></span>", nextBig = "<span class=\"jumpsure\" ng-click='pagingBigNext()'>>></span>", pagingContent = start + first + previous + current + next + nextBig + over, paging = (ctrl[0].getPaging(),
	                                        "</paging>");
	                                    origin = origin.replace(paging, pagingContent + paging);
	                                    scope.doQuery = function () {
	                                        var query = {};
	                                        scope.config[Exp.current_start] = scope.config[Exp.size] && scope.config[Exp.current] ? 1 + scope.config[Exp.size] * (scope.config[Exp.current] - 1) : 1;
	                                        query[Exp.current_start] = scope.config[Exp.current_start];
	                                        query[Exp.size] = scope.config[Exp.size];
	                                        scope.query = scope.query || {};
	                                        var anythingChanged = signMark(cp(scope.query, {}));
	                                        if (anythingChanged) {
	                                            cp(query, scope.query);
	                                            query = searchPageInit(query);
	                                            scope.config[Exp.current_start] = 1;
	                                            scope.config[Exp.current] = 1;
	                                        } else cp(query, scope.query);
	                                        scope.urlRest && cp(query, scope.urlRest);
	                                        $resource(env.prefix + action.url).get(query).$promise.then(function (result) {
	                                            action.success && action.success(result);
	                                            convertShadowShow(result);
	                                            result = result["data"];
	                                            scope.config[Exp.size] = result[Exp.size] ? result[Exp.size] : scope.config[Exp.size];
	                                            scope.config[Exp.total] = result[Exp.total] ? result[Exp.total] : scope.config[Exp.total];
	                                            scope.config[Exp.current_start] = result[Exp.current_start] ? result[Exp.current_start] : scope.config[Exp.current_start];
	                                            scope.config[Exp.current_end] = scope.config[Exp.current_start] + scope.config[Exp.size];
	                                            scope.config[Exp.limit_end] = scope.config[Exp.total] - scope.config[Exp.limit_end];
	                                        }, function (thor) {
	                                            action.error && action.error(thor);
	                                        });
	                                    };
	                                    scope.pagingFirst = function () {
	                                        scope.config[Exp.current] = 1;
	                                        scope.doQuery();
	                                    };
	                                    scope.pagingPrevious = function () {
	                                        scope.config[Exp.current] = scope.config[Exp.current] && scope.config[Exp.current] > 1 ? --scope.config[Exp.current] : 1;
	                                        scope.doQuery();
	                                    };
	                                    scope.pagingNext = function () {
	                                        if (scope.config[Exp.current]) {
	                                            scope.config[Exp.current]++;
	                                            scope.doQuery();
	                                        }
	                                    };
	                                    scope.pagingBigNext = function () {
	                                        if (scope.config[Exp.current]) {
	                                            scope.config[Exp.current] += 10;
	                                            scope.doQuery();
	                                        }
	                                    };
	                                }
	                                element.html("").append($compile(origin)(scope));
	                            }
	                        }

	                        var sign = {};
	                        if (ensure(scope.data, scope.key)) {
	                            ctrl[0].setTle(scope.tle);
	                            if (scope.tle) {
	                                var titleList = [], head = "<thead><tr>";
	                                scope.data = scope.data ? scope.data : {};
	                                var body = '<tbody><tr ng-repeat="obj in show ">';
	                                if (attrs.multiSelect) {
	                                    scope.multiSelect = scope.multiSelect || {};
	                                    head += '<th width="8%"><input type="checkbox" ng-model="isCheckAll" ng-change="checkAll()"/>全选</th>';
	                                    body += '<td><div class="checkbox"><label><input type="checkbox" ng-model="obj.isChecked" ng-change="checkLabel()"></label></div></td>';
	                                    scope.checkLabel = function (idx) {
	                                        scope.multiSelect = [];
	                                        scope.multiSelectNum = [];
	                                        _.map(scope.show, function (o) {
	                                            !o.isChecked || scope.multiSelect.push(o);
	                                            o.quantity ? scope.multiSelectNum.push(o.quantity) : o.quantity = 1;
	                                        });
	                                    };
	                                    var choseAll = !1;
	                                    scope.checkAll = function () {
	                                        choseAll = !choseAll;
	                                        _.map(scope.show, function (o) {
	                                            o.isChecked = choseAll;
	                                        });
	                                        scope.checkLabel();
	                                    };
	                                    if (attrs.hasOwnProperty("multiSelectNum")) {
	                                        head += '<th width="15%">' + i18n_cn_zh.number + "</th>";
	                                        body += '<td><input type="button" ng-click="subtractQuantity($index)" class=\'btn btn-default\' style=\'padding:1px\' value="-"/>';
	                                        body += '<input type="text" class="shuliang showcartnum change" ng-model="show[$index].quantity" ng-maxlength="6" style="width:50px;" ng-keyup="inputLabel($index)" />';
	                                        body += '<input type="button" ng-click="addQuantity($index)" class=\'btn btn-default\'  style=\'padding:1px\' value="+"/> </td>';
	                                        scope.subtractQuantity = function (idx) {
	                                            scope.show[idx].isChecked = !0;
	                                            scope.show[idx].quantity = scope.show[idx].quantity - 1 > 0 ? scope.show[idx].quantity - 1 : 1;
	                                            scope.checkLabel();
	                                        };
	                                        scope.inputLabel = function (idx) {
	                                            scope.show[idx].isChecked = !0;
	                                            scope.checkLabel();
	                                        };
	                                        scope.addQuantity = function (idx) {
	                                            scope.show[idx].isChecked = !0;
	                                            if (!(scope.show[idx].quantity >= 999999)) {
	                                                scope.show[idx].quantity = ++scope.show[idx].quantity || 1;
	                                                scope.checkLabel();
	                                            }
	                                        };
	                                    }
	                                }
	                                _.forEach(scope.tle, function (value, key) {
	                                    titleList.push(key);
	                                    head += "<th>" + value + "</th>";
	                                    body += "<td ng-bind='obj." + key + "'></td>";
	                                });
	                                if (scope.plugin && scope.plugin.title && scope.plugin.surprise) {
	                                    head += "<th>" + scope.plugin.title + "</th>";
	                                    body += "<td><button class='btn btn-default' ng-click=\"surpriseFun($index)\">" + scope.plugin.title + "</button></td>";
	                                    scope.surpriseFun = function (index) {
	                                        scope.plugin.surprise(index);
	                                    };
	                                }
	                                head += "</tr></thead>";
	                                body += "</tr></tbody>";
	                                var template = head + body, e = "</table>", origin = element.html().replace(e, template + e);
	                            }
	                            var action = cp(cp({}, scope.action), scope);
	                            if (action.url) {
	                                var query = {};
	                                query[Exp.current_start] = 1;
	                                query[Exp.size] = 5;
	                                scope.urlRest && cp(query, scope.urlRest);
	                                $resource(env.prefix + action.url).get(query).$promise.then(function (result) {
	                                    action.success && action.success(result);
	                                    renderVisualReal(result);
	                                }, function (thor) {
	                                    action.error && action.error(thor);
	                                });
	                            }
	                        }
	                    }
	                };
	            },
	            post: function (scope, element, attrs, ctrl) {
	            },
	            controller: scopeFilter
	        };
	    }];
	    angular.module(moduleName,[]).provider({
	        $tableInterpreter: cacheProvider
	    }).provider({
	        validation: validationProvider
	    }).factory({
	        pollingService: pollingService
	    }).directive({
	        tables: tablesDirect
	    }).directive({
	        paging: pagingObj
	    }).directive({
	        search: searchObj
	    }).directive({
	        forms: formsDirect
	    }).directive({
	        submit: submitDirect
	    }).directive({
	        polling: pendingDirect
	    }).directive({
	        startPolling: startPending
	    }).directive({
	        dynamicPart: dynamicPart
	    }).run(["$templateCache", function ($templateCache) {
	    }]);
	}();

/***/ }
/******/ ]);
=======
!function () {
    "use strict";
    function ensure(obj, name) {
        return name ? obj ? obj[name] ? obj[name] : obj : {} : obj;
    }

    function ensureObjStr(obj, str) {
        if (!obj || !str) return obj;
        str = str.split(".");
        for (var i = 0, l = str.length; l > i; i++) obj[str[i]] && (obj = obj[str[i]]);
        return obj;
    }

    function ensureArray(obj, arrayName) {
        if (obj) {
            for (var newObj = obj, newName = "", i = 0, l = arrayName.length; l > i; i++) {
                var temp = ensure(newObj, arrayName[i]);
                if (!temp) break;
                newObj = temp;
                0 != i && (newName += ".");
                newName += arrayName[i];
            }
            return {
                newObj: newObj,
                level: i,
                newName: newName
            };
        }
    }

    function spliceDot(dotString) {
        return dotString.split(".");
    }

    function extendDeep(dst) {
        angular.forEach(arguments, function (obj) {
            obj !== dst && angular.forEach(obj, function (value, key) {
                angular.isObject(dst[key]) || angular.isArray(dst[key]) ? extendDeep(dst[key], value) : dst[key] = angular.copy(value);
            });
        });
        return dst;
    }

    function ReplaceFirstUpper(str) {
        str = str.toLowerCase();
        return str.replace(convertUpperPattern, function (m) {
            return m.toUpperCase();
        });
    }

    function pollingService(env, $http, $q) {
        return {
            polling: function (params) {
                params.close = function () {
                    clearInterval(params.timer);
                    clearInterval(params.timer2);
                };
                params.pollingRunning = function () {
                    var deferred = $q.defer();
                    $http.get(env.prefix + params.url).then(function (response) {
                        params.funTrue(response.data) ? deferred.resolve(response.data) : deferred.notify(response.data);
                    }, function (response) {
                        deferred.reject(response);
                    });
                    return deferred.promise;
                };
                params.timer = setInterval(function () {
                    params.pollingRunning().then(function (resolve) {
                        params.close();
                        params.resFun(resolve);
                    }, function (rejected) {
                        params.close();
                        params.rejFun(rejected);
                    }, function (notify) {
                        params.notFun(notify);
                    });
                }, params.interval);
                params.max && (params.timer2 = setInterval(function () {
                    close();
                }, params.max));
            }
        };
    }

    function StringToDate(DateStr) {
        var converted = Date.parse(DateStr), myDate = new Date(converted);
        if (isNaN(myDate)) {
            var arrays = DateStr.split("-");
            myDate = new Date(arrays[0], --arrays[1], arrays[2]);
        }
        return myDate;
    }

    function checkType(key, value) {
        var result;
        if (angular.isDate(value)) return "date";
        try {
            intPattern.test(value) ? result = parseInt(value) : floatPattern.test(value) && (result = parseFloat(value));
        } catch (e) {
        }
        return angular.isNumber(result) ? /^1[3|5|7|8] \d{9}$/.test(result) ? "phone" : /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(result) ? "id" : /^\d{4}$/.test(result) ? "number" : "text" : -1 != key.toLowerCase().indexOf("date") || -1 != key.toLowerCase().indexOf("time") || datePattern.test(result) || angular.isDate(result) ? "date" : "text";
    }

    function searchPageInit(pageObj) {
        pageObj = pageObj ? pageObj : {};
        pageObj[Exp.current] = 1;
        pageObj[Exp.current_start] = 1;
        pageObj[Exp.size] = 5;
        return pageObj;
    }

    function pagingObj() {
        return {
            restrict: "E",
            replace: !1,
            require: ["?^tables"],
            link: function (scope, element, attrs, ctrl) {
                ctrl[0] && angular.isFunction(ctrl[0].setPaging) && ctrl[0].setPaging(element);
            }
        };
    }

    function searchObj() {
        return {
            restrict: "E",
            replace: !1,
            require: ["?^tables"],
            link: function (scope, element, attrs, ctrl) {
                ctrl[0] && angular.isFunction(ctrl[0].setSearchObj) && ctrl[0].setSearchObj(element);
            }
        };
    }

    function submitDirect() {
        return {
            restrict: "A",
            require: ["^forms"],
            link: commit
        };
    }

    function cacheProvider() {
        var $$cacheStatusPlaceholder = {
            orderType: [],
            tagCreateInvoiceType: ["int", "date"]
        };
        this.setOptions = function (options) {
            cp($$cacheStatusPlaceholder, options);
        };
        this.$get = function () {
            return {
                setCache: function (newData) {
                    $$cacheStatusPlaceholder = newData;
                },
                getOrderType: function () {
                    return $$cacheStatusPlaceholder.orderType;
                }
            };
        };
    }

    function validationProvider() {
        var validProviderOptions = {};
        this.setConfiguration = function (options) {
            cp(validProviderOptions, options);
        };
        this.$get = ["$timeout", "ngMessenger", "env", "$resource", function ($timeout, ngMessenger, env, $resource) {
            return {
                valid: function (config) {
                    angular.isArray(config) || (config = [config]);
                    for (var i = 0, obj = config, l = obj.length; l > i; i++) {
                        config = obj[i];
                        config.scope.timer = config.scope.$watch(config.model, function (newVal, oldVal) {
                            if (newVal.length > 0) {
                                config.cannot && !config.cannot.test(newVal) && eval("config.scope." + config.model + "=oldVal");
                                if (config.url) $resource(env.prefix + config.url).get(newVal).$promise.then(function (result) {
                                    config.success && angular.isFunction(config.success) && config.success();
                                }, function (i) {
                                    config.error && angular.isFunction(config.error) && config.error();
                                    config.message && ngMessenger.displayErrorMessage(config.message);
                                }); else {
                                    config.todo && (config.bool = config.todo.test(newVal));
                                    config.bool && config.success && angular.isFunction(config.success) && config.success();
                                    !config.bool && config.error && angular.isFunction(config.error) && config.error();
                                    !config.bool && config.message && ngMessenger.displayErrorMessage(config.message);
                                }
                            }
                        }, !0);
                        config.scope.$on("destroy", function () {
                            config.scope.timer && (config.scope.timer = null);
                        });
                    }
                }
            };
        }];
    }

    function inspirationData(data) {
        if (angular.isArray(data) && data.length > 0) for (var i = 0, l = data.length; l > i; i++) _.forEach(data[i], function (value, key) {
            (key.toLowerCase().indexOf("time") > 0 || key.toLowerCase().indexOf("date") > 0) && (data[i][key] = new Date(data[i][key]).toLocaleDateString() + new Date(data[i][key]).toLocaleTimeString());
        });
        return data;
    }

    function dynamicPart() {
        return {
            restrict: "E",
            replace: !1,
            scope: {
                template: "="
            }
        };
    }

    var moduleName = "ngtables", Exp = {
        current: "current",
        size: "_limit",
        current_start: "_start",
        current_end: "_end",
        total: "total",
        range: "range",
        limit_end: "limit_end"
    }, INTEGER_REGEXP = /^\-?\d*$/, convertUpperPattern = /\b(\w)|\s(\w)/g, floatPattern = /^\d+(\.\d+)?$/, intPattern = /^[0-9]*$/, EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, datePattern = /^(\d{4})\.(0?[1-9]|1[0-2])\.((0?[1-9])|((1|2)[0-9])|30|31)$/;
    pollingService.$inject = ["env", "$http", "$q"];
    var pendingCtrl = ["$scope", "$resource", "$element", "$attrs", "$transclude", "$http", "$q", function ($scope, $resource, $element, $attrs, $transclude, $http, $q) {
        this.start = function () {
        };
    }], pendingDirect = ["$resource", "$compile", "env", function ($resource, $compile, env) {
        return {
            restrict: "E",
            replace: !1,
            scope: {
                requestUrl: "=",
                processUrl: "=",
                timeout: "=",
                interval: "="
            },
            template: "",
            require: ["polling"],
            controller: pendingCtrl,
            link: function (scope, element, attrs, ctrl) {
            }
        };
    }], postLinkStart = function (scope, element, attr, ctrl) {
        element.bind("click", function () {
            ctrl[0].start();
        });
    }, startPending = ["$resource", "$compile", "env", function ($resource, $compile, env) {
        return {
            restrict: "A",
            require: ["^polling"],
            link: postLinkStart
        };
    }], commit = function (scope, element, attr, ctrl) {
        element.bind("click", function () {
            ctrl[0].send();
        });
    }, cp = angular.extend, copy = angular.copy, formsDirect = ["$resource", "$compile", "env", "ngMessenger", function ($resource, $compile, env, ngMessenger) {
        return {
            restrict: "E",
            replace: !1,
            scope: {
                data: "=",
                action: "=",
                url: "@",
                durl: "@",
                query: "=",
                key: "@",
                validConfig: "="
            },
            require: ["forms"],
            link: function (scope, element, attrs, ctrl) {
                var action = cp(cp({}, scope.action), scope);
                action && action.validConfig && _.forEach(scope.action.validConfig, function (config, key) {
                    scope.$watch("data." + key, function (newVal, oldVal) {
                        config.replacePattren.test(newVal) ? config.keyObj = newVal : config.keyObj = oldVal;
                        if (config.url) $resource(env.prefix + config.url).get(newVal).$promise.then(function (result) {
                            config.success && angular.isFunction(config.success) && config.success();
                        }, function (i) {
                            config.error && angular.isFunction(config.error) && config.error();
                            config.message && ngMessenger.displayErrorMessage(config.message);
                        }); else {
                            config.bool = config.pattren.test(newVal);
                            config.bool && config.success && angular.isFunction(config.success) && config.success();
                            !config.bool && config.error && angular.isFunction(config.error) && config.error();
                            !config.bool && config.message && ngMessenger.displayErrorMessage(config.message);
                        }
                        scope.data[key] = config.keyObj;
                    });
                });
                action.durl && $resource(env.prefix + action.durl).get(action.query).$promise.then(function (result) {
                    scope.data = scope.key ? ensureArray(result, spliceDot(scope.key)).newObj : result;
                    ctrl[0].setData(scope.data);
                }, function (i) {
                    action.error && angular.isFunction(action.error) && action.error();
                });
                ctrl[0].setAction(action);
                ctrl[0].setData(scope.data);
                ctrl[0].linkElement(element);
            },
            controller: function ($scope, $resource, $element, $attrs, $transclude) {
                this.iterator = {};
                this.data = {};
                this.action = {};
                this.linked = {};
                this.urlRestPattern = {};
                this.manageMenter = {};
                this.send = function () {
                    var act = this.action;
                    "PUT" == act.method ? $resource(env.prefix + this.action.url, null, {
                        update: {
                            method: "PUT"
                        }
                    }).update(this.data).$promise.then(function (result) {
                            act.success && angular.isFunction(act.success) && act.success(result);
                        }, function (error) {
                            error && act.error && angular.isFunction(act.error) && act.error(error);
                        }) : "GET" == act.method ? $resource(env.prefix + this.action.url).get(this.data).$promise.then(function (result) {
                        act.success && angular.isFunction(act.success) && act.success(result);
                    }, function (error) {
                        error && act.error && angular.isFunction(act.error) && act.error(error);
                    }) : $resource(env.prefix + this.action.url).save(this.data).$promise.then(function (result) {
                        act.success && angular.isFunction(act.success) && act.success(result);
                    }, function (error) {
                        error && act.error && angular.isFunction(act.error) && act.error(error);
                    });
                };
                this.setUrlRestPattern = function (d) {
                    this.urlRestPattern = d;
                };
                this.setData = function (d) {
                    this.data = d;
                };
                this.setAction = function (e) {
                    this.action = e;
                };
                this.errorMessage = function (a) {
                    this.iterator = cp(this.iterator, a);
                    return this.iterator;
                };
                this.getMessage = function () {
                    return this.iterator;
                };
                this.linkElement = function (ele) {
                    this.linked = ele;
                };
            }
        };
    }], scopeFilter = ["$scope", "$resource", "$element", "$attrs", "$transclude", function ($scope, $resource, $element, $attrs, $transclude) {
        $scope.$on("$destroy", function () {
            if (this !== null) {
                delete this.searchObj;
                delete this.tle;
                delete this.paging;
            }
        });
        this.setSearchObj = function (e) {
            this.searchObj = this.searchObj || {};
            this.searchObj[$scope.dataName] = e;
        };
        this.getSearchObj = function () {
            return this.searchObj && this.searchObj[$scope.dataName];
        };
        this.setTle = function (e) {
            this.tle = this.tle || {};
            this.tle = e;
        };
        this.getTle = function () {
            return this.tle;
        };
        this.setPaging = function (e) {
            this.paging = this.paging || {};
            this.paging[$scope.dataName] = e;
        };
        this.getPaging = function () {
            return this.paging && this.paging[$scope.dataName];
        };
    }], i18n_cn_zh = {
        query: "查询",
        number: "选择数量"
    }, tablesDirect = ["$resource", "$compile", "env", "$timeout", function ($resource, $compile, env, $timeout) {
        return {
            restrict: "E",
            replace: !1,
            scope: {
                data: "=",
                action: "=",
                url: "@",
                key: "@",
                tle: "=",
                dataName: "@data",
                plugin: "=",
                urlRest: "=",
                multiSelect: "=",
                multiSelectNum: "="
            },
            priority: 100,
            require: ["tables"],
            compile: function (element, attrs, transclude, ctrl) {
                var ele = element[0], template = "", table = "<table class='" + attrs["class"] + "'  cellspacing='" + attrs.cellspacing + "'>";
                template = table + template + "</table>";
                for (var i = 0, l = ele.classList.length; l > i; i++) element.removeClass(ele.classList[0]);
                var temp = element.html().trim(), pg = "<paging";
                if (-1 != temp.indexOf(pg)) {
                    temp = element.html().replace(pg, template + pg);
                    element.html("").append(temp);
                } else element.append(template);
                return {
                    pre: function (scope, element, attrs, ctrl) {
                        function signMark(ele) {
                            return !angular.equals(sign, ele) && !!(sign = copy(ele));
                        }

                        function convertShadowShow(result) {
                            scope.data = ensureArray(result, spliceDot(scope.key)).newObj;
                            if (scope.data && scope.data.length > 0) {
                                scope.show = scope.data;
                                scope.show = inspirationData(scope.show);
                                scope.review = result;
                                return scope.show;
                            }
                        }

                        function renderVisualReal(result) {
                            convertShadowShow(result);
                            if (scope.show && !(scope.show && scope.show.length < 1)) {
                                if (ctrl[0] && angular.isFunction(ctrl[0].getSearchObj) && ctrl[0].getSearchObj()) {
                                    template = "<div class='row'>";
                                    _.forEach(scope.tle, function (value, key) {
                                        if (scope.show) {
                                            var type = checkType(key, scope.show);
                                            if ("date" == type) {
                                                template += "<label style='width:100px'>" + value + "</label><input type='" + type + "' class='calender form-control'   style='width:200px;display: inline;padding:0px;height:28px;margin:6px;' ng-model='query.start" + ReplaceFirstUpper(key) + "' />";
                                                template += "   -   <input type='" + type + "' class='calender form-control' style='width:200px;display: inline;padding:0px;height:28px;margin:6px;'   ng-model='query.end" + ReplaceFirstUpper(key) + "' />";
                                            } else if ("number" == type) if (scope.config && scope.config.range) {
                                                template += "<label style='width:100px'>" + value + "</label><input  type='" + type + "' class='form-control'  style='width:150px;display:inline;padding:0px;height:28px;margin:6px;'  ng-model='query.min" + ReplaceFirstUpper(key) + "' />";
                                                template += "   -   <input  type='" + type + "'  class='form-control'  style='width:150px;display: inline;padding:0px;height:28px;margin:6px;'  ng-model='query.max" + ReplaceFirstUpper(key) + "' />";
                                            } else template += "<label style='width:100px'>" + value + "</label><input  type='" + type + "'  class='form-control'  style='width:200px;display: inline;padding:0px;height:28px;margin:6px;'  ng-model='query." + key + "' />"; else template += "<label style='width:100px'>" + value + "</label><input class='form-control' style='width:200px;display: inline;padding:0px;height:28px;margin:6px;' type='" + type + "' ng-model='query." + key + "' />";
                                            template += "<br/>";
                                        }
                                    });
                                    template += "<span class=\"jumpsure\" ng-click='doQuery()'>" + i18n_cn_zh.query + "</span>";
                                    var search = "</search>";
                                    origin = origin.replace(search, template + search);
                                }
                                if (ctrl[0] && angular.isFunction(ctrl[0].getPaging) && ctrl[0].getPaging()) {
                                    scope.config = {};
                                    scope.config[Exp.current_start] = result[Exp.current_start] ? result[Exp.current_start] : 1;
                                    scope.config[Exp.total] = result[Exp.total] ? result[Exp.total] : 5;
                                    scope.config[Exp.size] = result[Exp.size] ? result[Exp.size] : 5;
                                    scope.config[Exp.current] = scope.config[Exp.current_start] && scope.config[Exp.size] ? scope.config[Exp.current_start] / scope.config[Exp.size] : 1;
                                    scope.config[Exp.current] = scope.config[Exp.current] >= 1 ? scope.config[Exp.current] : 1;
                                    var start = "<div style='text-align: center'>", over = "</div>", current = "<span ng-bind='config." + Exp.current + "'></span>", first = ("" + scope.config[Exp.total],
                                    "" + scope.config[Exp.size], "<span class=\"jumpsure\" ng-click='pagingFirst()'>|<</span>"), previous = "<span class=\"jumpsure\" ng-click='pagingPrevious()'><</span>", next = "<span class=\"jumpsure\"   ng-click='pagingNext()'>></span>", nextBig = "<span class=\"jumpsure\" ng-click='pagingBigNext()'>>></span>", pagingContent = start + first + previous + current + next + nextBig + over, paging = (ctrl[0].getPaging(),
                                        "</paging>");
                                    origin = origin.replace(paging, pagingContent + paging);
                                    scope.doQuery = function () {
                                        var query = {};
                                        scope.config[Exp.current_start] = scope.config[Exp.size] && scope.config[Exp.current] ? 1 + scope.config[Exp.size] * (scope.config[Exp.current] - 1) : 1;
                                        query[Exp.current_start] = scope.config[Exp.current_start];
                                        query[Exp.size] = scope.config[Exp.size];
                                        scope.query = scope.query || {};
                                        var anythingChanged = signMark(cp(scope.query, {}));
                                        if (anythingChanged) {
                                            cp(query, scope.query);
                                            query = searchPageInit(query);
                                            scope.config[Exp.current_start] = 1;
                                            scope.config[Exp.current] = 1;
                                        } else cp(query, scope.query);
                                        scope.urlRest && cp(query, scope.urlRest);
                                        $resource(env.prefix + action.url).get(query).$promise.then(function (result) {
                                            action.success && action.success(result);
                                            convertShadowShow(result);
                                            result = result["data"];
                                            scope.config[Exp.size] = result[Exp.size] ? result[Exp.size] : scope.config[Exp.size];
                                            scope.config[Exp.total] = result[Exp.total] ? result[Exp.total] : scope.config[Exp.total];
                                            scope.config[Exp.current_start] = result[Exp.current_start] ? result[Exp.current_start] : scope.config[Exp.current_start];
                                            scope.config[Exp.current_end] = scope.config[Exp.current_start] + scope.config[Exp.size];
                                            scope.config[Exp.limit_end] = scope.config[Exp.total] - scope.config[Exp.limit_end];
                                        }, function (thor) {
                                            action.error && action.error(thor);
                                        });
                                    };
                                    scope.pagingFirst = function () {
                                        scope.config[Exp.current] = 1;
                                        scope.doQuery();
                                    };
                                    scope.pagingPrevious = function () {
                                        scope.config[Exp.current] = scope.config[Exp.current] && scope.config[Exp.current] > 1 ? --scope.config[Exp.current] : 1;
                                        scope.doQuery();
                                    };
                                    scope.pagingNext = function () {
                                        if (scope.config[Exp.current]) {
                                            scope.config[Exp.current]++;
                                            scope.doQuery();
                                        }
                                    };
                                    scope.pagingBigNext = function () {
                                        if (scope.config[Exp.current]) {
                                            scope.config[Exp.current] += 10;
                                            scope.doQuery();
                                        }
                                    };
                                }
                                element.html("").append($compile(origin)(scope));
                            }
                        }

                        var sign = {};
                        if (ensure(scope.data, scope.key)) {
                            ctrl[0].setTle(scope.tle);
                            if (scope.tle) {
                                var titleList = [], head = "<thead><tr>";
                                scope.data = scope.data ? scope.data : {};
                                var body = '<tbody><tr ng-repeat="obj in show ">';
                                if (attrs.multiSelect) {
                                    scope.multiSelect = scope.multiSelect || {};
                                    head += '<th width="8%"><input type="checkbox" ng-model="isCheckAll" ng-change="checkAll()"/>全选</th>';
                                    body += '<td><div class="checkbox"><label><input type="checkbox" ng-model="obj.isChecked" ng-change="checkLabel()"></label></div></td>';
                                    scope.checkLabel = function (idx) {
                                        scope.multiSelect = [];
                                        scope.multiSelectNum = [];
                                        _.map(scope.show, function (o) {
                                            !o.isChecked || scope.multiSelect.push(o);
                                            o.quantity ? scope.multiSelectNum.push(o.quantity) : o.quantity = 1;
                                        });
                                    };
                                    var choseAll = !1;
                                    scope.checkAll = function () {
                                        choseAll = !choseAll;
                                        _.map(scope.show, function (o) {
                                            o.isChecked = choseAll;
                                        });
                                        scope.checkLabel();
                                    };
                                    if (attrs.hasOwnProperty("multiSelectNum")) {
                                        head += '<th width="15%">' + i18n_cn_zh.number + "</th>";
                                        body += '<td><input type="button" ng-click="subtractQuantity($index)" class=\'btn btn-default\' style=\'padding:1px\' value="-"/>';
                                        body += '<input type="text" class="shuliang showcartnum change" ng-model="show[$index].quantity" ng-maxlength="6" style="width:50px;" ng-keyup="inputLabel($index)" />';
                                        body += '<input type="button" ng-click="addQuantity($index)" class=\'btn btn-default\'  style=\'padding:1px\' value="+"/> </td>';
                                        scope.subtractQuantity = function (idx) {
                                            scope.show[idx].isChecked = !0;
                                            scope.show[idx].quantity = scope.show[idx].quantity - 1 > 0 ? scope.show[idx].quantity - 1 : 1;
                                            scope.checkLabel();
                                        };
                                        scope.inputLabel = function (idx) {
                                            scope.show[idx].isChecked = !0;
                                            scope.checkLabel();
                                        };
                                        scope.addQuantity = function (idx) {
                                            scope.show[idx].isChecked = !0;
                                            if (!(scope.show[idx].quantity >= 999999)) {
                                                scope.show[idx].quantity = ++scope.show[idx].quantity || 1;
                                                scope.checkLabel();
                                            }
                                        };
                                    }
                                }
                                _.forEach(scope.tle, function (value, key) {
                                    titleList.push(key);
                                    head += "<th>" + value + "</th>";
                                    body += "<td ng-bind='obj." + key + "'></td>";
                                });
                                if (scope.plugin && scope.plugin.title && scope.plugin.surprise) {
                                    head += "<th>" + scope.plugin.title + "</th>";
                                    body += "<td><button class='btn btn-default' ng-click=\"surpriseFun($index)\">" + scope.plugin.title + "</button></td>";
                                    scope.surpriseFun = function (index) {
                                        scope.plugin.surprise(index);
                                    };
                                }
                                head += "</tr></thead>";
                                body += "</tr></tbody>";
                                var template = head + body, e = "</table>", origin = element.html().replace(e, template + e);
                            }
                            var action = cp(cp({}, scope.action), scope);
                            if (action.url) {
                                var query = {};
                                query[Exp.current_start] = 1;
                                query[Exp.size] = 5;
                                scope.urlRest && cp(query, scope.urlRest);
                                $resource(env.prefix + action.url).get(query).$promise.then(function (result) {
                                    action.success && action.success(result);
                                    renderVisualReal(result);
                                }, function (thor) {
                                    action.error && action.error(thor);
                                });
                            }
                        }
                    }
                };
            },
            post: function (scope, element, attrs, ctrl) {
            },
            controller: scopeFilter
        };
    }];
    angular.module(moduleName,[]).provider({
        $tableInterpreter: cacheProvider
    }).provider({
        validation: validationProvider
    }).factory({
        pollingService: pollingService
    }).directive({
        tables: tablesDirect
    }).directive({
        paging: pagingObj
    }).directive({
        search: searchObj
    }).directive({
        forms: formsDirect
    }).directive({
        submit: submitDirect
    }).directive({
        polling: pendingDirect
    }).directive({
        startPolling: startPending
    }).directive({
        dynamicPart: dynamicPart
    }).run(["$templateCache", function ($templateCache) {
    }]);
}();
>>>>>>> origin/master:dist/zyquick.js
