
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Minimap
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [可关闭][资源消耗大]小地图插件
 * @author 神仙狼
 *
 * @help SSMBS_MiniMap.js
 *
 * 变量1~9必须预留不可使用。
 *
 * @param 小地图X偏移
 * @type Number
 * @desc 小地图X偏移，默认位置在屏幕右下
 * @default 0
 *
 * @param 小地图Y偏移
 * @type Number
 * @desc 小地图Y偏移，默认位置在屏幕右下
 * @default 0
 * 
 * @param 小地图窗口尺寸
 * @type Number
 * @desc 长宽相等，默认200*200
 * @default 200
 *
 * @param 小地图边框空余
 * @type Number
 * @desc 小地图素材外围大小，长宽相等，默认13
 * @default 13
 *
 * @param 是否自动绘制无法通行方块
 * @type Number
 * @desc 是否自动绘制无法通行方块（会把敌人也算作无法通行），0为关闭，1为打开
 * @default 0
 * 
 * @param 无法通行方块颜色
 * @type Number
 * @desc 无法通行方块颜色
 * @default #444444
 *
 * @param Region颜色起始值
 * @type Number
 * @desc 从几号Region开始计算颜色。
 * @default 100
 * 
 * @param Region颜色
 * @type Number
 * @desc Region图层的颜色，英文逗号分开。
 * @default #444444
 * 
 */

var sxlSimpleMinimap = sxlSimpleMinimap || {};
sxlSimpleMinimap.parameters = PluginManager.parameters('SSMBS_MiniMap');
sxlSimpleMinimap.windowXoffset = Number(sxlSimpleMinimap.parameters['小地图X偏移'] || 0);
sxlSimpleMinimap.windowYoffset = Number(sxlSimpleMinimap.parameters['小地图Y偏移'] || 0);
sxlSimpleMinimap.windowSize = Number(sxlSimpleMinimap.parameters['小地图窗口尺寸'] || 200);
sxlSimpleMinimap.windowPadding = Number(sxlSimpleMinimap.parameters['小地图边框空余'] || 13);
sxlSimpleMinimap.cannotPassColor = String(sxlSimpleMinimap.parameters['无法通行方块颜色'] || '#444444');
sxlSimpleMinimap.cannotPassBlock = Number(sxlSimpleMinimap.parameters['是否自动绘制无法通行方块'] || 0);
sxlSimpleMinimap.regionStart = Number(sxlSimpleMinimap.parameters['Region颜色起始值'] || 100);
sxlSimpleMinimap.regionColor = String(sxlSimpleMinimap.parameters['Region颜色'] || '#444444');

ImageManager.loadMinimap = function(filename) {
    return this.loadBitmap("img/minimap/", filename);
};

var pointWidth = 12;
var pointHeight = 12;


const _ssmbs_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_ssmbs_mapLoad.call(this);
	this.storeMapPosition = {x:0,y:0}
	this.points = [];
	
	this.pointFixX = Math.min(-($gamePlayer.x-6)*pointWidth,-1);
	this.pointFixY = Math.min(-($gamePlayer.y-6)*pointHeight,-1);
	this.minimapEventIconArray = [];
	this.minimap = new Sprite(new Bitmap ($gameMap.width()*pointWidth,$gameMap.height()*pointHeight) );
	this.minimap.x = Graphics.width-sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding+sxlSimpleMinimap.windowXoffset;
	this.minimap.y = Graphics.height-sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding+sxlSimpleMinimap.windowYoffset;

	this.minimap.windowBackground=new Sprite();
	this.minimap.windowBackground.bitmap = ImageManager.loadSystem('minimapWindowBackground');
	this.minimap.windowBackground.x = this.minimap.x;
	this.minimap.windowBackground.y = this.minimap.y;

	this.addChild(this.minimap.windowBackground);
	if($dataMap.meta.minimapBackground){
		this.minimap.background = new Sprite();
		this.minimap.background.bitmap = ImageManager.loadMinimap($dataMap.meta.minimapBackground);
		this.minimap.background.x = this.minimap.x;
		this.minimap.background.y = this.minimap.y;
		this.addChild(this.minimap.background);
	}
	
	this.addChild(this.minimap);

	this.minimap.playerIcon=new Sprite();
	this.minimap.playerIcon.bitmap = ImageManager.loadSystem('IconSet');
	this.minimap.playerIcon.x = this.minimap.x-sxlSimpleMinimap.windowPadding;
	this.minimap.playerIcon.y = this.minimap.y-sxlSimpleMinimap.windowPadding;
	this.minimap.playerIcon.anchor.x = 0.5;
	this.minimap.playerIcon.anchor.y = 0.5;
	var icon = 464;
	this.minimap.playerIcon.setFrame( icon % 16*32,Math.floor( icon / 16)*32,32,32 )
	this.addChild(this.minimap.playerIcon);

	this.minimap.window=new Sprite();
	this.minimap.window.bitmap = ImageManager.loadSystem('minimapWindow');
	this.minimap.window.x = this.minimap.x-sxlSimpleMinimap.windowPadding;
	this.minimap.window.y = this.minimap.y-sxlSimpleMinimap.windowPadding;
	this.addChild(this.minimap.window);

	this.minimap.zoom = new Sprite(new Bitmap(sxlSimpleMinimap.windowSize,sxlSimpleMinimap.windowSize) );
	this.minimap.zoom.x = this.minimap.x;
	this.minimap.zoom.y = this.minimap.y;

	for( let e = 0 ; e < $gameMap.events().length ; e ++ ){
		let event = $gameMap.events()[e];
		if(event && event.page()){
			for ( let l = 0 ; l < event.page().list.length ; l ++ ){
				let list = event.page().list[l];
				if(list.code == 108){
					for( let p = 0 ; p < list.parameters.length ; p ++ ){
						let parameters = list.parameters[p]
						var text = parameters.split(':');
						if(text[0]=='minimapIcon'){
							event.minimapIconID = Number(text[1]);
							this.minimapIconEvent = new Sprite();
							this.minimapIconEvent.bitmap = ImageManager.loadSystem('IconSet');
							this.minimapIconEvent.setFrame(event.minimapIconID % 16*32,Math.floor( event.minimapIconID / 16)*32,32,32)
							this.minimapIconEvent.event = event;
							this.minimapIconEvent.anchor.x = 0.5;
							this.minimapIconEvent.anchor.y = 0.5;
							this.addChild(this.minimapIconEvent);
							this.minimapEventIconArray.push(this.minimapIconEvent);
						}
					}
				}
			}
		}
	}
	this.addChild(this.minimap.zoom);
	this.needRefreshMinimap = true;
};

