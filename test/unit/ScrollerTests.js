Function.RegisterNamespace("Test.Scroller");	
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.ScrollerTest=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();

	windowMock(function(){
		window.__S.styles={transform:''};
		Import("/Users/ndandekar/scroller/src/utils/helpers.js");
		Import("/Users/ndandekar/scroller/src/utils/cubic-bezier.js");
		Import("/Users/ndandekar/scroller/src/endless-plugin.js");
		Import("/Users/ndandekar/scroller/src/scroller.js");
	});

	function match(expected,actual){
		//match key in expected
		for(var key in expected){
			if (expected.hasOwnProperty(key)) {
				//with key in scroller instance
				if(key in actual){
					var v1=actual[key],
						v2=expected[key];
			       if(!(v1===v2)){
			           Assert.Fail(key+":"+expected[key]+" does not equal "+key+":"+actual[key]);
			       }
			    }
			    else{
			    	Assert.Fail("Key not found. Key:"+key);
			    }
			}  
		}
		Assert.True(true);
	}


	[Fixture]
	function InitializeScroller(){

		function getScrollerInstance(scrollerOptions){
			var scrollerInstance,
				nodeAlias=Test.Scroller.Dom,

				childNode=nodeAlias.GetNode(
				{
					id:"scroller",
					classList:{
						add:function(token){}
					}
				},
				null,
				[nodeAlias.GetNode()]),

				wrapper=nodeAlias.GetNode(
				{	
					id:"wrapper",
					classList:{
						add:function(token){}
					}
				},
				null,
				[childNode]);
			
			windowMock(function(){
			 	scrollerInstance=new window.Scroller(wrapper, scrollerOptions);	
	    	});

			return scrollerInstance;

		}

		[Fact]
		function AttachesCorrectlyToDOM(){
			var expected={
				scrollerId:"scroller",
				parentId:"wrapper"
			},
			scrollerInstance=getScrollerInstance();

			Assert.True(
				(scrollerInstance.scroller.id===expected.scrollerId)
				&&
				(scrollerInstance.scroller.parentNode.id===expected.parentId)
			);
		}
	

		[Fact]
		function EndlessHorizontalScroll(){
			var expected={
				enabled:true,
				endless:true,
				scroll:"horizontal",
				scrollVertical:false
			},
			scrollerOptions={
				plugins:['Endless'],
				scroll:'horizontal'
			},
			scroller=getScrollerInstance(scrollerOptions);

			match(expected,scroller);
		}

		[Fact]
		function EndlessScrollWithGpuOptimization(){

			var expected={
				enabled:true,
				endless:true,
				scroll:"vertical",
				scrollVertical:true
			},
			scrollerOptions={
				itemSelector    : 'article.mam',
			    disableMouse    : false,
			    infiniteLoading : false,
			    pullToRefresh   : false,
			    pullToLoadMore  : false,
			    gpuOptimization : true,
			    plugins: ['Endless']
			},
			scroller=getScrollerInstance(scrollerOptions);

			match(expected,scroller);
		}

		[Fact]
		function EitherGpuOptimizationOrCssTransition(){

			var expected={},
			scrollerOptions={
			    gpuOptimization : true,
			    useCSSTransition:true
			},
			scroller=getScrollerInstance(scrollerOptions);

			Assert.Undefined(scroller.surfacesPositioned);
		}

		[Fact]
		function ScrollerNoOpts(){

			var expected={},
				scroller=getScrollerInstance();

			Assert.True(scroller.scroll==='vertical');
		}

		[Fact]
		function ScrollerNoWrapper(){
			var actualException,
				expectedException='some exception';

			windowMock(function(){
				actualException=Record.Exception(function(){
					new window.Scroller();
				});
			});

			Assert.Equal(expectedException,actualException);
		}
        
        [Fixture]
        function TestScrollerMathsAndCalculations(){

        	[Fact,Data(
			{
				current:10,
				start:5,
				time:5,
				expected:1
			},
			{
				current:10,
				start:10,
				time:5,
				expected:0
			}

		    )]
		    function GetVelocity(data){
			//Arrange
			var current=data.current,
			    start=data.start,
			    time=data.time,
			    expected=data.expected,
                scroller=getScrollerInstance(),
                actual;

            //Act
			actual=scroller._getVelocity(current,start,time);

			//Assert
			Assert.Equal(expected,actual);
			
		}
        
         [Fact,Data(
			{
				velocity:0.5,
				current:100,
				destination:350,
				time:1000
			},
			{
				velocity:-0.5,
				current:100,
				destination:-150,
				time:1000
			}
		)]
		function ComputeMomentum(data){
			//Arrange
            var velocity=data.velocity,
                current=data.current,
                expected={
				    destination:data.destination,
				    time:data.time
			    },
			    scroller=getScrollerInstance(),
			    actual;

            //Act
			actual=scroller._computeMomentum(velocity,current);

			//Assert
			Assert.Equal(expected,actual);	
		}

		 [Fact,Data(
			{
				start:100,
				end:200,
				velocity:5,
				current:120,
				destination:162.5,
				time:8.5
			},
			{
				start:100,
				end:100,
				velocity:5,
				current:120,
				destination:131.25,
				time:2.25
			}
		)]
		function ComputeSnap(data){
			//Arrange
            var start=data.start,
                end=data.end,
                velocity=data.velocity,
                current=data.current,
                expected={
				    destination:data.destination,
				    time:data.time
			    },
			    scroller=getScrollerInstance(),
			    actual;

            //Act
			actual=scroller._computeSnap(start,end,velocity,current);

			//Assert
			Assert.Equal(expected,actual);

		}
		
		
		 [Fact,Data(
			{
				current:120,
				start:100,
				duration:5,
				lowerMargin:100,
				wrapperSize:10,
				destination:2.5,
				time:29.375,
				bounce:'cubic-bezier(0.33, 0.33, 0.66, 0.81)'
			},
			{
				current:120,
				start:10,
				duration:5,
				lowerMargin:10,
				wrapperSize:10,
				destination:13.75,
				time:4.829545454545454,
				bounce:'cubic-bezier(0.33, 0.33, 0.66, 0.81)'
			}
		)]
		function Momentum(data){
			//Arrange
            var current=data.current,
                start=data.start,
                duration=data.duration,
                lowerMargin=data.lowerMargin,
                wrapperSize=data.wrapperSize,
                expected={
				    destination:data.destination,
				    time:data.time,
				    bounce:data.bounce
			    },
			    scroller=getScrollerInstance(),
			    actual;

            //Act
			actual=scroller._momentum(current,start,duration,lowerMargin,wrapperSize);
			
			//Assert
			Assert.True((expected.destination===actual.destination) && (expected.time===actual.time) && (expected.bounce===actual.bounce.fn.toString()));
		}

        }

		// window.s = new Scroller('#wrapper', {
		//     itemSelector    : 'article.mam',
		//     disableMouse    : false,
		//     infiniteLoading : false,
		//     pullToRefresh   : true,
		//     pullToLoadMore  : true,
		//     gpuOptimization : true,
		//     onPullToRefresh  : ptr
		//     //plugins: ['Endless']
		// });

		// window.s = window.scroller = 
		//     new Scroller('.scroller-wrapper', {
		//         itemSelector     : 'article.mam',
		//         disableMouse     : false,
		//         useCSSTransition : false,
		//         gpuOptimization  : true,
		//         infiniteLoading  : false,
		//         //hints
		//         //itemHeight       : 310,
		//         //itemWidth        : 320
		//         snap             : 'sticky',
		//         pullToRefresh    : false,
		//         pullToLoadMore   : false,
		//         scroll           : 'horizontal',
		//         plugins          : ['Endless', 'Snap']
		// });

		
		//add tests to see if the Plugins work
		//people can add new plugins

		//_getVelocity
		//_computeMomentum
		//_computeSnap
		//_momentum

		//tests if hooks work
		
	}


}