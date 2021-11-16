
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - window - Inventory
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 物品窗口界面
 * @author 神仙狼
 *
 * SSMBS_Window_Inventory.addSize( Number )     为物品栏增加行数
 * SSMBS_Window_Inventory.isOpen = true/false   打开/关闭物品栏
 * 
 * 
 */

var SSMBS_Window_Inventory = SSMBS_Window_Inventory||{};

SSMBS_Window_Inventory.windowTitle = '物 品';

SSMBS_Window_Inventory.width = 298;
SSMBS_Window_Inventory.height = 498;
SSMBS_Window_Inventory.defaultX = 600;
SSMBS_Window_Inventory.defaultY = 200;

SSMBS_Window_Inventory.hotkey = 'b';
SSMBS_Window_Inventory.appearSpeed = 255;

SSMBS_Window_Inventory.gridsStartX = 10;
SSMBS_Window_Inventory.gridsStartY = 32 + 10;
SSMBS_Window_Inventory.gridOpaciity = 128;

SSMBS_Window_Inventory.gridsSize = 32;
SSMBS_Window_Inventory.gridsSpace = 2;
SSMBS_Window_Inventory.gridsPerLine = 8;
SSMBS_Window_Inventory.gridsLines = 12;
SSMBS_Window_Inventory.maxLines = 6;

SSMBS_Window_Inventory.scrollWidth = 5;
SSMBS_Window_Inventory.scrollColor = '#999999';

SSMBS_Window_Inventory.defaultFontSize = 12;
SSMBS_Window_Inventory.gridsItemNumFontSize = 12;

SSMBS_Window_Inventory.drawWindowY = 32;

SSMBS_Window_Inventory.goldIcon = 600;
SSMBS_Window_Inventory.lockedIcon = 432;



SSMBS_Window_Inventory.listFirstLine = 0;

SSMBS_Window_Inventory.saveItemPositon = function(item,position){
	if(item.wtypeId){
		$gameParty.weaponsPosition[item.id] = position;
	}
	if(item.atypeId){
		$gameParty.armorsPosition[item.id] = position;
	}
	if(item.itypeId){
		$gameParty.itemsPosition[item.id] = position;
	}
};

SSMBS_Window_Inventory.loadPosition = function(item){
	if(item.wtypeId){
		return $gameParty.weaponsPosition[item.id];
	}
	if(item.atypeId){
		return $gameParty.armorsPosition[item.id];
	}
	if(item.itypeId){
		return $gameParty.itemsPosition[item.id];
	}

};

SSMBS_Window_Inventory.addSize = function(amount){
	amont = Number(amount)
	if(amount>0){
		for( let i = 0 ; i < amount ; i ++ ){
			SSMBS_Window_Inventory.scene.gridsHasItem.push('empty');
			$gameParty.inventorySize ++ ;
		}
	}
	if(amount<0){
		if(Math.abs(amount)>$gameParty.inventorySize){
			amount = -$gameParty.inventorySize+1;
		}
		for( let i = 0 ; i < $gameParty.allItems().length ; i ++ ){
			let item = $gameParty.allItems()[i];
			if( item && SSMBS_Window_Inventory.loadPosition(item)>=($gameParty.inventorySize+amount)*SSMBS_Window_Inventory.gridsPerLine ){
				if($gameParty.hasItem(item)){
					if(item.itypeId){			
						var type = 'item';
					} 
					if(item.wtypeId){
						var type = 'weapon';
					} 
					if(item.atypeId){
						var type = 'armor';
					} 
					for( let e = 0 ; e < $gameParty.members()[0].equips().length ; e ++  ){
						let equip = $gameParty.members()[0].equips()[e];
						if(equip == item){
							if (type == 'weapon'){
								$gameParty.members()[0].changeEquip( 0 , $dataWeapons[1] ) ;
							}
							if (type == 'armor'){
								$gameParty.members()[0].changeEquip( item.etypeId - 1 ,$dataArmors[item.etypeId-1]) ;
							}
						}
					}
					let amount = $gameParty.numItems(item);
					$gameParty.loseItem(item,amount,true);
					ssmbsLoot.loot('aroundPlayer',type,item.id,amount);
				}
			}
		}
		$gameParty.inventorySize += amount;
	}
	SSMBS_Window_Inventory.scene.refreshGridsHasItem();
};

