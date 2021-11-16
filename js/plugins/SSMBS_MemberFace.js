//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Member Face
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 角色头像插件
 * @author 神仙狼
 *
 * @help SSMBS_MemberFace.js
 * 
 * @param 透明度变量ID
 * @type Number
 * @desc 透明度变量ID
 * @default 20
 *
 * @param 升级获得技能点
 * @type Number
 * @desc 升级获得技能点
 * @default 20
 *
 * @param 基础属性加点按钮偏移X
 * @type Number
 * @desc 基础属性加点按钮偏移（不包括HP/MP）
 * @default 0
 *
 * @param 头像初始X
 * @type Number
 * @desc 头像初始X
 * @default 12
 *
 * @param 头像初始Y
 * @type Number
 * @desc 头像初始Y
 * @default 108
 *
 * @param 头像间隔
 * @type Number
 * @desc 头像间隔
 * @default 12
 *
 * @param 空状态图标ID
 * @type Number
 * @desc 空状态图标ID
 * @default 64
 */


var sxlSimpleFaces = sxlSimpleFaces||{};
sxlSimpleFaces.parameters = PluginManager.parameters('SSMBS_MemberFace');

sxlSimpleFaces.facesScale = 0.5;
sxlSimpleFaces.facesStart = 24;


sxlSimpleFaces.startX  = Number(sxlSimpleFaces.parameters['头像初始X'] || 12);
sxlSimpleFaces.startY  = Number(sxlSimpleFaces.parameters['头像初始Y'] || 108);
sxlSimpleFaces.facesBetween = Number(sxlSimpleFaces.parameters['头像间隔'] || 12);

sxlSimpleFaces.opacityVarID = Number(sxlSimpleFaces.parameters['透明度变量ID'] || 20);
sxlSimpleFaces.lvupAddParamPoints = Number(sxlSimpleFaces.parameters['升级获得技能点'] || 5);
sxlSimpleFaces.basicButtonOffset = Number(sxlSimpleFaces.parameters['基础属性加点按钮偏移X'] || 0);
sxlSimpleFaces.emptyStateIconId = Number(sxlSimpleFaces.parameters['空状态图标ID'] || 64);


const _sxlAbs_faceMapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {

	_sxlAbs_faceMapLoad.call(this);
	this.faceBackArray = [];
	this.faces = [];
	this.gauges = [];
	this.faceNameArray = [];
	this.CDs = [];
	this.imageStaes = [];
	this.addButtons = [];
	this.showColorGauge();
	//创建状态信息栏
	this.actorStatesInformBack = new Sprite(new Bitmap( 128, 900 ) )
	this.addChild(this.actorStatesInformBack);
	this.actorStatesInform = new Sprite(new Bitmap( 128, 900 ) )
	this.addChild(this.actorStatesInform);
	
};

const _sxlAbs_faceMapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlAbs_faceMapUpdate.call(this);
	this.refreshGauge();
	this.refreshStateImage();

	this.createFaces();
	
	this.refreshStateSwitch();
	
	if( this.memberStates ){
		this.refreshStateWindow();
	}
	this.createStateImage();
};

Scene_Map.prototype.createFaces = function(){



}

