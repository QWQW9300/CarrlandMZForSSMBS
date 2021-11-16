
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Item Shortcut
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 物品、技能快捷栏
 * @author 神仙狼
 *
 * @help SSMBS_ItemShortcut.js
 *
 * 变量1~9必须预留不可使用。
 *
 * @param 透明度变量ID
 * @type Number
 * @desc 透明度变量ID
 * @default 20
 *
 * @param 快捷栏最大数量
 * @type Number
 * @desc 快捷栏最大数量
 * @default 9
 *
 * @param 快捷栏X坐标调整
 * @type Number
 * @desc 快捷栏X坐标调整
 * @default 0
 *
 * @param 快捷栏Y坐标调整
 * @type Number
 * @desc 快捷栏X坐标调整
 * @default -4
 *
 * @param 属性介绍宽度
 * @type Number
 * @desc 属性介绍宽度
 * @default 192
 *
 * @param 是否开启角色血槽
 * @type Number
 * @desc 是否开启角色血槽，1为打开，0为关闭
 * @default 1
 * 
 */


var sxlSimpleShortcut = sxlSimpleShortcut || {};
sxlSimpleShortcut.parameters = PluginManager.parameters('SSMBS_ItemShortcut');
sxlSimpleShortcut.quantity =  Number(sxlSimpleShortcut.parameters['快捷栏最大数量'] || 9);
sxlSimpleShortcut.commonCooldown = 60;
sxlSimpleShortcut.opacityVarID = Number(sxlSimpleShortcut.parameters['透明度变量ID'] || 20);
sxlSimpleShortcut.gaugeSwitch = Number(sxlSimpleShortcut.parameters['是否开启角色血槽'] || 1);
sxlSimpleShortcut.gaugeXoffset = Number(sxlSimpleShortcut.parameters['快捷栏X坐标调整'] || 0);
sxlSimpleShortcut.gaugeYoffset = Number(sxlSimpleShortcut.parameters['快捷栏Y坐标调整'] || -4);
var wordWidth = Number(sxlSimpleShortcut.parameters['属性介绍宽度'] || 192);

const _sxlSimpleShortcut_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_sxlSimpleShortcut_mapLoad.call(this);
	if(!this.shortcutBackArray){
		this.shortcutBackArray = [];
	};
	if(!this.shorcutItem){
		this.shorcutItem = []
	};
	if(!this.shorcutItemQuantity){
		this.shorcutItemQuantity = [];
		
	};
	if(!this.shorcutCooldownArray){
		this.shorcutCooldownArray = [];
	};
	if(!this.rightClickIconArray){
		this.rightClickIconArray = [];
	};

	this.createShorcuts();
	this.refreshShortcutItem();
	if(sxlSimpleShortcut.gaugeSwitch==1) this.createPlayerGauge();
	
};

const _sxlSimpleShortcut_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlSimpleShortcut_mapUpdate.call(this);
	for ( i = 0 ; i < sxlSimpleShortcut.quantity ; i ++ ){
		if(!this.shorcutItem[i]){
			this.shorcutItem[i] = new Sprite();
		}
		
		if($gameVariables.value(i+1).itypeId){
			var convertToData = $dataItems[$gameVariables.value(i+1).id];
		}else if($gameVariables.value(i+1).wtypeId){
			var convertToData = $dataWeapons[$gameVariables.value(i+1).id];
		}else if($gameVariables.value(i+1).atypeId){
			var convertToData = $dataArmors[$gameVariables.value(i+1).id];
		}else{
			var convertToData = $dataSkills[$gameVariables.value(i+1).id];
		}
		this.shorcutItem[i].item = convertToData;
		
		
		if( $gameVariables.value(i+1) != 0 ){
 			$gameVariables.setValue(i+1,convertToData)
		}else{
			this.shorcutItem[i].item = $dataItems[2];
		};
	};
	this.refreshCd();
	this.keyUseShortCut();
	this.rightClickShortcut();
	this.castSCItem();
	this.refreshShortcutItem();
};



