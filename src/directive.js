/**
 * Created by zhouyi on 2016/3/30.
 */

/**
 * @ngdoc directive
 * @name custom form.
 * @description
 */
(function () {
    "use strict";
    /**
     * Config
     */
    var moduleName = "core";
// ensure return value is validate.
    function ensure(obj, name) {
        return name ? obj ? obj[name] ? obj[name] : obj : {} : obj
    }

//pageInfo
    var Exp = {
        current: "current",
        size: "_limit",
        current_start: "_start",
        current_end: "_end",
        total: "total",
        range: "range",
        limit_end: "limit_end"
    }

    //获得"a.b.c.d.e"的绝对存在的exits对象
    function ensureObjStr(obj, str) {
        if (!obj || !str) return obj;
        str = str.split(".");
        for (var i = 0, l = str.length; i < l; i++) {
            obj[str[i]] && (obj = obj[str[i]])
        }
        return obj;
    }

//get a.b[a]; 获得绝对存在exits数据
    function ensureArray(obj, arrayName) {
        if (!obj) return;
        var newObj = obj;
        var newName = "";
        for (var i = 0, l = arrayName.length; i < l; i++) {
            var temp = ensure(newObj, arrayName[i]);
            if (temp) {
                newObj = temp;
                i != 0 && (newName += ".")
                newName += arrayName[i];
            } else  break;
        }
        return {
            newObj: newObj,
            level: i,
            newName: newName
        };
    }

// a.c.b = [a,b,c] array数据
    function spliceDot(dotString) {
        return dotString.split(".");
    }

// deep copy
    function extendDeep(dst) {
        angular.forEach(arguments, function (obj) {
            if (obj !== dst) {
                angular.forEach(obj, function (value, key) {
                    if (angular.isObject(dst[key]) || angular.isArray(dst[key])) {
                        extendDeep(dst[key], value);
                    } else {
                        dst[key] = angular.copy(value);
                    }
                });
            }
        });
        return dst;
    };

// reg exp define
    var INTEGER_REGEXP = /^\-?\d*$/;
    var convertUpperPattern = /\b(\w)|\s(\w)/g
    var floatPattern = /^\d+(\.\d+)?$/
    var intPattern = /^[0-9]*$/
    var EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    var datePattern = /^(\d{4})\.(0?[1-9]|1[0-2])\.((0?[1-9])|((1|2)[0-9])|30|31)$/

//convert first char use by render template
    function ReplaceFirstUpper(str) {
        str = str.toLowerCase();
        return str.replace(convertUpperPattern, function (m) {
            return m.toUpperCase();
        });
    }

//pendding services
    function pollingService(env, $http, $q) {
        return {
            polling: function (params) {
                params.close = function () {
                    clearInterval(params.timer);
                    clearInterval(params.timer2);
                }
                params.pollingRunning = function () {
                    var deferred = $q.defer();
                    $http.get(env.prefix + params.url).then(function (response) {
                        if (params.funTrue(response.data))
                            deferred.resolve(response.data);
                        else
                            deferred.notify(response.data);
                    }, function (response) {
                        deferred.reject(response);
                    })
                    return deferred.promise;
                }
                params.timer = setInterval(function () {
                    params.pollingRunning().then(function (resolve) {
                        params.close()
                        params.resFun(resolve);
                    }, function (rejected) {
                        params.close()
                        params.rejFun(rejected);
                    }, function (notify) {
                        params.notFun(notify);
                    })
                }, params.interval);
                if (params.max)
                    params.timer2 = setInterval(function () {
                        close()
                    }, params.max)
                //interval, max, url, resFun, rejFun, notFun,funTrue
            }
        }
    }

    pollingService.$inject = ['env', '$http', '$q'];

// tables directive useful
    function StringToDate(DateStr) {

        var converted = Date.parse(DateStr);
        var myDate = new Date(converted);
        if (isNaN(myDate)) {
            //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';
            var arrays = DateStr.split('-');
            myDate = new Date(arrays[0], --arrays[1], arrays[2]);
        }
        return myDate;
    }

//check type return type name use by render
//data/number/phone/id/text
    function checkType(key, value) {
        var result;
        if (angular.isDate(value))
            return "date";
        try {
            //if (parseFloat(value)!="NaN") {
            if (intPattern.test(value)) {//int
                result = parseInt(value);
            } else if (floatPattern.test(value)) {//float
                result = parseFloat(value);
            }
        } catch (e) {
        }
        if (angular.isNumber(result)) {
            if (/^1[3|5|7|8] \d{9}$/.test(result))
                return "phone";
            if (/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(result))
                return "id";
            if (/^\d{4}$/.test(result))
                return "number"
            return "text";
        }
        if (key.toLowerCase().indexOf("date") != -1 || key.toLowerCase().indexOf("time") != -1 || datePattern.test(result) || angular.isDate(result)) {
            return "date"
        }
        return "text";
    }

// init tables page search object preferences
    function searchPageInit(pageObj) {
        pageObj = pageObj ? pageObj : {};
        pageObj[Exp.current] = 1;
        pageObj[Exp.current_start] = 1;
        pageObj[Exp.size] = 5;
        return pageObj;
    }

//component did work
    var pendingCtrl = ['$scope', '$resource', '$element', '$attrs', '$transclude', '$http', '$q', function ($scope, $resource, $element, $attrs, $transclude, $http, $q) {
        this.start = function () {
            var getInfo = function () {
                $scope.value = 1;
                $scope.clickd = !$scope.clickd;
                var doEncryptFile = $resource(env.prefix + env.encryptFile, {purchaseOrderId: '@id'});
                $scope.value = 5;
                doEncryptFile.get({purchaseOrderId: dataNo.order}).$promise.then(function (result) {
                    $scope.value = 10;
                    var timer;
                    var polling = function () {
                        getData().then(function (resolve) {
                            $scope.value = 100;
                            //console.info(resolve)
                            clearInterval(timer);
                            $scope.canDownLoad = true;
                            $scope.downloads = resolve;
                        }, function (rejected) {
                            $scope.value = 0;
                        }, function (notify) {
                            //console.log(notify);
                            $scope.value = 10 * (notify.status) + 10;
                        });
                    }
                    timer = setInterval(polling, 1000);
                }, function (error) {
                    //todo
                });
            }
            var getData = function () {
                var deferred = $q.defer();
                $http.get(env.prefix + env.process + dataNo.order).then(function (response) {
                    var d = response.data;
                    if (d && d.fileUrl) {
                        deferred.resolve(d);
                    } else {
                        deferred.notify(d);
                    }
                })
                return deferred.promise;
            }
        }
    }]
//for pending
    var pendingDirect = ["$resource", "$compile", "env", function ($resource, $compile, env) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                requestUrl: '=',//request Url
                processUrl: '=',//polling Url
                timeout: "=",//max time
                interval: '='//time out.
            },
            template: "",
            require: ['polling'],
            controller: pendingCtrl,
            link: function postLink(scope, element, attrs, ctrl) {
            }
        };
    }]