Scene_Map.prototype.createFaces = function(){
	for( i = 0 ; i < $gameParty.maxBattleMembers() ; i ++ ){
		var member = $gameActors.actor(sxlSimpleItemList.actorArray[i]);
		var start = sxlSimpleFaces.facesStart;
		
		var between = sxlSimpleFaces.facesBetween;
		var scale = sxlSimpleFaces.facesScale;
		var startX = sxlSimpleFaces.startX /* Graphics.width - ( ( 144 * scale + between ) * $gameParty.members().length ) */;
		var startY = sxlSimpleFaces.startY/*this.shortcutBackArray[0].y - 72 - 24;*/
		if(!this.faces[i]){
			this.faceBack = new Sprite( new Bitmap( 72, 72) );
			this.faceSet = new Sprite();
			this.faceGauge = new Sprite( new Bitmap( 72, 144 ) );
			this._faceName = new Sprite( new Bitmap( 72, 144 ) );
			this.faceGaugeRule = new Sprite( new Bitmap( 72, 144 ) );
			this.faceGaugeLight = new Sprite( new Bitmap( 72, 144 ) );
			this.addChild(this.faceBack);
			this.addChild(this.faceGauge);
			// this.addChild(this.faceGaugeLight);
			// this.addChild(this.faceGaugeRule);
			this.addChild(this.faceSet);
			this.addChild(this._faceName);
			this.faceBackArray.push(this.faceBack);
			this.gauges.push(this.faceGauge);
			this.faces.push(this.faceSet);
			this.faceNameArray.push(this._faceName);

		};
		
		this.faceBack.x = 12/*Graphics.width - 100 - ( (144 * scale + between) * i )*/;
		this.faceBack.y = startY+(i-1)*(144*scale+12+between);
		this.faceBack.bitmap.fillRect( 0, 0, 72, 72, '#000000' );
		
		

		this.faceSet.x = this.faceBack.x;
		this.faceSet.y = this.faceBack.y ;
		this.faceSet.scale.x = scale ;
		this.faceSet.scale.y = scale ;
		if( i == 0 ){
			this.faceSet.char = $gamePlayer;
		}else{
			this.faceSet.char = $gamePlayer._followers._data[ i - 1 ];
		};
		
		
		this.faceGauge.x = this.faceSet.x ;
		this.faceGauge.y = this.faceSet.y ;


		
		
		// this.faceGauge.bitmap.fillRect( 0, 83, 72*tprate, 3, '#ffffff' );


		this._faceName.x = this.faceSet.x ;
		this._faceName.y = this.faceSet.y ;
		this._faceName.bitmap.fontSize = $gameSystem.mainFontSize() - 14 ;

		this._faceName.opacity = $gameVariables.value(sxlSimpleFaces.opacityVarID);
	};
};


