
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Gauges
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简易的地图战斗系统的血条系统
 * @author 神仙狼
 *
 * @help SSMBS_BattleCore_Gauges.js
 *
 * 本系列所有插件不可二次发布。
 *
 * 
 * @param 敌人头顶血条的显示范围
 * @type number
 * @desc 敌人头顶血条的显示范围
 * @default 4
 * 
 * @param 角色头顶血条的宽度
 * @type number
 * @desc 角色头顶血条的宽度
 * @default 48
 *
 * @param 角色头顶血条的高度
 * @type number
 * @desc 角色头顶血条的高度
 * @default 4
 *
 * @param 角色头顶蓝条的高度
 * @type number
 * @desc 角色头顶蓝条的高度
 * @default 3
 * 
 * @param 角色头顶血条的Y轴偏移
 * @type number
 * @desc 角色头顶血条的Y轴偏移
 * @default 12
 *
 */

sxlSimpleABS.hideRange = Number(sxlSimpleABS.parameters['敌人头顶血条的显示范围'] || 4);
sxlSimpleABS.gaugeWidth = Number(sxlSimpleABS.parameters['角色头顶血条的宽度'] || 48);
sxlSimpleABS.gaugeHeight = Number(sxlSimpleABS.parameters['角色头顶血条的高度'] || 4);
sxlSimpleABS.gaugeHeightMP = Number(sxlSimpleABS.parameters['角色头顶蓝条的高度'] || 3);
sxlSimpleABS.offsetY = Number(sxlSimpleABS.parameters['角色头顶血条的Y轴偏移'] || 12);
sxlSimpleABS.padding = 1;
var _gauge_onMapLoaded = Spriteset_Map.prototype.createLowerLayer ;
Spriteset_Map.prototype.createLowerLayer = function() {
	_gauge_onMapLoaded.call(this);
	sxlSimpleABS.followerGauges = [];
	sxlSimpleABS.gauges = [];
	for( i in $gameMap.events()){
		if( $gameMap.events()[i]._battler && 
			$dataEnemies[$gameMap.events()[i]._battler._enemyId].meta.bossGauge){
			this.showBossGauge($gameMap.events()[i]);
		}else{
			this.showEnemiesGauge($gameMap.events()[i]);
		}
	}
	

	for(var i = 0; i < $gamePlayer._followers._data.length; i++){
		this.showFollowerGauge($gamePlayer._followers._data[i]);
		if(!$gamePlayer._followers._data[i]._battler && $gameParty.members()[i+1]){
			let follower = $gameParty.members()[i+1]._actorId;
			$gamePlayer._followers._data[i]._battler = new Game_Actor(follower);
			$gamePlayer._followers._data[i]._tgr = 0;
			$gamePlayer._followers._data[i].target = null;
		};
	};
	this.showLeaderGauge($gamePlayer)

};

var _gauge_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
	_gauge_update.call(this);
	for( i = 0 ; i <  $gameParty.members().length ; i++ ){
		var member = $gameParty.members()[i];
		var follower = $gamePlayer._followers._data;
		var dataMember = $dataActors[member._actorId]
		if( i > 0  && member) {
			this.refreshFollowerGauge(sxlSimpleABS.followerGauges[i-1], follower[i-1]);
		};
	}
	
	for( i in $gameMap.events()){
		if($gameMap.events()[i]._battler && sxlSimpleABS.gauges[i] && $dataEnemies[$gameMap.events()[i]._battler._enemyId].meta.bossGauge){
			this.refreshBossGauge(sxlSimpleABS.gauges[i], $gameMap.events()[i])
		}else{
			if($gameMap.events()[i]._battler && sxlSimpleABS.gauges[i]){
				this.refreshEnemiesGauge(sxlSimpleABS.gauges[i], $gameMap.events()[i]);
			}
		}
	}
	this.refreshLeaderGauge($gamePlayer);
};

Spriteset_Map.prototype.showEnemiesGauge = function(target){
	this.enemyGauge = new Sprite(new Bitmap(sxlSimpleABS.gaugeWidth,128));
	this.enemyGauge.x = target.screenX();
	this.enemyGauge.y = target.screenY() + sxlSimpleABS.offsetY;
	this.enemyGauge.z = $gamePlayer.screenZ()+2;
	this.enemyGauge.anchor.x = 0.5;
	this.enemyGauge.anchor.y = 1.2;
	this.enemyGauge.opacity = 255;
	this.enemyGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this.enemyGauge.bitmap.fontSize = 16;
	this.enemyGauge.target = target;
	this._tilemap.addChildAt(this.enemyGauge, 1 );
	sxlSimpleABS.gauges.push(this.enemyGauge);
};

