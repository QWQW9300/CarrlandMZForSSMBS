//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Notification
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 消息推送
 * @author 神仙狼
 *
 */

var SSMBS_Window_Notification = SSMBS_Window_Notification||{};
SSMBS_Window_Notification.width = 300;
SSMBS_Window_Notification.fontSize = 12;
SSMBS_Window_Notification.maxLines = 10;
SSMBS_Window_Notification.lineSpace = 6;
SSMBS_Window_Notification.lineHeight = SSMBS_Window_Notification.fontSize+SSMBS_Window_Notification.lineSpace;
SSMBS_Window_Notification.opacity = 100;

SSMBS_Window_Notification.drawingY = 24;

SSMBS_Window_Notification.padding = 6;

SSMBS_Window_Notification.nowLine = 0;

SSMBS_Window_Notification.text = [];

const _SSMBS_Window_Notification_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_SSMBS_Window_Notification_mapLoad.call(this);
	if( $gameSystem.lockNotificationWindow == undefined){
		$gameSystem.lockNotificationWindow = true;
	}
	if( !$gameSystem.notificationAlign){
		$gameSystem.notificationAlign = 'left';
	}
	this.createNotificationWindow();
}

const _SSMBS_Window_Notification_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_SSMBS_Window_Notification_mapUpdate.call(this);
	this.refreshNotificationWindow();
}

Scene_Map.prototype.createNotificationWindow = function() {
	this.notificationWindow = new Sprite( new Bitmap( SSMBS_Window_Notification.width, SSMBS_Window_Notification.maxLines * SSMBS_Window_Notification.lineHeight ) );
	this.notificationWindow.opacity = SSMBS_Window_Notification.opacity;
	if($gameSystem.windowNotificationX && $gameSystem.windowNotificationY){
		this.notificationWindow.x = $gameSystem.windowNotificationX;
		this.notificationWindow.y = $gameSystem.windowNotificationY;
	}
	this.addChild(this.notificationWindow);
	this.notificationWord = new Sprite( new Bitmap( SSMBS_Window_Notification.width, SSMBS_Window_Notification.maxLines * SSMBS_Window_Notification.lineHeight ) );
	this.addChild(this.notificationWord);
};

