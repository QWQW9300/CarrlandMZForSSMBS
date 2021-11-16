Scene_Map.prototype.createGauges = function(user){
	var gaugeId = 0;
	for(character of sxlSimpleABS.battlerCharacters){
		let gauge = new Sprite( new Bitmap( 400,200 ) );
		character.gaugeId = gaugeId;
		this.addChild(gauge);
		sxlSimpleABS.battlerGauges.push(gauge);
		gauge.anchor.x = 0.5;
		gauge.anchor.y = 1;
		gauge.opacity = 192;
		gaugeId ++;
	}
};

Scene_Map.prototype.updateGauges = function(){
	for(character of sxlSimpleABS.battlerCharacters){
		if(character.battler()){
			let gauge = sxlSimpleABS.battlerGauges[character.gaugeId];
			if(character.battler()._hp<=0){
				gauge.opacity = 0;
			}else{
				gauge.opacity = 192;
			}
			gauge.bitmap.clear();
			gauge.x = character.screenX();
			gauge.y = character.screenY();
			gauge.bitmap.fillRect((gauge.bitmap.width-48)/2,gauge.bitmap.height-8-48,48,8,ColorManager.textColor(8));
			gauge.bitmap.fillRect((gauge.bitmap.width-48)/2,gauge.bitmap.height-8-48,48*character.battler()._hp/character.battler().mhp,8,ColorManager.textColor(24));
			if(character.battler()._result.hpDamage!=0){
				gauge.hpDamageStore = character.battler()._result.hpDamage;
				if(!gauge.hideDamage || gauge.hideDamage==0)gauge.hideDamage = 30;
			}
			
			if(gauge.hideDamage>0){
				gauge.hideDamage -= 1;
				gauge.bitmap.drawText(gauge.hpDamageStore,0,40,gauge.bitmap.width,gauge.bitmap.height,'center');
			}
			
		}
	}
};







