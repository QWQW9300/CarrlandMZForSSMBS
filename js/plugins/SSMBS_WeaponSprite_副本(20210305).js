//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Weapon Sprite
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 控制角色武器在地图上显示和动作的插件
 * @author 神仙狼
 *
 * @help SSMBS_WeaponSprite.js
 * 一号开关必须保留不可使用！
 * 
 * @param 武器偏移Y
 * @type Number
 * @desc 武器偏移Y
 * @default 0
 *
 * @param 挥舞速度
 * @type Number
 * @desc 挥舞速度
 * @default 1.5
 *
  *@param 拉伸调整武器角度
 * @type Number
 * @desc 拉伸调整武器角度
 * @default 1
 *
 *  @param 1~3强化光效ID
 *  @type Number
 *  @desc 图标ID
 *  @default 289
 *
 *  @param 4~6强化光效ID
 *  @type Number
 *  @desc 图标ID
 *  @default 290
 *
 *  @param 7~9强化光效ID
 *  @type Number
 *  @desc 图标ID
 *  @default 291
 *
 *  @param 9以上强化光效ID
 *  @type Number
 *  @desc 图标ID
 *  @default 292
 * 
 */

var weaponSprite = weaponSprite || {};
weaponSprite.parameters = PluginManager.parameters('SSMBS_WeaponSprite');


weaponSprite.offsetY =  Number(weaponSprite.parameters['武器偏移Y'] || 0);
weaponSprite.swingSpeed = Number(weaponSprite.parameters['挥舞速度'] || 1.5);
weaponSprite.scaleSetAdjust = Number(weaponSprite.parameters['拉伸调整武器角度'] || 1);
weaponSprite.upgradeIconID1 = Number(weaponSprite.parameters['1~3强化光效ID'] || 289);
weaponSprite.upgradeIconID2 = Number(weaponSprite.parameters['4~6强化光效ID'] || 290);
weaponSprite.upgradeIconID3 = Number(weaponSprite.parameters['7~9强化光效ID'] || 291);
weaponSprite.upgradeIconID4 = Number(weaponSprite.parameters['9以上强化光效ID'] || 292);

const _wsprite_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_wsprite_mapLoad.call(this);
	weaponSprite.mapThis = this;
};

const _wsprite_createLowerLayer = Spriteset_Map.prototype.createLowerLayer
Spriteset_Map.prototype.createLowerLayer = function() {
	_wsprite_createLowerLayer.call(this);
	weaponSprite.scene = this;
	this.clearAllWeapons();
	this.setPlayerMember();
	this.showWeaponSprite();
	
};

const _wsprite_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
	_wsprite_update.call(this);
	if($gameSwitches.value(1)){	
		this.clearAllWeapons();
		this.setEnemyMember();
		this.showWeaponSprite();
		$gameSwitches.setValue(1,false);
	};
	this.updateWeapons();
};