Spriteset_Map.prototype.showBossGauge = function(target){
	this.bossGauge = new Sprite(new Bitmap(Graphics.width*0.7,300));
	this.bossGauge.anchor.x = 0.5;
	this.bossGauge.anchor.y = 0;
	this.bossGauge.opacity = 255;
	this.bossGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this.bossGauge.bitmap.fontSize = 20;
	this.bossGauge.target = target;
	this.bossGauge.backGround = new Sprite(new Bitmap(Graphics.width*0.72+128,300))
	this.bossGauge.backGround.x = this.bossGauge.x;
	this.bossGauge.backGround.y = this.bossGauge.y;
	this.bossGauge.backGround.anchor.x = 0.5;
	this.bossGauge.backGround.anchor.y = 0;
	this.bossGauge.backGround.opacity = 192;
	this.bossGauge.backGround.bitmap.fontFace = $gameSystem.mainFontFace();
	this.bossGauge.backGround.bitmap.fontSize = 20;
	this.bossGauge.backGround.target = target;
	this.bossGauge.face = new Sprite();
	this.bossGauge.face.bitmap =  ImageManager.loadSystem("IconSet");
	this.bossGauge.face.x = this.bossGauge.x;
	this.bossGauge.face.y = this.bossGauge.y;
	this.bossGauge.face.anchor.x = 0;
	this.bossGauge.face.anchor.y = 0;
	this.bossGauge.face.opacity = 255;
	this.bossGauge.face.bitmap.fontFace = $gameSystem.mainFontFace();
	this.bossGauge.face.bitmap.fontSize = 20;
	this.bossGauge.face.target = target;
	this._tilemap.addChild(this.bossGauge.backGround );
	this._tilemap.addChild(this.bossGauge );
	this._tilemap.addChild(this.bossGauge.face);
	
	
	sxlSimpleABS.gauges.push(this.bossGauge);
};

Spriteset_Map.prototype.showFollowerGauge = function(target){
	this.followerGauge = new Sprite(new Bitmap(512,128));
	this.followerGauge.x = target.screenX();
	this.followerGauge.y = target.screenY() + sxlSimpleABS.offsetY;
	this.followerGauge.z = $gamePlayer.screenZ();
	this.followerGauge.anchor.x = 0.5;
	this.followerGauge.anchor.y = 1.2;
	this.followerGauge.opacity = 255;
	this.followerGauge.bitmap.fontSize = 16;
	this.followerGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this._tilemap.addChildAt(this.followerGauge, 1 );
	sxlSimpleABS.followerGauges.push(this.followerGauge);
};

Spriteset_Map.prototype.showLeaderGauge = function(target){
	this.leaderGauge = new Sprite(new Bitmap(512,128+sxlSimpleABS.padding*2));
	this.leaderGauge.z = $gamePlayer.screenZ();
	this.leaderGauge.anchor.x = 0.5;
	this.leaderGauge.anchor.y = 1.2;
	this.leaderGauge.opacity = 255;
	this.leaderGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this.leaderGauge.bitmap.fontSize = 16;
	this._tilemap.addChildAt(this.leaderGauge, 1 );
};

