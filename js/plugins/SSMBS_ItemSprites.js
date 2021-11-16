
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - ItemSprites
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简易的精灵物品栏插件
 * @author 神仙狼
 *
 * @help SSMBS_ItemSprites.js
 *
 * 素材长宽比请尽量与范例工程中一致！
 * 武器数据库一号必须是空物品
 * 护甲前必须留出与护甲类型数量相等的空装备。
 * 所有空装备所使用的装备类型必须是所有角色可用。
 *
 * @param 物品栏快捷键
 * @type String
 * @desc 物品栏快捷键
 * @default i
 *
 * @param 默认增益描述字色
 * @type Number
 * @desc 默认增益描述字色(系统字色)
 * @default 24
 * 
 * @param 默认减益描述字色
 * @type Number
 * @desc 默认减益描述字色(系统字色)
 * @default 25
 *
 * @param 物品品质背景渐变方向
 * @type Number
 * @desc 物品品质背景渐变方向，0从下至上，1从上至下
 * @default 0
 *
 * @param 物品数量偏移Y
 * @type Number
 * @desc 物品数量偏移Y
 * @default 10
 *
 * @param 物品背景闪烁开关
 * @type Number
 * @desc 物品背景闪烁开关，0为关，1为开
 * @default 1
 * 
 * @param 物品背景闪烁速度
 * @type Number
 * @desc 物品背景闪烁速度，透明度变化/帧（1秒=60帧）
 * @default 0.25
 *
 * @param 物品背景闪烁速度
 * @type Number
 * @desc 物品背景闪烁速度，透明度变化/帧（1秒=60帧）
 * @default 0.25
 *
 * @param 物品稀有度图标透明度
 * @type Number
 * @desc 物品稀有度图标透明度
 * @default 128
 *
 * @param 开启武器装备耐久度
 * @type Number
 * @desc 开启武器装备耐久度，0为关，1为开
 * @default 1
 *
 * @param 无法破坏耐久度词语
 * @type String
 * @desc 无法破坏耐久度词语
 * @default 无法破坏
 *
 * @param 耐久消耗系数
 * @type Number
 * @desc 每次触发耐久减少的概率，默认是攻击时（被攻击时）有1/10概率降低1点耐久
 * @default 100
 *
 * @param 自由挪动物品
 * @type Number
 * @desc 自由挪动物品（未完成）（1为打开，0为关闭）
 * @default 0
 * 
 */

var sxlSimpleItemList = sxlSimpleItemList || {};
sxlSimpleItemList.parameters = PluginManager.parameters('SSMBS_ItemSprites')
sxlSimpleItemList.actor = 0;
sxlSimpleItemList.actorArray = [];
sxlSimpleItemList.page = 0;
sxlSimpleItemList.backgroundStoreX = 48;
sxlSimpleItemList.backgroundStoreY = 64;

sxlSimpleItemList.canMove = true;
sxlSimpleItemList.triggerButton = String(sxlSimpleItemList.parameters['物品栏快捷键'] || 'i');
sxlSimpleItemList.defaultBuffColor = Number(sxlSimpleItemList.parameters['默认增益描述字色'] || 24);
sxlSimpleItemList.defaultDebuffColor = Number(sxlSimpleItemList.parameters['默认减益描述字色'] || 25);
sxlSimpleItemList.rareColorDirection = Number(sxlSimpleItemList.parameters['物品品质背景渐变方向'] || 0);
sxlSimpleItemList.iconNumY = Number(sxlSimpleItemList.parameters['物品数量偏移Y'] || 12);
sxlSimpleItemList.iconRareBlink = Number(sxlSimpleItemList.parameters['物品背景闪烁开关'] || 1);
sxlSimpleItemList.iconRareBlinkRate = Number(sxlSimpleItemList.parameters['物品背景闪烁速度'] || 0.25);
sxlSimpleItemList.durabilityAllowed = Number(sxlSimpleItemList.parameters['开启武器装备耐久度'] || 1);
sxlSimpleItemList.durabilityDecRate = Number(sxlSimpleItemList.parameters['耐久消耗系数'] || 10);
sxlSimpleItemList.unbreakableWord = String(sxlSimpleItemList.parameters['无法破坏耐久度词语'] || '无法破坏');
sxlSimpleItemList.rareIconOpacity = Number(sxlSimpleItemList.parameters['物品稀有度图标透明度'] || 128);
sxlSimpleItemList.freeMoveItem = Number(sxlSimpleItemList.parameters['自由挪动物品'] || 0);

sxlSimpleItemList.rareColor =  [ 0, 4, 31, 24, 27,14,10 ];
sxlSimpleItemList.rareColor2 = [ 0, 4, 31, 24, 27,14,27 ];
sxlSimpleItemList.rareColorIcon = [ 448, 449, 450, 451, 452, 453, 454 ];
sxlSimpleItemList.rareName = [ '所有品质','普通','稀有','卓越','套装','史诗','传奇','至宝',];
sxlSimpleItemList.typeName = [ '所有类型','物品' ];

sxlSimpleItemList.suits = [];

sxlSimpleItemList.maxInformatiuonWidth = 300;
sxlSimpleItemList.mouseInformationOffsetX = 32;

const _sxlAbs_mapLoadItem = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	this.hightLightSystemWordInformation = true;
	_sxlAbs_mapLoadItem.call(this);
	sxlSimpleItemList.smp = this;
	sxlSimpleItemList.positions = [0];
	this.itemArray = [];
	this.itemArrayNum = [];
	this.equipsArray = [];
	this.hasRareItems = [];
	for( i in $dataSystem.equipTypes){
		if( i != 0){
			sxlSimpleItemList.typeName.push($dataSystem.equipTypes[i])
		}
	}
	if(!$gameParty.backBag){
		$gameParty.backBag = [];
		for( i in $gameParty.allItems()){
			$gameParty.backBag.push($gameParty.allItems()[i])
		}
	}
	$gameParty.nowRare = 0;
	$gameParty.nowType = 0;
	sxlSimpleItemList.itemShow = false;
	sxlSimpleItemList.bindBackbagTrigger = false;
	this.loadSuitsInStates();
	if(sxlSimpleItemList.durabilityAllowed) this.loadEquipsDurability();
};

_sxlAbs_mapUpdateItem = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlAbs_mapUpdateItem.call(this);
	if(((this.shopPlugin && sxlSimpleShop.window.opacity >= 255) || (this.upgradeWindow && this.upgradeWindow.opacity == 255)) && sxlSimpleItemList.backgroundStoreX < 348 ){
		sxlSimpleItemList.backgroundStoreX = 372;
	}
	if(((this.shopPlugin && sxlSimpleShop.window.opacity >= 255) || (this.upgradeWindow && this.upgradeWindow.opacity == 255)) && sxlSimpleItemList.backgroundStorey < 534 ){
		sxlSimpleItemList.backgroundStoreY = 64;
	}
	this.showItem();
	this.moveIcons();
	this.bindIcons();
	this.bindBackbag();
	this.showInformation();
	this.changeActor();
	this.changePage();
	this.updateMemberState();
	this.completedSuit();
	this.limitDurability();
	this.updateIconRare ();
	if(this.screenInformation&&(sxlSimpleABS.informationWait<=0||!sxlSimpleABS.informationWait)){
		sxlSimpleABS.informationWait = 0 ;
	}else{
		sxlSimpleABS.informationWait --;
	}
	if(this.actorImage){
		this.actorImage.anchor.x = 0.5;
		this.actorImage.x = this.itemBackground.x+this.itemBackground.bitmap.width/2 ;
		this.actorImage.y = this.itemBackground.y + 34;
	}
	
	for( i in $gameParty.members()){
		if( !$dataActors[$gameParty.members()[i]._actorId].meta.summoned && 
			sxlSimpleItemList.actorArray.indexOf($gameParty.members()[i]._actorId)==-1){
			sxlSimpleItemList.actorArray.push($gameParty.members()[i]._actorId);
		}
	}
	for( i in $dataItems){
		if( i!=0){
			if(!$dataItems[i].nowCD){
				$dataItems[i].nowCD = 0;
			}else{
				if($dataItems[i].nowCD > 0){
					$dataItems[i].nowCD -- ;
				}
				if($dataItems[i].nowCD <= 0){
					$dataItems[i].nowCD = 0 ;
				}

			}
		}
	}
	for(i = 0 ; i < sxlSimpleItemList.positions.length ; i++ ){
		if( sxlSimpleItemList.positions[i]!=i){
			sxlSimpleItemList.firstEmptySlot = i;
		}
	}
	for(item of $dataItems){
		if(item && (!item.cd || item.cd<0) ){
			item.cd = 0;
		}
		if(item && item.cd>0){
			item.cd --;
		}
	}
};

Scene_Map.prototype.loadEquipsDurability = function() {
	if(!$gameParty.durabilityArmors){
		$gameParty.durabilityArmors = [];
	}
	if(!$gameParty.durabilityWeapons){
		$gameParty.durabilityWeapons = [];
	}
	for( const armor of $dataArmors){
		if(armor){
			$gameParty.durabilityArmors.push(armor.meta.durability?Number(armor.meta.durability):100);
		}
	}
	for( const weapon of $dataWeapons){
		if(weapon){
			$gameParty.durabilityWeapons.push(weapon.meta.durability?Number(weapon.meta.durability):100);
		}
	}
}

Scene_Map.prototype.limitDurability = function() {
	for(const armor of $dataArmors){
		if(armor){
			var maxDura = armor.meta.durability?Number(armor.meta.durability):100
			if($gameParty.durabilityArmors[armor.id-1]>maxDura){
				$gameParty.durabilityArmors[armor.id-1] = maxDura;
			}
		}
	}
	for(const weapon of $dataWeapons){
		if(weapon){
			var maxDura = weapon.meta.durability?Number(weapon.meta.durability):100
			if($gameParty.durabilityWeapons[weapon.id-1]>maxDura){
				$gameParty.durabilityWeapons[weapon.id-1] = maxDura;
			}
		}
	}
}

Scene_Map.prototype.loadSuitsInStates = function() {
	// for( const state of $dataStates){
	// 	if(state && state.meta.suit){
	// 		var suitParts = state.meta.suit.split(',')
	// 		var theSuit = {
	// 			id:state.id,
	// 			name:state.name,
	// 			parts:suitParts
	// 		}
	// 		sxlSimpleItemList.suits.push(theSuit);
	// 	}
	// }
	for( const state of $dataStates){
		if(state && state.meta.suit){
			// 设定套装需要的装备
			var equipParts = state.meta.suit.split(',');
			if(!state.needEquips){
				state.needEquips = [];
			}
			for(var equipPart of equipParts){
				var equipType = equipPart.split(' ');
				if(equipType[0]=='w'){
					var partItem = $dataWeapons[equipType[1]];
				}
				if(equipType[0]=='a'){
					var partItem = $dataArmors[equipType[1]]
				}
				state.needEquips.push(partItem)
			}
			// 设定角色默认装备数量
			for( member of $gameParty.members() ){
				if(!member.suitSet){
					member.suit = [];
					member.suitCount = [];
					member.suitSet = true;
				}
				member.suit.push(state.id)
				member.suitCount.push(0);
			}
		}
	}
}

Scene_Map.prototype.completedSuit = function() {
	for(const member of $gameParty.members() ){
		for(const state of $dataStates){
			if(state){
				for( i in member.suit){
					if(member.suit[i]==state.id){
						var equipedCount = member.equips().filter(function (val) { return state.needEquips.indexOf(val) > -1 })
						member.suitCount[i] = equipedCount.length;
					}
				}
				
			}
		}
		for ( i in member.suit){
			var counter = 2;
			if($dataStates[member.suit[i]].meta.suitQuantity){
				counter = Number($dataStates[member.suit[i]].meta.suitQuantity);
			}
			if(member.suitCount[i]>=counter){
				member.addState(member.suit[i]);
			}
		}
	}
}



Scene_Map.prototype.showItem = function() {
	// if( (Input.isTriggered( sxlSimpleItemList.triggerButton ) ||
	// 	sxlSimpleItemList.itemOpen == true) ||
	// 	( sxlSimpleItemList.itemShow == true &&
	// 	  TouchInput.x > this.itemBackground.x+269 &&
	// 	  TouchInput.x < this.itemBackground.x+286 &&
	// 	  TouchInput.y > this.itemBackground.y+13  &&
	// 	  TouchInput.y < this.itemBackground.y+28 )){
	// 		$gameParty.members()[0]._tp = 0;
	// 		sxlSimpleItemList.itemOpen = false;
	// 		if(   sxlSimpleItemList.itemShow == true ){
	// 			if(TouchInput.isTriggered()){
	// 				SoundManager.playCursor();
	// 				this.isHandledItem = null;
	// 				sxlSimpleItemList.itemShow = false;
	// 				sxlSimpleItemList.canMove = true;
	// 			}
	// 		}else{
	// 			SoundManager.playCursor();
	// 			this.isHandledItem = null;
	// 			sxlSimpleItemList.itemShow = true;
	// 			sxlSimpleItemList.canMove = true;
	// 			this._active = true;
				// this.createBackbag();
				// this.createEquips();
				// this.createItems();
				// for(i = 0 ; i < this.itemArray.length ; i ++){
				// 	this.itemArray[i].bitmap.retry();
				// };
				// this.createBackbag();
				// this.createEquips();
				// this.createItems();
				
			// };
		
	// };
	// if( sxlSimpleItemList.itemShow == false ){
	// 	this.resetAllSprite();
	// };
};

