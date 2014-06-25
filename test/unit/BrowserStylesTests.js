Function.RegisterNamespace("Test.Scroller");
[Import("NeededMocks.js")]

[Fixture]
Test.Scroller.BrowserStyles=function(){

	var windowMock=Test.Scroller.NeededMocks.getWindowMock();

	windowMock(function(){
		[Import("/Users/ndandekar/scroller/src/utils/browser-styles.js")]
	});

	[Fixture]
	function GetsElementHeight(){
		
		[Fact,Data(
			{value:{marginTop:"5px",marginBottom:"20px",offsetHeight:-10,offsetWidth:-20},expected:15},
			{value:{marginTop:"0px",marginBottom:"0px",offsetHeight:0,offsetWidth:0},expected:0}
		)]
		function ReturnsHeightForValidElement(data){
			//Arrange
			var actual, expected=data.expected;
			var el=Stubs.GetObject({},{
				CSSStyleDeclaration:{
					marginTop:data.value.marginTop,
					marginBottom:data.value.marginBottom
				},
				offsetHeight:data.value.offsetHeight,
				offsetWidth:data.value.offsetWidth
			});
			
			//Act
			windowMock(function(){
				actual=window.__S.styles.getHeight(el);
			});

			//Assert
			Assert.Equal(expected,actual);

		}

		[Fact]
		function ThrowsIfElementUndefined(){
			//Arrange
			var actual;

			//Act
			windowMock(function(){
				Record.Exception(function(){
					actual=window.__S.styles.getHeight();
				});		
			});
			
			//Assert
			Assert.NotUndefined(actual);
			
		}


	}

	[Fixture]
	function GetsElementWidth(){
		
		[Fact,Data(
			{value:{marginRight:"5px",marginLeft:"20px",offsetHeight:-10,offsetWidth:-20},expected:5},
			{value:{marginRight:"0px",marginLeft:"0px",offsetHeight:0,offsetWidth:0},expected:0}
		)]
		function ReturnsWidthForValidElement(data){
			//Arrange
			var actual, expected=data.expected;
			var el=Stubs.GetObject({},{
				CSSStyleDeclaration:{
					marginRight:data.value.marginRight,
					marginLeft:data.value.marginLeft
				},
				offsetHeight:data.value.offsetHeight,
				offsetWidth:data.value.offsetWidth
			});
			
			//Act
			windowMock(function(){
				actual=window.__S.styles.getWidth(el);
			});

			//Assert
			Assert.Equal(expected,actual);

		}

		[Fact]
		function ThrowsIfElementUndefined(){
			//Arrange
			var actual;

			//Act
			windowMock(function(){
				Record.Exception(function(){
					actual=window.__S.styles.getWidth();
				});		
			});
			
			//Assert
			Assert.NotUndefined(actual);
			
		}


	}	
}