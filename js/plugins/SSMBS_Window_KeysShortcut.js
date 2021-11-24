
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - window - KeysShortcut
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 快捷栏
 * @author 神仙狼
 * 
 * 
 */


var SSMBS_Window_KeysShortcut = SSMBS_Window_KeysShortcut||{};
SSMBS_Window_KeysShortcut.keysAmount = 8;
SSMBS_Window_KeysShortcut.keySpace = 2;
SSMBS_Window_KeysShortcut.gridSize = 32;
SSMBS_Window_KeysShortcut.gridOpacity = 128;
SSMBS_Window_KeysShortcut.ovarlayerOpacity = 192;

SSMBS_Window_KeysShortcut.width = SSMBS_Window_KeysShortcut.keysAmount * (SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace);
SSMBS_Window_KeysShortcut.height = SSMBS_Window_KeysShortcut.gridSize;

SSMBS_Window_KeysShortcut.defaultFontSize = 12;

SSMBS_Window_KeysShortcut.positions = [];


const _SSMBS_Window_KeysShortcut_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_SSMBS_Window_KeysShortcut_mapLoad.call(this);
	this.createKeysGirds();
	
}
const _SSMBS_Window_KeysShortcut_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_SSMBS_Window_KeysShortcut_mapUpdate.call(this);
	if(!$gameParty.triggerKeys){
		$gameParty.triggerKeys = ['1','2','3','4','5','6','7','8','9',];
	}
	if(!$gameParty.triggerKeysCooldown){
		$gameParty.triggerKeysCooldown = [];
		for( let i = 0 ; i < SSMBS_Window_KeysShortcut.keysAmount ; i ++ ){
			$gameParty.triggerKeysCooldown.push(0);
		}
	}
	for( let i = 0 ; i < $gameParty.triggerKeysCooldown.length ; i ++ ){
		if($gameParty.triggerKeysCooldown[i]>0){
			$gameParty.triggerKeysCooldown[i]--;
		}
	}

	if(!$gameParty.shortcutGirdItems){
		$gameParty.shortcutGirdItems = [];
		for( let i = 0 ; i < SSMBS_Window_KeysShortcut.keysAmount ; i ++ ){
			$gameParty.shortcutGirdItems.push(null);
		}
	};
	//转换为档案数据
	for( let i = 0 ; i < $gameParty.shortcutGirdItems.length ; i ++ ){
		if($gameParty.shortcutGirdItems[i]){
			if($gameParty.shortcutGirdItems[i].itypeId){
				$gameParty.shortcutGirdItems[i] = $dataItems[$gameParty.shortcutGirdItems[i].id];
			}
			if($gameParty.shortcutGirdItems[i].atypeId ){
				$gameParty.shortcutGirdItems[i] = $dataArmors[$gameParty.shortcutGirdItems[i].id];
			}
			if($gameParty.shortcutGirdItems[i].wtypeId){
				$gameParty.shortcutGirdItems[i] = $dataWeapons[$gameParty.shortcutGirdItems[i].id];
			}
			if($gameParty.shortcutGirdItems[i].stypeId){
				$gameParty.shortcutGirdItems[i] = $dataSkills[$gameParty.shortcutGirdItems[i].id];
			}
		}
	}
	this.refreshKeysGirds();
	
}

Scene_Map.prototype.createKeysGirds = function(){
	this.keysGeneral = new Sprite( new Bitmap( SSMBS_Window_KeysShortcut.width , SSMBS_Window_KeysShortcut.height ) );
	this.keysGeneral.opacity = SSMBS_Window_KeysShortcut.gridOpacity;
	for( let i = 0 ; i < SSMBS_Window_KeysShortcut.keysAmount ; i ++ ){	
		SSMBS_Window_KeysShortcut.positions.push( {x:i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace),y:0} );
	};
	this.addChild(this.keysGeneral);
	this.keysIcons = new Sprite( new Bitmap( SSMBS_Window_KeysShortcut.width , SSMBS_Window_KeysShortcut.height ) );
	this.addChild(this.keysIcons);
	this.keysIconsTexts = new Sprite( new Bitmap( SSMBS_Window_KeysShortcut.width , SSMBS_Window_KeysShortcut.height ) );
	this.addChild(this.keysIconsTexts);
	this.keysIconsOvarlayer = new Sprite( new Bitmap( SSMBS_Window_KeysShortcut.width , SSMBS_Window_KeysShortcut.height ) );
	this.keysIconsOvarlayer.opacity = SSMBS_Window_KeysShortcut.ovarlayerOpacity;
	this.addChild(this.keysIconsOvarlayer);
	
};