Scene_Map.prototype.resetAllSprite = function(){
	for(i = 0 ; i < this.itemArray.length ; i ++){
		this.itemArray[i].destroy();
		this.removeChild(this.itemArray[i]);
		this.itemArray.splice( i , 1 )
	};

	for( i = 0 ;  i < this.equipsArray.length ; i ++ ){
		this.equipsArray[i].destroy();
		this.removeChild( this.equipsArray[i] );
		this.equipsArray.splice( i , 1 )
	};
	if( this.itemBackground ){

		this.itemBackground.x = 9999;
		this.actorImage.anchor.x = 0.5;
		this.actorImage.x = this.itemBackground.x+this.itemBackground.bitmap.width/2 ;
		this.actorImage.y = this.itemBackground.y + 34;
		this.nameBackGround.x = this.itemBackground.x + 149 ;
		this.nameBackGround.y = this.itemBackground.y ;
		this.actorInformation.x = this.itemBackground.x + 149 ;
		this.actorInformation.y = this.itemBackground.y ;
		this.switchMmeberPre.x = this.itemBackground.x + 149 ;
		this.switchMmeberPre.y = this.itemBackground.y ;
		this.switchMmeberNext.x = this.itemBackground.x + 149 ;
		this.switchMmeberNext.y = this.itemBackground.y ;
		if(this.itemPage){
			this.itemPage.x = this.itemBackground.x + 149;
			this.itemPage.y = this.itemBackground.y + 435;
		}
		if(this.gold){
			this.gold.x = this.itemBackground.x + 173;
			this.gold.y = this.itemBackground.y + 437;
			this.filterRare.x = this.itemBackground.x+13;
			this.filterRare.y = this.itemBackground.y + 437;
		}
		this.removeChild( this.itemBackground  );

	};
	if( this.actorImage ){
		this.removeChild( this.actorImage  );
	};
	if( this.actorInformation ){
		this.removeChild( this.actorInformation  );
	};
	if( this.itemPage ){
		this.removeChild( this.itemPage  );
	};
	if( this.gold ){
		this.removeChild( this.gold  );
	}
	if( this.itemNum ){
		this.removeChild( this.itemNum );
	}
	if( this.iconRare ){
		this.removeChild( this.iconRare )
	}
	
};

Scene_Map.prototype.createBackbag = function(){
	// if( sxlSimpleItemList.itemShow == true ){
	// 	if( !this.itemBackground ){
	// 		this.itemBackground = new Sprite();
	// 	}else{
	// 		this.itemBackground.bitmap.clear();
	// 		this.itemBackground.bitmap.retry();
	// 	}
	// 	this.itemBackground.bitmap = ImageManager.loadSystem( 'itemBackground' );
	// 	this.itemBackground.x = sxlSimpleItemList.backgroundStoreX;
	// 	this.itemBackground.y = sxlSimpleItemList.backgroundStoreY;
	// 	this.addChild( this.itemBackground  );
	// 	if( !this.actorImage ){
	// 		this.actorImage = new Sprite();
	// 	}else{
	// 	};
	// 	var actor = $gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]);
	// 	if($gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor])){
	// 		var actorInData = $dataActors[$gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor])._actorId];
	// 	}
		
	// 	if( actorInData && actorInData.meta.portrait ){
	// 		this.actorImage.bitmap = ImageManager.loadPicture( actorInData.meta.portrait );
	// 	}else{
	// 		this.actorImage.bitmap = ImageManager.loadPicture( 'commonPortrait' );
	// 	}
	// 	this.actorImage.anchor.x = 0.5;
	// 	this.actorImage.scale.x = 170 / 350 ;
	// 	this.actorImage.scale.y = 170 / 350 ;
	// 	this.actorImage.x = this.itemBackground.x+this.itemBackground.bitmap.width/2 ;
	// 	this.actorImage.y = this.itemBackground.y + 34;
	// 	this.actorImage.opacity = 255 ;
	// 	this.addChild( this.actorImage );
	// 	if( !this.actorInformation ){
	// 		this.nameBackGround = new Sprite(new Bitmap( 298, 512 ));
	// 		this.nameBackGround.anchor.x = 0.5;
	// 		this.nameBackGround.blendMode = 2;
	// 		this.actorInformation = new Sprite(new Bitmap( 298, 512 ));
	// 		this.actorInformation.anchor.x = 0.5;
	// 		this.switchMmeberPre = new Sprite(new Bitmap( 298, 512 ));
	// 		this.switchMmeberPre.anchor.x = 0.5;
	// 		this.switchMmeberNext = new Sprite(new Bitmap( 298, 512 ));
	// 		this.switchMmeberNext.anchor.x = 0.5;
	// 	}else{
	// 		this.actorInformation.bitmap.clear();
	// 		this.switchMmeberPre.bitmap.clear();
	// 		this.switchMmeberNext.bitmap.clear();
	// 	};
	// 	var padding = 24;
	// 	var line = 0 ;
	// 	var lineHeight = 20
		
	// 	this.nameBackGround.x = this.itemBackground.x + 149 ;
	// 	this.nameBackGround.y = this.itemBackground.y ;
	// 	this.nameBackGround.opacity = 192 ;
	// 	this.actorInformation.x = this.itemBackground.x + 149 ;
	// 	this.actorInformation.y = this.itemBackground.y ;
	// 	this.switchMmeberPre.x = this.itemBackground.x + 149 ;
	// 	this.switchMmeberPre.y = this.itemBackground.y ;
	// 	this.switchMmeberNext.x = this.itemBackground.x + 149 ;
	// 	this.switchMmeberNext.y = this.itemBackground.y ;
	// 	line ++ ;
	// 	line ++ ;
	// 	line ++ ;
	// 	line ++ ;
	// 	line ++ ;
	// 	line ++ ;
	// 	this.actorInformation.bitmap.fontBold = true ;
	// 	this.actorInformation.bitmap.fontSize = $gameSystem.mainFontSize() - 8 ;
	// 	// this.nameBackGround.bitmap.gradientFillRect( 298/2-81,20 + line * lineHeight-6,81,72,'#ffffff','#000000' );
	// 	// this.nameBackGround.bitmap.gradientFillRect( 298/2,20 + line * lineHeight-6,81,72,'#000000','#ffffff' );
	// 	this.nameBackGround.bitmap.gradientFillRect( 0,32,149,173,'#ffffff','#444444' )
	// 	this.nameBackGround.bitmap.gradientFillRect( 298/2,32,149,173,'#444444','#ffffff' )
	// 	if(actor){
	// 		this.actorInformation.bitmap.drawText( actor.name() , 0, 20 + line * lineHeight, 298, lineHeight, 'center'  ) ;
	// 	}else{
	// 		this.actorInformation.bitmap.drawText( ' ' , 0, 20 + line * lineHeight, 298, lineHeight, 'center'  ) ;
	// 	}
		
	// 	// this.switchMmeberPre.bitmap.drawText( '                   <<',
	// 	// 									0, 20 + line * lineHeight, 298, lineHeight, 'left'  ) ;
	// 	// this.switchMmeberNext.bitmap.drawText( '>>                   ',
	// 	// 									0, 20 + line * lineHeight, 298, lineHeight, 'right'  ) ;
	// 	this.actorInformation.bitmap.fontSize = 12 ;
	// 	this.actorInformation.bitmap.fontBold = false ;
	// 	line ++ ;
	// 	if(actor){
	// 		this.actorInformation.bitmap.drawText( $dataClasses[actor._classId].name + ' Lv：' + actor._level,
	// 											0, padding + line * lineHeight, 298, lineHeight, 'center'  ) ;
	// 	}
		
	// 	line ++ ;
	// 	if(actor){
	// 		this.actorInformation.bitmap.drawText('  (' + actor._exp[actor._classId] + '/' + actor.expForLevel( actor._level + 1 ) + ')' ,
	// 										0, padding + line * lineHeight, 298, lineHeight, 'center'  ) ;
	// 	}
	// 	this.iconRare = new Sprite(new Bitmap( Graphics.width, Graphics.height ));
	// 	this.iconRare.opacity = sxlSimpleItemList.rareIconOpacity ;
	// 	this.iconRare.blendMode = 0;
	// 	this.addChild(this.iconRare);
	// 	this.addChild( this.nameBackGround );
	// 	this.addChild( this.actorInformation );
	// 	this.addChild(this.switchMmeberPre);
	// 	this.addChild(this.switchMmeberNext);
		
	// }else{
	// 	if( this.itemBackground ){
	// 		this.itemBackground.bitmap.clear();
	// 		this.removeChild( this.itemBackground );
	// 		this.actorImage.bitmap.clear();
	// 		this.removeChild( this.actorImage );
	// 	};
	// 	for( i = 0 ; i < this.itemArray.length ; i ++ ){
	// 		if(this.itemArray[i]){
	// 			this.removeChild(this.itemArray[i]);
	// 			this.itemArray.splice( i , 1 )
	// 		};
	// 	};
		// for( i = 0 ; i < this.itemArrayNum.length ; i ++ ){
		// 	if(this.itemArrayNum[i]){
		// 		this.removeChild(this.itemArrayNum[i]);
		// 		this.itemArrayNum.splice( i , 1 )
		// 	};
		// };
	// };
};
Scene_Map.prototype.updateMemberState = function(){
	var line = 0;
	var actor = $gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]);
	var padding = 24;
	var lineHeight = 20
	if(this.actorInformation){
		this.actorInformation.bitmap.clear();
		this.switchMmeberPre.bitmap.clear();
		this.switchMmeberNext.bitmap.clear();

		line ++ ;
		line ++ ;
		line ++ ;
		line ++ ;
		line ++ ;
		line ++ ;
		this.actorInformation.bitmap.fontBold = true ;
		this.actorInformation.bitmap.fontSize = $gameSystem.mainFontSize() - 8 ;
		this.actorInformation.bitmap.drawText( actor.name() , 0, 20 + line * lineHeight, 298, lineHeight, 'center'  ) ;
		// this.switchMmeberPre.bitmap.drawText( '                   <<',
		// 									0, 20 + line * lineHeight, 298, lineHeight, 'left'  ) ;
		// this.switchMmeberNext.bitmap.drawText( '>>                   ',
		// 									0, 20 + line * lineHeight, 298, lineHeight, 'right'  ) ;
		this.actorInformation.bitmap.fontSize = 12 ;
		this.actorInformation.bitmap.fontBold = false ;
		line ++ ;
		this.actorInformation.bitmap.drawText( $dataClasses[actor._classId].name + ' Lv：' + actor._level,
											0, padding + line * lineHeight, 298, lineHeight, 'center'  ) ;
		
		line ++ ;
		this.actorInformation.bitmap.drawText('  (' + actor._exp[actor._classId] + '/' + actor.expForLevel( actor._level + 1 ) + ')' ,
											0, padding + line * lineHeight, 298, lineHeight, 'center'  ) ;
		
	}
};

Scene_Map.prototype.createFace = function(){
	for( i = 0 ; i < $gameParty.members().length ; i ++ ){

	};
};

Scene_Map.prototype.changeActor = function(){
	// if( sxlSimpleItemList.itemShow == true){
	// 	if(
	// 	TouchInput.x > this.itemBackground.x + 70&&
	// 	TouchInput.x < this.itemBackground.x + 128&&
	// 	TouchInput.y > this.itemBackground.y + 48 &&
	// 	TouchInput.y < this.itemBackground.y + 202){
	// 		this.switchMmeberPre.opacity += 10;
	// 		if( TouchInput.isClicked()){
	// 			if( sxlSimpleItemList.actor > 0 ){
	// 				sxlSimpleItemList.actor -= 1;
	// 			}else{
	// 				sxlSimpleItemList.actor = sxlSimpleItemList.actorArray.length - 1;
	// 			};
	// 			SoundManager.playOk();
	// 			this.createBackbag();
				// this.createEquips();
				// this.createItems();
	// 		}
	// 	}else{
	// 		this.switchMmeberPre.opacity -= 10;
	// 	}
	// 	if(
	// 	TouchInput.x < this.itemBackground.x + 298 - 70&&
	// 	TouchInput.x > this.itemBackground.x + 298 - 128&&
	// 	TouchInput.y > this.itemBackground.y + 48 &&
	// 	TouchInput.y < this.itemBackground.y + 202){
	// 		this.switchMmeberNext.opacity += 10;
	// 		if( TouchInput.isClicked()){
	// 			if( sxlSimpleItemList.actor < sxlSimpleItemList.actorArray.length - 1 ){
	// 				sxlSimpleItemList.actor += 1;
	// 			}else{
	// 				sxlSimpleItemList.actor = 0;
	// 			};
	// 			SoundManager.playOk();
	// 			this.createBackbag();
				// this.createEquips();
				// this.createItems();
	// 		}
	// 	}else{
	// 		this.switchMmeberNext.opacity -= 10;
	// 	}
	// }
		
};


Scene_Map.prototype.createEquips = function() {
	// var member = $gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]);
	// var space = 8 ;
	// if( !this.iconRare ){

	// }else{
	// 	this.iconRare.bitmap.clear();
	// };
	// for( i in this.equipsArray){
	// 	this.equipsArray[i].destroy();
	// 	this.removeChild( this.equipsArray[i] );
	// 	this.equipsArray.splice( i , 1 )
	// };
	// if( member ){
	// 	for( i = 0 ; i < $dataSystem.equipTypes.length-1 ; i ++ ){
	// 		var equip =  member._equips[i];
			
	// 		this.equipsImage = new Sprite();
			
	// 		if( $gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]).equips()[i] != null ){
	// 			this.equipsImage.bitmap = ImageManager.loadSystem( 'IconSet' );
	// 			var iconSet = $gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]).equips()[i].iconIndex;
	// 			this.equipsImage.item = $gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]).equips()[i];
	// 			this.equipsImage.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
	// 			this.equipsImage.cid = i;
	// 			this.equipsImage.x = this.itemBackground.x + 32 + i%2*202;
	// 			this.equipsImage.y = this.itemBackground.y + 48 + Math.floor(i/2)*40;
	// 		}else{
	// 			var iconSet = 0;
	// 			this.equipsImage.item = null;
	// 		}
	// 		this.equipsArray.push( this.equipsImage );
	// 		this.addChild( this.equipsImage );
	// 	};
	// };

};



