//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Equipments Upgeade
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 装备强化插件
 * @author 神仙狼
 *
 * @help
 *
 * 武器/防具备注：
 * <cannotUpgrade> 无法被强化的物品
 * <upgradeCost:Number> 强化所需金币
 * <upgradePlus:Number> 强化时数值的增加值
 * 武器强化会增加物理攻击力和魔法攻击力，
 * 防具强化会增加物理防御力和魔法防御力。
 *
 * 强化的概率计算：
 * 1，每一级强化成功概率为(1 / (装备等级+1) )
 * 2. 总体数值为： 1:100% 2:50% 3:33% 4:25% 5:20%
 *
 * 强化失败后果：
 * 1~3:  没有后果，仅仅消耗强化金币
 * 4~6： 失败后装备等级-1
 * 7~9： 装备等级清空
 * 高于9： 装备等级清空同时这件装备的数量-1
 *
 * @param 强制成功道具ID
 * @type Number
 * @desc 强制成功道具ID，仅道具类别可用，无需设置消耗品，强化失败会自动失去一个
 * @default 50
 *
  * @param 强化保护道具ID
 *  @type Number
 *  @desc 失败时自动失去一个，同时强化失败的惩罚不会触发
 *  @default 49
 *
 */

var sxlSimpleEquipmentUpgrade = sxlSimpleEquipmentUpgrade||{};
sxlSimpleEquipmentUpgrade.parameters = PluginManager.parameters('SSMBS_EquipmentsUpgrade')
sxlSimpleEquipmentUpgrade.forceSucItem = Number(sxlSimpleEquipmentUpgrade.parameters['强制成功道具ID'] || 50);
sxlSimpleEquipmentUpgrade.upgradeProtectItem = Number(sxlSimpleEquipmentUpgrade.parameters['强化保护道具ID'] || 49);

const _sxlAbs_euUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlAbs_euUpdate.call(this);
	this.haveUpgradePlugin = true;
	sxlSimpleEquipmentUpgrade.sceneMap = this;
	if(!$gameParty.enhanceWeapons && !$gameParty.enhanceArmors){
		$gameParty.enhanceWeapons = [];
		$gameParty.enhanceArmors = [];
		this.loadUpgradeData();
	}
	this.createUpgradeWindow();
}

Scene_Map.prototype.loadUpgradeData = function(){
	for( i in $dataWeapons){
		if( i != 0){
			$gameParty.enhanceWeapons.push(
				{	id:$dataWeapons[i].id,
					name:$dataWeapons[i].name,
					enhanceTimes:0
				}
			)
		}
	}
	for( i in $dataArmors){
		if( i != 0){
			$gameParty.enhanceArmors.push(
				{	id:$dataArmors[i].id,
					name:$dataArmors[i].name,
					enhanceTimes:0
				}
			)
		}
	}
};