Scene_Map.prototype.createStateImage = function(){
	
	
	for( i in this.faces ){
		this.faceBackArray[i].member = $gameParty.members()[i];
		this.faces[i].member = $gameParty.members()[i];
		this.gauges[i].member = $gameParty.members()[i];
		this.faceNameArray[i].member = $gameParty.members()[i];
		var member = this.faces[i].member;
		if(!this.faces[i].actorStateImage){
			this.faces[i].actorStateImage = new Sprite();
		}
		this.faces[i].canShowIcon = 0;
		this.faces[i].actorStateImage.bitmap = ImageManager.loadSystem("IconSet");
		if(member && member.states()[0]){
			var iconSet = $dataStates[member.states()[0].id].iconIndex;
		}else{
			var iconSet = sxlSimpleFaces.emptyStateIconId;
		}
		if(!member){
			iconSet = 0;
		}
		this.faces[i].actorStateImage.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);

		var scale = 0.5;
		var defaultSize = 32;
		var fixSize = scale * defaultSize;
		// if(this.informationBackground && this.informationBackground._bounds.maxX>this.faces[i].actorStateImage.x){
		// 	this.faces[i].actorStateImage.opacity = 255-this.informationBackground.opacity;
		// }
		this.faces[i].actorStateImage.scale.x = scale;
		this.faces[i].actorStateImage.scale.y = scale;

		this.faces[i].actorStateImage.x = this.faces[i].x + 72- fixSize ;
		this.faces[i].actorStateImage.y = this.faces[i].y + 72;
		this.addChildAt(this.faces[i].actorStateImage,1);


		// this.imageStaes.push(this.faces[i].actorStateImage);
	}

	// if( this.openSkillWindow == true || // 已打开技能窗口
	// 	sxlSimpleItemList.itemOpen == true ||  // 已打开物品窗口
	// 	sxlSimpleShop.window.opacity == 255 ||  // 已打开商店窗口
	// 	this.openQuestWIndow == true ||  // 已打开任务窗口
	// 	this.isStateOpen == true || // 已打开属性窗口
	// 	this.upgradeWindow.opacity == 255 // 已打开强化窗口
	// 	){ 
	// 	for( i in this.faces ){
	// 		this.faces[i].actorStateImage.opacity -= 20;
	// 	}
	// }
};
Scene_Map.prototype.refreshStateSwitch = function(){
	for( i = 0 ; i < this.faces.length ; i ++ ){
		
		if( this.faces[i].actorStateImage &&
			TouchInput.x > this.faces[i].actorStateImage._bounds.minX &&
			TouchInput.x < this.faces[i].actorStateImage._bounds.maxX &&
			TouchInput.y > this.faces[i].actorStateImage._bounds.minY &&
			TouchInput.y < this.faces[i].actorStateImage._bounds.maxY ){
			this.stateMember = this.faces[i].member; 
			this.actorStatesInformBack.x=this.faces[i].x+72;
			this.actorStatesInformBack.y=this.faces[i].y;
			this.actorStatesInformBack.opacity = 192;
			this.actorStatesInform.opacity = 255;
			break;
		}
	}
	this.actorStatesInformBack.bitmap.clear();
	this.actorStatesInform.bitmap.clear();
	this.actorStatesInformBack.opacity -= 10;
	this.actorStatesInform.opacity -= 10;
	this.actorStatesInform.x = this.actorStatesInformBack.x;
	this.actorStatesInform.y = this.actorStatesInformBack.y;
	this.actorStatesInform.bitmap.fontFace = $gameSystem.mainFontFace();
	var line = 0
	var lineHeight = 18;
	line += 0.5;
	this.actorStatesInform.bitmap.fontSize = 16;
	if(this.stateMember){
		var showedStates = 0;
		this.actorStatesInform.bitmap.fontBold = true;
		this.actorStatesInform.bitmap.drawText(this.stateMember._name,0,line*lineHeight,128,lineHeight,'center')
		this.actorStatesInform.bitmap.fontSize = 12;
		this.actorStatesInform.bitmap.fontBold = false;
		line ++;
		this.actorStatesInform.bitmap.drawText('状态',0,line*lineHeight,128,lineHeight,'center')
		line ++;
		for( k = 0 ; k < this.stateMember.states().length ; k ++ ){

			if(!$dataStates[this.stateMember.states()[k].id].meta.hide){
				showedStates ++ 
				this.actorStatesInform.bitmap.fontSize = 12;
				if($dataStates[this.stateMember.states()[k].id].meta.textColor){
					this.actorStatesInform.bitmap.textColor = ColorManager.textColor(Number($dataStates[this.stateMember.states()[k].id].meta.textColor))
				}
				this.actorStatesInform.bitmap.drawText('【 '+$dataStates[this.stateMember.states()[k].id].name+' 】',0,line*lineHeight,128,lineHeight,'center')
				this.actorStatesInform.bitmap.textColor = '#ffffff';
				line ++
				if($dataStates[this.stateMember.states()[k].id].meta.desc){
					var meta = $dataStates[this.stateMember.states()[k].id].meta.desc.split('\n');
					for( j in meta ){
						this.actorStatesInform.bitmap.drawText(meta[j],0,line*lineHeight,128,lineHeight,'center')
						line ++
					}
				}
				
			}
		}
		if(showedStates<1){
			if(this.faces[i] && this.faces[i].actorStateImage){
				this.faces[i].actorStateImage.setFrame(sxlSimpleFaces.emptyStateIconId % 16*32,Math.floor(sxlSimpleFaces.emptyStateIconId / 16)*32,32,32);
			}
			
			this.actorStatesInform.bitmap.textColor = ColorManager.textColor(7);
			this.actorStatesInform.bitmap.drawText('暂无状态',0,line*lineHeight,128,lineHeight,'center')
			this.actorStatesInform.bitmap.textColor = ColorManager.textColor(0);
			line ++;
		}
		line += 0.5;
		this.actorStatesInformBack.bitmap.fillRect(0,0,128,lineHeight*line,'#000000')
	}
		

};

Scene_Map.prototype.refreshStateImage = function(){
	// for( i in this.faces){
	// 	if (this.faces[i] && this.actorStatesInformBack) this.actorStatesInformBack.bitmap.clear();
	// 	if (this.faces[i] && this.actorStatesInform) this.actorStatesInform.bitmap.clear();
	// 	if(this.faces[i].openStatesInform == true ){
			
			
	// 		this.faces[i].actorStateImage.opacity = $gameVariables.value(sxlSimpleFaces.opacityVarID);
			
			
	// 	}else{
			
	// 	}
	// }
};