Scene_Map.prototype.refreshNotificationWindow = function() {
	this.notificationWindow.bitmap.clear();
	this.notificationWord.bitmap.clear();
	let stX = this.notificationWindow.x;
	let stY = this.notificationWindow.y;
	let edX = stX+SSMBS_Window_Notification.width;
	let edY = stY+SSMBS_Window_Notification.maxLines*SSMBS_Window_Notification.lineHeight;
	
	let line = 0;
	for( let i = 0 ; i < SSMBS_Window_Notification.text.length ; i ++ ){
		if(SSMBS_Window_Notification.text[i] && i>=SSMBS_Window_Notification.nowLine && i<SSMBS_Window_Notification.nowLine+SSMBS_Window_Notification.maxLines){
			let text = SSMBS_Window_Notification.text[i].text;
			let x = SSMBS_Window_Notification.padding;
			let y = SSMBS_Window_Notification.maxLines*SSMBS_Window_Notification.lineHeight-line*SSMBS_Window_Notification.lineHeight-SSMBS_Window_Notification.lineHeight;
			let width = SSMBS_Window_Notification.width-SSMBS_Window_Notification.padding;
			let height = SSMBS_Window_Notification.fontSize;
			this.notificationWord.bitmap.fontSize = SSMBS_Window_Notification.fontSize;
			this.notificationWord.bitmap.textColor = ColorManager.textColor( SSMBS_Window_Notification.text[i].color);
			
			this.notificationWord.bitmap.drawText(text,x,y,width,height,$gameSystem.notificationAlign);
			let stX = this.notificationWindow.x+x;
			let stY = this.notificationWindow.y+y;
			let edX = stX + this.notificationWord.bitmap.measureTextWidth(SSMBS_Window_Notification.text[i].text);;
			let edY = stY + height ;
			if(ssmbsBasic.isTouching( stX,stY,edX,edY ) ){
				if(SSMBS_Window_Notification.text[i].item && !this.isDrawing){
					this.itemInform = SSMBS_Window_Notification.text[i].item;
				}
			}
			line ++;
		}
	}
	if(ssmbsBasic.isTouching( stX,stY,edX,edY ) ){
		if(!$gameSystem.lockNotificationWindow ){
			if( this.isTouchingButton){
				$gamePlayer.battler()._tp = 0;
			}
			
		}
		if(TouchInput.isPressed() & !this.isDrawing){
			this.isDrawing = true;
			this.drawingWindow = 'notification';
			if(!SSMBS_Window_Notification.xDelta) SSMBS_Window_Notification.xDelta = TouchInput.x - this.notificationWindow.x;
			if(!SSMBS_Window_Notification.yDelta) SSMBS_Window_Notification.yDelta = TouchInput.y - this.notificationWindow.y;
		}else if (TouchInput.isHovered()) {
			this.isDrawing = false;
			this.drawingWindow = null;
			SSMBS_Window_Notification.xDelta = 0;
			SSMBS_Window_Notification.yDelta = 0;
		}
			

		this.notificationWindow.bitmap.fontSize = SSMBS_Window_Notification.fontSize;
		this.notificationWindow.bitmap.textColor = ColorManager.textColor( 0 );
		this.notificationWindow.bitmap.fillRect(0,0,SSMBS_Window_Notification.width,SSMBS_Window_Notification.maxLines*SSMBS_Window_Notification.lineHeight,'#000000');

		//按钮
		let line = 0;
		//固定按钮
		let lockedWord = $gameSystem.lockNotificationWindow?'解锁':'锁定';
		let stX_clear = this.notificationWindow.x+SSMBS_Window_Notification.width-this.notificationWindow.bitmap.measureTextWidth(lockedWord);
		let stY_clear = this.notificationWindow.y+line*SSMBS_Window_Notification.lineHeight;
		let edX_clear = stX_clear + this.notificationWindow.bitmap.measureTextWidth(lockedWord);
		let edY_clear = stY_clear + SSMBS_Window_Notification.lineHeight ;
		if(ssmbsBasic.isTouching( stX_clear,stY_clear,edX_clear,edY_clear )){
			this.isTouchingButton = true;
			this.notificationWindow.bitmap.fillRect(SSMBS_Window_Notification.width-this.notificationWindow.bitmap.measureTextWidth(lockedWord)-12,line*SSMBS_Window_Notification.lineHeight,this.notificationWindow.bitmap.measureTextWidth(lockedWord)+4,SSMBS_Window_Notification.lineHeight,'#ffffff');
			if(TouchInput.isClicked()){
				$gameSystem.lockNotificationWindow = !$gameSystem.lockNotificationWindow;
			};
		}
		this.notificationWindow.bitmap.drawText(lockedWord,SSMBS_Window_Notification.padding,line*SSMBS_Window_Notification.lineHeight,SSMBS_Window_Notification.width-16,SSMBS_Window_Notification.lineHeight,'right');
		line ++;
		//清空按钮
		let stX_stay = this.notificationWindow.x+SSMBS_Window_Notification.width-this.notificationWindow.bitmap.measureTextWidth('清空');
		let stY_stay = this.notificationWindow.y+line*SSMBS_Window_Notification.lineHeight;
		let edX_stay = stX_stay + this.notificationWindow.bitmap.measureTextWidth('清空');
		let edY_stay = stY_stay + SSMBS_Window_Notification.lineHeight ;
		if(ssmbsBasic.isTouching( stX_stay,stY_stay,edX_stay,edY_stay )){
			this.isTouchingButton = true;
			this.notificationWindow.bitmap.fillRect(SSMBS_Window_Notification.width-this.notificationWindow.bitmap.measureTextWidth('清空')-12,line*SSMBS_Window_Notification.lineHeight,this.notificationWindow.bitmap.measureTextWidth('清空')+4,SSMBS_Window_Notification.lineHeight,'#ffffff');
			if(TouchInput.isClicked()){
				SSMBS_Window_Notification.text = [];
			};
		}
		this.notificationWindow.bitmap.drawText('清空',SSMBS_Window_Notification.padding,line*SSMBS_Window_Notification.lineHeight,SSMBS_Window_Notification.width-16,SSMBS_Window_Notification.lineHeight,'right');
		this.notificationWindow.bitmap.fontSize = SSMBS_Window_Notification.fontSize;
		line ++;
		//清空按钮
		let stX_align = this.notificationWindow.x+SSMBS_Window_Notification.width-this.notificationWindow.bitmap.measureTextWidth('对齐');
		let stY_align = this.notificationWindow.y+line*SSMBS_Window_Notification.lineHeight;
		let edX_align = stX_align + this.notificationWindow.bitmap.measureTextWidth('对齐');
		let edY_align = stY_align + SSMBS_Window_Notification.lineHeight ;
		if(ssmbsBasic.isTouching( stX_align,stY_align,edX_align,edY_align )){
			this.isTouchingButton = true;
			this.notificationWindow.bitmap.fillRect(SSMBS_Window_Notification.width-this.notificationWindow.bitmap.measureTextWidth('对齐')-12,line*SSMBS_Window_Notification.lineHeight,this.notificationWindow.bitmap.measureTextWidth('对齐')+4,SSMBS_Window_Notification.lineHeight,'#ffffff');
			if(TouchInput.isClicked()){
				if($gameSystem.notificationAlign == 'left'){
					$gameSystem.notificationAlign = 'center';
				}else
				if($gameSystem.notificationAlign == 'center'){
					$gameSystem.notificationAlign = 'right';
				}else
				if($gameSystem.notificationAlign == 'right'){
					$gameSystem.notificationAlign = 'left';
				}
				
			};
			
		}
		this.notificationWindow.bitmap.drawText('对齐',SSMBS_Window_Notification.padding,line*SSMBS_Window_Notification.lineHeight,SSMBS_Window_Notification.width-16,SSMBS_Window_Notification.lineHeight,'right');
		this.notificationWindow.bitmap.fontSize = SSMBS_Window_Notification.fontSize;
	};
	
	if(TouchInput.isPressed() && !this.nowPickedItem && this.drawingWindow == 'notification' && !$gameSystem.lockNotificationWindow){
		this.notificationWindow.x += (TouchInput.x - this.notificationWindow.x)-SSMBS_Window_Notification.xDelta;
		this.notificationWindow.y += (TouchInput.y - this.notificationWindow.y)-SSMBS_Window_Notification.yDelta;
		//防止出屏
		if(this.notificationWindow.x <= 0 ){
			this.notificationWindow.x = 0;
		}
		if(this.notificationWindow.y <= 0 ){
			this.notificationWindow.y = 0;
		}
		if(this.notificationWindow.x + SSMBS_Window_Notification.width >= Graphics.width ){
			this.notificationWindow.x = Graphics.width - SSMBS_Window_Notification.width;
		}
		if(this.notificationWindow.y + SSMBS_Window_Notification.maxLines * SSMBS_Window_Notification.lineHeight >= Graphics.height ){
			this.notificationWindow.y = Graphics.height - SSMBS_Window_Notification.maxLines * SSMBS_Window_Notification.lineHeight;
		}
		this.notificationWord.x = this.notificationWindow.x;
		this.notificationWord.y = this.notificationWindow.y;
		$gameSystem.windowNotificationX = this.notificationWindow.x;
		$gameSystem.windowNotificationY = this.notificationWindow.y;
	}
	if(TouchInput.isHovered()){
		this.drawingWindow = null;
		this.isTouchingButton = false;
	}
};