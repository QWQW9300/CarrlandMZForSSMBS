//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Shop
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 图标商店系统
 * @author 神仙狼
 * 
 * @help
 * 需要开启商店时，在事件的脚本页面输入
 * sxlSimpleShop.createShop( 商店头像, 商店标语, [物品1, 物品2 ……], 商店是否为有限商店 );
 * 物品商店每行7个。
 * 如果是有限商店，则商店内物品仅可被购买一次，下次开启商店时补充。
 * 同时玩家出售的物品也将出现在商店列表内。
 * 
 * 例如：
 * sxlSimpleShop.createShop( ['Actor2',6],  ['你来了啊冒险者','欢迎您的到来'], 
 * [$dataItems[7],$dataWeapons[2],$dataWeapons[3],   
 * $dataWeapons[4],$dataWeapons[5],$dataWeapons[6],  
 * $dataWeapons[7],$dataWeapons[8]], true );
 * 
 *
 * 
*/

var sxlSimpleShop = sxlSimpleShop||{};
sxlSimpleShop.sprites = [];

const _sxlAbs_shop_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_sxlAbs_shop_mapLoad.call(this);
	this.shopPlugin = true;
	this.initializeShopWindow();
};

const _sxlAbs_shop_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlAbs_shop_update.call(this);
	this.updateShop();
	// if  ((((this.shopPlugin && sxlSimpleShop.window.opacity >= 255) || (this.upgradeWindow && this.upgradeWindow.opacity == 255)) && (this.itemBackground && this.itemBackground.x < 348 ))&&
	// 	((((this.shopPlugin && sxlSimpleShop.window.opacity >= 255) || (this.upgradeWindow && this.upgradeWindow.opacity == 255)) && (this.itemBackground && this.itemBackground.y < 534 )))){
	// 	this.itemBackground.x = 456;
	// 	this.itemBackground.y = 64;
	// 	this.actorImage.anchor.x = 0.5;
	// 	this.actorImage.x = this.itemBackground.x+this.itemBackground.bitmap.width/2 ;
	// 	this.actorImage.y = this.itemBackground.y + 34;
	// 	this.nameBackGround.x = this.itemBackground.x + 149 ;
	// 	this.nameBackGround.y = this.itemBackground.y ;
	// 	this.actorInformation.x = this.itemBackground.x + 149 ;
	// 	this.actorInformation.y = this.itemBackground.y ;
	// 	this.switchMmeberPre.x = this.itemBackground.x + 149 ;
	// 	this.switchMmeberPre.y = this.itemBackground.y ;
	// 	this.switchMmeberNext.x = this.itemBackground.x + 149 ;
	// 	this.switchMmeberNext.y = this.itemBackground.y ;
	// 	this.itemPage.x = this.itemBackground.x + 149;
	// 	this.itemPage.y = this.itemBackground.y + 435;
	// 	// this.refreshItems();
	// }
}

Scene_Map.prototype.initializeShopWindow = function(){
	this.haveShopPlughin = true;
	sxlSimpleShop.sceneMap = this;
	sxlSimpleShop.window = new Sprite();
	sxlSimpleShop.window.items = [];
	sxlSimpleShop.window.bitmap = ImageManager.loadSystem('shopBackground');
	sxlSimpleShop.window.opacity = 0;
	sxlSimpleShop.face = new Sprite();
	sxlSimpleShop.face.x = sxlSimpleShop.window.x + 13;
	sxlSimpleShop.face.y = sxlSimpleShop.window.y + 46;
	sxlSimpleShop.face.scale.x = 0.5;
	sxlSimpleShop.face.scale.y = 0.5;
	sxlSimpleShop.face.opacity = 0;
	sxlSimpleShop.words = new Sprite(new Bitmap(192,74));
	sxlSimpleShop.words.x = sxlSimpleShop.window.x + 93;
	sxlSimpleShop.words.y = sxlSimpleShop.window.y + 46;
	sxlSimpleShop.words.opacity = 0;
	this.iconRareShop = new Sprite(new Bitmap( Graphics.width, Graphics.height ));
	this.iconRareShop.opacity = 0 ;
	this.iconRareShop.blendMode = 1;
	this.shopGold = new Sprite(new Bitmap (298,470) );
	
};

