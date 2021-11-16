//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Avatar
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 纸娃娃插件
 * @author 神仙狼
 *
 * @help
 * 在角色的行走图上覆盖头盔、发型、铠甲、光环的行走图
 * 行走图的位置在character文件夹中，最好是单行走图。
 * 在需要显示外观的头盔、铠甲和光环状态中备注<img:行走图名称>即可
 * 发型可以设置色调，但不建议使用
 * 
 * @param 主角发型变量ID
 * @type Number
 * @desc 主角发型变量ID
 * @default 10
 *
 * @param 发型红色调变量ID
 * @type Number
 * @desc 主角发型变量ID
 * @default 11
 *
 * @param 发型绿色调变量ID
 * @type Number
 * @desc 主角发型变量ID
 * @default 12
 *
 * @param 发型蓝色调变量ID
 * @type Number
 * @desc 主角发型变量ID
 * @default 13
 *
 * @param 发型灰色调变量ID
 * @type Number
 * @desc 主角发型变量ID
 * @default 14
 *
 * @param 武器渐隐
 * @type Number
 * @desc 武器渐隐，参数为每秒钟减低透明度的值，0为不渐隐。这个效果可以一定程度上弥补穿模的视觉效果
 * @default 30
 *
 * @param 光环呼吸效果
 * @type Number
 * @desc 是否开启光环呼吸效果，如果开启则光环会随时间缩放，0为关闭，1为打开
 * @default 0
 *
 * @param 光环范围效果
 * @type Number
 * @desc 是否开启光环范围效果，如果开启光环范围越大光环图像越大，0为关闭，1为打开
 * @default 0
 *
 * @param 武器偏移Y
 * @type Number
 * @desc 武器偏移Y
 * @default 0
 * 
 * @param 默认挥舞特效图片名称
 * @type Number
 * @desc 默认挥舞特效图片名称,图片储存在img/system中
 * @default swingCircle
 *
 * @param 武器强化光效1~3
 * @type Number
 * @desc 武器强化光效1~3的图标ID
 * @default 289
 *
 * @param 武器强化光效4~6
 * @type Number
 * @desc 武器强化光效4~6的图标ID
 * @default 290
 *
 * @param 武器强化光效7~9
 * @type Number
 * @desc 武器强化光效7~9的图标ID
 * @default 291
 *
 * @param 武器强化光效10~12
 * @type Number
 * @desc 武器强化光效10~12的图标ID
 * @default 292
 *
 * @param 武器强化光效13~15
 * @type Number
 * @desc 武器强化光效13~15的图标ID
 * @default 292
 *
 * @param 武器强化光效16+
 * @type Number
 * @desc 武器强化光效4~6的图标ID
 * @default 292
 * 
*/
var avatarParameters = PluginManager.parameters('SSMBS_Avartar');
var hairParamN = Number(avatarParameters['主角发型变量ID'] || 10);
var hairParamR = Number(avatarParameters['发型红色调变量ID'] || 11);
var hairParamG = Number(avatarParameters['发型绿色调变量ID'] || 12);
var hairParamB = Number(avatarParameters['发型蓝色调变量ID'] || 13);
var hairParamT = Number(avatarParameters['发型灰色调变量ID'] || 14);
var weaponFade = Number(avatarParameters['武器渐隐'] || 30);
var offsetY = Number(avatarParameters['武器偏移Y'] || 0);
var auraBreath = Number(avatarParameters['光环呼吸效果'] || 0);
var auraScale = Number(avatarParameters['光环范围效果'] || 0);
var defaultSwingLight = String(avatarParameters['默认挥舞特效图片名称'] || 'swingCircle');

var upgrade1 = Number(avatarParameters['武器强化光效1~3'] || 289);
var upgrade2 = Number(avatarParameters['武器强化光效4~6'] || 290);
var upgrade3 = Number(avatarParameters['武器强化光效7~9'] || 291);
var upgrade4 = Number(avatarParameters['武器强化光效10~12'] || 292);
var upgrade5 = Number(avatarParameters['武器强化光效13~15'] || 292);
var upgrade6 = Number(avatarParameters['武器强化光效16+'] || 292);

var showWeaponZ = 0;
var showArmorZ = 0;
var showShieldZ = 0;
var playerPattern = 0;
var playerPatternCount = 0;

//-----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.

function Sprite_Character() {
	this.initialize(...arguments);
}

Sprite_Character.prototype = Object.create(Sprite.prototype);
Sprite_Character.prototype.constructor = Sprite_Character;

Sprite_Character.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);

};

Sprite_Character.prototype.initMembers = function() {
	this.dataActor = $dataActors[$gameParty.members()[0]._actorId];
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_Character.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_Character.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_Character.prototype.update = function() {
	Sprite.prototype.update.call(this);
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
};

Sprite_Character.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_Character.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_Character.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_Character.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_Character.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Character.prototype.updateBitmap = function() {
	let storeStepAnim = this._character._stepAnime;
	if( this._character.characterName() && this._character == $gamePlayer ){
		this.dataActor = $dataActors[$gameParty.members()[0]._actorId];
		if(this.dataActor.meta._8dir){
			this.dataActor._8dir = true;
		}
	}
	if ( this._character.characterName() && this._character != $gamePlayer && this._character._memberIndex ){
		this.dataActor = $dataActors[$gameParty.members()[this._character._memberIndex]._actorId];
		if(this.dataActor.meta._8dir){
			this.dataActor._8dir = true;
		}
	}
	if ( this._character.characterName() && this._character != $gamePlayer && this._character._battler && this._character._battler._enemyId ){
		this.dataActor = $dataEnemies[this._character._battler._enemyId];
		if(this.dataActor.meta._8dir){
			this.dataActor._8dir = true;
		}
	}
	if(this.dataActor && this.dataActor.meta.loadAttackCharacter) {
		// this._character._stepAnime = true;
		this.poseCount = this._character.isAttack;
		if(this.poseCount==0){
			this._character.pose=null;
		}
		if(this.poseCount<this._character.poseDuration*0.7 && this.poseCount>0){
			this._character._pattern = 2;
		}
		if(this.poseCount>=this._character.poseDuration*0.7&&this.poseCount<=this._character.poseDuration*0.8){
			this._character._pattern = 1;
		}
		if(this.poseCount>this._character.poseDuration*0.8){
			this._character._pattern = 0;
		}
		playerPattern=this._character;
		playerPatternCount = this.poseCount;

		this._characterName = this._character.characterName();
		// if( this.dataActor && this.dataActor._8dir && 
		// 	(this._character._direction8dir== 1 || 
		// 	 this._character._direction8dir== 3 || 
		// 	 this._character._direction8dir== 7 || 
		// 	 this._character._direction8dir== 9 )){
		// 	this._characterName = this._character.characterName()+'_'+this._character.pose;
		// 	if(this._character._direction8dir==1){
		// 		this._character._direction = 4;
		// 	}
		// 	if(this._character._direction8dir==3){
		// 		this._character._direction = 2;
		// 	}
		// 	if(this._character._direction8dir==7){
		// 		this._character._direction = 6;
		// 	}
		// 	if(this._character._direction8dir==9){
		// 		this._character._direction = 8;
		// 	}
		// }
		if( this._character.pose == 'swingDown' ){
			this._character.poseAdjust = 1;
		}
		if( this._character.pose == 'swingUp' ){
			this._character.poseAdjust = 2;
		}
		if( this._character.pose == 'thrust' ){
			this._character.poseAdjust = 3;
		}
		if(this._character.isAttack<=1){
			this._character.poseAdjust = 0;
		}
	}else{

		this._characterName = this._character.characterName();

	}
	this._character._stepAnime = storeStepAnim;
	this._characterIndex = this._character.characterIndex();
	if (this._tileId > 0) {
		this.setTileBitmap();
	} else {
		this.setCharacterBitmap();
	}
	
};

Sprite_Character.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_Character.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Character.prototype.setCharacterBitmap = function() {

	// if( this._characterName.indexOf("_8dir")>-1 && this.preload8dir == false){
	// 	this._characterName = this._character.characterName();
	// 	this.bitmap = ImageManager.loadCharacter(this._characterName+'_8dir');
	// 	if(this.dataActor.meta.loadAttackCharacter){
	// 		this.bitmap = ImageManager.loadCharacter(this._characterName+'_swingDown');
	// 		this.bitmap = ImageManager.loadCharacter(this._characterName+'_swingUp');
	// 		this.bitmap = ImageManager.loadCharacter(this._characterName+'_thrust');
	// 	}
		
	// 	this.preload8dir = true;
	// }
	this.bitmap = ImageManager.loadCharacter(this._characterName);
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Character.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_Character.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Character.prototype.updateCharacterFrame = function() {
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
	const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
	this.updateHalfBodySprites();
	if (this._bushDepth > 0) {
		const d = this._bushDepth;
		this._upperBody.setFrame(sx, sy, pw, ph - d);
		this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
		if(this._characterName.indexOf("_8dir")>-1){
			this.setFrame(sx, sy, pw, ph);
		}else{
			this.setFrame(sx, sy, 0, ph);
		}
	} else {
		this.setFrame(sx, sy, pw, ph);
	}
};

Sprite_Character.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_Character.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_Character.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_Character.prototype.characterPatternY = function() {
	if(this._characterName.indexOf("_8dir")>-1){
		
		
		if(this._character._direction8dir==1){
			return 0+this._character.poseAdjust*8;
		}
		if(this._character._direction8dir==3){
			return 2+this._character.poseAdjust*8;
		}
		if(this._character._direction8dir==7){
			return 5+this._character.poseAdjust*8;
		}
		if(this._character._direction8dir==9){
			return 7+this._character.poseAdjust*8;
		}
		if(this._character.direction() == 2){
			return 1+this._character.poseAdjust*8;
		}
		if(this._character.direction() == 4){
			return 3+this._character.poseAdjust*8;
		}
		if(this._character.direction() == 6){
			return 4+this._character.poseAdjust*8;
		}
		if(this._character.direction() == 8){
			return 6+this._character.poseAdjust*8;
		}
		

	}else{
		if(this._characterName.indexOf("_motions")>-1){
			return (this._character.direction() - 2) / 2 + this._character.poseAdjust*4;
		}else{
			return (this._character.direction() - 2) / 2;
		}
		
	}
	
};

Sprite_Character.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_Character.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	}else if (this._characterName.indexOf("_8dir")>-1 && this._characterName.indexOf("_motions")<=-1){
		return this.bitmap.height / 8;
	}else if (this._characterName.indexOf("_8dir")>-1 && this._characterName.indexOf("_motions")>-1){
		return this.bitmap.height / 32;
	}else if (this._isBigCharacter && this._characterName.indexOf("_motions")>-1 ) {
		return this.bitmap.height / 16;
	}else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	}else {
		return this.bitmap.height / 8;
	} 
};