const _SSMBS_Window_Inventory_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_SSMBS_Window_Inventory_mapLoad.call(this);
	SSMBS_Window_Inventory.scene = this;
	SSMBS_Window_Inventory.isOpen = false;
	if(!$gameParty.inventorySize){
		$gameParty.inventorySize = SSMBS_Window_Inventory.maxLines;
	}
	this.createInventoryWindow();
	SSMBS_Window_Inventory.defaultFontColor = ColorManager.textColor(0);
	if(!$gameParty.itemsPosition){
		$gameParty.itemsPosition = [];
	}
	if(!$gameParty.weaponsPosition){
		$gameParty.weaponsPosition = [];
	}
	if(!$gameParty.armorsPosition){
		$gameParty.armorsPosition = [];
	}
	for( let i = 0; i<$dataItems.length ; i++ ){
		$gameParty.itemsPosition.push(null);
	}
	for( let i = 0; i<$dataWeapons.length ; i++ ){
		$gameParty.weaponsPosition.push(null);
	}
	for( let i = 0; i<$dataArmors.length ; i++ ){
		$gameParty.armorsPosition.push(null);
	}
	if(!this.gridsHasItem){
		this.refreshGridsHasItem();
	}
};

const _SSMBS_Window_Inventory_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_SSMBS_Window_Inventory_mapUpdate.call(this);
	if(SSMBS_Window_Inventory.isOpen){
		this.updateInventory();
		if(this.inventoryWindowGrid.opacity<SSMBS_Window_Inventory.gridOpaciity){
			this.inventoryWindowGrid.opacity += SSMBS_Window_Inventory.appearSpeed*SSMBS_Window_Inventory.gridOpaciity/255;
		}
		this.inventoryWindowItemIcons.opacity += SSMBS_Window_Inventory.appearSpeed;
		this.inventoryWindow.opacity += SSMBS_Window_Inventory.appearSpeed;
	}else{
		this.inventoryWindowGrid.opacity -= SSMBS_Window_Inventory.appearSpeed;
		this.inventoryWindowItemIcons.opacity -= SSMBS_Window_Inventory.appearSpeed;
		this.inventoryWindow.opacity -= SSMBS_Window_Inventory.appearSpeed;
	}
	if(Input.isTriggered( SSMBS_Window_Inventory.hotkey )){
		this.inventoryWindow.x = $gameSystem.windowInventoryX?$gameSystem.windowInventoryX:SSMBS_Window_Inventory.defaultX;
		this.inventoryWindow.y = $gameSystem.windowInventoryY?$gameSystem.windowInventoryY:SSMBS_Window_Inventory.defaultY;
		SSMBS_Window_Inventory.isOpen = !SSMBS_Window_Inventory.isOpen;
	}
	
};

Scene_Map.prototype.createInventoryWindow = function(){
	this.inventoryWindow = new Sprite( new Bitmap( SSMBS_Window_Inventory.width ,SSMBS_Window_Inventory.height ));
	this.addChild(this.inventoryWindow);
	this.inventoryWindowGrid = new Sprite( new Bitmap( SSMBS_Window_Inventory.width ,SSMBS_Window_Inventory.height ));
	this.inventoryWindowGrid.opacity = 100;
	this.addChild(this.inventoryWindowGrid);
	this.inventoryWindowItemIcons = new Sprite( new Bitmap( SSMBS_Window_Inventory.width ,SSMBS_Window_Inventory.height ));
	this.addChild(this.inventoryWindowItemIcons);
	this.touchIcon = new Sprite( ImageManager.loadSystem('IconSet') );
	this.touchIcon.anchor.x = 0.5;
	this.touchIcon.anchor.y = 0.5;
	this.touchIcon.setFrame(0 % 16*32,Math.floor(0 / 16)*32,32,32);
	this.addChild(this.touchIcon);
};

Scene_Map.prototype.refreshGridsHasItem = function(){
	this.gridsHasItem = [];
	for( let i = 0; i < SSMBS_Window_Inventory.gridsPerLine*$gameParty.inventorySize ; i++ ){
		if(!this.gridsHasItem[i]){
			this.gridsHasItem.push('empty');
		}
	}
	for( let j = 0 ; j < this.gridsHasItem.length ; j ++ ){
		if((this.gridsHasItem[j] && this.gridsHasItem[j]=='empty')){
			SSMBS_Window_Inventory.firstEmptyGrid = j;
			break;
		}
	}
	
	
};