Spriteset_Map.prototype.updateWeapons = function() {
	for( i in this.weaponSpriteArray ){
		var char = this.weaponSpriteArray[i].user;
		if( char == $gamePlayer ){
			var userMember = $gameParty.members()[0];
		}else if( char._memberIndex ){
			var userMember = $gameParty.members()[char._memberIndex]
		}else{
			var userMember = char._battler
		}
		if(userMember && userMember._actorId)	{
			var scale = userMember.weapons()[0].meta.scale?
						Number(userMember.weapons()[0].meta.scale):1;
			var iconSet = userMember.weapons()[0].meta.showInMap?Number(userMember.weapons()[0].meta.showInMap):userMember.weapons()[0].iconIndex;
		}else if(userMember){
			var dataEnemy = $dataEnemies[userMember._enemyId];
			var char = $gameMap.events()[userMember.eventId]
			var scale = dataEnemy.meta.weaponScale?
						Number(dataEnemy.meta.weaponScale):1;
			var iconSet = dataEnemy.meta.weapon?
						  Number(dataEnemy.meta.weapon):1;
		}else{
			var scale = 0;
			var iconSet = 0;
		}
		if(userMember && userMember._actorId){
			var dataShield = $dataArmors[userMember._equips[1]._itemId];
			var scaleShield = dataShield.meta.scale?
						Number(dataShield.meta.scale):1;
			var iconSetShield = dataShield.meta.showInMap?Number(dataShield.meta.showInMap):dataShield.iconIndex;
		}else if (userMember && !userMember._actorId){
			var dataEnemy = $dataEnemies[userMember._enemyId];
			var scaleShield = dataEnemy.meta.shieldScale?
						Number(dataEnemy.meta.shieldScale) : 1;
			var iconSetShield = dataEnemy.meta.shield?
	 					  Number(dataEnemy.meta.shield) : 0 ;
		};
		if(!userMember || (userMember && (userMember.isStateAffected(1) || userMember._hp <= 0))){
			if( this.weaponSpriteArray[i] ){
				this.weaponSpriteArray[i].bitmap.opacity = 0;
				this.weaponSpriteArray[i].destroy();
				this._tilemap.removeChild(this.weaponSpriteArray[i]);
				this.weaponSpriteArray.splice(i,1)
			}
			
			if(this.weaponUpgradeIconsArray[i]){
				this.weaponUpgradeIconsArray[i].bitmap.opacity = 0;
				this.weaponUpgradeIconsArray[i].destroy();
				this._tilemap.removeChild(this.weaponUpgradeIconsArray[i]);
				this.weaponUpgradeIconsArray.splice(i,1)
			}
			
			if(this.ShieldSpriteArray[i]){
				this.ShieldSpriteArray[i].bitmap.opacity = 0;
				this.ShieldSpriteArray[i].destroy();
				this._tilemap.removeChild( this.ShieldSpriteArray[i]);
				this.ShieldSpriteArray.splice(i,1)
			}
			 
		}
		if(this.weaponUpgradeIconsArray[i]){
			this.weaponUpgradeIconsArray[i].x = this.weaponSpriteArray[i].x;
			this.weaponUpgradeIconsArray[i].y = this.weaponSpriteArray[i].y;
			this.weaponUpgradeIconsArray[i].z = this.weaponSpriteArray[i].z;
			this.weaponUpgradeIconsArray[i].scale.x = this.weaponSpriteArray[i].scale.x;
			this.weaponUpgradeIconsArray[i].scale.y = this.weaponSpriteArray[i].scale.y;
			this.weaponUpgradeIconsArray[i].anchor.x = this.weaponSpriteArray[i].anchor.x;
			this.weaponUpgradeIconsArray[i].anchor.y = this.weaponSpriteArray[i].anchor.y;
			this.weaponUpgradeIconsArray[i]._stayTime = this.weaponSpriteArray[i]._stayTime;
			this.weaponUpgradeIconsArray[i].angle = this.weaponSpriteArray[i].angle;

		}
		if(char.isAttack > 0){
			char._stepAnime = false;
			if((char._direction == 2 || char._direction == 8) && !char.isMoving()){
				if( char.pose == 'swingUp' ){
					char._pattern = 2;
				}else if (char.pose == 'swingDown') {
					char._pattern = 0;
				}
			}else if((char._direction == 4 || char._direction == 6) && !char.isMoving()){
				if( char.pose == 'swingUp' ){
					char._pattern = 0;
				}else if (char.pose == 'swingDown') {
					char._pattern = 2;
				}
			}
		}
		
		scaleset = scale * weaponSprite.scaleSetAdjust ;
		if(this.weaponSpriteArray[i] && userMember){
			if(userMember && (userMember.isStateAffected(1) || userMember._hp <= 0)){
				this.weaponSpriteArray[i].opacity = 0 ;
			}
			if(userMember && $gameParty.enhanceWeapons && this.weaponUpgradeIconsArray[i]){
				if( $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes == 0 ){
					var upgradeIcon = $dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon?
								  	  Number($dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon):0;
					this.weaponUpgradeIconsArray[i].setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,31,31);
					
				}
				if( $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes > 0 && $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes <= 3 ){
					var upgradeIcon = $dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon1?
								  	  Number($dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon1):weaponSprite.upgradeIconID1;
					this.weaponUpgradeIconsArray[i].setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,31,31);
					
				}
				if( $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes > 3 && $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes <= 6 ){
					var upgradeIcon = $dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon2?
								  	  Number($dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon2):weaponSprite.upgradeIconID2;
					this.weaponUpgradeIconsArray[i].setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,31,31);
					
				}
				if( $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes > 6 && $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes <= 9 ){
					var upgradeIcon = $dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon3?
								  	  Number($dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon3):weaponSprite.upgradeIconID3;
					this.weaponUpgradeIconsArray[i].setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,31,31);
					
				}
				if( $gameParty.enhanceWeapons[userMember._equips[0]._itemId-1].enhanceTimes > 9){
					var upgradeIcon = $dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon4?
								  	  Number($dataWeapons[userMember._equips[0]._itemId].meta.upgradeIcon4):weaponSprite.upgradeIconID4;
					this.weaponUpgradeIconsArray[i].setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,31,31);
					
				}
				if(this.weaponUpgradeIconsArray[i].opacity == 255){
					this.weaponUpgradeIconsArray[i].opacityAdjuctMode = '-'
				}
				if(this.weaponUpgradeIconsArray[i].opacity == 128){
					this.weaponUpgradeIconsArray[i].opacityAdjuctMode = '+'
				}
				if(this.weaponUpgradeIconsArray[i].opacityAdjuctMode == '-'){
					this.weaponUpgradeIconsArray[i].opacity --; 
				}
				if(this.weaponUpgradeIconsArray[i].opacityAdjuctMode == '+'){
					this.weaponUpgradeIconsArray[i].opacity ++; 
				}
			}

			
			this.weaponSpriteArray[i].setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,31,31);
			this.ShieldSpriteArray[i].setFrame(iconSetShield % 16*32,Math.floor(iconSetShield / 16)*32,31,31);
			if( char.isAttack <= 0 ){
				char._stepAnime = false;
				
				if( char._direction == 2){


					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX();
					this.ShieldSpriteArray[i].y = char.screenY()-18;
					this.ShieldSpriteArray[i].z = char.screenZ()-1;
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-17;
					this.ShieldSpriteArray[i].scale.x = 1;

					var angle = -90-15*scaleset ;

					this.weaponSpriteArray[i].z = 1
					this.weaponSpriteArray[i].x = char.screenX();
					if( char._pattern == 2 ){
						this.weaponSpriteArray[i].y = char.screenY()-15 + weaponSprite.offsetY ;
					}else{
						this.weaponSpriteArray[i].y = char.screenY()-16 + weaponSprite.offsetY;
					}
					this.weaponSpriteArray[i].anchor.x = 0.5;
					this.weaponSpriteArray[i].anchor.y = 0.5;
					this.weaponSpriteArray[i].scale.y = scale;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x < 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y > 0) this.weaponSpriteArray[i].scale.y *= -1;
				}else if (char._direction == 4) {

					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX()+6;
					this.ShieldSpriteArray[i].y = char.screenY()-16;
					this.ShieldSpriteArray[i].z = char.screenZ()-1;
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-15;
					this.ShieldSpriteArray[i].scale.x = 0.75;

					var angle = -90-15*scaleset ;
					this.weaponSpriteArray[i].x = char.screenX()+6;
					this.weaponSpriteArray[i].z = 1
					if( char._pattern == 2 ){
						this.weaponSpriteArray[i].y = char.screenY()-11 + weaponSprite.offsetY;
					}else{
						this.weaponSpriteArray[i].y = char.screenY()-12 + weaponSprite.offsetY;
					}
					this.weaponSpriteArray[i].anchor.x = 0.5;
					this.weaponSpriteArray[i].anchor.y = 0.5;
					this.weaponSpriteArray[i].scale.y = scale*0.7;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x < 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y > 0) this.weaponSpriteArray[i].scale.y *= -1;
				}else if (char._direction == 6) {

					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX()-6;
					this.ShieldSpriteArray[i].y = char.screenY()-16;
					this.ShieldSpriteArray[i].z = char.screenZ()-1;
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-15;
					this.ShieldSpriteArray[i].scale.x = 0.75;

					var angle = 90+15*scaleset ;
					this.weaponSpriteArray[i].x = char.screenX()-6;
					this.weaponSpriteArray[i].z = 1
					if( char._pattern == 2 ){
						this.weaponSpriteArray[i].y = char.screenY()-11 + weaponSprite.offsetY;
					}else{
						this.weaponSpriteArray[i].y = char.screenY()-12 + weaponSprite.offsetY;
					}
					this.weaponSpriteArray[i].anchor.x = 0.5;
					this.weaponSpriteArray[i].anchor.y = 0.5;
					this.weaponSpriteArray[i].scale.y = scale*0.7;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x > 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y > 0) this.weaponSpriteArray[i].scale.y *= -1;
				}else if (char._direction == 8) {

					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX();
					this.ShieldSpriteArray[i].y = char.screenY()-14;
					this.ShieldSpriteArray[i].z = char.screenZ();
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-13;
					this.ShieldSpriteArray[i].scale.x = 1;

					var angle = 90+15*scaleset;
					this.weaponSpriteArray[i].z = $gamePlayer.screenZ();
					this.weaponSpriteArray[i].x = char.screenX();
					if( char._pattern == 2 ){
						this.weaponSpriteArray[i].y = char.screenY()-11 + weaponSprite.offsetY;
					}else{
						this.weaponSpriteArray[i].y = char.screenY()-12 + weaponSprite.offsetY;
					}
					this.weaponSpriteArray[i].anchor.x = 0.5;
					this.weaponSpriteArray[i].anchor.y = 0.5;
					this.weaponSpriteArray[i].scale.y = scale;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x > 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y > 0) this.weaponSpriteArray[i].scale.y *= -1;
				}
				this.weaponSpriteArray[i].angle = angle;
			}else{
				
				var deltaAngle = 30;
				var swingLimit = 270;
				if( char._direction == 2){
					swingLimit = 250;
				}
				if(char.pose == 'shoot'){
					var shootBack = ( 30 - char.isAttack )/2;
				}else{
					var shootBack = 0;
				}
				
				
				if( char.pose == 'swingDown'){
					var swingAngle = deltaAngle * ( 30 - char.isAttack )*weaponSprite.swingSpeed > swingLimit?
								 	 swingLimit : deltaAngle * ( 30 - char.isAttack )*weaponSprite.swingSpeed;
				}else if( char.pose == 'swingUp' ){
					
					swingLimit = 315;
					if (char._direction == 4 || char._direction == 6 ) swingLimit = 270;

					swingAngle = -swingAngle;
					var swingAngle = deltaAngle * ( 30 - char.isAttack )*weaponSprite.swingSpeed > swingLimit?
									 -swingLimit : -deltaAngle * ( 30 - char.isAttack )*weaponSprite.swingSpeed;

				}else if( char.pose == 'thrust' ){
					var swingAngle = 135;
					if (char._direction == 4 || char._direction == 6 ) swingAngle = 225;

				}
				if( char._direction == 2){
					

					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX()+8;
					this.ShieldSpriteArray[i].y = char.screenY()-12;
					this.ShieldSpriteArray[i].z = char.screenZ();
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-11;
					this.ShieldSpriteArray[i].scale.x = 1;

					this.weaponSpriteArray[i].angle = swingAngle + 120 ;
					if( swingAngle >= swingLimit ){
						this.weaponSpriteArray[i].z = 1;
					}else{
						this.weaponSpriteArray[i].z = $gamePlayer.screenZ()-1;
					}
					if(!xoffset){
						var xoffset = 0
					}else{
						xoffset ++
					}
					this.weaponSpriteArray[i].y = char.screenY()-4;
					this.weaponSpriteArray[i].anchor.x = 1;
					this.weaponSpriteArray[i].anchor.y = 0.7;
					
					this.weaponSpriteArray[i].scale.y = scale;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x < 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y > 0) this.weaponSpriteArray[i].scale.y *= -1;
					if( char.pose == 'shoot' ){
						this.weaponSpriteArray[i].anchor.x = 0.5;
						this.weaponSpriteArray[i].anchor.y = 0.5;
						this.weaponSpriteArray[i].x = char.screenX();
						this.weaponSpriteArray[i].y = char.screenY()-shootBack-24  + weaponSprite.offsetY;
					}
					if( char.pose == 'swingUp' ){
						this.weaponSpriteArray[i].angle = swingAngle + 180 -45
						if( char.isAttack <= 25){
							this.weaponSpriteArray[i].z = char.screenZ()+1;
						}else{
							this.weaponSpriteArray[i].z = char.screenZ()+1;
						}
						this.weaponSpriteArray[i].anchor.x = 0.7;
						this.weaponSpriteArray[i].anchor.y = 1;
						this.weaponSpriteArray[i].y = char.screenY()-3 + weaponSprite.offsetY;
						this.weaponSpriteArray[i].x = char.screenX()-4;
					}else{
						this.weaponSpriteArray[i].x = char.screenX()-4;
					}
				}else if (char._direction == 4) {

					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX()-12;
					this.ShieldSpriteArray[i].y = char.screenY()-14;
					this.ShieldSpriteArray[i].z = char.screenZ()-1;
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-13;
					this.ShieldSpriteArray[i].scale.x = 0.5;
					
					this.weaponSpriteArray[i].angle =  - swingAngle - 180 ;
					this.weaponSpriteArray[i].x = char.screenX()+4;
					this.weaponSpriteArray[i].z = $gamePlayer.screenZ()+2;
					this.weaponSpriteArray[i].y = char.screenY()-16 + weaponSprite.offsetY;
					this.weaponSpriteArray[i].anchor.x = 1;
					this.weaponSpriteArray[i].anchor.y = 0.7;
					
					this.weaponSpriteArray[i].scale.y = scale;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x < 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y < 0) this.weaponSpriteArray[i].scale.y *= -1;
					if( char.pose == 'shoot' ){
						this.weaponSpriteArray[i].anchor.x = 0.5;
						this.weaponSpriteArray[i].anchor.y = 0.5;
						this.weaponSpriteArray[i].x = char.screenX()+shootBack-18;
						this.weaponSpriteArray[i].y = char.screenY()-24 + weaponSprite.offsetY;
					}
					if( char.pose == 'swingUp' ){
						this.ShieldSpriteArray[i].x = char.screenX()-0;
						this.ShieldSpriteArray[i].scale.x = 1;
						this.ShieldSpriteArray[i].z = char.screenZ();
						this.weaponSpriteArray[i].z = $gamePlayer.screenZ()-1;
						this.weaponSpriteArray[i].anchor.x = 0.7;
						this.weaponSpriteArray[i].anchor.y = 1;
						this.weaponSpriteArray[i].angle =  - swingAngle - 270 
						this.weaponSpriteArray[i].x = char.screenX() ;
						this.weaponSpriteArray[i].y = char.screenY() - 24 + weaponSprite.offsetY;
						
					}
				}else if (char._direction == 6) {

					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX()+12;
					this.ShieldSpriteArray[i].y = char.screenY()-14;
					this.ShieldSpriteArray[i].z = char.screenZ()-1;
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-13;
					this.ShieldSpriteArray[i].scale.x = 0.5;

					this.weaponSpriteArray[i].angle =  swingAngle + 180;
					this.weaponSpriteArray[i].x = char.screenX()-4;
					this.weaponSpriteArray[i].z = $gamePlayer.screenZ()+2;
					this.weaponSpriteArray[i].y = char.screenY()-16 + weaponSprite.offsetY;
					this.weaponSpriteArray[i].anchor.x = 1;
					this.weaponSpriteArray[i].anchor.y = 0.7;
					
					this.weaponSpriteArray[i].scale.y = scale;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x > 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y < 0) this.weaponSpriteArray[i].scale.y *= -1;
					if( char.pose == 'shoot' ){
						this.weaponSpriteArray[i].anchor.x = 0.5;
						this.weaponSpriteArray[i].anchor.y = 0.5;
						this.weaponSpriteArray[i].x = char.screenX()-shootBack+18;
						this.weaponSpriteArray[i].y = char.screenY()-24 + weaponSprite.offsetY;
					}
					if( char.pose == 'swingUp' ){
						this.ShieldSpriteArray[i].x = char.screenX()+0;
						this.ShieldSpriteArray[i].scale.x = 1;
						this.ShieldSpriteArray[i].z = char.screenZ();
						this.weaponSpriteArray[i].z = $gamePlayer.screenZ()-1;
						this.weaponSpriteArray[i].anchor.x = 0.7;
						this.weaponSpriteArray[i].anchor.y = 1;
						this.weaponSpriteArray[i].angle =  swingAngle + 270;
						this.weaponSpriteArray[i].x = char.screenX();
						this.weaponSpriteArray[i].y = char.screenY() - 24 + weaponSprite.offsetY;
						
					}
				}else if (char._direction == 8) {

					//盾牌设定
					this.ShieldSpriteArray[i].x = char.screenX()-12;
					this.ShieldSpriteArray[i].y = char.screenY()-14;
					this.ShieldSpriteArray[i].z = char.screenZ()-1;
					if( char._pattern == 2 ) this.ShieldSpriteArray[i].y = char.screenY()-13;
					this.ShieldSpriteArray[i].scale.x = 1;

					this.weaponSpriteArray[i].angle =  swingAngle + 180;
					this.weaponSpriteArray[i].z = 1
					this.weaponSpriteArray[i].x = char.screenX();
					this.weaponSpriteArray[i].y = char.screenY()-19 + weaponSprite.offsetY;
					this.weaponSpriteArray[i].anchor.x = 1;
					this.weaponSpriteArray[i].anchor.y = 0.7;
					this.weaponSpriteArray[i].x = char.screenX()+8;
					this.weaponSpriteArray[i].scale.y = scale;
					this.weaponSpriteArray[i].scale.x = scale;
					if( this.weaponSpriteArray[i].scale.x > 0) this.weaponSpriteArray[i].scale.x *= -1;
					if( this.weaponSpriteArray[i].scale.y < 0) this.weaponSpriteArray[i].scale.y *= -1;
					if( char.pose == 'swingUp' ){
						this.weaponSpriteArray[i].anchor.x = 0.7;
						this.weaponSpriteArray[i].anchor.y = 1;
						this.weaponSpriteArray[i].y = char.screenY()-27 + weaponSprite.offsetY;
						if( this.weaponSpriteArray[i].scale.x > 0) this.weaponSpriteArray[i].scale.x *= -1;
					}
					if( char.pose == 'shoot' ){
						this.weaponSpriteArray[i].anchor.x = 0.5;
						this.weaponSpriteArray[i].anchor.y = 0.5;
						this.weaponSpriteArray[i].x = char.screenX();
						this.weaponSpriteArray[i].y = char.screenY()+shootBack-24 + weaponSprite.offsetY;
					}
				}
			}
		}
	};
};