Sprite_Character.prototype.updateHalfBodySprites = function() {
	if (this._bushDepth > 0) {
		this.createHalfBodySprites();
		this._upperBody.bitmap = this.bitmap;
		this._upperBody.visible = true;
		this._upperBody.y = -this._bushDepth;
		this._lowerBody.bitmap = this.bitmap;
		this._lowerBody.visible = true;
		this._upperBody.setBlendColor(this.getBlendColor());
		this._lowerBody.setBlendColor(this.getBlendColor());
		this._upperBody.setColorTone(this.getColorTone());
		this._lowerBody.setColorTone(this.getColorTone());
		this._upperBody.blendMode = this.blendMode;
		this._lowerBody.blendMode = this.blendMode;
	} else if (this._upperBody) {
		this._upperBody.visible = false;
		this._lowerBody.visible = false;
	}
};

Sprite_Character.prototype.createHalfBodySprites = function() {
	if (!this._upperBody) {
		this._upperBody = new Sprite();
		this._upperBody.anchor.x = 0.5;
		this._upperBody.anchor.y = 1;
		this.addChild(this._upperBody);
	}
	if (!this._lowerBody) {
		this._lowerBody = new Sprite();
		this._lowerBody.anchor.x = 0.5;
		this._lowerBody.anchor.y = 1;
		this._lowerBody.opacity = 128;
		this.addChild(this._lowerBody);
	}
};

Sprite_Character.prototype.updatePosition = function() {
	this.x = this._character.screenX();
	this.y = this._character.screenY();
	this.z = this._character.screenZ();
	if(this._characterName.indexOf("_8dir")>-1){
		
		this.anchor.y = 0.75;
	}
	// if(this.scale.y<=1){
	// 	this.yDelta = '+'
	// }
	// if(this.scale.y>=1.02){
	// 	this.yDelta = '-'
	// }
	// if(this.yDelta == '+'){
	// 	this.scale.y += 0.0004;
	// 	this.scale.x += 0.0002;
	// }else{
	// 	this.scale.y -= 0.0004;
	// 	this.scale.x -= 0.0002;
	// }
};

Sprite_Character.prototype.updateOther = function() {
	this.opacity = this._character.opacity();
	this.blendMode = this._character.blendMode();
	this._bushDepth = this._character.bushDepth();
};

//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  铠甲精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

function Sprite_Armor() {
	this.initialize(...arguments);
}

Sprite_Armor.prototype = Object.create(Sprite.prototype);
Sprite_Armor.prototype.constructor = Sprite_Armor;