Spriteset_Map.prototype.refreshLeaderGauge = function(enemy){
	if(this.leaderGauge && $gameParty.members()[0]){
		// enemy.bitmap.clear();
		this.leaderGauge.bitmap.clear();
		var line = 0 ; 
		var lineHeight = 14
		var rate = $gameParty.members()[0]._hp / $gameParty.members()[0].mhp;
		var rateMp = $gameParty.members()[0]._mp /  $gameParty.members()[0].mmp;
		var rateTp = $gameParty.members()[0]._tp / 100;
		var name = $dataActors[$gameParty.members()[0]._actorId].name;
		var label = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.label
		var stunRate =  enemy._stun / enemy._stunMax;
		var skillCast = enemy.skillCast?
						Number(enemy.skillCast):0;
		var waitTimeRate = $gamePlayer.waitForCast / ( skillCast ) ;
		var totalHeight = sxlSimpleABS.padding*3+sxlSimpleABS.gaugeHeight+sxlSimpleABS.gaugeHeightMP;

		this.splash = $gameParty.members()[0].damageHp;
		var splashRate = this.splash / $gameParty.members()[0].mhp;
		this.leaderGauge.x = enemy.screenX();
		this.leaderGauge.y = enemy.screenY() + sxlSimpleABS.offsetY;
		if( rate <= 0.3 ){
			this.leaderGauge.fontColor = '#FFFF00';
		}else{
			this.leaderGauge.fontColor = '#FFFFFF';
		}
		this.leaderGauge.bitmap.fontSize = 12;

		this.leaderGauge.bitmap.drawText(name,this.leaderGauge.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		this.leaderGauge.bitmap.gradientFillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);
		this.leaderGauge.bitmap.gradientFillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeightMP,'#606060','#404040',true);

		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');

		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateMp,sxlSimpleABS.gaugeHeightMP,'#00BFFF');
		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateMp,1,'#ffffff');

		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		this.leaderGauge.bitmap.smooth = false;
		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');	
		this.leaderGauge.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		if( $gamePlayer.waitForCast > 0 ){
			if(waitTimeRate>1){
				this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),3,'#800000');
			}else{
				this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),3,'#BA55D3');
			}
			
		};
		if(label){
			line ++ ;
			this.leaderGauge.bitmap.textColor1 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor?
										ColorManager.textColor(Number( $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor )):ColorManager.textColor(0);
			this.leaderGauge.bitmap.textColor2 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2?
										ColorManager.textColor(Number($gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2)):this.leaderGauge.bitmap.textColor1;
			this.leaderGauge.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),this.leaderGauge.width,lineHeight,'center',this.leaderGauge.bitmap.textColor1,this.leaderGauge.bitmap.textColor2);
		}
		if(  $gameParty.members()[0]._states.length > 0 ){
			for( j = 0 ; j < $gameParty.members()[0]._states.length ; j ++ ){
				
				let enemyMember = $gameParty.members();
				let stateId = enemyMember[0]._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember[0]._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) this.leaderGauge.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						this.leaderGauge.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),this.leaderGauge.width,lineHeight,'center');
					}else{
						this.leaderGauge.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),this.leaderGauge.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) this.leaderGauge.bitmap.textColor = '#ffffff';
				}
			};
		}
	}else{
		this.leaderGauge.bitmap.clear();
	};
};


Spriteset_Map.prototype.refreshFollowerGauge = function(target, enemy){
	if(target){
		target.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		var rate = $gameParty.members()[enemy._memberIndex]._hp / $gameParty.members()[enemy._memberIndex].mhp;
		var name = $dataActors[$gameParty.members()[enemy._memberIndex]._actorId].name;
		var rateTp = $gameParty.members()[enemy._memberIndex]._tp / 100;
		var skillCast = $dataSkills[$gameParty.members()[enemy._memberIndex].attackSkillId()].meta.cast?
						Number($dataSkills[$gameParty.members()[enemy._memberIndex].attackSkillId()].meta.cast):0;
		var stunRate =  enemy._stun/enemy._stunMax;

		var waitTimeRate =  $gamePlayer._followers._data[ enemy._memberIndex - 1 ]._waitTime / 
							(sxlSimpleABS.castBasicAGI / $gameParty.members()[enemy._memberIndex].agi * skillCast ) ;
		var totalHeight = sxlSimpleABS.padding*2+sxlSimpleABS.gaugeHeight;
		if( rate <= 0.3 ){
			this.leaderGauge.fontColor = '#FFFF00';
		}else{
			this.leaderGauge.fontColor = '#FFFFFF';
		}
		target.x = enemy.screenX();
		target.y = enemy.screenY() + sxlSimpleABS.offsetY;
		target.splash = $gameParty.members()[enemy._memberIndex].damageHp;
		var splashRate = target.splash / $gameParty.members()[enemy._memberIndex].mhp;
		var label = $gameParty.members()[enemy._memberIndex].equips()[sxlSimpleABS.labelEtypeID-1].meta.label
		target.bitmap.fontSize = 12;
		target.bitmap.smooth = false;
		target.bitmap.drawText(name,target.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
		target.bitmap.fillRect(target.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		target.bitmap.gradientFillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);

		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');

		target.bitmap.fillRect(target.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		target.bitmap.smooth = false;
		target.bitmap.fillRect(target.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');	
		target.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		if( $gamePlayer.waitForCast > 0 ){
			if(waitTimeRate>1){
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),3,'#800000');
			}else{
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),3,'#BA55D3');
			}
			
		};
		if(label){
			line ++ ;
			target.bitmap.textColor1 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor?
										ColorManager.textColor(Number( $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor )):ColorManager.textColor(0);
			target.bitmap.textColor2 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2?
										ColorManager.textColor(Number($gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2)):target.bitmap.textColor1;
			target.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center',target.bitmap.textColor1,target.bitmap.textColor2);
		}
		if(  $gameParty.members()[enemy._memberIndex]._states.length > 0 ){
			for( j = 0 ; j < $gameParty.members()[enemy._memberIndex]._states.length ; j ++ ){
				
				let enemyMember = $gameParty.members();
				let stateId = enemyMember[enemy._memberIndex]._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember[enemy._memberIndex]._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) target.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						target.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}else{
						target.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) target.bitmap.textColor = '#ffffff';
				}
			};
		}	
	};
};

