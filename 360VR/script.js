/**
 * ------------------------------------------------------------------------------------------------------------------
 * 1. 마크업된 하나의 처음 기본파일(..._00000.jpg)을 기점으로 파일 로딩이 진행되므로 파일 및 폴더명(./image/)에 유의
 * 2. 파일 확장자는 무조건 .jpg로 고정 / 파일명에서 숫자 0은 넘버링에만 사용
 * ------------------------------------------------------------------------------------------------------------------
 */

// Set Variable
window.onload = function() {
	var _imgView = document.getElementById("imgView"),
		_img = _imgView.getElementsByTagName("img")[0],
		_slideBar = document.getElementById("slideBar"),
		_movingBtn = document.getElementById("movingBtn"),
		initFolder = "./images/",
		initSrc = initFolder + initFileName(_img.src),
		imgArray = new Array(),
		imgIdx = 0,
		isFinished = false;

	preloadVRImg();

	// Initialize File Name
	function initFileName(fileLoc) {
		// 1. File Name Catch
		fileLoc = fileLoc.substring(fileLoc.lastIndexOf("/")+1, fileLoc.lastIndexOf(".jpg"));
		// 2. "0" Delete
		while(fileLoc.indexOf("0") > -1) fileLoc = fileLoc.substring(0, fileLoc.indexOf("0"));

		return fileLoc;
	}

	// Preload Image
	function preloadVRImg() {
		cIdx = imgIdx.toString();
		cfileNum = String(cIdx.length == 1? "0000"+cIdx : cIdx.length == 2? "000"+cIdx : cIdx.length == 3? "00"+cIdx : cIdx.length == 4? "0"+cIdx : cIdx);
		imgArray[imgIdx] = new Image();
		imgArray[imgIdx].src = initSrc + cfileNum + ".jpg";

		// onload(goNextImg =>)
		imgArray[imgIdx].onload = function(){
			imgIdx++;
			preloadVRImg();
		}

		// onerror(==finish)
		imgArray[imgIdx].onerror = function(){
			imgArray.pop();
			console.clear(); // 마지막 파일은 무조건 오류가 한 건 나므로 클리어 해줌...
			console.log("Image Array Length :" + imgArray.length);
			return;
		}
	}

	// View Image Change
	function changePic(setIdx) {
		if(imgIdx === setIdx) return;

		imgIdx = setIdx;
		
		_img.src = imgArray[imgIdx].src;
	}

	// IE<9 => e.PageX ( X ) / e.ClientX ( O ) 
	function fixPageX(e) {
		if (e.pageX == null && e.clientX != null ) {
			var html = document.documentElement;
			var body = document.body;
			e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
			e.pageX -= html.clientLeft || 0;
		}
	}

	// Mouse Down Event
	_movingBtn.onmousedown = function(e) {
		var self = this;
		self.style.position = "absolute";
		
		// Mouse Move Event
		document.onmousemove = function(e) {
			e = e || event;

			fixPageX(e);

			// 'movingBtn' center under mouse pointer. 'offsetX' is (slidebar left position of window) + (half of width)
			var offsetX = _slideBar.offsetLeft + Math.round(self.offsetWidth/2),
				setPosX = e.pageX-offsetX,
				maxPosX = _slideBar.offsetWidth-self.offsetWidth,
				picChangeRan = maxPosX / (imgArray.length-1);

			setPosX = setPosX < 0? 0 : setPosX > maxPosX? maxPosX : setPosX;
			self.style.left = setPosX+"px";
			
			// Change Picture
			changePic(Math.floor(setPosX/picChangeRan));
			
			// Mouse Up Event
			this.onmouseup = function() {
				document.onmousemove = null;
			}
		}
	}
	document.getElementById("movingBtn").ondragstart = function() { return false; }
}