
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Light System
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 处理光效
 * @author 神仙狼
 * @help
 * 光效图片放在img/light中。
 * 
 * 
 * @param 黑暗效果变量ID
 * @type Number
 * @desc 黑暗效果变量ID，这个变量控制着当前场景黑暗效果的深度。0为完全光明
 * @default 15
 * 
 * @param 开启击中闪光
 * @type Number
 * @desc 打开后，攻击敌人会产生闪光，有照亮视野的效果。0为关闭，1为打开。
 * @default 1
 *
 * @param 默认光效
 * @type String
 * @desc 一些通用项目的光效。
 * @default light_white
 * 
 * 
 */

var ssmbsLight = ssmbsLight||{};
ssmbsLight.parameters = PluginManager.parameters('SSMBS_Light');
ssmbsLight.opacity = Number(ssmbsLight.parameters['黑暗效果变量ID'] || 15 ) ;
ssmbsLight.attackLightBlink = Number(ssmbsLight.parameters['开启击中闪光'] || 1 );
ssmbsLight.commonLightImg = String(ssmbsLight.parameters['默认光效'] || 'light_white' );

ImageManager.loadLight = function(filename) {
    return this.loadBitmap("img/light/", filename);
};

const _lightMapLoad = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
	_lightMapLoad.call(this);
	this.lightArrayEvents = [];
	this.lightArrayPlayer = [];
	this.changeTimer = 60;
	this.darkness = new Sprite(new Bitmap(Graphics.width,Graphics.height));
	this.darkness.blendMode = 2;
	this.darkness.z = 25;
	this.darkness.opacity = ssmbsLight.opacity;
	this._tilemap.addChild(this.darkness)
	for( event of $gameMap.events() ){
		event.loadedLight =false;
	}
	for( member of $gameParty.members()){
		member.loadedLight = false;
	}
};