//component
    var postLinkStart = function postLink(scope, element, attr, ctrl) {
        element.bind("click", function () {
            ctrl[0].start();
        })
    }
//component
    var startPending = ["$resource", "$compile", "env", function ($resource, $compile, env) {
        return {
            restrict: 'A',
            require: ['^polling'],
            link: postLinkStart
        };
    }]
//tables component
    function pagingObj() {
        return {
            restrict: 'E',
            replace: false,
            require: ['?^tables'],
            link: function postLink(scope, element, attrs, ctrl) {
                if (ctrl[0] && angular.isFunction(ctrl[0].setPaging)) {
                    ctrl[0].setPaging(element);
                }
            }
        };
    }

//tables component
    function searchObj() {
        return {
            restrict: 'E',
            replace: false,
            require: ['?^tables'],
            link: function (scope, element, attrs, ctrl) {
                if (ctrl[0] && angular.isFunction(ctrl[0].setSearchObj))
                    ctrl[0].setSearchObj(element);
            }
        }
    }

//commit  component
    var commit = function postLink(scope, element, attr, ctrl) {
        element.bind("click", function () {
            ctrl[0].send();
        })
    }
//submit component
    function submitDirect() {
        return {
            restrict: 'A',
            require: ['^forms'],
            link: commit
        };
    }

//define angular basic object.
    var cp = angular.extend;
    var copy = angular.copy;