Scene_Map.prototype.refreshGauge = function(){
	for( i = 0 ; i < this.gauges.length ; i ++ ){
		// var member = this.faces[i].member
		// if(member.states()[0]){
		// 	var iconSet = $dataStates[member.states()[0].id].iconIndex;
		// }else{
		// 	var iconSet = 0;
		// }
		// this.actorStateImage.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
		var member = this.faces[i].member;
		this.gauges[i].bitmap.clear();
		this.faceNameArray[i].bitmap.clear();
		if(this.faces[i].member){
			this.gauges[i].opacity = $gameVariables.value(sxlSimpleFaces.opacityVarID);
			this.faces[i].opacity = this.gauges[i].opacity;
			this.faceNameArray[i].opacity = this.gauges[i].opacity;
			this.faceBackArray[i].opacity = $gameVariables.value(sxlSimpleFaces.opacityVarID)/2;

			this.faces[i].bitmap = ImageManager.loadFace( this.faces[i].member._faceName )
			this.faces[i].setFrame( this.faces[i].member._faceIndex % 4 * 144, Math.floor(this.faces[i].member._faceIndex / 4) * 144 , 144, 144);
			
			var hprate = this.faces[i].member._hp / this.faces[i].member.mhp;
			var mprate = this.faces[i].member._mp / this.faces[i].member.mmp;
			var tprate = this.faces[i].member._tp / 100;
			this.gauges[i].bitmap.fillRect( 0, 72, 72-16, 16, '#696969' );
			this.gauges[i].bitmap.fillRect( 0, 72, (72-16)*hprate, 10, '#98FB98' );
			if(this.faces[i].member==$gameParty.members()[0]){
				this.gauges[i].bitmap.fillRect( 0, 82, (72-16)*mprate, 6, '#00BFFF' );
			}else{
				this.gauges[i].bitmap.fillRect( 0, 82, (72-16)*tprate, 6, '#FFFFFF' );
			}
			
			this.faceNameArray[i].bitmap.drawText( member._name,-6,52,72,24,'right' );
			this.faceNameArray[i].bitmap.drawText( 'Lv: ' + member._level,-4,36,72,24,'right' );
			if( this.faceNameArray[i].member.paramPoints > 0 ){
				this.faceNameArray[i].bitmap.textColor = ColorManager.textColor(14);
				this.faceNameArray[i].bitmap.fontBold = true;
				this.faceNameArray[i].bitmap.fontSize = 16 ;
				this.faceNameArray[i].bitmap.drawText( '升级!',0,-10,72,48,'center' );
				this.faceNameArray[i].bitmap.fontSize = $gameSystem.mainFontSize() - 14 ;
				this.faceNameArray[i].bitmap.fontBold = false;
				this.faceNameArray[i].bitmap.textColor = ColorManager.textColor(0);

			}
		}else{
			this.faces[i].setFrame( 0, 0 , 0, 0);
			this.gauges[i].opacity = 0;
			this.faces[i].opacity = 0;
			this.faceNameArray[i].opacity = 0;
			this.faceBackArray[i].opacity = 0;
		}
		
		if( this.faces[i] && 
			TouchInput.x > this.faces[i]._bounds.minX &&
			TouchInput.x < this.faces[i]._bounds.maxX &&
			TouchInput.y > this.faces[i]._bounds.minY &&
			TouchInput.y < this.faces[i]._bounds.maxY &&
			!(TouchInput.x > this.faces[i].actorStateImage._bounds.minX &&
			  TouchInput.x < this.faces[i].actorStateImage._bounds.maxX &&
			  TouchInput.y > this.faces[i].actorStateImage._bounds.minY &&
			  TouchInput.y < this.faces[i].actorStateImage._bounds.maxY)){
			
			$gameParty.members()[0]._tp = 0;
			if(TouchInput.isClicked()){
				SoundManager.playCursor();
				if( !this.isStateOpen || this.isStateOpen==false ){
					this.isStateOpen = true;
					
					sxlSimpleFaces.member = this.faces[i].member;
					if(this.memberStates){
						this.memberStates.x = sxlSimpleFaces.storeX;
						this.memberStates.y = sxlSimpleFaces.storeY;
					};
					this.createMemberStates();
				}else{
					sxlSimpleFaces.member = this.faces[i].member;

				}
			}
		}
		if(this.isStateOpen == true ){
			if(	TouchInput.x > this.memberStates.x+269 &&
				TouchInput.x < this.memberStates.x+286 &&
				TouchInput.y > this.memberStates.y+13  &&
				TouchInput.y < this.memberStates.y+28 ){
				$gameParty.members()[0]._tp = 0;
				if(TouchInput.isClicked()){
					SoundManager.playCursor();
					this.isStateOpen = false;
					sxlSimpleFaces.storeX = this.memberStates.x;
					sxlSimpleFaces.storeY = this.memberStates.y;
					this.memberStates.x = 999999;
					this.memberStates.y = 999999;
				}
				
			}
			if( TouchInput.isTriggered() && 
				TouchInput.x > this.memberStates.x &&
				TouchInput.x < this.memberStates.x+269 &&
				TouchInput.y > this.memberStates.y  &&
				TouchInput.y < this.memberStates.y+32 ){

				if(!this.bindWindow){
					this.bindWindow = 'memberWindow';
				}
				this.stateWindowMoveWithMouse = true;
			}else if(TouchInput.isHovered()){
				this.stateWindowMoveWithMouse = false;
				this.bindWindow = null;
			}
			if(this.stateWindowMoveWithMouse == true && this.bindWindow == 'memberWindow'){
				this.memberStates.x = TouchInput.x - this.memberStates.width/2;
				this.memberStates.y = TouchInput.y - 16;
				sxlSimpleFaces.storeX = this.memberStates.x;
				sxlSimpleFaces.storeY = this.memberStates.y;
			}
		}
	};
};