Scene_Map.prototype.createItems = function() {
	// var visiableItem = 0;
	// var allItemArray = $gameParty.allItems();
	// if( !this.itemPage ){
	// 	this.itemPage = new Sprite(new Bitmap( 298, 120 ));
	// 	this.itemPage.anchor.x = 0.5;
	// }else{
	// 	this.itemPage.bitmap.clear();
	// };
	// this.itemPage.x = this.itemBackground.x + 149;
	// this.itemPage.y = this.itemBackground.y + 437;
	// this.itemPage.bitmap.fontSize = $gameSystem.mainFontSize() - 12 ;
	// this.itemPage.bitmap.drawText( '· ' + Number(sxlSimpleItemList.page+1) + ' ·', 0, 0, 298, 24, 'center' );
	// this.addChild( this.itemPage );
	// if( !this.gold ){
	// 	this.gold = new Sprite(new Bitmap( 192, 120 ));
	// }else{
	// 	this.gold.bitmap.clear();
	// };
	// if( !this.filterRare ){
	// 	this.filterRare = new Sprite(new Bitmap( 192, 120 ));
	// }else{
	// 	this.filterRare.bitmap.clear();
	// };
	// this.gold.x = this.itemBackground.x + 173;
	// this.gold.y = this.itemBackground.y + 437;
	// this.filterRare.x = this.itemBackground.x+13;
	// this.filterRare.y = this.itemBackground.y + 437;
	// this.gold.bitmap.fontSize = $gameSystem.mainFontSize() - 12 ;
	// this.filterRare.bitmap.fontSize = $gameSystem.mainFontSize() - 12 ;

	// function toThousands(num) {
	// 	var result = '', counter = 0;
	// 	num = (num || 0).toString();
	// 	for (var i = num.length - 1; i >= 0; i--) {
	// 		counter++;
	// 		result = num.charAt(i) + result;
	// 		if (!(counter % 3) && i != 0) { result = ',' + result; }
	// 	}
	// 	return result;
	// }
	// this.gold.bitmap.drawText( toThousands($gameParty.gold()) + '      ' , 0, 0, 112, 24, 'right' );
	// if($gameParty.nowRare>0){
	// 	this.filterRare.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.rareColor[$gameParty.nowRare-1]);
	// 	this.filterRare.bitmap.textColor2 = ColorManager.textColor(sxlSimpleItemList.rareColor2[$gameParty.nowRare-1]);
	// }else{
	// 	this.filterRare.bitmap.textColor = ColorManager.textColor(0);
	// 	this.filterRare.bitmap.textColor2 = ColorManager.textColor(0);
	// }
	
	// this.filterRare.bitmap.drawTextGradient( sxlSimpleItemList.rareName[$gameParty.nowRare]+'/'+sxlSimpleItemList.typeName[$gameParty.nowType], 6, 0, 100, 24, 'center',
	// this.filterRare.bitmap.textColor, 
	// this.filterRare.bitmap.textColor2);
	// this.addChild( this.gold );
	// this.addChild( this.filterRare );
	// for( i in this.itemArray ){
	// 	this.removeChild(this.itemArray[i]);
		
	// };
	// this.itemArray = [];
	// sxlSimpleItemList.positions = [];
	// for( i in allItemArray ){
	// 	if(!allItemArray[i].meta.hide){

	// 		this.itemImg = new Sprite();
			
	// 		this.itemImg.item = allItemArray[i];
	// 		if(this.itemImg.item.page){
	// 			this.itemImg.page = this.itemImg.item.page-1;
	// 			this.itemImg.item.page = this.itemImg.page+1;
				
	// 		}else{
	// 			this.itemImg.page = Math.floor((visiableItem)/35);
	// 		}
	// 		if(this.itemImg.item.positionX){
	// 			this.itemImg.positionX = this.itemImg.item.positionX-1;
	// 			this.itemImg.item.positionX = this.itemImg.positionX+1;
				
	// 		}else{
	// 			this.itemImg.positionX = visiableItem % 7 ; 
	// 		}
	// 		if(this.itemImg.item.positionY){
	// 			this.itemImg.positionY = this.itemImg.item.positionY-1;
	// 			this.itemImg.item.positionY = this.itemImg.positionY+1;
				
	// 		}else{
	// 			this.itemImg.positionY = Math.floor(visiableItem/7)-this.itemImg.page*5;
	// 		}
	// 		this.itemImg.item.position = (Number(this.itemImg.positionY))*7+(Number(this.itemImg.positionX));	
			
			
	// 		this.itemImg.bitmap = ImageManager.loadSystem( 'iconSet' );
	// 		this.itemImg.x = (this.itemImg.positionX) * (32+8) + this.itemBackground.x + 13 ;
	// 		this.itemImg.y = (this.itemImg.positionY) * (32+8) + this.itemBackground.y + 238;
			
	// 		this.itemImg.anchor.x = 0;
	// 		this.itemImg.anchor.y = 0;
	// 		this.itemImg.rare = this.itemImg.item.meta.textColor?Number(this.itemImg.item.meta.textColor):0;
	// 		this.itemImg.rare2 = this.itemImg.item.meta.textColor2?Number(this.itemImg.item.meta.textColor2):this.itemImg.rare;
	// 		this.itemImg.type = this.itemImg.item.etypeId?'equips':'item';
	// 		let iconSet = allItemArray[i].iconIndex;
	// 		this.itemImg.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
	// 		if( $gameParty.nowRare == 0 && $gameParty.nowType == 0){
	// 			visiableItem ++;
	// 		}else 
	// 		if( ($gameParty.nowRare == 0 ||
	// 		    ((this.itemImg.rare == sxlSimpleItemList.rareColor[$gameParty.nowRare-1]) && (this.itemImg.rare2 == sxlSimpleItemList.rareColor2[$gameParty.nowRare-1]))) &&
	// 		    ($gameParty.nowType == 0 ||
	// 			(this.itemImg.type == 'item' && $gameParty.nowType == 1) || 
	// 			(this.itemImg.type == 'equips' && this.itemImg.item.etypeId == $gameParty.nowType - 1))
	// 			){
	// 			visiableItem ++;
	// 		}
	// 		if( (this.itemImg.page == sxlSimpleItemList.page) && !this.itemImg.item.meta.hide && 
	// 			($gameParty.nowRare == 0 ||
	// 			 ((this.itemImg.rare == sxlSimpleItemList.rareColor[$gameParty.nowRare-1]) && (this.itemImg.rare2 == sxlSimpleItemList.rareColor2[$gameParty.nowRare-1]))) &&
	// 			($gameParty.nowType == 0 ||
	// 			(this.itemImg.type == 'item' && $gameParty.nowType == 1) || 
	// 			(this.itemImg.type == 'equips' && this.itemImg.item.etypeId == $gameParty.nowType - 1))){
	// 			if(sxlSimpleItemList.positions.length<$gameParty.allItems().length){
	// 				if(!(this.itemImg.item.position in sxlSimpleItemList.positions)){
	// 					// sxlSimpleItemList.positions.push(this.itemImg.item.position);
	// 				}
	// 			}
	// 			sxlSimpleItemList.positions[this.itemImg.item.position] = this.itemImg.item;
	// 			sxlSimpleItemList.positions.sort(function(a, b){return a - b});
	// 			this.addChild(this.itemImg);
	// 			this.itemArray.push( this.itemImg );

	// 		}
	// 	}

	// };
	

	// if( !this.itemNum ){
	// 	this.itemNum = new Sprite(new Bitmap( Graphics.width, Graphics.height ));
	// }else{
	// 	this.itemNum.bitmap.clear();
	// 	this.itemNum.bitmap.fontSize = 12;
	// 	for( i in this.itemArray ){
	// 		if(!this.itemArray[i].item.meta.hide) this.itemNum.bitmap.drawText( '×'+$gameParty.numItems( this.itemArray[i].item ),this.itemArray[i].x,this.itemArray[i].y+sxlSimpleItemList.iconNumY,32,32,'right' )
	// 		// if(!this.itemArray[i].item.meta.hide && this.itemArray[i].item.nowCD && this.itemArray[i].item.nowCD > 0 ) this.itemNum.bitmap.drawText( Math.floor(this.itemArray[i].item.nowCD/60*10)/10 ,this.itemArray[i].x,this.itemArray[i].y,32,32,'center' );
	// 		this.itemNum.opacity += 10;
	// 	}
	// 	this.addChild(this.itemNum);
	// };
	// if( !this.iconRare ){

	// }else{
	// 	this.iconRare.bitmap.clear();
	// };
	
	
	
};

Scene_Map.prototype.bindBackbag = function(){
	if( TouchInput.isPressed() && this.itemBackground &&
		TouchInput.x > this.itemBackground.x &&
		TouchInput.x < this.itemBackground.x + this.itemBackground.width - 32 &&
		TouchInput.y > this.itemBackground.y &&
		TouchInput.y < this.itemBackground.y + 32 )
	{
		if(!this.bindWindow){
			this.bindWindow = 'itemWindow';
		}
		sxlSimpleItemList.bindBackbagTrigger = true;

		this.refreshItems();
	}
	if( TouchInput.isHovered() ){
		sxlSimpleItemList.bindBackbagTrigger = false;
		this.bindWindow = null;
	};
	if( sxlSimpleItemList.bindBackbagTrigger == true && this.bindWindow == 'itemWindow'){
		this.itemBackground.x = TouchInput.x - this.itemBackground.width/2;
		this.itemBackground.y = TouchInput.y - 16;
		if( this.itemBackground.x > Graphics.width - this.itemBackground.bitmap.width ){
			this.itemBackground.x = Graphics.width - this.itemBackground.bitmap.width;
		}
		if( this.itemBackground.y > Graphics.height - this.itemBackground.bitmap.height ){
			this.itemBackground.y = Graphics.height - this.itemBackground.bitmap.height;
		}
		if( this.itemBackground.x < 0 ){
			this.itemBackground.x = 0;
		}
		if( this.itemBackground.y < 0 ){
			this.itemBackground.y = 0;
		}
		sxlSimpleItemList.backgroundStoreX = this.itemBackground.x;
		sxlSimpleItemList.backgroundStoreY = this.itemBackground.y;
		this.actorImage.anchor.x = 0.5;
		this.actorImage.x = this.itemBackground.x+this.itemBackground.bitmap.width/2 ;
		this.actorImage.y = this.itemBackground.y + 34;
		this.nameBackGround.x = this.itemBackground.x + 149 ;
		this.nameBackGround.y = this.itemBackground.y ;
		this.actorInformation.x = this.itemBackground.x + 149 ;
		this.actorInformation.y = this.itemBackground.y ;
		this.switchMmeberPre.x = this.itemBackground.x + 149 ;
		this.switchMmeberPre.y = this.itemBackground.y ;
		this.switchMmeberNext.x = this.itemBackground.x + 149 ;
		this.switchMmeberNext.y = this.itemBackground.y ;
		this.itemPage.x = this.itemBackground.x + 149;
		this.itemPage.y = this.itemBackground.y + 435;
		this.refreshItems();
	};
};

Scene_Map.prototype.refreshItems = function() {
	this.itemPage.x = this.itemBackground.x + 149;
	this.itemPage.y = this.itemBackground.y + 437;
	this.gold.x = this.itemBackground.x + 173;
	this.gold.y = this.itemBackground.y + 437;
	this.filterRare.x = this.itemBackground.x+13;
	this.filterRare.y = this.itemBackground.y + 437;
	for( i in this.itemArray){
		this.itemArray[i].x = this.itemArray[i].positionX * (32+8) + this.itemBackground.x + 13 ;
		this.itemArray[i].y = this.itemArray[i].positionY * (32+8) + this.itemBackground.y + 238;

	};
	for( i in this.equipsArray ){
		this.equipsArray[i].x = this.itemBackground.x + 32 + this.equipsArray[i].cid%2*202;
		this.equipsArray[i].y = this.itemBackground.y + 48 + Math.floor(this.equipsArray[i].cid/2)*40;

	};

};


Scene_Map.prototype.moveIcons = function() {

	for( i = 0 ; i < this.itemArray.length ; i ++ ){
		if( TouchInput.isTriggered() &&
			TouchInput.x > this.itemArray[i]._bounds.minX &&
			TouchInput.x < this.itemArray[i]._bounds.maxX &&
			TouchInput.y > this.itemArray[i]._bounds.minY &&
			TouchInput.y < this.itemArray[i]._bounds.maxY ){
				this.isHandledItem = this.itemArray[i];
				this.item = this.itemArray[i].item;
				this.itemType = 'item';
		};
		if( TouchInput.x > this.itemArray[i]._bounds.minX &&
			TouchInput.x < this.itemArray[i]._bounds.maxX &&
			TouchInput.y > this.itemArray[i]._bounds.minY &&
			TouchInput.y < this.itemArray[i]._bounds.maxY ){
			if(TouchInput.isHovered()){
				this.itemInform = null;

			}else{
				this.itemType = 'item';
				this.itemInform = this.itemArray[i].item;
			}
			if ( TouchInput.isCancelled()){
				this.mapUseItemRight(this.itemArray[i].item);
			}
		}
	};
	for( i = 0 ; i < this.equipsArray.length ; i ++ ){
		if( TouchInput.isTriggered() &&
			TouchInput.x > this.equipsArray[i]._bounds.minX &&
			TouchInput.x < this.equipsArray[i]._bounds.maxX &&
			TouchInput.y > this.equipsArray[i]._bounds.minY &&
			TouchInput.y < this.equipsArray[i]._bounds.maxY ){
			if( this.equipsArray[i].item != null ){
				this.isHandledItem = this.equipsArray[i];
				this.item = this.equipsArray[i].item;
				this.itemType = 'equiped';
			};
		};
		if( TouchInput.x > this.equipsArray[i]._bounds.minX &&
			TouchInput.x < this.equipsArray[i]._bounds.maxX &&
			TouchInput.y > this.equipsArray[i]._bounds.minY &&
			TouchInput.y < this.equipsArray[i]._bounds.maxY ){
			if(TouchInput.isHovered()){
				this.itemInform = null;
			}else{
				this.itemType = 'equiped';
				this.itemInform = this.equipsArray[i].item;
			}
		};
	};
	if( this.shortcutBackArray ){
		for( i = 0 ; i < this.shortcutBackArray.length ; i ++ ){
			if( TouchInput.isTriggered() &&
				TouchInput.x >= this.shortcutBackArray[i].x && 
				TouchInput.x <= this.shortcutBackArray[i].x+36 &&
				TouchInput.y >= this.shortcutBackArray[i].y && 
				TouchInput.y <= this.shortcutBackArray[i].y+36 ){
				this.isHandledItem = this.shorcutItem[i];
				this.item = this.shorcutItem[i]?this.shorcutItem[i].item:null;
				this.itemType = 'shortCut';
				this.itemShorcutNumber = i;
			};
			if(	TouchInput.x >= this.shortcutBackArray[i].x && 
				TouchInput.x <= this.shortcutBackArray[i].x+36 &&
				TouchInput.y >= this.shortcutBackArray[i].y && 
				TouchInput.y <= this.shortcutBackArray[i].y+36 ){
				if(TouchInput.isHovered()){
					this.itemInform = null;
				}else{
					this.itemType = 'shortCut';
					this.itemInform = this.shorcutItem[i]?this.shorcutItem[i].item:null;
				}
			};
		};
	};
	if(this.skillWindow){
		for( i in this.skillWindow.skillsArray ){
			if( !this.isHandledItem &&
				TouchInput.x > this.skillWindow.skillsArray[i]._bounds.minX &&
				TouchInput.x < this.skillWindow.skillsArray[i]._bounds.maxX &&
				TouchInput.y > this.skillWindow.skillsArray[i]._bounds.minY &&
				TouchInput.y < this.skillWindow.skillsArray[i]._bounds.maxY ){
				this.isHandledItem = this.skillWindow.skillsArray[i]
				this.item = this.skillWindow.skillsArray[i].skill;
				this.isHandledItem.item = this.item;
				this.itemType = 'skill';
			}
			if( TouchInput.x > this.skillWindow.skillsArray[i]._bounds.minX &&
				TouchInput.x < this.skillWindow.skillsArray[i]._bounds.maxX &&
				TouchInput.y > this.skillWindow.skillsArray[i]._bounds.minY &&
				TouchInput.y < this.skillWindow.skillsArray[i]._bounds.maxY ){
				if(TouchInput.isHovered()){
					this.itemInform = null;
				}else{
					this.itemType = 'skill';
					this.itemInform = this.skillWindow.skillsArray[i].skill;
				}
			}

		}

	}

};