Scene_Map.prototype.updateInventory = function(){
	this.inventoryWindow.bitmap.clear();
	this.inventoryWindowGrid.bitmap.clear();
	this.inventoryWindowItemIcons.bitmap.clear();
	this.inventoryWindowGrid.x = this.inventoryWindow.x;
	this.inventoryWindowGrid.y = this.inventoryWindow.y;
	this.inventoryWindowItemIcons.x = this.inventoryWindow.x;
	this.inventoryWindowItemIcons.y = this.inventoryWindow.y;
	this.touchIcon.x = TouchInput.x;
	this.touchIcon.y = TouchInput.y;
	if(!this.nowPickedItem){
		this.itemType = null;
	}
	if( this.gridsHasItem[SSMBS_Window_Inventory.firstEmptyGrid]!='empty'){
		SSMBS_Window_Inventory.firstEmptyGrid = SSMBS_Window_Inventory.gridsPerLine*$gameParty.inventorySize+1;
	}
	let hasItem;
	if(hasItem!= $gameParty.allItems().length){
		//清空不拥有物品的位置信息
		for( let i = 0 ; i < $dataItems.length ; i ++ ){
			let item =  $dataItems[i];
			if(item && !item.meta.hide && !$gameParty.hasItem(item,true)){
				SSMBS_Window_Inventory.saveItemPositon(item,null);
			}
		}
		for( let i = 0 ; i < $dataWeapons.length ; i ++ ){
			let weapon = $dataWeapons[i];
			if(weapon && !weapon.meta.hide && !$gameParty.hasItem(weapon,true)){
				SSMBS_Window_Inventory.saveItemPositon(weapon,null);
			}
		}
		for( let i = 0 ; i < $dataArmors.length ; i++ ){
			let armor = $dataArmors[i];
			if(armor && !armor.meta.hide && !$gameParty.hasItem(armor,true)){
				SSMBS_Window_Inventory.saveItemPositon(armor,null);
			}
		}
		for( let grid = 0 ; grid < this.gridsHasItem.length ; grid ++ ){
			if( this.gridsHasItem[grid] && this.gridsHasItem[grid] != 'empty' && SSMBS_Window_Inventory.loadPosition(this.gridsHasItem[grid])!=grid){
				this.gridsHasItem[grid] = 'empty';
			}
		}
		hasItem= $gameParty.allItems().length;
	};
	
	if(this.nowPickedItem){
		this.touchIcon.setFrame(this.touchIcon.item.iconIndex % 16*32,Math.floor(this.touchIcon.item.iconIndex / 16)*32,32,32);
	}else{
		this.touchIcon.setFrame(0 % 16*32,Math.floor(0 / 16)*32,32,32);
	}
	//绘制窗口图像
	this.inventoryWindow.bitmap.blt( 
		ImageManager.loadSystem('window_black'),
		0,0, //切割坐标
		SSMBS_Window_Inventory.width ,SSMBS_Window_Inventory.height,//切割尺寸
		0, 0,// 绘制坐标
		SSMBS_Window_Inventory.width ,SSMBS_Window_Inventory.height //最终大小
	)
	this.inventoryWindow.bitmap.drawText( SSMBS_Window_Inventory.windowTitle,0,0,SSMBS_Window_Inventory.width,36,'center' )
	//绘制格子
	for( i = 0 ; i < SSMBS_Window_Inventory.gridsPerLine*SSMBS_Window_Inventory.gridsLines ; i ++ ){
		this.inventoryWindowGrid.bitmap.fillRect( 
		SSMBS_Window_Inventory.gridsStartX + (i%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace) , 
		SSMBS_Window_Inventory.gridsStartY + Math.floor(i/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
		SSMBS_Window_Inventory.gridsSize, 
		SSMBS_Window_Inventory.gridsSize, 
		'#000000' );
		if( !this.gridsHasItem[i+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine] ){
			this.inventoryWindowGrid.bitmap.blt(
			ImageManager.loadSystem('IconSet'),
			SSMBS_Window_Inventory.lockedIcon % 16*32,Math.floor(SSMBS_Window_Inventory.lockedIcon / 16)*32, //切割坐标
			32,	32,//切割尺寸
			SSMBS_Window_Inventory.gridsStartX + (i%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace), 
			SSMBS_Window_Inventory.gridsStartY + Math.floor(i/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),// 绘制坐标
			SSMBS_Window_Inventory.gridsSize,	SSMBS_Window_Inventory.gridsSize //最终大小
			)
		}
	}
	
	//拖动滚动条
	if(    TouchInput.x > this.inventoryWindow.x + SSMBS_Window_Inventory.gridsStartX + SSMBS_Window_Inventory.gridsPerLine*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)
		&& TouchInput.x < this.inventoryWindow.x + SSMBS_Window_Inventory.gridsStartX + SSMBS_Window_Inventory.gridsPerLine*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)+SSMBS_Window_Inventory.scrollWidth
		&& TouchInput.y > this.inventoryWindow.y + 16
		&& TouchInput.y < this.inventoryWindow.y + SSMBS_Window_Inventory.gridsLines*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace){
		//绘制滚动条（高亮）
		this.inventoryWindowGrid.bitmap.fillRect(
		SSMBS_Window_Inventory.gridsStartX + SSMBS_Window_Inventory.gridsPerLine*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
		SSMBS_Window_Inventory.gridsStartY,
		SSMBS_Window_Inventory.scrollWidth,
		SSMBS_Window_Inventory.gridsLines*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace,
		'#555555' );
		if(TouchInput.isPressed() && !SSMBS_Window_Inventory.isDrawing ){
			this.isDrawing = true;
			this.isDrawingScroll = true;
		}
	}else{
		//绘制滚动条
		this.inventoryWindowGrid.bitmap.fillRect(
		SSMBS_Window_Inventory.gridsStartX + SSMBS_Window_Inventory.gridsPerLine*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
		SSMBS_Window_Inventory.gridsStartY,
		SSMBS_Window_Inventory.scrollWidth,
		SSMBS_Window_Inventory.gridsLines*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace,
		'#000000' );
	}
	if(TouchInput.isHovered()){
		this.isDrawingScroll = false;
		this.isDrawing = false;
	}
	if(SSMBS_Window_Inventory.isDrawingScroll){
		if(TouchInput.y>=this.inventoryWindow.y + (SSMBS_Window_Inventory.gridsStartY + 1)+(SSMBS_Window_Inventory.gridsLines*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace)*(SSMBS_Window_Inventory.listFirstLine/$gameParty.inventorySize)-(((SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace)*(SSMBS_Window_Inventory.gridsLines/$gameParty.inventorySize)/2)){
			if(SSMBS_Window_Inventory.listFirstLine<$gameParty.inventorySize-SSMBS_Window_Inventory.gridsLines){
				SSMBS_Window_Inventory.listFirstLine ++;
			}
			
		}
		if(TouchInput.y<=this.inventoryWindow.y + (SSMBS_Window_Inventory.gridsStartY + 1)+(SSMBS_Window_Inventory.gridsLines*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace)*(SSMBS_Window_Inventory.listFirstLine/$gameParty.inventorySize)+(((SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace)*(SSMBS_Window_Inventory.gridsLines/$gameParty.inventorySize)/2)){
			if(SSMBS_Window_Inventory.listFirstLine>0){
				SSMBS_Window_Inventory.listFirstLine --;
			}
		}
	}
	//滚动条标记
	this.inventoryWindowGrid.bitmap.fillRect(
		SSMBS_Window_Inventory.gridsStartX + SSMBS_Window_Inventory.gridsPerLine*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
		SSMBS_Window_Inventory.gridsStartY + (SSMBS_Window_Inventory.gridsLines*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace)*((SSMBS_Window_Inventory.listFirstLine)/$gameParty.inventorySize),
		SSMBS_Window_Inventory.scrollWidth,
		((SSMBS_Window_Inventory.gridsLines) * (SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)-SSMBS_Window_Inventory.gridsSpace)*Math.min((((SSMBS_Window_Inventory.gridsLines)/$gameParty.inventorySize)),1),
		SSMBS_Window_Inventory.scrollColor );
	//导入物品
	for( let i = 0 ; i < $gameParty.allItems().length ; i ++ ){
		let item = $gameParty.allItems()[i];
		//计算第一个空格
		for( j = 0 ; j < this.gridsHasItem.length ; j ++ ){
			if(this.gridsHasItem[j]=='empty'){
				SSMBS_Window_Inventory.firstEmptyGrid = j;
				break;
			}
		}
		if(item && !item.meta.hide){
			if(!SSMBS_Window_Inventory.loadPosition(item) && SSMBS_Window_Inventory.loadPosition(item)!= 0 ){
				SSMBS_Window_Inventory.saveItemPositon(item,SSMBS_Window_Inventory.firstEmptyGrid);
			};
			// console.log(SSMBS_Window_Inventory.loadPosition(item))
			this.gridsHasItem[SSMBS_Window_Inventory.loadPosition(item)]=item;
			//绘制图标
			if(Math.floor(SSMBS_Window_Inventory.loadPosition(item)/SSMBS_Window_Inventory.gridsPerLine-SSMBS_Window_Inventory.listFirstLine)>=0 
				&& SSMBS_Window_Inventory.loadPosition(item)<SSMBS_Window_Inventory.gridsPerLine *SSMBS_Window_Inventory.gridsLines + SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine ){
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
				
					this.inventoryWindowItemIcons.bitmap.blt(
						ImageManager.loadSystem('IconSet'),
						Number(bkgIcon)% 16*32,Math.floor(Number(bkgIcon) / 16)*32, //切割坐标
						32,32,
						SSMBS_Window_Inventory.gridsStartX + (SSMBS_Window_Inventory.loadPosition(item)%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace), 
						SSMBS_Window_Inventory.gridsStartY + Math.floor(SSMBS_Window_Inventory.loadPosition(item)/SSMBS_Window_Inventory.gridsPerLine-SSMBS_Window_Inventory.listFirstLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),// 绘制坐标
						SSMBS_Window_Inventory.gridsSize,	SSMBS_Window_Inventory.gridsSize //最终大小
					)
					this.inventoryWindowItemIcons.bitmap.blt(
					ImageManager.loadSystem('IconSet'),
					item.iconIndex % 16*32,Math.floor(item.iconIndex / 16)*32, //切割坐标
					32,	32,//切割尺寸
					SSMBS_Window_Inventory.gridsStartX + (SSMBS_Window_Inventory.loadPosition(item)%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace), 
					SSMBS_Window_Inventory.gridsStartY + Math.floor(SSMBS_Window_Inventory.loadPosition(item)/SSMBS_Window_Inventory.gridsPerLine-SSMBS_Window_Inventory.listFirstLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),// 绘制坐标
					SSMBS_Window_Inventory.gridsSize,	SSMBS_Window_Inventory.gridsSize //最终大小
				)
			}
		}
	}
	//拖动窗口
	if( TouchInput.isPressed() && !this.isDrawing && !this.drawingWindow &&
		TouchInput.x > this.inventoryWindow.x
		&& TouchInput.x < this.inventoryWindow.x+SSMBS_Window_Inventory.width
		&& TouchInput.y > this.inventoryWindow.y
		&& TouchInput.y < this.inventoryWindow.y+SSMBS_Window_Inventory.drawWindowY){
		this.isDrawing = true;
		this.drawingWindow = 'Inventory';
		if(!SSMBS_Window_Inventory.xDelta) SSMBS_Window_Inventory.xDelta = TouchInput.x - this.inventoryWindow.x;
		if(!SSMBS_Window_Inventory.yDelta) SSMBS_Window_Inventory.yDelta = TouchInput.y - this.inventoryWindow.y;
	}else if (TouchInput.isHovered()) {
		this.isDrawing = false;
		this.drawingWindow = null;
		SSMBS_Window_Inventory.xDelta = 0;
		SSMBS_Window_Inventory.yDelta = 0;
	}
	if(this.drawingWindow == 'Inventory'){
		this.inventoryWindow.x += (TouchInput.x - this.inventoryWindow.x)-SSMBS_Window_Inventory.xDelta;
		this.inventoryWindow.y += (TouchInput.y - this.inventoryWindow.y)-SSMBS_Window_Inventory.yDelta;
		//防止出屏
		if(this.inventoryWindow.x <= 0 ){
			this.inventoryWindow.x = 0;
		}
		if(this.inventoryWindow.y <= 0 ){
			this.inventoryWindow.y = 0;
		}
		if(this.inventoryWindow.x + SSMBS_Window_Equip.width >= Graphics.width ){
			this.inventoryWindow.x = Graphics.width - SSMBS_Window_Equip.width;
		}
		if(this.inventoryWindow.y + SSMBS_Window_Equip.drawWindowY >= Graphics.height ){
			this.inventoryWindow.y = Graphics.height - SSMBS_Window_Equip.drawWindowY;
		}
		this.inventoryWindowGrid.x = this.inventoryWindow.x;
		this.inventoryWindowGrid.y = this.inventoryWindow.y;
		this.inventoryWindowItemIcons.x = this.inventoryWindow.x;
		this.inventoryWindowItemIcons.y = this.inventoryWindow.y;
		$gameSystem.windowInventoryX = this.inventoryWindow.x;
		$gameSystem.windowInventoryY = this.inventoryWindow.y;
	}
	for(let i = 0 ; i < SSMBS_Window_Inventory.gridsPerLine*SSMBS_Window_Inventory.gridsLines ; i ++ ){
		//高亮鼠标所在格子
		if( TouchInput.x > this.inventoryWindowGrid.x + SSMBS_Window_Inventory.gridsStartX + (i%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)
			&& TouchInput.x < this.inventoryWindowGrid.x + SSMBS_Window_Inventory.gridsStartX + (i%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)+SSMBS_Window_Inventory.gridsSize
			&& TouchInput.y > this.inventoryWindowGrid.y + SSMBS_Window_Inventory.gridsStartY + Math.floor(i/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)
			&& TouchInput.y < this.inventoryWindowGrid.y + SSMBS_Window_Inventory.gridsStartY + Math.floor(i/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace) + SSMBS_Window_Inventory.gridsSize){
			this.inventoryWindowGrid.bitmap.fillRect( 
			SSMBS_Window_Inventory.gridsStartX + (i%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace) , 
			SSMBS_Window_Inventory.gridsStartY + Math.floor(i/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
			SSMBS_Window_Inventory.gridsSize, 
			SSMBS_Window_Inventory.gridsSize, 
			'#555555' );
		}
	}
	

	//拖动物品
	for( i = 0 ;i < this.gridsHasItem.length ; i ++ ){
		if( this.gridsHasItem[i+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine] && this.gridsHasItem[i+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine] != 'empty' &&
			TouchInput.x > this.inventoryWindowGrid.x + SSMBS_Window_Inventory.gridsStartX + (i%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)
			&& TouchInput.x < this.inventoryWindowGrid.x + SSMBS_Window_Inventory.gridsStartX + (i%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)+SSMBS_Window_Inventory.gridsSize
			&& TouchInput.y > this.inventoryWindowGrid.y + SSMBS_Window_Inventory.gridsStartY + Math.floor(i/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)
			&& TouchInput.y < this.inventoryWindowGrid.y + SSMBS_Window_Inventory.gridsStartY + Math.floor(i/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace) + SSMBS_Window_Inventory.gridsSize){
			//显示物品信息
			if(!this.isDrawing){
				this.itemInform = this.gridsHasItem[i+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine];
			}
			//拖动物品
			if( TouchInput.isPressed() && !this.nowPickedItem && !this.isDrawing){
				this.isDrawing = true;
				this.nowPickedItem = this.gridsHasItem[i+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine];
				this.touchIcon.item = this.nowPickedItem;
				this.isHandledItem = this.touchIcon;
				this.item = this.touchIcon.item;
				this.itemType = 'item';
				this.isDrawingItem = true;
			}
			
			//使用物品
			if( TouchInput.isCancelled() && !this.nowPickedItem && !this.isDrawing ){
				let item = this.gridsHasItem[i+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine];
				if( item!='empty' && (!item.itypeId||item.cd==0) ){
					sxlSimpleABS.useItem(item,$gamePlayer)
				}
				
			}
		}
		if(this.isDrawingItem && this.touchIcon.item && TouchInput.isReleased()){
			SoundManager.playEquip();
			this.isDrawingItem = false;
		}
		
	}
	//放置物品
	for( j = 0 ;j < this.gridsHasItem.length ; j ++ ){
		if( TouchInput.isReleased() && this.nowPickedItem && 
			TouchInput.x > this.inventoryWindowGrid.x + SSMBS_Window_Inventory.gridsStartX + (j%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)
			&& TouchInput.x < this.inventoryWindowGrid.x + SSMBS_Window_Inventory.gridsStartX + (j%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)+SSMBS_Window_Inventory.gridsSize
			&& TouchInput.y > this.inventoryWindowGrid.y + SSMBS_Window_Inventory.gridsStartY + Math.floor(j/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace)
			&& TouchInput.y < this.inventoryWindowGrid.y + SSMBS_Window_Inventory.gridsStartY + Math.floor(j/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace) + SSMBS_Window_Inventory.gridsSize ){
			if(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine] ){
				if( this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine]!='emtpy'){
					//替换
					this.gridsHasItem[SSMBS_Window_Inventory.loadPosition(this.nowPickedItem)] = this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine];
					// this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine].positionInInventory = SSMBS_Window_Inventory.nowPickedItem.positionInInventory+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine;
					SSMBS_Window_Inventory.saveItemPositon(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine],SSMBS_Window_Inventory.loadPosition(this.nowPickedItem));
				}
				this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine]=this.nowPickedItem;
				// this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine].positionInInventory = j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine;
				SSMBS_Window_Inventory.saveItemPositon(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine],j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine);
				//装备拖动则卸下装备
				if( this.itemType = 'equiped'){
					let type = this.nowPickedItem.wtypeId?'weapon':'armor';
					if (type == 'weapon'){
						$gameParty.members()[0].changeEquip( 0 , $dataWeapons[1] ) ;
					}
					if (type == 'armor'){
						$gameParty.members()[0].changeEquip( this.nowPickedItem.etypeId - 1 , $dataArmors[this.nowPickedItem.etypeId-1]) ;
					}
				}
				this.nowPickedItem = null;
			}
			
		}
		//绘制物品数量
		if( this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine] && this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine]!='empty'){
			if( Math.floor(SSMBS_Window_Inventory.loadPosition(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine])/SSMBS_Window_Inventory.gridsPerLine-SSMBS_Window_Inventory.listFirstLine)>=0 
			&& SSMBS_Window_Inventory.loadPosition(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine])<SSMBS_Window_Inventory.gridsPerLine *SSMBS_Window_Inventory.gridsLines + SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine){
			let item = this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine];
			
			if( $gameParty.numItems(item)>0 ){
				this.inventoryWindowItemIcons.bitmap.textColor = ColorManager.textColor(0);
				this.inventoryWindowItemIcons.bitmap.fontSize = SSMBS_Window_Inventory.gridsItemNumFontSize;
				this.inventoryWindowItemIcons.bitmap.drawText(
				'x'+$gameParty.numItems(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine]),
				SSMBS_Window_Inventory.gridsStartX + (j%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
				SSMBS_Window_Inventory.gridsStartY + (SSMBS_Window_Inventory.gridsSize-SSMBS_Window_Inventory.gridsItemNumFontSize) + Math.floor(j/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
				SSMBS_Window_Inventory.gridsSize,
				SSMBS_Window_Inventory.gridsItemNumFontSize,
				'right'
				)
			}else if($gameParty.numItems(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine])==0 
				&& $gameParty.hasItem(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine],true)){
				this.inventoryWindowItemIcons.bitmap.textColor = ColorManager.textColor(4);
				let item = this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine];
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
			
				this.inventoryWindowItemIcons.bitmap.blt(
					ImageManager.loadSystem('IconSet'),
					Number(bkgIcon)% 16*32,Math.floor(Number(bkgIcon) / 16)*32, //切割坐标
					32,32,
					SSMBS_Window_Inventory.gridsStartX + (SSMBS_Window_Inventory.loadPosition(item)%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace), 
					SSMBS_Window_Inventory.gridsStartY + Math.floor(SSMBS_Window_Inventory.loadPosition(item)/SSMBS_Window_Inventory.gridsPerLine-SSMBS_Window_Inventory.listFirstLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),// 绘制坐标
					SSMBS_Window_Inventory.gridsSize,	SSMBS_Window_Inventory.gridsSize //最终大小
				)
				//绘制图标
				if(Math.floor(SSMBS_Window_Inventory.loadPosition(item)/SSMBS_Window_Inventory.gridsPerLine-SSMBS_Window_Inventory.listFirstLine)>=0 
					&& SSMBS_Window_Inventory.loadPosition(item)<SSMBS_Window_Inventory.gridsPerLine *SSMBS_Window_Inventory.gridsLines + SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine ){
					this.inventoryWindowItemIcons.bitmap.blt(
					ImageManager.loadSystem('IconSet'),
					item.iconIndex % 16*32,Math.floor(item.iconIndex / 16)*32, //切割坐标
					32,	32,//切割尺寸
					SSMBS_Window_Inventory.gridsStartX + (SSMBS_Window_Inventory.loadPosition(item)%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace), 
					SSMBS_Window_Inventory.gridsStartY + Math.floor(SSMBS_Window_Inventory.loadPosition(item)/SSMBS_Window_Inventory.gridsPerLine-SSMBS_Window_Inventory.listFirstLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),// 绘制坐标
					SSMBS_Window_Inventory.gridsSize,	SSMBS_Window_Inventory.gridsSize //最终大小
					)
				}
				this.inventoryWindowItemIcons.bitmap.drawText(
					'E',
					SSMBS_Window_Inventory.gridsStartX + (j%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
					SSMBS_Window_Inventory.gridsStartY + (SSMBS_Window_Inventory.gridsSize-SSMBS_Window_Inventory.gridsItemNumFontSize) + Math.floor(j/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
					SSMBS_Window_Inventory.gridsSize,
					SSMBS_Window_Inventory.gridsItemNumFontSize,
					'right'
					)
				}
				//绘制冷却
				if( this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine].cd>0 ){
					this.inventoryWindowItemIcons.bitmap.drawText(
					ssmbsBasic.convertNumber(this.gridsHasItem[j+SSMBS_Window_Inventory.listFirstLine*SSMBS_Window_Inventory.gridsPerLine].cd,'second'),
					SSMBS_Window_Inventory.gridsStartX + (j%SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
					SSMBS_Window_Inventory.gridsStartY + (SSMBS_Window_Inventory.gridsSize-SSMBS_Window_Inventory.gridsItemNumFontSize)/2 + Math.floor(j/SSMBS_Window_Inventory.gridsPerLine)*(SSMBS_Window_Inventory.gridsSize+SSMBS_Window_Inventory.gridsSpace),
					SSMBS_Window_Inventory.gridsSize,
					SSMBS_Window_Inventory.gridsItemNumFontSize,
					'center'
					)
				}
			}
		}
	}
	if(TouchInput.isHovered()){
		// if(SSMBS_Window_Inventory.nowPickedItem){
		// 	SSMBS_Window_Inventory.nowPickedItemStore = SSMBS_Window_Inventory.nowPickedItem;
		// }
		this.isDrawing = false;
		this.isHandledItem = null;
		this.touchIcon.item = null;
		this.item = null;
		this.isDrawingItem = false;
		this.nowPickedItem = null;
	}
	//滚轮滚动进度条
	if( TouchInput.x>this.inventoryWindowGrid.x && TouchInput.x<this.inventoryWindowGrid.x+SSMBS_Window_Inventory.width
		&& TouchInput.y>this.inventoryWindowGrid.y && TouchInput.y<this.inventoryWindowGrid.y+SSMBS_Window_Inventory.height){
		$gameParty.members()[0]._tp = 0;
		if(TouchInput.wheelY < 0 && SSMBS_Window_Inventory.listFirstLine>0){
			SSMBS_Window_Inventory.listFirstLine -= 1;
		}
		if(TouchInput.wheelY > 0 && SSMBS_Window_Inventory.listFirstLine<$gameParty.inventorySize-SSMBS_Window_Inventory.gridsLines ){
			SSMBS_Window_Inventory.listFirstLine ++;
		}
	}
	//显示金币
	this.inventoryWindow.bitmap.drawText( ssmbsBasic.convertNumber($gameParty.gold(),'thousand'), SSMBS_Window_Inventory.width-64-32-12, SSMBS_Window_Inventory.height-32-SSMBS_Window_Inventory.defaultFontSize/2,64,SSMBS_Window_Inventory.defaultFontSize,'right' )
	this.inventoryWindow.bitmap.blt(
		ImageManager.loadSystem('IconSet'),
		SSMBS_Window_Inventory.goldIcon % 16*32,Math.floor(SSMBS_Window_Inventory.goldIcon / 16)*32, //切割坐标
		32,	32,//切割尺寸
		SSMBS_Window_Inventory.width - SSMBS_Window_Inventory.gridsStartX - 32, 
		SSMBS_Window_Inventory.height - 32 - SSMBS_Window_Inventory.defaultFontSize/2-SSMBS_Window_Inventory.gridsStartX,// 绘制坐标
		32,	32 //最终大小
	)
	this.inventoryWindow.bitmap.drawText( (SSMBS_Window_Inventory.listFirstLine+1)+'/'+Math.max(($gameParty.inventorySize-SSMBS_Window_Inventory.gridsLines+1),1), SSMBS_Window_Inventory.gridsStartX, SSMBS_Window_Inventory.height-32-SSMBS_Window_Inventory.defaultFontSize/2,64,SSMBS_Window_Inventory.defaultFontSize,'left' );

	
	if( TouchInput.x > this.inventoryWindowGrid.x + SSMBS_Window_Inventory.width-32
		&& TouchInput.x < this.inventoryWindowGrid.x + SSMBS_Window_Inventory.width-32+SSMBS_Window_Inventory.defaultFontSize
		&& TouchInput.y > this.inventoryWindowGrid.y + SSMBS_Window_Inventory.drawWindowY/2-SSMBS_Window_Inventory.defaultFontSize/2
		&& TouchInput.y < this.inventoryWindowGrid.y + SSMBS_Window_Inventory.drawWindowY/2-SSMBS_Window_Inventory.defaultFontSize/2+SSMBS_Window_Inventory.defaultFontSize){
		this.inventoryWindow.bitmap.textColor = ColorManager.textColor(8);
		if(TouchInput.isClicked()){
			SSMBS_Window_Inventory.isOpen = false;
		}
	}else{
		this.inventoryWindow.bitmap.textColor = ColorManager.textColor(0);
	}
	this.inventoryWindow.bitmap.drawText( 'x', SSMBS_Window_Inventory.width-32,SSMBS_Window_Inventory.drawWindowY/2-SSMBS_Window_Inventory.defaultFontSize/2 ,SSMBS_Window_Inventory.defaultFontSize,SSMBS_Window_Inventory.defaultFontSize,'right' )
	this.inventoryWindow.bitmap.textColor = SSMBS_Window_Inventory.defaultFontColor;
};