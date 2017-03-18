/* 
 * @module  : Contain.js
 * @version : 1.0
 * @author  : GW.iron
 */

;(function (global) {
	
	var modules = {}
	,	moduleManagement = {
		data   : modules,
		method : {
			production : function (url,data) {
				// 生产模块，但是未执行
				modules[url] = {
					exports : null,
					url : url,
					dependenices : null,
					context : function(require, exports, module){
						eval( data )
					}
				}
			},
			addDependenices : function (url, data) {
				modules[url].dependenices = data
			}
		}
	}
	,	script = {
		// lockScript : 正在加载模块数的锁
		// 是一个用于模块是否加载完毕的锁，当异步回调判断到如果模块已经都加载完成则，调用启动文件来时执行 
		lockScript: 0,
		getLockScript : function () {
			return this.lockScript
		},
		addLockScript: function () {
			// 正在加载模块数加1
			this.lockScript++
		},
		subLockScript: function () {
			// 其中一个模块加载完成
			this.lockScript--

			// 依赖模块全部准备就绪，则调用启动文件
			if( this.lockScript <= 0 ){
				require('js/app.js')
			}
		},

		loadScript: function (url) {
			script.addLockScript()
			// 下载url模块
			script.ajax({
				url : url,
				success : function (data) {
					var dependenices = null
					,	mm = moduleManagement.method
					mm.production( this.url, data )
					dependenices = script.regexRequire(data,this.url)
					mm.addDependenices(url, dependenices)
					script.subLockScript()
				}
			})
		},
		regexRequire : function (data,url) {
			//判断新下载模块中是否有依赖的模块，有则马上下载
			var reg = /require\( *?['"] *?.+? *?(?=["']\))/g
			,	regDelRequire = /require\( *?['"] *?/
			,	arr = null

			arr = data.match(reg)
			if( !arr ) return false

			for (var i = 0; i < arr.length; i++) {
				arr[i] = arr[i].replace(regDelRequire, '')
				script.loadScript(arr[i]) // 因为文件中有模块依赖，故继续加载
			}
			return arr
		},
		ajax : function (obj) {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange=stateChange;
			xmlhttp.open("GET",obj.url,true);
			xmlhttp.send(obj.data);

			function stateChange(e){
				if (xmlhttp.readyState==4)
				{// 4 = "loaded"
					if (xmlhttp.status==200)
					{// 200 = OK
						// console.log(xmlhttp.responseText)
						obj.success( xmlhttp.responseText )
					}
					else
					{
						console.error("Problem retrieving XML data");
						obj.error( xmlhttp.responseText )
					}
				}
			}
		}
	}

	// 生成一个继承 proto 的对象
	function inherit(proto) {
		if(proto == null) throw TypeError()
		if(Object.create) return Object.create(proto)
		var t = typeof proto
		if(t!=='object' && t!=='function') throw TypeError()
		var F = function() {}
		F.prototype = proto
		return new F()
	}

	// 加载模块，成功后返回模块暴露的接口
	function require( url ) {
		var exports = null
		,	module = modules[url]
		// 若模块为生产过，则生产，否则直接返回生产结果
		if( !module.exports ) {
			module.exports = exports = {}
			module.context( require, exports, module )
		}
		return inherit( module.exports )
	}
	// 默认加载入口模块
	script.loadScript( 'js/app.js' )

}(window))