Scene_Map.prototype.castSCItem = function(){
	if( $gameParty.members()[0].scSkillCast && $gamePlayer._waitTime<1){
		$gamePlayer.skillCast = 0;
		$gamePlayer.waitForCast = 0;
		if($gameParty.members()[0].scSkillCast.mpCost){
			$gameParty.members()[0]._mp -= $gameParty.members()[0].scSkillCast.mpCost;
		}
		if($gameParty.members()[1]){
			var userTarget = Input.isPressed( 'shift' )?
							 $gameParty.members()[1] :$gameParty.members()[0];
		}else{
			var userTarget = $gameParty.members()[0];
		}
		var userChar = userTarget.player;
		var animation = $gameParty.members()[0].scSkillCast.animationId;
		let itemAction = new Game_Action( userTarget );
		

		if( $gameParty.members()[0].scSkillCast.itypeId){
			itemAction.setItem( $gameParty.members()[0].scSkillCast.id );
			//挂钩快捷物品栏CD和物品栏CD
			$dataItems[$gameParty.members()[0].scSkillCast.id].nowCD = $dataItems[$gameParty.members()[0].scSkillCast.id].meta.cooldown;
		}
		if( $gameParty.members()[0].scSkillCast.stypeId){
			itemAction.setSkill( $gameParty.members()[0].scSkillCast.id );

		}	
		// console.log(itemAction)
		var animationTarget = [];
		if( $gameParty.members()[0].scSkillCast.itypeId||$gameParty.members()[0].scSkillCast.stypeId){
			for(effect of $gameParty.members()[0].scSkillCast.effects){
				if(effect.code==44){
					$gameTemp.reserveCommonEvent(effect.dataId);
				}
			}
		}
		if( itemAction.isForOpponent() ){
			if(true){
				var userObj = $gameParty.members()[0].scSkillCast.stypeId?
						 	  $dataSkills[$gameParty.members()[0].scSkillCast.id]:$dataItems[$gameParty.members()[0].scSkillCast.id];
				var skillDistance = userObj.meta.distance?
									Number(userObj.meta.distance+$gameParty.members()[0].cnt * 100 + 1):$gameParty.members()[0].cnt * 100 + 1;
			}
			if(sxlSimpleABS.target){
				var distanceX = Math.abs($gamePlayer.x-sxlSimpleABS.target.x);
				var distanceY = Math.abs($gamePlayer.y-sxlSimpleABS.target.y);
			}
			if( sxlSimpleABS.target &&
				distanceX <= skillDistance &&
				distanceY <= skillDistance &&
				$gameParty.members()[0]._mp >= userObj.mpCost &&
				sxlSimpleABS.target ._battler && sxlSimpleABS.target ._battler._hp > 0 ){
				var targetE = sxlSimpleABS.target;
			}
			if(userObj.meta.noTarget){
				this.triggerSkillInstantNotarget($gamePlayer,$gameParty.members()[0],userObj)

				sxlSimpleABS.target = null
				if($gameParty.members()[0].scSkillCast.consumable) $gameParty.consumeItem($gameParty.members()[0].scSkillCast);
				if($gameParty.numItems($gameParty.members()[0].scSkillCast)<1)  $gameVariables.setValue(Number($gameParty.members()[0].scSkillCast.scId)+1,$dataItems[2]);
			}else if(targetE){
				this.triggerSkill($gamePlayer,$gameParty.members()[0],targetE,targetE._battler,userObj)

				if($gameParty.members()[0].scSkillCast.consumable) $gameParty.consumeItem($gameParty.members()[0].scSkillCast);
				if($gameParty.numItems($gameParty.members()[0].scSkillCast)<1)  $gameVariables.setValue(Number($gameParty.members()[0].scSkillCast.scId)+1,$dataItems[2]);
				sxlSimpleABS.target = null;
			}
		}else{
			if( itemAction.isForUser()){
				userTarget = $gameParty.members()[0];
			}
			
			if( itemAction.isForAll() ){
				for( k in $gameParty.members() ){
					var userTarget =  $gameParty.members()[k];
					var userChar = userTarget.player;
					animationTarget.push( userChar );
					if( itemAction.isForAliveFriend() ){
						if( !userTarget.isStateAffected(1) && userTarget._hp > 0 ){
							itemAction.apply( userTarget );
							if($gameParty.members()[0].scSkillCast.consumable) $gameParty.consumeItem($gameParty.members()[0].scSkillCast);
							if($gameParty.numItems($gameParty.members()[0].scSkillCast)<1)  $gameVariables.setValue(Number($gameParty.members()[0].scSkillCast.scId)+1,$dataItems[2]);
							
						}
					}else if( itemAction.isForDeadFriend() ){
						if( userTarget.isStateAffected(1) || userTarget._hp <= 0 ){
							itemAction.apply( userTarget );
							if($gameParty.members()[0].scSkillCast.consumable) $gameParty.consumeItem($gameParty.members()[0].scSkillCast);
							if($gameParty.numItems($gameParty.members()[0].scSkillCast)<1)  $gameVariables.setValue(Number($gameParty.members()[0].scSkillCast.scId)+1,$dataItems[2]);
						}
					}
				}
			}else{
				if( itemAction.isForAliveFriend() ){
					if( !userTarget.isStateAffected(1) && userTarget._hp > 0 ){
						itemAction.apply( userTarget );
						animationTarget.push( userChar );
						if($gameParty.members()[0].scSkillCast.consumable) $gameParty.consumeItem($gameParty.members()[0].scSkillCast);
						if($gameParty.numItems($gameParty.members()[0].scSkillCast)<1)  $gameVariables.setValue(Number($gameParty.members()[0].scSkillCast.scId)+1,$dataItems[2]);
					}
				}
				if( itemAction.isForDeadFriend() ){
					if( userTarget.isStateAffected(1) || userTarget._hp <= 0 ){
						itemAction.apply( userTarget );
						animationTarget.push( userChar );
						if($gameParty.members()[0].scSkillCast.consumable) $gameParty.consumeItem($gameParty.members()[0].scSkillCast);
						if($gameParty.numItems($gameParty.members()[0].scSkillCast)<1)  $gameVariables.setValue(Number($gameParty.members()[0].scSkillCast.scId)+1,$dataItems[2]);
					}
				}
			}	
		}
		
		var result = userTarget._result;
		var hpDamageNumber = result.hpDamage
		var mpDamageNumber = result.mpDamage
		if(result.hpDamage>0){
			this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,0);
		}
		if(result.mpDamage>0){
			this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,16);
		}
		if(result.hpDamage<0){
			this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,24);
		}
		if(result.mpDamage<0){
			this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,16);
		}
		$gameTemp.requestAnimation( animationTarget, animation, false );
		$gameParty.members()[0].scSkillCast = null;
	}
};

Scene_Map.prototype.createShorcuts = function(){
	for( i = 0 ; i < sxlSimpleShortcut.quantity ; i ++ ){
		if(!this.shortcutBackArray[i]){
			this.createShorcutBackground(i);
		}
		
	};
};

Scene_Map.prototype.refreshCd = function(){
	if( $gameVariables.value(sxlSimpleShortcut.opacityVarID) > 0 ){
		for( i in this.shorcutItem ){		
			if( this.shorcutItem[i].cd <= 0){
				this.shorcutItem[i].opacity += 15;
				// if(this.shorcutItemQuantity[i].opacity < 180){
				// 	this.shorcutItemQuantity[i].opacity += 15
				// }
				this.shorcutItem[i].cd = 0;
			}else if( this.shorcutItem[i].cd > 0 ){
				this.shorcutItem[i].opacity = 100;
				// this.shorcutItemQuantity[i].opacity = 15;
				this.shorcutItem[i].cd --;
			}
			
		}
	}
};


Scene_Map.prototype.createShorcutBackground = function(arrayId){
	var yOffset = sxlSimpleShortcut.gaugeYoffset;
	this.shortBackBackground = new Sprite( new Bitmap( 36, 36 ) );
	// this.shortBackBackground.x = Graphics.width - (sxlSimpleShortcut.quantity - arrayId) * 38 -24;
	this.shortBackBackground.x = Graphics.width/2 - ((sxlSimpleShortcut.quantity - arrayId) * 38 - 24) + sxlSimpleShortcut.quantity *32 / 2 + 4;
	this.shortBackBackground.y = yOffset + Graphics.height - 12 - 38;

	this.shortBackBackground.bitmap.fillRect( 0, 0, 36, 36, '#000000' );
	this.shortBackBackground.bitmap.drawText( arrayId+1, 0, 0, 36, 36,'center' );
	this.shortBackBackground.opacity = 128;
	this.addChildAt(this.shortBackBackground,2);
	this.shortcutBackArray.push(this.shortBackBackground);
};