Sprite_Armor.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_Armor.prototype.initMembers = function() {
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_Armor.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_Armor.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_Armor.prototype.update = function() {
	Sprite.prototype.update.call(this);
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
};

Sprite_Armor.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_Armor.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_Armor.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_Armor.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_Armor.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Armor.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		if(this._character == $gamePlayer){
			var member = $gameParty.members()[0];
			var memberArmorImg = (member&&member.equips()[3]&&member.equips()[3].meta.img)?
								 member.equips()[3].meta.img:'$empty';
			var memberArmorIndex = (member&&member.equips()[3]&&member.equips()[3].meta.index)?
								 member.equips()[3].meta.index:'$empty';
		}else{
			var member = $gameParty.members()[this._character._memberIndex]
			var memberArmorImg = (member&&member.equips()[3]&&member.equips()[3].meta.img)?
								 member.equips()[3].meta.img:'$empty';
			var memberArmorIndex = (member&&member.equips()[3]&&member.equips()[3].meta.index)?
								   member.equips()[3].meta.index:'$empty';
		}
		this._characterName = memberArmorImg;
		if(member) member.armorImg = this._characterName;
		this._characterIndex = memberArmorIndex;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_Armor.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_Armor.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Armor.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadCharacter(this._characterName);
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Armor.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_Armor.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Armor.prototype.updateCharacterFrame = function() {
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
	const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
	this.updateHalfBodySprites();
	if (this._bushDepth > 0) {
		const d = this._bushDepth;
		this._upperBody.setFrame(sx, sy, pw, ph - d);
		this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
		this.setFrame(sx, sy, 0, ph);
	} else {
		this.setFrame(sx, sy, pw, ph);
	}
};

Sprite_Armor.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_Armor.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_Armor.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_Armor.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_Armor.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_Armor.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_Armor.prototype.updateHalfBodySprites = function() {
	if (this._bushDepth > 0) {
		this.createHalfBodySprites();
		this._upperBody.bitmap = this.bitmap;
		this._upperBody.visible = true;
		this._upperBody.y = -this._bushDepth;
		this._lowerBody.bitmap = this.bitmap;
		this._lowerBody.visible = true;
		this._upperBody.setBlendColor(this.getBlendColor());
		this._lowerBody.setBlendColor(this.getBlendColor());
		this._upperBody.setColorTone(this.getColorTone());
		this._lowerBody.setColorTone(this.getColorTone());
		this._upperBody.blendMode = this.blendMode;
		this._lowerBody.blendMode = this.blendMode;
	} else if (this._upperBody) {
		this._upperBody.visible = false;
		this._lowerBody.visible = false;
	}
};

Sprite_Armor.prototype.createHalfBodySprites = function() {
	if (!this._upperBody) {
		this._upperBody = new Sprite();
		this._upperBody.anchor.x = 0.5;
		this._upperBody.anchor.y = 1;
		this.addChild(this._upperBody);
	}
	if (!this._lowerBody) {
		this._lowerBody = new Sprite();
		this._lowerBody.anchor.x = 0.5;
		this._lowerBody.anchor.y = 1;
		this._lowerBody.opacity = 128;
		this.addChild(this._lowerBody);
	}
};

Sprite_Armor.prototype.updatePosition = function() {
	this.x = this._character.screenX();
	this.y = this._character.screenY();
	this.z = this._character.screenZ();
	if(this._character == $gamePlayer) showArmorZ = this.z
	// if(this.scale.y<=1){
	// 	this.yDelta = '+'
	// }
	// if(this.scale.y>=1.02){
	// 	this.yDelta = '-'
	// }
	// if(this.yDelta == '+'){
	// 	this.scale.y += 0.0004;
	// 	this.scale.x += 0.0002;
	// }else{
	// 	this.scale.y -= 0.0004;
	// 	this.scale.x -= 0.0002;
	// }
};

Sprite_Armor.prototype.updateOther = function() {
	this.opacity = this._character.opacity();
	this.blendMode = this._character.blendMode();
	this._bushDepth = this._character.bushDepth();
};


//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  帽子精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

function Sprite_Hat() {
	this.initialize(...arguments);
}

Sprite_Hat.prototype = Object.create(Sprite.prototype);
Sprite_Hat.prototype.constructor = Sprite_Hat;

Sprite_Hat.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_Hat.prototype.initMembers = function() {
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_Hat.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_Hat.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_Hat.prototype.update = function() {
	Sprite.prototype.update.call(this);
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
};

Sprite_Hat.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_Hat.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_Hat.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_Hat.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_Hat.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Hat.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		if(this._character == $gamePlayer){
			var member = $gameParty.members()[0];
			var memberArmorImg = (member&&member.equips()[2]&&member.equips()[2].meta.img)?
								 member.equips()[2].meta.img:'$empty';
			var memberArmorIndex = (member&&member.equips()[2]&&member.equips()[2].meta.index)?
								 member.equips()[2].meta.index:'$empty';
		}else{
			var member = $gameParty.members()[this._character._memberIndex]
			var memberArmorImg = (member&&member.equips()[2]&&member.equips()[2].meta.img)?
								 member.equips()[2].meta.img:'$empty';
			var memberArmorIndex = (member&&member.equips()[2]&&member.equips()[2].meta.index)?
								   member.equips()[2].meta.index:'$empty';
		}
		this._characterName = memberArmorImg;
		if(member)member.hatImg = this._characterName;
		this._characterIndex = memberArmorIndex;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_Hat.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_Hat.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Hat.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadCharacter(this._characterName);
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Hat.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_Hat.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Hat.prototype.updateCharacterFrame = function() {
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
	const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
	this.updateHalfBodySprites();
	if (this._bushDepth > 0) {
		const d = this._bushDepth;
		this._upperBody.setFrame(sx, sy, pw, ph - d);
		this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
		this.setFrame(sx, sy, 0, ph);
	} else {
		this.setFrame(sx, sy, pw, ph);
	}
};

Sprite_Hat.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_Hat.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_Hat.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_Hat.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_Hat.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_Hat.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_Hat.prototype.updateHalfBodySprites = function() {
	if (this._bushDepth > 0) {
		this.createHalfBodySprites();
		this._upperBody.bitmap = this.bitmap;
		this._upperBody.visible = true;
		this._upperBody.y = -this._bushDepth;
		this._lowerBody.bitmap = this.bitmap;
		this._lowerBody.visible = true;
		this._upperBody.setBlendColor(this.getBlendColor());
		this._lowerBody.setBlendColor(this.getBlendColor());
		this._upperBody.setColorTone(this.getColorTone());
		this._lowerBody.setColorTone(this.getColorTone());
		this._upperBody.blendMode = this.blendMode;
		this._lowerBody.blendMode = this.blendMode;
	} else if (this._upperBody) {
		this._upperBody.visible = false;
		this._lowerBody.visible = false;
	}
};

Sprite_Hat.prototype.createHalfBodySprites = function() {
	if (!this._upperBody) {
		this._upperBody = new Sprite();
		this._upperBody.anchor.x = 0.5;
		this._upperBody.anchor.y = 1;
		this.addChild(this._upperBody);
	}
	if (!this._lowerBody) {
		this._lowerBody = new Sprite();
		this._lowerBody.anchor.x = 0.5;
		this._lowerBody.anchor.y = 1;
		this._lowerBody.opacity = 128;
		this.addChild(this._lowerBody);
	}
};

Sprite_Hat.prototype.updatePosition = function() {
	this.x = this._character.screenX();
	this.y = this._character.screenY();
	this.z = this._character.screenZ();
	// if(this.scale.y<=1){
	// 	this.yDelta = '+'
	// }
	// if(this.scale.y>=1.02){
	// 	this.yDelta = '-'
	// }
	// if(this.yDelta == '+'){
	// 	this.scale.y += 0.0004;
	// 	this.scale.x += 0.0002;
	// }else{
	// 	this.scale.y -= 0.0004;
	// 	this.scale.x -= 0.0002;
	// }
};

Sprite_Hat.prototype.updateOther = function() {
	this.opacity = this._character.opacity();
	this.blendMode = this._character.blendMode();
	this._bushDepth = this._character.bushDepth();
};


//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  发型精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————


function Sprite_Hair() {
	this.initialize(...arguments);
}

Sprite_Hair.prototype = Object.create(Sprite.prototype);
Sprite_Hair.prototype.constructor = Sprite_Hair;

Sprite_Hair.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_Hair.prototype.initMembers = function() {
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_Hair.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_Hair.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_Hair.prototype.update = function() {
	Sprite.prototype.update.call(this);
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
};

Sprite_Hair.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_Hair.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_Hair.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_Hair.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_Hair.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Hair.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		 if(this._character == $gamePlayer){
			var member = $gameParty.members()[0];
		}else{
			var member = $gameParty.members()[this._character._memberIndex]
		}
		var hairImg = '$hair_' + $gameVariables.value(hairParamN);
		this._characterName = hairImg;
		member.hairImg = this._characterName;
		this._characterIndex = 0;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_Hair.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_Hair.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Hair.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadCharacter(this._characterName);
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Hair.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_Hair.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Hair.prototype.updateCharacterFrame = function() {
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
	const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
	this.updateHalfBodySprites();
	if (this._bushDepth > 0) {
		const d = this._bushDepth;
		this._upperBody.setFrame(sx, sy, pw, ph - d);
		this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
		this.setFrame(sx, sy, 0, ph);
	} else {
		this.setFrame(sx, sy, pw, ph);
	}
};

Sprite_Hair.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_Hair.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_Hair.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_Hair.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_Hair.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_Hair.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_Hair.prototype.updateHalfBodySprites = function() {
	// if (this._bushDepth > 0) {
	// 	this.createHalfBodySprites();
	// 	this._upperBody.bitmap = this.bitmap;
	// 	this._upperBody.visible = true;
	// 	this._upperBody.y = -this._bushDepth;
	// 	this._lowerBody.bitmap = this.bitmap;
	// 	this._lowerBody.visible = true;
	// 	this._upperBody.setBlendColor(this.getBlendColor());
	// 	this._lowerBody.setBlendColor(this.getBlendColor());
	// 	this._upperBody.setColorTone(this.getColorTone());
	// 	this._lowerBody.setColorTone(this.getColorTone());
	// 	this._upperBody.blendMode = this.blendMode;
	// 	this._lowerBody.blendMode = this.blendMode;
	// } else if (this._upperBody) {
	// 	this._upperBody.visible = false;
	// 	this._lowerBody.visible = false;
	// }
};

Sprite_Hair.prototype.createHalfBodySprites = function() {
	// if (!this._upperBody) {
	// 	this._upperBody = new Sprite();
	// 	this._upperBody.anchor.x = 0.5;
	// 	this._upperBody.anchor.y = 1;
	// 	this.addChild(this._upperBody);
	// }
	// if (!this._lowerBody) {
	// 	this._lowerBody = new Sprite();
	// 	this._lowerBody.anchor.x = 0.5;
	// 	this._lowerBody.anchor.y = 1;
	// 	this._lowerBody.opacity = 128;
	// 	this.addChild(this._lowerBody);
	// }
};

Sprite_Hair.prototype.updatePosition = function() {
	this.x = this._character.screenX();
	this.y = this._character.screenY();
	this.z = this._character.screenZ();
	// if(this.scale.y<=1){
	// 	this.yDelta = '+'
	// }
	// if(this.scale.y>=1.02){
	// 	this.yDelta = '-'
	// }
	// if(this.yDelta == '+'){
	// 	this.scale.y += 0.0004;
	// 	this.scale.x += 0.0002;
	// }else{
	// 	this.scale.y -= 0.0004;
	// 	this.scale.x -= 0.0002;
	// }
};

Sprite_Hair.prototype.updateOther = function() {
	this.opacity = this._character.opacity();
	// this.blendMode = this._character.blendMode();
	// this._bushDepth = this._character.bushDepth();
	if(this._character == $gamePlayer){
		var member = $gameParty.members()[0];
	}else{
		var member = $gameParty.members()[this._character._memberIndex]
	}
	this.setColorTone([$gameVariables.value(hairParamR),$gameVariables.value(hairParamG),$gameVariables.value(hairParamB),$gameVariables.value(hairParamT)]);
	member.hairColor = [$gameVariables.value(hairParamR),$gameVariables.value(hairParamG),$gameVariables.value(hairParamB),$gameVariables.value(hairParamT)];
};


//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  武器精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

function Sprite_Weapons() {
	this.initialize(...arguments);
}

Sprite_Weapons.prototype = Object.create(Sprite.prototype);
Sprite_Weapons.prototype.constructor = Sprite_Weapons;

Sprite_Weapons.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_Weapons.prototype.initMembers = function() {
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_Weapons.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_Weapons.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_Weapons.prototype.update = function() {
	Sprite.prototype.update.call(this);
	
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
	this.actor = null;
	this.weaponIcon = 0;
	this.weaponScale = 0;
	if( this._character == $gamePlayer ){
		this.actor = $gameParty.members()[0];
		this.weaponIcon = Number(this.actor.equips()[0].iconIndex);
		this.weaponScale = this.actor.equips()[0].meta.scale?Number(this.actor.equips()[0].meta.scale):1;
		if(this.actor.equips()[0].meta.angle){
			this.weaponScale = Number(this.actor.equips()[0].meta.angle)
		}
		if(this.actor.equips()[1] && this.actor.equips()[1].meta.showInMap){
			this.weaponScale = Math(this.actor.equips()[1].meta.showInMap);
		}
	}
	if( this._character != $gamePlayer && this._character._memberIndex && $gameParty.members()[this._character._memberIndex]){
		this.actor = $gameParty.members()[this._character._memberIndex];
		this.weaponIcon = Number(this.actor.equips()[0].iconIndex)||0;
		this.weaponScale = this.actor.equips()[0].meta.scale?Number(this.actor.equips()[0].meta.scale):1;
		if(this.actor.equips()[0].meta.angle){
			this.weaponScale = Number(this.actor.equips()[0].meta.angle)
		}
	}
	if( !this._character._memberIndex && this._character._battler && this._character._battler._enemyId ){
		this.actorData = $dataEnemies[this._character._battler._enemyId];
		this.actor = this._character._battler;
		this.weaponIcon = Number(this.actorData.meta.weapon);
		this.weaponScale = this.actorData.meta.weaponScale?Number(this.actorData.meta.weaponScale):1;
		if(this.actorData.meta.weaponAngle){
			this.weaponScale = Number(this.actorData.meta.weaponAngle)
		}
	}
	
};

Sprite_Weapons.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_Weapons.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_Weapons.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_Weapons.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_Weapons.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Weapons.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		var weaponImg = 'IconSet' ;
		this._characterName = weaponImg;
		this._characterIndex = 0;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_Weapons.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_Weapons.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Weapons.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadSystem(this._characterName);
	this.scale.x = this.weaponScale;
	this.scale.y = this.weaponScale;
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Weapons.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_Weapons.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Weapons.prototype.updateCharacterFrame = function() {
	this.setFrame(this.weaponIcon % 16*32,Math.floor(this.weaponIcon / 16)*32,32,32);
};

Sprite_Weapons.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_Weapons.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_Weapons.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_Weapons.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_Weapons.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_Weapons.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_Weapons.prototype.updateHalfBodySprites = function() {
	if (this._bushDepth > 0) {
		this.createHalfBodySprites();
		this._upperBody.bitmap = this.bitmap;
		this._upperBody.visible = true;
		this._upperBody.y = -this._bushDepth;
		this._lowerBody.bitmap = this.bitmap;
		this._lowerBody.visible = true;
		this._upperBody.setBlendColor(this.getBlendColor());
		this._lowerBody.setBlendColor(this.getBlendColor());
		this._upperBody.setColorTone(this.getColorTone());
		this._lowerBody.setColorTone(this.getColorTone());
		this._upperBody.blendMode = this.blendMode;
		this._lowerBody.blendMode = this.blendMode;
	} else if (this._upperBody) {
		this._upperBody.visible = false;
		this._lowerBody.visible = false;
	}
};

Sprite_Weapons.prototype.createHalfBodySprites = function() {
	if (!this._upperBody) {
		this._upperBody = new Sprite();
		this._upperBody.anchor.x = 0.5;
		this._upperBody.anchor.y = 1;
		this.addChild(this._upperBody);
	}
	if (!this._lowerBody) {
		this._lowerBody = new Sprite();
		this._lowerBody.anchor.x = 0.5;
		this._lowerBody.anchor.y = 1;
		this._lowerBody.opacity = 128;
		this.addChild(this._lowerBody);
	}
};

Sprite_Weapons.prototype.updatePosition = function() {
	this.bitmap.smooth = false;
	if(this._character.isAttack<=0){
		this.opacity -= weaponFade;
		this._character._directionFix = false;
		this.idleWeaponPosition()
	}else{
		this.opacity += weaponFade;
		this._character._directionFix = true;
		if(this._character.pose=='swingDown') this.poseSwingDown();
		if(this._character.pose=='swingUp') this.poseSwingUp();
		if(this._character.pose=='thrust') this.poseThrust();
		// if(this._character.pose=='shoot') this.poseShoot();
		
	}
	if(this._character == $gamePlayer) showWeaponZ = this.z;
	this._character.weaponX = this.x;
	this._character.weaponY = this.y;
	this._character.weaponZ = this.z;
	this._character.weaponScaleX = this.scale.x;
	this._character.weaponScaleY = this.scale.y;
	this._character.weaponAnchorX = this.anchor.x;
	this._character.weaponAnchorY = this.anchor.y;
	this._character.weaponAngleFix = this.angle;
	
	
};

Sprite_Weapons.prototype.updateOther = function() {
	if( this.actor && (this.actor._hp<=0)){
		this.opacity = 0;
	}else{
		if(weaponFade == 0) this.opacity = this._character.opacity();
	}
	this.blendMode = this._character.blendMode();
	this._bushDepth = this._character.bushDepth();
};

// 各种动作的设定
// 站立时武器
Sprite_Weapons.prototype.idleWeaponPosition = function() {
	this.angle = 90;
	this.anchor.x=0.5;
	this.anchor.y=0.5;
	
	if( this._character._direction == 2 ){
		if( this.scale.x > 0) this.scale.x *= -1;
		if( this.angle < 0) this.angle *= -1;
		this.x = this._character.screenX();
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}else
	if( this._character._direction == 4 ){
		if( this.scale.x > 0) this.scale.x *= -1;
		if( this.angle < 0) this.angle *= -1;
		this.x = this._character.screenX();
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}else
	if( this._character._direction == 6 ){
		if( this.scale.x < 0) this.scale.x *= -1;
		if( this.angle > 0) this.angle *= -1;
		this.x = this._character.screenX();
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}else
	if( this._character._direction == 8 ){
		if( this.scale.x < 0) this.scale.x *= -1;
		if( this.angle > 0) this.angle *= -1;
		this.x = this._character.screenX();
		this.y = this._character.screenY()-12+offsetY;
		this.z = this._character.screenZ()+0.1 ;
	}
	if( this._character._pattern == 2 ){
		this.y += 1;
	}
};
// 武器动画：下劈
Sprite_Weapons.prototype.poseSwingDown = function() {
	if( this._character._direction == 2 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		this._character._pattern = 0;
		this.startAngle = -90; // 与左方相反
		this.endAngle = 180; // 与左方相反
		if( this.scale.x > 0) this.scale.x *= -1; // 与左方相反
		this.x = this._character.screenX();
		this.y = this._character.screenY()-8+offsetY;
		if(this._character.isAttack>=this._character.poseDuration-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=this._character.poseDuration-5){
			this._character._pattern = 2
			this.z = this._character.screenZ()+0.1;
		}else{
			this._character._pattern = 0;
			this.z = this._character.screenZ() - 0.1;
		}
		if(this.angle<this.endAngle){// 与左方相反
			this.angle += Math.abs(this.endAngle-this.startAngle)/(5) ;// 与左方相反
		}else{
			this.angle = this.endAngle;
		}
	}
	if( this._character._direction == 4 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		this._character._pattern = 2
		this.startAngle = 180;
		this.endAngle = -90;
		if( this.scale.x < 0) this.scale.x *= -1;
		this.x = this._character.screenX();
		this.y = this._character.screenY()-16+offsetY;
		if(this._character.isAttack>=this._character.poseDuration-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=this._character.poseDuration-5){
			this._character._pattern = 0
			this.z = this._character.screenZ() - 0.1;
		}else{
			this._character._pattern = 2;
			this.z = this._character.screenZ()+0.1;
		}
		if(this.angle>this.endAngle){
			this.angle -= Math.abs(this.endAngle-this.startAngle)/(5) ;
		}else{
			this.angle = this.endAngle;
		}
	}
	if( this._character._direction == 6 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		this._character._pattern = 2;
		this.startAngle = -180; // 与左方相反
		this.endAngle = 90; // 与左方相反
		if( this.scale.x > 0) this.scale.x *= -1; // 与左方相反
		this.x = this._character.screenX();
		this.y = this._character.screenY()-16+offsetY;
		if(this._character.isAttack>=this._character.poseDuration-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=this._character.poseDuration-5){
			this._character._pattern = 0;
			this.z = this._character.screenZ() - 0.1;
		}else{
			this._character._pattern = 2;
			this.z = this._character.screenZ()+0.1;
		}
		if(this.angle<this.endAngle){// 与左方相反
			this.angle += Math.abs(this.endAngle-this.startAngle)/(5) ;// 与左方相反
		}else{
			this.angle = this.endAngle;
		}
	}
	if( this._character._direction == 8 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		this._character._pattern = 0;
		this.startAngle = -180;
		this.endAngle = 90;
		if( this.scale.x > 0) this.scale.x *= -1;
		this.x = this._character.screenX()+12;
		this.y = this._character.screenY()-20+offsetY;
		if(this._character.isAttack>=this._character.poseDuration-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=this._character.poseDuration-5){
			this._character._pattern = 2;
			this.z = this._character.screenZ()+0.1;
		}else{
			this._character._pattern = 0;
			this.z = this._character.screenZ() - 0.1;
		}
		if(this.angle<this.endAngle){
			this.angle += Math.abs(this.endAngle-this.startAngle)/(5) ;
		}else{
			this.angle = this.endAngle;
		}
	}
};

// 武器动画：上撩

Sprite_Weapons.prototype.poseSwingUp = function() {
	if( this._character._direction == 2 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		// this._character._pattern = 0
		this.startAngle = 270; // 与左方相反
		this.endAngle = 90; // 与左方相反
		if( this.scale.x < 0) this.scale.x *= -1; // 与左方相反
		this.x = this._character.screenX()-4;
		this.y = this._character.screenY()+offsetY;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
			this._character._pattern = 0
			this.z = this._character.screenZ() - 0.1;
		}else{
			this._character._pattern = 2;
			this.z = this._character.screenZ()+0.1;
		}
		if(this.angle>this.endAngle){// 与左方相反
			this.angle -= Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;// 与左方相反
		}else{
			this.angle = this.endAngle;
		}
	}
	if( this._character._direction == 4 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		// this._character._pattern = 0
		this.startAngle = 0;
		this.endAngle = 270;
		if( this.scale.x > 0) this.scale.x *= -1;
		this.x = this._character.screenX();
		this.y = this._character.screenY()-16+offsetY;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
			this._character._pattern = 2
			this.z = this._character.screenZ()+0.1;
		}else{
			this._character._pattern = 0;
			this.z = this._character.screenZ() - 0.1;
		}
		if(this.angle<this.endAngle){
			this.angle += Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;
		}else{
			this.angle = this.endAngle;
		}
	}
	if( this._character._direction == 6 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		// this._character._pattern = 0;
		this.startAngle = 0; // 与左方相反
		this.endAngle = -270; // 与左方相反
		if( this.scale.x < 0) this.scale.x *= -1; // 与左方相反
		this.x = this._character.screenX();
		this.y = this._character.screenY()-16+offsetY;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
			this._character._pattern = 2;
			this.z = this._character.screenZ()+0.1;
		}else{
			this._character._pattern = 0;
			this.z = this._character.screenZ() - 0.1;
		}
		if(this.angle>this.endAngle){// 与左方相反
			this.angle -= Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;// 与左方相反
		}else{
			this.angle = this.endAngle;
		}
	}
	if( this._character._direction == 8 ){
		this.anchor.x = 1;
		this.anchor.y=0.75;
		
		// this._character._pattern = 0;
		this.startAngle = 180;
		this.endAngle = 0;
		if( this.scale.x < 0) this.scale.x *= -1;
		this.x = this._character.screenX()+12;
		this.y = this._character.screenY()-20+offsetY;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
			this.angle = this.startAngle;
		}
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
			this._character._pattern = 0;
			this.z = this._character.screenZ()+0.1;
		}else{
			this._character._pattern = 2;
			this.z = this._character.screenZ() - 0.1;
		}
		if(this.angle>this.endAngle){
			this.angle -= Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;
		}else{
			this.angle = this.endAngle;
		}
	}
};

