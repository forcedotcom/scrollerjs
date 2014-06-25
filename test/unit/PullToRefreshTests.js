Function.RegisterNamespace("Test.Scroller");
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.PullToRefreshTests=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();
	windowMock(function(){
		window.__S.plugins={};
		Import("/Users/ndandekar/scroller/src/pull-to-refresh.js");
	});

	[Fixture]
	function initPTR(){

		function mock(plugin,_scroller){
			return Mocks.GetMocks(plugin,{
				"_mergeConfigOptions": function(config){return config;},
				"on": function(event,action){
					action.call(plugin);
				},
				scroller: _scroller,
				ptrIcon: null,
				ptrLabel: null,
				_ptrThreshold: null,
				_ptrSnapTime: null
			});
		}

		[Fact]
		function AppendsPTRcontainerAsFirstChild(){
			var PTRplugin,
				neededMocks,
				actual;

			windowMock(function(){
				PTRplugin = new window.__S.plugins.PullToRefresh();
				PTRplugin.opts = {};

				neededMocks=mock(PTRplugin, Test.Scroller.Dom.GetNode({id:'scroller'},null,
					[Test.Scroller.Dom.GetNode({id:'first-child'})]));
					
				neededMocks(function(){
					PTRplugin.init();
					actual = PTRplugin.scroller.firstChild.className;
				});
			});

			Assert.Equal('pullToRefresh',actual);
		}

		[Fact]
		function AppendsPTRcontainerAsChild(){
			var PTRplugin,
				neededMocks,
				actual;

			windowMock(function(){
				PTRplugin = new window.__S.plugins.PullToRefresh();
				PTRplugin.opts = {};

				neededMocks=mock(PTRplugin, Test.Scroller.Dom.GetNode({id:'scroller'}));
					
				neededMocks(function(){
					PTRplugin.init();
					actual = PTRplugin.scroller.firstChild.className;
				});
			});

			Assert.Equal('pullToRefresh',actual);
		}
	}

	[Fixture]
	function TriggerPTR(){

		function mock(plugin){
			return Mocks.GetMocks(plugin,{
				ptrDOM: {classList:{add:function(_class){},remove:function(_class){}}},
				_resetPosition: function(snapTime){},
				ptrLabel: {textContent:''},
				_ptrTriggered: null,
				_ptrLoading: null
			});
		}

		[Fact]
		function ExecutesPTRtrigger(){
			var PTRplugin,
				neededMocks,
				actual=false;

			windowMock(function(){
				PTRplugin = new window.__S.plugins.PullToRefresh();
				PTRplugin.opts = {
					pullToRefreshConfig:{labelUpdate:''},
					onPullToRefresh: function(a,b){
						actual = true;
					}
				};
			});
			neededMocks=mock(PTRplugin);

			neededMocks(function(){
				PTRplugin._triggerPTR();
			});

			Assert.True(actual);
		}

		[Fact]
		function ExecutesPTRtriggerCallback(){
			var PTRplugin,
				neededMocks,
				callback,
				prependMock,
				itemsLength=0,
				expectedPTRloading;

			windowMock(function(){
				PTRplugin = new window.__S.plugins.PullToRefresh();
				PTRplugin.opts = {
					pullToRefreshConfig:{labelUpdate:''},
					onPullToRefresh: function(a,b){
						callback = arguments[0];
					}
				};

				neededMocks=mock(PTRplugin);

				neededMocks(function(){
					PTRplugin._triggerPTR();
					prependMock=Mocks.GetMock(PTRplugin,"prependItems",function(items){
						itemsLength=items.length;
					});
					prependMock(function(){
						callback(0,[1,2]);
					});
					expectedPTRloading = PTRplugin._ptrLoading;
				});
			});
			

			Assert.True(itemsLength===2 && !expectedPTRloading);
		}


		[Fact]
		function NoPrependIfNoDataProvider(){
			var PTRplugin,
				neededMocks,
				callback,
				prependMock,
				prependNotCalled=true;
				
			windowMock(function(){
				PTRplugin = new window.__S.plugins.PullToRefresh();
				PTRplugin.opts = {
					pullToRefreshConfig:{labelUpdate:''},
					onPullToRefresh: undefined
				};
				neededMocks=mock(PTRplugin);

				neededMocks(function(){
					prependMock=Mocks.GetMock(PTRplugin,"prependItems",function(items){
						prependNotCalled = false;
					});
					prependMock(function(){
						PTRplugin._triggerPTR();
					});
				});
			});

			Assert.True(prependNotCalled && !PTRplugin._ptrLoading);
		}




	}
}