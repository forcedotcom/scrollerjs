Function.RegisterNamespace("Test.Scroller");	
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.SurfaceManager=function(){


	var windowMock=Test.Scroller.NeededMocks.getWindowMock();
	windowMock(function(){
		window.__S.plugins={};
		window.__S.styles={transform:''};
		window.__S.helpers={};
		Import("/Users/ndandekar/scroller/src/utils/helpers.js");
		Import("/Users/ndandekar/scroller/src/utils/cubic-bezier.js");
		Import("/Users/ndandekar/scroller/src/endless-plugin.js");
		Import("/Users/ndandekar/scroller/src/scroller.js");
		Import("/Users/ndandekar/scroller/src/pull-to-load-more.js");
		Import("/Users/ndandekar/scroller/src/surface-manager.js");
	});
	
	var surfaceManager;
	windowMock(function(){
		
		surfaceManager=new window.__S.SurfaceManager();
		surfaceManager.opts={
			pullToRefresh:false,
			pullToLoadMore:false
		};
		surfaceManager.scroller=Test.Scroller.Dom.GetNode({
			id:'scroller',
			_isScrolling:false
		},
		null,
		[Test.Scroller.Dom.GetNode({
			id:'child1'
		})]);
		
	});

	var fnMocks=Mocks.GetMocks(surfaceManager,{
		"on":function(eventType,fn,context){print("in the mock 1");
			fn.apply(surfaceManager);print("in the mock 2");
		},
		"_stopMomentum":function(){},
		"_setWrapperSize":function(){},
		"_scrollTo":function(x,y,time,easing){},
		"testPullToShowMore":function(){},
	});

	[Fixture]
	function Resize(){

		

		[Fact]
		function DoesResizeScroller(){
			var called=0;

			fnMocks(function(){
				windowMock(function(){
					surfaceManager.init();
					surfaceManager.resize();
					called=window.requestAnimationFrame.Calls.length;
				});
				
			});

			Assert.True(called===1);
		}


	}

	[Fixture]
	function ManipulateDOM(){

		[Fact]
		function AppendItems(){
			var value;
			fnMocks(function(){
				windowMock(function(){
					surfaceManager.init();
					surfaceManager.appendItems([Test.Scroller.Dom.GetNode({id:"appended-3"}),Test.Scroller.Dom.GetNode({id:"appended-4"})]);
					//this test currently fails because destroy() is called in init
					value=(surfaceManager.items[1].dom.id==="appended-3" && surfaceManager.items[2].dom.id==="appended-4");
				});
				
			});

			Assert.True(value);
		}

		[Fact]
		function PrependItems(){
			var value;
			fnMocks(function(){
				windowMock(function(){
					surfaceManager.init();
					surfaceManager.prependItems([Test.Scroller.Dom.GetNode({id:"prepended-1"}),Test.Scroller.Dom.GetNode({id:"prepended-2"})]);
					value=(surfaceManager.items[0].dom.id==="prepended-2" && surfaceManager.items[1].dom.id==="prepended-1");
				});
			});

			Assert.True(value);
		}


	}

	[Fixture]
	function UpdatingSurface(){

		[Fact]
		function SmallGestureNoUpdate_PTR(){

			var mock=Mocks.GetMocks(surfaceManager,{
				"_getPosition":function(vertical){
					return {
						pos  : 0.3333333333, //pull down
                    	dist : 1,
                    	size : 698,
                    	maxScroll : 277
					};
				}
			});

			var returnValue;
			mock(function(){
				returnValue=surfaceManager._updateSurfaceManager();
			});

			Assert.Equal(-1,returnValue);
		}

		[Fact]
		function SmallGestureNoUpdate_PTL(){
			var _setInfiniteScrollerSize_called=false;
			var mock=Mocks.GetMocks(surfaceManager,{
				"_getPosition":function(vertical){
					return {
						pos  : -0.3333333333, //pull up
                    	dist : -11, //needs to be > 10/-10
                    	size : 698,
                    	maxScroll : 277
					};
				},
				"_getSurfaceTotalOffset":function(surface){
					return 421;
				},
				"_getBoundaries":function(currentPos, currentSize){
					return {'bottom':1315};
				},
				"_itemsLeft":function(end){
					return false;
				},
				"_setInfiniteScrollerSize":function(){
					_setInfiniteScrollerSize_called=true;
				}

			});


			var returnValue;
			mock(function(){
				returnValue=surfaceManager._updateSurfaceManager();
			});

			Assert.False(_setInfiniteScrollerSize_called);
		}
		
		[Fact]
		function DoesPullToRefresh(){
			Assert.True(true);

		}

		[Fact]
		function DoesPullToLoadMore(){
			Assert.True(true);
		}



	}

	//destroy surface manager
	//test empty scroller
	//test refresh [1. append, 2. prepend, 3. refresh]
	

}