// 武器动画：直刺
Sprite_Weapons.prototype.poseThrust = function() {
	if( this._character._direction == 2 ){
		this.anchor.x = 0.75;
		this.anchor.y = 0.75;
		
		this.angle = 135;
		if( this.scale.x > 0) this.scale.x *= -1;
		this.x = this._character.screenX()-12;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
			this._character._pattern = 2
			this.y += 10;
			this.z = this._character.screenZ()+0.1;
		}else{
			this._character._pattern = 0
			this.y = this._character.screenY()-12;
		}
	}
	if( this._character._direction == 4 ){
		this.anchor.x = 0.75;
		this.anchor.y = 0.75;
		
		this.angle = 315;
		if( this.scale.x < 0) this.scale.x *= -1;
		this.y = this._character.screenY()-16;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
			this._character._pattern = 2;
			this.x -= 10;
			this.z = this._character.screenZ() - 0.1;
		}else{
			this._character._pattern = 0;
			this.x = this._character.screenX();
		}
	}
	if( this._character._direction == 6 ){
		this.anchor.x = 0.75;
		this.anchor.y = 0.75;
		
		this.angle = 45;
		if( this.scale.x > 0) this.scale.x *= -1;
		this.y = this._character.screenY()-16;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
			this._character._pattern = 2;
			this.x += 10;
			this.z = this._character.screenZ() - 0.1;
		}else{
			this._character._pattern = 0;
			this.x = this._character.screenX();
		}
	}
	if( this._character._direction == 8 ){
		this.anchor.x = 0.75;
		this.anchor.y = 0.75;
		
		this.angle = -45;
		if( this.scale.x > 0) this.scale.x *= -1;
		this.x = this._character.screenX()+12;
		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
			this._character._pattern = 2
			this.y -= 10;
			this.z = this._character.screenZ() - 0.1;
		}else{
			this._character._pattern = 0
			this.y = this._character.screenY()-4;
		}
	}
};

