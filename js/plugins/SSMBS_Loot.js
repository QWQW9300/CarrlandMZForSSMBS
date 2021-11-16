//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Loot
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 地图上掉落物品的插件
 * @author 神仙狼
 *
 * @help
 * 事件内输入脚本：
 * ssmbsLoot.loot(爆出物品的事件ID,爆出物品类型,物品ID)
 * 爆出物品类型: 物品'item' 武器'weapon' 护甲'armor' 金币'gold' 不要省略引号
 * 类型为金币时，物品ID处为金币的数量
 * 
 * 
 * @param 物品跳跃时间
 * @type Number
 * @desc 物品跳跃时间
 * @default 30
 *
 * @param 拾取物品范围
 * @type Number
 * @desc 拾取物品范围
 * @default 96
 *
 * @param 金币图标切换的金额
 * @type Number
 * @desc 金币图标切换的金额
 * @default 500
 *
 * @param 较少金币图标ID
 * @type Number
 * @desc 较少金币图标ID
 * @default 600
 *
 * @param 较多金币图标ID
 * @type Number
 * @desc 较多金币图标ID
 * @default 601
 *
 * @param 物品爆出时的音效
 * @type String
 * @desc 物品爆出时的音效
 * @default Evasion1
 *
 * @param 拾取物品的音效
 * @type String
 * @desc 拾取物品的音效
 * @default Coin
 *
 * @param 物品光效合成方式
 * @type Number
 * @desc 0 正常 1 加法 2 减法
 * @default 1
 * 
 * @param 全部收集按键
 * @type String
 * @desc 这个按键会拾取地图上所有的物品
 * @default z
 *
 * @param 显示名称按键
 * @type String
 * @desc 这个按键会显示地图上物品的名称
 * @default alt
 * 
 * 
 */


var ssmbsLoot = {}||ssmbsLoot;
ssmbsLoot.parameters = PluginManager.parameters('SSMBS_Loot');

ssmbsLoot.maxJumpTime = Number(ssmbsLoot.parameters['物品跳跃时间'] || 30);
ssmbsLoot.pickRange = Number(ssmbsLoot.parameters['拾取物品范围'] || 96);

ssmbsLoot.goldIconChange = Number(ssmbsLoot.parameters['金币图标切换的金额'] || 500);
ssmbsLoot.goldIconId_1 = Number(ssmbsLoot.parameters['较少金币图标ID'] || 600);
ssmbsLoot.goldIconId_2 = Number(ssmbsLoot.parameters['较多金币图标ID'] || 601);

ssmbsLoot.flySe = String(ssmbsLoot.parameters['物品爆出时的音效'] || 'Evasion1');
ssmbsLoot.pickSe = String(ssmbsLoot.parameters['拾取物品的音效'] || 'Coin');
ssmbsLoot.allPick = String(ssmbsLoot.parameters['全部收集按键'] || 'z');
ssmbsLoot.showName = String(ssmbsLoot.parameters['显示名称按键'] || 'alt');
ssmbsLoot.gleamBlend = String(ssmbsLoot.parameters['物品光效合成方式'] || 1);


const _loot_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
	_loot_createLowerLayer.call(this);
	ssmbsLoot.dropsSprite = [];
	ssmbsLoot._tilemap = this._tilemap;
};