Scene_Map.prototype.triggerSkillnoTarget = function(userChar,userMember,skill){
	if( !$gamePlayer.delaySkill.length>0 || 
		($gamePlayer.delaySkill[0] && $gamePlayer.delaySkill[0].id == skill.id)){
		// $gamePlayer.delaySkill = [];
		var xDist = TouchInput.x - $gamePlayer.screenX();
		var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
		var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
		userChar.rushCount = 0;
		for( i in userMember.states()){
			if(userMember.states()[i] && userMember.states()[i].meta.skillOnly){
				userMember.removeState(userMember.states()[i].id)
			}
		};
		if( skill.meta.attackStateNotarget ){
			userMember.addState( Number(skill.meta.attackStateNotarget) )
		};
		if( skill.meta.removeStateNotarget ){
			userMember.removeState( Number(skill.meta.removeStateNotarget) );
		};
		if(angle>45&&angle<135){
			$gamePlayer._direction=2;
		}else if(angle>-45&&angle<45){
			$gamePlayer._direction=6;
		}else if(angle>-135&&angle<-45){
			$gamePlayer._direction=8;
		}else{
			$gamePlayer._direction=4;
		}
		
		if( skill.meta.attackStateNotarget ){
			userMember.addState( Number(skill.meta.attackStateNotarget) )
		};
		if( skill.meta.removeStateNotarget ){
			userMember.removeState( Number(skill.meta.removeStateNotarget) );
		};
		var usersArray = [];
		var aimAnim = ( skill.meta.aimAnim?
						Number(skill.meta.aimAnim) : 0 );
		var skillRange = (	skill.meta.range?
						Number(skill.meta.range) : 1 );
		var castAnim = ( skill.meta.castAnim?
						 Number(skill.meta.castAnim) : 0 );
		var skillCast = skill.meta.cast?
						Number(skill.meta.cast):0;
		if(userChar._waitTime == 0) {
			if(skill.meta.skillSound){
				var allParam = skill.meta.skillSound.split(',')
				var _name = String(allParam[0]);
				var _volume = Number(allParam[1])||90;
				var _pitch = Number(allParam[2])||100;
				AudioManager.playSe({name:_name,volume:_volume,pitch:_pitch})
			}
			usersArray.push( userChar );
			if( aimAnim != 0 ){
				var sacle = $dataAnimations[ aimAnim ].scale;
				$dataAnimations[ aimAnim ].scale = skillRange * 100 ;	
			};
			$gameTemp.requestAnimation( usersArray , castAnim , false );
			if( aimAnim != 0 ){
				$dataAnimations[ aimAnim ].scale = sacle;
			};
			usersArray = [];
			
			userChar.isAttack = skill.meta.poseTime?Numebr(skill.meta.poseTime):sxlSimpleABS.weaponSwingTime;;
			userChar.waitForMotion = userChar.isAttack;
			if(skill.meta.canMove){
				userChar.waitForMotion = 0;
			}
			this.skillPose(skill,userChar);
		};
		if(skillCast>0 && userChar._waitTime == 0 ){
			userChar.skillCast = skillCast;
			userChar.userMember = userMember;
			userChar.castSkill = skill;
			userChar.waitForCast = userMember.castSpeed*skillCast;
			userChar._waitTime = userChar.waitForCast;
		}else{
			userChar.userMember = null;
			userChar.target = null;
			userChar.targetMember = null;
			userChar.castSkill = null;
			userChar.waitForCast = null;
			if(skill.meta.moveRush) this.rush(userChar,null,Number(skill.meta.moveRush));
			if(skill.meta.jump) userChar.jump(0,0,1)
			// sxlSimpleABS.weaponSpritesUser.push(userChar);
			if(skill.meta.img){
				sxlSimpleABS.spritesetMap.createParticle(userMember.player , null, 'player', skill);
			}
			sxlSimpleABS.castAnimation = [];
			if(skill.meta.nextSkill){
				var nextSkill = $dataSkills[Number(skill.meta.nextSkill)]
				if(nextSkill.meta.noTarget){
					this.triggerSkillnoTarget(userChar,userMember,nextSkill)
				}else{
					this.triggerSkill(userChar,userMember,$gameMap.events()[i],$gameMap.events()[i]._battler,nextSkill)
				}
			}
			if( skill.meta.delaySkill ){
				if(!userChar.delaySkill) userChar.delaySkill=[];
				var delaySkill = $dataSkills[Number(skill.meta.delaySkill)]
				userChar.delaySkill.push(delaySkill);
			}
			if(skill.meta.commonEvent){
				$gameTemp.reserveCommonEvent(Number(skill.meta.commonEvent));
			}
			if(skill.meta.summon){
				
				$gameActors.actor(Number(skill.meta.summon))._hp = $gameActors.actor(Number(skill.meta.summon)).mhp;
				var inParty = false;
				for( j in $gameParty.members()){
					if($gameParty.members()[j]._actorId == Number(skill.meta.summon)){
						inParty = true;
					}
				}
				if(inParty == false){
					$gameParty.addActor(Number(skill.meta.summon));
					$gameActors.actor(Number(skill.meta.summon)).recoverAll();
					$gameActors.actor(Number(skill.meta.summon))._hp = $gameActors.actor(Number(skill.meta.summon)).mhp;
					$gameActors.actor(Number(skill.meta.summon)).aliveTime = skill.meta.summonTime?Number(skill.meta.summonTime):600;
					$gameActors.actor(Number(skill.meta.summon)).aliveTimeMax = skill.meta.summonTime?Number(skill.meta.summonTime):600;
					for( i in $gamePlayer._followers._data){
						if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
							$gamePlayer._followers._data[i]._x = (Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX))
							$gamePlayer._followers._data[i]._y = (Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))
						}
					}
					// weaponSprite.scene.clearAllWeapons();
					// weaponSprite.scene.setPlayerMember();
					// weaponSprite.scene.setEnemyMember();
					// weaponSprite.scene.showWeaponSprite();
				}
				for( i in $gamePlayer._followers._data){
					if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
						var xDistJump = (Math.floor(TouchInput.x/48)+$gameMap._displayX) - ($gamePlayer._followers._data[i]._x)
						var yDistJump = (Math.floor(TouchInput.y/48)+$gameMap._displayY) - ($gamePlayer._followers._data[i]._y)
						if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))) $gamePlayer._followers._data[i].jump(xDistJump,yDistJump);
						
					}
				}
				if( skill.meta.teleport ){
					if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))){
						$gamePlayer.reserveTransfer($gameMap._mapId, Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY),$gamePlayer._direction,false);
					}
				}

			}
		}
	}
};

