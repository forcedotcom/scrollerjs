Function.RegisterNamespace("Test.Scroller");
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.PullToLoadMoreTests=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();
	windowMock(function(){
		window.__S.plugins={};
		Import("/Users/ndandekar/scroller/src/pull-to-load-more.js");
	});

	[Fixture]
	function InitPTL(){
		[Fact]
		function AppendsPTLcontainer(){
			var PTLplugin,
				neededMocks,
				PTLsurfaceItem;
			
			windowMock(function(){
				PTLplugin = new window.__S.plugins.PullToLoadMore();
				PTLplugin.opts = {};

				neededMocks=Mocks.GetMocks(PTLplugin,{
					"_mergeConfigOptions": function(config){
						return config;
					},
					"on": function(event,action){
						action.call(PTLplugin);
					},
					scroller: {
						appendChild: function(item){
							PTLsurfaceItem = item;
						}
					}
				});

				neededMocks(function(){
					PTLplugin.init();
				});
			});
			
			
			Assert.True(PTLplugin._ptlIsEnabled()  && 
						PTLsurfaceItem.innerHTML && 
						PTLsurfaceItem.className === 'pullToLoadMore');
		}
	}

	[Fixture]
	function PTLtriggers(){
		
		[Fact]
		function ExecutesPTLtrigger(){
			var PTLplugin,
				neededMocks,
				actual=false;

			windowMock(function(){
				PTLplugin = new window.__S.plugins.PullToLoadMore();
				neededMocks = Mocks.GetMocks(PTLplugin, {
					ptlDOM: {classList: {add: function(_class){}}},
					_ptlTriggered: null,
					_ptlLoading: null,
					opts: {
						onPullToLoadMore: function(a,b){
							actual = true;
						}
					}
				});

				neededMocks(function(){
					PTLplugin._triggerPTL();
				});
			});

			Assert.True(actual);

		}

		[Fact]
		function ExecuteTriggerCallbackToAppendItems(){
			var PTLplugin,
				neededMocks,
				callback,
				itemsLength;

			windowMock(function(){
				PTLplugin = new window.__S.plugins.PullToLoadMore();
				neededMocks = Mocks.GetMocks(PTLplugin, {
					ptlDOM: {classList: {
						add: function(_class){},
						remove: function(_class){}
					}},
					_ptlTriggered: null,
					_ptlLoading: null,
					_ptlSnapTime: null,
					opts: {
						onPullToLoadMore: function(a,b){
							callback = arguments[0];
						}
					},
					appendItems: function(items){
						itemsLength = items.length;
					},
					_resetPosition: function(ptlSnapTime){

					}
				});

				neededMocks(function(){
					PTLplugin._triggerPTL();
					callback(0,[1,2]);
				});
			});

			Assert.True(itemsLength===2 && !PTLplugin._ptlLoading);
		}

		[Fact]
		function NoAppendIfNoDataProvider(){
			var PTLplugin,
				neededMocks,
				callback,
				appendNotCalled=true;

			windowMock(function(){
				PTLplugin = new window.__S.plugins.PullToLoadMore();
				neededMocks = Mocks.GetMocks(PTLplugin, {
					ptlDOM: {classList: {
						add: function(_class){},
						remove: function(_class){}
					}},
					_ptlTriggered: null,
					_ptlLoading: null,
					_ptlSnapTime: null,
					opts: {
						onPullToLoadMore: undefined
					},
					appendItems: function(items){
						appendNotCalled = false;
					},
					_resetPosition: function(ptlSnapTime){

					}
				});

				neededMocks(function(){
					PTLplugin._triggerPTL();
				});
			});

			Assert.True(appendNotCalled && !PTLplugin._ptlLoading);
		}
	}

	[Fixture]
	function TogglesPTL(){
		
		[Fact]
		function ShowPTL(){
			var PTLplugin;

			windowMock(function(){
				PTLplugin = new window.__S.plugins.PullToLoadMore();
				PTLplugin.ptlDOM={style:{display:'none'},offsetHeight:1},
				PTLplugin._ptlEnabled=false,
				PTLplugin._ptlThreshold;

				PTLplugin.togglePullToLoadMore(true);
			});

			Assert.True(PTLplugin.ptlDOM.style.display === '' && PTLplugin._ptlEnabled);
		}

		[Fact]
		function HidePTL(){
			var PTLplugin;

			windowMock(function(){
				PTLplugin = new window.__S.plugins.PullToLoadMore();
				PTLplugin.ptlDOM={style:{display:''}},
				PTLplugin._ptlEnabled=true,
				PTLplugin._ptlThreshold;

				PTLplugin.togglePullToLoadMore(false);
			});

			Assert.True(PTLplugin.ptlDOM.style.display === 'none' && 
						!PTLplugin._ptlEnabled &&
						!PTLplugin._ptlThreshold);
		}


		//toggle(true)			//toggle(true)
		//_ptlEnabled=false		//_ptlEnabled=true (possible?)

		//toggle(false)			//toggle(false)
		//_ptlEnabled=false		//_ptlEnabled=true (possible?)
	}

}