Scene_Map.prototype.createPlayerGauge = function(){

	//创建角色状态
	var yOffset = sxlSimpleShortcut.gaugeYoffset;
	this.playerGauge = new Sprite( new Bitmap( (sxlSimpleShortcut.quantity) * (32+6), 256 ) );
	this.playerGauge.x = sxlSimpleShortcut.gaugeXoffset + Graphics.width/2 - ((sxlSimpleShortcut.quantity) * 38 - 24) + sxlSimpleShortcut.quantity *32 / 2 + 4;
	this.playerGauge.y = yOffset + Graphics.height - 12 - 38 - 36;
	this.playerGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	// this.playerGauge.bitmap.drawText( arrayId+1, 0, 0, 36, 36,'center' );
	
	this.addChildAt(this.playerGauge,2);

	//创建角色状态背景
	this.playerGaugeBackground = new Sprite( );
	this.playerGaugeBackground.bitmap = ImageManager.loadSystem( 'playerGaugeBackground' )
	this.playerGaugeBackground.x = 0 ;
	this.playerGaugeBackground.y = 0 ;
	this.addChildAt(this.playerGaugeBackground,2);

	//创建各种按钮
	var line = 0 ;
	var lineHeight = 26;
	this.itemButton = new Sprite( );
	this.itemButton.bitmap = ImageManager.loadSystem( 'buttonItem' )
	this.itemButton.x = this.playerGauge.x + 360 ;
	this.itemButton.y = this.playerGauge.y - 12;
	this.addChildAt(this.itemButton,2);
	line ++;

	this.skillButton = new Sprite( );
	this.skillButton.bitmap = ImageManager.loadSystem( 'buttonSkills' )
	this.skillButton.x = this.itemButton.x;
	this.skillButton.y = this.itemButton.y + line*lineHeight;
	this.addChildAt(this.skillButton,2);
	line ++;

	this.questButton = new Sprite( );
	this.questButton.bitmap = ImageManager.loadSystem( 'buttonQuest' )
	this.questButton.x = this.itemButton.x;
	this.questButton.y = this.itemButton.y + line*lineHeight;
	this.addChildAt(this.questButton,2);
	line ++;

	this.optionButton = new Sprite( );
	this.optionButton.bitmap = ImageManager.loadSystem( 'buttonOption' )
	this.optionButton.x = this.itemButton.x;
	this.optionButton.y = this.itemButton.y + line*lineHeight;
	this.addChildAt(this.optionButton,2);

	

	this.hintMouse = new Sprite( new Bitmap( wordWidth, 256 ) );
	this.hintMouse.bitmap.fontSize = 12;
	this.hintMouse.bitmap.fontFace = $gameSystem.mainFontFace();
	this.addChildAt(this.hintMouse,2);

	this.hintMouseBackground = new Sprite( new Bitmap( wordWidth, 256 ) );
	this.hintMouseBackground.opacity = 255;
	this.addChildAt(this.hintMouseBackground,2);


	//创建状态图标
	this.stateIconArray = [];
	this.stateIconStayTimeArray = [];



	for ( i = 0 ; i < 18 ; i ++ ){

		this.stateIconStayTime = new Sprite(new Bitmap(24,24));
		this.stateIconStayTime.bitmap.fontSize = 12;
		this.stateIconStayTime.bitmap.fontFace = $gameSystem.mainFontFace();
		this.addChildAt(this.stateIconStayTime,2);
		this.stateIconStayTimeArray.push(this.stateIconStayTime);


		this.stateIcon = new Sprite();
		this.stateIcon.bitmap = ImageManager.loadSystem("IconSet");
		this.stateIcon.x = this.playerGauge.x + i * (24 + 3)
		this.stateIcon.y = this.playerGauge.y - 36;
		this.stateIcon.scale.x = 0.75;
		this.stateIcon.scale.y = 0.75;
		this.stateIcon.icon = 0 
		// this.stateIcon.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,31,31);
		this.stateIcon.setFrame(0,0,32,32);
		this.addChildAt(this.stateIcon,2);
		this.stateIconArray.push(this.stateIcon);

		this.stateIconStayTime.x = this.stateIcon.x;
		this.stateIconStayTime.y = this.stateIcon.y;
		
	}
};