// // 武器动画：射击
// Sprite_Weapons.prototype.poseShoot = function() {
// 	if( this._character._direction == 2 ){
// 		this.anchor.x = 0.75;
// 		this.anchor.y = 0.75;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1) this.y = this._character.screenY()-12
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1) this.angle = 135;
// 		if( this.scale.x > 0) this.scale.x *= -1;
// 		this.x = this._character.screenX()-6;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
// 			this._character._pattern = 2
// 			this.angle -= 10;
// 			this.y -= 2;
// 			this.z = this._character.screenZ()+0.1;
// 		}else{
// 			this._character._pattern = 0
// 			this.y = this._character.screenY()-12;
// 		}
// 	}
// 	if( this._character._direction == 4 ){
// 		this.anchor.x = 0.75;
// 		this.anchor.y = 0.75;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1) this.angle = 315;
		
// 		if( this.scale.x < 0) this.scale.x *= -1;
// 		this.y = this._character.screenY()-16;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
// 			this._character._pattern = 2;
// 			this.angle += 10
// 			this.x += 2;
// 			this.z = this._character.screenZ() - 0.1;
// 		}else{
// 			this._character._pattern = 0;
// 			this.x = this._character.screenX();
// 		}
// 	}
// 	if( this._character._direction == 6 ){
// 		this.anchor.x = 0.75;
// 		this.anchor.y = 0.75;
		
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1) this.angle = 45;
// 		if( this.scale.x > 0) this.scale.x *= -1;
// 		this.y = this._character.screenY()-16;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
// 			this._character._pattern = 2;
// 			this.angle -= 10
// 			this.x -= 2;
// 			this.z = this._character.screenZ() - 0.1;
// 		}else{
// 			this._character._pattern = 0;
// 			this.x = this._character.screenX();
// 		}
// 	}
// 	if( this._character._direction == 8 ){
// 		this.anchor.x = 0.75;
// 		this.anchor.y = 0.75;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1) this.y = this._character.screenY()-12
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1) this.angle = -45;
// 		if( this.scale.x > 0) this.scale.x *= -1;
// 		this.x = this._character.screenX()+6;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-3){
// 			this._character._pattern = 2
// 			this.angle += 10;
// 			this.y += 10;
// 			this.z = this._character.screenZ() - 0.1;
// 		}else{
// 			this._character._pattern = 0
// 			this.y = this._character.screenY()-12;
// 		}
// 	}
// };



//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  盾牌精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

function Sprite_Shield() {
	this.initialize(...arguments);
}

Sprite_Shield.prototype = Object.create(Sprite.prototype);
Sprite_Shield.prototype.constructor = Sprite_Shield;

