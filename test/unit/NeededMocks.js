Function.RegisterNamespace("Test.Scroller");
[Import("/Users/ndandekar/scroller/test/unit/Stubs.Dom.js")]

Test.Scroller.NeededMocks={
	getWindowMock:function(){
		return Mocks.GetMock(Object.Global(),"window",
			Stubs.GetObject({
				/* methods */
				getComputedStyle:function(element){
					return element.CSSStyleDeclaration;
				},
				setTimeout:function(fn,delay){
					fn();
					return Date.now();
				},
				clearTimeout:function(id){
					return true;
				},
				addEventListener:function(type,fn,capture){},
				removeEventListener:function(type,fn,capture){},
				requestAnimationFrame:function(callback){
					callback();
					return Date.now();
				},
				cancelAnimationFrame:function(id){},
				appendChild:function(c){}
			},{
				/* properties */
				document:{
					documentElement:{
						style:{}
					},
					createElement:function(tagName){
						return Test.Scroller.Dom.GetNode({
							style:{height:'',width:''},
							tagName:tagName,
							getElementsByClassName:function(_class){
								return [];
							}
						});
					},
					createDocumentFragment:function(){
						return Test.Scroller.Dom.GetNode({style:{height:'',width:''}});
					},
					querySelector:function(s){
						return {};
					}
				},
				navigator:{
					msPointerEnabled:{}
				},
				console:{
					log:function(){}
				},
				DEBUG:{
					log:function(){}
				},
				//pull this __S.support out into respective file from here
				__S:{
					support:{}
				}

			})
		);
	},
};