Spriteset_Map.prototype.setPlayerMember = function() {
	this.weaponUsers = [];
	this.shieldUser = [];
	this.weaponSpriteArray = [];
	this.ShieldSpriteArray = [];
	this.weaponUpgradeIconsArray = [];
	for ( i in $gameParty.members()){
		if( i == 0 ){
			var user = $gamePlayer;
		}else{
			var user = $gamePlayer._followers._data[i-1]
		}
		this.weaponUsers.push(user)
	}
};
Spriteset_Map.prototype.setEnemyMember = function() {
	for ( i in $gameMap.events() ){
		var event = $gameMap.events()[i];
		this.weaponUsers.push(event);
	}
}

Spriteset_Map.prototype.showWeaponSprite = function(){
	for( i in this.weaponUsers ){
		var user = this.weaponUsers[i];
		this.createWeaponSprite(user)
	};
};

Spriteset_Map.prototype.clearAllWeapons = function(){
	for( i in this.weaponSpriteArray ){
		var weapon = this.weaponSpriteArray[i];
		weapon.bitmap.opacity = 0;
		weapon.destroy();
		this._tilemap.removeChild(weapon);
		this.weaponSpriteArray.splice(i,1)
	};
	for( i in this.weaponUpgradeIconsArray ){
		var weapon = this.weaponUpgradeIconsArray[i];
		weapon.bitmap.opacity = 0;
		weapon.destroy();
		this._tilemap.removeChild(weapon);
		this.weaponUpgradeIconsArray.splice(i,1)
	};
	for( i in this.ShieldSpriteArray ){
		var weapon = this.ShieldSpriteArray[i];
		weapon.bitmap.opacity = 0;
		weapon.destroy();
		this._tilemap.removeChild(weapon);
		this.ShieldSpriteArray.splice(i,1)
	};
};

