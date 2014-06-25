Function.RegisterNamespace("Test.Scroller");	
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.EndlessPluginTests=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();
	windowMock(function(){
		window.__S.plugins={};
		Import("/Users/ndandekar/scroller/src/endless-plugin.js");
	});

	[Fixture]
	function Initialize(){
		[Fact]
		function EndlessPropertyDefinedAfterInit(){
			var endlessPlugin,
				endless;
			
			windowMock(function(){
				endlessPlugin = new window.__S.plugins.Endless();	
			});

			Assert.Undefined(endlessPlugin.endless);
		}

		[Fact]
		function SetsEndlessTrueAfterInit(){
			var endlessPlugin,
				endless;
			
			windowMock(function(){
				endlessPlugin = new window.__S.plugins.Endless();
				endlessPlugin.init();
			});

			Assert.True(endlessPlugin.endless);
		}
	}


	[Fixture]
	function ActiveOffset(){
		[Fact]
		function WrapperHeightAsOffset(){
			var endlessPlugin,
				activeOffsetValue;

			windowMock(function(){
				endlessPlugin=new window.__S.plugins.Endless();
				endlessPlugin.scrollVertical=true;
				endlessPlugin.wrapperHeight=50;
				endlessPlugin.wrapperWidth=100;

				activeOffsetValue=endlessPlugin._setActiveOffset();
			});

			Assert.Equal(endlessPlugin.activeOffset,45);
		}


		[Fact]
		function WrapperWidthAsOffset(){
			var endlessPlugin,
				activeOffsetValue;

			windowMock(function(){
				endlessPlugin=new window.__S.plugins.Endless();
				endlessPlugin.scrollVertical=false;
				endlessPlugin.wrapperHeight=50;
				endlessPlugin.wrapperWidth=100;

				activeOffsetValue=endlessPlugin._setActiveOffset();
			});

			Assert.Equal(endlessPlugin.activeOffset,95);
		}
	}


	[Fixture]
	function GetBoundaries(){

		[Fact]
		function ReturnsBoundaries(){
			var endlessPlugin,
				actual,
				expected={
					top: 40,
					bottom: -10
				};

			windowMock(function(){
				endlessPlugin=new window.__S.plugins.Endless();
				endlessPlugin.activeOffset=-10;

				actual=endlessPlugin._getBoundaries(-20,-20);
			});

			Assert.Equal(expected,actual);
		}

	}

}