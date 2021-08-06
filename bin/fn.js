function loadScript(path, callback){
	let head=document.getElementsByTagName("head")[0];
	let script=document.createElement("script");
	script.src=path;
	script.onload=callback;
	head.appendChild(script);
}

var animationDuration=2;

function charSeparate(string){
	var output=document.createDocumentFragment();
	let a=string.split("");
	for(i in a){
		let span=document.createElement("span");
		span.innerText=a[i];
		span.style.setProperty("--delay",((((i*animationDuration)-.6)/string.length)-.6)+"s");
		output.appendChild(span);
	}
	return output;
}

function onEnter(element){
	let content=document.getElementById("content");
	element.classList.add("enter");
	content.appendChild(element);
	content.style.backgroundColor=element.backgroundColor;
	setTimeout(
		function(){
			element.classList.remove("enter");
		}
		,animationDuration*1000
	);
}
function onLeave(element){
	let content=document.getElementById("content");
	element.classList.add("leave");
	setTimeout(
		function(){
			if(content.contains(element)){content.removeChild(element);}
			element.classList.remove("leave");
		}
		,animationDuration*1000
	);
}

function makePage(input){
	let output=document.createElement("div");
	if(input.title){
		let title=document.createElement("h3");
		title.appendChild(charSeparate(input.title));
		output.appendChild(title);
	}
	if(input.link){
		let link=document.createElement("a");
		link.href=(input.link.indexOf("@")>-1)?"mailto:"+input.link:input.link;
		link.appendChild(charSeparate(input.link));
		output.appendChild(link);
	}
	if(input.description){
		let description=document.createElement("p");
		description.innerHTML=input.description;
		output.appendChild(description);
	}
	if(input.note){
		let note=document.createElement("p");
		note.classList="note";
		note.innerHTML=input.note;
		output.appendChild(note);
	}
	if(input.image){
		let image=document.createElement("img");
		image.src=input.image;
		if(input.link){
			let imageLink=document.createElement("a");
			imageLink.href=(input.link.indexOf("@")>-1)?"mailto:"+input.link:input.link;
			imageLink.appendChild(image);
			image=imageLink;
		}
		image.classList="thumbnail";
		output.appendChild(image);
	}
	output.backgroundColor=input.backgroundColor;
	return output
}
var copy=[
	makePage({
		title:"Josh Wilson"
		,link: "joshuaahwilson@gmail.com"
		,description:"I'm a teacher who learned how to develop full-stack web applications to make tools for myself as the need has arisen over the years.  Here are some of the projects that I've been working on recently."
		,note: ""
		,image: ""
		,backgroundColor:"#f7ee83"
	})
	,makePage({
		title:"Learning Management/Student Information System"
		,link: "https://utilities.nlps.tyc.edu.tw"
		,description:"This is a collaborative workspace in use by several teachers and hundreds of students across multiple locations in my district.  Features include sending and receiving homework, class lists, seating charts, gradebooks, student profiles, planning and scheduling, chat, and more.  This proved to be very useful during the COVID-19 pandemic. (login required)"
		,note: "Technology stack: JavaScript, PHP, SQL, HTML, CSS, Node.js"
		,image: "lms.jpg"
		,backgroundColor:"#f7c89c"
	})
	,makePage({
		title:"Spells"
		,link: "https://coffeephilic.github.io/spells"
		,description:"This a collaboration with board game developer Charlie McCarron.  It's a turn-based crossword game in which players compete for points by filling in a crossword one letter at a time."
		,note: "Technology stack: JavaScript, HTML, CSS"
		,image: "spells.jpg"
		,backgroundColor:"#90acf8"
	})
	,makePage({
		title:"Text Analysis"
		,link: "https://utilities.nlps.tyc.edu.tw/utilities/text_analysis"
		,description:"This is a utility for checking the complexity of a text.  The application automatically highlights text based on word length and sentence length, and checks vocabulary against a selection of word lists."
		,note:"Technology stack: JavaScript, HTML, CSS"
		,image: "text_analysis.jpg"
		,backgroundColor:"#cde6aa"
	})
	,makePage({
		title:"Classroom Games"
		,link: "https://utilities.nlps.tyc.edu.tw/games"
		,description:"This is a collection of games for use on a projector or large touchscreen device, intended for classes of thirty students or more.  Teachers can use these games as platforms for arbitrary content to help drive engagement."
		,note:"Technology stack: JavaScript, PHP, HTML, CSS"
		,image: "classroom_games.jpg"
		,backgroundColor:"#f7ee83"
	})
];

loadScript("/portfolio/lib/js/staticScroll.c.js",function(){
	let container=document.getElementById("container");
	let content=document.getElementById("content");
	
	var list=[];
	for(i in copy){
		list.push(new ScrollItem(
			copy[i]
			,function(){onEnter(this.container);}
			,function(){onLeave(this.container);}
		));
	}
	list[0].onEnter=function(){
		onEnter(this.container);
		document.getElementById("scrollPrompt").classList.add("active");
	}
	list[0].onLeave=function(){
		onLeave(this.container);
		document.getElementById("scrollPrompt").classList.remove("active");
	}
	
	window.scroller=new StaticScroll(container,list);
	
	
	function scrollOverride(delta){
		let destination=content.anchor+delta;
		if(destination<0){destination=0;}
		if(destination>container.scrollHeight){destination=container.scrollHeight;}
		container.scrollTop=destination;
		let firstPage=(window.innerHeight-destination)/(window.innerHeight*7/4);
		firstPage=(firstPage>0)?firstPage:0;
		window.requestAnimationFrame(()=>{
			document.getElementById("scrollPrompt").style.setProperty("--scrollPosition",firstPage);
		});
	}
	content.addEventListener("wheel",function(event){
		this.anchor=container.scrollTop;
		scrollOverride(event.deltaY);
	});
	content.addEventListener("touchstart",function(event){ 
		this.anchor=container.scrollTop;
		this.touchStartY=event.targetTouches[0].clientY;
	});
	content.addEventListener("touchmove",function(event){
		scrollOverride((this.touchStartY-event.targetTouches[0].clientY)*1.6);
	});
});