Scene_Map.prototype.bindIcons = function() {
	if(this.itemNum  && TouchInput.isPressed() ){
		this.itemNum.bitmap.clear();
		this.itemNum.bitmap.fontSize = 12;
		for( i in this.itemArray ){
			if(!this.itemArray[i].item.meta.hide) this.itemNum.bitmap.drawText( '×'+$gameParty.numItems( this.itemArray[i].item ),this.itemArray[i].x,this.itemArray[i].y+sxlSimpleItemList.iconNumY,32,32,'right' )
			if(!this.itemArray[i].item.meta.hide && this.itemArray[i].item.nowCD && this.itemArray[i].item.nowCD > 0 ) this.itemNum.bitmap.drawText( Math.floor(this.itemArray[i].item.nowCD/60*10)/10 ,this.itemArray[i].x,this.itemArray[i].y,32,32,'center' );
		}
		// this.addChild(this.itemNum);
		// this.itemNum.opacity -= 10;
	};
	if( this.information && TouchInput.isPressed()){
		this.information.opacity -= 10;
		this.informationBackground.opacity = this.information.opacity *(240/255)
		this.informationBackground.black.opacity = this.information.opacity *(50/255);
		this.informationIcon.opacity -= 10;
		this.informationIconImgBack.opacity -= 10;
		this.informationBounds.opacity-=10
	}
	for( j = 0 ; j < $gameParty.members().length ; j ++ ){
		if ( j == 0 ) {
			sxlSimpleItemList.user = $gameParty.members()[0];
			sxlSimpleItemList.userChar = $gamePlayer;
		}else{
			sxlSimpleItemList.userChar = $gamePlayer._followers._data[ j - 1 ];
			sxlSimpleItemList.user = $gameParty.members()[j];
		};
			
	}
	if( this.isHandledItem && this.itemType != 'shop' &&
		(this.itemType == 'skill'? sxlSkillWindow.member.hasSkill(this.isHandledItem.item.id):true) &&
		TouchInput.isPressed() ){
		this.isHandledItem.anchor.x = 0.5;
		this.isHandledItem.anchor.y = 0.5;
		this.isHandledItem.x = TouchInput.x;
		this.isHandledItem.y = TouchInput.y;
	}else if( this.isHandledItem && !TouchInput.isPressed() ){
		this.mapUseItem(sxlSimpleItemList.user, sxlSimpleItemList.userChar);
		if( this.shortcutBackArray ) this.refreshShortcutItem();
		// if( sxlSimpleItemList.itemShow ) this.createItems();
		// if( sxlSimpleItemList.itemShow ) this.createEquips();
		this.isHandledItem = null;
	}else if ( !this.isHandledItem && !TouchInput.isPressed()) {
		this.isHandledItem = null;
		if( this.shortcutBackArray ) this.refreshShortcutItem();
		// if( sxlSimpleItemList.itemShow ) this.createItems();
		// if( sxlSimpleItemList.itemShow ) this.createEquips();
	}else if ( TouchInput.isHovered()){
		this.isHandledItem = null;
		if( this.shortcutBackArray ) this.refreshShortcutItem();
		// if( sxlSimpleItemList.itemShow ) this.createItems();
		// if( sxlSimpleItemList.itemShow ) this.createEquips();
	}
};

Scene_Map.prototype.updateIconRare = function() {
	if( this.iconRare ){
		this.iconRare.bitmap.clear();
		for( j = 0 ; j < this.equipsArray.length ; j ++ ){
			if(!this.equipsArray[j].item.meta.hide){
				if(this.equipsArray[j].item.meta.textColor){
					var textColor = ColorManager.textColor(Number(this.equipsArray[j].item.meta.textColor))
				}else{
					var textColor = '#ffffff'
				}
				if( sxlSimpleItemList.iconRareBlink != 0 )  if(!this.equipsArray[j].item.meta.hide) this.iconRare.bitmap.gradientFillRect(  this.equipsArray[j].x-(32*this.equipsArray[j].anchor.x),this.equipsArray[j].y-(32*this.equipsArray[j].anchor.x)+16,32,16,'#000000',textColor,true );
				if(this.equipsArray[j].item.meta.bkgIcon){
					var bkgIcon = Number(this.equipsArray[j].item.meta.bkgIcon)
				}else{
					for( color in sxlSimpleItemList.rareColorIcon){
						if(Number(this.equipsArray[j].item.meta.textColor) == sxlSimpleItemList.rareColor[color]){
							var bkgIcon = sxlSimpleItemList.rareColorIcon[color];
						}
						if(!this.equipsArray[j].item.meta.textColor){
							var bkgIcon = sxlSimpleItemList.rareColorIcon[0];
						}
					}
				}
			
				this.iconRare.bitmap.blt(
					ImageManager.loadSystem('IconSet'),
					Number(bkgIcon)% 16*32,Math.floor(Number(bkgIcon) / 16)*32, //切割坐标
					32,	32,//切割尺寸
					this.equipsArray[j].x-(32*this.equipsArray[j].anchor.x), this.equipsArray[j].y-(32*this.equipsArray[j].anchor.x),// 绘制坐标
					32,	32 //最终大小
				)
			}
		}
		for( i in this.itemArray ){
			if(this.itemArray[i].item.meta.textColor){
				var textColor = ColorManager.textColor(Number(this.itemArray[i].item.meta.textColor))
			}else{
				var textColor = '#ffffff'
			}
			if( sxlSimpleItemList.iconRareBlink != 0 ) if(!this.itemArray[i].item.meta.hide) this.iconRare.bitmap.gradientFillRect(  this.itemArray[i].x-(32*this.itemArray[i].anchor.x),this.itemArray[i].y-(32*this.itemArray[i].anchor.x)+16,32,16,'#000000',textColor,true );
			if(this.itemArray[i].item.meta.bkgIcon){
				var bkgIcon = Number(this.itemArray[i].item.meta.bkgIcon)
			}else{
				for( color in sxlSimpleItemList.rareColorIcon){
					if(Number(this.itemArray[i].item.meta.textColor) == sxlSimpleItemList.rareColor[color]){
						var bkgIcon = sxlSimpleItemList.rareColorIcon[color];
					}
					if(!this.itemArray[i].item.meta.textColor){
						var bkgIcon = sxlSimpleItemList.rareColorIcon[0];
					}
				}
			}
			if(!this.itemArray[i].item.meta.hide){
				this.iconRare.bitmap.blt(
					ImageManager.loadSystem('IconSet'),
					bkgIcon % 16*32,Math.floor(bkgIcon / 16)*32, //切割坐标
					32,	32,//切割尺寸
					this.itemArray[i].x-(32*this.itemArray[i].anchor.x), this.itemArray[i].y-(32*this.itemArray[i].anchor.x),// 绘制坐标
					32,	32 //最终大小
				)
			}
			if(!this.itemArray[i].item.meta.hide && this.itemArray[i].item.nowCD && this.itemArray[i].item.nowCD > 0 )this.iconRare.bitmap.fillRect(  this.itemArray[i].x-(32*this.itemArray[i].anchor.x),this.itemArray[i].y-(32*this.itemArray[i].anchor.x),32,32*this.itemArray[i].item.nowCD/this.itemArray[i].item.meta.cooldown,'#ffffff',true );
		}
		
		// if( this.iconRare.opacity <= 30 ){
		// 	this.iconRare.opacityChange = sxlSimpleItemList.iconRareBlinkRate ;
		// }
		// if( this.iconRare.opacity >= 50 ){
		// 	this.iconRare.opacityChange = -sxlSimpleItemList.iconRareBlinkRate ;
		// }
		// this.iconRare.opacity = 128;
	};
};

Scene_Map.prototype.changePage = function() {
	

	if(	sxlSimpleItemList.itemShow == true && TouchInput.isClicked() &&
		TouchInput.x >= this.itemBackground.x + 10 && TouchInput.x <= this.itemBackground.x + 32 &&
		TouchInput.y >= this.itemBackground.y + 206 && TouchInput.y <= this.itemBackground.y + 228 ){
		if(sxlSimpleItemList.page>0){
			SoundManager.playCursor();
			sxlSimpleItemList.page -= 1;
		};
		// this.createItems();
		// this.createEquips();
		
	};
	if(	sxlSimpleItemList.itemShow == true && TouchInput.isClicked() &&
		TouchInput.x >= this.itemBackground.x + 268 && TouchInput.x <= this.itemBackground.x + 289 &&
		TouchInput.y >= this.itemBackground.y + 206 && TouchInput.y <= this.itemBackground.y + 228 ){
		sxlSimpleItemList.page += 1;
		SoundManager.playCursor();
		// this.createItems();
		// this.createEquips();
	};
	if(	sxlSimpleItemList.itemShow == true && TouchInput.isClicked () &&
		TouchInput.x >= this.itemBackground.x+133 && TouchInput.x <= this.itemBackground.x+165 &&
		TouchInput.y >= this.itemPage._bounds.minY && TouchInput.y <= this.itemPage._bounds.maxY ){
		sxlSimpleItemList.page = 0;
		SoundManager.playCursor();
		// this.createItems();
		// this.createEquips();
	};

	if(	sxlSimpleItemList.itemShow == true && this.filterRare &&
		TouchInput.x >= this.filterRare.x && TouchInput.x <= this.filterRare.x+56 &&
		TouchInput.y >= this.filterRare.y && TouchInput.y <= this.filterRare._bounds.maxY ){
		if(TouchInput.isClicked ()){
			var hasRare = 0;
			if($gameParty.nowRare<sxlSimpleItemList.rareName.length-1){
				$gameParty.nowRare += 1;
			}else{
				$gameParty.nowRare = 0;
			}
			sxlSimpleItemList.page = 0;
			SoundManager.playCursor();
			// this.createItems();
			// this.createEquips();
		}
		if(TouchInput.isCancelled ()){
			$gameParty.nowRare = 0;
			sxlSimpleItemList.page = 0;
			SoundManager.playCursor();
			// this.createItems();
			// this.createEquips();
		}
		
	};
	if(	sxlSimpleItemList.itemShow == true && this.filterRare &&
		TouchInput.x > this.filterRare.x + 56 && TouchInput.x <= this.filterRare.x + 112 &&
		TouchInput.y >= this.filterRare.y && TouchInput.y <= this.filterRare._bounds.maxY ){
		if(TouchInput.isClicked ()){
			if($gameParty.nowType<sxlSimpleItemList.typeName.length-1){
				$gameParty.nowType += 1;
			}else{
				$gameParty.nowType = 0;
			}
			sxlSimpleItemList.page = 0;
			SoundManager.playCursor();
			// this.createItems();
			// this.createEquips();
		}
		if(TouchInput.isCancelled ()){
			$gameParty.nowType = 0;
			sxlSimpleItemList.page = 0;
			SoundManager.playCursor();
			// this.createItems();
			// this.createEquips();
		}
		
	};

};

Scene_Map.prototype.mapUseItemRight = function(item){
	if( $gameParty.members()[0].canEquip( item ) ){
		$gameActors.actor($gameParty.members()[0]._actorId).changeEquip( item.etypeId - 1 , item ) ;
		if(!item.meta.hide) SoundManager.playEquip();
		this.isHandledItem = null;
		this.createBackbag();
		// this.createEquips();
		// this.createItems();
	};
}

