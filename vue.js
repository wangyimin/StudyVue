(function (global, factory) {
  global.Vue = factory();
}(this, (function () { 
 /**
   container of store subscribers
 */
 function Dep(){
   this.subs=[];
 }
 
 Dep.prototype={
   addSub:function(sub){
     this.subs.push(sub);
   },
   notify:function(){
     this.subs.forEach(function(sub){
       sub.update();
     })
   }
 }
 
 /** 
   watcher
 */
 function Watcher(vm,node,name){
   Dep.target=this;
   this.name=name;
   this.node=node;
   this.vm=vm;
 
   this.update();
   Dep.target=null;
 }
 
 Watcher.prototype={
   update:function(){
     this.get();
     this.node.nodeValue=this.value;
   },
   get:function(){
     this.value=this.vm[this.name]
   }
 }
 
 function node2Fragment(node,vm){
   var flag=document.createDocumentFragment();
   var child;
   while(child=node.firstChild){
     compile(child,vm);
     flag.appendChild(child)
   }
   return flag;
 }
 
 /** 
   find child node with specific attribute name
   1. add trigger to call update process of subscribers
   2. add watcher to monitor any value change 
 */
 function compile(node,vm){
   var reg=/\{\{(.*)\}\}/;
   if(node.nodeType===1){
     var attr=node.attributes;
     for(var i=0;i<attr.length;i++){
       if(attr[i].nodeName=='v-model'){
         var name=attr[i].nodeValue;
         
         node.addEventListener('input',function(e){
           vm[name]=e.target.value;
         });
 
         node.value=vm.data[name];
       }
     }
   };
   
   if(node.nodeType===3){
     if(reg.test(node.nodeValue)){
       var name=RegExp.$1;
       name=name.trim();
       //node.nodeValue=vm.data[name];
       new Watcher(vm,node,name); 
     }
   }
 }
 
 /**
   setup trigger of getter and setter
 */
 function defineReactive(obj,key,val){
   var dep=new Dep();
 
   Object.defineProperty(obj,key,{
     get:function(){
       if(Dep.target) dep.addSub(Dep.target)
         return val
       },
 
     set:function(newVal){
       if(newVal===val) return;
         val=newVal;
         dep.notify();
       }
     })
 }
 
 function observe(obj,vm){
   Object.keys(obj).forEach(function(key){
     defineReactive(vm,key,obj[key])
   })
 }
 
 function Vue(options){
   this.data=options.data;
   var id=options.el;
 
   var data=this.data;
   observe(data,this);
 
   var dom=node2Fragment(document.getElementById(id),this);
   document.getElementById(id).appendChild(dom)
 }
 
 return Vue;
})));