Scene_Map.prototype.updateShop = function(){
	
	if( sxlSimpleShop.window.items.length > 0 || sxlSimpleShop.window.opacity>= 255 ){
		this.iconRareShop.bitmap.clear();
		this.iconRareShop.opacity = sxlSimpleItemList.rareIconOpacity;
		for( theItem of sxlSimpleShop.window.items ){
			if(theItem.item.meta.bkgIcon){
				var bkgIcon = Number(theItem.item.meta.bkgIcon)
			}else{
				for( color in sxlSimpleItemList.rareColorIcon){
					if(Number(theItem.item.meta.textColor) == sxlSimpleItemList.rareColor[color]){
						var bkgIcon = sxlSimpleItemList.rareColorIcon[color];
					}
					if(!theItem.item.meta.textColor){
						var bkgIcon = sxlSimpleItemList.rareColorIcon[0];
					}
				}
			}
			if(!theItem.item.meta.hide){
				this.iconRareShop.bitmap.blt(
					ImageManager.loadSystem('IconSet'),
					bkgIcon % 16*32,Math.floor(bkgIcon / 16)*32, //切割坐标
					32,	32,//切割尺寸
					theItem.x-(32*theItem.anchor.x), theItem.y-(32*theItem.anchor.x),// 绘制坐标
					32,	32 //最终大小
				)
			}
		}
		if( sxlSimpleItemList.iconRareBlink != 0 ){
			for( theItem of sxlSimpleShop.window.items ){
				if(theItem.item.meta.textColor){
					var textColor = ColorManager.textColor(Number(theItem.item.meta.textColor))
				}else{
					var textColor = '#ffffff'
				}
				if(!theItem.item.meta.hide) this.iconRareShop.bitmap.gradientFillRect(  theItem.x,theItem.y+16,32,16,'#000000',textColor,true );
			};
				
			if( this.iconRareShop.opacity <= 30 ){
				this.iconRareShop.opacityChange = 0.25 ;
			}
			if( this.iconRareShop.opacity >= 50 ){
				this.iconRareShop.opacityChange = -0.25 ;
			}
		}
		if(!this.shopGold){

		}else{

			function toThousands(num) {
			    var result = '', counter = 0;
			    num = (num || 0).toString();
			    for (var i = num.length - 1; i >= 0; i--) {
			        counter++;
			        result = num.charAt(i) + result;
			        if (!(counter % 3) && i != 0) { result = ',' + result; }
			    }
			    return result;
			}
			this.shopGold.bitmap.clear();
			this.shopGold.x = sxlSimpleShop.window.x + 173;
			this.shopGold.y = sxlSimpleShop.window.y + 437;
			this.shopGold.bitmap.fontSize = $gameSystem.mainFontSize() - 12 ;
			this.shopGold.bitmap.drawText( toThousands($gameParty.gold()) + '      ' , 0, 0, 112, 24, 'right'  )
		}
		sxlSimpleShop.face.x = sxlSimpleShop.window.x + 13;
		sxlSimpleShop.face.y = sxlSimpleShop.window.y + 40;
		sxlSimpleShop.words.x = sxlSimpleShop.window.x + 93;
		sxlSimpleShop.words.y = sxlSimpleShop.window.y + 40;
		if( TouchInput.x > sxlSimpleShop.window.x+267 &&
			TouchInput.x < sxlSimpleShop.window.x+298 &&
			TouchInput.y > sxlSimpleShop.window.y+10 &&
			TouchInput.y < sxlSimpleShop.window.y+30 ){
			$gameParty.members()[0]._tp = 0;
			if(TouchInput.isClicked() ) sxlSimpleShop.closeShop();
		}
		var i = 0;
		for( theItem of sxlSimpleShop.window.items ){
			if( theItem.item.meta.currency ){
				theItem.currency = $dataItems[theItem.item.meta.currency.split(',')[0]];
				theItem.currencyNeedNumber = Number(theItem.item.meta.currency.split(',')[1]);
				// console.log(theItem.currency)
				if($gameParty.numItems(theItem.currency)>=theItem.currencyNeedNumber){
					theItem.currencyEnough = true;
				}else{
					theItem.currencyEnough = false;
				}
				if($gameParty.numItems(theItem.currency)>=theItem.currencyNeedNumber*10){
					theItem.currencyEnoughTen = true;
				}else{
					theItem.currencyEnoughTen = false;
				}
			}

			if( TouchInput.isPressed() &&
				TouchInput.x > theItem.x &&
				TouchInput.x < theItem.x+32 &&
				TouchInput.y > theItem.y &&
				TouchInput.y < theItem.y+32){
				this.isHandledItem = theItem;
				this.item = theItem.item;
				this.itemType = 'shop';
			}
			if(TouchInput.x > theItem.x &&
				TouchInput.x < theItem.x+32 &&
				TouchInput.y > theItem.y &&
				TouchInput.y < theItem.y+32){
				if(TouchInput.isHovered()){
					this.itemInform = null;
				}else{
					this.itemType = 'shop';
					this.itemInform = theItem.item;
				}
			}
			if( TouchInput.isCancelled() &&
				TouchInput.x > theItem.x &&
				TouchInput.x < theItem.x+32 &&
				TouchInput.y > theItem.y &&
				TouchInput.y < theItem.y+32){
				if(Input.isPressed( 'shift' ) && !sxlSimpleShop.sellOut){
					if($gameParty._gold>=theItem.item.price*10 && 
						(!theItem.currency || theItem.currencyEnoughTen) ){
						SoundManager.playShop();
						$gameParty.loseGold(theItem.item.price*10);
						if(theItem.currency){
							$gameParty.loseItem( theItem.currency,theItem.currencyNeedNumber*10 )
						}
						$gameParty.gainItem(theItem.item,10);


					}else{
						SoundManager.playBuzzer();
						sxlSimpleABS.showInformation(     
							'购买失败：',
							ColorManager.textColor(0)
						)
						SoundManager.playBuzzer();
						sxlSimpleABS.showInformation(     
							' · 需要金币: '+theItem.item.price*10+' (持有金币: '+$gameParty.gold()+')',
							ColorManager.textColor(0)
						)
						SoundManager.playBuzzer();
						sxlSimpleABS.showInformation(     
							' · 需要'+theItem.currency.name+': '+theItem.currencyNeedNumber*10+' (持有'+theItem.currency.name+': '+$gameParty.numItems(theItem.currency)+')',
							ColorManager.textColor(theItem.currency.meta.textColor?Number(theItem.currency.meta.textColor):0)
						)
					}
				}else{
					if($gameParty._gold>=theItem.item.price && 
						(!theItem.currency || theItem.currencyEnough) ){
						SoundManager.playShop();
						$gameParty.loseGold(theItem.item.price);
						if(theItem.currency){
							$gameParty.loseItem( theItem.currency,theItem.currencyNeedNumber )
						}
						$gameParty.gainItem(theItem.item,1)
						if(sxlSimpleShop.sellOut){
							sxlSimpleShop.sceneMap.removeChild(theItem);
							sxlSimpleShop.window.items.splice(i,1);
						}
						
						
					}else{
						SoundManager.playBuzzer();
						sxlSimpleABS.showInformation(     
							'购买失败：',
							ColorManager.textColor(0)
						)
						SoundManager.playBuzzer();
						sxlSimpleABS.showInformation(     
							' · 需要金币: '+theItem.item.price+' (持有金币: '+$gameParty.gold()+')',
							ColorManager.textColor(0)
						)
						SoundManager.playBuzzer();
						sxlSimpleABS.showInformation(     
							' · 需要'+theItem.currency.name+': '+theItem.currencyNeedNumber+' (持有'+theItem.currency.name+': '+$gameParty.numItems(theItem.currency)+')',
							ColorManager.textColor(theItem.currency.meta.textColor?Number(theItem.currency.meta.textColor):0)
						)
					}
				}
			}
			i++;
		}
	}
	if(this.item&&this.itemType!='shop'){
		if(TouchInput.isReleased() && sxlSimpleShop.window.opacity >= 255 &&
			TouchInput.x > sxlSimpleShop.window.x &&
			TouchInput.x < sxlSimpleShop.window.x + 298 &&
			TouchInput.y > sxlSimpleShop.window.y + 128 &&
			TouchInput.y < sxlSimpleShop.window.y + 450){
			
			if(this.item.price!=0){
				SoundManager.playShop();
				$gameParty.gainGold(this.item.price*0.5*$gameParty.numItems(this.item));
				$gameParty.loseItem(this.item,$gameParty.numItems(this.item));
				if(sxlSimpleShop.sellOut){
					var newItem = new Sprite();
					newItem.item = this.item;
					newItem.bitmap = ImageManager.loadSystem('IconSet');
					newItem.setFrame(newItem.item.iconIndex % 16*32,Math.floor(newItem.item.iconIndex / 16)*32,32,32);
					sxlSimpleShop.window.items.push(newItem)
					newItem.x = (sxlSimpleShop.window.x + 13)+(sxlSimpleShop.window.items.length-1)%7*40;
					newItem.y = (sxlSimpleShop.window.y + 120)+Math.floor((sxlSimpleShop.window.items.length-1)/7)*40;
					newItem.id = sxlSimpleShop.window.items.length;
					sxlSimpleShop.sceneMap.addChild(newItem);
					sxlSimpleShop.sprites.push(newItem);
				}
			}else{
				this.showDamage( $gamePlayer , '无法出售该物品' , 14 ,25, 'word'  )
			}
		}
	}
	if( sxlSimpleShop && sxlSimpleShop.window.opacity == 255){
		for(i in sxlSimpleShop.window.items){
			sxlSimpleShop.window.items[i].x = (sxlSimpleShop.window.x + 13)+i%7*40;
			sxlSimpleShop.window.items[i].y = (sxlSimpleShop.window.y + 120)+Math.floor(i/7)*40;
		}
		if(TouchInput.x > sxlSimpleShop.window.x &&
			TouchInput.x < sxlSimpleShop.window.x+300 &&
			TouchInput.y > sxlSimpleShop.window.y  &&
			TouchInput.y < sxlSimpleShop.window.y+500 ){
			$gameParty.members()[0]._tp = 0;
		}
		if( TouchInput.isTriggered() && 
			TouchInput.x > sxlSimpleShop.window.x &&
			TouchInput.x < sxlSimpleShop.window.x+269 &&
			TouchInput.y > sxlSimpleShop.window.y  &&
			TouchInput.y < sxlSimpleShop.window.y+32 ){

			if(!this.bindWindow){
				this.bindWindow = 'shopWindow';
			}
			this.shopWindowMoveWithMouse = true;
		}else if(TouchInput.isHovered()){
			this.shopWindowMoveWithMouse = false;
			this.bindWindow = null;
		}
		if(this.shopWindowMoveWithMouse == true && this.bindWindow == 'shopWindow'){
			sxlSimpleShop.window.x = TouchInput.x - sxlSimpleShop.window.width/2;
			sxlSimpleShop.window.y = TouchInput.y - 16;
			// sxlSimpleFaces.storeX = this.sxlSimpleShop.window.x;
			// sxlSimpleFaces.storeY = this.sxlSimpleShop.window.y;
		}
			if(sxlSimpleShop.window.x<0) sxlSimpleShop.window.x=0;
			if(sxlSimpleShop.window.y<0) sxlSimpleShop.window.y=0;
			if(sxlSimpleShop.window.x>Graphics.width - sxlSimpleShop.window.width) sxlSimpleShop.window.x=Graphics.width - sxlSimpleShop.window.width;
			if(sxlSimpleShop.window.y>Graphics.height - sxlSimpleShop.window.height) sxlSimpleShop.window.y=Graphics.height - sxlSimpleShop.window.height;
	}
	
};