Scene_Map.prototype.mapUseItem = function(user, userChar) {
	// if( sxlSimpleItemList.itemShow ) this.createItems();
	// if( sxlSimpleItemList.itemShow ) this.createEquips();
	for( i in this.shortcutBackArray ){
		if(this.shorcutItem[i]) this.shorcutItem[i].scId = i;
	}
	if(this.itemType == 'shortCut'){
		if(this.isHandledItem.scId&&(this.isHandledItem.item.stypeId || this.isHandledItem.item.itypeId)){
			this.isHandledItem.cdDone = this.shorcutItem[this.isHandledItem.scId].cd<=0;
		}else{
			this.isHandledItem.cdDone = true;
		}
		
	}else{
		this.isHandledItem.cdDone = true;
	}

	if( this.isHandledItem && this.itemType != 'shop'){
		for( i = 0 ; i < this.equipsArray.length ; i ++ ){
			if( TouchInput.x >= this.equipsArray[i].x && TouchInput.x <= this.equipsArray[i].x+32 &&
				TouchInput.y >= this.equipsArray[i].y && TouchInput.y <= this.equipsArray[i].y+32  ){
				if( user.canEquip( this.item ) ){
					$gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]).changeEquip( this.item.etypeId - 1 , this.item ) ;
					if(!this.isHandledItem.item.meta.hide) SoundManager.playEquip();
					this.isHandledItem = null;
					this.createBackbag();
					// this.createEquips();
					// this.createItems();
				};
			};
		};
		if(this.itemBackground &&
		TouchInput.x >= this.itemBackground.x && TouchInput.x <= this.itemBackground.x + 298  &&
		TouchInput.y >= this.itemBackground.y + 240 && TouchInput.y <= this.itemBackground.y + 458 
		){	
			if( this.itemType == 'equiped' ){
				if( this.item.etypeId && this.item.etypeId == 1 ){
					
					$gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]).changeEquip( this.item.etypeId - 1 , $dataWeapons[1] );
				}else if( this.item.etypeId && this.item.etypeId != 1 ){
					if(!$gameParty.hasItem($dataArmors[this.item.etypeId-1])){
						$gameParty.gainItemHide($dataArmors[this.item.etypeId-1],1);
					}
					$gameActors.actor(sxlSimpleItemList.actorArray[sxlSimpleItemList.actor]).changeEquip( this.item.etypeId - 1 ,$dataArmors[this.item.etypeId-1] );
				};

				if(this.isHandledItem && !this.isHandledItem.item.meta.hide) SoundManager.playEquip();
				this.isHandledItem = null;
				this.createBackbag();
				// this.createEquips();
			};
		};
		if( this.itemType != 'skill' && this.isHandledItem &&
		(!this.itemBackground || 
		!(TouchInput.x >= this.itemBackground.x && TouchInput.x <= this.itemBackground.x + 298  &&
		  TouchInput.y >= this.itemBackground.y && TouchInput.y <= this.itemBackground.y + 458 ))&&
		(!this.shortcutBackArray || 
		!(TouchInput.x >= this.shortcutBackArray[0].x && TouchInput.x <= this.shortcutBackArray[sxlSimpleShortcut.quantity-1].x+32  &&
		  TouchInput.y >= this.shortcutBackArray[0].y && TouchInput.y <= this.shortcutBackArray[0].y+32 )) &&
		( !(sxlSimpleShop.window.opacity >= 255 &&
		TouchInput.x > sxlSimpleShop.window.x && TouchInput.x < sxlSimpleShop.window.x + 298 &&
		TouchInput.y > sxlSimpleShop.window.y && TouchInput.y < sxlSimpleShop.window.y + 470)) &&
		(!this.faces ||
		!(TouchInput.x >= this.faces[this.faces.length-1]._bounds.minX && TouchInput.x <= this.faces[0]._bounds.maxX &&
		TouchInput.y >= this.faces[this.faces.length-1]._bounds.minY && TouchInput.y <= this.faces[this.faces.length-1]._bounds.maxY))&&
		(!this.upgradeWindow ||
		!(TouchInput.x >= this.upgradeWindow.x && TouchInput.x <= this.upgradeWindow.x+298 &&
		  TouchInput.y >= this.upgradeWindow.y && TouchInput.y <= this.upgradeWindow.y+470)) &&
		(!this.inventoryWindow ||
		!(TouchInput.x >= this.inventoryWindow.x && TouchInput.x <= this.inventoryWindow.x+SSMBS_Window_Inventory.width &&
		  TouchInput.y >= this.inventoryWindow.y && TouchInput.y <= this.inventoryWindow.y+SSMBS_Window_Inventory.height)&&
		  (!this.equipWindow ||
		!(TouchInput.x >= this.equipWindow.x && TouchInput.x <= this.equipWindow.x+SSMBS_Window_Equip.width &&
		  TouchInput.y >= this.equipWindow.y && TouchInput.y <= this.equipWindow.y+SSMBS_Window_Equip.height)))
		){
			
			if(this.isHandledItem.item.itypeId){
				var type = 'item';
				var dataItem = $dataItems[this.isHandledItem.item.id];
			}
			if(this.isHandledItem.item.wtypeId){
				var type = 'weapon';
				var dataItem = $dataWeapons[this.isHandledItem.item.id];
			}
			if(this.isHandledItem.item.atypeId){
				var type = 'armor';
				var dataItem = $dataArmors[this.isHandledItem.item.id];
			}
			var amount = $gameParty.numItems(dataItem);
			if($gameParty.hasItem(dataItem)){
				ssmbsLoot.loot('TouchPostion',type,dataItem.id,amount);
				$gameParty.loseItem(dataItem,amount);
			}
			$gameVariables.setValue(Number(this.isHandledItem.scId)+1,$dataItems[2]);
			// this.isHandledItem.scId.cd=0;
			this.isHandledItem = null
		};

		// if( this.itemType == 'shortCut' && ( this.isHandledItem &&this.isHandledItem.item.itypeId && 
		// 	(this.itemBackground &&
		// 	( TouchInput.x >= this.itemBackground.x && TouchInput.x <= this.itemBackground.x + 298  &&
		// 	  TouchInput.y >= this.itemBackground.y && TouchInput.y <= this.itemBackground.y + 458 )) )||
		// 	(this.isHandledItem.item.stypeId && this.isHandledItem &&
		// 	(this.skillWindow &&
		// 	( TouchInput.x >= this.skillWindow.x && TouchInput.x <= this.skillWindow.x + 298  &&
		// 	  TouchInput.y >= this.skillWindow.y && TouchInput.y <= this.skillWindow.y + 458 )) )
		// ){
		// 	$gameVariables.setValue(Number(this.isHandledItem.scId)+1,$dataItems[2]);
		// 	this.isHandledItem.scId.cd=0;
		// 	this.isHandledItem = null
		// };
		// 	$gameVariables.setValue(Number(this.isHandledItem.scId)+1,$dataItems[2]);
		// 	this.isHandledItem.scId.cd=0;
		// 	this.isHandledItem = null
		// };
		if(sxlSimpleItemList.freeMoveItem){
			if(this.itemBackground && this.isHandledItem &&
			TouchInput.x >= this.itemBackground.x && TouchInput.x <= this.itemBackground.x + 298  &&
			TouchInput.y >= this.itemBackground.y + 240 && TouchInput.y <= this.itemBackground.y + 458 
			){
				if( this.itemType != 'skill' &&  this.itemType != 'shop'){
					var newPosX = Math.floor((TouchInput.x-(this.itemBackground.x))/40);
					var newPosY = Math.floor((TouchInput.y-(this.itemBackground.y+220))/40);
					for( item in this.itemArray ){
						if( (!this.itemArray[item].item.positionX && 
							this.itemArray[item].positionX == newPosX && 
							this.itemArray[item].positionY == newPosY) || 
							(this.itemArray[item].item.positionX && 
							this.itemArray[item].item.positionX-1 == newPosX && 
							this.itemArray[item].item.positionY-1 == newPosY)){
							this.itemArray[item].item.positionX = this.isHandledItem.positionX+1;
							this.itemArray[item].item.positionY = this.isHandledItem.positionY+1;
						}
					}
					this.isHandledItem.item.positionX = newPosX+1;
					this.isHandledItem.item.positionY = newPosY+1;
					this.isHandledItem.item.page = sxlSimpleItemList.page+1;
					this.isHandledItem.item.position = (Number(this.isHandledItem.item.positionY))*7+(Number(this.isHandledItem.item.positionX));
					
					

					this.isHandledItem = null;
					// this.createItems();
				};
			};
		};
		
		if( this.shortcutBackArray ){
			for( i = 0 ; i < sxlSimpleShortcut.quantity ; i ++ ){
				if( !this.shorcutItem[i].item ){
					this.shorcutItem[i].item = $dataItems[2];
				}
				if( this.isHandledItem &&  
					TouchInput.x >= this.shortcutBackArray[i].x && TouchInput.x <= this.shortcutBackArray[i].x+36 &&
					TouchInput.y >= this.shortcutBackArray[i].y && TouchInput.y <= this.shortcutBackArray[i].y+36 ){
					if(!this.isHandledItem.item.meta.hide  &&
						DataManager.isSkill(this.isHandledItem.item)?$gameParty.members()[0].hasSkill(this.isHandledItem.item.id):true) 
					{
						SoundManager.playEquip()
					};
					for( j in this.shorcutItem ){
						if (this.shorcutItem[j].item == this.isHandledItem.item 
							&& j!=i ) {
							$gameVariables.setValue( Number(j)+1 , $dataItems[2]);
						}else{
							if(DataManager.isSkill(this.isHandledItem.item)?$gameParty.members()[0].hasSkill(this.isHandledItem.item.id):true) {
								$gameVariables.setValue( i+1 ,  this.item);
							}else{
								if(sxlSimpleABS.informationWait<=0){
									sxlSimpleABS.informationColor.push('#ffffff');
									sxlSimpleABS.information.push('放置失败 : 技能未习得。');
									sxlSimpleABS.informationWait = 15;
								}
							}
						}
					}
					

					if( this.shortcutBackArray ) this.refreshShortcutItem();
					this.isHandledItem = null;

				}
			}
		}

		if( this.faces ){

			for( i = 0 ; i < this.faces.length; i ++ ){
				if( this.isHandledItem &&
					TouchInput.x >= this.faces[i]._bounds.minX && TouchInput.x <= this.faces[i]._bounds.maxX &&
					TouchInput.y >= this.faces[i]._bounds.minY && TouchInput.y <= this.faces[i]._bounds.maxY ){
					// console.log(this.faces[i])
					if( this.item.itypeId ){
						var convertToData = $dataItems[ this.item.id ];
					}else if( this.item.wtypeId ){
						var convertToData = $dataWeapons[ this.item.id ];
					}else if( this.item.atypeId ){
						var convertToData = $dataArmors[ this.item.id ];
					}
					if( DataManager.isItem( convertToData ) && convertToData.nowCD <= 0){
						var animation = this.item.animationId;
						var itemAction = new Game_Action( this.faces[i].member );
						var animationTarget = [];
						var useItem = $dataItems[convertToData.id];
						itemAction.setItem( useItem.id );
						itemAction.apply( this.faces[i].member );
						animationTarget.push(this.faces[i].char);
						$gameTemp.requestAnimation( animationTarget, animation, false );
						$gameParty.consumeItem(useItem);
						this.isHandledItem = null;
						this.commonCooldown = sxlSimpleShortcut.commonCooldown;
						if(this.item.meta.resetParamPoints && this.faces[i].member._actorId){
							sxlSimpleFaces.resetParamPoints(this.faces[i].member._actorId);
						}
						if(this.item.meta.addParamPoints && this.faces[i].member._actorId){
							sxlSimpleFaces.addParamPoints(this.faces[i].member._actorId,Number(this.item.meta.addParamPoints));
						}
						useItem.nowCD = Number(useItem.meta.cooldown)
						//挂钩快捷物品栏CD和物品栏CD
						for( item in this.shorcutItem ){
							if(this.shorcutItem[item].item.itypeId && this.shorcutItem[item].item.id == useItem.id){
								this.shorcutItem[item].cd = useItem.nowCD;
							}
						}
					}else if ( this.item.etypeId ){
						if( this.faces[i].member.canEquip( convertToData ) ){
							var changedEquip = this.faces[i].member.equips()[convertToData.etypeId - 1];
							this.faces[i].member.changeEquip( convertToData.etypeId - 1 , convertToData ) ;
							if(!this.isHandledItem.item.meta.hide) SoundManager.playEquip();
							this.isHandledItem = null;
						if(this.itemType === 'shortCut'){
							$gameVariables.setValue(this.item.shortCutNumber+1,changedEquip);
						}
						this.createBackbag();
						// this.createEquips();
						if( this.shortcutBackArray ) this.refreshShortcutItem();
						};
					}
				}
			}
		}
	}else{
		this.isHandledItem = null;
		// $gameSwitches.setValue(1,true);
		// if( sxlSimpleItemList.itemShow ) this.createItems();
		// if( sxlSimpleItemList.itemShow ) this.createEquips();

	};
	
	// if( sxlSimpleItemList.itemShow ) this.createItems();
	// if( sxlSimpleItemList.itemShow ) this.createEquips();
};