Scene_Map.prototype.refreshKeysGirds = function(){
	this.keysGeneral.x = Graphics.width/2 - SSMBS_Window_KeysShortcut.width/2;
	this.keysGeneral.y = Graphics.height-48;
	this.keysIcons.x = this.keysGeneral.x;
	this.keysIcons.y = this.keysGeneral.y;
	this.keysIconsOvarlayer.x =this.keysGeneral.x;
	this.keysIconsOvarlayer.y =this.keysGeneral.y;
	this.keysIconsTexts.x = this.keysGeneral.x;
	this.keysIconsTexts.y = this.keysGeneral.y;
	this.keysGeneral.bitmap.clear();
	this.keysIcons.bitmap.clear();
	this.keysIconsOvarlayer.bitmap.clear();
	this.keysIconsTexts.bitmap.clear();
	//绘制图标
	for( let i = 0 ; i < SSMBS_Window_KeysShortcut.keysAmount ; i ++ ){
		//键位
		this.keysIconsTexts.bitmap.fontSize = SSMBS_Window_KeysShortcut.defaultFontSize;
		this.keysIconsTexts.bitmap.drawText( $gameParty.triggerKeys[i],i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), 0, SSMBS_Window_KeysShortcut.defaultFontSize, SSMBS_Window_KeysShortcut.defaultFontSize,'left' );
		//绘制格子背景
		this.keysGeneral.bitmap.fillRect( i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), 0, SSMBS_Window_KeysShortcut.gridSize, SSMBS_Window_KeysShortcut.gridSize, '#000000' );
		if( $gameParty.shortcutGirdItems[i]){
			// 图标背景
			let item = $gameParty.shortcutGirdItems[i];
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
			this.keysIcons.bitmap.blt(
			ImageManager.loadSystem('IconSet'),
			Number(bkgIcon)% 16*32,
			Math.floor(Number(bkgIcon) / 16)*32, //切割坐标
			SSMBS_Window_KeysShortcut.gridSize,	SSMBS_Window_KeysShortcut.gridSize,//切割尺寸
			SSMBS_Window_KeysShortcut.positions[i].x, 
			SSMBS_Window_KeysShortcut.positions[i].y,// 绘制坐标
			SSMBS_Window_KeysShortcut.gridSize, SSMBS_Window_KeysShortcut.gridSize //最终大小
			)
			//图标
			this.keysIcons.bitmap.blt(
				ImageManager.loadSystem('IconSet'),
				$gameParty.shortcutGirdItems[i].iconIndex % 16*32,Math.floor($gameParty.shortcutGirdItems[i].iconIndex / 16)*32, //切割坐标
				SSMBS_Window_KeysShortcut.gridSize,	SSMBS_Window_KeysShortcut.gridSize,//切割尺寸
				SSMBS_Window_KeysShortcut.positions[i].x, 
				SSMBS_Window_KeysShortcut.positions[i].y,// 绘制坐标
				SSMBS_Window_KeysShortcut.gridSize,
				SSMBS_Window_KeysShortcut.gridSize //最终大小
			)
			//右键图标
			if(i == $gamePlayer.rightClickShortCut){
				this.keysIcons.bitmap.blt(
					ImageManager.loadSystem('mouseRight'),
					0,0, //切割坐标
					SSMBS_Window_KeysShortcut.gridSize,	SSMBS_Window_KeysShortcut.gridSize,//切割尺寸
					SSMBS_Window_KeysShortcut.positions[i].x, 
					SSMBS_Window_KeysShortcut.positions[i].y,// 绘制坐标
					SSMBS_Window_KeysShortcut.gridSize,
					SSMBS_Window_KeysShortcut.gridSize //最终大小
				)
			}
			
			//耐久
			if( sxlSimpleItemList.durabilityAllowed && item.etypeId && !item.meta.unbreakable ){
				let type = item.wtypeId?$gameParty.durabilityWeapons:$gameParty.durabilityArmors;
				let maxDura = item.meta.durability?Number(item.meta.durability):100;
				this.keysIconsTexts.bitmap.textColor = ColorManager.textColor(24);
				if(Math.round((type[item.id-1]/maxDura)*100)<20){
					this.keysIconsTexts.bitmap.textColor = ColorManager.textColor(25);
				}
				this.keysIconsTexts.bitmap.fontSize = SSMBS_Window_KeysShortcut.defaultFontSize;
				this.keysIconsTexts.bitmap.drawText(
				Math.round((type[item.id-1]/maxDura)*100)+'%',
				i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), 
				(SSMBS_Window_KeysShortcut.gridSize - SSMBS_Window_KeysShortcut.defaultFontSize),
				32,
				SSMBS_Window_KeysShortcut.defaultFontSize,
				'center'
				)
				this.keysIconsTexts.bitmap.textColor = ColorManager.textColor(0);
			}
			//蓝耗
			if(item.mpCost>0){
				let mpCost =  $gameParty.shortcutGirdItems[i].mpCost*$gamePlayer.battler().mcr;
				if($gameParty.shortcutGirdItems[i].meta.slvEffectMpCost){
					mpCost-=Number($gameParty.shortcutGirdItems[i].meta.slvEffectMpCost);
				}
				mpCost=mpCost.clamp(0,Infinity);
				this.keysIconsTexts.bitmap.textColor = ColorManager.textColor(4);
				this.keysIconsTexts.bitmap.drawText(
				mpCost,
				i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), 
				(SSMBS_Window_KeysShortcut.gridSize - SSMBS_Window_KeysShortcut.defaultFontSize),
				32,
				SSMBS_Window_KeysShortcut.defaultFontSize,
				'center'
				)
				this.keysIconsTexts.bitmap.textColor = ColorManager.textColor(0);
				if( $gamePlayer.battler().mp<mpCost && $gameParty.triggerKeysCooldown[i]<=0 ){
					this.keysIconsOvarlayer.bitmap.fillRect( i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), SSMBS_Window_KeysShortcut.gridSize, SSMBS_Window_KeysShortcut.gridSize, -SSMBS_Window_KeysShortcut.gridSize, ColorManager.textColor(7));
				}
			}
			//数量
			if(item.itypeId>0){
				let amount =  $gameParty.numItems(item);
				this.keysIconsTexts.bitmap.textColor = ColorManager.textColor(0);
				this.keysIconsTexts.bitmap.drawText(
				'x'+amount,
				i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), 
				(SSMBS_Window_KeysShortcut.gridSize - SSMBS_Window_KeysShortcut.defaultFontSize),
				32,
				SSMBS_Window_KeysShortcut.defaultFontSize,
				'right'
				)
				this.keysIconsTexts.bitmap.textColor = ColorManager.textColor(0);
			}
			//冷却
			if($gameParty.triggerKeysCooldown[i]>0){
				let maxCD = $gameParty.shortcutGirdItems[i].meta.cooldown?Number($gameParty.shortcutGirdItems[i].meta.cooldown):30;
				let rateCD = $gameParty.triggerKeysCooldown[i]/maxCD
				this.keysIconsOvarlayer.bitmap.fillRect( i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), SSMBS_Window_KeysShortcut.gridSize, SSMBS_Window_KeysShortcut.gridSize, -SSMBS_Window_KeysShortcut.gridSize*rateCD, '#000000' );
				this.keysIconsOvarlayer.bitmap.textColor = ColorManager.textColor(17);
				this.keysIconsOvarlayer.bitmap.fontSize += 4;
				this.keysIconsOvarlayer.bitmap.fontBold = true;
				this.keysIconsOvarlayer.bitmap.drawText(
				ssmbsBasic.convertNumber($gameParty.triggerKeysCooldown[i],'second'),
				i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), 
				0,
				SSMBS_Window_KeysShortcut.gridSize,
				SSMBS_Window_KeysShortcut.gridSize,
				'center'
				)
				this.keysIconsOvarlayer.bitmap.fontSize -= 4;
				this.keysIconsOvarlayer.bitmap.fontBold = false;
				this.keysIconsOvarlayer.bitmap.textColor = ColorManager.textColor(0);
			}
		}
	}
	//绑定格子
	for( let i = 0 ; i < SSMBS_Window_KeysShortcut.keysAmount ; i ++ ){
		let stX = this.keysGeneral.x + SSMBS_Window_KeysShortcut.positions[i].x;
		let stY = this.keysGeneral.y + SSMBS_Window_KeysShortcut.positions[i].y;
		let edX = stX + SSMBS_Window_KeysShortcut.gridSize;
		let edY = stY + SSMBS_Window_KeysShortcut.gridSize;
		//使用快捷栏
		if(Input.isTriggered($gameParty.triggerKeys[i]) && $gameParty.shortcutGirdItems[i]&&$gameParty.triggerKeysCooldown[i]<=0){
			$gameParty.lastUsedKeyShortcut = i;
			if( $gameParty.shortcutGirdItems[i].stypeId ){
				let mpCost =  $gameParty.shortcutGirdItems[i].mpCost*$gamePlayer.battler().mcr;
				if($gameParty.shortcutGirdItems[i].meta.slvEffectMpCost){
					mpCost-=Number($gameParty.shortcutGirdItems[i].meta.slvEffectMpCost);
				}
				mpCost=mpCost.clamp(0,Infinity);
				if($gamePlayer.battler()._mp>=mpCost){
					sxlSimpleABS.useSkill($gameParty.shortcutGirdItems[i],$gamePlayer);
				};
			}
			if( $gameParty.shortcutGirdItems[i].itypeId || $gameParty.shortcutGirdItems[i].etypeId ){
				let store;
				if( $gameParty.shortcutGirdItems[i].etypeId && $gamePlayer.battler().canEquip($gameParty.shortcutGirdItems[i]) ){
					store = $gamePlayer.battler().equips()[$gameParty.shortcutGirdItems[i].etypeId - 1] ;
				}
				sxlSimpleABS.useItem($gameParty.shortcutGirdItems[i],$gamePlayer);
				if(store){
					if(store.meta.hide){
						$gameParty.shortcutGirdItems[i] = null;
					}else{
						$gameParty.shortcutGirdItems[i] = store;
					}
					
					store = null;
				}
				
			}
		}
		//触摸格子
		if(ssmbsBasic.isTouching(stX,stY,edX,edY)){
			//高亮触摸格子
			this.keysGeneral.bitmap.fillRect( i*(SSMBS_Window_KeysShortcut.gridSize + SSMBS_Window_KeysShortcut.keySpace), 0, SSMBS_Window_KeysShortcut.gridSize, SSMBS_Window_KeysShortcut.gridSize, '#aaaaaa' );
			//正在触碰格子
			this.isTouchingKeysShortcut = true;
			if(!this.isDrawing){
				this.itemInform = $gameParty.shortcutGirdItems[i];
			}
			if(TouchInput.isPressed()  && !this.nowPickedItem && !this.isDrawing ){
				this.isDrawing = true;
				this.nowPickedItem =  $gameParty.shortcutGirdItems[i];
				this.touchIcon.item = this.nowPickedItem;
				this.isHandledItem = this.touchIcon;
				this.item = this.nowPickedItem;
				this.itemType = 'shortCut';
			}
			if(TouchInput.isCancelled()  && !this.nowPickedItem && !this.isDrawing ){
				$gamePlayer.rightClickShortCut = i;
			}
			if( this.touchIcon.item && TouchInput.isReleased() ){
				SoundManager.playEquip();
				//替换
				for( let j = 0 ; j < SSMBS_Window_KeysShortcut.keysAmount ; j ++ ){
					SSMBS_Window_KeysShortcut.changeAllowed = true;
					if($gameParty.shortcutGirdItems[j]==this.touchIcon.item){
						if( $gameParty.triggerKeysCooldown[j] <=0 && 
							$gameParty.triggerKeysCooldown[i]<=0){
							$gameParty.shortcutGirdItems[j] = null;
							SSMBS_Window_KeysShortcut.changeAllowed = true;
							break;
						}else{
							SSMBS_Window_KeysShortcut.changeAllowed = false;
						}
						
					};
				};
				if(SSMBS_Window_KeysShortcut.changeAllowed&&$gameParty.triggerKeysCooldown[i]<=0){
					$gameParty.shortcutGirdItems[i] = this.touchIcon.item;
				}
				
			}

		}
	}
	
	//清空单个快捷键
	if( this.isDrawing&&this.nowPickedItem&&this.itemType == 'shortCut'&&
		!ssmbsBasic.isTouching( this.keysGeneral.x-24,
								this.keysGeneral.y-24,
								this.keysGeneral.x+SSMBS_Window_KeysShortcut.width+24,
								this.keysGeneral.y+SSMBS_Window_KeysShortcut.height+24))
	{
		for( let j = 0 ; j < SSMBS_Window_KeysShortcut.keysAmount ; j ++ ){
			this.isDrawing = false;
			if($gameParty.shortcutGirdItems[j]==this.nowPickedItem){
				$gameParty.shortcutGirdItems[j] = null;
				if(TouchInput.isReleased()){
					SoundManager.playMiss();
				}
			};
		};
	};
};