Scene_Map.prototype.refreshShortcutItem = function(){
	if(this.playerGauge){
		//更新状态图标
		
		this.hintMouse.bitmap.clear();
		this.hintMouseBackground.bitmap.clear();
		this.hintMouseBackground.x = 0;
		this.hintMouseBackground.y = 0;

		if($gameParty.members()[0].states().length == 0 ){
			for(clearState of $gameParty.members()[0].states() ){
				clearState.shown = false;
			}
			for(clearStateSprite of this.stateIconArray ){
				clearStateSprite.icon = 0;
				clearStateSprite.state = 0;
			}
		}

		for ( i in $gameParty.members()[0].states() ){
			if($gameParty.members()[0]._stateTurns[$gameParty.members()[0].states()[i].id]<=1){
				for(clearState of $gameParty.members()[0].states() ){
					clearState.shown = false;
				}
				for(clearStateSprite of this.stateIconArray ){
					clearStateSprite.icon = 0;
					clearStateSprite.state = 0;
				}
			}
		}

		for ( i in $gameParty.members()[0].states() ){
			if($gameParty.members()[0].states()[i] && !$gameParty.members()[0].states()[i].meta.hide){
				for( let j = 0 ; j < this.stateIconArray.length ; j ++ ){
					if( this.stateIconArray[j].icon == 0 && !$gameParty.members()[0].states()[i].shown){
						this.stateIconArray[j].icon = $gameParty.members()[0].states()[i].iconIndex;
						this.stateIconArray[j].state =  $gameParty.members()[0].states()[i].id;
						$gameParty.members()[0].states()[i].shown = true;
					}
				}
			}
			
			
		}
		for( let j = 0 ; j < this.stateIconArray.length ; j ++  ){
			this.stateIconStayTimeArray[j].bitmap.clear();
			if(this.stateIconArray[j].state && $gameParty.members()[0]._stateTurns[this.stateIconArray[j].state]>1){
				var stateTime = Math.floor($gameParty.members()[0]._stateTurns[this.stateIconArray[j].state]/60*10)/10;
				this.stateIconStayTimeArray[j].bitmap.drawText(stateTime,0,0,24,24,'center');
			}
		}
		for(i = 0 ; i < this.stateIconArray.length ; i ++ ){
			this.stateIconArray[i].setFrame(this.stateIconArray[i].icon % 16*32,Math.floor(this.stateIconArray[i].icon / 16)*32,32,32);
			if( $dataStates[this.stateIconArray[i].state] &&
				TouchInput.x > this.stateIconArray[i].x && TouchInput.x < this.stateIconArray[i]._bounds.maxX &&
				TouchInput.y > this.stateIconArray[i].y && TouchInput.y < this.stateIconArray[i]._bounds.maxY){
				var line = 0;
				var lineHeight = 18;
				this.hintMouse.x = this.stateIconArray[i].x-wordWidth/2+(32*0.75/2);
				if($dataStates[this.stateIconArray[i].state].meta.textColor) this.hintMouse.bitmap.textColor = ColorManager.textColor($dataStates[this.stateIconArray[i].state].meta.textColor);
				
				this.hintMouse.bitmap.fontSize = 14;
				this.hintMouse.bitmap.fontBold = true;
				this.hintMouse.bitmap.drawText( '【 '+$dataStates[this.stateIconArray[i].state].name+' 】',0,0,wordWidth,24,'center' );
				this.hintMouse.bitmap.fontSize = 12;
				this.hintMouse.bitmap.fontBold = false;
				this.hintMouse.bitmap.textColor = ColorManager.textColor(0);
				line ++;
				if($dataStates[this.stateIconArray[i].state].meta.desc){
					for(desc of $dataStates[this.stateIconArray[i].state].meta.desc.split('/NL')){
						this.hintMouse.bitmap.drawText( desc,0,line*lineHeight,wordWidth,24,'center' );
						line ++;
					}
				}
				this.hintMouse.y = this.stateIconArray[i].y-line*lineHeight-12;
				this.hintMouseBackground.bitmap.fillRect(0,0,wordWidth,(line)*lineHeight+lineHeight/2,'#000000');
				break;
			}
		}

		// 更新各种按钮
		
		if( TouchInput.x > this.itemButton.x && TouchInput.x < this.itemButton._bounds.maxX &&
			TouchInput.y > this.itemButton.y && TouchInput.y < this.itemButton._bounds.maxY ){
			$gameParty.members()[0]._tp = 0;
			this.hintMouse.x = this.itemButton.x + 28;
			this.hintMouse.y = this.itemButton.y;
			this.hintMouse.bitmap.drawText( ' 物品栏( '+sxlSimpleItemList.triggerButton.toUpperCase()+' )',0,0,wordWidth,24,'left' )
			if( TouchInput.isClicked() ){
				if(   sxlSimpleItemList.itemShow == true ){

					// SoundManager.playCursor();
					// this.isHandledItem = null;
					// sxlSimpleItemList.itemShow = false;
					// sxlSimpleItemList.canMove = true;
				}else{
					SoundManager.playCursor();
					this.isHandledItem = null;
					sxlSimpleItemList.itemShow = true;
					sxlSimpleItemList.canMove = true;
					this._active = true;
					this.createBackbag();
					this.createEquips();
					this.createItems();
					for(i = 0 ; i < this.itemArray.length ; i ++){
						this.itemArray[i].bitmap.retry();
					};
					this.createBackbag();
					this.createEquips();
					this.createItems();
				};
			};
			
		};

		if( TouchInput.x > this.skillButton.x && TouchInput.x < this.skillButton._bounds.maxX &&
			TouchInput.y > this.skillButton.y && TouchInput.y < this.skillButton._bounds.maxY ){
			$gameParty.members()[0]._tp = 0;
			this.hintMouse.x = this.skillButton.x + 28;
			this.hintMouse.y = this.skillButton.y;
			this.hintMouse.bitmap.drawText( ' 技能栏( '+sxlSkillWindow.hotKey.toUpperCase()+' )',0,0,wordWidth,24,'left' )
			if( TouchInput.isClicked() ){
				SoundManager.playCursor();
				if(this.openSkillWindow == true){

					// this.skillWindowSaveX = this.skillWindow.x;
					// this.skillWindowSaveY = this.skillWindow.y;
					// this.skillWindow.x = 999999;
					// this.skillWindow.y = 999999;
					// this.openSkillWindow = false;
				}else{
					if(this.skillWindow){
						this.skillWindow.x = this.skillWindowSaveX;
						this.skillWindow.y = this.skillWindowSaveY;
					};
					this.openSkillWindow = true;
				}
			};
		};

		if( TouchInput.x > this.questButton.x && TouchInput.x < this.questButton._bounds.maxX &&
			TouchInput.y > this.questButton.y && TouchInput.y < this.questButton._bounds.maxY ){
			$gameParty.members()[0]._tp = 0;
			this.hintMouse.x = this.questButton.x + 28;
			this.hintMouse.y = this.questButton.y;
			this.hintMouse.bitmap.drawText( ' 任务栏( '+ simpleQuest.hotKey.toUpperCase()+' )',0,0,wordWidth,24,'left' )
			if( TouchInput.isClicked() ){
				SoundManager.playCursor();
				if( !this.openQuestWIndow ){
					this.openQuestWIndow = true ;
					if(this.background){
						this.background.x = this.questWindowSaveX ;
						this.background.y = this.questWindowSaveY ;
					}
				}else{
					// this.openQuestWIndow = false ;
					// this.background.x = 999999;
					// this.background.y = 999999;
				}
			}
		};

		if( TouchInput.x > this.optionButton.x && TouchInput.x < this.optionButton._bounds.maxX &&
			TouchInput.y > this.optionButton.y && TouchInput.y < this.optionButton._bounds.maxY ){
			$gameParty.members()[0]._tp = 0;
			this.hintMouse.x = this.optionButton.x + 28;
			this.hintMouse.y = this.optionButton.y;
			this.hintMouse.bitmap.drawText( ' 系统设置',0,0,wordWidth,24,'left' )
			if( TouchInput.isClicked() ){
				SoundManager.playCursor();
				SceneManager.push(Scene_Options);
			}
		};

		this.hintMouseBackground.x = this.hintMouse.x;
		this.hintMouseBackground.y = this.hintMouse.y;
		this.hintMouseBackground.opacity = 192;

		// 更新角色属性
		this.playerGauge.bitmap.clear();
		var pGaugeOffsetY = 2 ;
		var hpWidth = (sxlSimpleShortcut.quantity) * (32+6)/2-2;
		var heightBetween = 2;
		var hpHeight = 18;
		var expWidth = ((sxlSimpleShortcut.quantity) * (32+6)-2);
		var expHeight = 6;
		this.playerGauge.bitmap.fontSize = 12;

		//背景色
		//
		//hp
		this.playerGauge.bitmap.fillRect( 0, pGaugeOffsetY+24-hpHeight, hpWidth, hpHeight, '#888888' );
		// mp
		this.playerGauge.bitmap.fillRect( hpWidth+2, pGaugeOffsetY+24-hpHeight, hpWidth, hpHeight, '#888888' );
		// exp
		this.playerGauge.bitmap.fillRect( 0, pGaugeOffsetY+hpHeight+heightBetween+expHeight, expWidth, expHeight, '#888888' );

		//血条
		var rateHP =  $gameParty.members()[0]._hp/$gameParty.members()[0].mhp;
		var rateMP =  $gameParty.members()[0]._mp/$gameParty.members()[0].mmp;
		var rateExp = $gameParty.members()[0]._exp[$gameParty.members()[0]._classId] /$gameParty.members()[0].expForLevel( $gameParty.members()[0]._level + 1 )
		//hp
		this.playerGauge.bitmap.fillRect( 0, pGaugeOffsetY+24-hpHeight, (hpWidth) * rateHP   , hpHeight, '#7FFFAA' );
		this.playerGauge.bitmap.drawText( Math.floor($gameParty.members()[0]._hp)+'/'+$gameParty.members()[0].mhp,0,pGaugeOffsetY+24-hpHeight,hpWidth,hpHeight,'center' );
		// mp
		this.playerGauge.bitmap.fillRect( hpWidth+2, pGaugeOffsetY+24-hpHeight, (hpWidth)*rateMP, hpHeight, '#1E90FF' );
		this.playerGauge.bitmap.drawText( Math.floor($gameParty.members()[0]._mp)+'/'+$gameParty.members()[0].mmp,hpWidth+2,pGaugeOffsetY+24-hpHeight,hpWidth,hpHeight,'center' );
		// exp
		this.playerGauge.bitmap.fillRect( 0, pGaugeOffsetY+hpHeight+heightBetween+expHeight, (expWidth)*rateExp, expHeight, '#ffffff' );
		if( TouchInput.x>this.playerGauge.x&&TouchInput.x<this.playerGauge.x+expWidth &&
			TouchInput.y>this.playerGauge.y&&TouchInput.y<this.playerGauge.y+48 ){
			this.playerGauge.bitmap.fontSize = 12;
			this.playerGauge.bitmap.drawText( TextManager.level+$gameParty.members()[0].level+'  '+TextManager.exp+': '+
				Math.floor($gameParty.members()[0]._exp[$gameParty.members()[0]._classId]) +'/'+ $gameParty.members()[0].expForLevel( $gameParty.members()[0]._level + 1 )+
				' ( '+Math.floor(rateExp*100)+'% )',
				/*x*/0,/*y*/pGaugeOffsetY+hpHeight+heightBetween+expHeight-2, 
				/*width*/expWidth,/*height*/expHeight,
				'center' );
		}

		if($gameVariables.value(sxlSimpleShortcut.opacityVarID) > 0) {
			this.playerGauge.opacity = 192;
			this.playerGaugeBackground.opacity = 255;
			this.itemButton.opacity = 255;
			this.skillButton.opacity = 255;
			this.questButton.opacity = 255;
			this.optionButton.opacity = 255;
			this.hintMouse.opacity = 255;
		}else{
			this.playerGauge.opacity = 0;
			this.playerGaugeBackground.opacity = 0;
			this.itemButton.opacity = 0;
			this.skillButton.opacity = 0;
			this.questButton.opacity = 0;
			this.optionButton.opacity = 0;
			this.hintMouse.opacity = 0;
		}

	}
	
	//	更新快捷技能/物品

	for( i = 0 ; i < sxlSimpleShortcut.quantity ; i ++ ){
		
		if($gameVariables.value(sxlSimpleShortcut.opacityVarID)>0) this.shortcutBackArray[i].opacity = $gameVariables.value(sxlSimpleShortcut.opacityVarID)/2;
		if( this.shorcutItem[i] ){
			if($gameVariables.value(sxlSimpleShortcut.opacityVarID)<=0){
				this.shorcutItem[i].opacity = $gameVariables.value(sxlSimpleShortcut.opacityVarID);
			}
			if( $gameVariables.value(i+1)!=0 ){
				this.shorcutItem[i].item = $gameVariables.value(i+1);	
			}else{
				this.shorcutItem[i].item = $dataItems[2];	
			}
			let iconSet = this.shorcutItem[i].item.iconIndex;
			this.shorcutItem[i].item.shortCutNumber = i ;
			this.shorcutItem[i].bitmap = ImageManager.loadSystem( 'IconSet' );
			this.shorcutItem[i].setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
			this.shorcutItem[i].x = this.shortcutBackArray[i].x + 2;
			this.shorcutItem[i].y = this.shortcutBackArray[i].y + 2;
			this.shorcutItem[i].anchor.x = 0;
			this.shorcutItem[i].anchor.y = 0;
			this.shorcutItem[i].setCd = this.shorcutItem[i].item.meta.cooldown?Number(this.shorcutItem[i].item.meta.cooldown):30;

			if(!this.shorcutItem[i].cd){
				this.shorcutItem[i].cd = 0;
			}
			this.addChild(this.shorcutItem[i]);
			if(!this.shorcutItem[i].cdWord){
				this.shorcutItem[i].cdWord = new Sprite(new Bitmap(32,32));
				
			}else{
				this.shorcutItem[i].cdWord.bitmap.clear();
				if(this.shorcutItem[i].cd!=0){
					this.shorcutItem[i].cdWord.bitmap.drawText(Math.floor(this.shorcutItem[i].cd/60*10)/10,0,0,32,32,'center');
				}
				this.shorcutItem[i].cdWord.x = this.shorcutItem[i].x;
				this.shorcutItem[i].cdWord.y = this.shorcutItem[i].y;
			}
			
			
			if( !this.shorcutItemQuantity[i] ){
				this.shorcutItemQuantity[i] = new Sprite( new Bitmap(32,32) )
			}else{
				this.shorcutItemQuantity[i].bitmap.clear();
				this.removeChild(this.shorcutItemQuantity[i]);
			}
			this.shorcutItemQuantity[i].x = this.shorcutItem[i].x;
			this.shorcutItemQuantity[i].y = this.shorcutItem[i].y;

			if(  $gameVariables.value(i+1)!= 0 && !this.shorcutItem[i].item.meta.hide){
				if($gameVariables.value(i+1).itypeId){
					var type = 'item';
					var quantity = $dataItems[$gameVariables.value(i+1).id];
				}else if($gameVariables.value(i+1).wtypeId){
					var type = 'item';
					var quantity = $dataWeapons[$gameVariables.value(i+1).id];
				}else if($gameVariables.value(i+1).atypeId){
					var type = 'item';
					var quantity = $dataArmors[$gameVariables.value(i+1).id];
				}else if($gameVariables.value(i+1).mpCost){
					var type = 'skillMp';
					var quantity = $dataSkills[$gameVariables.value(i+1).id].mpCost*$gameParty.members()[0].mcr;
				}
				this.shorcutItemQuantity[i].opacity = 255;
				this.shorcutItemQuantity[i].bitmap.fontSize = 12;
				this.shorcutItemQuantity[i].bitmap.textColor = '#ffffff';
				this.shorcutItemQuantity[i].bitmap.drawText( i+1,0,-8,32,32,'left' )
				if(type == 'item'){
					this.shorcutItemQuantity[i].bitmap.textColor = '#ffffff';
					this.shorcutItemQuantity[i].bitmap.drawText( '×' + $gameParty.numItems(quantity),0,8,32,32,'right' );	
				}else if (type == 'skillMp'){
					this.shorcutItemQuantity[i].bitmap.textColor =  ColorManager.textColor(4);
					this.shorcutItemQuantity[i].bitmap.drawText( quantity,0,8,32,32,'right' );	
				}
			}
			this.addChild(this.shorcutItemQuantity[i]);
			
			this.addChild(this.shorcutItem[i].cdWord );
			
			if(!this.rightClickIconArray[i]){
				this.rightMousrIcon = new Sprite();
				this.rightMousrIcon.bitmap = ImageManager.loadSystem('mouseRight');
				this.rightMousrIcon.opacity = 0;
				this.rightMousrIcon.x = this.shortcutBackArray[i].x+2;
				this.rightMousrIcon.y = this.shortcutBackArray[i].y+2;
				this.rightClickIconArray.push(this.rightMousrIcon)
				
			}
			
			this.addChild(this.rightClickIconArray[i]);
		}else{
			this.removeChild(this.shorcutItem[i]);
			this.removeChild(this.shorcutItemQuantity[i]);
			this.shorcutItem.splice(i,1);
		};

	};

};

