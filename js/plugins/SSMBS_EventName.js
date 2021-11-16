
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Event Name
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [可关闭][资源消耗大]事件名称
 * @author 神仙狼
 *
 * @help SSMBS_EventName.js
 *
 * 事件名称的显示
 * 在事件里注释
 * name:名称:字色:字号
 * name2:名称:字色:字号
 * offsetY:名称坐标偏移Y
 * icon:图标ID
 *
 * 每个注释要单独写，不可以写在同一个注释中
 *
 * 在事件中写入脚本
 *
 * sxlShowEventName.show(事件ID) // 显示事件名称
 * sxlShowEventName.hide(事件ID) // 隐藏事件名称
 * 本事件ID为this._eventId
 * 例如：
 * sxlShowEventName.hide(this._eventId)
 * 
 */




var sxlShowEventName = sxlShowEventName || {};


const _showEventNameLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_showEventNameLoad.call(this);
	this.eventNames=[];
	this.eventNames2=[];
	this.eventNamesIcon=[];
	this.createNames();
	
};

const _showEventNameUpdate = Scene_Map.prototype.update ;
Scene_Map.prototype.update = function() {
	_showEventNameUpdate.call(this);
	this.showName($gameMap.events()[i]);
	sxlShowEventName.arrow = this;
};

Scene_Map.prototype.createNames = function(){
	for( let e = 0 ; e < $gameMap.events().length; e ++ ){
		let event = e;
		this.eventNamessingle = new Sprite(new Bitmap(200,20));
		this.eventNamessingle.event =  $gameMap.events()[event];
		this.eventNames.push(this.eventNamessingle);
		this.eventNames2single = new Sprite(new Bitmap(200,20))
		this.eventNames2single.event =  $gameMap.events()[event];
		this.eventNames2.push(this.eventNames2single)
		this.eventNamesIconSingle = new Sprite()
		this.eventNamesIconSingle.event =  $gameMap.events()[event];
		this.eventNamesIcon.push(this.eventNamesIconSingle)
	}
	for( let i = 0 ; i < this.eventNames.length ; i ++  ){
		this.addChild(this.eventNames[i])
		this.addChild(this.eventNames2[i])
		this.addChild(this.eventNamesIcon[i])
	}
};

Scene_Map.prototype.showName = function(){
	for( let eventName = 0 ; eventName < this.eventNames.length ; eventName ++ ){
		if($gameMessage.isBusy() || this.eventNames[eventName].event.hide ){
			this.eventNames[eventName].opacity -= 30;
			this.eventNames2[eventName].opacity -= 30;
			this.eventNamesIcon[eventName].opacity -= 30
		}else{
			this.eventNames[eventName].opacity += 30;
			this.eventNames2[eventName].opacity += 30;
			this.eventNamesIcon[eventName].opacity += 30
		}
		var target = this.eventNames[eventName].event
		if(target.page()){
			for( let i = 0 ; i < target.page().list.length ; i ++ ){
				if(target.page().list[i].code == 108){
					for( let j = 0 ; j < target.page().list[i].parameters.length ; j ++ ){
						var text = target.page().list[i].parameters[j].split(':');
						if(text[0]==='name'){
							this.eventNames[eventName].bitmap.clear();
							this.eventNames[eventName].x = target.screenX()-100;
							this.eventNames[eventName].y = target.screenY()-72;
							this.eventNames[eventName].bitmap.fontFace = $gameSystem.mainFontFace();
							if(text[2]){
								this.eventNames[eventName].bitmap.textColor=ColorManager.textColor(Number(text[2]))
							}
							if(text[3]){
								this.eventNames[eventName].bitmap.fontSize = Number(text[3]);
							}
							this.eventNames[eventName].bitmap.drawText(text[1],0,0,200,20,'center')
						}
						if(text[0]==='name2'){
							this.eventNames2[eventName].bitmap.clear();
							this.eventNames2[eventName].bitmap.fontFace = $gameSystem.mainFontFace();
							if(text[2]){
								this.eventNames2[eventName].bitmap.textColor=ColorManager.textColor(Number(text[2]))
							}
							if(text[3]){
								this.eventNames2[eventName].bitmap.fontSize = Number(text[3]);
							}
							this.eventNames2[eventName].x = target.screenX()-100;
							this.eventNames2[eventName].y = target.screenY()-72 + this.eventNames[eventName].bitmap.fontSize + 6;
							this.eventNames2[eventName].bitmap.drawText(text[1],0,0,200,20,'center')
							
						}
						if(text[0]==='icon'){
							if(text[1]){
								this.eventNamesIcon[eventName].bitmap =  ImageManager.loadSystem( 'IconSet' );
								this.eventNamesIcon[eventName].setFrame(Number(text[1]) % 16*32,Math.floor(Number(text[1]) / 16)*32,32,32);
							}else{
								this.eventNamesIcon[eventName].opacity = 0;
							}
							this.eventNamesIcon[eventName].x = target.screenX()-16;
							this.eventNamesIcon[eventName].y = target.screenY()-128;

						}
						if(text[0]==='offsetY'){
							if(!this.eventNames[eventName]){
							}else{
								this.eventNames[eventName].y = target.screenY()-72 + Number(text[1]);
								if(this.eventNames2[eventName]){
									this.eventNames2[eventName].y = target.screenY()-72 + this.eventNames[eventName].bitmap.fontSize + 6 +  Number(text[1]);
								}
							}
						}
						if(text[0]==='offsetX'){
							if(!this.eventNames[eventName]){
							}else{
								this.eventNames[eventName].x = target.screenX() + Number(text[1]) -100;
								if(this.eventNames2[eventName]){
									this.eventNames2[eventName].x = this.eventNames[i].x;
								}
							}
						}
					}
				}
			}
		}
	}

};

sxlShowEventName.hide = function(eventId) {
	$gameMap.events()[eventId-1].hide = true;
};

sxlShowEventName.show = function(eventId) {
	$gameMap.events()[eventId-1].hide = false;
};