Sprite_Shield.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_Shield.prototype.initMembers = function() {
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_Shield.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_Shield.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_Shield.prototype.update = function() {
	Sprite.prototype.update.call(this);
	// console.log(this._character)
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
	if( this._character == $gamePlayer ){
		this.actor = $gameParty.members()[0];
		this.shieldIcon = Number(this.actor.equips()[1].iconIndex);
		this.weaponScale = this.actor.equips()[1].meta.scale?Number(this.actor.equips()[1].meta.scale):1;
		if(this.actor.equips()[1].meta.showInMap){
			this.shieldIcon = Math(this.actor.equips()[1].meta.showInMap);
		}
	}else if( this._character._memberIndex && $gameParty.members()[this._character._memberIndex] && this._character._characterName){
		this.actor = $gameParty.members()[this._character._memberIndex];
		this.shieldIcon = Number(this.actor.equips()[1].iconIndex);
		this.weaponScale = this.actor.equips()[1].meta.scale?Number(this.actor.equips()[1].meta.scale):1;

	}else if( !this._character._memberIndex && this._character._battler && this._character._battler._enemyId ){
		this.actorData = $dataEnemies[this._character._battler._enemyId];
		this.actor = this._character._battler;
		this.shieldIcon = Number(this.actorData.meta.shield);
		this.weaponScale = this.actorData.meta.shieldScale?Number(this.actorData.meta.shieldScale):1;
	}else{
		this.actor = null;
		this.shieldIcon = 0;
		this.weaponScale = 0;
	}
};

Sprite_Shield.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_Shield.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_Shield.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_Shield.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_Shield.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Shield.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		var weaponImg = 'IconSet' ;
		this._characterName = weaponImg;
		this._characterIndex = 0;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_Shield.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_Shield.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Shield.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadSystem(this._characterName);
	this.scale.x = this.weaponScale;
	this.scale.y = this.weaponScale;
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Shield.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_Shield.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Shield.prototype.updateCharacterFrame = function() {
	this.setFrame(this.shieldIcon % 16*32,Math.floor(this.shieldIcon / 16)*32,32,32);
};

Sprite_Shield.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_Shield.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_Shield.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_Shield.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_Shield.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_Shield.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_Shield.prototype.updateHalfBodySprites = function() {
	if (this._bushDepth > 0) {
		this.createHalfBodySprites();
		this._upperBody.bitmap = this.bitmap;
		this._upperBody.visible = true;
		this._upperBody.y = -this._bushDepth;
		this._lowerBody.bitmap = this.bitmap;
		this._lowerBody.visible = true;
		this._upperBody.setBlendColor(this.getBlendColor());
		this._lowerBody.setBlendColor(this.getBlendColor());
		this._upperBody.setColorTone(this.getColorTone());
		this._lowerBody.setColorTone(this.getColorTone());
		this._upperBody.blendMode = this.blendMode;
		this._lowerBody.blendMode = this.blendMode;
	} else if (this._upperBody) {
		this._upperBody.visible = false;
		this._lowerBody.visible = false;
	}
};

Sprite_Shield.prototype.createHalfBodySprites = function() {
	if (!this._upperBody) {
		this._upperBody = new Sprite();
		this._upperBody.anchor.x = 0.5;
		this._upperBody.anchor.y = 1;
		this.addChild(this._upperBody);
	}
	if (!this._lowerBody) {
		this._lowerBody = new Sprite();
		this._lowerBody.anchor.x = 0.5;
		this._lowerBody.anchor.y = 1;
		this._lowerBody.opacity = 128;
		this.addChild(this._lowerBody);
	}
};

Sprite_Shield.prototype.updatePosition = function() {
	this.bitmap.smooth = false;
	if(this._character._characterName){
		if( this._character.isAttack <= 0 ){
			this.opacity -= weaponFade;
			this.idleWeaponPosition();
		}else{
			this.opacity += weaponFade;
			this.attackingPostion();
		}
		if(this._character == $gamePlayer) showShieldZ = this.z;
	}
	if( this._character._pattern == 2 ){
		this.y += 1;
	}
	

};

Sprite_Shield.prototype.updateOther = function() {
	if( this.actor && (this.actor._hp<=0)){
		this.opacity = 0;
	}else{
		if(weaponFade == 0) this.opacity = this._character.opacity();
	}
	this.blendMode = this._character.blendMode();
	this._bushDepth = this._character.bushDepth();
};

// 各种动作的设定
// 站立时武器
Sprite_Shield.prototype.idleWeaponPosition = function() {
	this.anchor.x=0.5;
	this.anchor.y=0.5;
	
	if( this._character._direction == 2 ){
		if( this.scale.x > 0) this.scale.x *= -1;
		if( this.angle < 0) this.angle *= -1;
		
		this.x = this._character.screenX();
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}
	if( this._character._direction == 4 ){
		this.scale.x = this.weaponScale * 0.75;
		if( this.scale.x > 0) this.scale.x *= -1;
		if( this.angle < 0) this.angle *= -1;
		this.x = this._character.screenX()+6;
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}
	if( this._character._direction == 6 ){
		this.scale.x = this.weaponScale * 0.75;
		if( this.scale.x < 0) this.scale.x *= -1;
		if( this.angle > 0) this.angle *= -1;
		this.x = this._character.screenX()-6;
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}
	if( this._character._direction == 8 ){
		if( this.scale.x < 0) this.scale.x *= -1;
		if( this.angle > 0) this.angle *= -1;
		this.x = this._character.screenX();
		this.y = this._character.screenY()-12+offsetY;
		this.z = this._character.screenZ()+0.1 ;
	}
	if( this._character._pattern == 2 ){
		this.y += 1;
	}
};
Sprite_Shield.prototype.attackingPostion = function() {
	this.anchor.x=0.5;
	this.anchor.y=0.5;
	if( this._character._direction == 2 ){
		if( this.scale.x > 0) this.scale.x *= -1;
		if( this.angle < 0) this.angle *= -1;
		this.x = this._character.screenX() + 8;
		this.y = this._character.screenY() - 12+offsetY;
		this.z = this._character.screenZ()+0.1 ;
	}
	if( this._character._direction == 4 ){
		if( this.scale.x > 0) this.scale.x *= -1;
		if( this.angle < 0) this.angle *= -1;
		this.x = this._character.screenX()-6;
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}
	if( this._character._direction == 6 ){
		if( this.scale.x < 0) this.scale.x *= -1;
		if( this.angle > 0) this.angle *= -1;
		this.x = this._character.screenX()+6;
		this.y = this._character.screenY()-18+offsetY;
		this.z = this._character.screenZ() - 0.1 ;
	}
	if( this._character._direction == 8 ){
		if( this.scale.x < 0) this.scale.x *= -1;
		if( this.angle > 0) this.angle *= -1;
		this.x = this._character.screenX() - 8;
		this.y = this._character.screenY()-12+offsetY;
		this.z = this._character.screenZ()+0.1 ;
	}
	if( this._character._pattern == 2 ){
		this.y += 1;
	}
};
// // 武器动画：下劈
// Sprite_Shield.prototype.poseSwingDown = function() {
// 	if( this._character._direction == 2 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		this._character._pattern = 0;
// 		this.startAngle = -90; // 与左方相反
// 		this.endAngle = 180; // 与左方相反
// 		if( this.scale.x > 0) this.scale.x *= -1; // 与左方相反
// 		this.x = this._character.screenX();
// 		this.y = this._character.screenY()-8;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 2
// 			this.z = this._character.screenZ()+0.1;
// 		}else{
// 			this._character._pattern = 0;
// 			this.z = this._character.screenZ() - 0.1;
// 		}
// 		if(this.angle<this.endAngle){// 与左方相反
// 			this.angle += Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;// 与左方相反
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// 	if( this._character._direction == 4 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		this._character._pattern = 2
// 		this.startAngle = 180;
// 		this.endAngle = -90;
// 		if( this.scale.x < 0) this.scale.x *= -1;
// 		this.x = this._character.screenX();
// 		this.y = this._character.screenY()-16;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 0
// 			this.z = this._character.screenZ() - 0.1;
// 		}else{
// 			this._character._pattern = 2;
// 			this.z = this._character.screenZ()+0.1;
// 		}
// 		if(this.angle>this.endAngle){
// 			this.angle -= Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// 	if( this._character._direction == 6 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		this._character._pattern = 2;
// 		this.startAngle = -180; // 与左方相反
// 		this.endAngle = 90; // 与左方相反
// 		if( this.scale.x > 0) this.scale.x *= -1; // 与左方相反
// 		this.x = this._character.screenX();
// 		this.y = this._character.screenY()-16;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 0;
// 			this.z = this._character.screenZ() - 0.1;
// 		}else{
// 			this._character._pattern = 2;
// 			this.z = this._character.screenZ()+0.1;
// 		}
// 		if(this.angle<this.endAngle){// 与左方相反
// 			this.angle += Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;// 与左方相反
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// 	if( this._character._direction == 8 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		this._character._pattern = 0;
// 		this.startAngle = -180;
// 		this.endAngle = 90;
// 		if( this.scale.x > 0) this.scale.x *= -1;
// 		this.x = this._character.screenX()+12;
// 		this.y = this._character.screenY()-16;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 2;
// 			this.z = this._character.screenZ() - 0.1;
// 		}else{
// 			this._character._pattern = 0;
// 			this.z = this._character.screenZ()+0.1;
// 		}
// 		if(this.angle<this.endAngle){
// 			this.angle += Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// };

// // 武器动画：上撩
// Sprite_Shield.prototype.poseSwingUp = function() {
// 	if( this._character._direction == 2 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		// this._character._pattern = 0
// 		this.startAngle = 270; // 与左方相反
// 		this.endAngle = 90; // 与左方相反
// 		if( this.scale.x < 0) this.scale.x *= -1; // 与左方相反
// 		this.x = this._character.screenX()-4;
// 		this.y = this._character.screenY();
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 0
// 			this.z = this._character.screenZ() - 0.1;
// 		}else{
// 			this._character._pattern = 2;
// 			this.z = this._character.screenZ()+0.1;
// 		}
// 		if(this.angle>this.endAngle){// 与左方相反
// 			this.angle -= Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;// 与左方相反
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// 	if( this._character._direction == 4 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		// this._character._pattern = 0
// 		this.startAngle = 0;
// 		this.endAngle = 270;
// 		if( this.scale.x > 0) this.scale.x *= -1;
// 		this.x = this._character.screenX();
// 		this.y = this._character.screenY()-16;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 2
// 			this.z = this._character.screenZ()+0.1;
// 		}else{
// 			this._character._pattern = 0;
// 			this.z = this._character.screenZ() - 0.1;
// 		}
// 		if(this.angle<this.endAngle){
// 			this.angle += Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// 	if( this._character._direction == 6 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		// this._character._pattern = 0;
// 		this.startAngle = 0; // 与左方相反
// 		this.endAngle = -270; // 与左方相反
// 		if( this.scale.x < 0) this.scale.x *= -1; // 与左方相反
// 		this.x = this._character.screenX();
// 		this.y = this._character.screenY()-16;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 2;
// 			this.z = this._character.screenZ()+0.1;
// 		}else{
// 			this._character._pattern = 0;
// 			this.z = this._character.screenZ() - 0.1;
// 		}
// 		if(this.angle>this.endAngle){// 与左方相反
// 			this.angle -= Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;// 与左方相反
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// 	if( this._character._direction == 8 ){
// 		this.anchor.x = 1;
// 		this.anchor.y=0.75;
		
// 		// this._character._pattern = 0;
// 		this.startAngle = 180;
// 		this.endAngle = 0;
// 		if( this.scale.x < 0) this.scale.x *= -1;
// 		this.x = this._character.screenX()+12;
// 		this.y = this._character.screenY()-20;
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-1){
// 			this.angle = this.startAngle;
// 		}
// 		if(this._character.isAttack>=sxlSimpleABS.weaponSwingTime-5){
// 			this._character._pattern = 0;
// 			this.z = this._character.screenZ()+0.1;
// 		}else{
// 			this._character._pattern = 2;
// 			this.z = this._character.screenZ() - 0.1;
// 		}
// 		if(this.angle>this.endAngle){
// 			this.angle -= Math.abs(this.endAngle-this.startAngle)/(sxlSimpleABS.weaponSwingTime-25) ;
// 		}else{
// 			this.angle = this.endAngle;
// 		}
// 	}
// };

//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  强化精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

function Sprite_WeaponUpgrade() {
	this.initialize(...arguments);
}

Sprite_WeaponUpgrade.prototype = Object.create(Sprite.prototype);
Sprite_WeaponUpgrade.prototype.constructor = Sprite_WeaponUpgrade;

Sprite_WeaponUpgrade.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_WeaponUpgrade.prototype.initMembers = function() {
	// this.anchor.x = 0.5;
	// this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_WeaponUpgrade.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_WeaponUpgrade.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_WeaponUpgrade.prototype.update = function() {
	Sprite.prototype.update.call(this);
	// console.log(this._character)
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
	if( this._character == $gamePlayer ){
		this.actor = $gameParty.members()[0];
		this.weaponIcon = Number(this.actor.equips()[0].iconIndex);
		this.weaponScale = this.actor.equips()[0].meta.scale?Number(this.actor.equips()[0].meta.scale):1;
		if(this.actor.equips()[0].meta.angle){
			this.weaponScale = Number(this.actor.equips()[0].meta.angle)
		}
	}else if( this._character._memberIndex && $gameParty.members()[this._character._memberIndex]){
		this.actor = $gameParty.members()[this._character._memberIndex];
		this.weaponIcon = Number(this.actor.equips()[0].iconIndex);
		this.weaponScale = this.actor.equips()[0].meta.scale?Number(this.actor.equips()[0].meta.scale):1;
		if(this.actor.equips()[0].meta.angle){
			this.weaponScale = Number(this.actor.equips()[0].meta.angle)
		}
	}
};

Sprite_WeaponUpgrade.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_WeaponUpgrade.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_WeaponUpgrade.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_WeaponUpgrade.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_WeaponUpgrade.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_WeaponUpgrade.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		var weaponImg = 'IconSet' ;
		this._characterName = weaponImg;
		this._characterIndex = 0;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_WeaponUpgrade.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_WeaponUpgrade.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_WeaponUpgrade.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadSystem(this._characterName);
	this.scale.x = this.weaponScale;
	this.scale.y = this.weaponScale;
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_WeaponUpgrade.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_WeaponUpgrade.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_WeaponUpgrade.prototype.updateCharacterFrame = function() {
	if(this.actor && $gameParty.enhanceWeapons){
		var upgradeIcon;
		if( $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes == 0 ){
			var upgradeIcon = 0;
			this.setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,32,32);
			
		}else
		if( $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes > 0 && $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes <= 3 ){
			upgradeIcon = $dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon?
							  Number($dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon):Number(upgrade1);
			this.setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,32,32);
			
		}else
		if( $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes > 3 && $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes <= 6 ){
			upgradeIcon = $dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon?
							  Number($dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon)+1:Number(upgrade2);
			this.setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,32,32);
			
		}else
		if( $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes > 6 && $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes <= 9 ){
			upgradeIcon = $dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon?
							  Number($dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon)+2:Number(upgrade3);
			this.setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,32,32);
			
		}else
		if( $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes > 9  && $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes <= 12 ){
			upgradeIcon = $dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon?
							  Number($dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon)+3:Number(upgrade4);
			this.setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,32,32);
			
		}else
		if( $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes > 12  && $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes <= 15 ){
			upgradeIcon = $dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon?
							  Number($dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon)+4:Number(upgrade5);
							  console.log( $dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon)
			this.setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,32,32);
		}else
		if( $gameParty.enhanceWeapons[this.actor._equips[0]._itemId-1].enhanceTimes > 15){
			upgradeIcon = $dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon?
							  Number($dataWeapons[this.actor._equips[0]._itemId].meta.upgradeIcon)+5:Number(upgrade6);
			this.setFrame(upgradeIcon % 16*32,Math.floor(upgradeIcon / 16)*32,32,32);
		}
	}
	
};