sxlSimpleShop.createShop = function(face,word,setItems,sellOut){

	sxlSimpleShop.sceneMap.addChild(sxlSimpleShop.window);
	sxlSimpleShop.sceneMap.addChild(sxlSimpleShop.sceneMap.iconRareShop);
	sxlSimpleShop.sceneMap.addChild(sxlSimpleShop.sceneMap.shopGold);
	if(sxlSimpleShop.sceneMap.shopGold){
		sxlSimpleShop.sceneMap.shopGold.opacity = 255;
	}
	
	sxlSimpleShop.window.opacity = 255;
	sxlSimpleShop.window.x = 96;
	sxlSimpleShop.window.y = 64;
	if(this.haveUpgradePlugin){
		sxlSimpleEquipmentUpgrade.hideWindow();
	}
	if(face){
		sxlSimpleShop.face.bitmap = ImageManager.loadFace(face[0]);
		sxlSimpleShop.face.setFrame( face[1] % 4 * 144, Math.floor(face[1] / 4) * 144 , 144, 144);
		sxlSimpleShop.sceneMap.addChild(sxlSimpleShop.face);
		sxlSimpleShop.face.opacity = 255;

	}
	if(word){
		var line = 0;
		sxlSimpleShop.words.bitmap.fontSize = 12;
		var lineHeight = sxlSimpleShop.words.bitmap.fontSize + 4 ;
		for( i in word ){
			sxlSimpleShop.words.bitmap.drawText(word[i],6,line*lineHeight+6,168,lineHeight,'left');
			line ++ ;
		}
		sxlSimpleShop.sceneMap.addChild(sxlSimpleShop.words);
		sxlSimpleShop.words.opacity = 255;
	}
	for( i in setItems ){
		var itemSprite = new Sprite();
		itemSprite.bitmap = ImageManager.loadSystem('IconSet');
		itemSprite.setFrame(setItems[i].iconIndex % 16*32,Math.floor(setItems[i].iconIndex / 16)*32,31,31);
		itemSprite.x = (sxlSimpleShop.window.x + 13)+i%7*40;
		itemSprite.y = (sxlSimpleShop.window.y + 120)+Math.floor(i/7)*40;
		itemSprite.item = setItems[i];
		itemSprite.posId = i;
		sxlSimpleShop.window.items.push(itemSprite);
		sxlSimpleShop.sceneMap.addChild(itemSprite);
		sxlSimpleShop.sprites.push(itemSprite);
	}
	if(!sellOut){
		sxlSimpleShop.sellOut = false;
	}
	sxlSimpleShop.sellOut = sellOut;
};

sxlSimpleShop.closeShop = function(){
	for( i in sxlSimpleShop.sprites ){
		sxlSimpleShop.sprites[i].opacity = 0;

		sxlSimpleShop.sceneMap.removeChild(sxlSimpleShop.sprites[i])
		// sxlSimpleShop.sprites[i].destroy();
		// sxlSimpleShop.sprites.splice(i,1);
	}
	sxlSimpleShop.sceneMap.shopGold.opacity = 0;
	sxlSimpleShop.sceneMap.removeChild(sxlSimpleShop.sceneMap.iconRareShop)
	sxlSimpleShop.sceneMap.removeChild(sxlSimpleShop.window);
	sxlSimpleShop.sceneMap.removeChild(sxlSimpleShop.face);
	sxlSimpleShop.sceneMap.removeChild(sxlSimpleShop.words);
	sxlSimpleShop.sceneMap.initializeShopWindow();
}