// cache Provider .angular有原生对象可以代替
    function cacheProvider() {
        var $$cacheStatusPlaceholder = {
            orderType: [],
            tagCreateInvoiceType: [
                "int",
                "date"
            ]
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


    /**
     使用方法注入validation
     validation.valid({
        scope: $scope,
        model: "data1.username",
        pattren: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
        replacePattren: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
        success: function () {
        },
        error: function () {
        },
        message: "输入错误",
        url:"验证地址"
    })
     * config.todo
     * config.cannot
     * config.success
     * config.error
     * config.message
     * config.url
     * config.
     */
    function validationProvider() {
        var validProviderOptions = {};
        this.setConfiguration = function (options) {
            cp(validProviderOptions, options);
        };
        this.$get = ["$timeout", "ngMessenger", "env", "$resource", function ($timeout, ngMessenger, env, $resource) {
            return {
                valid: function (config) {
                    angular.isArray(config) || (config = [config]);
                    for (var i = 0, obj = config, l = obj.length; i < l; i++) {
                        config = obj[i]
                        config.scope.timer = config.scope.$watch(config.model, function (newVal, oldVal) {
                            if (newVal.length > 0) {
                                // 当cannot存在,则cannot验证val,不通过则运行eval，如果eval运行成功后，查看url
                                config.cannot && !config.cannot.test(newVal) && eval("config.scope." + config.model + "=oldVal")
                                if (config.url) {
                                    $resource(env.prefix + config.url).get(newVal).$promise.then(function (result) {
                                        config.success && angular.isFunction(config.success) && config.success();
                                    }, function (i) {
                                        config.error && angular.isFunction(config.error) && config.error();
                                        config.message && ngMessenger.displayErrorMessage(config.message);
                                    });
                                } else {
                                    config.todo && (config.bool = config.todo.test(newVal))
                                    config.bool && config.success && angular.isFunction(config.success) && config.success()
                                    !config.bool && config.error && angular.isFunction(config.error) && config.error()
                                    !config.bool && config.message && ngMessenger.displayErrorMessage(config.message)
                                }
                            }
                        }, true);
                        config.scope.$on('destroy', function () {
                            config.scope.timer && (config.scope.timer = null);
                        })
                    }
                }
            }
        }];
    }

    /**
     * [forms] directive use [submit] controller bind data.
     * @type {*[]}
     */
    //form directive
    var formsDirect = ["$resource", "$compile", "env", "ngMessenger", function ($resource, $compile, env, ngMessenger) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                data: '=',//bind controller data.
                action: '=',//action :  method put get
                url: '@',//send data to somewhere URL
                durl: "@",//get data to somewhere URL
                query: '=',// query data
                key: "@", //if data initialization
                validConfig: "="//same like validation Provider (is real need?)
            },
            require: ['forms'],
            link: function postLink(scope, element, attrs, ctrl) {

                var action = cp(cp({}, scope.action), scope);
                /*            var action = {};
                 angular.extend(action,scope.action);
                 angular.extend(action,scope);*/
                //if(action.action&&action.action.validConfig){   todo 2016.5.9
                if (action && action.validConfig) {
                    //action.valid = ensureObjStr(action.action.validConfig)
                    //for(obj in action.action.validConfig)
                    _.forEach(scope.action.validConfig, function (config, key) {
                        //console.info(config);
                        //console.info(key);
                        scope.$watch('data.' + key, function (newVal, oldVal) {
                            if (!config.replacePattren.test(newVal)) {
                                config.keyObj = oldVal;
                            } else config.keyObj = newVal;
                            if (config.url)
                                $resource(env.prefix + config.url).get(newVal).$promise.then(function (result) {
                                    config.success && angular.isFunction(config.success) && config.success();
                                }, function (i) {
                                    config.error && angular.isFunction(config.error) && config.error();
                                    config.message && ngMessenger.displayErrorMessage(config.message);
                                });
                            else {
                                config.bool = config.pattren.test(newVal);
                                //console.info(bool);
                                config.bool && config.success && angular.isFunction(config.success) && config.success();
                                !config.bool && config.error && angular.isFunction(config.error) && config.error();
                                !config.bool && config.message && ngMessenger.displayErrorMessage(config.message);
                            }
                            scope.data[key] = config.keyObj;
                            //return config
                        })
                    })
                }
                if (action.durl) {
                    $resource(env.prefix + action.durl).get(action.query).$promise.then(function (result) {
                        //console.info(result);
                        scope.data = scope.key ? ensureArray(result, spliceDot(scope.key)).newObj : result;//todo Fix Bug 2301
                        ctrl[0].setData(scope.data);
                    }, function (i) {
                        if (action.error && angular.isFunction(action.error))action.error();
                    });
                }
                //console.info(action);
                ctrl[0].setAction(action);
                ctrl[0].setData(scope.data);
                ctrl[0].linkElement(element);
            },
            controller: function ($scope, $resource, $element, $attrs, $transclude) {
                this.iterator = {};
                this.data = {};//bind data from link
                this.action = {};//bind data from link
                this.linked = {};//
                this.urlRestPattern = {};
                this.manageMenter = {};//save son direct
                //todo
                this.send = function () {
                    //todo url have /:id/ restful
                    var act = this.action;
                    if (act.method == "PUT")
                        $resource(env.prefix + this.action.url, null, {
                            update: {method: 'PUT'}
                        }).update(this.data).$promise.then(function (result) {
                                if (act.success && angular.isFunction(act.success))
                                    act.success(result);
                            }, function (error) {
                                if (error && act.error && angular.isFunction(act.error)) {
                                    act.error(error);
                                }
                            })
                    else if (act.method == "GET")
                        $resource(env.prefix + this.action.url).get(this.data).$promise.then(function (result) {
                            if (act.success && angular.isFunction(act.success))
                                act.success(result);
                        }, function (error) {
                            if (error && act.error && angular.isFunction(act.error)) {
                                act.error(error);
                            }
                        });
                    else
                        $resource(env.prefix + this.action.url).save(this.data).$promise.then(function (result) {
                            //console.info(result);
                            if (act.success && angular.isFunction(act.success))
                                act.success(result);
                        }, function (error) {
                            if (error && act.error && angular.isFunction(act.error)) {
                                act.error(error);
                            }
                        });

                }
                this.setUrlRestPattern = function (d) {
                    this.urlRestPattern = d;
                }
                this.setData = function (d) {
                    this.data = d;
                }
                this.setAction = function (e) {
                    this.action = e;
                }
                this.errorMessage = function (a) {
                    this.iterator = cp(this.iterator, a);
                    return this.iterator;
                }
                this.getMessage = function () {
                    return this.iterator;
                }
                this.linkElement = function (ele) {
                    this.linked = ele;
                }
            }
        };
    }]

    /**
     * @Deprecated
     *  is real need this
     * @returns {{restrict: string, require: string[], scope: {}, link: Function}}
     */
    function validDirect() {
        return {
            restrict: 'A',
            require: ['valid', 'ngModel'],
            scope: {},
            link: function postLink(scope, element, attr, ctrl) {
                var INTEGER_REGEXP = /^\-?\d*$/;
                ctrl[1].$parsers.unshift(function (viewValue) {
                    if (INTEGER_REGEXP.test(viewValue)) {
                        ctrl[1].$setValidity('integer', true);
                        return viewValue;
                    } else {
                        ctrl[1].$setValidity('integer', false);
                        return undefined;
                    }
                }),
                    element.bind("click", function () {
                            //console.debug(ctrl[0]);
                            var validators = {};
                            if (scope.min)
                                validators.min(scope.min);
                            if (scope.max)
                                validators.max(scope.max);
                            if (scope.num)
                                validators.num(scope.num);
                            if (scope.req)
                                validators.req(scope.req);
                            if (ctrl[2]) {
                                //console.debug(ctrl[2]);
                                ctrl[2].errorMessage(validate.run(validators));
                            } else {
                                //console.debug("valid规范，必须填写forms input中，无效"); //其实是ngmodel中，但是一般是input
                                throw new Error("valid规范，必须填写forms input中，无效");
                            }
                        }
                    )
            }
        };
    }

    /**
     * tables controller
     * destroy when controller-router changed.
     * @type {*[]}
     */
    var scopeFilter = ['$scope', '$resource', '$element', '$attrs', '$transclude', function ($scope, $resource, $element, $attrs, $transclude) {
        $scope.$on('$destroy', function () {
            if (this !== null) {
                delete this.searchObj;
                delete this.tle;
                delete this.paging;
            }
        });
        this.setSearchObj = function (e) {
            this.searchObj = this.searchObj || {}
            this.searchObj[$scope.dataName] = e;
        }
        this.getSearchObj = function () {
            return this.searchObj && this.searchObj[$scope.dataName];
        }
        this.setTle = function (e) {
            this.tle = this.tle || {}
            this.tle = e;
            //this.tle[$scope.dataName]= e;
        }
        this.getTle = function () {
            return this.tle;
        }
        this.setPaging = function (e) {
            this.paging = this.paging || {}
            this.paging[$scope.dataName] = e;
        }
        this.getPaging = function () {
            return this.paging && this.paging[$scope.dataName];
        }
    }]
    // i18n cn.zh
    var i18n_cn_zh = {
        query: "查询",
        number: "选择数量"
    };

    //convert number to data.
    function inspirationData(data) {
        // var timestamp=Math.round(new Date().getTime()/1000);
        //console.info(data);
        if (angular.isArray(data) && data.length > 0) {
            for (var i = 0, l = data.length; i < l; i++) {
                _.forEach(data[i], function (value, key) {
                    if (key.toLowerCase().indexOf("time") > 0 || key.toLowerCase().indexOf("date") > 0)
                        data[i][key] = new Date(data[i][key]).toLocaleDateString() + new Date(data[i][key]).toLocaleTimeString();
                })
                //data[0].createTime = new Date(data[0].createTime).toLocaleDateString();
                //data[0].createTime = new Date(data[0].createTime).toLocaleTimeString();
                //data[0].createTime = new Date(data[0].createTime).format('YYYY-MM-dd h:m:s');
            }
        }
        return data;
    }

    /**
     * dynamic part
     * payment page to show aliPay return data
     * @returns {{restrict: string, replace: boolean, scope: {template: string}}}
     */
    function dynamicPart() {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                template: '=',//data root name
            }
        }
    }

    /**
     * table directive.
     * 包括分页，多选
     *
     * @BUG :<!-  comment --> DOM annotation touch bug
     * @type {*[]}
     */
    var tablesDirect = ["$resource", "$compile", "env", "$timeout", function ($resource, $compile, env, $timeout) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                data: '=',//data root name.
                action: '=',//send request setting at controller{method:"",body:"",success:func,error:func}
                url: '@',//get data url address
                key: "@",//data[key]
                tle: "=",//bin controller data: table head title show //globalization
                dataName: '@data',
                plugin: '=',//plugin:{title:@str,surprise:~}
                urlRest: "=",
                //query: '=',//condition --disable //paging auto generator scope.query.prefe
                //durl: "@",// when first run query data url --disable
                multiSelect: "=",
                multiSelectNum: "="
            },
            priority: 100,//high priority
            require: ['tables'],

            //compile class post
            compile: function tablesRender(element, attrs, transclude, ctrl) {
                //
                //@configuration search number option :
                //@true is range search mode,
                //@false is simple search mode.
                //@configuration paging option initialization
                //current / size / max
                //

                var ele = element[0];
                var template = "";
                var table = "<table class=\'" + attrs.class + "\'  cellspacing=\'" + attrs.cellspacing + "\'>";
                template = table + template + "</table>";
                for (var i = 0, l = ele.classList.length; i < l; i++) {
                    element.removeClass(ele.classList[0]);
                }
                //element.data("paging");
                var temp = element.html().trim();
                var pg = '<paging';
                if (temp.indexOf(pg) != -1) {
                    temp = element.html().replace(pg, template + pg);
                    element.html("").append(temp);
                } else {
                    element.append(template);
                }
                return {
                    pre: function preLink(scope, element, attrs, ctrl) {
                        var sign = {};

                        // absolutely perfect equals
                        function signMark(ele) {
                            return !angular.equals(sign, ele) && !!(sign = copy(ele))
                        }

                        //  make sure 'scope.show' =  result[x][x] is real exist
                        function convertShadowShow(result) {
                            //debug
                            //console.info(result);
                            scope.data = ensureArray(result, spliceDot(scope.key)).newObj;  //$http.result拿出深层obj到浅层obj，ngRepeat浅层obj.
                            if (scope.data && scope.data.length > 0) {
                                scope.show = scope.data;        //  just ng-repeat show:  convert controller to directive.ngRepeat show.
                                scope.show = inspirationData(scope.show);
                                scope.review = result;          //      complete show:  $http.response.result[content]
                                return scope.show;
                            }
                        }

                        // ensure scope.data=controller [key] is real exits ? return
                        if (!ensure(scope.data, scope.key))return;
                        ctrl[0].setTle(scope.tle);
                        if (scope.tle) {
                            //count title
                            var titleList = [];
                            var head = "<thead><tr>";
                            //init data deep object
                            scope.data = scope.data ? scope.data : {};
                            //string
                            //scope.show = scope.tle;

                            var body = "<tbody><tr ng-repeat=\"obj in show \">";


                            //multi-Select-Collection
                            if (attrs.multiSelect) {
                                scope.multiSelect = scope.multiSelect || {};
                                head += "<th width=\"8%\"><input type=\"checkbox\" ng-model=\"isCheckAll\" ng-change=\"checkAll()\"/>全选</th>";
                                body += "<td><div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"obj.isChecked\" ng-change=\"checkLabel()\"></label></div></td>";
                                scope.checkLabel = function (idx) {
                                    scope.multiSelect = [];
                                    scope.multiSelectNum = [];
                                    _.map(scope.show, function (o) {
                                        !o.isChecked || scope.multiSelect.push(o);
                                        o.quantity ? scope.multiSelectNum.push(o.quantity) : o.quantity = 1;
                                    })
                                    //console.info(scope.multiSelect)
                                    //console.info(scope.multiSelectNum)
                                }
                                var choseAll = false;
                                scope.checkAll = function () {
                                    choseAll = !choseAll
                                    _.map(scope.show, function (o) {
                                        o.isChecked = choseAll;
                                    })
                                    scope.checkLabel();
                                }


                                //ng-max-length = 6;
                                if (attrs.hasOwnProperty('multiSelectNum')) {
                                    head += "<th width=\"15%\">" + i18n_cn_zh.number + "</th>";
                                    body += "<td><input type=\"button\" ng-click=\"subtractQuantity($index)\" class='btn btn-default' style='padding:1px' value=\"-\"/>";
                                    body += "<input type=\"text\" class=\"shuliang showcartnum change\" ng-model=\"show[$index].quantity\" ng-maxlength=\"6\" style=\"width:50px;\" ng-keyup=\"inputLabel($index)\" />";
                                    body += "<input type=\"button\" ng-click=\"addQuantity($index)\" class='btn btn-default'  style='padding:1px' value=\"+\"/> </td>";
                                    scope.subtractQuantity = function (idx) {
                                        scope.show[idx].isChecked = true;
                                        scope.show[idx].quantity = scope.show[idx].quantity - 1 > 0 ? scope.show[idx].quantity - 1 : 1;
                                        scope.checkLabel();
                                    }
                                    scope.inputLabel = function (idx) {
                                        scope.show[idx].isChecked = true;
                                        scope.checkLabel();
                                    }
                                    scope.addQuantity = function (idx) {
                                        scope.show[idx].isChecked = true;
                                        //ng-max-length = 6;
                                        if (scope.show[idx].quantity >= 999999)return;
                                        scope.show[idx].quantity = ++scope.show[idx].quantity || 1;
                                        scope.checkLabel();
                                    }
                                }
                            }
                            // make table title
                            _.forEach(scope.tle, function (value, key) {
                                //count title
                                titleList.push(key);
                                head += "<th>" + value + "</th>";
                                body += "<td ng-bind=\'obj." + key + "\'></td>";
                            })

                            //table line button has been click. then run scope.plugin.surprise.
                            if (scope.plugin && scope.plugin.title && scope.plugin.surprise) {
                                head += "<th>" + scope.plugin.title + "</th>";
                                body += "<td><button class='btn btn-default' ng-click=\"surpriseFun($index)\">" + scope.plugin.title + "</button></td>";
                                scope.surpriseFun = function (index) {
                                    scope.plugin.surprise(index);
                                }
                            }

                            head += "</tr></thead>";
                            body += '</tr></tbody>';
                            var template = head + body;
                            //var  e = angular.element(element.children())[0].find('table').html('').append($compile(template)(scope));
                            var e = "</table>";
                            var origin = element.html().replace(e, template + e);
                            //todo bug 1135 compile 2'time error
                            //element.html('').append($compile(origin)(scope));

                        }
                        //compile repeat error by element.children();
                        var action = cp(cp({}, scope.action), scope);

                        //when init runner
                        function renderVisualReal(result) {
                            //todo bug2155
                            convertShadowShow(result);
                            if (!scope.show || ( scope.show && scope.show.length < 1))return;
                            if (ctrl[0] && angular.isFunction(ctrl[0].getSearchObj) && ctrl[0].getSearchObj()) {
                                //todo do filter [result.data] : status 1 = ok; 2 = error
                                template = "<div class=\'row\'>";
                                // foreach key value render search template
                                _.forEach(scope.tle, function (value, key) {
                                    if (scope.show) {// ensureObj.newObj[0][key]
                                        // "text" | "time" | "number";
                                        var type = checkType(key, scope.show);
                                        if (type == "date") {
                                            template += "<label style=\'width:100px\'>" + value + "</label><input type=\'" + type + "\' class=\'calender form-control\'   style=\'width:200px;display: inline;padding:0px;height:28px;margin:6px;\' ng-model=\'query.start" + ReplaceFirstUpper(key) + "\' />";
                                            template += "   -   <input type=\'" + type + "\' class=\'calender form-control\' style=\'width:200px;display: inline;padding:0px;height:28px;margin:6px;\'   ng-model=\'query.end" + ReplaceFirstUpper(key) + "\' />";
                                        } else if (type == "number") {
                                            if (scope.config && scope.config.range) {
                                                template += "<label style=\'width:100px\'>" + value + "</label><input  type=\'" + type + "\' class=\'form-control\'  style=\'width:150px;display:inline;padding:0px;height:28px;margin:6px;\'  ng-model=\'query.min" + ReplaceFirstUpper(key) + "\' />";
                                                template += "   -   <input  type=\'" + type + "\'  class=\'form-control\'  style=\'width:150px;display: inline;padding:0px;height:28px;margin:6px;\'  ng-model=\'query.max" + ReplaceFirstUpper(key) + "\' />";
                                            } else {
                                                template += "<label style=\'width:100px\'>" + value + "</label><input  type=\'" + type + "\'  class=\'form-control\'  style=\'width:200px;display: inline;padding:0px;height:28px;margin:6px;\'  ng-model=\'query." + key + "\' />";
                                            }
                                        } else
                                            template += "<label style=\'width:100px\'>" + value + "</label><input class=\'form-control\' style=\'width:200px;display: inline;padding:0px;height:28px;margin:6px;\' type=\'" + type + "\' ng-model=\'query." + key + "\' />";
                                        template += "<br/>";
                                    }
                                    //template += value+"<input type='text' ng-model=\'query."+key+"\' />";template += value+"<input type='text' name=\'"+key+"\' />";<input class="calender" type="date" name="s_date" ng-model="params.start" /> -<input class="calender" type="date" name="e_date" ng-model="params.end"/>
                                })
                                //"<button type=\'button\' class=\'btn btn-primary\'></button>";
                                template += "<span class=\"jumpsure\" ng-click=\'doQuery()\'>" + i18n_cn_zh.query + "</span>";
                                //
                                //   @todo render search dom
                                //   solution:
                                //   1.create by [input type] format ng-repeat DOM  ,wait for different data format.
                                //   2.compile before the http request  -> cannot , because need show different category DOM by different [input type]
                                //   3.ctrl[0].getSearchObj(),make a  solution fix  compile at  Search obj  Error : ctrl[0].getSearchObj().append($compile(template)(scope));
                                //   4.do compile to //table element  -- > use this.
                                //   5.include complete jquery.
                                //
                                var search = '</search>';
                                origin = origin.replace(search, template + search);
                            }
                            if (ctrl[0] && angular.isFunction(ctrl[0].getPaging) && ctrl[0].getPaging()) {
                                //config
                                //todo bug 1155
                                scope.config = {};
                                scope.config[Exp.current_start] = result[Exp.current_start] ? result[Exp.current_start] : 1;
                                scope.config[Exp.total] = result[Exp.total] ? result[Exp.total] : 5;
                                scope.config[Exp.size] = result[Exp.size] ? result[Exp.size] : 5;
                                scope.config[Exp.current] = scope.config[Exp.current_start] && scope.config[Exp.size] ? scope.config[Exp.current_start] / scope.config[Exp.size] : 1;
                                scope.config[Exp.current] = scope.config[Exp.current] >= 1 ? scope.config[Exp.current] : 1;

                                var start = "<div style=\'text-align: center\'>";
                                var over = "</div>";
                                //var current = config.current + "";
                                var current = "<span ng-bind=\'config." + Exp.current + "\'></span>";
                                var total = "" + scope.config[Exp.total] + "";
                                var appear = "" + scope.config[Exp.size] + "";
                                var first = "<span class=\"jumpsure\" ng-click=\'pagingFirst()\'>|<</span>";
                                var previous = "<span class=\"jumpsure\" ng-click=\'pagingPrevious()\'><</span>";
                                //var next = "<span class=\"jumpsure\"  ng-show=\"{{(config."+ Exp.total+"-config."+Exp.current_end+") >config."+Exp.size+"}}\" ng-click=\'pagingNext()\'>></span>";
                                var next = "<span class=\"jumpsure\"   ng-click=\'pagingNext()\'>></span>";
                                var nextBig = "<span class=\"jumpsure\" ng-click=\'pagingBigNext()\'>>></span>";
                                var pagingContent = start + first + previous + current + next + nextBig + over;
                                var pagingObj = ctrl[0].getPaging();
                                var paging = '</paging>';
                                origin = origin.replace(paging, pagingContent + paging);


                                // bin generator html data key event
                                scope.doQuery = function () {
                                    var query = {};
                                    scope.config[Exp.current_start] = scope.config[Exp.size] && scope.config[Exp.current] ? 1 + (scope.config[Exp.size] * (scope.config[Exp.current] - 1)) : 1;
                                    query[Exp.current_start] = scope.config[Exp.current_start];
                                    query[Exp.size] = scope.config[Exp.size];
                                    scope.query = scope.query || {};
                                    var anythingChanged = signMark(cp(scope.query, {}));
                                    if (!anythingChanged) {
                                        //param
                                        cp(query, scope.query);
                                    } else {
                                        //page
                                        cp(query, scope.query);
                                        query = searchPageInit(query);
                                        scope.config[Exp.current_start] = 1;
                                        scope.config[Exp.current] = 1;
                                    }
                                    if (scope.urlRest)cp(query, scope.urlRest);
                                    $resource(env.prefix + action.url).get(query).$promise.then(function (result) {
                                        if (action.success)action.success(result);
                                        convertShadowShow(result);
                                        result = result['data'];
                                        scope.config[Exp.size] = result[Exp.size] ? result[Exp.size] : scope.config[Exp.size];
                                        scope.config[Exp.total] = result[Exp.total] ? result[Exp.total] : scope.config[Exp.total];
                                        scope.config[Exp.current_start] = result[Exp.current_start] ? result[Exp.current_start] : scope.config[Exp.current_start];
                                        scope.config[Exp.current_end] = scope.config[Exp.current_start] + scope.config[Exp.size];
                                        scope.config[Exp.limit_end] = scope.config[Exp.total] - scope.config[Exp.limit_end];
                                        //scope.config[Exp.total] -  scope.config[Exp.current_start]*  scope.config[Exp.size];
                                        //console.info(config[Exp.total])
                                        //console.info(config[Exp.current_start])
                                        //console.info(config[Exp.current_end])
                                    }, function (thor) {
                                        if (action.error)action.error(thor);
                                    });
                                }
                                scope.pagingFirst = function () {
                                    scope.config[Exp.current] = 1;
                                    scope.doQuery();
                                }
                                scope.pagingPrevious = function () {
                                    scope.config[Exp.current] = scope.config[Exp.current] && scope.config[Exp.current] > 1 ? --scope.config[Exp.current] : 1;
                                    scope.doQuery();
                                }
                                scope.pagingNext = function () {
                                    if (scope.config[Exp.current]) {
                                        scope.config[Exp.current]++;
                                        scope.doQuery();
                                    }
                                }
                                scope.pagingBigNext = function () {
                                    if (scope.config[Exp.current]) {
                                        scope.config[Exp.current] += 10;
                                        scope.doQuery();
                                    }
                                }
                            }
                            //todo bug2155
                            element.html('').append($compile(origin)(scope));
                            //define query option.
                            //maxPage
                        }

                        if (action.url) {
                            var query = {}
                            query[Exp.current_start] = 1;
                            query[Exp.size] = 5;
                            if (scope.urlRest)
                                cp(query, scope.urlRest);
                            //angular.js:13424 Error: [$resource:badcfg] Error in resource configuration for action `get`. Expected response to contain an object but got an array (Request: GET
                            // response obj is array will throw exception. just changed response obj to {}
                            $resource(env.prefix + action.url).get(query).$promise.then(function (result) {
                                    if (action.success)action.success(result);
                                    renderVisualReal(result);
                                }, function (thor) {
                                    if (action.error)action.error(thor);
                                }
                            );
                        }
                    }
                }
            },
            post: function postLink(scope, element, attrs, ctrl) {
            },
            controller: scopeFilter
        };
    }];

    /**
     * 声明
     */
    angular.module(moduleName)
        .provider({$tableInterpreter: cacheProvider})
        .provider({validation: validationProvider})
        .factory({pollingService: pollingService})
        .directive({tables: tablesDirect})
        .directive({paging: pagingObj})
        .directive({search: searchObj})
        .directive({forms: formsDirect})
        .directive({submit: submitDirect})
        .directive({valid: validDirect})
        .directive({polling: pendingDirect})
        .directive({startPolling: startPending})
        .directive({dynamicPart: dynamicPart})
        .run(["$templateCache", function ($templateCache) {
        }]);
})();