Scene_Map.prototype.createUpgradeWindow = function(){
	if(!this.upgradeWindow){
		this.upgradeWindow = new Sprite();
		this.upgradeWindow.bitmap = ImageManager.loadSystem('upgradeBackground');
		this.upgradeWindow.x = 48;
		this.upgradeWindow.y = 64;
		this.upgradeWindow.opacity = 0;

		this.addChild(this.upgradeWindow);

		this.upgradeWindow.itemIcon = new Sprite();
		this.upgradeWindow.itemIcon.bitmap = ImageManager.loadSystem('IconSet');
		this.upgradeWindow.itemIcon.setFrame(0 % 16*32,Math.floor(0 / 16)*32,32,32);
		this.upgradeWindow.itemIcon.x = this.upgradeWindow.x + 132 ;
		this.upgradeWindow.itemIcon.y = this.upgradeWindow.y + 143 ;
		
		this.addChild(this.upgradeWindow.itemIcon);

		this.upgradeWindow.word = new Sprite(new Bitmap( 195,200 ) );
		this.upgradeWindow.word.x = this.upgradeWindow.x + 51 ;
		this.upgradeWindow.word.y = this.upgradeWindow.y + 210 ;

		this.addChild(this.upgradeWindow.word);

		this.upgradeWindow.gauge = new Sprite(new Bitmap( 195,6 ) );
		this.upgradeWindow.gauge.x = this.upgradeWindow.x + 51 ;
		this.upgradeWindow.gauge.y = this.upgradeWindow.y + 380 ;

		this.addChild(this.upgradeWindow.gauge);

	}
	this.upgradeWindow.itemIcon.opacity = this.upgradeWindow.opacity;
	this.upgradeWindow.word.opacity = this.upgradeWindow.opacity;
	this.upgradeWindow.gauge.opacity = this.upgradeWindow.opacity;
	this.upgradeWindow.word.bitmap.clear();
	this.upgradeWindow.gauge.bitmap.clear();
	if(	this.upgradeWindow.opacity == 255 &&
		TouchInput.x >= this.upgradeWindow.x + 269 && 
		TouchInput.x <= this.upgradeWindow.x + 285 &&
		TouchInput.y >= this.upgradeWindow.y + 13 && 
		TouchInput.y <= this.upgradeWindow.y + 27 ){
		$gameParty.members()[0]._tp = 0 ;
		if(TouchInput.isClicked()){
			SoundManager.playOk();
			sxlSimpleEquipmentUpgrade.hideWindow();
		}
		
	}
	if(!this.upgradeItem){
		var line = 0 ;
		var lineHeight = 18;
		this.upgradeWindow.word.bitmap.fontSize = 20 ;
		this.upgradeWindow.word.bitmap.fontBold = true ;
		this.upgradeWindow.word.bitmap.fontFace = $gameSystem.mainFontFace();
		this.upgradeWindow.word.bitmap.drawText('暂无道具',0,line * lineHeight,195,90,'center');
		this.upgradeWindow.word.bitmap.fontSize = 12 ;
		this.upgradeWindow.word.bitmap.fontBold = false ;
		this.upgradeWindow.word.bitmap.textColor = "#FFFFFF";
		line++;
		line++;
		this.upgradeWindow.word.bitmap.drawText('请将武器/防具拖入上方法阵中央' ,0,line * lineHeight,195,90,'center');
		line++;
		this.upgradeWindow.word.bitmap.drawText('药水等道具无法进行强化' ,0,line * lineHeight,195,90,'center');
	}
	
	if(this.upgradeItem && this.upgradeWindow.opacity == 255){
		
		if(this.upgradeItem && this.upgradeItem.wtypeId){
			var nowPlus2 = ($gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes ) * 
						($dataWeapons[this.upgradeItem.id].meta.upgradePlus?
					 	$dataWeapons[this.upgradeItem.id].meta.upgradePlus:$dataWeapons[this.upgradeItem.id].params[2]/10);
			var newPlus2 = ($gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes + 1) * 
						($dataWeapons[this.upgradeItem.id].meta.upgradePlus?
					 	$dataWeapons[this.upgradeItem.id].meta.upgradePlus:$dataWeapons[this.upgradeItem.id].params[2]/10);
		 	var nowPlus4 = ($gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes ) * 
						($dataWeapons[this.upgradeItem.id].meta.upgradePlus?
					 	$dataWeapons[this.upgradeItem.id].meta.upgradePlus:$dataWeapons[this.upgradeItem.id].params[4]/10);
			var newPlus4 = ($gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes + 1) * 
						($dataWeapons[this.upgradeItem.id].meta.upgradePlus?
					 	$dataWeapons[this.upgradeItem.id].meta.upgradePlus:$dataWeapons[this.upgradeItem.id].params[4]/10);
		}else if(this.upgradeItem && this.upgradeItem.atypeId){
			var nowPlus3 = ($gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes ) * 
						($dataArmors[this.upgradeItem.id].meta.upgradePlus?
						$dataArmors[this.upgradeItem.id].meta.upgradePlus:$dataArmors[this.upgradeItem.id].params[3]/10);
			var newPlus3 = ($gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes + 1) * 
						($dataArmors[this.upgradeItem.id].meta.upgradePlus?
						$dataArmors[this.upgradeItem.id].meta.upgradePlus:$dataArmors[this.upgradeItem.id].params[3]/10);
			var nowPlus5 = ($gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes ) * 
						($dataArmors[this.upgradeItem.id].meta.upgradePlus?
						$dataArmors[this.upgradeItem.id].meta.upgradePlus:$dataArmors[this.upgradeItem.id].params[5]/10);
			var newPlus5 = ($gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes + 1) * 
						($dataArmors[this.upgradeItem.id].meta.upgradePlus?
						$dataArmors[this.upgradeItem.id].meta.upgradePlus:$dataArmors[this.upgradeItem.id].params[5]/10);
		}

		if(this.upgradeItem ){
			var line = 0 ;
			var lineHeight = 18;
			this.upgradeWindow.word.bitmap.fontSize = 20 ;
			this.upgradeWindow.word.bitmap.fontBold = true ;
			this.upgradeWindow.word.bitmap.fontFace = $gameSystem.mainFontFace();
			this.upgradeWindow.word.bitmap.textColor = this.upgradeItem.meta.textColor?ColorManager.textColor(Number(this.upgradeItem.meta.textColor)):'#FFFFFF';
			this.upgradeWindow.word.bitmap.textColor2 = this.upgradeItem.meta.textColor2?ColorManager.textColor(this.upgradeItem.meta.textColor2):this.upgradeWindow.word.bitmap.textColor;
			if( this.upgradeItem.wtypeId ){
				this.upgradeWindow.word.bitmap.drawTextGradient(this.upgradeItem.name + ' +' + $gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes,0,line * lineHeight,195,90,'center',this.upgradeWindow.word.bitmap.textColor,this.upgradeWindow.word.bitmap.textColor2)
			}
			if( this.upgradeItem.atypeId ){
				this.upgradeWindow.word.bitmap.drawTextGradient(this.upgradeItem.name + ' +' + $gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes,0,line * lineHeight,195,90,'center',this.upgradeWindow.word.bitmap.textColor,this.upgradeWindow.word.bitmap.textColor2)
			}
			line ++ ;
			line ++ ;
			this.upgradeWindow.word.bitmap.fontSize = 12 ;
			this.upgradeWindow.word.bitmap.fontBold = false ;
			this.upgradeWindow.word.bitmap.textColor = "#FFFFFF";
			if( this.upgradeItem.wtypeId ){
				this.upgradeWindow.word.bitmap.drawText(TextManager.param(2) + ': ' + Number(this.upgradeItem.params[2]+nowPlus2)+' → '+Number(this.upgradeItem.params[2]+newPlus2),0,line * lineHeight,195,90,'center');
				line++;
				this.upgradeWindow.word.bitmap.drawText(TextManager.param(4) + ': ' + Number(this.upgradeItem.params[4]+nowPlus4)+' → '+Number(this.upgradeItem.params[4]+newPlus4),0,line * lineHeight,195,90,'center');
				line++;
				this.upgradeWindow.word.bitmap.drawText('强化成功率: ' + Math.floor((1/($gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+1))*100)+'%' ,0,line * lineHeight,195,90,'center');
				var upSuc = (1/($gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+1));
			}
			if( this.upgradeItem.atypeId ){
				this.upgradeWindow.word.bitmap.drawText(TextManager.param(3) + ': ' + Number(this.upgradeItem.params[3]+nowPlus3)+' → '+Number(this.upgradeItem.params[3]+newPlus3),0,line * lineHeight,195,90,'center');
				line++;
				this.upgradeWindow.word.bitmap.drawText(TextManager.param(5) + ': ' + Number(this.upgradeItem.params[5]+nowPlus5)+' → '+Number(this.upgradeItem.params[5]+newPlus5),0,line * lineHeight,195,90,'center');
				line++;
				this.upgradeWindow.word.bitmap.drawText('强化成功率: ' + Math.floor((1/($gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+1))*100)+'%' ,0,line * lineHeight,195,90,'center');
				var upSuc = (1/($gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+1));
			}
			line++;
			if( $gameParty._gold < (this.upgradeItem.meta.upgradeCost?this.upgradeItem.meta.upgradeCost:this.upgradeItem.price/2)*(this.upgradeItem.wtypeId?$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+1:$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+1) ){
				this.upgradeWindow.word.bitmap.textColor = ColorManager.textColor(25);
			}else{
				this.upgradeWindow.word.bitmap.textColor = ColorManager.textColor(14);
			}
			this.upgradeWindow.word.bitmap.drawText('强化费用: ' + (this.upgradeItem.meta.upgradeCost?this.upgradeItem.meta.upgradeCost:this.upgradeItem.price/2)*(this.upgradeItem.wtypeId?$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+1:$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+1) ,0,line * lineHeight,195,90,'center');
			if(	TouchInput.x >= this.upgradeWindow.x + 97 && 
				TouchInput.x <= this.upgradeWindow.x + 200 &&
				TouchInput.y >= this.upgradeWindow.y + 398 && 
				TouchInput.y <= this.upgradeWindow.y + 423 ){
				$gameParty.members()[0]._tp = 0;
				if( this.gaugeAdd == false && TouchInput.isClicked() && $gameParty._gold >= (this.upgradeItem.meta.upgradeCost?this.upgradeItem.meta.upgradeCost:this.upgradeItem.price/2)*(this.upgradeItem.wtypeId?$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+1:$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+1) ){
					AudioManager.playSe({name:'Up8',volume:90,pitch:100})
					this.gaugeAdd = true;
					$gameParty.loseGold((this.upgradeItem.meta.upgradeCost?this.upgradeItem.meta.upgradeCost:this.upgradeItem.price/2)*(this.upgradeItem.wtypeId?$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+1:$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+1) );
				}
			}
			if( this.gaugeAdd ){
				this.gaugeWidth ++ ;
				this.upgradeWindow.gauge.bitmap.fillRect( 0, 0, this.gaugeWidth, 6,'#FFFFFF')
			}
			if( !this.gaugeAdd || this.gaugeWidth >= 195 || !this.gaugeWidth){
				this.gaugeWidth = 0;
				this.gaugeAdd = false;
			}
			if(this.gaugeWidth >= 194){
				var a = Math.random()
				if(a<upSuc){
					AudioManager.playSe({name:'Decision3',volume:90,pitch:100})
					if( this.upgradeItem.wtypeId ){
						$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+=1;
					}else{
						$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+=1;
					}
				}else{
					if($gameParty.hasItem($dataItems[sxlSimpleEquipmentUpgrade.forceSucItem ])){
						AudioManager.playSe({name:'Decision3',volume:90,pitch:100})
						if( this.upgradeItem.wtypeId ){
							$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes+=1;
						}else{
							$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes+=1;
						}
						$gameParty.loseItem( $dataItems[sxlSimpleEquipmentUpgrade.forceSucItem ],1 );
					}else{
						AudioManager.playSe({name:'Break',volume:90,pitch:100})
						if( this.upgradeItem.wtypeId ){
							var nowLv = $gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes;
						}else{
							var nowLv = $gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes;
						}
						if( nowLv>=4 && nowLv < 6 ){ 
							if( !$gameParty.hasItem($dataItems[sxlSimpleEquipmentUpgrade.upgradeProtectItem ])){
								if( this.upgradeItem.wtypeId ){
									$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes-=1;
								}else{
									$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes-=1;
								}
							}else{
								$gameParty.loseItem($dataItems[sxlSimpleEquipmentUpgrade.upgradeProtectItem],1)
							}
							
						}
						if(nowLv>=6 && nowLv < 9 ){ 

							if( !$gameParty.hasItem($dataItems[sxlSimpleEquipmentUpgrade.upgradeProtectItem ])){
								if( this.upgradeItem.wtypeId ){
									$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes=0;
								}else{
									$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes=0;
								}
							}else{
								$gameParty.loseItem($dataItems[sxlSimpleEquipmentUpgrade.upgradeProtectItem],1)
							}	
						}
						if(nowLv>=9){ 
							if( !$gameParty.hasItem($dataItems[sxlSimpleEquipmentUpgrade.upgradeProtectItem ])){
								if( this.upgradeItem.wtypeId ){
									$gameParty.enhanceWeapons[this.upgradeItem.id-1].enhanceTimes=0;
								}else{
									$gameParty.enhanceArmors[this.upgradeItem.id-1].enhanceTimes=0;
								}
								$gameParty.loseItem( this.upgradeItem,1 );
							}else{
								$gameParty.loseItem($dataItems[sxlSimpleEquipmentUpgrade.upgradeProtectItem],1)
							}
						}
					}
				}
			}
		}
	};
	if( this.isHandledItem && this.itemType != 'shop' && this.item.etypeId && !this.gaugeAdd && !this.item.meta.cannotUpgrade){
		if(	TouchInput.x >= this.upgradeWindow.x + 132 && 
			TouchInput.x <= this.upgradeWindow.x + 164 &&
			TouchInput.y >= this.upgradeWindow.y + 144 && 
			TouchInput.y <= this.upgradeWindow.y + 176 ){
			SoundManager.playEquip();
			this.upgradeItem  = this.item;
			this.upgradeWindow.itemIcon.setFrame(this.item.iconIndex % 16*32,Math.floor(this.item.iconIndex / 16)*32,32,32);
		}
	}
	if( this.upgradeWindow && this.upgradeWindow.opacity == 255 ){
		if(TouchInput.x > this.upgradeWindow.x &&
			TouchInput.x < this.upgradeWindow.x+300 &&
			TouchInput.y > this.upgradeWindow.y  &&
			TouchInput.y < this.upgradeWindow.y+500 ){
			$gameParty.members()[0]._tp = 0;
		}
		if( this.upgradeWindow.itemIcon &&
			this.upgradeWindow.word &&
			this.upgradeWindow.gauge){
			this.upgradeWindow.itemIcon.x = this.upgradeWindow.x + 132 ;
			this.upgradeWindow.itemIcon.y = this.upgradeWindow.y + 143 ;
			this.upgradeWindow.word.x = this.upgradeWindow.x + 51 ;
			this.upgradeWindow.word.y = this.upgradeWindow.y + 210 ;
			this.upgradeWindow.gauge.x = this.upgradeWindow.x + 51 ;
			this.upgradeWindow.gauge.y = this.upgradeWindow.y + 380 ;
		}
		if( TouchInput.isTriggered() && 
			TouchInput.x > this.upgradeWindow.x &&
			TouchInput.x < this.upgradeWindow.x+269 &&
			TouchInput.y > this.upgradeWindow.y  &&
			TouchInput.y < this.upgradeWindow.y+32 ){

			if(!this.bindWindow){
				this.bindWindow = 'upgradeWindow';
			}
			this.shopWindowMoveWithMouse = true;
		}else if(TouchInput.isHovered()){
			this.shopWindowMoveWithMouse = false;
			this.bindWindow = null;
		}
		if(this.shopWindowMoveWithMouse == true && this.bindWindow == 'upgradeWindow'){
			this.upgradeWindow.x = TouchInput.x - this.upgradeWindow.width/2;
			this.upgradeWindow.y = TouchInput.y - 16;
			// sxlSimpleFaces.storeX = this.sxlSimpleShop.window.x;
			// sxlSimpleFaces.storeY = this.sxlSimpleShop.window.y;
		}
		if(this.upgradeWindow.x<0) this.upgradeWindow.x=0;
		if(this.upgradeWindow.y<0) this.upgradeWindow.y=0;
		if(this.upgradeWindow.x>Graphics.width - this.upgradeWindow.width) this.upgradeWindow.x=Graphics.width - this.upgradeWindow.width;
		if(this.upgradeWindow.y>Graphics.height - this.upgradeWindow.height) this.upgradeWindow.y=Graphics.height - this.upgradeWindow.height;
	}
	
	
};

