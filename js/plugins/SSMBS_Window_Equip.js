
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - window - Equip
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 装备窗口界面
 * @author 神仙狼
 *
 * 
 * 
 */

var SSMBS_Window_Equip = SSMBS_Window_Equip||{};

SSMBS_Window_Equip.width = 298;
SSMBS_Window_Equip.height = 498;
SSMBS_Window_Equip.defaultX = 200;
SSMBS_Window_Equip.defaultY = 200;
SSMBS_Window_Equip.defaultFontSize = 12;
SSMBS_Window_Equip.equipsPositon = [{x:0,y:0}];
SSMBS_Window_Equip.lvupAddParamPoints = 5;

SSMBS_Window_Equip.hotkey = 'p';

SSMBS_Window_Equip.windowTitle = '装 备';
SSMBS_Window_Equip.gridOpacity = 100;
SSMBS_Window_Equip.gridSize = 32;
SSMBS_Window_Equip.gridStartX = 24;
SSMBS_Window_Equip.gridStartY = 96;
SSMBS_Window_Equip.gridSpaceWidth = (SSMBS_Window_Equip.width/2-SSMBS_Window_Equip.gridSize/2-SSMBS_Window_Equip.gridStartX)*2;
SSMBS_Window_Equip.gridSpaceHeight = 40;
SSMBS_Window_Equip.gridColumns = 2;

SSMBS_Window_Equip.aparamListNowLine = 0;
SSMBS_Window_Equip.aparamList = [ 'trg', 'sspd', 'hit' , 'eva', 'cri' , 'cev' , 'mev' , 'mrf' , 'cnt' , 'hrg', 'mrg' , 'mcr' , 'pdr', 'mdr','elements 2','elements 3','elements 4','elements 5','elements 6','elements 7','elements 8' ,'elements 9']
SSMBS_Window_Equip.aparamListName = [ '攻击速度', '吟唱速度', '命中率' , '闪避率', '暴击率' , '暴击回避率' , '魔法回避率' , '击退' , '攻击距离' , '生命恢复', '魔法恢复' , '魔法消耗' , '物理承伤', '魔法承伤','元素承伤','元素承伤','元素承伤','元素承伤','元素承伤','元素承伤','元素承伤','元素承伤']


SSMBS_Window_Equip.drawWindowY = 32;


SSMBS_Window_Equip.equipGridsPositons = [];
SSMBS_Window_Equip.nowActor = 0;

const _SSMBS_Window_Equip_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_SSMBS_Window_Equip_mapLoad.call(this);
	this.createEquipWindow();
	SSMBS_Window_Equip.isOpen = false;
};

const _SSMBS_Window_Equip_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_SSMBS_Window_Equip_mapUpdate.call(this);
	this.nowActor = SSMBS_Window_Equip.nowActor;
	if(Input.isTriggered( SSMBS_Window_Equip.hotkey )){
		SSMBS_Window_Inventory.isDrawingInventoryWindow = false;
		this.equipWindow.x = $gameSystem.windowEquipX?$gameSystem.windowEquipX:SSMBS_Window_Equip.defaultX;
		this.equipWindow.y = $gameSystem.windowEquipY?$gameSystem.windowEquipY:SSMBS_Window_Equip.defaultY;
		SSMBS_Window_Equip.isOpen = !SSMBS_Window_Equip.isOpen;
	}
	if(SSMBS_Window_Equip.isOpen){
		this.updateEquipWindow();
		this.equipWindow.opacity = 255;
		this.equipGrids.opacity = SSMBS_Window_Equip.gridOpacity;
		this.equipIcons.opacity = 255;
		this.paramWords.opacity = 255;
	}else{
		this.equipWindow.opacity = 0;
		this.equipGrids.opacity = 0;
		this.equipIcons.opacity = 0;
		this.paramWords.opacity = 0;
	}
	
}

