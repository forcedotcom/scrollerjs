//instantiation
//destroy
//_start
//_move
//_end
	//_pos
	//_posRAF
	//_transitionTime
	//_transitionEasing
	//getCurrentSizes
	//getVirtualScrollSize
	//getVirtualMaxSize

//Indicators.addIndicator
Function.RegisterNamespace("Test.Scroller");
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.IndicatorsPluginTests=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();
	windowMock(function(){
		window.__S.plugins={};
		window.__S.styles={transform:'',transformDuration:'',transitionTimingFunction:''};
		Import("/Users/chethana.paniyadi/scroller/src/utils/helpers.js");
		Import("/Users/chethana.paniyadi/scroller/src/indicators-plugin.js");
	});

	[Fixture]
	function AddIndicator(){

		[Fact]
		function CreatesAnIndicator(){

			var indicatorsPlugin,
				refreshMock,
				expectedOpts = {
					disableTouch:false,
					disablePointer:false,
					disableMouse:false,
					interactive:true,
					resize:true,
					snap:true,
					scrollbars:true
				},
				actualOpts,
				scrollerWrapper = Test.Scroller.Dom.GetNode({id:'scroller-wrapper'}, null, 
					[Test.Scroller.Dom.GetNode({id:'indicator', style:{}})]),
				scroller = Test.Scroller.Dom.GetNode({id:'scroller'},null,[Test.Scroller.Dom.GetNode()]);

			windowMock(function(){
				indicatorsPlugin = new window.__S.plugins.Indicators();
				indicatorsPlugin.wrapper = scrollerWrapper;
				scroller._indicators=[];

				indicatorsPlugin.addIndicator.apply(scroller, [scrollerWrapper,expectedOpts]);
				expectedOpts.el=scrollerWrapper;
				actualOpts = scroller._indicators[0].opts;
			});

			Assert.Equal(expectedOpts,actualOpts);

		}
	}

	[Fixture]
	function Position(){

		[Fact,Data(
			{
				inputX:0, inputY:-100, scrollerX:0, scrollerY:-50, scrollVertical:true, expectedPoint:{x:0,y:0}
			},
			{
				inputX:-100, inputY:0, scrollerX:0, scrollerY:-50, scrollVertical:true, expectedPoint:{x:0,y:0}
			},
			{
				inputX:100, inputY:100, scrollerX:0, scrollerY:-50, scrollVertical:false, expectedPoint:{x:-1000,y:-50}
			}
		)]
		function CallRAFwithXY(data){
			var indicatorsPlugin,
				refreshMock,
				expectedOpts = {},
				actualPoint={x:0,y:0},
				scrollToMock,
				scrollerWrapper = Test.Scroller.Dom.GetNode({id:'scroller-wrapper'}, null, 
					[Test.Scroller.Dom.GetNode({id:'indicator', style:{}})]),
				scroller = Test.Scroller.Dom.GetNode({id:'scroller'},[Test.Scroller.Dom.GetNode()]);
				scroller.x = data.scrollerX;
				scroller.y = data.scrollerY;
				scroller.scrollVertical = data.scrollVertical;

			windowMock(function(){
				indicatorsPlugin = new window.__S.plugins.Indicators();
				indicatorsPlugin.wrapper = scrollerWrapper;
				scroller._indicators=[];

				indicatorsPlugin.addIndicator.apply(scroller, [scrollerWrapper,expectedOpts]);
				expectedOpts.el=scrollerWrapper;

				scrollToMock=Mocks.GetMock(scroller,"scrollTo",function(x,y){
					actualPoint.x = x;
					actualPoint.y = y;
				});

				scrollToMock(function(){
					scroller._indicators[0]._pos(data.inputX,data.inputY);
				});
				
			});

			Assert.Equal(data.expectedPoint,actualPoint);
		}
	}

	[Fixture]
	function CurrentSizes(){

		[Fact,Data(
			{
				scrollerX:10,
				scrollerY:20,
				scrollVertical:false,
				wrapperHeight:100,
				wrapperWidth:200,
          		expectedSize: { virtual:1, wrapperSize:200, maxScroll:10 }
			},
			{
				scrollerX:10,
				scrollerY:20,
				scrollVertical:true,
				wrapperHeight:10,
				wrapperWidth:20,
          		expectedSize: { virtual:1, wrapperSize:10, maxScroll:20 }
			}
		)]

        function GetCurrentSizes(data){
			//Arrange
			 var indicatorsPlugin,
		     	 expectedOpts = {},
		     	 expectedSize = data.expectedSize,
		     	 actualSize,
		     	 indicator = {
		     	 	wrapperHeight:0,
		     	 	wrapperWidth:0
		     	 },
		     	scrollerWrapper = Test.Scroller.Dom.GetNode({id:'scroller-wrapper'}, null, 
			 		[Test.Scroller.Dom.GetNode({id:'indicator', style:{}})]),
			 	scroller = Test.Scroller.Dom.GetNode({id:'scroller'},[Test.Scroller.Dom.GetNode()]);
			 	scroller.maxScrollX = data.scrollerX;
			 	scroller.maxScrollY = data.scrollerY;
			 	scroller.scrollVertical = data.scrollVertical;
				
            	
		     windowMock(function(){
			 	indicatorsPlugin = new window.__S.plugins.Indicators();
			 	indicatorsPlugin.wrapper = scrollerWrapper;
				scroller._indicators=[];
                
             	indicatorsPlugin.addIndicator.apply(scroller, [scrollerWrapper, expectedOpts]);
             	expectedOpts.el=scrollerWrapper;
                indicator = scroller._indicators[0];
                indicator.wrapperHeight = data.wrapperHeight;
				indicator.wrapperWidth = data.wrapperWidth;
			 });

	    	//Act
     		actualSize = indicator.getCurrentSizes();

     		//Assert
            Assert.Equal(expectedSize,actualSize);

		}
	}

	[Fixture]
	function VirtualScrollSize(){
		//getVirtualScrollSize
		[Fact,Data(
			{
				scrollerY:20,
				virtualSizeY:0,
				wrapperHeight:100,
          		expectedSize: 20
			},
			{
				scrollerY:20,
				virtualSizeY:200,
				wrapperHeight:100,
          		expectedSize: 200
			}
		)]
		function GetVirtualScrollSize(data){
			//Arrange
			var indicatorsPlugin,
				expectedOpts = {},
		   	    expected = data.expectedSize,
		   	    actual,
                indicator = {
                	wrapperHeight:0,
                	virtualSizeY:0,

                },
        		scrollerWrapper = Test.Scroller.Dom.GetNode({id:'scroller-wrapper'}, null, 
					[Test.Scroller.Dom.GetNode({id:'indicator', style:{}})]),
				scroller = Test.Scroller.Dom.GetNode({id:'scroller'},[Test.Scroller.Dom.GetNode()]);
            	scroller.maxScrollY = data.scrollerY;
            	scroller.scrollVertical = true;
			
			windowMock(function(){
				indicatorsPlugin = new window.__S.plugins.Indicators();
				indicatorsPlugin.wrapper = scrollerWrapper;
				scroller._indicators=[];

            	indicatorsPlugin.addIndicator.apply(scroller, [scrollerWrapper, expectedOpts]);
            	expectedOpts.el=scrollerWrapper;
            	indicator = scroller._indicators[0];
                indicator.wrapperHeight = data.wrapperHeight;
                indicator.virtualSizeY = data.virtualSizeY;
			});

			//Act
			actual = scroller._indicators[0].getVirtualScrollSize();
           
			//Assert
			Assert.Equal(expected,actual);
		}
	}

	[Fixture]
	function VirtualMaxSize(){
		//getVirtualScrollSize
		[Fact,Data(
			{
				scrollerY:20,
				virtualSizeY:0,
				scrollSize:200,
				wrapperHeight:300,
          		expectedSize: 20
			},
			{
				scrollerY:-Infinity,
				virtualSizeY:0,
				scrollSize:200,
				wrapperHeight:300,
          		expectedSize: -200
			}
		)]
		function GetVirtualMaxSize(data){
			//Arrange
			var indicatorsPlugin,
				expectedOpts = {},
		   	    expected = data.expectedSize,
		   	    actual,
                indicator = {
                	wrapperHeight:0,
                	virtualSizeY:0,

                },
        		scrollerWrapper = Test.Scroller.Dom.GetNode({id:'scroller-wrapper'}, null, 
					[Test.Scroller.Dom.GetNode({id:'indicator', style:{}})]),
				scroller = Test.Scroller.Dom.GetNode({id:'scroller'},[Test.Scroller.Dom.GetNode()]);
            	scroller.maxScrollY = data.scrollerY;
            	scroller.scrollVertical = true;
			
			windowMock(function(){
				indicatorsPlugin = new window.__S.plugins.Indicators();
				indicatorsPlugin.wrapper = scrollerWrapper;
				scroller._indicators=[];

            	indicatorsPlugin.addIndicator.apply(scroller, [scrollerWrapper, expectedOpts]);
            	expectedOpts.el = scrollerWrapper;
            	indicator = scroller._indicators[0];
                indicator.wrapperHeight = data.wrapperHeight;
                indicator.virtualSizeY = data.virtualSizeY;
			});

			//Act
			actual=scroller._indicators[0].getVirtualMaxSize(data.scrollSize);
           
			//Assert
			Assert.Equal(expected,actual);
		}
	}	
}