Scene_Map.prototype.triggerSkill = function(userChar,userMember,target,targetMember,skill){
	if(!$gamePlayer.delaySkill.length>0 || ($gamePlayer.delaySkill[0] && $gamePlayer.delaySkill[0].id == skill.id)){
		// $gamePlayer.delaySkill = [];
		var xDist = TouchInput.x - $gamePlayer.screenX();
		var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
		var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
		userChar.rushCount = 0;
		
		if(angle>45&&angle<135){
			$gamePlayer._direction=2;
		}else if(angle>-45&&angle<45){
			$gamePlayer._direction=6;
		}else if(angle>-135&&angle<-45){
			$gamePlayer._direction=8;
		}else{
			$gamePlayer._direction=4;
		}
		
		if( skill.meta.attackStateNotarget ){
			$gameParty.members()[0].addState( Number(skill.meta.attackStateNotarget) )
		};
		if( skill.meta.removeStateNotarget ){
			$gameParty.members()[0].removeState( Number(skill.meta.removeStateNotarget) );
		};
		var usersArray = [];
		var targetArray = [];
		var aimAnim = ( skill.meta.aimAnim?
						Number(skill.meta.aimAnim) : 0 );
		var skillRange = (	skill.meta.range?
						Number(skill.meta.range) : 1 );
		var castAnim = ( skill.meta.castAnim?
						 Number(skill.meta.castAnim) : 0 );
		var skillCast = skill.meta.cast?
						Number(skill.meta.cast):0;
		if(userChar._waitTime == 0) {
			if(skill.meta.skillSound){
				var allParam = skill.meta.skillSound.split(',')
				var _name = String(allParam[0]);
				var _volume = Number(allParam[1])||90;
				var _pitch = Number(allParam[2])||100;
				AudioManager.playSe({name:_name,volume:_volume,pitch:_pitch})
			}
			targetArray.push( target )
			usersArray.push( userChar );
			if( aimAnim != 0 ){
				var sacle = $dataAnimations[ aimAnim ].scale;
				$dataAnimations[ aimAnim ].scale = skillRange * 100 ;	
			};
			$gameTemp.requestAnimation( usersArray , castAnim , false );
			$gameTemp.requestAnimation( targetArray , aimAnim , false );
			if( aimAnim != 0 ){
				$dataAnimations[ aimAnim ].scale = sacle;
			};
			usersArray = [];
			userChar.isAttack = skill.meta.poseTime?Numebr(skill.meta.poseTime):sxlSimpleABS.weaponSwingTime;
			userChar.waitForMotion = userChar.isAttack;
			if(skill.meta.canMove){
				userChar.waitForMotion = 0;
			}
			this.skillPose(skill,userChar);
		};
		if(skillCast>0 && userChar._waitTime == 0 ){
			userChar.skillCast = skillCast;
			userChar.userMember = userMember;
			userChar.target = target;
			userChar.targetMember = targetMember;
			userChar.castSkill = skill;
			userChar.waitForCast = userMember.castSpeed*skillCast;
			userChar._waitTime = userChar.waitForCast;
		}else{
			userChar.userMember = null;
			userChar.target = null;
			userChar.targetMember = null;
			userChar.castSkill = null;
			userChar.waitForCast = null;
			if( userChar._waitTime <= 1 && userChar.isAttack >= 0 ){
				if(skill.meta.moveRush) this.rush( $gameParty.members()[0], target, Number(skill.meta.moveRush) )
				if(skill.meta.moveBack) this.moveBack( $gameParty.members()[0], target, Number(skill.meta.moveBack) )
				if(skill.meta.jump) userChar.jump(0,0,1)
				userChar.turnTowardCharacter(target);
				// sxlSimpleABS.weaponSpritesUser.push(userChar);
				if(skill.meta.img){
					sxlSimpleABS.spritesetMap.createParticle(userMember.player , target, 'player', skill);
				}else{
					this.playersAttack(target, userMember, 0, skill);
				};
				sxlSimpleABS.castAnimation = [];
				if(skill.meta.nextSkill){
					var nextSkill = $dataSkills[Number(skill.meta.nextSkill)]
					if(nextSkill.meta.noTarget){
						this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],nextSkill)
					}else{
						this.triggerSkill($gamePlayer,$gameParty.members()[0],$gameMap.events()[i],$gameMap.events()[i]._battler,nextSkill)
					}
				}
				if( skill.meta.delaySkill ){
					if(!userChar.delaySkill) userChar.delaySkill=[];
					var delaySkill = $dataSkills[Number(skill.meta.delaySkill)]
					userChar.delaySkill.push(delaySkill);
				}
				if(skill.meta.commonEvent){
					$gameTemp.reserveCommonEvent(Number(skill.meta.commonEvent));
					
				}
				if(skill.meta.summon){
					var inParty = false;
					for( j in $gameParty.members()){
						if($gameParty.members()[j]._actorId == Number(skill.meta.summon)){
							inParty = true;
						}
					}
					if(inParty == false){
						$gameParty.addActor(Number(skill.meta.summon));
						$gameActors.actor(Number(skill.meta.summon)).recoverAll();
						$gameActors.actor(Number(skill.meta.summon)).aliveTime = skill.meta.summonTime?Number(skill.meta.summonTime):600;
						$gameActors.actor(Number(skill.meta.summon)).aliveTimeMax = skill.meta.summonTime?Number(skill.meta.summonTime):600;
						for( i in $gamePlayer._followers._data){
							if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
								$gamePlayer._followers._data[i]._x = (Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX))
								$gamePlayer._followers._data[i]._y = (Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))
							}
						}
					}
					for( i in $gamePlayer._followers._data){
						if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
							for( i in $gamePlayer._followers._data){
								if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
									var xDistJump = (Math.floor(TouchInput.x/48)+$gameMap._displayX) - ($gamePlayer._followers._data[i]._x)
									var yDistJump = (Math.floor(TouchInput.y/48)+$gameMap._displayY) - ($gamePlayer._followers._data[i]._y)
									$gamePlayer._followers._data[i].jump(xDistJump,yDistJump);
								}if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))) $gamePlayer._followers._data[i].jump(xDistJump,yDistJump); 
							}
						}
					}
					
					
				}
				for( i in userMember.states()){
					if(userMember.states()[i].meta.skillOnly){
						userMember.removeState(userMember.states()[i].id)
					}
				}
				if( skill.meta.teleport ){
					if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))){
						$gamePlayer.reserveTransfer($gameMap._mapId, Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY),$gamePlayer._direction,false);
					}
				}
			}
		}
	}
};
Scene_Map.prototype.triggerSkillInstantNotarget = function(userChar,userMember,skill){
	if(!$gamePlayer.delaySkill.length>0 || ($gamePlayer.delaySkill[0] && $gamePlayer.delaySkill[0].id == skill.id)){
		// $gamePlayer.delaySkill = [];
		var xDist = TouchInput.x - $gamePlayer.screenX();
		var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
		var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
		userChar.rushCount = 0;
		if(angle>45&&angle<135){
			$gamePlayer._direction=2;
		}else if(angle>-45&&angle<45){
			$gamePlayer._direction=6;
		}else if(angle>-135&&angle<-45){
			$gamePlayer._direction=8;
		}else{
			$gamePlayer._direction=4;
		}
		var usersArray = [];
		var aimAnim = ( skill.meta.aimAnim?
						Number(skill.meta.aimAnim) : 0 );
		var skillRange = (	skill.meta.range?
						Number(skill.meta.range) : 1 );
		var castAnim = ( skill.meta.castAnim?
						 Number(skill.meta.castAnim) : 0 );
		var skillCast = skill.meta.cast?
						Number(skill.meta.cast):0;
		userChar.userMember = null;
		userChar.targetMember = null;
		userChar.castSkill = null;
		userChar.waitForCast = null;
		if(userChar._waitTime == 0) {
			if(skill.meta.skillSound){
				var allParam = skill.meta.skillSound.split(',')
				var _name = String(allParam[0]);
				var _volume = Number(allParam[1])||90;
				var _pitch = Number(allParam[2])||100;
				AudioManager.playSe({name:_name,volume:_volume,pitch:_pitch})
			}
			usersArray.push( userChar );
			if( aimAnim != 0 ){
				var sacle = $dataAnimations[ aimAnim ].scale;
				$dataAnimations[ aimAnim ].scale = skillRange * 100 ;	
			};
			if( aimAnim != 0 ){
				$dataAnimations[ aimAnim ].scale = sacle;
			};
			usersArray = [];
			userChar.isAttack = skill.meta.poseTime?Numebr(skill.meta.poseTime):sxlSimpleABS.weaponSwingTime;
			userChar.waitForMotion = userChar.isAttack;
			if(skill.meta.canMove){
				userChar.waitForMotion = 0;
			}
			this.skillPose(skill,userChar);
		};
		if( userChar._waitTime <= 1 && userChar.isAttack >= 0){
			if(skill.meta.moveRush) this.rush(userChar,null,Number(skill.meta.moveRush));
			if(skill.meta.moveBack) userChar.moveBackward()
			if(skill.meta.jump) userChar.jump(0,0,1)
			// sxlSimpleABS.weaponSpritesUser.push(userChar);
			if(skill.meta.img){
				sxlSimpleABS.spritesetMap.createParticle(userMember.player , null , 'player', skill);
			}
			if(skill.meta.nextSkill){
				var nextSkill = $dataSkills[Number(skill.meta.nextSkill)]
				if(nextSkill.meta.noTarget){
					this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],nextSkill)
				}else{
					this.triggerSkill($gamePlayer,$gameParty.members()[0],$gameMap.events()[i],$gameMap.events()[i]._battler,nextSkill)
				}
			}
			if( skill.meta.delaySkill ){
				if(!userChar.delaySkill) userChar.delaySkill=[];
				var delaySkill = $dataSkills[Number(skill.meta.delaySkill)]
				userChar.delaySkill.push(delaySkill);
			}
			if(skill.meta.summon){
				var inParty = false;
				for( j in $gameParty.members()){
					if($gameParty.members()[j]._actorId == Number(skill.meta.summon)){
						inParty = true;
					}
				}
				if(inParty == false){
					$gameParty.addActor(Number(skill.meta.summon));
					$gameActors.actor(Number(skill.meta.summon)).recoverAll();
					$gameActors.actor(Number(skill.meta.summon)).aliveTime = skill.meta.summonTime?Number(skill.meta.summonTime):600;
					$gameActors.actor(Number(skill.meta.summon)).aliveTimeMax = skill.meta.summonTime?Number(skill.meta.summonTime):600;
					for( i in $gamePlayer._followers._data){
						if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
							$gamePlayer._followers._data[i]._x = (Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX))
							$gamePlayer._followers._data[i]._y = (Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))
						}
					}
					// weaponSprite.scene.clearAllWeapons();
					// weaponSprite.scene.setPlayerMember();
					// weaponSprite.scene.setEnemyMember();
					// weaponSprite.scene.showWeaponSprite();
				}
				for( i in $gamePlayer._followers._data){
					if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
						for( i in $gamePlayer._followers._data){
							if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
								var xDistJump = (Math.floor(TouchInput.x/48)+$gameMap._displayX) - ($gamePlayer._followers._data[i]._x)
								var yDistJump = (Math.floor(TouchInput.y/48)+$gameMap._displayY) - ($gamePlayer._followers._data[i]._y)
								if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))) $gamePlayer._followers._data[i].jump(xDistJump,yDistJump);
							}
						}
					}
				}
				
				
			}
			if(skill.meta.commonEvent){
				$gameTemp.reserveCommonEvent(Number(skill.meta.commonEvent));
			}
			if( skill.meta.teleport ){
					if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))){
						$gamePlayer.reserveTransfer($gameMap._mapId, Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY),$gamePlayer._direction,false);
					}
				}
			sxlSimpleABS.castAnimation = [];
		};
	}
};