const _loot_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function(){
	_loot_update.call(this);
	for( i in ssmbsLoot.dropsSprite ){

		if(ssmbsLoot.dropsSprite[i].oriDisX!=$gameMap._displayX){
			ssmbsLoot.dropsSprite[i].x += (ssmbsLoot.dropsSprite[i].oriDisX - $gameMap._displayX)*48;
			ssmbsLoot.dropsSprite[i].oriDisX = $gameMap._displayX;
		}
		if(ssmbsLoot.dropsSprite[i].oriDisY!=$gameMap._displayY){
			ssmbsLoot.dropsSprite[i].y += (ssmbsLoot.dropsSprite[i].oriDisY - $gameMap._displayY)*48;
			ssmbsLoot.dropsSprite[i].oriDisY = $gameMap._displayY;
		}
		if(ssmbsLoot.dropsSprite[i].gleam){
			ssmbsLoot.dropsSprite[i].gleam.x = ssmbsLoot.dropsSprite[i].x;
			ssmbsLoot.dropsSprite[i].gleam.y = ssmbsLoot.dropsSprite[i].y;
			// ssmbsLoot.dropsSprite[i].gleam.z = 0;
		}
		if(ssmbsLoot.dropsSprite[i].name){
			ssmbsLoot.dropsSprite[i].name.x = ssmbsLoot.dropsSprite[i].x;
			ssmbsLoot.dropsSprite[i].name.y = ssmbsLoot.dropsSprite[i].y;
			ssmbsLoot.dropsSprite[i].nameBackBlack.x = ssmbsLoot.dropsSprite[i].x;
			ssmbsLoot.dropsSprite[i].nameBackBlack.y = ssmbsLoot.dropsSprite[i].y;
		}
		if(ssmbsLoot.dropsSprite[i].jumpTime>0){
			ssmbsLoot.dropsSprite[i].angle += 20;
			ssmbsLoot.dropsSprite[i].x += ssmbsLoot.dropsSprite[i].randomPosition*8;
			ssmbsLoot.dropsSprite[i].y += ssmbsLoot.dropsSprite[i].randomPosition2*8;
			ssmbsLoot.dropsSprite[i].jumpTime--;
			if(ssmbsLoot.dropsSprite[i].jumpTime<ssmbsLoot.maxJumpTime/2){
				ssmbsLoot.dropsSprite[i].y -= 20*(ssmbsLoot.dropsSprite[i].jumpTime/(ssmbsLoot.maxJumpTime/2)-1);
			}else{
				ssmbsLoot.dropsSprite[i].y += 20*(1-ssmbsLoot.dropsSprite[i].jumpTime/(ssmbsLoot.maxJumpTime/2));
			}
		}else{
			if(ssmbsLoot.dropsSprite[i].waitTime<=-30){
				ssmbsLoot.dropsSprite[i].mode = '+'
			}else if(ssmbsLoot.dropsSprite[i].waitTime>=30){
				ssmbsLoot.dropsSprite[i].mode = '-'
			}
			if(ssmbsLoot.dropsSprite[i].mode=='+'){
				ssmbsLoot.dropsSprite[i].waitTime++
			}else if(ssmbsLoot.dropsSprite[i].mode=='-'){
				ssmbsLoot.dropsSprite[i].waitTime--
			}
			if(ssmbsLoot.dropsSprite[i].jumpTime2>0){
				ssmbsLoot.dropsSprite[i].jumpTime2 -=15;
			}
			ssmbsLoot.dropsSprite[i].y -= ssmbsLoot.dropsSprite[i].waitTime/200
			var screenX = Math.floor($gameMap._displayX + ssmbsLoot.dropsSprite[i].x/48)
			var screenY = Math.floor($gameMap._displayY + ssmbsLoot.dropsSprite[i].y/48)
			if(!$gameMap.isPassable(screenX,screenY)){
				ssmbsLoot.dropsSprite[i].randomPosition = 0;
				ssmbsLoot.dropsSprite[i].randomPosition2 = 0;
				ssmbsLoot.dropsSprite[i].x = $gameMap._events[ssmbsLoot.dropsSprite[i].event]?$gameMap._events[ssmbsLoot.dropsSprite[i].event].screenX():$gamePlayer.screenX();
				ssmbsLoot.dropsSprite[i].y = $gameMap._events[ssmbsLoot.dropsSprite[i].event]?$gameMap._events[ssmbsLoot.dropsSprite[i].event].screenY()-24:$gamePlayer.screenY();
				ssmbsLoot.dropsSprite[i].jumpTime = ssmbsLoot.maxJumpTime;
			}
			ssmbsLoot.dropsSprite[i].angle = 0;
			if( ssmbsLoot.dropsSprite[i].opacity>=255 &&
				$gamePlayer.screenX() < ssmbsLoot.dropsSprite[i].x+ssmbsLoot.pickRange/2 &&
				$gamePlayer.screenX() > ssmbsLoot.dropsSprite[i].x-ssmbsLoot.pickRange/2 &&
				$gamePlayer.screenY()-24 < ssmbsLoot.dropsSprite[i].y+ssmbsLoot.pickRange/2 &&
				$gamePlayer.screenY()-24 > ssmbsLoot.dropsSprite[i].y-ssmbsLoot.pickRange/2
				){	
					var amount = ssmbsLoot.dropsSprite[i].amount;
					var quantity = ssmbsLoot.dropsSprite[i].quantity;
					var item = ssmbsLoot.dropsSprite[i].item;
					if(ssmbsLoot.dropsSprite[i].gleam){
						ssmbsLoot.dropsSprite[i].gleam.destroy();
						ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i].gleam);
					}
					if(ssmbsLoot.dropsSprite[i].name){
						ssmbsLoot.dropsSprite[i].name.destroy();
						ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i].name);
						ssmbsLoot.dropsSprite[i].nameBackBlack.destroy();
						ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i].nameBackBlack);
					}
					ssmbsLoot.dropsSprite[i].destroy();
					ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i]);
					ssmbsLoot.dropsSprite.splice(i,1);
					// SoundManager.playMiss();
					var sound = {
						name: ssmbsLoot.pickSe,
						volume: 90,
						pitch: 150
					}
					AudioManager.playSe(sound);
					if(item=='gold'){
						$gameParty.gainGold(quantity , 1)
					}else{
						$gameParty.gainItem(item , amount)
					}
					
			}
			
		}	
	}
	if( Input.isPressed(ssmbsLoot.allPick) ){
		var sound = {
			name: ssmbsLoot.pickSe,
			volume: 90,
			pitch: 150
		}
		if( ssmbsLoot.dropsSprite.length > 0 ) AudioManager.playSe(sound);
		for( i in ssmbsLoot.dropsSprite ){
			if(ssmbsLoot.dropsSprite[i].opacity>=255){
				var amount = ssmbsLoot.dropsSprite[i].amount;
				var quantity = ssmbsLoot.dropsSprite[i].quantity;
				var item = ssmbsLoot.dropsSprite[i].item;
				if(ssmbsLoot.dropsSprite[i].gleam){
					ssmbsLoot.dropsSprite[i].gleam.destroy();
					ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i].gleam);
				}
				if(ssmbsLoot.dropsSprite[i].name){
					ssmbsLoot.dropsSprite[i].name.destroy();
					ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i].name);
					ssmbsLoot.dropsSprite[i].nameBackBlack.destroy();
					ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i].nameBackBlack);
				}
				ssmbsLoot.dropsSprite[i].destroy();
				ssmbsLoot._tilemap.removeChild(ssmbsLoot.dropsSprite[i]);
				ssmbsLoot.dropsSprite.splice(i,1);

				if(item=='gold'){
					$gameParty.gainGold(quantity , 1)
				}else{
					$gameParty.gainItem(item , amount)
				}
				
			}
		}
	}
	if( Input.isPressed(ssmbsLoot.showName) ){
		for( i in ssmbsLoot.dropsSprite ){
			if(ssmbsLoot.dropsSprite[i].name){
				ssmbsLoot.dropsSprite[i].name.opacity += 10;
				ssmbsLoot.dropsSprite[i].nameBackBlack.opacity = ssmbsLoot.dropsSprite[i].name.opacity/2;
			}
		}
	}else{
		for( i in ssmbsLoot.dropsSprite ){
			if(ssmbsLoot.dropsSprite[i].name){
				ssmbsLoot.dropsSprite[i].name.opacity -= 10;
				ssmbsLoot.dropsSprite[i].nameBackBlack.opacity = ssmbsLoot.dropsSprite[i].name.opacity/2;
			}
		}
	}
};