Game_BattlerBase.prototype.param = function(paramId) {
	var value =
		this.paramBasePlus(paramId) *
		this.paramRate(paramId) *
		this.paramBuffRate(paramId);
		if( this._actorId && this._equips[0]._itemId!=0 && (paramId == 2 || paramId == 4 ) ){
			value += $gameParty.enhanceWeapons[this._equips[0]._itemId-1].enhanceTimes * 
					($dataWeapons[this._equips[0]._itemId].meta.upgradePlus?
					 $dataWeapons[this._equips[0]._itemId].meta.upgradePlus:$dataWeapons[this._equips[0]._itemId].params[paramId]/10);
		}
		if( this._actorId && (paramId == 3 || paramId == 5 ) ){
			for( i in this._equips){
				if( this._equips[i]._dataClass == 'armor' && this._equips[i]._itemId != 0 ){
					value += $gameParty.enhanceArmors[this._equips[i]._itemId-1].enhanceTimes * 
					($dataArmors[this._equips[i]._itemId].meta.upgradePlus?
					 $dataArmors[this._equips[i]._itemId].meta.upgradePlus:$dataArmors[this._equips[i]._itemId].params[paramId]/10);
				}
			}
		}
	var maxValue = this.paramMax(paramId);
	var minValue = this.paramMin(paramId);
	return Math.round(value.clamp(minValue, maxValue));
};

sxlSimpleEquipmentUpgrade.showWindow = function(){
	sxlSimpleEquipmentUpgrade.sceneMap.upgradeWindow.opacity = 255;
	if(this.haveShopPlughin){
		sxlSimpleShop.closeShop();
	}
};

sxlSimpleEquipmentUpgrade.hideWindow = function(){
	sxlSimpleEquipmentUpgrade.sceneMap.upgradeItem = null;
	sxlSimpleEquipmentUpgrade.sceneMap.upgradeWindow.opacity = 0;
	sxlSimpleEquipmentUpgrade.sceneMap.upgradeWindow.itemIcon.setFrame(0 % 16*32,Math.floor(0 / 16)*32,32,32);
	
};