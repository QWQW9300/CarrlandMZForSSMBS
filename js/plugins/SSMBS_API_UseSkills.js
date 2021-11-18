
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System _ UseSkills
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简易的地图战斗系统附属，使用技能的快捷方式以及技能序列
 * @author 神仙狼
 * 
 */

sxlSimpleABS.useSkill = function(skill,user,target,forced){
	sxlSimpleABS.sceneMap.fixDirection(user)
	if(skill.meta.forced){
		forced = true;
		if(user.sequence.length>0){
			user.locked = false;
			user.sequencesWait =0;
			user.rushCount = 0;
			user.endure = false;
			user._directionFix = false;
		}
	}
	if(skill.scId && user == $gamePlayer){
		let cd = skill.meta.cooldown?Number(skill.meta.cooldown):30;
		sxlSimpleABS.sceneMap.shorcutItem[skill.scId].cd = cd;
	}
	let animation = skill.animationId
	user.skillCast = 0;
	user.waitForCast = 0;
	user.sequence = [];
	if(!skill.meta.skillSequence){
		if(skill.meta.castAnim){
			user.sequence.push({stepName:'animation',stepParam:Number(skill.meta.castAnim)});
		}
		if(skill.meta.cast || skill.meta.spell){
			let waitTime = skill.meta.cast?Number(skill.meta.cast):Number(skill.meta.spell);
			user.sequence.push({stepName:'waitSpell',stepParam:waitTime});
		}
		if(skill.meta.pose){
			user.sequence.push({stepName:'pose',stepParam:skill.meta.pose,stepParam2:30});
		}else{
			user.sequence.push({stepName:'pose',stepParam:'swingDown',stepParam2:30});
		}
		if(skill.meta.img){
			user.sequence.push({stepName:'trigger',stepParam: skill});
		}
	}
	if(skill.meta.skillSequence && (user.sequence.length<=0 || forced)){
		if(!user.faction){
			if(user.battler()._actorId) user.faction = 'player';
			if(user.battler()._enemyId) user.faction = 'enemy';
		}
		user.battler()._mp -= skill.mpCost;
		let sequences = skill.meta.skillSequence.split('\n');
		for(step of sequences){
			let stepName = null;
			let stepParam = null;
			let stepParam2 = null;
			let stepParam3 = null;
			if(step.split(':')[1]){
				stepName = step.split(':')[0];
				stepParam = step.split(':')[1];
				stepParam2 = step.split(':')[2];
				stepParam3 = step.split(':')[3];
			}else{
				stepName = step;
			}
			
			//跳
			if(stepName=='jump'){
				let stepParamNumber = Number(stepParam);
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:stepParamNumber});
			}
			//姿态
			if(stepName=='pose'){
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:stepParam,stepParam2:Number(stepParam2)});
			}
			//弹道
			if(stepName=='trigger'){
				let pSkill;
				if(!stepParam){
					pSkill = skill;
				}else{
					pSkill = $dataSkills[Number(stepParam)];
				}
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam: pSkill,stepParam2:stepParam2,stepParam3:Number(stepParam3),target:target});

			}
			//状态增加
			if(stepName=='addState'){
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:Number(stepParam),addPerSlv:Number(stepParam)});
			}
			//状态去除
			if(stepName=='removeState'){
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:Number(stepParam),addPerSlv:Number(stepParam)});
			}
			//等待
			if(stepName=='wait' || stepName=='waitAttack' || stepName=='waitSpell'){
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:Number(stepParam)});
			}
			//冲刺
			if(stepName=='rush'){
				if(stepParam2 == 'true') stepParam2 = true;
				if(stepParam2 == 'false') stepParam2 = false;
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:Number(stepParam),stepParam2:stepParam2});
			}
			//音效
			if(stepName=='se'){
				if(!stepParam2) stepParam2 = 90;
				if(!stepParam3) stepParam3 = 100;
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:stepParam,stepParam2:Number(stepParam2),stepParam3:Number(stepParam3)});
			}
			//动画
			if(stepName=='animation'){
				if(stepParam3 == 'true') stepParam2 = true;
				if(stepParam3 == 'false') stepParam2 = false;
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:stepParam,stepParam2:stepParam2});
			}
			//锁定
			if(stepName=='user locked' || stepName=='locked'){
				user.sequence.push({skillId: skill.id ,stepName:stepName});
			}
			//解锁
			if(stepName=='user unlocked' || stepName=='unlocked'){
				user.sequence.push({skillId: skill.id ,stepName:stepName});
			}
			//霸体
			if(stepName=='user endure on' || stepName=='endure on'){
				user.sequence.push({skillId: skill.id ,stepName:stepName});
			}
			//解除霸体
			if(stepName=='user endure off' || stepName=='endure off'){
				user.sequence.push({skillId: skill.id ,stepName:stepName});
			}
			//公共事件
			if(stepName=='commonEvent'){
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:Number(stepParam)});
			}
			//方向锁定
			if(stepName=='user directionFix on' || stepName=='directionFix on'){
				user.sequence.push({skillId: skill.id ,stepName:stepName});
			}
			//方向锁定解除
			if(stepName=='user directionFix off' || stepName=='directionFix off'){
				user.sequence.push({skillId: skill.id ,stepName:stepName});
			}
			//召唤
			if(stepName=='summon'){
				user.sequence.push({skillId: skill.id ,stepName:stepName,stepParam:Number(stepParam),stepParam2:Number(stepParam2),stepParam3:Number(stepParam3)});
			}
		}
	}
};