Scene_Map.prototype.createMemberStates = function(){
	var member = sxlSimpleFaces.member;
	if( !this.memberStates ){
		this.memberStates = new Sprite();
		this.memberStates.bitmap = ImageManager.loadSystem('stateBackground');
		this.memberStates.x = Graphics.width -298-48;
		this.memberStates.y = 64;
		this.addChild( this.memberStates)

		this.memberStates.character = new Sprite();
		this.addChild(this.memberStates.character);

		this.memberStates.hair = new Sprite();
		this.addChild(this.memberStates.hair);

		this.memberStates.armor = new Sprite();
		this.addChild(this.memberStates.armor);

		this.memberStates.hat = new Sprite();
		this.addChild(this.memberStates.hat);


		this.memberStates.paramText = new Sprite( new Bitmap(298,469) )
		this.memberStates.paramText.x = this.memberStates.x;
		this.memberStates.paramText.y = this.memberStates.y;
		this.addChild(this.memberStates.paramText);

		for( i in $gameParty.members()[0]._paramPlus){
			this.memberStates.addParamButton = new Sprite();
			this.memberStates.addParamButton.bitmap = ImageManager.loadSystem('addParamButton');
			this.memberStates.addParamButton.anchor.x = 0.5;
			this.memberStates.addParamButton.anchor.y = 0.5;
			this.addChild(this.memberStates.addParamButton);
			this.addButtons.push(this.memberStates.addParamButton);
		}
	};
};