Spriteset_Map.prototype.createWeaponSprite = function(user){
	if( user == $gamePlayer ){
		var userMember = $gameParty.members()[0]
	}else if(user._memberIndex){
		var userMember = $gameParty.members()[user._memberIndex];
	}else if(user._battler){
		var userMember = user._battler
	}else {
		var userMember = null;
	};
	if(userMember){
		if(userMember._actorId){
			var dataWeapon = $dataWeapons[userMember._equips[0]._itemId];
			var scale = dataWeapon.meta.scale?
						Number(dataWeapon.meta.scale):1;
			var iconSet = dataWeapon.meta.showInMap?Number(dataWeapon.meta.showInMap):dataWeapon.iconIndex;
		}else{
			var dataEnemy = $dataEnemies[userMember._enemyId];
			var scale = dataEnemy.meta.weaponScale?
						Number(dataEnemy.meta.weaponScale) : 1;
			var iconSet = dataEnemy.meta.weapon?
	 					  Number(dataEnemy.meta.weapon) : 0 ;
		};
		this.weaponSprite = new Sprite();
		this.weaponSprite.user = user;
		this.weaponSprite.bitmap =  ImageManager.loadSystem("IconSet");
		this.weaponSprite.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,31,31);
		this.weaponSprite.x = this.weaponSprite.user.screenX();
		this.weaponSprite.y = this.weaponSprite.user.screenY()-18 + weaponSprite.offsetY;
		this.weaponSprite.z = 0;
		this.weaponSprite.anchor.x = 0.5;
		this.weaponSprite.anchor.y = 0.5;
		this.weaponSprite.scale.x = scale?Number(scale):1;
		this.weaponSprite.scale.y = scale?Number(scale):1;
		this.weaponSprite.bitmap.smooth = false;
		this.weaponSprite._stayTime = 30;
		if(userMember._hp >1 ){
			this.weaponSprite.opacity = 255;
		}else{
			this.weaponSprite.opacity = 0;
		}
		this._tilemap.addChild(this.weaponSprite);
		this.weaponSpriteArray.push(this.weaponSprite);
		if( userMember._actorId && $gameParty.enhanceWeapons ){
			
			this.weaponSpriteUpgrade = new Sprite();
			this.weaponSpriteUpgrade.bitmap = ImageManager.loadSystem("IconSet");
			this.weaponSpriteUpgrade.setFrame(0 % 16*32,Math.floor(0 / 16)*32,31,31);
			this.weaponSpriteUpgrade.x = this.weaponSprite.x;
			this.weaponSpriteUpgrade.y = this.weaponSprite.y;
			this.weaponSpriteUpgrade.z = this.weaponSprite.z;
			this.weaponSpriteUpgrade.scale.x = this.weaponSprite.scale.x;
			this.weaponSpriteUpgrade.scale.y = this.weaponSprite.scale.y;
			this.weaponSpriteUpgrade.anchor.x = this.weaponSprite.anchor.x;
			this.weaponSpriteUpgrade.anchor.y = this.weaponSprite.anchor.y;
			this.weaponSpriteUpgrade._stayTime = this.weaponSprite._stayTime;
			if(userMember._hp >1 ){
				this.weaponSpriteUpgrade.opacity = 255;
			}else{
				this.weaponSpriteUpgrade.opacity = 0;
			}
			this._tilemap.addChild(this.weaponSpriteUpgrade);
			this.weaponUpgradeIconsArray.push(this.weaponSpriteUpgrade);
		}
		if(userMember._actorId){
			var dataShield = $dataArmors[userMember._equips[1]._itemId];
			var scale = dataShield.meta.scale?
						Number(dataShield.meta.scale):1;
			var iconSet = dataShield.meta.showInMap?Number(dataShield.meta.showInMap):dataShield.iconIndex;
		}else{
			var dataEnemy = $dataEnemies[userMember._enemyId];
			var scale = dataEnemy.meta.shieldScale?
						Number(dataEnemy.meta.shieldScale) : 1;
			var iconSet = dataEnemy.meta.shield?
	 					  Number(dataEnemy.meta.shield) : 0 ;
		};
		this.ShieldSprite = new Sprite();
		this.ShieldSprite.user = user;
		this.ShieldSprite.bitmap =  ImageManager.loadSystem("IconSet");
		this.ShieldSprite.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,31,31);
		this.ShieldSprite.x = this.ShieldSprite.user.screenX();
		this.ShieldSprite.y = this.ShieldSprite.user.screenY()-18 + weaponSprite.offsetY;
		this.ShieldSprite.z = 0;
		this.ShieldSprite.anchor.x = 0.5;
		this.ShieldSprite.anchor.y = 0.5;
		this.ShieldSprite.scale.x = scale?Number(scale):1;
		this.ShieldSprite.scale.y = scale?Number(scale):1;
		this.ShieldSprite.bitmap.smooth = false;
		this.ShieldSprite._stayTime = 30;
		if(userMember._hp >1 ){
			this.ShieldSprite.opacity = 255;
		}else{
			this.ShieldSprite.opacity = 0;
		}
		this._tilemap.addChild(this.ShieldSprite);
		this.ShieldSpriteArray.push(this.ShieldSprite);
		// if( userMember._actorId && $gameParty.enhanceWeapons ){
			
		// 	this.weaponSpriteUpgrade = new Sprite();
		// 	this.weaponSpriteUpgrade.bitmap = ImageManager.loadSystem("IconSet");
		// 	this.weaponSpriteUpgrade.setFrame(0 % 16*32,Math.floor(0 / 16)*32,31,31);
		// 	this.weaponSpriteUpgrade.x = this.weaponSprite.x;
		// 	this.weaponSpriteUpgrade.y = this.weaponSprite.y;
		// 	this.weaponSpriteUpgrade.z = this.weaponSprite.z;
		// 	this.weaponSpriteUpgrade.scale.x = this.weaponSprite.scale.x;
		// 	this.weaponSpriteUpgrade.scale.y = this.weaponSprite.scale.y;
		// 	this.weaponSpriteUpgrade.anchor.x = this.weaponSprite.anchor.x;
		// 	this.weaponSpriteUpgrade.anchor.y = this.weaponSprite.anchor.y;
		// 	this.weaponSpriteUpgrade._stayTime = this.weaponSprite._stayTime;
		// 	if(userMember._hp >1 ){
		// 		this.weaponSpriteUpgrade.opacity = 255;
		// 	}else{
		// 		this.weaponSpriteUpgrade.opacity = 0;
		// 	}
		// 	this._tilemap.addChild(this.weaponSpriteUpgrade);
		// 	this.weaponUpgradeIconsArray.push(this.weaponSpriteUpgrade);
		// }
		


	}
};