Sprite_WeaponUpgrade.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_WeaponUpgrade.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_WeaponUpgrade.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_WeaponUpgrade.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_WeaponUpgrade.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_WeaponUpgrade.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_WeaponUpgrade.prototype.updateHalfBodySprites = function() {
	if (this._bushDepth > 0) {
		this.createHalfBodySprites();
		this._upperBody.bitmap = this.bitmap;
		this._upperBody.visible = true;
		this._upperBody.y = -this._bushDepth;
		this._lowerBody.bitmap = this.bitmap;
		this._lowerBody.visible = true;
		this._upperBody.setBlendColor(this.getBlendColor());
		this._lowerBody.setBlendColor(this.getBlendColor());
		this._upperBody.setColorTone(this.getColorTone());
		this._lowerBody.setColorTone(this.getColorTone());
		this._upperBody.blendMode = this.blendMode;
		this._lowerBody.blendMode = this.blendMode;
	} else if (this._upperBody) {
		this._upperBody.visible = false;
		this._lowerBody.visible = false;
	}
};

Sprite_WeaponUpgrade.prototype.createHalfBodySprites = function() {
	if (!this._upperBody) {
		this._upperBody = new Sprite();
		this._upperBody.anchor.x = 0.5;
		this._upperBody.anchor.y = 1;
		this.addChild(this._upperBody);
	}
	if (!this._lowerBody) {
		this._lowerBody = new Sprite();
		this._lowerBody.anchor.x = 0.5;
		this._lowerBody.anchor.y = 1;
		this._lowerBody.opacity = 128;
		this.addChild(this._lowerBody);
	}
};

Sprite_WeaponUpgrade.prototype.updatePosition = function() {
	this.bitmap.smooth = false;
	this.x = this._character.weaponX ;
	this.y = this._character.weaponY ;
	this.z = this._character.weaponZ ;
	this.scale.x = this._character.weaponScaleX ;
	this.scale.y = this._character.weaponScaleY ; 
	this.anchor.x = this._character.weaponAnchorX ;
	this.anchor.y = this._character.weaponAnchorY ;
	this.angle = this._character.weaponAngleFix ;
	
};

Sprite_WeaponUpgrade.prototype.updateOther = function() {
	if( this.actor && (this.actor._hp<=0)){
		this.opacity = 0;
	}else{
		if(this.opacity == 255){
			this.opacityAdjuctMode = '-'
		}
		if(this.opacity == 128){
			this.opacityAdjuctMode = '+'
		}
		if(this.opacityAdjuctMode == '-'){
			this.opacity --; 
		}
		if(this.opacityAdjuctMode == '+'){
			this.opacity ++; 
		}
		
	}
	this.blendMode = this._character.blendMode();
	this._bushDepth = this._character.bushDepth();
};

//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  挥舞精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

function Sprite_WeaponSwingLight() {
	this.initialize(...arguments);
}

Sprite_WeaponSwingLight.prototype = Object.create(Sprite.prototype);
Sprite_WeaponSwingLight.prototype.constructor = Sprite_WeaponSwingLight;

