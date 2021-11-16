//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Params
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 装备强化插件
 * @author 神仙狼
 *
 * @help
 *
 * 属性插件，为SSMBS所有插件调整属性
 *
 */

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
		if( this._actorId ){
			value += this.paramAdd?this.paramAdd[paramId]:0;
		}
	var maxValue = this.paramMax(paramId);
	var minValue = this.paramMin(paramId);
	return Math.round(value.clamp(minValue, maxValue));
};