Scene_Map.prototype.showInformation = function() {
	if( this.itemInform && !this.itemInform.meta.hide
		&& !TouchInput.isHovered() && !this.isHandledItem
		 ){
		var iconPadding = 6;
		var TextMaxWidth = sxlSimpleItemList.maxInformatiuonWidth-20;
		var TextStartX = (sxlSimpleItemList.maxInformatiuonWidth-TextMaxWidth)/2;
		var TextStartY = iconPadding/2;
		var iconSet = this.itemInform.iconIndex;
		var metaColor = this.itemInform.meta.textColor;
		var infromPreffix = ' · ';
		var textColor;
		
		if( metaColor ) {
			textColor = ColorManager.textColor(Number(metaColor));
		}else{
			textColor = '#ffffff';
		};

		var line = 0 ;
		if( this.informationBackground ){
			this.removeChild( this.informationBackground );
			this.removeChild( this.informationBackground.black );
		}else{
			this.informationBackground = new Sprite(new Bitmap(sxlSimpleItemList.maxInformatiuonWidth,24));
			this.informationBackground.black = new Sprite(new Bitmap(sxlSimpleItemList.maxInformatiuonWidth,Graphics.height));
			this.informationBackground.opacity = 0;
			this.informationBackground.black.opacity = 0;;
		};
		if( this.information ){
			this.information.bitmap.clear();
			this.removeChild( this.information );
			this.informationBackground.bitmap.clear();
			this.informationBackground.black.bitmap.clear();
		}else{
			this.information = new Sprite( new Bitmap( 400 , 10000 ));
			this.information.opacity = 0;
		};
		if( this.informationIcon ){
			
			
		}else{
			this.informationIcon = new Sprite() ;
			this.informationIcon.bitmap = ImageManager.loadSystem( 'iconSet' );
			this.informationIcon.bitmap.smooth = false;
			this.informationIcon.opacity = 0;
			this.informationIcon.scale.x = 1.25;
			this.informationIcon.scale.y = 1.25;

		};
		if( this.informationIconImgBack ){
			
			
		}else{
			this.informationIconImgBack = new Sprite() ;

			// this.informationIconImgBack.bitmap = ImageManager.loadSystem( 'itemNameBack' );
			
			this.informationIconImgBack.opacity = 0;

		};


		this.informationBackground.bitmap.fillRect( 0,0,400,24,'#000000' );
		this.information.opacity += 255;
		this.informationBackground.opacity = this.information.opacity *(240/255)
		this.informationBackground.black.opacity = this.information.opacity *(50/255);
		this.informationBackground.x = TouchInput.x+sxlSimpleItemList.mouseInformationOffsetX;
		this.informationBackground.y = TouchInput.y;
		this.addChild(this.informationBackground);

		this.informationBackground.black.bitmap.gradientFillRect( 0,0,400,24,'#999999','#000000',true );

		
		this.informationBackground.black.blendMode = 1;;
		this.informationBackground.black.x = this.informationBackground.x;
		this.informationBackground.black.y = this.informationBackground.y;
		this.addChild(this.informationBackground.black);

		this.informationIconImgBack.opacity += 255;
		this.addChild(this.informationIconImgBack);

		this.informationIcon.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
		this.informationIcon.opacity += 255;
		
		this.addChild(this.informationIcon);

		

		this.information.x = this.informationBackground.x;
		this.information.y = this.informationBackground.y;

		this.informationIcon.x = this.informationBackground.black.x + iconPadding;
		this.informationIcon.y = this.informationBackground.black.y + iconPadding;
		this.informationIconImgBack.x = this.informationBackground.black.x;
		this.informationIconImgBack.y = this.informationBackground.black.y;

		


		var name = this.itemInform.name;
		var informationLineHeight = 24;
		this.information.bitmap.fontSize = 18;
		this.information.bitmap.fontBold = true;
		this.information.bitmap.textColor = textColor;
		this.information.bitmap.fontFace = $gameSystem.mainFontFace();
		if(this.haveUpgradePlugin){
			if( this.itemInform.meta.textColor2 ){
				var color2 = ColorManager.textColor(Number(this.itemInform.meta.textColor2))
				if(this.itemInform.wtypeId && $gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes > 0 ){
					this.information.bitmap.drawTextGradient(name+' +'+$gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes,TextStartX+iconPadding+40,TextStartY,TextMaxWidth,28,'left',this.information.bitmap.textColor,color2,false);
				}else if(this.itemInform.atypeId && $gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes > 0 ){
					this.information.bitmap.drawTextGradient(name+' +'+$gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes,TextStartX+iconPadding+40,TextStartY,TextMaxWidth,28,'left',this.information.bitmap.textColor,color2,false);
				}else{
					this.information.bitmap.drawTextGradient(name,TextStartX+iconPadding+40,TextStartY,TextMaxWidth,28,'left',this.information.bitmap.textColor,color2,false);
				}
			}else{
				if(this.itemInform.wtypeId && $gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes > 0 ){
					this.information.bitmap.drawText(name+' +'+$gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes,TextStartX+iconPadding+40,TextStartY,TextMaxWidth,28,'left');
				}else if(this.itemInform.atypeId && $gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes > 0 ){
					this.information.bitmap.drawText(name+' +'+$gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes,TextStartX+iconPadding+40,TextStartY,TextMaxWidth,28,'left');
				}else{
					this.information.bitmap.drawText(name,TextStartX+iconPadding+40,TextStartY,TextMaxWidth,28,'left');
				}
			}
			this.information.bitmap.fontSize = 14;
			
			
		}else{
			
		}
		
		this.information.bitmap.fontBold = false;
		if(sxlSimpleItemList.rareColorDirection == 0){
			this.informationBackground.black.bitmap.gradientFillRect( 0,0,400,40+iconPadding*2,'#000000',textColor,false );
		}else{
			this.informationBackground.black.bitmap.gradientFillRect( 0,0,400,40+iconPadding*2,textColor,'#000000',false );
		}
		
		line ++ ;
		// this.information.bitmap.fontBold = false;
		if(!DataManager.isSkill(this.itemInform)){
			// this.information.bitmap.drawText('数量：'+$gameParty.numItems(this.itemInform),TextStartX+iconPadding+40,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left')	
			// line ++ ;
			var theColor = this.itemInform.meta.textColor?this.itemInform.meta.textColor:0;
			var quality = '特殊';
			for( c in sxlSimpleItemList.rareColor ){
				if( sxlSimpleItemList.rareColor[c] == Number(theColor) ){
					quality = sxlSimpleItemList.rareName[Number(c)+1]+'';
					break;
				}
			}
			this.information.bitmap.textColor = '#FFFFFF';
			if( this.itemInform.etypeId == 1 && !this.itemInform.stypeId){
				var type = $dataSystem.weaponTypes[ this.itemInform.wtypeId ];
				this.information.bitmap.drawText(quality+type+'(武器)',TextStartX+iconPadding+40,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++ ;
			}
			if( this.itemInform.etypeId != 1 && !this.itemInform.stypeId && !this.itemInform.itypeId){
				var type = $dataSystem.armorTypes[ this.itemInform.atypeId ];
				var etypeT = $dataSystem.equipTypes[ this.itemInform.etypeId ];
				this.information.bitmap.drawText(quality+etypeT+'('+type+')',TextStartX+iconPadding+40,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++ ;
			};
		}
		this.information.bitmap.textColor = '#FFFFFF';
		if(this.itemInform.meta.requireLV){
			if($gameParty.members()[sxlSimpleItemList.actor].level>=Number(this.itemInform.meta.requireLV)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.level +': '+this.itemInform.meta.requireLV,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireATK){
			if($gameParty.members()[sxlSimpleItemList.actor].atk>=Number(this.itemInform.meta.requireATK)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(2) +': '+this.itemInform.meta.requireATK,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireDEF){
			if($gameParty.members()[sxlSimpleItemList.actor].def>=Number(this.itemInform.meta.requireDEF)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(3) +': '+this.itemInform.meta.requireDEF,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireMAT){
			if($gameParty.members()[sxlSimpleItemList.actor].mat>=Number(this.itemInform.meta.requireMAT)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(4) +': '+this.itemInform.meta.requireMAT,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireMDF){
			if($gameParty.members()[sxlSimpleItemList.actor].mdf>=Number(this.itemInform.meta.requireMDF)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(5) +': '+this.itemInform.meta.requireMDF,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireAGI){
			if($gameParty.members()[sxlSimpleItemList.actor].agi>=Number(this.itemInform.meta.requireAGI)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(6) +': '+this.itemInform.meta.requireAGI,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireLUK){
			if($gameParty.members()[sxlSimpleItemList.actor].luk>=Number(this.itemInform.meta.requireLUK)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(7) +': '+this.itemInform.meta.requireLUK,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireHP){
			if($gameParty.members()[sxlSimpleItemList.actor].mhp>=Number(this.itemInform.meta.requireHP)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(0) +': '+this.itemInform.meta.requireHP,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		if(this.itemInform.meta.requireMP){
			if($gameParty.members()[sxlSimpleItemList.actor].mmp>=Number(this.itemInform.meta.requireMP)){
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}else{
				this.information.bitmap.textColor = ColorManager.textColor(7);
			}
			this.information.bitmap.drawText('需求'+ TextManager.param(1) +': '+this.itemInform.meta.requireMP,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
		}
		this.information.bitmap.textColor = ColorManager.textColor(0);
		if(this.itemInform.etypeId && !DataManager.isSkill(this.itemInform) && sxlSimpleItemList.durabilityAllowed){
			var maxDura = this.itemInform.meta.durability?Number(this.itemInform.meta.durability):100;
			if(this.itemInform.atypeId&&!this.itemInform.meta.unbreakable){
				if($gameParty.durabilityArmors[this.itemInform.id-1]<=maxDura*0.3) this.information.bitmap.textColor = ColorManager.textColor(25);
				this.information.bitmap.drawText('耐久度: '+$gameParty.durabilityArmors[this.itemInform.id-1]+'/'+maxDura,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			}
			if(this.itemInform.wtypeId&&!this.itemInform.meta.unbreakable){
				if($gameParty.durabilityWeapons[this.itemInform.id-1]<=maxDura*0.3) this.information.bitmap.textColor = ColorManager.textColor(25);
				this.information.bitmap.drawText('耐久度: '+$gameParty.durabilityWeapons[this.itemInform.id-1]+'/'+maxDura,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			}
			if(this.itemInform.meta.unbreakable){
				// this.information.bitmap.textColor = ColorManager.textColor(25);
				this.information.bitmap.drawText(sxlSimpleItemList.unbreakableWord,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			}
			line ++ ;
			this.information.bitmap.textColor = '#FFFFFF';
		}
		if( this.itemInform.etypeId && !DataManager.isSkill(this.itemInform)){
			// if( this.itemInform.etypeId ){
			// 	var type = $dataSystem.equipTypes[ this.itemInform.etypeId ];
			// 	this.information.bitmap.drawText('装备类型'+':'+type,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'center');
			// 	line ++ ;
			// };
			// if( this.itemInform.etypeId == 1 && !DataManager.isSkill(this.itemInform)){
			// 	var type = $dataSystem.weaponTypes[ this.itemInform.wtypeId ];
			// 	this.information.bitmap.drawText('武器类型'+':'+type,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'center');
			// 	line ++ ;
			// }
			// if( this.itemInform.etypeId != 1 && !DataManager.isSkill(this.itemInform)){
			// 	var type = $dataSystem.armorTypes[ this.itemInform.atypeId ];
			// 	this.information.bitmap.drawText('护甲类型'+':'+type,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'center');
			// 	line ++ ;
			// };
			if(this.haveUpgradePlugin && this.itemInform.wtypeId){
				var nowPlus2 = ($gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes ) * 
							($dataWeapons[this.itemInform.id].meta.upgradePlus?
							$dataWeapons[this.itemInform.id].meta.upgradePlus:$dataWeapons[this.itemInform.id].params[2]/10);
				var nowPlus4 = ($gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes ) * 
							($dataWeapons[this.itemInform.id].meta.upgradePlus?
							$dataWeapons[this.itemInform.id].meta.upgradePlus:$dataWeapons[this.itemInform.id].params[4]/10);
			}else if(this.itemInform && this.itemInform.atypeId){
				var nowPlus3 = ($gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes ) * 
							($dataArmors[this.itemInform.id].meta.upgradePlus?
							$dataArmors[this.itemInform.id].meta.upgradePlus:$dataArmors[this.itemInform.id].params[3]/10);
				var nowPlus5 = ($gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes ) * 
							($dataArmors[this.itemInform.id].meta.upgradePlus?
							$dataArmors[this.itemInform.id].meta.upgradePlus:$dataArmors[this.itemInform.id].params[5]/10);
			}
			if( this.itemInform.params[0]==0&&
				this.itemInform.params[1]==0&&
				this.itemInform.params[2]==0&&
				this.itemInform.params[3]==0&&
				this.itemInform.params[4]==0&&
				this.itemInform.params[5]==0&&
				this.itemInform.params[6]==0&&
				this.itemInform.params[7]==0){

			}else{
				this.information.bitmap.fontBold = true;
				if(this.hightLightSystemWordInformation) this.informationBackground.black.bitmap.gradientFillRect( 0,TextStartY + line*informationLineHeight,400-8,informationLineHeight,'#999999','#000000',false );
				this.information.bitmap.drawText('基础属性：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++ ;
			}
			this.information.bitmap.fontBold = false;
			for( j = 0 ; j < this.itemInform.params.length ; j ++ ){
				var param = this.itemInform.params[j]
				if( param != 0 ){
					var paramName = TextManager.param(j);
					if(param > 0 ) this.information.bitmap.drawText(infromPreffix+paramName+'+'+param,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					if(param < 0 ) {
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
						this.information.bitmap.drawText(infromPreffix+paramName+param,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						this.information.bitmap.textColor = ColorManager.textColor(0);
					}
					line ++ ;
					if( j==2 && this.haveUpgradePlugin && this.itemInform.wtypeId && $gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes > 0 ){
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText('  '+paramName+'强化+'+Number(nowPlus2),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						this.information.bitmap.textColor = ColorManager.textColor(0);
						line ++ ;
					}
					if( j==4 && this.haveUpgradePlugin && this.itemInform.wtypeId && $gameParty.enhanceWeapons[this.itemInform.id-1].enhanceTimes > 0 ){
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText('  '+paramName+'强化+'+Number(nowPlus4),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						this.information.bitmap.textColor = ColorManager.textColor(0);
						line ++ ;
					}
					if( j==3 && this.haveUpgradePlugin && this.itemInform.atypeId && $gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes > 0 ){
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText('  '+paramName+'强化+'+Number(nowPlus3),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						this.information.bitmap.textColor = ColorManager.textColor(0);
						line ++ ;
					}
					if( j==5 && this.haveUpgradePlugin && this.itemInform.atypeId && $gameParty.enhanceArmors[this.itemInform.id-1].enhanceTimes > 0 ){
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText('  '+paramName+'强化+'+Number(nowPlus5),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						this.information.bitmap.textColor = ColorManager.textColor(0);
						line ++ ;
					}
				};
			};
			if(this.itemInform.traits.length>0||this.itemInform.meta.desc){
				this.information.bitmap.fontBold = true;
				if(this.hightLightSystemWordInformation) this.informationBackground.black.bitmap.gradientFillRect( 0,TextStartY + line*informationLineHeight,400-8,informationLineHeight,'#999999','#000000',false );
				this.information.bitmap.drawText('特殊属性：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++ ;
				this.information.bitmap.fontBold = false;
			}
			
			for( j = 0 ; j < this.itemInform.traits.length ; j ++ ){
				var k = this.itemInform.traits[j];
				if( k.value != 0){
					if( k.code == 11 ){
					var element = $dataSystem.elements[k.dataId];
					var num = Math.round(( 1 - k.value  ) * 100);
					if ( num > 0) {
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+element+'属性抗性+'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						
					}else{
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
						this.information.bitmap.drawText(infromPreffix+element+'属性抗性'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					}
					line ++ ;
				}
					if( k.code == 21 ){
						var param = TextManager.param(k.dataId);
						var num = Math.round(( k.value * 100 - 100  ) );
						if( num > 0){
							this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
							this.information.bitmap.drawText(infromPreffix+param+'+'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						}else{
							this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
							this.information.bitmap.drawText(infromPreffix+param+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						};
						line ++ ;
					}
					if( k.code == 22 ){
						switch ( k.dataId ){
							case 0:
								var param = '命中率';
								break;
							case 1:
								var param = '回避率';
								break;
							case 2:
								var param = '暴击率';
								break;
							case 3:
								var param = '暴击回避率';
								break;
							case 4:
								var param = '魔法回避率';
								break;
							case 5:
								var param = '击退距离';
								break;
							case 6:
								var param = '攻击距离';
								break;
							case 7:
								var param = '生命恢复';
								break;
							case 8:
								var param = '魔法恢复';
								break;
							case 9:
								var param = '攻击速度';
								break;
						}
						
						var num = Math.round(k.value * 100);
						if(param === '攻击速度'){
							if( num > 0){
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
								this.information.bitmap.drawText(infromPreffix+param+'+'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}else{
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
								this.information.bitmap.drawText(infromPreffix+param+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}
						}else if(param === '击退距离'){
							if( num > 0){
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
								this.information.bitmap.drawText(infromPreffix+param+'+'+num,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}else{
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
								this.information.bitmap.drawText(infromPreffix+param+num,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}
						}else if(param === '攻击距离'){
							if( num > 0){
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
								this.information.bitmap.drawText(infromPreffix+param+'+'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}else{
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
								this.information.bitmap.drawText(infromPreffix+param+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}
						}else{
							if( num > 0){
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
								this.information.bitmap.drawText(infromPreffix+param+'+'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}else{
								this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
								this.information.bitmap.drawText(infromPreffix+param+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							}
						}
						
						
						line ++ ;
					}
					if( k.code == 23 ){
						switch ( k.dataId ){
							case 0:
								var param = '生成仇恨';
								break;
							case 1:
								var param = '击退抗性';
								break;
							case 2:
								var param = '恢复效果';
								break;
							case 3:
								var param = '药理知识';
								break;
							case 4:
								var param = '魔法消耗率';
								break;
							case 5:
								var param = '蓄气补充率';
								break;
							case 6:
								var param = '物理抗性';
								break;
							case 7:
								var param = '魔法抗性';
								break;
							case 8:
								var param = '地形承伤';
								break;
							case 9:
								var param = '经验获取率';
								break;
						}
						var num = ( 1 - k.value) * 100;
						if( num > 0 ){
							this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
							this.information.bitmap.drawText(infromPreffix+param+'×'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
							
						}else{
							this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
							this.information.bitmap.drawText(infromPreffix+param+'×'+num+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						}
						
						line ++ ;
					}
					if( k.code == 31 ){
						var element = $dataSystem.elements[k.dataId];
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+element+'属性攻击',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
					if( k.code == 32 ){
						var state = $dataStates[k.dataId].name;
						var rate = k.value * 100;
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+'攻击时'+rate+'%概率造成'+state,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
					if( k.code == 35 ){
						var skill = $dataSkills[k.dataId].name;
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+'攻击技能：'+skill,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					};
					this.information.bitmap.textColor = ColorManager.textColor(0);
				};
			};
		}else{
			var theColor = this.itemInform.meta.textColor?this.itemInform.meta.textColor:0;
			var quality = '特殊';
			for( c in sxlSimpleItemList.rareColor ){
				if( sxlSimpleItemList.rareColor[c] == Number(theColor) ){
					quality = sxlSimpleItemList.rareName[Number(c)+1]+'';
					break;
				}
			}
			var consume = this.itemInform.consumable ;
			if (this.itemInform.stypeId){
				this.information.bitmap.fontBold = true;
				this.information.bitmap.drawText(quality+'技能',TextStartX+iconPadding+40,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				this.information.bitmap.fontBold = false;
				line ++
				var needLevel = this.itemInform.meta.needLevel?this.itemInform.meta.needLevel:1;
				var maxLevel = this.itemInform.meta.maxLevel?this.itemInform.meta.maxLevel:1;
				var skillLevel = this.itemInform.meta.levelVar?$gameVariables.value(this.itemInform.meta.levelVar):1;
				var skillCoolDown = this.itemInform.meta.cooldown?Math.floor(this.itemInform.meta.cooldown/60*100)/100:0.5;
				if( !this.itemInform.meta.levelVar && this.userSkillWindow && sxlSkillWindow.member.hasSkill(this.itemInform.id)){
					skillLevel = 1;
				}else if (this.userSkillWindow && !sxlSkillWindow.member.hasSkill(this.itemInform.id)){
					skillLevel = 0 ;
				};
			
				this.information.bitmap.fontBold = true;
				this.information.bitmap.drawText('技能参数：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				this.information.bitmap.fontBold = false;
				line ++
				this.information.bitmap.drawText(infromPreffix+'需要等级: '+needLevel,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++
				if(this.itemInform.meta.needSkill){
					this.information.bitmap.drawText(infromPreffix+'前置技能: '+$dataSkills[this.itemInform.meta.needSkill].name,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');	
					line ++
				};
				this.information.bitmap.drawText(infromPreffix+'技能等级: '+skillLevel+'/'+maxLevel,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++
				if(skillCoolDown!=0){
					this.information.bitmap.drawText(infromPreffix+'冷却时间: '+skillCoolDown+'秒',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');	
					line ++
				};
				if(this.itemInform.mpCost>0){
					
					this.information.bitmap.textColor = ColorManager.textColor(4);
					this.information.bitmap.drawText(infromPreffix+TextManager.mp+'消耗: '+this.itemInform.mpCost,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					this.information.bitmap.textColor = ColorManager.textColor(0);
					line ++
				}
				
			}else{
				this.information.bitmap.fontBold = false;
				if(consume){
					this.information.bitmap.drawText(quality+'物品(消耗品)',TextStartX+iconPadding+ 40,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				}else{
					this.information.bitmap.drawText(quality+'物品',TextStartX+iconPadding+40,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				}

				this.information.bitmap.fontBold = false;
				line ++ ; 
			}
			if( this.itemInform.requiredWtypeId1 || this.itemInform.requiredWtypeId1 || this.itemInform.meta.requiredWtypes ){
				this.information.bitmap.fontBold = true;
				this.information.bitmap.drawText('所需武器类型：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				this.information.bitmap.fontBold = false;
				line ++
				this.information.bitmap.textColor = ColorManager.textColor(7);
				for( weapon of $gameParty.members()[0].weapons() ){
					if(weapon.wtypeId == this.itemInform.requiredWtypeId1){
						this.information.bitmap.textColor = ColorManager.textColor(24);
						break;
					}
				}
				this.information.bitmap.drawText(infromPreffix+$dataSystem.weaponTypes[this.itemInform.requiredWtypeId1],TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++
				this.information.bitmap.textColor = ColorManager.textColor(7);
				for( weapon of $gameParty.members()[0].weapons() ){
					if(weapon.wtypeId == this.itemInform.requiredWtypeId2){
						this.information.bitmap.textColor = ColorManager.textColor(24);
						break;
					}
				}
				this.information.bitmap.drawText(infromPreffix+$dataSystem.weaponTypes[this.itemInform.requiredWtypeId2],TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++
				if(this.itemInform.meta.requiredWtypes){

					for( wtype of this.itemInform.meta.requiredWtypes.split(',') ){
						this.information.bitmap.textColor = ColorManager.textColor(7);
						for( weapon of $gameParty.members()[0].weapons() ){
							if(weapon.wtypeId == wtype){
								this.information.bitmap.textColor = ColorManager.textColor(24);
								break;
							}
						}
						this.information.bitmap.drawText(infromPreffix+$dataSystem.weaponTypes[wtype],TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++
					}
				}
				this.information.bitmap.textColor = ColorManager.textColor(0);
			}
			if( this.itemInform.effects.length>0||this.itemInform.meta.desc){
				this.information.bitmap.fontBold = true;
				if(this.hightLightSystemWordInformation) this.informationBackground.black.bitmap.gradientFillRect( 0,TextStartY + line*informationLineHeight,400-8,informationLineHeight,'#999999','#000000',false );
				this.information.bitmap.drawText('效果：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				this.information.bitmap.fontBold = false;
				line ++
			}
			
			
			for( k = 0 ; k < this.itemInform.effects.length ; k ++ ){
				var effect = this.itemInform.effects[k];
				if( effect.code == 11 ){
					if( effect.value1 > 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+'恢复生命'+Number(effect.value1)*100+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					};
					if( effect.value2 > 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+'恢复生命'+Number(effect.value2),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
					if( effect.value1 < 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
						this.information.bitmap.drawText(infromPreffix+'损失生命'+Math.abs(Number(effect.value1)*100)+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					};
					if( effect.value2 < 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
						this.information.bitmap.drawText(infromPreffix+'损失生命'+Math.abs(Number(effect.value2)),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
				}
				if( effect.code == 12 ){
					if( effect.value1 > 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+'恢复魔法'+Number(effect.value1)*100+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					};
					if( effect.value2 > 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						this.information.bitmap.drawText(infromPreffix+'恢复魔法'+Number(effect.value2),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
					if( effect.value1 < 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
						this.information.bitmap.drawText(infromPreffix+'损失魔法'+Math.abs(Number(effect.value1)*100)+'%',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					};
					if( effect.value2 < 0 ){ 
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultDebuffColor);
						this.information.bitmap.drawText(infromPreffix+'损失魔法'+Math.abs(Number(effect.value2)),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
				}
				if( effect.code == 13 ){
					this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
					this.information.bitmap.drawText(infromPreffix+'获得蓄气'+Number(effect.value1),TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					line ++ ;
				}
				if( effect.code == 21 ){
					if(effect.dataId!=0){
						var rate = effect.value1*100;
						var stateName = $dataStates[effect.dataId].name;
						this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
						if( rate >= 1 ){
							this.information.bitmap.drawText(infromPreffix+'附加状态【'+stateName+'】',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						}else{
							this.information.bitmap.drawText(infromPreffix+'附加状态【'+stateName+'】('+rate+'概率)',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						}
						
						line ++ ;
					}
					
				}
				if( effect.code == 22 ){
					var rate = effect.value1*100;
					var stateName = $dataStates[effect.dataId].name;
					this.information.bitmap.textColor = ColorManager.textColor(sxlSimpleItemList.defaultBuffColor);
					if( rate >= 1 ){
						this.information.bitmap.drawText(infromPreffix+'解除状态【'+stateName+'】',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					}else{
						this.information.bitmap.drawText(infromPreffix+'解除状态【'+stateName+'】('+rate+'概率)',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					}
					
					line ++ ;
				};
				var skillCoolDown = this.itemInform.meta.cooldown?Math.floor(this.itemInform.meta.cooldown/60*100)/100:0.5;

			};
			if( !this.itemInform.stypeId && skillCoolDown && skillCoolDown!=0){
				this.information.bitmap.textColor = ColorManager.textColor(0);
				this.information.bitmap.drawText(infromPreffix+'冷却时间: '+skillCoolDown+'秒',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');	
				line ++
			};
		};
		this.information.bitmap.textColor = ColorManager.textColor(24);
		if(this.itemInform.meta.desc){
			var meta = this.itemInform.meta.desc.split('\n');
			for( i in meta){
				if(meta[i]){
					var c = meta[i].split(':')
					if(c[0]=='/C') {
						this.information.bitmap.textColor = ColorManager.textColor(c[1])
					}else{
						this.information.bitmap.drawText(meta[i],TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
				}
			}
		}
		if(this.itemInform.meta.suit){
			this.information.bitmap.textColor = ColorManager.textColor(0);
			if(this.hightLightSystemWordInformation) this.informationBackground.black.bitmap.gradientFillRect( 0,TextStartY + line*informationLineHeight,400-8,informationLineHeight,'#999999','#000000',false );
			this.information.bitmap.drawText('套装部件：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			line ++ ;
			if(this.itemInform.meta.suitEquips){
				var suitEquips = this.itemInform.meta.suitEquips.split(',');
				for( const equip of suitEquips ){
					var et = equip.split(' ');
					if(et[0]=='w'){
						if($gameParty.members()[sxlSimpleItemList.actor].equips().indexOf($dataWeapons[et[1]])>-1){
							this.information.bitmap.textColor = ColorManager.textColor(24);
						}else{
							this.information.bitmap.textColor = ColorManager.textColor(7);
						}
						this.information.bitmap.drawText(infromPreffix+$dataWeapons[et[1]].name,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					}
					if(et[0]=='a'){
						if($gameParty.members()[sxlSimpleItemList.actor].equips().indexOf($dataArmors[et[1]])>-1){
							this.information.bitmap.textColor = ColorManager.textColor(24);
						}else{
							this.information.bitmap.textColor = ColorManager.textColor(7);
						}
						this.information.bitmap.drawText(infromPreffix+$dataArmors[et[1]].name,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
					}
					line ++ ;
				}
			}
			this.information.bitmap.textColor = ColorManager.textColor(0);
			// this.information.bitmap.drawText('套装效果：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			// line ++ ;
			var suitParts = this.itemInform.meta.suit.split(',');
			for( const suitPart of suitParts ){
				var suitCount = suitPart.split(' ');
				var totalCount = $gameParty.members()[sxlSimpleItemList.actor].equips().filter(function (val) { return $dataStates[suitCount[1]].needEquips.indexOf(val) > -1 })
				this.information.bitmap.textColor = ColorManager.textColor(0);
				if(this.hightLightSystemWordInformation) this.informationBackground.black.bitmap.gradientFillRect( 0,TextStartY + line*informationLineHeight,400-8,informationLineHeight,'#999999','#000000',false );
				this.information.bitmap.drawText($dataStates[suitCount[1]].name+':',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++ ;
				if( $dataStates[suitCount[1]].meta.suitDesc ){
					if(totalCount.length>=suitCount[0]){
						this.information.bitmap.textColor = ColorManager.textColor(24);
					}else{
						this.information.bitmap.textColor = ColorManager.textColor(7);
					}
					var stateDescs = $dataStates[suitCount[1]].meta.suitDesc.split('\n');
					for( const stateDesc of stateDescs){
						this.information.bitmap.drawText(stateDesc,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
				}
				
				
			}
		}
		if( this.itemInform.description!= ''){
			this.information.bitmap.textColor = ColorManager.textColor(0)
			this.information.bitmap.fontBold = true;
			if(this.hightLightSystemWordInformation) this.informationBackground.black.bitmap.gradientFillRect( 0,TextStartY + line*informationLineHeight,400-8,informationLineHeight,'#999999','#000000',false );
			this.information.bitmap.drawText('简介：',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			this.information.bitmap.fontBold = false;
			line ++
			var description = this.itemInform.description.split('/NL');
			for( i in description ){
				this.information.bitmap.textColor = ColorManager.textColor(8);
				this.information.bitmap.drawText(description[i],TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++ ;
			}
		};
		if(this.itemInform.etypeId){
			for( member in $gameParty.members()){
				for(equip in $gameParty.members()[member].equips()){
					if( this.itemInform.etypeId == $gameParty.members()[member].equips()[equip].etypeId &&
						this.itemInform.id == $gameParty.members()[member].equips()[equip].id){
						this.information.bitmap.textColor = ColorManager.textColor(4);
						if(this.hightLightSystemWordInformation) this.informationBackground.black.bitmap.gradientFillRect( 0,TextStartY + line*informationLineHeight,400-8,informationLineHeight,this.information.bitmap.textColor,'#000000',false );
						this.information.bitmap.drawText($gameParty.members()[member]._name+' 正在装备',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
						line ++ ;
					}
				}
			}
		};
		this.information.bitmap.textColor = ColorManager.textColor(0)
		if(!this.itemInform.stypeId){
			if(this.itemType != 'shop'){
				this.information.bitmap.blt(ImageManager.loadSystem('iconSet'),600 % 16*32,Math.floor(600 / 16)*32,32,32,TextStartX,TextStartY + line*informationLineHeight,22,22);
				this.information.bitmap.drawText('      ' +  this.itemInform.price/2,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			}else{
				this.information.bitmap.blt(ImageManager.loadSystem('iconSet'),600 % 16*32,Math.floor(600 / 16)*32,32,32,TextStartX,TextStartY + line*informationLineHeight,22,22);
				this.information.bitmap.drawText('      ' +  this.itemInform.price ,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
			}
			line ++ ;
			if(this.itemInform.meta.currency && this.itemType == 'shop'){
				let currencyItem = $dataItems[Number(this.itemInform.meta.currency.split(',')[0])];
				this.information.bitmap.blt(ImageManager.loadSystem('iconSet'), currencyItem.iconIndex % 16*32,Math.floor(currencyItem.iconIndex / 16)*32,32,32,TextStartX,TextStartY + line*informationLineHeight,22,22);
				this.information.bitmap.drawText('      ' +  Number(this.itemInform.meta.currency.split(',')[1]) ,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');
				line ++ ;
			}
			if(this.itemType == 'shop') {
				this.information.bitmap.drawText('鼠标右键购买',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,informationLineHeight,'left');	
				line ++ ;
			}
		}
		if(sxlSimpleABS.debugMode){
			this.information.bitmap.fontBold = false;
			this.information.bitmap.textColor = ColorManager.textColor(8);
			this.information.bitmap.drawText( 'ID:'+this.itemInform.id,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,28,'left');
			line++
			if(this.itemInform.animationId){
				this.information.bitmap.drawText( '动画:'+this.itemInform.animationId+'('+$dataAnimations[this.itemInform.animationId].name+')',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,28,'left');
				line++
			}
			if(this.itemInform.damage){
				this.information.bitmap.drawText('伤害:',TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,28,'left');
				line++
				this.information.bitmap.drawText(this.itemInform.damage.formula,TextStartX,TextStartY + line*informationLineHeight,TextMaxWidth,28,'left');
				line++
			}
		}
		line +=0.25 ;


		this.informationBackground.scale.y = line;
		this.informationBackground.black.scale.y = 1;
		this.addChild(this.information);

		if(!this.informationBounds){
			this.informationBounds = new Sprite(new Bitmap(400,Graphics.height));
			
		}
		this.informationBounds.bitmap.clear();
		
		// textColor
		this.informationBounds.bitmap.fillRect(0,0,sxlSimpleItemList.maxInformatiuonWidth+4,2, '#000000');
		this.informationBounds.bitmap.fillRect(0,24*line+2,sxlSimpleItemList.maxInformatiuonWidth+4,2, '#000000');
		this.informationBounds.bitmap.fillRect(0,0,2,24*line+2, '#000000');
		this.informationBounds.bitmap.fillRect(sxlSimpleItemList.maxInformatiuonWidth+2,0,2,24*line+2, '#000000');
		this.informationBounds.opacity = 128;
		this.addChild( this.informationBounds );

		if( this.informationBackground.x > Graphics.width - this.informationBackground.bitmap.width){
			this.information.x = Graphics.width - this.informationBackground.bitmap.width;
			this.informationBackground.x = Graphics.width - this.informationBackground.bitmap.width;
			this.informationBackground.black.x = this.informationBackground.x;
			this.informationBackground.black.y = this.informationBackground.y;
			this.informationIcon.x = this.informationBackground.black.x + iconPadding;
			this.informationIcon.y = this.informationBackground.black.y + iconPadding;
			this.informationIconImgBack.x = this.informationBackground.black.x;
			this.informationIconImgBack.y = this.informationBackground.black.y;
		}
		if( this.informationBackground.y > Graphics.height - this.informationBackground.bitmap.height * line){
			this.information.y = Graphics.height - this.informationBackground.bitmap.height * line;
			this.informationBackground.y = Graphics.height - this.informationBackground.bitmap.height * line;
			this.informationBackground.black.x = this.informationBackground.x;
			this.informationBackground.black.y = this.informationBackground.y;
			this.informationIcon.x = this.informationBackground.black.x + iconPadding;
			this.informationIcon.y = this.informationBackground.black.y + iconPadding;
			this.informationIconImgBack.x = this.informationBackground.black.x;
			this.informationIconImgBack.y = this.informationBackground.black.y;

		}
		if(this.informationBounds){
			this.informationBounds.opacity = this.information.opacity/2;
			this.informationBounds.x = this.informationBackground.x-2;
			this.informationBounds.y = this.informationBackground.y-2;
		}
	};
	
	
	if( TouchInput.isReleased() || !this.itemInform || TouchInput.isHovered() ){
		
		this.itemInform = null;
		if( this.informationBackground ){
			this.informationBackground.opacity = 0;
			this.informationBackground.black.opacity = 0;
			this.removeChild( this.informationBackground );
			this.removeChild( this.informationBackground.black );
			this.removeChild( this.informationBounds );
		};
		if( this.information ){
			this.information.opacity = 0;
			this.removeChild( this.information );	
		};
		if( this.informationIcon ){
			this.informationIcon.opacity = 0;
		}
		if(this.informationIconImgBack){
			this.informationIconImgBack.opacity = 0;
		}
	};
};

Game_Party.prototype.gainGoldHide = function(amount) {
	this._gold = (this._gold + amount).clamp(0, this.maxGold());
	if(sxlSimpleItemList.itemShow ){
		//  sxlSimpleItemList.smp.createItems()
		//  sxlSimpleItemList.smp.createEquips()
	}
};

// Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
// 	const container = this.itemContainer(item);
// 	if (container) {
// 		// if( amount > 0 && !$gameParty.hasItem(item)){
// 		// 	item.countId = 0;
// 		// 	item.positionX = 1;
// 		// 	item.positionY = 1;
// 		// 	item.page = 1;
// 		// 	sxlSimpleItemList.smp.cidX = [];
// 		// 	for( a in this.allItems()){
// 		// 		if(!this.allItems()[a].meta.hide){
// 		// 			if(!item.positionX){
// 		// 				console.log( sxlSimpleItemList.smp.cidX )
// 		// 			}else{
// 		// 				sxlSimpleItemList.smp.cidX.push((this.allItems()[a].positionY+1)*7-7+this.allItems()[a].positionX+1);
// 		// 			}
// 		// 			sxlSimpleItemList.smp.cidX.sort(function(a, b){return a - b})
					
// 		// 		}
// 		// 	}
// 		// 	for( b in sxlSimpleItemList.smp.cidX ){
// 		// 		if( b < sxlSimpleItemList.smp.cidX.length){
// 		// 			if( sxlSimpleItemList.smp.cidX[b+1] - sxlSimpleItemList.smp.cidX[b] > 1 ){
// 		// 				item.positionX = sxlSimpleItemList.smp.cidX[b+1] % 7
// 		// 				item.positionY = Math.floor( sxlSimpleItemList.smp.cidX[b+1]/7)-sxlSimpleItemList.smp.cidX[b+1]%35;
// 		// 				if(item.positionY>5){
// 		// 					item.page += 1;
// 		// 				}
// 		// 			}
// 		// 		}
// 		// 	}
// 		// }
// 		// item.position = 0;
// 		// for(position in sxlSimpleItemList.positions ){
// 		// 	console.log(sxlSimpleItemList.positions)
// 		// 	if( !(0 in sxlSimpleItemList.positions )){
// 		// 		item.positionX = 1 ;
// 		// 		item.positionY = 1 ;
// 		// 	}
// 		// 	if( sxlSimpleItemList.positions[position+1] &&
// 		// 		sxlSimpleItemList.positions[position+1]-
// 		// 		sxlSimpleItemList.positions[position]>1 ){
// 		// 		item.positionX = (sxlSimpleItemList.positions[position]-1) % 7 ;
// 		// 		item.positionY = Math.floor((sxlSimpleItemList.positions[position]-1)/7) ;
// 		// 	}
// 		// }
// 		const lastNumber = this.numItems(item);
// 		const newNumber = lastNumber + amount;
// 		container[item.id] = newNumber.clamp(0, this.maxItems(item));
// 		if (container[item.id] === 0) {
// 			delete container[item.id];
// 		}
// 		if (includeEquip && newNumber < 0) {
// 			this.discardMembersEquip(item, -newNumber);
// 		}
		
		 
		
// 		$gameMap.requestRefresh();
// 	}

// };

// Game_Party.prototype.gainItemHide = function(item, amount, includeEquip) {
// 	const container = this.itemContainer(item);
// 	if (container) {
// 		const lastNumber = this.numItems(item);
// 		const newNumber = lastNumber + amount;
// 		container[item.id] = newNumber.clamp(0, this.maxItems(item));
// 		if (container[item.id] === 0) {
// 			delete container[item.id];
// 		}
// 		if (includeEquip && newNumber < 0) {
// 			this.discardMembersEquip(item, -newNumber);
// 		}
		
// 		$gameMap.requestRefresh();
// 	}

// };

Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
	if (newItem && !$gameParty.hasItem(newItem)) {
		return false;
	} else {
		$gameParty.gainItemHide(oldItem, 1);
		$gameParty.loseItemHide(newItem, 1);
		return true;
	}
	if(sxlSimpleItemList.itemShow ){
		//  sxlSimpleItemList.smp.createItems()
		 sxlSimpleItemList.smp.createEquips()
	}
};

Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
	this.gainItem(item, -amount, includeEquip);
	if(sxlSimpleItemList.itemShow ){
		//  sxlSimpleItemList.smp.createItems()
		 sxlSimpleItemList.smp.createEquips()
	}
};

Game_Party.prototype.loseItemHide = function(item, amount, includeEquip) {
	this.gainItemHide(item, -amount, includeEquip);
	if(sxlSimpleItemList.itemShow ){
		//  sxlSimpleItemList.smp.createItems()
		 sxlSimpleItemList.smp.createEquips()
	}
};

Game_BattlerBase.prototype.canEquipWeapon = function(item) {
	return (
		this.isEquipWtypeOk(item.wtypeId) &&
		!this.isEquipTypeSealed(item.etypeId) &&
		(item.meta.requireLV?this.level>=Number(item.meta.requireLV):true) &&
		(item.meta.requireATK?this.atk>=Number(item.meta.requireATK):true) &&
		(item.meta.requireDEF?this.def>=Number(item.meta.requireDEF):true) &&
		(item.meta.requireMAT?this.mat>=Number(item.meta.requireMAT):true) &&
		(item.meta.requireMDF?this.mdf>=Number(item.meta.requireMDF):true) &&
		(item.meta.requireAGI?this.mdf>=Number(item.meta.requireAGI):true) &&
		(item.meta.requireLUK?this.luk>=Number(item.meta.requireLUK):true) &&
		(item.meta.requireHP?this.mhp>=Number(item.meta.requireHP):true) &&
		(item.meta.requireMP?this.mmp>=Number(item.meta.requireMP):true)
	);
};

Game_BattlerBase.prototype.canEquipArmor = function(item) {
	return (
		this.isEquipAtypeOk(item.atypeId) &&
		!this.isEquipTypeSealed(item.etypeId) &&
		(item.meta.requireLV?this.level>=Number(item.meta.requireLV):true) &&
		(item.meta.requireATK?this.atk>=Number(item.meta.requireATK):true) &&
		(item.meta.requireDEF?this.def>=Number(item.meta.requireDEF):true) &&
		(item.meta.requireMAT?this.mat>=Number(item.meta.requireMAT):true) &&
		(item.meta.requireMDF?this.mdf>=Number(item.meta.requireMDF):true) &&
		(item.meta.requireAGI?this.mdf>=Number(item.meta.requireAGI):true) &&
		(item.meta.requireLUK?this.luk>=Number(item.meta.requireLUK):true) &&
		(item.meta.requireHP?this.mhp>=Number(item.meta.requireHP):true) &&
		(item.meta.requireMP?this.mmp>=Number(item.meta.requireMP):true)
	)
};

Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    const wtypeId1 = skill.requiredWtypeId1;
    const wtypeId2 = skill.requiredWtypeId2;
    let skillUsable;
     if(skill.meta.requiredWtypes){
    	var wtypeIdMeta = skill.meta.requiredWtypes.split(',').map(Number);
    	if(wtypeIdMeta.indexOf($gameParty.members()[0].equips()[0].wtypeId)>-1){
    		skillUsable = true;
    	}
    }
    if (
        (wtypeId1 === 0 && wtypeId2 === 0) || skillUsable ||
        (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
        (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))
    ) {
        return true;
    } else {
        return false;
    }
   
    
};