Scene_Map.prototype.useSCItem = function(scitem){

	if(scitem.item.mpCost){
		var needMp = scitem.item.mpCost * $gameParty.members()[0].mcr;
	}
	if(scitem.item.itypeId && !DataManager.isItem(scitem.item)){
		scitem.item = $dataItems[scitem.item.id];
	}
	if(scitem.item.stypeId && !DataManager.isSkill(scitem.item)){
		scitem.item = $dataSkills[scitem.item.id];
	}
	$gamePlayer.delaySkill = [];

	if( scitem &&
		scitem.item && 
		scitem.item.etypeId && 
		!scitem.item.meta.hide){
		if(scitem.item.itypeId){
			var convertToData = $dataItems[scitem.item.id];
		}else if(scitem.item.wtypeId){
			var convertToData = $dataWeapons[scitem.item.id];
		}else if(scitem.item.atypeId){
			var convertToData = $dataArmors[scitem.item.id];
		}else if(scitem.item.stypeId){
			var convertToData = $dataSkills[scitem.item.id];
		}
		var userTarget = $gameParty.members()[0];
		if( userTarget.canEquip( convertToData ) ){
			var changedEquipKey = userTarget.equips()[scitem.item.etypeId - 1];
			userTarget.changeEquip( scitem.item.etypeId - 1 , convertToData )
			SoundManager.playEquip();
			if(  !(changedEquipKey && changedEquipKey.meta.hide && $gameParty.numItems(scitem.item) > 0) ){
				if(changedEquipKey.itypeId){
					var convertToData = $dataItems[changedEquipKey.id];
				}else if(changedEquipKey.wtypeId){
					var convertToData = $dataWeapons[changedEquipKey.id];
				}else if(changedEquipKey.atypeId){
					var convertToData = $dataArmors[changedEquipKey.id];
				}else if(DataManager.isSkill(changedEquipKey) ){
					var convertToData = $dataSkills[changedEquipKey.id];
				}
				$gameVariables.setValue(Number(this.rightClickSkill.scId)+1,convertToData);


			};
			if(  sxlSimpleItemList.itemShow == true  ){
				this.createBackbag();
				this.createEquips();
			};
			this.refreshShortcutItem();
		};

	}else if(scitem && scitem.item &&  
		 (scitem.item.itypeId || scitem.item.mpCost) && 
		 !scitem.item.meta.hide && 
		  scitem.cd <= 0 &&
		  (($gamePlayer.isAttack<=0 && $gamePlayer._waitTime<=1)  || scitem.item.meta.forced)&&
		 (!scitem.item.stypeId?
	 	$gameParty.numItems( scitem.item )>0
	 	:$gameParty.members()[0]._mp>=needMp) && 
		 (scitem.item.stypeId ? $gameParty.members()[0].isSkillWtypeOk($dataSkills[scitem.item.id]) : true ) && //判定武器是否符合技能要求
		 (!$gamePlayer.delaySkill || $gamePlayer.delaySkill.length == 0 )//没有后续技能才可使用
		 ){

		if( scitem.item.meta.cast&&scitem.cd <= 0&&$gameParty.members()[0]._mp>=needMp) {
			$gameParty.members()[0].scSkillCast = scitem.item;
			$gamePlayer.skillCast = Number(scitem.item.meta.cast);
			$gamePlayer.waitForCast = $gameParty.members()[0].castSpeed*Number(scitem.item.meta.cast);
			$gamePlayer._waitTime = $gamePlayer.waitForCast;
			let castAnim = this.shorcutItem[i].item.meta.castAnim?this.shorcutItem[i].item.meta.castAnim:0;
			$gameTemp.requestAnimation( [$gamePlayer] , castAnim , false )
			this.skillPose(this.shorcutItem[i].item,$gamePlayer);
		}
		scitem.cd = scitem.setCd;
		if( $gamePlayer._waitTime<1){
			if(scitem&&scitem.item.mpCost){
				$gameParty.members()[0]._mp -= needMp;
			}
			if($gameParty.members()[1]){
				var userTarget = Input.isPressed( 'shift' )?
								 $gameParty.members()[1] :$gameParty.members()[0];
			}else{
				var userTarget = $gameParty.members()[0];
			}
			var userChar = userTarget.player;
			var animation = scitem.item.animationId;
			let itemAction = new Game_Action( userTarget );
			scitem.cd = scitem.setCd;
			

			if( scitem.item.itypeId){
				itemAction.setItem( scitem.item.id );
				//挂钩快捷物品栏CD和物品栏CD
				$dataItems[scitem.item.id].nowCD = $dataItems[scitem.item.id].meta.cooldown;
			}
			if( scitem.item.stypeId){
				itemAction.setSkill( scitem.item.id );

			}	
			// console.log(itemAction)
			var animationTarget = [];
					
			if( itemAction.isForOpponent() ){
				if(scitem){
					var userObj = scitem.item.stypeId?
							 	  $dataSkills[scitem.item.id]:$dataItems[scitem.item.id];
					var skillDistance = userObj.meta.distance?
										Number(userObj.meta.distance+$gameParty.members()[0].cnt * 100 + 1):$gameParty.members()[0].cnt * 100 + 1;
				}
				if(sxlSimpleABS.target){
					var distanceX = Math.abs($gamePlayer.x-sxlSimpleABS.target.x);
					var distanceY = Math.abs($gamePlayer.y-sxlSimpleABS.target.y);
				}
				if( sxlSimpleABS.target &&
					distanceX <= skillDistance &&
					distanceY <= skillDistance &&
					$gameParty.members()[0]._mp >= userObj.mpCost &&
					sxlSimpleABS.target ._battler && sxlSimpleABS.target ._battler._hp > 0 ){
					var targetE = sxlSimpleABS.target;
				}
				if(userObj.meta.noTarget){
					scitem.cd = scitem.setCd;
					this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],userObj)

					sxlSimpleABS.target = null
					if(scitem&&scitem.item.consumable) $gameParty.consumeItem(scitem.item);
					if(scitem.item.itypeId && $gameParty.numItems(scitem.item)<1) { $gameVariables.setValue(Number(this.rightClickSkill.scId)+1,$dataItems[2]);scitem.cd=0};
				}else if(targetE){
					scitem.cd = scitem.setCd;
					this.triggerSkill($gamePlayer,$gameParty.members()[0],targetE,targetE._battler,userObj)

					if(scitem&&scitem.item.consumable) $gameParty.consumeItem(scitem.item);
					if(scitem.item.itypeId && $gameParty.numItems(scitem.item)<1) { $gameVariables.setValue(Number(this.rightClickSkill.scId)+1,$dataItems[2]);scitem.cd=0};
					sxlSimpleABS.target = null;
				}
			}else{
				scitem.cd = scitem.setCd;
				if( itemAction.isForUser()){
					userTarget = $gameParty.members()[0];
				}
				
				if( itemAction.isForAll() ){
					for( k in $gameParty.members() ){
						var userTarget =  $gameParty.members()[k];
						var userChar = userTarget.player;
						animationTarget.push( userChar );
						if( itemAction.isForAliveFriend() ){
							if( !userTarget.isStateAffected(1) && userTarget._hp > 0 ){
								itemAction.apply( userTarget );
								if(scitem.item.consumable) $gameParty.consumeItem(scitem.item);
								if(scitem.item.itypeId && $gameParty.numItems(scitem.item)<1) { $gameVariables.setValue(Number(this.rightClickSkill.scId)+1,$dataItems[2]);scitem.cd=0};
								
							}
						}else if( itemAction.isForDeadFriend() ){
							if( userTarget.isStateAffected(1) || userTarget._hp <= 0 ){
								itemAction.apply( userTarget );
								if(scitem.item.consumable) $gameParty.consumeItem(scitem.item);
								if(scitem.item.itypeId && $gameParty.numItems(scitem.item)<1) { $gameVariables.setValue(Number(this.rightClickSkill.scId)+1,$dataItems[2]);scitem.cd=0};
							}
						}
					}
				}else{
					if( itemAction.isForAliveFriend() ){
						if( !userTarget.isStateAffected(1) && userTarget._hp > 0 ){
							itemAction.apply( userTarget );
							animationTarget.push( userChar );
							if(scitem.item.consumable) $gameParty.consumeItem(scitem.item);
							if(scitem.item.itypeId && $gameParty.numItems(scitem.item)<1) { $gameVariables.setValue(Number(this.rightClickSkill.scId)+1,$dataItems[2]);scitem.cd=0};
						}
					}
					if( itemAction.isForDeadFriend() ){
						if( userTarget.isStateAffected(1) || userTarget._hp <= 0 ){
							itemAction.apply( userTarget );
							animationTarget.push( userChar );
							if(scitem.item.consumable) $gameParty.consumeItem(scitem.item);
							if(scitem.item.itypeId && $gameParty.numItems(scitem.item)<1) { $gameVariables.setValue(Number(this.rightClickSkill.scId)+1,$dataItems[2]);scitem.cd=0};
						}
					}
				}
				if( scitem.item.itypeId||scitem.item.stypeId){
					for(effect of scitem.item.effects){
						if(effect.code==44){
							$gameTemp.reserveCommonEvent(effect.dataId);
						}
					}
				}
			}
			
			var result = userTarget._result;
			var hpDamageNumber = result.hpDamage
			var mpDamageNumber = result.mpDamage
			if(result.hpDamage>0){
				this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,0);
			}
			if(result.mpDamage>0){
				this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,16);
			}
			if(result.hpDamage<0){
				this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,24);
			}
			if(result.mpDamage<0){
				this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,16);
			}
			$gameTemp.requestAnimation( animationTarget, animation, false );
		}
		
	}else{
		if(scitem.item.stypeId && $gameParty.members()[0]._mp<needMp){
			this.showDamage( $gamePlayer , '魔法值不足' , 14 ,16, 'word'  )
		}
		if(scitem.cd){
			this.showDamage( $gamePlayer , '尚未冷却' , 14 ,8, 'word'  )
		}
		if(scitem.item.stypeId && !$gameParty.members()[0].isSkillWtypeOk($dataSkills[scitem.item.id])){
			this.showDamage( $gamePlayer , '所持武器无法释放' , 14 ,8, 'word'  )
		}
	}
	if( sxlSimpleItemList.itemShow ) this.createItems();
	if( sxlSimpleItemList.itemShow ) this.createEquips();
}

