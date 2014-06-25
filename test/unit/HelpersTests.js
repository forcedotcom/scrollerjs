Function.RegisterNamespace("Test.Scroller");
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.Helpers=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();

	windowMock(function(){
		[Import("/Users/ndandekar/scroller/src/utils/helpers.js")]
	});

	[Fixture]
	function MergesTwoObjects(){

		[Fact,Data(
			{
				obj1:{0: "0", 1: "1", 2: "2", fObj1: function(){}},
				obj2:{0: "00", 3: "3", 4: "4", fObj2: function(){}},
				expected:{0: "00", 1: "1", 2: "2", 3: "3", 4: "4", fObj1: function(){}, fObj2: function(){}}
			},
			{
				obj1:{'': ''},
				obj2:{},
				expected:{'': ""}
			}
		)]
		function MergeObjects(data){
			//Arrange
			var obj1=data.obj1,
				obj2=data.obj2,
				expected=data.expected,
				actual;
			
			//Act
			windowMock(function(){
				actual=window.__S.helpers.simpleMerge(obj1,obj2);
			});

			//Assert
			Assert.Equal(expected,actual);
		}

		[Fact]
		function ReturnsEmptyObject(){
			var expected={},
				actual;

			//Act
			windowMock(function(){
				actual=window.__S.helpers.simpleMerge();
			});

			//Assert
			Assert.Equal(expected,actual);
		}
	}
}