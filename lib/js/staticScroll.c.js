function ScrollItem(container, onEnter, onLeave){
	this.container=(container)?container:document.createElement("div");
	this.onEnter=onEnter;
	this.onLeave=onLeave;
	this.isCurrentlyDisplayed=false;
	
	this.enter=function(){
		this.isCurrentlyDisplayed=true;
		this.onEnter && this.onEnter();
	}
	this.leave=function(){
		this.isCurrentlyDisplayed=false;
		this.onLeave && this.onLeave();
	}
}

function StaticScroll(container, list){
	var self=this;
	this.container=container?container:document.createElement("div");
	this.interval=this.container.offsetHeight?this.container.offsetHeight*4/7:200;
	this.marker=document.createElement("div");
	this.list=list?list:[];
	this.currentItem;
	
	this.addScrollItem=function(scrollItem){
		this.list.push(scrollItem);
	}
	
	this.display=function(){
		this.marker.innerText=".";
		this.marker.style.cssText="position: absolute;"+
			"visibility: hidden;"+
			"top: "+(this.interval*this.list.length)+"px;"+
			"height: "+this.interval+"px";
		this.container.style.cssText=""+
			"overflow-y: auto;";
		this.currentItem=this.list[0];
		this.currentItem.enter();
	}
	
	this.container.addEventListener("scroll",function(){
		if(!self.list.length){return;}
		let position=self.container.scrollTop;
		let current=self.list[Math.floor(position/self.interval)];
		if(!current || current==self.currentItem){return;}
		window.requestAnimationFrame(()=>{
			if(self.currentItem){self.currentItem.leave();}
			self.currentItem=current;
			self.currentItem.enter();
		});
	});
	
	this.container.appendChild(this.marker);
	if(list.length){this.display();}
}