Scene_Map.prototype.createEquipWindow = function(){
	this.equipWindow = new Sprite( new Bitmap( SSMBS_Window_Equip.width ,SSMBS_Window_Equip.height ));
	this.equipWindow.x = $gameSystem.windowEquipX?$gameSystem.windowEquipX:SSMBS_Window_Equip.defaultX;
	this.equipWindow.y = $gameSystem.windowEquipY?$gameSystem.windowEquipY:SSMBS_Window_Equip.defaultY;
	this.equipWindow.smooth  = false;
	this.addChild(this.equipWindow);
	this.equipGrids = new Sprite( new Bitmap( SSMBS_Window_Equip.width ,SSMBS_Window_Equip.height ));
	this.equipGrids.x = this.equipWindow.x;
	this.equipGrids.y = this.equipWindow.y;
	this.equipGrids.opacity = SSMBS_Window_Equip.gridOpacity;
	this.addChild(this.equipGrids);
	this.equipIcons = new Sprite( new Bitmap( SSMBS_Window_Equip.width ,SSMBS_Window_Equip.height ));
	this.equipIcons.x = this.equipWindow.x;
	this.equipIcons.y = this.equipWindow.y;
	this.addChild(this.equipIcons);
	this.paramWords = new Sprite( new Bitmap( SSMBS_Window_Equip.width ,SSMBS_Window_Equip.height ));
	this.paramWords.x = this.equipWindow.x;
	this.paramWords.y = this.equipWindow.y;
	this.addChild(this.paramWords);
}

