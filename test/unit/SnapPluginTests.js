Function.RegisterNamespace("Test.Scroller");
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.SnapPluginTests=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();
	windowMock(function(){
		window.__S.plugins={};
		window.__S.styles={transform:''};
		window.__S.helpers={};
		window.__S.constructor={ 
			EASING : {
            	bounce : 'CubicBezier(0.33, 0.33, 0.66, 0.81)'
            }
      
        };
		Import("/Users/chethana.paniyadi/scroller/src/snap-plugin.js");
	});
	var snapPlugin;

 	windowMock(function(){
   		snapPlugin = new window.__S.plugins.Snap();
  	}); 

	[Fixture]
	function GetSnapDimensions(){

		[Fact, Data(
			{
				itemHeight:10, wrapperHeight: null, expected: 10
			},
			{
				itemHeight:null, wrapperHeight:12, expected: 12
			},
			{
				itemHeight:8, wrapperHeight:12, expected: 8
			}
		)]
		function GetsVerticalSnapSize(data){
			//Arrange
			var expected = data.expected,
				actual = 0;
			snapPlugin.itemHeight = data.itemHeight;
			snapPlugin.wrapperHeight = data.wrapperHeight;

			//Act
			actual = snapPlugin._getSnapSize(true);

			//Assert
			Assert.Equal(actual,expected);
		}

		[Fact, Data(
			{
				itemWidth: 12, wrapperWidth: null, expected: 12
			},
			{
				itemWidth: null, wrapperWidth: 10, expected: 10
			},
			{
				itemWidth: 10, wrapperWidth: 12, expected: 10
			}
		)]
		function GetsHorizontalSnapSize(data){
			//Arrange
			var expected = data.expected,
				actual = 0;
			snapPlugin.itemWidth = data.itemWidth ;
			snapPlugin.wrapperWidth = data.wrapperWidth;

			//Act
			actual = snapPlugin._getSnapSize(false);

			//Assert
			Assert.Equal(actual,expected);
		}

		[Fact, Data(
		{ itemHeight:10, distY:10, initY:20, expected: { dist:10, init:20, snapSize:10, minSnap: 5 }
		},
		{
			itemHeight:10, distY:10, initY:20, expected: { dist:10, init:20, snapSize:10, minSnap: 5 }
		}
		)]
		function GetsVerticalSnapPosition(data){
			//Arrange
			var expected = data.expected,
				actual = { snapSize:0, dist:0, init:0, minSnap:0 };

			snapPlugin.itemHeight = data.itemHeight;
			snapPlugin.scrollVertical = true;
			snapPlugin.distY = data.distY;
			snapPlugin.initY = data.initY;

			//Act
			actual = snapPlugin._getSnapPosition(data.scrollVertical);

			//Assert
			Assert.Equal(actual,expected);
		}

		[Fact, Data(
		{  
			itemWidth: 12, distX:30, initX:40,
		 	expected: { dist:30, init:40, snapSize:12, minSnap: 6 }
		},
		{
			itemWidth: 12, distX:30, initX:-40.98,
			expected: { dist:30, init:-40.98, snapSize:12, minSnap: 6 }
		}
		)]
		function GetsHorizontalSnapPosition(data){
			//Arrange
			var expected = data.expected,
				actual = { snapSize:0, dist:0, init:0, minSnap:0 };

			snapPlugin.itemWidth = data.itemWidth;
			snapPlugin.scrollVertical = false;
			snapPlugin.distX = data.distX;
			snapPlugin.initX = data.initX;

			//Act
			actual = snapPlugin._getSnapPosition(false);

			//Assert
			Assert.Equal(actual,expected);
		}
	}

	[Fixture]
	function SnapMomentum(){ 
		var fnMocks=Mocks.GetMocks(snapPlugin,{
		 	"_getVelocity":function(current,start,duration){
				return 4;
			},
			"_computeSnap":function(start,end,velocity,current){
				return {
					destination:9,
					time :10
				};
			},
			"_computeMomentum":function(velocity,current){
				return {
					destination:9,
					time :10,
					bounce:'Cubic-Bezier(0.33, 0.33, 0.66, 0.81)'
				};
			},
			"_getSnapPosition":function(){
				return {
					dist:30, init:40, snapSize:12, minSnap: 50
				};
			}
	  	});

		[Fact]
		function GetsMomentumSnapStickyWithSnapBack(){
			//Arrange
			var expected = { destination: 36, time: 200,snapBack:true },
				actual = { destination:0, time:0, snapBack:false },
				mock = Mocks.GetMocks(snapPlugin,{
					"_momentumSnapSoft":function(current, start, duration, lowerMargin, wrapperSize){
						var momentum;
						return momentum = {
							destination:9,
							time:20
						};
					}
				});
			//Act
			fnMocks(function(){
				mock(function(){
					actual = snapPlugin._momentumSnapSticky(0,0,0,0,0);
				});
			});
			//Assert
			Assert.Equal(expected, actual)

		} 
		[Fact]
		function GetsMomentumSnapStickyWithoutSnapBack(data){
			//Arrange
			var expected = { destination: 24, time:6 },
				actual = { destination:0,time:0 },
				mock = Mocks.GetMocks(snapPlugin,{
					"_momentumSnapSoft":function(current, start, duration, lowerMargin, wrapperSize){
						var momentum;
						return momentum = {
							destination:-100,
							time:20
						};
					}
				});
			//Act
			
			fnMocks(function(){
				mock(function(){
					actual = snapPlugin._momentumSnapSticky(0,0,0,0,0);
				});
			});
			//Assert
			Assert.Equal(expected, actual)

		}
		[Fact,Data(
			{
				lowerMargin:0, destination:0, endless:false,
				expected: {destination:0, time:200}
			},
			{
				lowerMargin:200, destination:200, endless:true,
				expected: {destination:204, time:51}
			}
		)]
		function GetsMomentumSnapSoftWithoutBounce(data){
			//Arrange
			var expected = data.expected,
				actual = { destination:0, time:0 },
				lowerMargin= data.lowerMargin,
				mock=Mocks.GetMocks(snapPlugin,{
					"_computeMomentum":function(velocity,current){
						return {
							destination:data.destination,
							time :10,
						};
					}
				});
			//Act
			fnMocks(function(){
				mock(function(){
					snapPlugin.endless=data.endless;
					actual = snapPlugin._momentumSnapSoft(0,0,0,lowerMargin,0);
				});
			});

			//Assert
			Assert.Equal(expected, actual);

		} 
		[Fact]
		function GetsMomentumSnapSoftWithoutEndless(){
			//Arrange
			var expected = { destination: 9, time: 10, bounce:'CubicBezier(0.33, 0.33, 0.66, 0.81)'},
				actual = { destination:0, time:0, bounce:' ' };

			//Act
			fnMocks(function(){
				snapPlugin.endless=false;
				actual = snapPlugin._momentumSnapSoft(0, 0, 0, 0, 0);
			});

			//Assert
			Assert.Equal(expected, actual);

		} 
		[Fact]
		function GetsMomentumSnapSoftWithEndlessPlugin(){
			//Arrange
			var expected = { destination: 9, time: 10, bounce:'CubicBezier(0.33, 0.33, 0.66, 0.81)'},
				actual = { destination:0, time:0, bounce:' ' },
				lowerMargin=100;
			//Act
			fnMocks(function(){
				actual = snapPlugin._momentumSnapSoft(0,0,0,lowerMargin,0);
			});

			//Assert
			Assert.Equal(expected, actual);

		} 
		[Fact]
		function CallsMomentumStickySnap(){
			//Arrange
			var actual = { _momentumSnapSticky_called:false},
				mock=Mocks.GetMocks(snapPlugin,{
					"_momentumSnapSticky":function(current, start, duration, lowerMargin, wrapperSize){
						return {
							_momentumSnapSticky_called:true
						};
					}
				});
			//Act
			mock(function(){
	            snapPlugin.opts={
	             	snap:'sticky'
	            };
	            actual = snapPlugin._momentum();
      		});
			//Assert
			Assert.True(actual._momentumSnapSticky_called);
		}
		[Fact]
		function CallsMomentumSoftSnap(){
			//Arrange
			var actual = { _momentumSnapSoft_called:false},
				mock=Mocks.GetMocks(snapPlugin,{
					"_momentumSnapSoft":function(current, start, duration, lowerMargin, wrapperSize){
						return {
							_momentumSnapSoft_called:true
						};
					}
				});
			//Act
			mock(function(){
	            snapPlugin.opts={
	             	snap:'soft'
	            };
	            actual = snapPlugin._momentum();
      		});
			//Assert
			Assert.True(actual._momentumSnapSoft_called);
		}
	} 
}