Scene_Map.prototype.refreshStateWindow = function(){
	var member = sxlSimpleFaces.member;
	for( i in this.addButtons ){
		if( !sxlSimpleFaces.member.paramPoints ||
			sxlSimpleFaces.member.paramPoints <= 0 ){
			sxlSimpleFaces.member.paramPoints = 0;
			this.addButtons[i].opacity = 0 ;
		}else{
			this.addButtons[i].opacity = 255 ;
		}
		if( TouchInput.x >= this.addButtons[i]._bounds.minX &&
			TouchInput.y >= this.addButtons[i]._bounds.minY && 
			TouchInput.x <= this.addButtons[i]._bounds.maxX &&
			TouchInput.y <= this.addButtons[i]._bounds.maxY ){
			if( TouchInput.isClicked() ){
				if(Input.isPressed('shift')){
					if( sxlSimpleFaces.member.paramPoints > 0 ){
						if( i == 0 || i == 1 ){
							member._paramPlus[i] += 100 ;
							if( i == 0) member._hp += 100 ;
							if( i == 1) member._mp += 100 ;
						}else{
							member._paramPlus[i] +=10;
						}
						
						sxlSimpleFaces.member.paramPoints -= 10;
						if(!member.usedPP){
							member.usedPP = 0 ;
						}
						member.usedPP += 10 ;
						SoundManager.playOk();
					}
				}else{
					if( sxlSimpleFaces.member.paramPoints > 0 ){
						if( i == 0 || i == 1 ){
							member._paramPlus[i] += 10 ;
							if( i == 0) member._hp += 10 ;
							if( i == 1) member._mp += 10 ;
						}else{
							member._paramPlus[i] ++;
						}
						
						sxlSimpleFaces.member.paramPoints --;
						if(!member.usedPP){
							member.usedPP = 0 ;
						}
						member.usedPP ++ ;
						SoundManager.playOk();
					}
				}
			}
			if( TouchInput.isPressed() ){
				this.addButtons[i].scale.x = 0.75;
				this.addButtons[i].scale.y = 0.75;
			}else{
				this.addButtons[i].scale.x = 1;
				this.addButtons[i].scale.y = 1;
			}
		}
	}

	

	this.memberStates.character.bitmap = ImageManager.loadCharacter(member._characterName);
	this.memberStates.character.blockWidth = this.memberStates.character.bitmap.width/3;
	this.memberStates.character.blockHeight = this.memberStates.character.bitmap.height/4;
	this.memberStates.character.setFrame( ( Math.floor(member._characterIndex*3+1) * this.memberStates.character.blockWidth ), (Math.floor(member._characterIndex/4)) * this.memberStates.character.blockHeight , this.memberStates.character.blockWidth, this.memberStates.character.blockHeight );
	this.memberStates.character.x = this.memberStates.x + 25;
	this.memberStates.character.y = this.memberStates.y + 64;
	this.memberStates.character.scale.x = 1;
	this.memberStates.character.scale.y = 1;


	this.memberStates.hair.bitmap = ImageManager.loadCharacter(member.hairImg);
	this.memberStates.hair.setFrame( 1 , 0 , this.memberStates.character.blockWidth, this.memberStates.character.blockHeight );
	this.memberStates.hair.x = this.memberStates.x + 25;
	this.memberStates.hair.y = this.memberStates.y + 64;
	this.memberStates.hair.scale.x = 1;
	this.memberStates.hair.scale.y = 1;
	if(member.hairColor){
		this.memberStates.hair.setColorTone(member.hairColor)
	}
	

	this.memberStates.armor.bitmap = ImageManager.loadCharacter(member.armorImg);
	this.memberStates.armor.setFrame( 1 , 0 , this.memberStates.character.blockWidth, this.memberStates.character.blockHeight );
	this.memberStates.armor.x = this.memberStates.x + 25;
	this.memberStates.armor.y = this.memberStates.y + 64;
	this.memberStates.armor.scale.x = 1;
	this.memberStates.armor.scale.y = 1;

	this.memberStates.hat.bitmap = ImageManager.loadCharacter(member.hatImg);
	this.memberStates.hat.setFrame( 1 , 0 , this.memberStates.character.blockWidth, this.memberStates.character.blockHeight );
	this.memberStates.hat.x = this.memberStates.x + 25;
	this.memberStates.hat.y = this.memberStates.y + 64;
	this.memberStates.hat.scale.x = 1;
	this.memberStates.hat.scale.y = 1;


	this.memberStates.paramText.bitmap.clear();
	this.memberStates.paramText.bitmap.fontSize = 12;
	this.memberStates.paramText.bitmap.fontFace = $gameSystem.mainFontFace();
	this.memberStates.paramText.bitmap.fontBold = true ;

	var line = 0;
	var lineHeight = 24;
	this.memberStates.paramText.x = this.memberStates.x ;
	this.memberStates.paramText.y = this.memberStates.y ;
	this.memberStates.paramText.bitmap.fontBold = false ;
	this.memberStates.paramText.bitmap.drawText( member._name, 
												 13, 72 + 30 ,
												 72,24, 'center');
	if( member.paramPoints>0 ){
		this.memberStates.paramText.bitmap.textColor = ColorManager.textColor(14);
	}else{
		this.memberStates.paramText.bitmap.textColor = ColorManager.textColor(0);
	}
	this.memberStates.paramText.bitmap.drawText( '属性点: '+member.paramPoints, 
												 13, 72 + 48 ,
												 72,24, 'center');
	this.memberStates.paramText.bitmap.textColor = ColorManager.textColor(0);
	this.memberStates.paramText.bitmap.drawText( TextManager.level + ': ' + member._level +
												 ' ('+member._exp[member._classId] + '/' + member.expForLevel( member._level + 1 ) +')', 
												 13+72+12, 41 + line * lineHeight,
												 240, 24, 'left');
	line ++ ;
	this.memberStates.paramText.bitmap.drawText(TextManager.hp + ': ' + Math.floor(member._hp) + '/' + member.mhp + '(+'+Math.floor(member.hrg*100)+'每秒)',
										 		13+72+12, 41 + line * lineHeight,
										 		240, 24, 'left');
	this.addButtons[0].x = this.memberStates.x + 276 ;
	this.addButtons[0].y = this.memberStates.y + 76 + (line-1)*lineHeight;

	line ++ ;
	this.memberStates.paramText.bitmap.drawText(TextManager.mp + ': ' + Math.floor(member._mp) + '/' + member.mmp + '(+'+Math.floor(member.mrg*100)+'每秒)',
										 		13+72+12, 41 + line * lineHeight,
										 		240, 24, 'left');
	this.addButtons[1].x = this.memberStates.x + 276 ;
	this.addButtons[1].y = this.memberStates.y + 76 + (line-1)*lineHeight;
	line ++ ;
	// this.memberStates.paramText.bitmap.drawText('攻击间隔:'+(Math.floor((100/(member.trg*100*60))*100)/100)+'秒',
	// 									 		13+72+12, 41 + line * lineHeight,
	// 									 		240, 24, 'left');
	this.memberStates.paramText.bitmap.drawText('攻击速度:'+Math.floor(Math.max(member.trg,0)*100)+'%' +'    '+ 
												'吟唱速度:'+Math.floor(Math.max(member.castSpeedParam,0))+'%',
										 		13+72+12, 41 + line * lineHeight,
										 		240, 24, 'left');
	// this.memberStates.paramText.bitmap.drawText('吟唱速度:'+Math.floor(Math.max(member.castSpeedParam,0))+'%',
	// 									 		13+72+12+81, 41 + line * lineHeight,
	// 									 		240, 24, 'left');
	line ++ ;
	line ++ ;
	this.memberStates.paramText.bitmap.drawText( TextManager.param(2) + ': ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( member.atk+'    ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.memberStates.paramText.bitmap.drawText( TextManager.param(4) + ': ',
										 		22 + 124 + 8, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( member.mat+'    ',
										 		22 + 124 + 8 , 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.addButtons[2].x = this.memberStates.x + 135 + sxlSimpleFaces.basicButtonOffset;
	this.addButtons[2].y = this.memberStates.y + 64 + (line-1)*lineHeight;
	this.addButtons[4].x = this.memberStates.x + 270 + sxlSimpleFaces.basicButtonOffset;
	this.addButtons[4].y = this.memberStates.y + 64 + (line-1)*lineHeight;
	line ++ ;
	this.memberStates.paramText.bitmap.drawText( TextManager.param(3) + ': ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( member.def+'    ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.memberStates.paramText.bitmap.drawText( TextManager.param(5) + ': ',
										 		22 + 124 + 8, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( member.mdf+'    ',
										 		22 + 124 + 8 , 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.addButtons[3].x = this.memberStates.x + 135 + sxlSimpleFaces.basicButtonOffset;
	this.addButtons[3].y = this.memberStates.y + 64 + (line-1)*lineHeight;
	this.addButtons[5].x = this.memberStates.x + 270 + sxlSimpleFaces.basicButtonOffset;
	this.addButtons[5].y = this.memberStates.y + 64 + (line-1)*lineHeight;
	line ++ ;
	this.memberStates.paramText.bitmap.drawText( TextManager.param(6) +': ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( member.agi+'    ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.memberStates.paramText.bitmap.drawText( TextManager.param(7) +': ',
										 		22 + 124 + 8, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( member.luk+'    ',
										 		22 + 124 + 8 , 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.addButtons[6].x = this.memberStates.x + 135 + sxlSimpleFaces.basicButtonOffset;
	this.addButtons[6].y = this.memberStates.y + 64 + (line-1)*lineHeight;
	this.addButtons[7].x = this.memberStates.x + 270 + sxlSimpleFaces.basicButtonOffset;
	this.addButtons[7].y = this.memberStates.y + 64 + (line-1)*lineHeight;
	line ++ ;
	this.memberStates.paramText.bitmap.drawText( TextManager.param(8) +': ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( Math.floor(member.hit*100)+'%    ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.memberStates.paramText.bitmap.drawText( TextManager.param(9) +': ',
										 		22 + 124 + 8, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( Math.floor(member.eva*100)+'%    ',
										 		22 + 124 + 8 , 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	line ++ ;
	this.memberStates.paramText.bitmap.drawText( '暴击率: ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( Math.floor(member.cri*100)+'%    ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.memberStates.paramText.bitmap.drawText( '暴击回避率: ',
										 		22 + 124 + 8, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( Math.floor(member.cev*100)+'%    ',
										 		22 + 124 + 8 , 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	line ++ ;
	this.memberStates.paramText.bitmap.drawText( '击退距离: ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( member.mrf*100+'    ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.memberStates.paramText.bitmap.drawText( '击退抗性: ',
										 		22 + 124 + 8, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( (1-member.grd)*100+'%    ',
										 		22 + 124 + 8 , 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	line ++ ;
	this.memberStates.paramText.bitmap.drawText( '物理抗性: ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( (1-member.pdr)*100+'%    ',
										 		22, 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	this.memberStates.paramText.bitmap.drawText( '魔法抗性: ',
										 		22 + 124 + 8, 41 + line * lineHeight - 12,
										 		124, 24, 'left');
	this.memberStates.paramText.bitmap.drawText( (1-member.mdr)*100+'%    ',
										 		22 + 124 + 8 , 41 + line * lineHeight - 12,
										 		124, 24, 'right');
	line ++ ;
	for( i = 2 ; i < 10 ; i+=2){
		this.memberStates.paramText.bitmap.drawText( $dataSystem.elements[i] + '属性抗性: ',
											 		22, 41 + line * lineHeight - 12,
											 		124, 24, 'left');
		this.memberStates.paramText.bitmap.drawText( Math.floor(100-member.elementRate(i)*100)+'%    ',
											 		22, 41 + line * lineHeight - 12,
											 		124, 24, 'right');
		this.memberStates.paramText.bitmap.drawText( $dataSystem.elements[i+1] + '属性抗性: ',
											 		22 + 124 + 8, 41 + line * lineHeight - 12,
											 		124, 24, 'left');
		this.memberStates.paramText.bitmap.drawText( Math.floor(100-member.elementRate(i+1)*100)+'%    ',
											 		22 + 124 + 8 , 41 + line * lineHeight - 12,
											 		124, 24, 'right');
		line ++ ;
	}
	var memberDesc = member._profile.split('/NL')
	var lineDesc = 0;
	var lineHeight = 18
	for(i in memberDesc){
		this.memberStates.paramText.bitmap.drawText( memberDesc[i], 16,417+lineHeight*lineDesc, 279, 24, 'center');
		lineDesc ++ ;
	}
	
};

Scene_Map.prototype.showColorGauge = function(){
	// this._colorGauge = new Sprite(new Bitmap(200,40));
	// this._colorGauge.bitmap.fillRect(0,0,200,8,'red');
	// this._colorGauge.bitmap.fillRect(0,10,200,8,'green');
	// this._colorGauge.bitmap.fillRect(0,20,200,8,'blue');
	// this._colorGauge.bitmap.fillRect(0,30,200,8,'gray');
	// this.addChild(this._colorGauge);
	// this._colorGauge.signR = new Sprite(new Bitmap(10,8));
	// this._colorGauge.signR.x = this._colorGauge.x+this._colorGauge.width/2;
	// this._colorGauge.signR.y = this._colorGauge.y;
	// this._colorGauge.signR.bitmap.fillRect(0,0,10,8,'black');
	// this.addChild(this._colorGauge.signR);
	// this._colorGauge.signG = new Sprite(new Bitmap(10,8));
	// this._colorGauge.signG.x = this._colorGauge.x+this._colorGauge.width/2;
	// this._colorGauge.signG.y = this._colorGauge.y+10;
	// this._colorGauge.signG.bitmap.fillRect(0,0,10,8,'black');
	// this.addChild(this._colorGauge.signG);
	// this._colorGauge.signB = new Sprite(new Bitmap(10,8));
	// this._colorGauge.signB.x = this._colorGauge.x+this._colorGauge.width/2;
	// this._colorGauge.signB.y = this._colorGauge.y+20;
	// this._colorGauge.signB.bitmap.fillRect(0,0,10,8,'black');
	// this.addChild(this._colorGauge.signB);
	// this._colorGauge.signT = new Sprite(new Bitmap(10,8));
	// this._colorGauge.signT.x = this._colorGauge.x+this._colorGauge.width/2;
	// this._colorGauge.signT.y = this._colorGauge.y+30;
	// this._colorGauge.signT.bitmap.fillRect(0,0,10,8,'black');
	// this.addChild(this._colorGauge.signT);
};

const _memberFaceLVUP = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
	_memberFaceLVUP.call(this);
	sxlSimpleABS.showInformation('【'+this._name+'】获得技能点：',ColorManager.textColor(0))
	if(!this.paramPoints){
		this.paramPoints = 0;
	}
	this.paramPoints += sxlSimpleFaces.lvupAddParamPoints;
};

sxlSimpleFaces.resetParamPoints = function(actorID){
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

sxlSimpleFaces.addParamPoints = function(actorID,amount){
	$gameActors.actor(actorID).paramPoints += amount;
};