Spriteset_Map.prototype.refreshBossGauge = function(target, enemy){

	if((enemy._battler._hp<=0 || !enemy._battler || enemy._battler.isStateAffected(1))){
		target.opacity = 0;
	}else{
		var vision = $dataEnemies[enemy._battler._enemyId].meta.vision?Number($dataEnemies[enemy._battler._enemyId].meta.vision):15
		if(Math.abs(enemy.x-$gamePlayer.x)<vision && Math.abs(enemy.y-$gamePlayer.y)<vision ){
			target.opacity += 30;
		}else{
			target.opacity -= 30;
		}

	}
	var maxWidth = Graphics.width*0.7-64;
	if(target && enemy._battler){
		target.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		let rate = enemy._battler._hp / enemy._battler.mhp;
		target.splash = enemy._battler.damageHp;
		target.states = [];
		var splashRate = target.splash / enemy._battler.mhp;
		var shake = Math.random()*splashRate*128-splashRate*128/2;
		let name = $dataEnemies[enemy._battler._enemyId].name;
		let color = $dataEnemies[enemy._battler._enemyId].meta.textColor?
					 ColorManager.textColor(Number($dataEnemies[enemy._battler._enemyId].meta.textColor)):'#ffffff';
		var rateTp = enemy._battler._tp / 100;
		var stunRate =  enemy._stun / enemy._stunMax;
		var skillCast = $dataSkills[enemy._battler.attackSkillId()].meta.cast?
						Number($dataSkills[enemy._battler.attackSkillId()].meta.cast):1;
		var iconSet = $dataEnemies[enemy._battler._enemyId].meta.bossFace?
						Number($dataEnemies[enemy._battler._enemyId].meta.bossFace):0;
		var waitTimeRate = enemy._waitTime / ( sxlSimpleABS.castBasicAGI / enemy._battler.agi * skillCast);

		target.x = Graphics.width/2+72 + shake;
		target.y = Graphics.height*0.025 + shake;
		target.bitmap.fontSize = 18;
		target.bitmap.textColor = color;
		target.bitmap.fillRect(0,80,maxWidth,24, '#696969');
		target.backGround.blendMode = 2;
		target.backGround.x = target.x+15;
		target.backGround.y = target.y;
		target.backGround.opacity = target.opacity;
		target.backGround.bitmap.gradientFillRect (0,48,256,32,'#000000','#ffffff');
		target.backGround.bitmap.gradientFillRect (0,104,maxWidth+61,24,'#000000','#ffffff',true);
		target.bitmap.gradientFillRect (0,80,maxWidth*rate,24,'#B80000','#BA55D3');
		target.bitmap.fillRect(maxWidth*rate,80,splashRate*maxWidth,24,'#FFFFFF');
		target.bitmap.fillRect(0,104,maxWidth,6,'#696969');
		target.bitmap.fillRect(0,104,maxWidth*rateTp,6,'#F5F5DC');
		target.bitmap.drawText(name,6,0,maxWidth,128,'left');
		target.face.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,31,31);
		target.face.x = target.x-maxWidth/2-94;
		target.face.y = target.y+48;
		target.face.scale.x = 2;
		target.face.scale.y = 2;
		target.face.opacity = target.opacity;
		target.bitmap.smooth = false;
		if( enemy._waitTime > 0 ){
			target.bitmap.fillRect(0,104,maxWidth*(1-waitTimeRate),8,'#BA55D3');
		};
		target.bitmap.fillRect(0,104,maxWidth*stunRate,8,'#000000');	
		if(  enemy._battler._states.length > 0 ){
			for( j = 0 ; j < enemy._battler._states.length ; j ++ ){
				target.bitmap.fontSize = 16;
				
				let enemyMember = enemy._battler;
				let stateId = enemyMember._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line += (state.length+2)*target.bitmap.fontSize ;
					if(stateIndata.meta.textColor) target.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor));
					if(stateSteps!=0){
						target.bitmap.drawText('['+state+':'+stateSteps+']',maxWidth-line,0,96,128,'left');
					}else{
						target.bitmap.drawText('['+state+']',maxWidth-line,0,96,128,'left');
					}
					if(stateIndata.meta.textColor) target.bitmap.textColor = '#ffffff';
				}
			};
		};
	};
};