Sprite_WeaponSwingLight.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_WeaponSwingLight.prototype.initMembers = function() {
	// this.anchor.x = 0.5;
	// this.anchor.y = 1;
	this._character = null;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_WeaponSwingLight.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_WeaponSwingLight.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_WeaponSwingLight.prototype.update = function() {
	Sprite.prototype.update.call(this);
	// console.log(this._character)
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
	if( this._character == $gamePlayer && $gameParty.members()[0] && $gameParty.members()[0].equips()[0]){
		this.actor = $gameParty.members()[0];
		if(this.actor.equips()[0].meta.swingLight){
			this.weaponSwingLightImage = this.actor.equips()[0].meta.swingLight;
		}else{
			this.weaponSwingLightImage = defaultSwingLight;
		}
	}
};

Sprite_WeaponSwingLight.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_WeaponSwingLight.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_WeaponSwingLight.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_WeaponSwingLight.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_WeaponSwingLight.prototype.tilesetBitmap = function(tileId) {
	// const tileset = $gameMap.tileset();
	// const setNumber = 5 + Math.floor(tileId / 256);
	// return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_WeaponSwingLight.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		this._characterName = this.weaponSwingLightImage;
		this._characterIndex = 0;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_WeaponSwingLight.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_WeaponSwingLight.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_WeaponSwingLight.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadSystem(this.weaponSwingLightImage) ;
	this.scale.x = this.weaponScale;
	this.scale.y = this.weaponScale;
	// this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_WeaponSwingLight.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_WeaponSwingLight.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_WeaponSwingLight.prototype.updateCharacterFrame = function() {

	
};

Sprite_WeaponSwingLight.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_WeaponSwingLight.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_WeaponSwingLight.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_WeaponSwingLight.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_WeaponSwingLight.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_WeaponSwingLight.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_WeaponSwingLight.prototype.updateHalfBodySprites = function() {
	if (this._bushDepth > 0) {
		this.createHalfBodySprites();
		this._upperBody.bitmap = this.bitmap;
		this._upperBody.visible = true;
		this._upperBody.y = -this._bushDepth;
		this._lowerBody.bitmap = this.bitmap;
		this._lowerBody.visible = true;
		this._upperBody.setBlendColor(this.getBlendColor());
		this._lowerBody.setBlendColor(this.getBlendColor());
		this._upperBody.setColorTone(this.getColorTone());
		this._lowerBody.setColorTone(this.getColorTone());
		this._upperBody.blendMode = this.blendMode;
		this._lowerBody.blendMode = this.blendMode;
	} else if (this._upperBody) {
		this._upperBody.visible = false;
		this._lowerBody.visible = false;
	}
};

Sprite_WeaponSwingLight.prototype.createHalfBodySprites = function() {
	if (!this._upperBody) {
		this._upperBody = new Sprite();
		this._upperBody.anchor.x = 0.5;
		this._upperBody.anchor.y = 1;
		this.addChild(this._upperBody);
	}
	if (!this._lowerBody) {
		this._lowerBody = new Sprite();
		this._lowerBody.anchor.x = 0.5;
		this._lowerBody.anchor.y = 1;
		this._lowerBody.opacity = 128;
		this.addChild(this._lowerBody);
	}
};

Sprite_WeaponSwingLight.prototype.updatePosition = function() {
	this.bitmap.smooth = false;
	this.x = this._character.weaponX ;
	this.y = this._character.weaponY ;
	this.z = this._character.weaponZ ;
	this.scale.x = this._character.weaponScaleX*(32/(this.width*0.5))*1.2;
	this.scale.y = this._character.weaponScaleY*(32/(this.height*0.5))*1.2; 
	if( $gameParty.members()[0] && $gameParty.members()[0].equips()[0] && $gameParty.members()[0].equips()[0].meta.swingLightScale ){
		this.scale.x = Number($gameParty.members()[0].equips()[0].meta.swingLightScale);
		this.scale.y = this.scale.x; 
	}
	this.anchor.x = 0.5 ;
	this.anchor.y = 0.5 ;
	this.angle = this._character.weaponAngleFix ;
	
};

Sprite_WeaponSwingLight.prototype.updateOther = function() {
	if( this.actor && (this.actor._hp>0) && this._character.isAttack>15){
		this.opacity = (this._character.isAttack-15)*6;
	}else{
		this.opacity -= 20;
	}
	this.blendMode = this._character.blendMode();
	this._bushDepth = this._character.bushDepth();
};

//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//
//  光环精灵
//
//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

function Sprite_Aura() {
	this.initialize(...arguments);
}

Sprite_Aura.prototype = Object.create(Sprite.prototype);
Sprite_Aura.prototype.constructor = Sprite_Aura;

Sprite_Aura.prototype.initialize = function(character) {
	Sprite.prototype.initialize.call(this);
	this.initMembers();
	this.setCharacter(character);
};

Sprite_Aura.prototype.initMembers = function() {
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.character = 100;
	this._character = null;
	this.changeTimer = 0;
	this._balloonDuration = 0;
	this._tilesetId = 0;
	this._upperBody = null;
	this._lowerBody = null;
};

Sprite_Aura.prototype.setCharacter = function(character) {
	this._character = character;
};

Sprite_Aura.prototype.checkCharacter = function(character) {
	return this._character === character;
};

Sprite_Aura.prototype.update = function() {
	Sprite.prototype.update.call(this);
	this.updateBitmap();
	this.updateFrame();
	this.updatePosition();
	this.updateOther();
	this.updateVisibility();
};

Sprite_Aura.prototype.updateVisibility = function() {
	Sprite.prototype.updateVisibility.call(this);
	if (this.isEmptyCharacter() || this._character.isTransparent()) {
		this.visible = false;
	}
};

Sprite_Aura.prototype.isTile = function() {
	return this._character.isTile();
};

Sprite_Aura.prototype.isObjectCharacter = function() {
	return this._character.isObjectCharacter();
};

Sprite_Aura.prototype.isEmptyCharacter = function() {
	return this._tileId === 0 && !this._characterName;
};

Sprite_Aura.prototype.tilesetBitmap = function(tileId) {
	const tileset = $gameMap.tileset();
	const setNumber = 5 + Math.floor(tileId / 256);
	return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Aura.prototype.updateBitmap = function() {
	if (this.isImageChanged()) {
		this._tilesetId = $gameMap.tilesetId();
		this._tileId = this._character.tileId();
		var auraImg = this._character.auraImg?this._character.auraImg:'$empty';
		this._characterName = auraImg;
		this._characterIndex = 0;
		if (this._tileId > 0) {
			this.setTileBitmap();
		} else {
			this.setCharacterBitmap();
		}
	}
};

Sprite_Aura.prototype.isImageChanged = function() {
	return (
		this._tilesetId !== $gameMap.tilesetId() ||
		this._tileId !== this._character.tileId() ||
		this._characterName !== this._character.characterName() ||
		this._characterIndex !== this._character.characterIndex()
	);
};

Sprite_Aura.prototype.setTileBitmap = function() {
	this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Aura.prototype.setCharacterBitmap = function() {
	this.bitmap = ImageManager.loadCharacter(this._characterName);
	this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Aura.prototype.updateFrame = function() {
	if (this._tileId > 0) {
		this.updateTileFrame();
	} else {
		this.updateCharacterFrame();
	}
};

Sprite_Aura.prototype.updateTileFrame = function() {
	const tileId = this._tileId;
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
	const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Aura.prototype.updateCharacterFrame = function() {
	const pw = this.patternWidth();
	const ph = this.patternHeight();
	const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
	const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
	this.updateHalfBodySprites();
	this.setFrame(sx, sy, pw, ph);
};

Sprite_Aura.prototype.characterBlockX = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return (index % 4) * 3;
	}
};

Sprite_Aura.prototype.characterBlockY = function() {
	if (this._isBigCharacter) {
		return 0;
	} else {
		const index = this._character.characterIndex();
		return Math.floor(index / 4) * 4;
	}
};

Sprite_Aura.prototype.characterPatternX = function() {
	return this._character.pattern();
};

Sprite_Aura.prototype.characterPatternY = function() {
	return (this._character.direction() - 2) / 2;
};

Sprite_Aura.prototype.patternWidth = function() {
	if (this._tileId > 0) {
		return $gameMap.tileWidth();
	} else if (this._isBigCharacter) {
		return this.bitmap.width / 3;
	} else {
		return this.bitmap.width / 12;
	}
};

Sprite_Aura.prototype.patternHeight = function() {
	if (this._tileId > 0) {
		return $gameMap.tileHeight();
	} else if (this._isBigCharacter) {
		return this.bitmap.height / 4;
	} else {
		return this.bitmap.height / 8;
	}
};

Sprite_Aura.prototype.updateHalfBodySprites = function() {
};

Sprite_Aura.prototype.createHalfBodySprites = function() {
};

Sprite_Aura.prototype.updatePosition = function() {
	this.x = this._character.screenX();
	this.y = this._character.screenY();
	this.z = 0;
};

Sprite_Aura.prototype.updateOther = function() {
	if(this.changeTimer == 60){
		this.changeTimerMode = '-';
	}else if (this.changeTimer == 0) {
		this.changeTimerMode = '+' ;
	}
	if(this.changeTimerMode === '+'){
		this.changeTimer++
	}else{
		this.changeTimer--
	}
	this.opacity = 50 - this.changeTimer;
	this.scale.x = 1*(auraScale==0?1:this._character.auraRange*2) + (auraBreath==0?0:((this.changeTimer/60)*0.25));
	this.blendMode = 1;
	this._bushDepth = this._character.bushDepth();
	this.scale.y = this.scale.x/2;
	if(this._character._battler && this._character._battler._hp<=0 ){
		this.opacity = 0;
	}
};

Spriteset_Map.prototype.createCharacters = function() {
	this._characterSprites = [];
	for (const event of $gameMap.events()) {
		this._characterSprites.push(new Sprite_Character(event));
		this._characterSprites.push(new Sprite_Aura(event));
		// this._characterSprites.push(new Sprite_Weapons(event));
		// this._characterSprites.push(new Sprite_Shield(event));
	}
	for (const vehicle of $gameMap.vehicles()) {
		this._characterSprites.push(new Sprite_Character(vehicle));
	}
	for (const follower of $gamePlayer.followers().reverseData()) {
		this._characterSprites.push(new Sprite_Character(follower));
		// this._characterSprites.push(new Sprite_Aura(follower));
		// this._characterSprites.push(new Sprite_Armor(follower));
		// this._characterSprites.push(new Sprite_Hat(follower));
		// this._characterSprites.push(new Sprite_Weapons(follower));
		// this._characterSprites.push(new Sprite_Shield(follower));
	}
	
	this._characterSprites.push(new Sprite_Character($gamePlayer));
	this._characterSprites.push(new Sprite_Aura($gamePlayer));
	if(!$dataActors[$gameParty.members()[0]._actorId].meta.noCharacterLayer){
		this._characterSprites.push(new Sprite_Armor($gamePlayer));
		this._characterSprites.push(new Sprite_Hair($gamePlayer));
		this._characterSprites.push(new Sprite_Hat($gamePlayer));
		this._characterSprites.push(new Sprite_Weapons($gamePlayer));
		this._characterSprites.push(new Sprite_WeaponUpgrade($gamePlayer));
		this._characterSprites.push(new Sprite_WeaponSwingLight($gamePlayer));
		this._characterSprites.push(new Sprite_Shield($gamePlayer));
		
	}
	
	for (const sprite of this._characterSprites) {
		this._tilemap.addChild(sprite);
	}
};

// 存档相关

DataManager.makeSavefileInfo = function() {
	const info = {};
	info.title = $dataSystem.gameTitle;
	info.characters = $gameParty.charactersForSavefile();
	info.faces = $gameParty.facesForSavefile();
	info.playtime = $gameSystem.playtimeText();
	info.members = $gameParty.members();
	info.gold = $gameParty.gold();
	info.timestamp = Date.now();
	info.armorImg = [];
	info.hairImg = [];
	info.hatImg = [];
	for( i in $gameParty.members()){
		if(i==0) info.hairImg.push($gameParty.members()[i].hairImg);
		info.armorImg.push($gameParty.members()[i].armorImg);
		info.hatImg.push($gameParty.members()[i].hatImg);
	}

	return info;
};

Window_SavefileList.prototype.numVisibleRows = function() {
	return 4;
};

Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
	if (info.characters) {
		let characterX = x;
		let n = 0;
		for (const data of info.characters) {
			this.drawCharacter(data[0], data[1], characterX, y);
			if(n==0) this.drawCharacter(info.hairImg[n], 0, characterX, y);
			if(n==0) this.drawCharacter(info.hatImg[n], 0, characterX, y);
			if(n==0) this.drawCharacter(info.armorImg[n], 0, characterX, y);
			characterX += 48;
			n++
		}
	}
};


// Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
//     if (info.characters) {
//         this.contents.fontSize = 18;
//         let characterX = x;
//         let characterX1 = x;
//         for (const data of info.faces) {
//             console.log(info)
//             this.drawFace(data[0], data[1], characterX-160, y);
//             characterX += 160;
//         }
//         // for ( i in info.members){
//         //     var line = 0;
//         //     var lineHeight = 21;

//         //     this.drawText( info.members[i]._name , characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     this.drawText( '等级：' + info.members[i]._level + '('+  $dataClasses[ info.members[i]._classId ].name + ')', characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     this.drawText( '生命: ' + info.members[i]._hp+' / '+info.members[i].mhp, characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     this.drawText( '力量: ' + info.members[i].atk, characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     this.drawText( '智力: ' + info.members[i].mat, characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     this.drawText( '护甲: ' + info.members[i].def, characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     this.drawText( '精神: ' + info.members[i].mdf, characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     line ++ ;
//         //     this.drawText( '装备' , characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //     line ++ ;
//         //     for( j in info.members[i].equips() ){
//         //         if(info.members[i].equips()[j]){
//         //             var fontColor = info.members[i].equips()[j].meta.textColor?Number(info.members[i].equips()[j].meta.textColor):0
//         //             this.changeTextColor(ColorManager.textColor(fontColor));
					
//         //             // this.drawIcon( info.members[i].equips()[j].iconIndex , characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //             this.drawText( $dataSystem.equipTypes[Number(j)+1]+':'+info.members[i].equips()[j].name , characterX1-160, y+160 + line*lineHeight , 144,'center');
//         //             line ++ ;
//         //         }
//         //     }
//         //     characterX1 += 160;
//         // }
//     }
// };

// Window_SavefileList.prototype.drawContents = function(info, rect) {
//     const bottom = rect.y + rect.height;
//     this.drawPartyCharacters(info, rect.x + 220, 40);
//     const lineHeight = this.lineHeight();
//     const y2 = bottom - lineHeight - 4;
//     this.drawText( '(  游戏时间：'+info.playtime , 96, 7 , 192,'center');
//     this.drawText( '队伍人数：'+info.members.length , 96+200, 7 , 192,'center');
//     this.drawText( '持有金币: '+info.gold + '  )', 96 +200*2, 7 , 192,'center');
// };