const _ssmbs_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_ssmbs_mapUpdate.call(this);
	if(sxlSimpleMinimap.minimapEnable){
		this.updateMinimap();
		if(this.minimap.background){
			this.minimap.background.opacity = 192;
			this.minimap.background.scale.x = pointWidth/48;
			this.minimap.background.scale.y = pointHeight/48;
		}
		if(this.minimap){
			this.minimap.scale.x = pointWidth/12;
			this.minimap.scale.y = pointHeight/12;
			this.minimap.window.opacity = 255;
		}
		if(this.needRefreshMinimap){
			this.refreshMinimapBlock();
			this.needRefreshMinimap = false;
		}
	}else{
		if(this.minimap.opacity){
			this.minimap.opacity = 0;
			if(this.minimap.background) this.minimap.background.opacity = 0;
			this.minimap.zoom.opacity = 0;
			this.minimap.window.opacity = 0;
			this.minimap.playerIcon.opacity = 0;
			this.minimap.windowBackground.opacity = 0;
			for(let i = 0 ; i < this.minimapEventIconArray.length ; i ++ ){
				let icon = this.minimapEventIconArray[i];
				icon.opacity = 0;
			}
		}
		
	}
	
};

Scene_Map.prototype.refreshMinimapBlock = function() {
	this.minimap.bitmap.clear();
	for( minimapPointX = 0 ; minimapPointX < $dataMap.width ; minimapPointX ++ ){
		for( minimapPointY = 0 ; minimapPointY < $dataMap.height ; minimapPointY ++ ){

			this.points.push({x:minimapPointX,y:minimapPointY});
			if(!this.minimap.background){
				var boxColor=null;
				if(sxlSimpleMinimap.cannotPassBlock>=1){
					if( $gameMap.regionId(minimapPointX,minimapPointY) == 0 &&
						!$gamePlayer.canPass(minimapPointX,minimapPointY)){
						boxColor = sxlSimpleMinimap.cannotPassColor;
					}
				}
				for( i = 0 ; i < (sxlSimpleMinimap.regionColor).split(',').length; i++ ){
					if( $gameMap.regionId(minimapPointX,minimapPointY) == i+sxlSimpleMinimap.regionStart ){
						boxColor = sxlSimpleMinimap.regionColor.split(',')[i];
					}
				}
				if( boxColor/* && playerDistanceX<=12 && playerDistanceY<=12*/){
					this.minimap.bitmap.fillRect( pointWidth*minimapPointX,
											  	  pointHeight*minimapPointY,
											  	  pointWidth, pointHeight, boxColor);
				}
			}
		}
	}
};