Scene_Map.prototype.keyUseShortCut = function(){
	for( i = 0 ; i < sxlSimpleShortcut.quantity ; i ++ ){	

		if(this.shorcutItem[i].item.mpCost){
			var needMp = this.shorcutItem[i].item.mpCost * $gameParty.members()[0].mcr;
		}
		if( i <= 9 && Input.isTriggered( String(i+1) )){
			
			if( this.shorcutItem[i] &&
				this.shorcutItem[i].item && 
				this.shorcutItem[i].item.etypeId && 
				!this.shorcutItem[i].item.meta.hide){
				$gamePlayer.delaySkill = [];
				if($gameVariables.value(i+1).itypeId){
					var convertToData = $dataItems[$gameVariables.value(i+1).id];
				}else if($gameVariables.value(i+1).wtypeId){
					var convertToData = $dataWeapons[$gameVariables.value(i+1).id];
				}else if($gameVariables.value(i+1).atypeId){
					var convertToData = $dataArmors[$gameVariables.value(i+1).id];
				}else if(DataManager.isSkill($gameVariables.value(i+1))){
					var convertToData = $dataSkills[$gameVariables.value(i+1).id];
				}
				if(Input.isPressed( 'shift' ) && $gameParty.members()[1]){
					var userTarget = $gameParty.members()[1];
				}else{
					var userTarget = $gameParty.members()[0];
				}
				if(TouchInput.isClicked()){
					this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],$gameParty.members()[0].attackSkillId());
				}
				if( userTarget.canEquip( convertToData ) ){
					var changedEquipKey = userTarget.equips()[this.shorcutItem[i].item.etypeId - 1];
					userTarget.changeEquip( this.shorcutItem[i].item.etypeId - 1 , convertToData )
					SoundManager.playEquip();
					if(  !(changedEquipKey && changedEquipKey.meta.hide && $gameParty.numItems(this.shorcutItem[i].item) > 0) ){
						if(changedEquipKey.itypeId){
							var convertToData = $dataItems[changedEquipKey.id];
						}else if(changedEquipKey.wtypeId){
							var convertToData = $dataWeapons[changedEquipKey.id];
						}else if(changedEquipKey.atypeId){
							var convertToData = $dataArmors[changedEquipKey.id];
						}else if(DataManager.isSkill(changedEquipKey) ){
							var convertToData = $dataSkills[changedEquipKey.id];
						}
						$gameVariables.setValue(i+1,convertToData);
					};
					if(  sxlSimpleItemList.itemShow == true  ){
						this.createBackbag();
						this.createEquips();
					};
					this.refreshShortcutItem();
				};

			}else if(this.shorcutItem[i] && this.shorcutItem[i].item &&  
					 (this.shorcutItem[i].item.itypeId || this.shorcutItem[i].item.mpCost) && 
					 !this.shorcutItem[i].item.meta.hide && 
					  this.shorcutItem[i].cd <= 0 &&
					  (($gamePlayer.isAttack<=0 && $gamePlayer._waitTime<=1)  || this.shorcutItem[i].item.meta.forced)&&
					 (!this.shorcutItem[i].item.stypeId?
					 	$gameParty.numItems( this.shorcutItem[i].item )>0
					 	:$gameParty.members()[0]._mp>=needMp) && 
					 (this.shorcutItem[i].item.stypeId ? $gameParty.members()[0].isSkillWtypeOk($dataSkills[this.shorcutItem[i].item.id]) : true ) && //判定武器是否符合技能要求
					(!$gamePlayer.delaySkill || $gamePlayer.delaySkill.length == 0 ) //没有后续技能才可使用
					 ){
				
				if( this.shorcutItem[i].item.meta.cast&&this.shorcutItem[i].cd <= 0&&$gameParty.members()[0]._mp>=needMp) {
					$gameParty.members()[0].scSkillCast = this.shorcutItem[i].item;
					$gamePlayer.skillCast = Number(this.shorcutItem[i].item.meta.cast);
					$gamePlayer.waitForCast = $gameParty.members()[0].castSpeed*Number(this.shorcutItem[i].item.meta.cast);
					$gamePlayer._waitTime = $gamePlayer.waitForCast;
					let castAnim = this.shorcutItem[i].item.meta.castAnim?this.shorcutItem[i].item.meta.castAnim:0;
					$gameTemp.requestAnimation( [$gamePlayer] , castAnim , false )
					this.skillPose(this.shorcutItem[i].item,$gamePlayer);
				}
				if($gamePlayer._waitTime<1){
					if($gameParty.members()[1]){
					var userTarget = Input.isPressed( 'shift' )?
										 $gameParty.members()[1] :$gameParty.members()[0];
					}else{
						var userTarget = $gameParty.members()[0];
					}
					var userChar = userTarget.player;
					var animation = this.shorcutItem[i].item.animationId;
					var itemAction = new Game_Action( userTarget );
					if( this.shorcutItem[i].item.itypeId){
						itemAction.setItem( this.shorcutItem[i].item.id );
						//挂钩快捷物品栏CD和物品栏CD
						$dataItems[this.shorcutItem[i].item.id].nowCD = $dataItems[this.shorcutItem[i].item.id].meta.cooldown;
					}
					if( DataManager.isSkill(this.shorcutItem[i].item)){
						itemAction.setSkill( this.shorcutItem[i].item.id );
					}
					var animationTarget = [];
					
					if( itemAction.isForOpponent() ){
						if(this.shorcutItem[i]){
							var userObj = this.shorcutItem[i].item.stypeId?
									 	  $dataSkills[this.shorcutItem[i].item.id]:$dataItems[this.shorcutItem[i].item.id];
							var skillDistance = userObj.meta.distance?
												Number(userObj.meta.distance+$gameParty.members()[0].cnt * 100 + 1):$gameParty.members()[0].cnt * 100 + 1;
						}
						if(sxlSimpleABS.target){
							var distanceX = Math.abs($gamePlayer.x-sxlSimpleABS.target .x);
							var distanceY = Math.abs($gamePlayer.y-sxlSimpleABS.target .y);
						}
						if( sxlSimpleABS.target &&
							distanceX <= skillDistance &&
							distanceY <= skillDistance &&
							$gameParty.members()[0]._mp >= userObj.mpCost &&
							sxlSimpleABS.target ._battler && sxlSimpleABS.target ._battler._hp > 0 ){
							var targetE = sxlSimpleABS.target;
						}
						if(userObj.meta.noTarget){
							this.shorcutItem[i].cd = this.shorcutItem[i].setCd;
							this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],userObj)
							if(this.shorcutItem[i]&&this.shorcutItem[i].item.mpCost){
								$gameParty.members()[0]._mp -= needMp;
							}
							sxlSimpleABS.target = null
							if(this.shorcutItem[i]&&!this.shorcutItem[i].item.mpCost) $gameParty.consumeItem(this.shorcutItem[i].item);
							if(this.shorcutItem[i].item.itypeId && $gameParty.numItems(this.shorcutItem[i].item)<1)  {$gameVariables.setValue(i+1,$dataItems[2]);this.shorcutItem[i].cd=0;}
						}else if(targetE){
							this.shorcutItem[i].cd = this.shorcutItem[i].setCd;
							this.triggerSkill($gamePlayer,$gameParty.members()[0],targetE,targetE._battler,userObj)
							if(this.shorcutItem[i]&&this.shorcutItem[i].item.mpCost){
								$gameParty.members()[0]._mp -= needMp;
							}
							if(this.shorcutItem[i]&&!this.shorcutItem[i].item.mpCost) $gameParty.consumeItem(this.shorcutItem[i].item);
							if(this.shorcutItem[i].item.itypeId && $gameParty.numItems(this.shorcutItem[i].item)<1)  {$gameVariables.setValue(i+1,$dataItems[2]);this.shorcutItem[i].cd=0;}
							sxlSimpleABS.target = null;
						}
					}else{
						this.shorcutItem[i].cd = this.shorcutItem[i].setCd;
						if( itemAction.isForUser()){
							userTarget = $gameParty.members()[0];
						}
						if(this.shorcutItem[i]&&this.shorcutItem[i].item.mpCost){
							$gameParty.members()[0]._mp -= needMp;
						}
						if( itemAction.isForAll() ){
							for( k in $gameParty.members() ){
								var userTarget =  $gameParty.members()[k];
								var userChar = userTarget.player;
								animationTarget.push( userChar );
								if( itemAction.isForAliveFriend() ){
									if( !userTarget.isStateAffected(1) && userTarget._hp > 0 ){
										itemAction.apply( userTarget );
										if(!this.shorcutItem[i].item.mpCost) $gameParty.consumeItem(this.shorcutItem[i].item);
										if(this.shorcutItem[i].item.itypeId && $gameParty.numItems(this.shorcutItem[i].item)<1)  {$gameVariables.setValue(i+1,$dataItems[2]);this.shorcutItem[i].cd=0;}
										
									}
								}else if( itemAction.isForDeadFriend() ){
									if( userTarget.isStateAffected(1) || userTarget._hp <= 0 ){
										itemAction.apply( userTarget );
										if(!this.shorcutItem[i].item.mpCost) $gameParty.consumeItem(this.shorcutItem[i].item);
										if(this.shorcutItem[i].item.itypeId && $gameParty.numItems(this.shorcutItem[i].item)<1)  {$gameVariables.setValue(i+1,$dataItems[2]);this.shorcutItem[i].cd=0;}
									}
								}
							}
						}else{
							if( itemAction.isForAliveFriend() ){
								if( !userTarget.isStateAffected(1) && userTarget._hp > 0 ){
									itemAction.apply( userTarget );
									animationTarget.push( userChar );
									if(!this.shorcutItem[i].item.mpCost) $gameParty.consumeItem(this.shorcutItem[i].item);
									if(this.shorcutItem[i].item.itypeId && $gameParty.numItems(this.shorcutItem[i].item)<1)  {$gameVariables.setValue(i+1,$dataItems[2]);this.shorcutItem[i].cd=0;}
								}
							}
							if( itemAction.isForDeadFriend() ){
								if( userTarget.isStateAffected(1) || userTarget._hp <= 0 ){
									itemAction.apply( userTarget );
									animationTarget.push( userChar );
									if(!this.shorcutItem[i].item.mpCost) $gameParty.consumeItem(this.shorcutItem[i].item);
									if(this.shorcutItem[i].item.itypeId && $gameParty.numItems(this.shorcutItem[i].item)<1)  {$gameVariables.setValue(i+1,$dataItems[2]);this.shorcutItem[i].cd=0;}
								}
							}
						}
						if( this.shorcutItem[i].item.itypeId||this.shorcutItem[i].item.stypeId){
							for(effect of this.shorcutItem[i].item.effects){
								if(effect.code==44){
									$gameTemp.reserveCommonEvent(effect.dataId);
								}
							}
						}
					}
					var result = userTarget._result;
					var hpDamageNumber = result.hpDamage
					var mpDamageNumber = result.mpDamage
					if(result.hpDamage>0){
						this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,0);
					}
					if(result.mpDamage>0){
						this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,16);
					}
					if(result.hpDamage<0){
						this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,24);
					}
					if(result.mpDamage<0){
						this.showDamage(userChar, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, this.shorcutItem[i].item, null, result,16);
					}
					
					$gameTemp.requestAnimation( animationTarget, animation, false );}
					
			}else{
				if($gameParty.members()[0]._mp<needMp){
					this.showDamage( $gamePlayer , '魔法值不足' , 14 ,16, 'word'  )
				}
				if(this.shorcutItem[i].cd){
					this.showDamage( $gamePlayer , '尚未冷却' , 14 ,8, 'word'  )
				}
				if(this.shorcutItem[i].item.stypeId && !$gameParty.members()[0].isSkillWtypeOk($dataSkills[this.shorcutItem[i].item.id])){
					this.showDamage( $gamePlayer , '所持武器无法释放' , 14 ,8, 'word'  )
				}
			}
			if( sxlSimpleItemList.itemShow ) this.createItems();
			if( sxlSimpleItemList.itemShow ) this.createEquips();
		};
	};
};

Scene_Map.prototype.rightClickShortcut = function(){
	if(!this.rightClickSkill){
		for(j in this.rightClickIconArray){
			if(this.rightClickIconArray[j]){
				this.rightClickIconArray[j].opacity = 0;
			}
		}
	}else{
		for(i in this.rightClickIconArray){
			if(i == this.rightClickSkill.scId){
				this.rightClickIconArray[i].opacity = 255;
			}else{
				this.rightClickIconArray[i].opacity = 0;
			}
		}
	}
	if($gamePlayer.rightClickSkillSCId){
		this.rightClickSkill = this.shorcutItem[$gamePlayer.rightClickSkillSCId];
		this.rightClickSkill.scId = $gamePlayer.rightClickSkillSCId;
	}
	for( i in this.shortcutBackArray ){
		if( TouchInput.x > this.shortcutBackArray[i].x &&
			TouchInput.y > this.shortcutBackArray[i].y &&
			TouchInput.x < this.shortcutBackArray[i]._bounds.maxX &&
			TouchInput.y < this.shortcutBackArray[i]._bounds.maxY){

			if(TouchInput.isCancelled()){
				$gamePlayer.rightClickSkillSCId = i;
			}
			break;
		}
	}
}