Scene_Map.prototype.triggerSkillInstant = function(userChar,userMember,target,targetMember,skill){
	if(!$gamePlayer.delaySkill.length>0||($gamePlayer.delaySkill[0] && $gamePlayer.delaySkill[0].id == skill.id)){
		// $gamePlayer.delaySkill = [];
		var xDist = TouchInput.x - $gamePlayer.screenX();
		var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
		var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
		userChar.rushCount = 0;
		if(angle>45&&angle<135){
			$gamePlayer._direction=2;
		}else if(angle>-45&&angle<45){
			$gamePlayer._direction=6;
		}else if(angle>-135&&angle<-45){
			$gamePlayer._direction=8;
		}else{
			$gamePlayer._direction=4;
		}
		var usersArray = [];
		var targetArray = [];
		var aimAnim = ( skill.meta.aimAnim?
						Number(skill.meta.aimAnim) : 0 );
		var skillRange = (	skill.meta.range?
						Number(skill.meta.range) : 1 );
		var castAnim = ( skill.meta.castAnim?
						 Number(skill.meta.castAnim) : 0 );
		var skillCast = skill.meta.cast?
						Number(skill.meta.cast):0;
		userChar.userMember = null;
		userChar.target = null;
		userChar.targetMember = null;
		userChar.castSkill = null;
		userChar.waitForCast = null;
		if(userChar._waitTime == 0) {
			targetArray.push( target )
			usersArray.push( userChar );
			if( aimAnim != 0 ){
				var sacle = $dataAnimations[ aimAnim ].scale;
				$dataAnimations[ aimAnim ].scale = skillRange * 100 ;	
			};
			if( aimAnim != 0 ){
				$dataAnimations[ aimAnim ].scale = sacle;
			};
			usersArray = [];
			userChar.isAttack = skill.meta.poseTime?Numebr(skill.meta.poseTime):sxlSimpleABS.weaponSwingTime;
			userChar.waitForMotion = userChar.isAttack;
			if(skill.meta.canMove){
				userChar.waitForMotion = 0;
			}
		};
		if( userChar._waitTime <= 1 && userChar.isAttack >= 0 ){
			if(skill.meta.moveRush) this.rush( userChar, target, Number(skill.meta.moveRush) )
			if(skill.meta.moveBack) this.moveBack( userChar, target, Number(skill.meta.moveBack) )
			if(skill.meta.jump) userChar.jump(0,0,1)
			if(target){
				userChar.turnTowardCharacter(target);
			}
			this.skillPose(skill,userChar);
			// sxlSimpleABS.weaponSpritesUser.push(userChar);
			if(skill.meta.img){
				sxlSimpleABS.spritesetMap.createParticle(userMember.player , target, 'player', skill);
			}else{
				this.playersAttack(target, userMember, 0, skill);
			};
			if(skill.meta.nextSkill){
				var nextSkill = $dataSkills[Number(skill.meta.nextSkill)]
				if(nextSkill.meta.noTarget){
					this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],nextSkill)
				}else{
					this.triggerSkill($gamePlayer,$gameParty.members()[0],$gameMap.events()[i],$gameMap.events()[i]._battler,nextSkill)
				}
			}
			if(skill.meta.summon){
				var inParty = false;
				for( j in $gameParty.members()){
					if($gameParty.members()[j]._actorId == Number(skill.meta.summon)){
						inParty = true;
					}
				}
				if(inParty == false){
					$gameParty.addActor(Number(skill.meta.summon));
					$gameActors.actor(Number(skill.meta.summon)).recoverAll();
					$gameActors.actor(Number(skill.meta.summon)).aliveTime = skill.meta.summonTime?Number(skill.meta.summonTime):600;
					$gameActors.actor(Number(skill.meta.summon)).aliveTimeMax = skill.meta.summonTime?Number(skill.meta.summonTime):600;
					for( i in $gamePlayer._followers._data){
						if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
							$gamePlayer._followers._data[i]._x = (Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX))
							$gamePlayer._followers._data[i]._y = (Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))
						}
					}
					// weaponSprite.scene.clearAllWeapons();
					// weaponSprite.scene.setPlayerMember();
					// weaponSprite.scene.setEnemyMember();
					// weaponSprite.scene.showWeaponSprite();
				}
				for( i in $gamePlayer._followers._data){
					if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
						for( i in $gamePlayer._followers._data){
							if($gameParty.members()[$gamePlayer._followers._data[i]._memberIndex] && $gameParty.members()[$gamePlayer._followers._data[i]._memberIndex]._actorId == skill.meta.summon){
								var xDistJump = (Math.floor(TouchInput.x/48)+$gameMap._displayX) - ($gamePlayer._followers._data[i]._x)
								var yDistJump = (Math.floor(TouchInput.y/48)+$gameMap._displayY) - ($gamePlayer._followers._data[i]._y)
								if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))) $gamePlayer._followers._data[i].jump(xDistJump,yDistJump);
							}
						}
					}
				}
				
				
			}
			if( skill.meta.delaySkill ){
				if(!userChar.delaySkill) userChar.delaySkill=[];
				var delaySkill = $dataSkills[Number(skill.meta.delaySkill)]
				userChar.delaySkill.push(delaySkill);
			}
			if(skill.meta.commonEvent){
				$gameTemp.reserveCommonEvent(Number(skill.meta.commonEvent));
			}
			if( skill.meta.teleport ){
				if($gameMap.isPassable( Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY))){
					$gamePlayer.reserveTransfer($gameMap._mapId, Math.floor(TouchInput.x/48)+Math.floor($gameMap._displayX), Math.floor(TouchInput.y/48)+Math.floor($gameMap._displayY),$gamePlayer._direction,false);
				}
			}
			sxlSimpleABS.castAnimation = [];
		}
	}
};


					if( userChar._waitTime == 0 ){
						userChar._waitTime = skillCast ; 
						userChar.isAttack = sxlSimpleABS.weaponSwingTime;
						userChar.waitForMotion = userChar.isAttack;
						if(skill.meta.canMove){
							userChar.waitForMotion = 0;
						}
						this.skillPose(skill,userChar);
					}
					if( userChar._waitTime <= 1 ){
						
						if(skill.meta.moveRush) this.rush( user, playerTeam, Number(skill.meta.moveRush) )
						if(skill.meta.moveBack) this.moveBack( user, playerTeam, Number(skill.meta.moveBack) )
						if(skill.meta.jump) userChar.jump(0,0,1)
						$gameMap.events()[i].turnTowardCharacter(playerTeam);
						sxlSimpleABS.enemySubject = $gameMap.events()[i]._battler;

						if(skill.meta.img){

							sxlSimpleABS.spritesetMap.createParticle($gameMap.events()[i], playerTeam, 'enemy', skill);
						}else{
							this.enemiesAttack(playerTeam, $gameMap.events()[i],skill);
						}
						$gameMap.events()[i]._battler._tp -= 100;
					};