Scene_Map.prototype.updateMinimap = function(){
	
	if( TouchInput.x>this.minimap.windowBackground.x+sxlSimpleMinimap.windowPadding &&
		TouchInput.y>this.minimap.windowBackground.y+sxlSimpleMinimap.windowPadding &&
		TouchInput.x<this.minimap.windowBackground.x+sxlSimpleMinimap.windowSize+sxlSimpleMinimap.windowPadding &&
		TouchInput.y<this.minimap.windowBackground.y+sxlSimpleMinimap.windowSize+sxlSimpleMinimap.windowPadding){
		$gameParty.members()[0]._tp = 0;
		if(TouchInput.isPressed()){
			$gamePlayer.mouseInMinimap = true;
			this.pointFixX+=(TouchInput.x-this.minimap.playerIcon.x);
			this.pointFixY+=(TouchInput.y-this.minimap.playerIcon.y);
			this.storeMapPosition.x = this.pointFixX;
			this.storeMapPosition.y = this.pointFixY;
		}
		if(pointWidth>=3 && pointWidth<=24 && TouchInput.wheelY!=0){
			this.pointFixX+=(TouchInput.x-this.minimap.playerIcon.x);
			this.pointFixY+=(TouchInput.y-this.minimap.playerIcon.y);
			pointWidth -=TouchInput.wheelY/100;
			pointHeight -=TouchInput.wheelY/100;
		}
		if(pointWidth<3) {pointWidth = 3;pointHeight=3}
		if(pointWidth>24) {pointWidth = 24;pointHeight=24}
	} 
	if(!TouchInput.isPressed()){
		if(this.minimap.playerIcon.x!=this.minimap.x+sxlSimpleMinimap.windowPadding+100){
			this.pointFixX-=(this.minimap.playerIcon.x-(this.minimap.x+sxlSimpleMinimap.windowPadding+100))/15;
		}
		if(this.minimap.playerIcon.y!=this.minimap.y+sxlSimpleMinimap.windowPadding+100){
			this.pointFixY-=(this.minimap.playerIcon.y-(this.minimap.y+sxlSimpleMinimap.windowPadding+100))/15;
		}
	}

	for( let e = 0 ; e < $gameMap.events().length ; e ++ ){
		let event = $gameMap.events()[e];
		if(event && event.page()){
			for ( let l = 0 ; l < event.page().list.length ; l++ ){
				let list = event.page().list[l];
				if(list.code == 108){
					for( let p = 0 ; p < list.parameters.length ; p ++ ){
						let parameters = list.parameters[p];
						var text = parameters.split(':');
						if(text[0]=='minimapIcon'){
							event.minimapIconID = Number(text[1]);
							// this.minimapIconEvent.setFrame(event.minimapIconID % 16*32,Math.floor( event.minimapIconID / 16)*32,32,32)
						}
						if(text[0]=='farMinimapIcon'){
							event.farMinimapIconID = Number(text[1]);
							event.foundDistance =  Number(text[2]);
							// this.minimapIconEvent.setFrame(event.minimapIconID % 16*32,Math.floor( event.minimapIconID / 16)*32,32,32)
						}
					}
				}
			}
		}
		
	}



	if(TouchInput.isHovered()){
		$gamePlayer.mouseInMinimap = false;
	}
	if($gamePlayer.mouseInMinimap){
		$gameParty.members()[0]._tp = 0;
	}
	for( let p = 0 ; p < this.points.length ; p ++ ){
		let mapPoint = this.points[p];
		var playerDistanceX = Math.abs($gamePlayer.x-mapPoint.x);
		var playerDistanceY = Math.abs($gamePlayer.y-mapPoint.y);
		
		if(this.pointFixX<-(($dataMap.width-12)*pointWidth)){
			this.pointFixX=-(($dataMap.width-12)*pointWidth);
		}
		if(this.pointFixY<-(($dataMap.height-12)*pointHeight)){
			this.pointFixY=-(($dataMap.height-12)*pointHeight);
		}
		if(mapPoint.x==$gamePlayer.x&&mapPoint.y==$gamePlayer.y){
			this.minimap.playerIcon.x = this.pointFixX + pointWidth*mapPoint.x+this.minimap.x+pointWidth/2+($gamePlayer._realX-$gamePlayer.x)*pointWidth;
			this.minimap.playerIcon.y = this.pointFixY + pointHeight*mapPoint.y+this.minimap.y+pointHeight/2+($gamePlayer._realY-$gamePlayer.y)*pointHeight;
			if(this.minimap.playerIcon.x<this.minimap.x+16 || this.minimap.playerIcon.y<this.minimap.y+16 ||
			    this.minimap.playerIcon.x>this.minimap.x+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16 || this.minimap.playerIcon.y>this.minimap.y+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16 ){
				this.minimap.playerIcon.opacity -= 25;
			}else{
				this.minimap.playerIcon.opacity += 25;
			}
		}

		for( let  i = 0 ; i < this.minimapEventIconArray.length ; i ++ ){
			let iconEvent = this.minimapEventIconArray[i];
			if(iconEvent.event.x == mapPoint.x && iconEvent.event.y == mapPoint.y){
				iconEvent.x = this.pointFixX + pointWidth*mapPoint.x+this.minimap.x+pointWidth/2+(iconEvent.event._realX-iconEvent.event.x)*pointWidth;
				iconEvent.y = this.pointFixY + pointHeight*mapPoint.y+this.minimap.y+pointHeight/2+(iconEvent.event._realY-iconEvent.event.y)*pointHeight;;

				if(iconEvent.x<this.minimap.x+16 || iconEvent.y<this.minimap.y+16 ||
				    iconEvent.x>this.minimap.x+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16 || iconEvent.y>this.minimap.y+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16 ){
					iconEvent.minimapShowed = false;
					if(iconEvent.event.foundDistance){
						var distOK = Math.abs(iconEvent.event.y-$gamePlayer.y)<Math(iconEvent.event.foundDistance) && Math.abs(iconEvent.event.x-$gamePlayer.x)<Math(iconEvent.event.foundDistance);
					}else{
						var distOK = true;
					}
					
					if(iconEvent.event.farMinimapIconID&&distOK) {
						iconEvent.setFrame(iconEvent.event.farMinimapIconID % 16*32,Math.floor( iconEvent.event.farMinimapIconID / 16)*32,32,32);
						if(iconEvent.x<this.minimap.x+16) iconEvent.x=this.minimap.x+16;
						if(iconEvent.y<this.minimap.y+16) iconEvent.y=this.minimap.y+16;
						if(iconEvent.x>this.minimap.x+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16) iconEvent.x=this.minimap.x+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16;
						if(iconEvent.y>this.minimap.y+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16) iconEvent.y=this.minimap.y+sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding-16;
						iconEvent.angle = Math.atan2((iconEvent.event.y-$gamePlayer.y), (iconEvent.event.x-$gamePlayer.x))*(180/Math.PI);
						
					}else{
						iconEvent.opacity -= 50;
					}
				}else{
					if(iconEvent.event.farMinimapIconID && iconEvent.minimapShowed == false ) {
						iconEvent.opacity-= 50;
						if(iconEvent.opacity<=0){
							iconEvent.minimapShowed = true;
						}
					}else{
						iconEvent.opacity += 50;
						
						iconEvent.setFrame(iconEvent.event.minimapIconID % 16*32,Math.floor( iconEvent.event.minimapIconID / 16)*32,32,32);
						iconEvent.angle = 0;
						
					}
					
				}
			}
		}
		
		if($dataMap.meta.minimapBackground){
			this.minimap.background.setFrame(-this.pointFixX/this.minimap.background.scale.x,
											 -this.pointFixY/this.minimap.background.scale.y,
											 200/this.minimap.background.scale.x,
											 200/this.minimap.background.scale.y);

		}else{
			this.minimap.setFrame(-this.pointFixX/this.minimap.scale.x,
								 -this.pointFixY/this.minimap.scale.y,
								 192/this.minimap.scale.x,
								 192/this.minimap.scale.y);
		}
	}
	
	if( TouchInput.x>this.minimap.windowBackground.x+sxlSimpleMinimap.windowPadding &&
		TouchInput.y>this.minimap.windowBackground.y+sxlSimpleMinimap.windowPadding &&
		TouchInput.x<this.minimap.windowBackground.x+sxlSimpleMinimap.windowSize+sxlSimpleMinimap.windowPadding &&
		TouchInput.y<this.minimap.windowBackground.y+sxlSimpleMinimap.windowSize+sxlSimpleMinimap.windowPadding){
		this.minimap.zoom.bitmap.clear();
		this.minimap.zoom.opacity += 15;
		this.minimap.zoom.bitmap.fontFace = $gameSystem.mainFontFace();
		this.minimap.zoom.bitmap.fontSize = 12;
		this.minimap.zoom.bitmap.drawText($dataMap.displayName,0,sxlSimpleMinimap.windowPadding,sxlSimpleMinimap.windowSize,16,'center');
		this.minimap.zoom.bitmap.drawText('('+'X: '+$gamePlayer.x+'  '+'Y: '+$gamePlayer.y+')',0,sxlSimpleMinimap.windowPadding+18,sxlSimpleMinimap.windowSize,16,'center');
		this.minimap.zoom.bitmap.drawText(Math.floor(pointWidth/12*100)+'%',0,sxlSimpleMinimap.windowSize-16-sxlSimpleMinimap.windowPadding,sxlSimpleMinimap.windowSize,16,'center');
	}else{
		this.minimap.zoom.opacity -= 15;
	}
};