Scene_Map.prototype.updateEquipWindow = function(){
	var nowActor = $gameParty.members()[SSMBS_Window_Equip.nowActor];
	this.equipWindow.bitmap.clear();
	this.equipGrids.bitmap.clear();
	this.equipIcons.bitmap.clear();
	this.paramWords.bitmap.clear();
	if(!this.nowPickedItem){
		this.itemType = null;
	}
	if( TouchInput.x > this.equipWindow.x && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.width 
		&& TouchInput.y > this.equipWindow.y && TouchInput.y < this.equipWindow.y+SSMBS_Window_Equip.height){
		// 限制角色攻击
		$gameParty.members()[0]._tp = 0;
		// 拖拽使用角色装备
		if(this.touchIcon.item && TouchInput.isReleased()){
			sxlSimpleABS.useItem(this.touchIcon.item,$gamePlayer)
		}
		//拖动窗口
		if( TouchInput.isPressed() && TouchInput.y < this.equipWindow.y + SSMBS_Window_Equip.drawWindowY && !SSMBS_Window_Inventory.isDrawing && !this.drawingWindow ){
			this.isDrawing = true;
			this.drawingWindow = 'Equips';
			if(!SSMBS_Window_Equip.xDelta) SSMBS_Window_Equip.xDelta = TouchInput.x - this.equipWindow.x;
			if(!SSMBS_Window_Equip.yDelta) SSMBS_Window_Equip.yDelta = TouchInput.y - this.equipWindow.y;
		}
		
	}
	//拖动窗口
	if( TouchInput.isPressed() && this.drawingWindow == 'Equips' && !this.nowPickedItem){
		this.equipWindow.x += (TouchInput.x - this.equipWindow.x)-SSMBS_Window_Equip.xDelta;
		this.equipWindow.y += (TouchInput.y - this.equipWindow.y)-SSMBS_Window_Equip.yDelta;
		//防止出屏
		if(this.equipWindow.x <= 0 ){
			this.equipWindow.x = 0;
		}
		if(this.equipWindow.y <= 0 ){
			this.equipWindow.y = 0;
		}
		if(this.equipWindow.x + SSMBS_Window_Equip.width >= Graphics.width ){
			this.equipWindow.x = Graphics.width - SSMBS_Window_Equip.width;
		}
		if(this.equipWindow.y + SSMBS_Window_Equip.drawWindowY >= Graphics.height ){
			this.equipWindow.y = Graphics.height - SSMBS_Window_Equip.drawWindowY;
		}
		this.equipGrids.x = this.equipWindow.x;
		this.equipGrids.y = this.equipWindow.y;
		this.equipIcons.x = this.equipWindow.x;
		this.equipIcons.y = this.equipWindow.y;
		this.paramWords.x = this.equipWindow.x;
		this.paramWords.y = this.equipWindow.y;
		$gameSystem.windowEquipX = this.equipWindow.x;
		$gameSystem.windowEquipY = this.equipWindow.y;
	}
	if(TouchInput.isHovered()){
		this.isDrawing = false;
		this.drawingWindow = null;
		SSMBS_Window_Equip.xDelta = 0;
		SSMBS_Window_Equip.yDelta = 0;
	}
	//绘制窗口图像
	this.equipWindow.bitmap.blt( 
		ImageManager.loadSystem('window_black'),
		0,0, //切割坐标
		SSMBS_Window_Equip.width ,SSMBS_Window_Equip.height,//切割尺寸
		0, 0,// 绘制坐标
		SSMBS_Window_Equip.width ,SSMBS_Window_Equip.height //最终大小
	)
	if( TouchInput.x > this.equipWindow.x + SSMBS_Window_Equip.width-32
		&& TouchInput.x < this.equipWindow.x + SSMBS_Window_Equip.width-32+SSMBS_Window_Equip.defaultFontSize
		&& TouchInput.y > this.equipWindow.y + SSMBS_Window_Equip.drawWindowY/2-SSMBS_Window_Equip.defaultFontSize/2
		&& TouchInput.y < this.equipWindow.y + SSMBS_Window_Equip.drawWindowY/2-SSMBS_Window_Equip.defaultFontSize/2+SSMBS_Window_Equip.defaultFontSize){
		this.equipWindow.bitmap.textColor = ColorManager.textColor(8);
		if(TouchInput.isClicked()){
			SSMBS_Window_Equip.isOpen = false;
		}
	}else{
		this.equipWindow.bitmap.textColor = ColorManager.textColor(0);
	}
	this.equipWindow.bitmap.drawText( 'x', SSMBS_Window_Equip.width-32,SSMBS_Window_Equip.drawWindowY/2-SSMBS_Window_Equip.defaultFontSize/2 ,SSMBS_Window_Equip.defaultFontSize,SSMBS_Window_Equip.defaultFontSize,'right' );
	this.equipWindow.bitmap.textColor = ColorManager.textColor(0);
	this.equipWindow.bitmap.fontSize = 16;
	this.equipWindow.bitmap.drawText( SSMBS_Window_Equip.windowTitle,0,0,SSMBS_Window_Equip.width,36,'center' );
	// 人物背景
	this.equipWindow.bitmap.blt(
		ImageManager.loadSystem('equipWindowCharacterBackground'),
		0,
		0, //切割坐标
		298,500,//切割尺寸
		SSMBS_Window_Equip.width/2-172/2, 
		-48,// 绘制坐标
		172, 300 //最终大小
	)
	//纸娃娃武器
	// this.equipWindow.bitmap.blt(
	// 	ImageManager.loadSystem('IconSet'),
	// 	nowActor.equips()[0].iconIndex % 16*32,
	// 	Math.floor(nowActor.equips()[0].iconIndex / 16)*32, //切割坐标
	// 	32,	32,//切割尺寸
	// 	SSMBS_Window_Equip.width/2-ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName).width/3/2-16*(nowActor.equips()[0].meta.scale?Number(nowActor.equips()[0].meta.scale):1), 
	// 	128-2*(nowActor.equips()[0].meta.scale?Number(nowActor.equips()[0].meta.scale):1)+6,// 绘制坐标
	// 	32*nowActor.equips()[0].meta.scale, 32*nowActor.equips()[0].meta.scale //最终大小
	// 	)

	//纸娃娃人物
	this.equipWindow.bitmap.blt(
		ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName),
		1*ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName).width/3,
		0, //切割坐标
		ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName).width/3,
		ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName).height/4,//切割尺寸
		SSMBS_Window_Equip.width/2-ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName).width/3/2, 
		128,// 绘制坐标
		ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName).width/3, 
		ImageManager.loadCharacter(nowActor.player.spriteIndex()._characterName).height/4 //最终大小
	)
	
		
	
	for( let i = 0 ; i < $dataSystem.equipTypes.length-1 ; i ++){
		var item = $gameParty.members()[SSMBS_Window_Equip.nowActor].equips()[i];
		var theEquipGridX = (i%SSMBS_Window_Equip.gridColumns)*SSMBS_Window_Equip.gridSpaceWidth+SSMBS_Window_Equip.gridStartX;
		var theEquipGridY = Math.floor(i/SSMBS_Window_Equip.gridColumns)*SSMBS_Window_Equip.gridSpaceHeight+SSMBS_Window_Equip.gridStartY;
		//读取角色称号
		if(item.meta.label){
			nowActor.label = item.meta.label;
			if(item.meta.textColor){
				nowActor.labelColor1 = item.meta.textColor;
			}else{
				nowActor.labelColor1 = 0;
			}
			if(item.meta.textColor2){
				nowActor.labelColor2 = item.meta.textColor2;
			}else{
				nowActor.labelColor2 = nowActor.labelColor;
			}
			
		}
		//绘制格子
		this.equipGrids.bitmap.fillRect(theEquipGridX,
										theEquipGridY,
										SSMBS_Window_Equip.gridSize,
										SSMBS_Window_Equip.gridSize,
										'#000000' );
		//绘制图标
		if( $gameParty.members()[SSMBS_Window_Equip.nowActor]._equips[i]._itemId>0 
			&& !item.meta.hide){
			// 图标背景
			if(item.meta.bkgIcon){
				var bkgIcon = Number(item.meta.bkgIcon)
			}else{
				for( color in sxlSimpleItemList.rareColorIcon){
					if(Number(item.meta.textColor) == sxlSimpleItemList.rareColor[color]){
						var bkgIcon = sxlSimpleItemList.rareColorIcon[color];
					}
					if(!item.meta.textColor){
						var bkgIcon = sxlSimpleItemList.rareColorIcon[0];
					}
				}
			}
			this.equipIcons.bitmap.blt(
			ImageManager.loadSystem('IconSet'),
			Number(bkgIcon)% 16*32,
			Math.floor(Number(bkgIcon) / 16)*32, //切割坐标
			32,	32,//切割尺寸
			theEquipGridX, 
			theEquipGridY,// 绘制坐标
			SSMBS_Window_Equip.gridSize, SSMBS_Window_Equip.gridSize //最终大小
			)
			//绘制图标
			this.equipIcons.bitmap.blt(
			ImageManager.loadSystem('IconSet'),
			item.iconIndex % 16*32,
			Math.floor(item.iconIndex / 16)*32, //切割坐标
			32,	32,//切割尺寸
			theEquipGridX, 
			theEquipGridY,// 绘制坐标
			SSMBS_Window_Equip.gridSize, SSMBS_Window_Equip.gridSize //最终大小
			)
		}
		//耐久度
		if( sxlSimpleItemList.durabilityAllowed && item.etypeId && !item.meta.unbreakable ){
			let type = item.wtypeId?$gameParty.durabilityWeapons:$gameParty.durabilityArmors;
			let maxDura = item.meta.durability?Number(item.meta.durability):100;
			this.equipIcons.bitmap.textColor = ColorManager.textColor(24);
			if(Math.round((type[item.id-1]/maxDura)*100)<20){
				this.equipIcons.bitmap.textColor = ColorManager.textColor(25);
			}
			this.equipIcons.bitmap.fontSize = SSMBS_Window_Equip.defaultFontSize;
			this.equipIcons.bitmap.drawText(
			Math.round((type[item.id-1]/maxDura)*100)+'%',
			theEquipGridX, 
			theEquipGridY+32-SSMBS_Window_Equip.defaultFontSize,
			32,
			SSMBS_Window_Equip.defaultFontSize,
			'center'
			)
		}
		//绘制纸娃娃
		if(item.meta.img){
			
			this.equipWindow.bitmap.blt(
				ImageManager.loadCharacter(item.meta.img),
				1*ImageManager.loadCharacter(item.meta.img).width/3,
				0, //切割坐标
				ImageManager.loadCharacter(item.meta.img).width/3,
				ImageManager.loadCharacter(item.meta.img).height/4,//切割尺寸
				SSMBS_Window_Equip.width/2-ImageManager.loadCharacter(item.meta.img).width/3/2, 
				128,// 绘制坐标
				ImageManager.loadCharacter(item.meta.img).width/3, 
				ImageManager.loadCharacter(item.meta.img).height/4 //最终大小
				)
			
		}
		
		//物品信息
		if( TouchInput.x > this.equipWindow.x + theEquipGridX && TouchInput.x < this.equipWindow.x + theEquipGridX + SSMBS_Window_Equip.gridSize 
		&& TouchInput.y > this.equipWindow.y + theEquipGridY && TouchInput.y < this.equipWindow.y + theEquipGridY + SSMBS_Window_Equip.gridSize ){
			if(!this.isDrawing){
				this.itemInform = item;
			}
			if(TouchInput.isPressed() && !this.isHandledItem){
				this.isDrawing = true;
				this.nowPickedItem = item;
				this.touchIcon.item = item;
				this.isHandledItem = this.touchIcon;
				this.item = this.touchIcon.item;
				this.itemType = 'equiped';
				this.isDrawingItem = true;
			}
		}
	}
	let line = 0;
	let lineHeight = 18;
	let nameStartY = 48;
	this.paramWords.bitmap.fontSize = 16;
	this.paramWords.bitmap.drawText( nowActor.name(),0,nameStartY+line*lineHeight,SSMBS_Window_Equip.width,36,'center' );
	line ++ ;
	this.paramWords.bitmap.fontSize = SSMBS_Window_Equip.defaultFontSize;
	if(nowActor.label){
		this.equipWindow.bitmap.drawTextGradient( nowActor.label,0,nameStartY+line*lineHeight,SSMBS_Window_Equip.width,36,'center',ColorManager.textColor(nowActor.labelColor1),ColorManager.textColor(nowActor.labelColor2) );
		line ++ ;
	}
	this.paramWords.bitmap.drawText( '等级'+nowActor._level+' '+$dataClasses[nowActor._classId].name,0,nameStartY+line*lineHeight,SSMBS_Window_Equip.width,36,'center');
	line = 7.5 ;
	
	for(text of $dataActors[nowActor._actorId].profile.split('/NL')){
		this.paramWords.bitmap.drawText( text,SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+12,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+12)*2,36,'center');
		line +=0.9 ;
	}
	// this.paramWords.bitmap.drawText( TextManager.hp+'：',SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'left');
	// this.paramWords.bitmap.drawText( Math.floor(nowActor._hp)+'/'+Math.floor(nowActor.mhp),SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'right');
	// line +=0.9 ;
	// this.paramWords.bitmap.drawText( '('+TextManager.hp+'恢复：',SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'left');
	// this.paramWords.bitmap.drawText( Math.floor(nowActor.hrg*100)+' /秒)',SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'right');
	// line +=0.9 ;
	// this.paramWords.bitmap.drawText( TextManager.mp+'：',SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'left');
	// this.paramWords.bitmap.drawText( Math.floor(nowActor._mp)+'/'+Math.floor(nowActor.mmp),SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'right');
	// line +=0.9 ;
	// this.paramWords.bitmap.drawText( '('+TextManager.mp+'恢复：',SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'left');
	// this.paramWords.bitmap.drawText( Math.floor(nowActor.mrg*100)+' /秒)',SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36,nameStartY+line*lineHeight,SSMBS_Window_Equip.width-(SSMBS_Window_Equip.gridStartX+SSMBS_Window_Equip.gridSize+36)*2,36,'right');
	line = 12 ;
	let paramBoxWidthPadding = 12;
	let paramBoxWidthSpace = 6;
	let paramBoxWidth = SSMBS_Window_Equip.width/2-(SSMBS_Window_Equip.gridStartX)-paramBoxWidthSpace/2;

	this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX,nameStartY+line*lineHeight,paramBoxWidth,210 )
	this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidth,nameStartY+line*lineHeight,paramBoxWidth,210 )
	let aparamLine = line;
	
	// 描述属性值
	// 基础属性描述
	let rectColor = nowActor.paramPoints>0?ColorManager.textColor(14):ColorManager.textColor(0);
	this.paramWords.bitmap.fontBold = true;
	this.paramWords.bitmap.fontSize += 2;
	this.paramWords.bitmap.drawText( '基础属性',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
	this.paramWords.bitmap.fontBold = false;
	this.paramWords.bitmap.fontSize -= 2;
	line += 1.5 ;
	this.paramWords.bitmap.drawText( TextManager.hp+ ': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( Math.floor(nowActor._hp)+'/'+Math.floor(nowActor.mhp),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	//加点
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(0),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[0]+=10*multip;
				}
			}
	}
	line ++ ;
	this.paramWords.bitmap.drawText( TextManager.mp+ ': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( Math.floor(nowActor._mp)+'/'+Math.floor(nowActor.mmp),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(1),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[1]+=10*multip;
				}
			}
	}
	line ++ ;
	this.paramWords.bitmap.drawText( TextManager.param(2)+ ': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( nowActor.atk,SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(2),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[2]+=1*multip;
				}
			}
	}
	line ++ ;
	this.paramWords.bitmap.drawText( TextManager.param(3)+': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( nowActor.mat,SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(3),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[3]+=1*multip;
				}
			}
	}
	line ++ ;
	this.paramWords.bitmap.drawText( TextManager.param(4)+': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( nowActor.def,SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(4),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[4]+=1*multip;
				}
			}
	}
	line ++ ;
	this.paramWords.bitmap.drawText( TextManager.param(5)+': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( nowActor.mdf,SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(5),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[5]+=1*multip;
				}
			}
	}
	line ++ ;
	this.paramWords.bitmap.drawText( TextManager.param(6)+': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( nowActor.agi,SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(6),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[6]+=1*multip;
				}
			}
	}
	line ++ ;
	this.paramWords.bitmap.drawText( TextManager.param(7)+': ',SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
	this.paramWords.bitmap.drawText( nowActor.luk,SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
	if(TouchInput.x > this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding && TouchInput.x < this.equipWindow.x+SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding+paramBoxWidth-paramBoxWidthPadding*2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+(line+0.5)*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+(line+0.5)*lineHeight + lineHeight ){
			this.equipGrids.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor )
			if(nowActor.paramPoints>0){
				
				this.paramWords.bitmap.fillRect( SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight+lineHeight/2-lineHeight,paramBoxWidth-paramBoxWidthPadding*2,lineHeight,rectColor );
				this.paramWords.bitmap.drawText( '点击增加'+TextManager.param(7),SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+(line-1)*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
				if(TouchInput.isClicked()){
					let multip = Input.isPressed('shift')?10:1;
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100,pan:0})
					nowActor.usedPP += multip;
					nowActor.paramPoints -= multip ;
					nowActor._paramPlus[7]+=1*multip;
				}
			}
	}
	line += 1.5 ;
	if(nowActor.paramPoints>0){
		this.paramWords.bitmap.fontBold = true;
		this.paramWords.bitmap.drawTextGradient( '剩余属性点: ' + nowActor.paramPoints,SSMBS_Window_Equip.gridStartX+paramBoxWidthPadding,nameStartY+line*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center', ColorManager.textColor(14),ColorManager.textColor(14));
		this.paramWords.bitmap.fontBold = false;
	}
	
	//附加属性描述
	if( TouchInput.x > this.equipWindow.x + SSMBS_Window_Equip.gridStartX + paramBoxWidthPadding * 2 + paramBoxWidth && TouchInput.x < this.equipWindow.x + SSMBS_Window_Equip.gridStartX + paramBoxWidthPadding * 2 + paramBoxWidth + paramBoxWidth - paramBoxWidthPadding * 2 
		&& TouchInput.y > this.equipWindow.y + nameStartY+aparamLine*lineHeight && TouchInput.y < this.equipWindow.y + nameStartY+aparamLine*lineHeight + 210 ){
		if(TouchInput.wheelY!=0)console.log(SSMBS_Window_Equip.aparamListNowLine)
		if(TouchInput.wheelY < 0 && SSMBS_Window_Equip.aparamListNowLine>0){
			SSMBS_Window_Equip.aparamListNowLine -= 1;
		}
		if(TouchInput.wheelY > 0 && SSMBS_Window_Equip.aparamListNowLine < SSMBS_Window_Equip.aparamList.length-9 ){
			SSMBS_Window_Equip.aparamListNowLine ++;
		}
	}
	this.paramWords.bitmap.fontBold = true;
	this.paramWords.bitmap.fontSize += 2;
	this.paramWords.bitmap.drawText( '附加属性',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'center');
	this.paramWords.bitmap.fontBold = false;
	this.paramWords.bitmap.fontSize -= 2;
	aparamLine += 1.5 ;
	for( let i = SSMBS_Window_Equip.aparamListNowLine ; i < SSMBS_Window_Equip.aparamListNowLine+9 ; i ++ ){
		if(SSMBS_Window_Equip.aparamList[i].split(' ')[0]!='elements'){
			this.paramWords.bitmap.drawText(  SSMBS_Window_Equip.aparamListName[i] ,SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
		}
		switch (SSMBS_Window_Equip.aparamList[i].split(' ')[0]){
			case 'trg':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.trg*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'sspd':
				this.paramWords.bitmap.drawText(  nowActor.castSpeedParam+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'hit':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.hit*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'eva':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.eva*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'cri':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.cri*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'cev':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.cev*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'mev':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.mev*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'mrf':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.mev*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'cnt':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.cnt*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'hrg':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.hrg)+' 每秒',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'mrg':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.mrg)+' 每秒',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'mcr':
				this.paramWords.bitmap.drawText(  Math.round(nowActor.mcr*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right');
				break;
			case 'pdr':
				if(nowActor.pdr>1){
					var color = 25;
				}
				if(nowActor.pdr<1){
					var color = 24;
				}
				if(nowActor.pdr==1){
					var color = 0;
				}
				this.paramWords.bitmap.drawTextGradient(  Math.round(nowActor.pdr*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right', ColorManager.textColor(color),ColorManager.textColor(color));
				break;
			case 'mdr':
				if(nowActor.mdr>1){
					var color = 25;
				}
				if(nowActor.mdr<1){
					var color = 24;
				}
				if(nowActor.mdr==1){
					var color = 0;
				}
				this.paramWords.bitmap.drawTextGradient(  Math.round(nowActor.mdr*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right', ColorManager.textColor(color),ColorManager.textColor(color));
				break;
			case 'elements':
				this.paramWords.bitmap.drawText(  $dataSystem.elements[Number(SSMBS_Window_Equip.aparamList[i].split(' ')[1])]+SSMBS_Window_Equip.aparamListName[i] ,SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'left');
				if(nowActor.elementRate(Number(SSMBS_Window_Equip.aparamList[i].split(' ')[1]))>1){
					var color = 25;
				}
				if(nowActor.elementRate(Number(SSMBS_Window_Equip.aparamList[i].split(' ')[1]))<1){
					var color = 24;
				}
				if(nowActor.elementRate(Number(SSMBS_Window_Equip.aparamList[i].split(' ')[1]))==1){
					var color = 0;
				}
				this.paramWords.bitmap.drawTextGradient(  Math.round(nowActor.elementRate(Number(SSMBS_Window_Equip.aparamList[i].split(' ')[1]))*100)+'%',SSMBS_Window_Equip.gridStartX+paramBoxWidthSpace+paramBoxWidthPadding+paramBoxWidth,nameStartY+aparamLine*lineHeight,paramBoxWidth-paramBoxWidthPadding*2,36,'right', ColorManager.textColor(color),ColorManager.textColor(color));
				
				break;
		}
		aparamLine ++;
	}

}

const _memberFaceLVUP = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
	_memberFaceLVUP.call(this);
	sxlSimpleABS.showInformation('【'+this._name+'】获得技能点：',ColorManager.textColor(0))
	if(!this.paramPoints){
		this.paramPoints = 0;
	}
	this.paramPoints += SSMBS_Window_Equip.lvupAddParamPoints;
};

SSMBS_Window_Equip.resetParamPoints = function(actorID){
	if(!$gameActors.actor(actorID).paramPoints){
		$gameActors.actor(actorID).paramPoints = 0;
	}
	if(!$gameActors.actor(actorID).usedPP){
		$gameActors.actor(actorID).usedPP = 0;
	}
	$gameActors.actor(actorID).paramPoints += $gameActors.actor(actorID).usedPP;
	$gameActors.actor(actorID).usedPP = 0;
	for( i in $gameActors.actor(actorID)._paramPlus){
		$gameActors.actor(actorID)._paramPlus[i] = 0;
	}
};

SSMBS_Window_Equip.addParamPoints = function(actorID,amount){
	$gameActors.actor(actorID).paramPoints += amount;
};