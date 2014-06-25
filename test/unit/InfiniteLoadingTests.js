Function.RegisterNamespace("Test.Scroller");	
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.EndlessPluginTests=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();
	windowMock(function(){
		window.__S.plugins={};
		Import("/Users/ndandekar/scroller/src/infinite-loading.js");
	});

	[Fixture]
	function FetchData(){

		[Fact]
		function ExecutesDataProvider(){
			var infiniteLoadingPlugin,
				expected=false;

			windowMock(function(){
				infiniteLoadingPlugin = new window.__S.plugins.InfiniteLoading();	
				infiniteLoadingPlugin.opts={
					infiniteLoadingConfig:{
						dataProvider:function(){expected=true;}	
					}
				};

				infiniteLoadingPlugin.fetchData();
			});

			Assert.True(expected);

		}

		[Fact]
		function CanExecuteTriggerCallbackToAppendItems(){
			var infiniteLoadingPlugin,
				callback,
				appendItemsMock,
				itemsLength;

			windowMock(function(){
				infiniteLoadingPlugin = new window.__S.plugins.InfiniteLoading();	
				infiniteLoadingPlugin.opts={
					infiniteLoadingConfig:{
						dataProvider:function(a,b){
							callback=arguments[0];
						}	
					}
				};

				infiniteLoadingPlugin.fetchData();
			});
			appendItemsMock=Mocks.GetMock(infiniteLoadingPlugin, "appendItems", function(items){
				itemsLength=items.length;
			});

			appendItemsMock(function(){
				callback(0,[1,2]);
			});

			Assert.True(itemsLength===2);
		}

		[Fact]
		function LocksFetchDataIfNoItems(){
			var infiniteLoadingPlugin,
				callback,
				appendItemsMock;

			windowMock(function(){
				infiniteLoadingPlugin = new window.__S.plugins.InfiniteLoading();
				infiniteLoadingPlugin._ilNoMoreData = false;
				infiniteLoadingPlugin.opts={
					infiniteLoadingConfig:{
						dataProvider:function(a,b){
							callback=arguments[0];
						}	
					}
				};

				infiniteLoadingPlugin.fetchData();
			});
			appendItemsMock=Mocks.GetMock(infiniteLoadingPlugin, "appendItems", function(items){
				
			});

			appendItemsMock(function(){
				callback(0,[]);
			});

			Assert.True(infiniteLoadingPlugin._ilNoMoreData);
		}
	}
}