Scene_Map.prototype.updateSequence = function(){

	for( user of sxlSimpleABS.sequenceUser ){
		if( user && user.battler() && user.sequence.length > 0){
			let stepSequence = user.sequence[0];
			let skill = $dataSkills[stepSequence.skillId]
			let linkSkill = skill;
			if(skill && skill.meta.linkSkill){
				linkSkill = $dataSkills[Number(skill.meta.linkSkill)];
			}
			// 等待
			if(stepSequence.stepName=='wait' && user.sequencesWait<=0 ){
				let slvEffect = 0;
				if(user.battler().skillLevels && skill.meta.slvEffectWait){
					slvEffect = Number( skill.meta.slvEffectWait )*user.battler().skillLevels[linkSkill.id];
				}
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					user.sequencesWait = Math.max(Number(stepSequence.stepParam)-slvEffect,0);
					user.sequence.splice(0,1);
				}
			}
			if(stepSequence.stepName=='waitAttack' && user.sequencesWait<=0 ){
				let slvEffect = 0;
				if(user.battler().skillLevels && skill.meta.slvEffectWaitAttack){
					slvEffect = Number( skill.meta.slvEffectWaitAttack )*user.battler().skillLevels[linkSkill.id];
				}
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					let attackSpeed = (1-user.battler().trg)
					user.sequencesWait = Math.max(Number(stepSequence.stepParam)*attackSpeed-slvEffect,0);
					user.sequence.splice(0,1);
				}
			}
			if(stepSequence.stepName=='waitSpell' && user.sequencesWait<=0){
				let slvEffect = 0;
				if(user.battler().skillLevels && skill.meta.slvEffectWaitSpell){
					slvEffect = Number( skill.meta.slvEffectWaitSpell )*user.battler().skillLevels[linkSkill.id];
				}
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.skillCast = 0;
					user.waitForCast = 1;
					user.sequence.splice(0,1);
				}else{
					if(user.battler().castSpeed){
						let spellSpeed = user.battler().castSpeed
						user.sequencesWait = Math.max(Number(stepSequence.stepParam)*spellSpeed-slvEffect,0);
					}else{
						user.sequencesWait = Number(stepSequence.stepParam)
					}
					user.skillCast = user.sequencesWait;
					user.waitForCast = user.sequencesWait;
					user.sequence.splice(0,1);
				}
			}
			// 跳
			if (stepSequence.stepName == 'jump' && user.sequencesWait<=0) {
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					user.jump(0,0,stepSequence.stepParam)
					user.sequence.splice(0,1);
				}
				
			}
			// 姿态
			if(stepSequence.stepName == 'pose' && user.sequencesWait<=0  ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					sxlSimpleABS.setPose(user,stepSequence.stepParam,stepSequence.stepParam2)
					user.sequence.splice(0,1);
				}
				
			}
			// 触发弹道
			if(stepSequence.stepName=='trigger' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					let slvEffect = 0;
					let slvEffectAngle = 0;
					if(skill && user.battler().skillLevels && skill.meta.slvEffecParticleAmount){
						slvEffect =  Math.floor ((Number( skill.meta.slvEffecParticleAmount )/1)*user.battler().skillLevels[skill.id]);
					}
					if(skill && user.battler().skillLevels && skill.meta.slvEffectAngleAdjust){
						slvEffectAngle =  Math.floor ( Number((skill.meta.slvEffectAngleAdjust) ));
					}
					if(stepSequence.stepParam2 == 'targetPosition'){
						if(user!=$gamePlayer){
							sxlSimpleABS.shootParticle(user, stepSequence.target, user.faction, stepSequence.stepParam,stepSequence.target.screenX(),stepSequence.target.screenY(),stepSequence.stepParam3);
						}else{
							sxlSimpleABS.shootParticle(user, stepSequence.target, user.faction, stepSequence.stepParam,TouchInput.x,TouchInput.y,stepSequence.stepParam3);
						}
						
					}else{
						sxlSimpleABS.shootParticle(user, stepSequence.target, user.faction, stepSequence.stepParam,null,null,stepSequence.stepParam3);
					}
					for( let i = 0 ; i < slvEffect ; i ++ ){
						let fixAngle = i%2==0? slvEffectAngle*i: -slvEffectAngle*i;
						if(stepSequence.stepParam2 == 'targetPosition'){
							if(user!=$gamePlayer){
								sxlSimpleABS.shootParticle(user, stepSequence.target, user.faction, stepSequence.stepParam,stepSequence.target.screenX(),stepSequence.target.screenY(),stepSequence.stepParam3,fixAngle);
							}else{
								sxlSimpleABS.shootParticle(user, stepSequence.target, user.faction, stepSequence.stepParam,TouchInput.x,TouchInput.y,stepSequence.stepParam3,fixAngle);
							}
							
						}else{
							sxlSimpleABS.shootParticle(user, stepSequence.target, user.faction, stepSequence.stepParam,null,null,stepSequence.stepParam3,fixAngle);
						}
					}
					user.sequence.splice(0,1);

				}
				
			}
			// 状态增加
			if(stepSequence.stepName=='addState' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					user.battler().addState(stepSequence.stepParam);
					user.sequence.splice(0,1);
				}
				
			}
			// 状态去除
			if(stepSequence.stepName=='removeState' && user.sequencesWait<=0 ){
				user.battler().removeState(stepSequence.stepParam);
				user.sequence.splice(0,1);
			}
			// 冲刺
			if(stepSequence.stepName=='rush' && user.sequencesWait<=0 ){
				if((user.isStuned() && !user.endure)||user != $gamePlayer){
					// 被控制时跳过
					user.rushCount = 0;
					user.sequence.splice(0,1);
				}else{
					let slvEffect = 0;
					if(user.battler().skillLevels && skill.meta.slvEffectRush){
						slvEffect = Number( skill.meta.slvEffectRush )*user.battler().skillLevels[linkSkill.id];
					}
					if(user.rushCount == 0){
						user.rushCount = stepSequence.stepParam+slvEffect;
					}
					if(!stepSequence.stepParam2){
						user.sequence.splice(0,1);
					}
					if(stepSequence.stepParam2 && Math.abs(user.rushCount) == 1){
						user.sequence.splice(0,1);
					}
				}
				
			}
			// 音效
			if(stepSequence.stepName=='se' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					AudioManager.playSe({name:stepSequence.stepParam,volume:stepSequence.stepParam2,pitch:stepSequence.stepParam3})
					user.sequence.splice(0,1);
				}
				
			}
			// 动画
			if(stepSequence.stepName=='animation' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					user.sequence.splice(0,1);
				}else{
					$gameTemp.requestAnimation([user], stepSequence.stepParam);
					user.sequence.splice(0,1);
				}
				// if(user.isStuned() && !user.endure){
				// 	// 被控制时跳过
				// 	if(user.anim){
				// 		user.anim.destroy();
				// 		sxlSimpleABS.spritesetMap._tilemap.removeChild(user.anim);
				// 		user.anim = null;
				// 	}
				// 	user.sequence.splice(0,1);
				// }else{
				// 	if(!user.anim){
				// 		user.anim = new Sprite_Animation();
						
				// 		user.anim.x = user.screenX()+256;
				// 		user.anim.y = user.screenY()+256;
				// 		sxlSimpleABS.spritesetMap._tilemap.addChild(user.anim);
				// 		user.anim.setup( [user.spriteIndex()],$dataAnimations[stepSequence.stepParam],false,sxlSimpleABS.spritesetMap.animationBaseDelay(), null );
				// 	}else{
				// 		user.anim = null;
				// 	}
				// 	if( !user.anim._playing){
				// 		user.anim.destroy();
				// 		sxlSimpleABS.spritesetMap._tilemap.removeChild(user.anim);
				// 		user.anim = null;
				// 		if(stepSequence.stepParam2){
				// 			// 等待
				// 			user.sequence.splice(0,1);
				// 		}
				// 	}
				// 	//不等待
				// 	if(!stepSequence.stepParam2){
				// 		user.sequence.splice(0,1);
				// 	}
				// }
			}
			//锁定
			if(stepSequence.stepName=='user locked' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					user.locked = true;
					user.sequence.splice(0,1);
				}
			}
			//解除锁定
			if(stepSequence.stepName=='user unlocked' && user.sequencesWait<=0 ){
				user.locked = false;
				user.sequence.splice(0,1);
			}
			//霸体
			if(stepSequence.stepName=='user endure on' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					user.endure = true;
					user.sequence.splice(0,1);
				}
			}
			//解除霸体
			if(stepSequence.stepName=='user endure off' && user.sequencesWait<=0 ){
				user.endure = false;
				user.sequence.splice(0,1);
			}
			//公共事件
			if(stepSequence.stepName=='commonEvent' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					$gameTemp.reserveCommonEvent(stepSequence.stepParam)
					user.sequence.splice(0,1);
				}
			}
			//方向锁定开
			if(stepSequence.stepName=='user directionFix on' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					user._directionFix = true;
					user.sequence.splice(0,1);
				}
			}
			//方向锁定关
			if(stepSequence.stepName=='user directionFix off' && user.sequencesWait<=0 ){
				user._directionFix = false;
				user.sequence.splice(0,1);
			}
			//召唤
			if(stepSequence.stepName=='summon' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					let skill = $dataSkills[stepSequence.skillId]
					if(skill.meta.levelVar){
						let skillLevel = user.battler().skillLevels[linkSkill.id];
						if(skill.meta.levelToHP){
							$gameActors.actor(Number(stepSequence.stepParam))._paramPlus[0] = skillLevel*Number(skill.meta.levelToHP)
						}
						if(skill.meta.levelToATK){
							$gameActors.actor(Number(stepSequence.stepParam))._paramPlus[2] = skillLevel*Number(skill.meta.levelToATK)
						}
						if(skill.meta.levelToDEF){
							$gameActors.actor(Number(stepSequence.stepParam))._paramPlus[3] = skillLevel*Number(skill.meta.levelToDEF)
						}
						if(skill.meta.levelToMAT){
							$gameActors.actor(Number(stepSequence.stepParam))._paramPlus[4] = skillLevel*Number(skill.meta.levelToMAT)
						}
						if(skill.meta.levelToMDF){
							$gameActors.actor(Number(stepSequence.stepParam))._paramPlus[5] = skillLevel*Number(skill.meta.levelToMDF)
						}
						if(skill.meta.levelToAGI){
							$gameActors.actor(Number(stepSequence.stepParam))._paramPlus[6] = skillLevel*Number(skill.meta.levelToAGI)
						}
						if(skill.meta.levelToLUK){
							$gameActors.actor(Number(stepSequence.stepParam))._paramPlus[7] = skillLevel*Number(skill.meta.levelToLUK)
						}
						if(skill.meta.levelToAliveTime){
							$gameActors.actor(Number(stepSequence.stepParam)).levelAliveTime = skillLevel*Number(skill.meta.levelToAliveTime)
						}
					}
					if(stepSequence.stepParam3){
						var animation = stepSequence.stepParam3;
					}else{
						var animation = 1;
					}
					// if($gameParty._actors.indexOf(Number(stepSequence.stepParam))<0){
					// 	$gameTemp.requestAnimation([$gameParty.members()[$gameParty.members().length]],animation)
					// }else{
					// 	$gameParty.removeActor(Number(stepSequence.stepParam));
					// }
					$gameParty.addActor(Number(stepSequence.stepParam));
					$gameActors.actor(Number(stepSequence.stepParam)).aliveTime = Number(stepSequence.stepParam2)+$gameActors.actor(Number(stepSequence.stepParam)).levelAliveTime;
					$gameActors.actor(Number(stepSequence.stepParam)).aliveTimeMax = Number(stepSequence.stepParam2)+$gameActors.actor(Number(stepSequence.stepParam)).levelAliveTime;
					$gameActors.actor(Number(stepSequence.stepParam))._hp = $gameActors.actor(Number(stepSequence.stepParam)).mhp;
					user.sequence.splice(0,1);
				}
				
			}
		}
	}
	
};

sxlSimpleABS.shootParticle = function(user,target,faction,skill,storeX,storeY,nextSkillId,angle){
	//创造弹道
	sxlSimpleABS.spritesetMap.createParticle(user,target,faction,skill,storeX,storeY,nextSkillId,angle);

};

sxlSimpleABS.setPose = function(user,pose,duration){
	//设定角色动作
	user.pose = pose;
	user.poseDuration = duration;
	user.isAttack = Number(duration);
};