Spriteset_Map.prototype.refreshEnemiesGauge = function(target, enemy){
	if(enemy._battler._hp<=0 || !enemy._battler || enemy._battler.isStateAffected(1)){
		target.opacity = 0;
	}else{
		if( Math.abs($gamePlayer.x - enemy.x <= sxlSimpleABS.hideRange) && 
			Math.abs($gamePlayer.y - enemy.y <= sxlSimpleABS.hideRange) && 
			$gameVariables.value(sxlSimpleABS.opacityVarID)>0 ){
			target.opacity += 10;
		}else if( (Math.abs($gamePlayer.x - enemy.x > sxlSimpleABS.hideRange)  || 
				   Math.abs($gamePlayer.y - enemy.y > sxlSimpleABS.hideRange)) && 
				  $gameVariables.value(sxlSimpleABS.opacityVarID)>0 ){
			target.opacity -= 10;
		}else{
			target.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		}
	}
	if(target && enemy._battler  ){

		target.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		let rate = enemy._battler._hp / enemy._battler.mhp;
		target.splash = enemy._battler.damageHp;
		var splashRate = target.splash / enemy._battler.mhp;

		let name = $dataEnemies[enemy._battler._enemyId].name;
		let color = $dataEnemies[enemy._battler._enemyId].meta.textColor?
					 ColorManager.textColor(Number($dataEnemies[enemy._battler._enemyId].meta.textColor)):'#ffffff';
		var rateTp = enemy._battler._tp / 100;
		var stunRate =  enemy._stun / enemy._stunMax;
		var skillCast = $dataSkills[enemy._battler.attackSkillId()].meta.cast?
						Number($dataSkills[enemy._battler.attackSkillId()].meta.cast):1;
		var waitTimeRate = enemy._waitTime / ( sxlSimpleABS.castBasicAGI / enemy._battler.agi * skillCast);
		var totalHeight = sxlSimpleABS.padding*2+sxlSimpleABS.gaugeHeight;
		var label = $dataEnemies[enemy._battler._enemyId].meta.label
		target.x = enemy.screenX();
		target.y = enemy.screenY() + sxlSimpleABS.offsetY;
		target.bitmap.fontSize = 12;
		target.bitmap.textColor = color;

		target.bitmap.fontSize = 12;
		target.bitmap.smooth = false;
		target.bitmap.drawText(name,target.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
		target.bitmap.fillRect(target.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		target.bitmap.gradientFillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);

		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');

		target.bitmap.fillRect(target.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		target.bitmap.smooth = false;
		target.bitmap.fillRect(target.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');	
		target.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		if( $gamePlayer.waitForCast > 0 ){
			if(waitTimeRate>1){
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),3,'#800000');
			}else{
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),3,'#BA55D3');
			}
			
		};
		if(label){
			line ++ ;
			target.bitmap.textColor1 = $dataEnemies[enemy._battler._enemyId].meta.labelTextColor?
										ColorManager.textColor(Number( $dataEnemies[enemy._battler._enemyId].meta.labelTextColor)):ColorManager.textColor(0);
			target.bitmap.textColor2 = $dataEnemies[enemy._battler._enemyId].meta.labelTextColor2?
										ColorManager.textColor(Number($dataEnemies[enemy._battler._enemyId].meta.labelTextColor2)):target.bitmap.textColor1;
			target.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center',target.bitmap.textColor1,target.bitmap.textColor2);
		}
		if(  enemy._battler._states.length > 0 ){
			for( j = 0 ; j <  enemy._battler._states.length ; j ++ ){
				
				let enemyMember =  enemy._battler;
				let stateId = enemy._battler._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) target.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						target.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}else{
						target.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) target.bitmap.textColor = '#ffffff';
				}
			};
		}
	};
};


