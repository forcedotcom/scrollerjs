Function.RegisterNamespace("Test.Scroller");

Test.Scroller.Dom=new function(){
    var stubDom = this;

    this.GetNode=function(properties,attributes,childNodes,nodeName,nodeType){
        attributes=Object.Copy({},attributes||{});
        childNodes=Array.Copy(childNodes||[]);

        var node=Stubs.GetObject({
            appendChild:function(child){
                assignReferences(this.childNodes[this.childNodes.length - 1], undefined, child);
                assignReferences(child, this.childNodes[this.childNodes.length - 1], null, this);
                this.childNodes.push(child);
                resetChildPointers(this);
                return child;
            },
            blur: {},
            cloneNode: function(deep){
                return stubDom.GetNode(Object.Copy({}, this, { baseURI: 1, nodeValue: null,ownerDocument: null,textContent: ''}),attributes,deep?this.childNodes:null,this.nodeName,this.nodeType);
            },
            focus: {},
            getAttribute:function(name){return attributes[name]||null;},
            hasChildNodes:function(){return this.childNodes.length>0;},
            insertBefore: function (newElement, referenceElement) {
                if(!referenceElement)return this.appendChild(newElement);
                for(var i=0;i<this.childNodes.length;i++){
                    if(this.childNodes[i]==referenceElement){
                        assignReferences(newElement,referenceElement.previousSibling, referenceElement, this);
                        assignReferences(referenceElement,newElement);
                        this.childNodes.splice(i,0,newElement);
                        resetChildPointers(this);
                        return newElement;
                    }
                }
                throw new Error("Stubs.Dom.GetNode.insertBefore: 'referenceElement' was not found in the childNodes collection.");
            },
            removeChild:function(child){
                for (var i = 0; i < this.childNodes.length; i++) {
                    if (this.childNodes[i] == child) {
                        assignReferences(this.childNodes[i-1],undefined,this.childNodes[i+1]||null);
                        assignReferences(this.childNodes[i+1],this.childNodes[i-1]||null);
                        assignReferences(child,null,null,null);
                        this.childNodes.splice(i, 1);
                        resetChildPointers(this);
                        return child;
                    }
                }
                throw new Error("Stubs.Dom.GetNode.removeChild: 'child' was not found in the childNodes collection.");
            },
            replaceChild: function (newChild,oldChild) {
                for (var i = 0; i < this.childNodes.length; i++) {
                    if (this.childNodes[i] == oldChild) {
                        assignReferences(this.childNodes[i - 1], undefined, newChild);
                        assignReferences(this.childNodes[i + 1], newChild);
                        assignReferences(newChild, this.childNodes[i - 1]||null, this.childNodes[i + 1]||null, this);
                        assignReferences(oldChild, null, null, null);
                        this.childNodes[i]=newChild;
                        resetChildPointers(this);
                        return oldChild;
                    }
                }
                throw new Error("Stubs.Dom.GetNode.replaceChild: 'oldChild' was not found in the childNodes collection.");
            },
            setAttribute:function(name,value){attributes[name]=value;},
            addEventListener:function(type,fn,capture){},
            removeEventListener:function(type,fn,capture){}
        },Object.Copy({
            baseURI:'',
            childNodes:childNodes,
            children:childNodes,
            firstChild:null,
            lastChild:null,
            nextSibling:null,
            nodeName:nodeName||'DIV',
            nodeType:nodeType||1,
            nodeValue:null,
            ownerDocument:null,
            parentElement: null,
            parentNode:null,
            previousSibling:null,
            textContent:''
        }, properties||{}));
        for(var i=0;i<childNodes.length;i++){
            assignReferences(childNodes[i],childNodes[i-1]||null,childNodes[i+1]||null,node);
        }
        resetChildPointers(node);
        return node;
    };

    this.GetXhr=function(response,headers,status,statusText){
        if(!response)response='';
        headers=Object.Copy({},headers||{});
        return Stubs.GetObject({
            abort:{},
            getAllResponseHeaders:function(){return headers;},
            getResponseHeader:function(header){return headers[header]||null;},
            open: function(method, url, async, user, password){
                this.readyState=1;
                if (Object.IsType(Function, this.onreadystatechange)) {
                    this.onreadystatechange();
                }
            },
            overrideMimeType:{parameters:["mimeType"]},
            send: function (data) {
                for(var i=2;i<=4;i++){
                    this.readyState = i;
                    if (Object.IsType(Function, this.onreadystatechange)) {
                        this.onreadystatechange();
                    }
                }
            },
            setRequestHeader:function(header,value){headers[header]=value;}
        }, {
            readyState: 0,
            response: response,
            responseText: response,
            responseType: '',
            responseXML: response,
            status: status||200,
            statusText: statusText||"200 OK"
        });
    }

    // Private Methods
    function assignReferences(target, previous, next, parent) {
        if (target) {
            if(previous!==undefined)target.previousSibling = previous || null;
            if(next!==undefined)target.nextSibling = next || null;
            if(parent!==undefined)target.parentNode = target.parentElement = parent || null;
            target.ownerDocument=target.parentNode && target.parentNode.ownerDocument || null;
        }
    }

    function resetChildPointers(target){
        if(target){
            target.firstChild=target.childNodes[0]||null;
            target.lastChild=target.childNodes[target.childNodes.length-1]||null;
        }
    }

}