const _lightMapUpdate = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
	_lightMapUpdate.call(this);
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
	this.darkness.bitmap.clear();
	this.darkness.bitmap.fillRect(0,0,Graphics.width,Graphics.height,'#000000');
	this.darkness.opacity = $gameVariables.value(ssmbsLight.opacity);
	for( member of $gameParty.members()){
		if(member && member.followerId && !member.loadedLight){

			this.auraLightSprite = new Sprite();
			this.auraLightSprite.z = 1;
			this.auraLightSprite.followerId = member.followerId;
			this.auraLightSprite.actorId = member._actorId;
			this._tilemap.addChild(this.auraLightSprite);
			this.lightArrayPlayer.push(this.auraLightSprite)
			member.loadedLight = true;
		}
		
	}
	for( event of $gameMap.events() ){
		if(!event.loadedLight){
			this.light = new Sprite();
			this.light.x = event.screenX();
			this.light.y = event.screenY();
			this.light.bitmap = null;
			this.light.anchor.x = 0.5;
			this.light.anchor.y = 0.5;
			this.light.z = 2;
			this.light.opacity = 128;
			this.light.blendMode = 1;
			this.light.eventId = event._eventId;
			this._tilemap.addChild(this.light)
			this.lightArrayEvents.push(this.light)
			event.loadedLight = true;
		}
	}
	

	for(eventLight of this.lightArrayEvents){
		if($gameMap.event(eventLight.eventId) && $gameMap.event(eventLight.eventId).page()){
			var event = $gameMap.event(eventLight.eventId);
			var list = event.page().list;
			if(event._battler && event._battler._hp>0 &&event._battler.damageHp>0 && ssmbsLight.attackLightBlink==1 ){
				eventLight.bitmap = ImageManager.loadLight(ssmbsLight.commonLightImg);
				eventLight.x = event.screenX();
				eventLight.y = event.screenY();
				eventLight.opacity = event._battler.damageHp/event._battler.storeDamageHp*255;
				eventLight.scale.x = eventLight.opacity/255;
				eventLight.scale.y = eventLight.scale.x;

				this.darkness.bitmap.blt(
					ImageManager.loadLight(ssmbsLight.commonLightImg),
					0,0,
					eventLight.bitmap.width,
					eventLight.bitmap.height, //图内坐标及大小
					eventLight.x-(eventLight.bitmap.width*eventLight.scale.x*3)*eventLight.anchor.x,
					eventLight.y-(eventLight.bitmap.height*eventLight.scale.y*3)*eventLight.anchor.y-24,// 绘制坐标
					eventLight.bitmap.width*eventLight.scale.x*3,
					eventLight.bitmap.height*eventLight.scale.y*3
				)
			}else{
				for(theCode of list){
					if(theCode.code == 108){
						var parameter = theCode.parameters[0];
						var text = parameter.split(':');
						if(text && text[0]=='light'){
							eventLight.bitmap = ImageManager.loadLight(text[1]);
							eventLight.x = event.screenX();
							eventLight.y = event.screenY();
							var lightEdge = eventLight.bitmap;
							if(text[2])eventLight.scale.x = Number(text[2]);
							if(text[2])eventLight.scale.y = Number(text[2]);
							if(text[3])eventLight.anchor.x = Number(text[3]);
							if(text[4])eventLight.anchor.y = Number(text[4]);
							if(text[5])eventLight.z = Number(text[5]);
							if(text[6])eventLight.opacity = Number(text[6]);
							if(text[7])eventLight.blendMode = Number(text[7]);
							if(text[8])lightEdge = ImageManager.loadLight(text[8])
							if(text[9])eventLight.x = event.screenX()+Number(text[9]);
							if(text[10])eventLight.y = event.screenY()+Number(text[10]);	
							this.darkness.bitmap.blt(
								lightEdge,
								0,0,
								eventLight.bitmap.width,
								eventLight.bitmap.height, //图内坐标及大小
								eventLight.x-(eventLight.bitmap.width*eventLight.scale.x*2)*eventLight.anchor.x,
								eventLight.y-(eventLight.bitmap.height*eventLight.scale.y*2)*eventLight.anchor.y,// 绘制坐标
								eventLight.bitmap.width*eventLight.scale.x*2,
								eventLight.bitmap.height*eventLight.scale.y*2
							)
						}
					}
					
				}
			}
		}else{
			eventLight.opacity = 0;
		}
		
		
	}

	for(playerLight of this.lightArrayPlayer){
		var theCharacter = $gamePlayer;
		if(playerLight.followerId!=-1){
			theCharacter = $gamePlayer._followers._data[playerLight.followerId]
		}
		if(theCharacter.auraLight&&theCharacter.auraRange>0){
			playerLight.bitmap = ImageManager.loadLight(theCharacter.auraLight);
			playerLight.x = theCharacter.screenX();
			playerLight.y = theCharacter.screenY();
			playerLight.scale.x = 48/playerLight.bitmap.width*theCharacter.auraRange*2;
			playerLight.scale.y = 48/playerLight.bitmap.height*theCharacter.auraRange*1.5;
			playerLight.anchor.x = 0.5;
			playerLight.anchor.y = 0.5;
			playerLight.opacity = 96 - this.changeTimer;
			playerLight.blendMode = 1;
			this.darkness.bitmap.blt(
				ImageManager.loadLight(ssmbsLight.commonLightImg),
				0,0,
				ImageManager.loadLight(ssmbsLight.commonLightImg).width,
				ImageManager.loadLight(ssmbsLight.commonLightImg).height, //图内坐标及大小
				playerLight.x-(playerLight.bitmap.width*playerLight.scale.x*1.25)*playerLight.anchor.x,
				playerLight.y-(playerLight.bitmap.height*playerLight.scale.x*1.25)*playerLight.anchor.y-24,// 绘制坐标
				playerLight.bitmap.width*playerLight.scale.x*1.25,
				playerLight.bitmap.height*playerLight.scale.x*1.25
			)
		}else{
			playerLight.bitmap = null;
		}
		
	}
	for( particle of sxlSimpleABS.particle){
		if(particle.light){
			particle.light.bitmap = ImageManager.loadLight(particle.lightImg);
			particle.light.opacity = 128;
			particle.light.blendMode = 1;
			particle.light.anchor.x = 0.5;
			particle.light.anchor.y = 0.5;
			this.darkness.bitmap.blt(
				ImageManager.loadLight(ssmbsLight.commonLightImg),
				0,0,
				ImageManager.loadLight(ssmbsLight.commonLightImg).width,
				ImageManager.loadLight(ssmbsLight.commonLightImg).height, //图内坐标及大小
				particle.light.x-(particle.light.bitmap.width*particle.light.scale.x*1.25)*particle.light.anchor.x,
				particle.light.y-(particle.light.bitmap.height*particle.light.scale.x*1.25)*particle.light.anchor.y,// 绘制坐标
				particle.light.bitmap.width*particle.light.scale.x*1.25,
				particle.light.bitmap.height*particle.light.scale.x*1.25
			)
		}
	}

	for(loot of ssmbsLoot.dropsSprite){
		if(loot.gleam){
			this.darkness.bitmap.blt(
				ImageManager.loadLight(ssmbsLight.commonLightImg),
				0,0,
				ImageManager.loadLight(ssmbsLight.commonLightImg).width,
				ImageManager.loadLight(ssmbsLight.commonLightImg).height, //图内坐标及大小
				loot.x-(32*loot.scale.x*4)*loot.anchor.x,
				loot.y-(32*loot.scale.y*4)*loot.anchor.y,// 绘制坐标
				32*loot.scale.x*4,
				32*loot.scale.y*4
			)
		}
	}
	
};