ssmbsLoot.loot = function(eventId,type,id,amount){
	var theItem;
	var sound = {
		name: ssmbsLoot.flySe,
		volume: 75,
		pitch: 150
	}
	AudioManager.playSe(sound);

	if(!amount){
		amount = 1;
	}
	switch (type){
		case 'item':
			theItem = $dataItems[id]
			break;
		case 'weapon':
			theItem = $dataWeapons[id]
			break;
		case 'armor':
			theItem = $dataArmors[id]
			break;
		case 'gold':
			theItem = 'gold'
			break;
	}

	var itemSprite = new Sprite();

	var icon = theItem.iconIndex;
	itemSprite.bitmap = ImageManager.loadSystem('IconSet');
	if(theItem == 'gold'){
		itemSprite.item = 'gold';
		itemSprite.quantity = id;
		if(id<ssmbsLoot.goldIconChange){
			itemSprite.setFrame(ssmbsLoot.goldIconId_1 % 16*32,Math.floor(ssmbsLoot.goldIconId_1 / 16)*32,32,32);
		}else{
			itemSprite.setFrame(ssmbsLoot.goldIconId_2 % 16*32,Math.floor(ssmbsLoot.goldIconId_2 / 16)*32,32,32);
		}
	}else{
		itemSprite.setFrame(icon % 16*32,Math.floor(icon / 16)*32,32,32);
		itemSprite.item = theItem;
	} 

	if(eventId == 'TouchPostion'){
		itemSprite.x = TouchInput.x;
		itemSprite.y = TouchInput.y;
		itemSprite.randomPosition = 0;
		itemSprite.randomPosition2 = 0;
		itemSprite.event = $gamePlayer;
	}else if(eventId == 'aroundPlayer'){
		let offsetX = Math.random()>0.5?true:false;
		let offsetY = Math.random()>0.5?true:false;
		let directionX = Math.random()>0.5?0:1;
		let directionY = Math.random()>0.5?0:1;
		itemSprite.x = $gamePlayer.screenX()+(offsetX?48*directionX:-48*directionX)*(Math.random()+1)*1;
		itemSprite.y = $gamePlayer.screenY()+(offsetY?48*directionY:-48*directionY)*(Math.random()+1)*1;
		itemSprite.randomPosition = 0;
		itemSprite.randomPosition2 = 0;
		itemSprite.event = $gamePlayer;
	}else{
		itemSprite.x = $gameMap._events[eventId].screenX();
		itemSprite.y = $gameMap._events[eventId].screenY();
		itemSprite.randomPosition = Math.random()-0.5;
		itemSprite.randomPosition2 = Math.random()-0.5;
		itemSprite.event = eventId;
	}
	itemSprite.amount = amount;
	itemSprite.waitTime = 30;
	itemSprite.anchor.x = 0.5;
	itemSprite.anchor.y = 0.5;
	// itemSprite.z = 1;
	itemSprite.float = 0;
	itemSprite.oriDisX = $gameMap._displayX;
	itemSprite.oriDisY = $gameMap._displayY;
	itemSprite.jumpTime = ssmbsLoot.maxJumpTime;
	
	itemSprite.nameBackBlack = new Sprite(new Bitmap(128,32) );
	itemSprite.nameBackBlack.x = itemSprite.x;
	itemSprite.nameBackBlack.y = itemSprite.y;
	itemSprite.nameBackBlack.anchor.x = 0.5;
	itemSprite.nameBackBlack.anchor.y = 1.5;
	// itemSprite.nameBackBlack.z = 1;
	itemSprite.nameBackBlack.opacity = 0;

	itemSprite.name = new Sprite(new Bitmap(128,32) );
	itemSprite.name.x = itemSprite.x;
	itemSprite.name.y = itemSprite.y;
	itemSprite.name.anchor.x = 0.5;
	itemSprite.name.anchor.y = 1.5;
	// itemSprite.name.z = 2;
	itemSprite.name.opacity = 0;
	if(theItem!='gold'){
		var color1 = theItem.meta.textColor?ColorManager.textColor(Number(theItem.meta.textColor)):ColorManager.textColor(0);
		var color2 = theItem.meta.textColor2?ColorManager.textColor(Number(theItem.meta.textColor2)):color1;
		itemSprite.name.bitmap.drawTextGradient(theItem.name,0,0,128,32,'center',color1,color2)
	}else{
		itemSprite.name.bitmap.drawTextGradient(itemSprite.quantity+' '+$dataSystem.currencyUnit,0,0,128,32,'center','#ffffff','#ffffff')
	}

	if(theItem!='gold'){
		var nameWidth = itemSprite.nameBackBlack.bitmap.measureTextWidth(theItem.name+'  ')
	}else{
		var nameWidth = itemSprite.nameBackBlack.bitmap.measureTextWidth(theItem.quantity+' '+$dataSystem.currencyUnit+'  ')
	}
	itemSprite.nameBackBlack.bitmap.fillRect(itemSprite.nameBackBlack.bitmap.width/2-nameWidth/2,0,nameWidth,32,'#000000')
	if(theItem != 'gold' && theItem.meta.gleam){
		itemSprite.gleam = new Sprite();
		itemSprite.gleam.bitmap = ImageManager.loadSystem(theItem.meta.gleam);
		itemSprite.gleam.x = itemSprite.x;
		itemSprite.gleam.y = itemSprite.y;
		// itemSprite.gleam.z = 0;
		itemSprite.gleam.blendMode = ssmbsLoot.gleamBlend;
		itemSprite.gleam.anchor.x = 0.5;
		itemSprite.gleam.anchor.y = 0.5;
		ssmbsLoot._tilemap.addChild(itemSprite.gleam);
	}
	ssmbsLoot.dropsSprite.push(itemSprite);
	ssmbsLoot._tilemap.addChild(itemSprite);
	ssmbsLoot._tilemap.addChild(itemSprite.nameBackBlack);
	ssmbsLoot._tilemap.addChild(itemSprite.name);
	
	
};