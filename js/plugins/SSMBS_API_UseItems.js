
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System _ UseSkills
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简易的地图战斗系统附属，使用物品的快捷方式
 * @author 神仙狼
 * 
 */

sxlSimpleABS.useItem = function(item,user){
	//装备的情况
	
	if( item.etypeId ){
		//判断是否可用
		if(user.battler().canEquip(item)){
			//可用
			SoundManager.playEquip();
			user.battler().changeEquip( item.etypeId - 1 , item )
		}else{
			//无法使用

		}
		
	}
	//物品的情况
	if( item.itypeId){
		if(item.scId){
			let cd = item.meta.cooldown?Number(item.meta.cooldown):30;
			sxlSimpleABS.sceneMap.shorcutItem[item.scId].cd = cd;
	
		}
		if(item.itypeId && item.occasion != 3){
			let cd = item.meta.cooldown?Number(item.meta.cooldown):30;
			item.MaxCD = cd;
			item.cd = cd;
		}
		//判断是否是消耗品
		if(item.consumable){
			//判断物品数量是否足够
			if($gameParty.numItems(item) > 0){
				//消耗物品
				$gameParty.consumeItem(item)
			}else{
				//物品不足
			}
		}
		//计算物品效果(物品大于0的情况)
		if( $gameParty.numItems(item) > 0 ){
			//显示动画
			$gameTemp.requestAnimation( [user], item.animationId , false );
			//判定物品效果
			let itemAction = new Game_Action( user.battler() );
			itemAction.setItem( item.id );
			itemAction.apply( user.battler() );
			if(item.meta.resetParamPoints){
				SSMBS_Window_Equip.resetParamPoints(user.battler()._actorId)
			}
			if(item.meta.useSkill){
				sxlSimpleABS.useSkill($dataSkills[Number(item.meta.useSkill)],user);
			}
			//执行公共事件
			for(effect of item.effects){
				if(effect.code==44){
					$gameTemp.reserveCommonEvent(effect.dataId);
				}
			}
		}
	}
};

