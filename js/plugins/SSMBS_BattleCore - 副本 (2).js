
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简易的地图战斗系统
 * @author 神仙狼
 *
 * @help SSMBS_BattleCore.js
 *
 * 本系列所有插件不可二次发布。
 *
 *反击率(cnt)     攻击距离
 *敏捷(agi)       技能前摇/移动速度
 *魔法反射率(mrf) 跳跃高度
 *防御效果(gdr)   击退抗性
 *
 *人物备注：
 *<portrait:Actor1_3> 人物肖像
 *<deathImg: >    死亡行走图名称
 *<deathIndex: >  死亡行走图顺序
 *<followRange: > 队友跟随距离
 *
 *武器备注:   
 *<scale:Number>  武器图片缩放
 *
 *技能备注：  
 *<cooldown:Number>         冷却时间
 *<cast:Number>             吟唱时间
 *<castAnim:Number>         吟唱动画
 *<aimAnim:Number>          瞄准动画
 *<img:String>              弹道图像（system文件夹）
 *<rotate:Number>           弹道旋转
 *<through:Number>          是否穿透
 *<distance:Number>         技能距离
 *<range:Number>            技能范围
 *<moveRush:Number>         释放技能时冲刺距离
 *<moveBack:Number>         释放技能时后撤距离
 *<jump:Number>             释放技能时跳跃动作
 *<hitBack:Number>          击退距离
 *<hitHook:Number>          后拉距离
 *<addState:Number>         作为特殊技能时附加的状态
 *<readyAnim:Number>        作为特殊技能就绪时的动画
 *<removeState:Number>      技能生效时清除使用者的状态
 *<attackState:Number>      技能生效时使用者附加的状态
 *<attackState:Number(<1)   技能生效时使用者附加状态的概率
 *<aura:Number>             光环状态Id
 *<auraRange:Number>        光环半径
 *<auraImg:String>          光环图案
 *<collode>                 弹道撞墙后消失
 *<destroyFade>             弹道毁灭时透明度降低
 *<moveFade>                弹道移动时透明度降低
 *<stayTime:Number>         弹道持续时间
 *<noTarget>                弹道技能无需目标即可释放
 *<needLevel:Number>        学习技能需要等级
 *<needSkill:Number>        学习技能需要前置技能
 *<levelVar:Number>         技能等级的储存变量ID
 *<maxLevel:Number>         技能最大等级
 *<interval:Numebr>         伤害触发间隔
 *<oneTime>                 弹道技能仅生效一次
 *<destroyAnim:String>      技能消失时播放的动画，储存在System文件夹中
 *                          动画每一帧为192*192，每一横行5帧，纵行不受限制
 *                          技能消失时会以每帧1幅的速度播放这个动画
 *<destroyAnimScale:Number> 技能消失动画的缩放
 *<destroyAnimBlendMode:0/1/2>技能消失动画的合成方式，0为普通，1为加法，2为减法。
 *<moveFrame:Number>        技能移动时的动画帧尺寸
 *
 *状态备注：
 *<hideOnCharacter>         角色头顶不会显示这个状态
* <skillOnly>               技能交替时自动清空这个状态
* <textColor:Number>        字体颜色，包括头顶和状态详情
 *
 *脚本：
 *sxlSimpleABS.showDamageInformation = true;  开启伤害信息
 *sxlSimpleABS.showDamageInformation = false; 关闭伤害信息
 *考虑到比较高频率的伤害技能，建议关闭伤害提示信息
 *
 *
 * @param 伤害数字类型
 * @type number
 * @desc 伤害数字类型，0为飞溅，1为稳定
 * @default 1
 *
 * @param 伤害最大显示数量
 * @type number
 * @desc 伤害最大显示数量，超出这个数量则会删除最先的伤害数字，数字越小效率越高
 * @default 50
 * 
 * @param 飞溅的伤害数字
 * @type number
 * @desc 0为关闭,0以上数字为飞溅的程度
 * @default 4
 *
 * @param 是否显示偷取生命
 * @type number
 * @desc 是否显示偷取生命，0为关闭，1为打开。关闭可以节省更多资源。
 * @default 1
 *
 * @param 偷取生命文字
 * @type string
 * @desc 偷取生命文字
 * @default 偷取生命
 *
 * @param 偷取魔法文字
 * @type string
 * @desc 偷取魔法文字
 * @default 偷取魔法
 * 
 * 
 * @param 暴击触发公共事件ID
 * @type number
 * @desc 暴击触发公共事件ID
 * @default 3
 * 
 * @param 敏捷吟唱阈值
 * @type number
 * @desc 敏捷对于吟唱速度的影响阈值，角色敏捷小于这个值则会有吟唱时间惩罚
 * @default 100
 *
 * @param 弹道速度阈值
 * @type number
 * @desc 弹道速度的阈值
 * @default 48
 *
 * @param 武器挥舞时长
 * @type number
 * @desc 挥动武器时，最长持续多久。
 * @default 30
 *
 * @param 默认击飞类型
 * @type number
 * @desc 4为四方向,8为八方向。根据敌人和弹道之间的距离计算击退方向，4方向会根据目标朝向进行击退。而8方向仅会根据方位击退，八方向判定时敌人会面朝弹道方向。
 * @default 4
 *
 * @param 头顶血条和即时信息透明度的变量ID
 * @type number
 * @desc 用来控制角色头顶血条和即时信息透明度的变量ID 
 * @default 20
 *
 * @param 敌人头顶血条的显示范围
 * @type number
 * @desc 敌人头顶血条的显示范围
 * @default 4
 * 
 * @param 角色头顶血条的宽度
 * @type number
 * @desc 角色头顶血条的宽度
 * @default 48
 *
 * @param 角色头顶血条的高度
 * @type number
 * @desc 角色头顶血条的高度
 * @default 4
 *
 * @param 角色头顶蓝条的高度
 * @type number
 * @desc 角色头顶蓝条的高度
 * @default 3
 *
 * @param 角色头顶血条的Y轴偏移
 * @type number
 * @desc 角色头顶血条的Y轴偏移
 * @default 12
 *
 * @param 禁止耐力恢复状态ID
 * @type number
 * @desc 禁止耐力恢复状态ID
 * @default 29
 *
 *
 *
 */

document.body.style.cursor = "url(img/system/cursor.png) 0 0,pointer";

var sxlSimpleABS = sxlSimpleABS || {};
sxlSimpleABS.var = 1.00;

sxlSimpleABS.parameters = PluginManager.parameters('SSMBS_BattleCore')

sxlSimpleABS.defaultSPCD = 600;

sxlSimpleABS.damages = new Array();
sxlSimpleABS.damagesTarget = new Array();
sxlSimpleABS.gauges = new Array();
sxlSimpleABS.castAnimation = new Array();
sxlSimpleABS.particle = new Array();
sxlSimpleABS.targets = new Array();
sxlSimpleABS.users = new Array();
sxlSimpleABS.particleEnemy = new Array();
sxlSimpleABS.targetsEnemy = new Array();
sxlSimpleABS.usersEnemy = new Array();
sxlSimpleABS.followerGauges = new Array();
sxlSimpleABS.weaponSprites = new Array();
sxlSimpleABS.information = new Array();
sxlSimpleABS.informationLines = new Array();
sxlSimpleABS.informationColor = [];
sxlSimpleABS.informPage = 0;
sxlSimpleABS.floatItemsInform = [];

// 插件参数设定
sxlSimpleABS.castBasicAGI = Number(sxlSimpleABS.parameters['敏捷吟唱阈值'] || 100);
sxlSimpleABS.opacityVarID = Number(sxlSimpleABS.parameters['头顶血条和即时信息透明度的变量ID'] || 20);
sxlSimpleABS.hideRange = Number(sxlSimpleABS.parameters['敌人头顶血条的显示范围'] || 4);
sxlSimpleABS.gaugeWidth = Number(sxlSimpleABS.parameters['角色头顶血条的宽度'] || 48);
sxlSimpleABS.gaugeHeight = Number(sxlSimpleABS.parameters['角色头顶血条的高度'] || 4);
sxlSimpleABS.offsetY = Number(sxlSimpleABS.parameters['角色头顶血条的Y轴偏移'] || 12);
sxlSimpleABS.gaugeHeightMP = Number(sxlSimpleABS.parameters['角色头顶蓝条的高度'] || 3);
sxlSimpleABS.criCommonEventID = Number(sxlSimpleABS.parameters['暴击触发公共事件ID'] || 3);
sxlSimpleABS.flyDamageWord = Number(sxlSimpleABS.parameters['飞溅的伤害数字'] || 4);
sxlSimpleABS.weaponSwingTime = Number(sxlSimpleABS.parameters['武器挥舞时长'] || 30);
sxlSimpleABS.knockBackType = Number(sxlSimpleABS.parameters['默认击飞类型'] || 4);
sxlSimpleABS.skillSpeedBase = Number(sxlSimpleABS.parameters['弹道速度阈值'] || 48);
sxlSimpleABS.damageWordType = Number(sxlSimpleABS.parameters['伤害数字类型'] || 1);
sxlSimpleABS.noEnergyRecoverStateId = Number(sxlSimpleABS.parameters['禁止耐力恢复状态ID'] || 29);
sxlSimpleABS.showStealWord = Number(sxlSimpleABS.parameters['是否显示偷取生命'] || 1);
sxlSimpleABS.stealWordHP = String(sxlSimpleABS.parameters['偷取生命文字'] || '偷取生命');
sxlSimpleABS.stealWordMP = String(sxlSimpleABS.parameters['偷取魔法文字'] || '偷取魔法');
sxlSimpleABS.maxDamageAmount = Number(sxlSimpleABS.parameters['伤害最大显示数量'] || 50);
sxlSimpleABS.padding = 1;
sxlSimpleABS.labelEtypeID = 7;
sxlSimpleABS.showDamageInformation = false; // 是否开启伤害信息
sxlSimpleABS.moveAttackMode = true;         // 是否开启走射模式，这个模式下鼠标无法控制移动，并且启用WASD移动模式
sxlSimpleABS.attackMoveable = false;         // 走射模式下可否一边移动一边攻击
sxlSimpleABS._2direction = false;            // 是否开启双方向模式（仅有左右方向），必须配合走射模式使用
sxlSimpleABS.wasdMode = true;

const _sxlAbs_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_sxlAbs_mapLoad.call(this);
	sxlSimpleABS.damages = [];
	sxlSimpleABS.gauges = [];
	sxlSimpleABS.particle =[];
	sxlSimpleABS.targets = [];
	sxlSimpleABS.users = [];
	sxlSimpleABS.particleEnemy =[];
	sxlSimpleABS.targetsEnemy = [];
	sxlSimpleABS.usersEnemy = [];
	sxlSimpleABS.followerGauges = [];
	sxlSimpleABS.weaponSprites = [];
	// sxlSimpleABS.weaponSpritesUser = [];
	sxlSimpleABS.damagesTarget =[];
	sxlSimpleABS.sequenceUser = [];
	this.line = 0;
	
	sxlSimpleABS.destination = null;
};

const _sxlAbs_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
	_sxlAbs_start.call(this);
	sxlSimpleABS.smp = this;
	this.loadEnemies();
	this.loadFollowers();
	this.showLeaderGauge($gamePlayer);
	this.showInformation();
	this.reLoadEnemies();
	this.loadCanMoveTime();
	this.loadMembersPlayers();
	this.clearFollower();
	sxlSimpleABS.sceneMap = this;
	if(sxlSimpleABS.sequenceUser.indexOf($gamePlayer)<0){
		sxlSimpleABS.sequenceUser.push($gamePlayer);
	}
	if(!$gamePlayer._waitTime){
		$gamePlayer._waitTime = 0;
	};
	if(!$gamePlayer._isAttacking){
		$gamePlayer._isAttacking = 0;
	};
	if(!$gamePlayer.sequencesWait){
		$gamePlayer.sequencesWait = 0;
	}
	if(!$gamePlayer.sequence){
		$gamePlayer.sequence = [];
	}
	$gamePlayer.locked = false;
	for(i = 0 ; i < $gamePlayer._followers._data.length ; i++){
		$gamePlayer._followers._data.locked = false;
		if(sxlSimpleABS.sequenceUser.indexOf($gamePlayer._followers._data[i])<0){
			sxlSimpleABS.sequenceUser.push($gamePlayer._followers._data[i]);
		}
		if(!$gamePlayer._followers._data[i]._waitTime){
			$gamePlayer._followers._data[i]._waitTime = 0;
		};
		if(!$gamePlayer._followers._data[i]._isAttacking){
			$gamePlayer._followers._data[i]._isAttacking = 0;
		};
		if(!$gamePlayer._followers._data[i].sequencesWait){
			$gamePlayer._followers._data[i].sequencesWait = 0;
		}
		if(!$gamePlayer._followers._data[i].sequence){
			$gamePlayer._followers._data[i].sequence = [];
		}
	 	$gamePlayer._followers._data[i].setThrough(false);
	 	$gamePlayer._followers._data[i].moveRandom();
	};
	for(i = 0 ; i < $gameParty.members().length ; i ++){
		if ($gameParty.members()[i]._equips[0]._itemId == 0){
			$gameParty.members()[i].changeEquip(0, 1);
		};
	};
};

const _sxlAbs_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlAbs_mapUpdate.call(this);
	if( sxlSimpleABS.debugMode ){
		if(!this.consoles){
			this.consoles = new Sprite(new Bitmap(Graphics.height,Graphics.width) );
			this.addChild(this.consoles);
		}else{
			var line = 0;
			var lineHeight = 28
			this.consoles.bitmap.clear();
			this.consoles.bitmap.drawText( '角色Z坐标:' + $gamePlayer.screenZ(),128,0,200,48,'left' )
			line ++ ;
			this.consoles.bitmap.drawText( '武器Z坐标:' + showWeaponZ,128,line*lineHeight,200,48,'left' )
			line ++ ;
			this.consoles.bitmap.drawText( '护甲Z坐标:' + showArmorZ,128,line*lineHeight,200,48,'left' )
			line ++ ;
			this.consoles.bitmap.drawText( '盾牌Z坐标:' + showShieldZ,128,line*lineHeight,200,48,'left' )
			line ++ ;
			this.consoles.bitmap.drawText( '角色Pattern:' + playerPattern._pattern,128,line*lineHeight,200,48,'left' )
			line ++ ;
			this.consoles.bitmap.drawText( '角色PatternCount:' + playerPatternCount,128,line*lineHeight,200,48,'left' )
			line ++ ;
		}
	}
	


	if(sxlSimpleABS.moveAttackMode == true && (!$gamePlayer.rushCount||$gamePlayer.rushCount!=0)){
		// if(Math.floor($gamePlayer._realX) == $gamePlayer._realX && Math.floor($gamePlayer._realY) == $gamePlayer._realY){
			if((Input.isPressed('s') && Input.isPressed('a'))|| (Input.isPressed('a') && Input.isPressed('s'))){
				$gamePlayer._direction8dir = 1;
			}else
			if((Input.isPressed('s') && Input.isPressed('d'))|| (Input.isPressed('d') && Input.isPressed('s'))){
				$gamePlayer._direction8dir = 3;
			}else
			if((Input.isPressed('w') && Input.isPressed('a'))|| (Input.isPressed('a') && Input.isPressed('w'))){
				$gamePlayer._direction8dir = 7;
			}else
			if((Input.isPressed('w') && Input.isPressed('d'))|| (Input.isPressed('d') && Input.isPressed('w'))){
				$gamePlayer._direction8dir = 9;
			}else
			if((Input.isPressed('w')) || (Input.isPressed('a')) || (Input.isPressed('s')) || (Input.isPressed('d')) ){
				$gamePlayer._direction8dir = $gamePlayer._direction;
			// }
		}
		

		
		//映射WASD控制移动方向
		Scene_Map.prototype.isMapTouchOk = function() {return false;};
		if(Input.isPressed('s') && !$gamePlayer.isMoving() && $gamePlayer.canMove()){
			if(Input.isPressed('a')){
				// $gamePlayer.processMoveByInput(1);
				$gamePlayer.dotMoveByDeg(225)
			}else if( Input.isPressed('d') ){
				// $gamePlayer.processMoveByInput(3);
				$gamePlayer.dotMoveByDeg(135)
			}else{
				// $gamePlayer.processMoveByInput(2);
				$gamePlayer.dotMoveByDeg(180)
			}
			
		};
		if(Input.isPressed('a') && !$gamePlayer.isMoving() && $gamePlayer.canMove()){
			if(Input.isPressed('w')){
				// $gamePlayer.processMoveByInput(7);
				$gamePlayer.dotMoveByDeg(315)
			}else if( Input.isPressed('s') ){
				// $gamePlayer.processMoveByInput(1);
				$gamePlayer.dotMoveByDeg(225)
			}else{
				// $gamePlayer.processMoveByInput(4);
				$gamePlayer.dotMoveByDeg(270)
			}
		};
		if(Input.isPressed('d') && !$gamePlayer.isMoving() && $gamePlayer.canMove()){
			if(Input.isPressed('w')){
				// $gamePlayer.processMoveByInput(9);
				$gamePlayer.dotMoveByDeg(45)
			}else if( Input.isPressed('s') ){
				// $gamePlayer.processMoveByInput(1);
				$gamePlayer.dotMoveByDeg(225)
			}else{
				// $gamePlayer.processMoveByInput(6);
				$gamePlayer.dotMoveByDeg(90)
			}
		};
		if(Input.isPressed('w') && !$gamePlayer.isMoving() && $gamePlayer.canMove()){
			if(Input.isPressed('a')){
				// $gamePlayer.processMoveByInput(7);
				$gamePlayer.dotMoveByDeg(315)
			}else if( Input.isPressed('d') ){
				// $gamePlayer.processMoveByInput(9);
				$gamePlayer.dotMoveByDeg(45)
			}else{
				// $gamePlayer.processMoveByInput(8);
				$gamePlayer.dotMoveByDeg(0)
			}
		};
	}
	if(this.itemArray){
		sxlSimpleItemList._ssmbs = true;
	}
	
	if(sxlSimpleABS.requestRefreshMember == true){
		this.loadMembersPlayers();
		if(sxlSimpleFaces) this.createFaces();
		sxlSimpleABS.requestRefreshMember = false;
	};
	//左右双方向控制
	if(sxlSimpleABS._2direction == true){
		if(TouchInput.x <= $gamePlayer.screenX()){
			$gamePlayer._direction=4;
		}else{
			$gamePlayer._direction=6;
		}
	};
	//shift朝向鼠标
	if(Input.isPressed( 'shift' )){
		var xDist = TouchInput.x - $gamePlayer.screenX();
		var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
		var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
		if(sxlSimpleABS._2direction == true){
			if(TouchInput.x <= $gamePlayer.screenX()){
				$gamePlayer._direction=2;
			}else{
				$gamePlayer._direction=4;
			}
		}else{
			// if(angle>45&&angle<135){
			// 	$gamePlayer._direction=2;
			// }else if(angle>-45&&angle<45){
			// 	$gamePlayer._direction=6;
			// }else if(angle>-135&&angle<-45){
			// 	$gamePlayer._direction=8;
			// }else{
			// 	$gamePlayer._direction=4;
			// }
		}
		
		// if(TouchInput.isPressed()&&$gameParty.members()[0]._tp>=100){
		// 	var skill = $dataSkills[$gameParty.members()[0].attackSkillId()]
		// 	this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],skill);
		// 	$gameParty.members()[0]._tp-=100;
		// }
	};
	for( i in sxlSimpleABS.followerGauges){
		// console.log(sxlSimpleABS.followerGauges[i].member)
		if( sxlSimpleABS.followerGauges[i].member &&
			(sxlSimpleABS.followerGauges[i].member._hp <= 0 || 
			sxlSimpleABS.followerGauges[i].member.isStateAffected(1) || 
			(sxlSimpleABS.followerGauges[i].member.aliveTime && sxlSimpleABS.followerGauges[i].member.aliveTime <= 0 ) || 
			sxlSimpleABS.followerGauges[i].member.hideGauge == true)){
			sxlSimpleABS.followerGauges[i].opacity = 0;
		}
	}
	if($gameMessage.isBusy()){
		sxlSimpleABS.ABS_OFF = true;
	}else{
		sxlSimpleABS.ABS_OFF = false;
	}
	if(!sxlSimpleABS.ABS_OFF){
		this.commonAttack();
		this.enemyAction();
	}
	this.updateMembers();
	this.updateDamageWord();
	this.updateEnemies();
	this.updateParticles();
	this.updateFollowers();
	this.updateAura();
	this.updateInformation();
	this.refreshLeaderGauge($gamePlayer);
	this.updateCanMoveTime();
	this.fixEmptyWeapon();
	this.updateStates();
	this.updateTP();
	this.updateAggro();
	this.updateDestinationColor();
	this.setSpecialSkillCD();
	this.triggerSpecialSkill();
	this.refreshAttackSkill();
	this.updateScreenInformation();
	this.refreshInformation();
	this.isMoveable();
	this.isMoveableFace();
	this.updateSequence();
	if(!sxlSimpleABS.requestWait){
		sxlSimpleABS.requestWait = 0;
	}else{
		if(sxlSimpleABS.requestWait > 0){
			sxlSimpleABS.requestWait -- ;
		}else{
			sxlSimpleABS.requestWait = 0;
		}
	}

	if(sxlSimpleABS.floatItemsInform.length){
		for( i in sxlSimpleABS.floatItemsInform ){
			if(sxlSimpleABS.requestWait == 0){
				this.showDamage( $gamePlayer , 0 , false ,false, false, false, false, sxlSimpleABS.floatItemsInform[i] )
				sxlSimpleABS.floatItemsInform.splice(i,1);
				sxlSimpleABS.requestWait = 1;
			}
		}
	};

	if( this.screenInformation.buttonClear.x &&
		TouchInput.x > this.screenInformation.buttonClear.x &&
		TouchInput.x < this.screenInformation.buttonClear.x + 48 &&
		TouchInput.y > this.screenInformation.buttonClear.y - 12 &&
		TouchInput.y < this.screenInformation.buttonClear.y + 32){
		$gameParty.members()[0]._tp=0;
		this.isOnInformWindow = true;
	}else{
		this.isOnInformWindow = false;
	};
};

Scene_Map.prototype.isMoveable = function(){

	if(  (this.itemBackground &&
		  TouchInput.x > this.itemBackground.x && 
		  TouchInput.x < this.itemBackground.x + this.itemBackground.width &&
		  TouchInput.y > this.itemBackground.y &&
		  TouchInput.y < this.itemBackground.y + this.itemBackground.height) ||
		 (this.shortcutBackArray &&
		  TouchInput.x > this.shortcutBackArray[0].x && 
		  TouchInput.x < this.shortcutBackArray[sxlSimpleShortcut.quantity-1].x &&
		  TouchInput.y > this.shortcutBackArray[0].y &&
		  TouchInput.y < this.shortcutBackArray[0].y + 36) ||
		 (this.memberStates &&
		  TouchInput.x > this.memberStates.x && 
		  TouchInput.x < this.memberStates.x + 470 &&
		  TouchInput.y > this.memberStates.y &&
		  TouchInput.y < this.memberStates.y + 298)||
		 (this._colorGauge &&
		  TouchInput.x > this._colorGauge.x && 
		  TouchInput.x < this._colorGauge.x + 200 &&
		  TouchInput.y > this._colorGauge.y &&
		  TouchInput.y < this._colorGauge.y + 40)||
		  (this.skillWindow &&
		  TouchInput.x > this.skillWindow.x && 
		  TouchInput.x < this.skillWindow.x + 298 &&
		  TouchInput.y > this.skillWindow.y &&
		  TouchInput.y < this.skillWindow.y + 469)||
		  (this.questWindow &&
		  TouchInput.x > this.windowTitle.x && 
		  TouchInput.x < this.windowTitle.x + 298 &&
		  TouchInput.y > this.windowTitle.y &&
		  TouchInput.y < this.windowTitle.y + 48)||
		  sxlSimpleABS.ABS_OFF==true ||
		  this.touchAttackabkeEnemy == true ||
		  this.isHandledItem){

		sxlSimpleItemList._isMoveable = false;
		
	}else{
		sxlSimpleItemList._isMoveable = true;
	}
};

Scene_Map.prototype.isMoveableFace = function(){
	if(  this.faces && (this.faces[0] &&
		 TouchInput.x > this.faces[0]._bounds.minX &&
		 TouchInput.y > this.faces[0]._bounds.minY &&
		 TouchInput.x < this.faces[0]._bounds.maxX &&
		 TouchInput.y < this.faces[0]._bounds.maxY)||
		 this.faces && (this.faces[1] &&
		 TouchInput.x > this.faces[1]._bounds.minX &&
		 TouchInput.y > this.faces[1]._bounds.minY &&
		 TouchInput.x < this.faces[1]._bounds.maxX &&
		 TouchInput.y < this.faces[1]._bounds.maxY)||
		 this.faces && (this.faces[2] &&
		 TouchInput.x > this.faces[2]._bounds.minX &&
		 TouchInput.y > this.faces[2]._bounds.minY &&
		 TouchInput.x < this.faces[2]._bounds.maxX &&
		 TouchInput.y < this.faces[2]._bounds.maxY)||
		 this.faces && (this.faces[3] &&
		 TouchInput.x > this.faces[3]._bounds.minX &&
		 TouchInput.y > this.faces[3]._bounds.minY &&
		 TouchInput.x < this.faces[3]._bounds.maxX &&
		 TouchInput.y < this.faces[3]._bounds.maxY) ){
		sxlSimpleItemList._isMoveableFace = false;
	}else{
		sxlSimpleItemList._isMoveableFace = true;
	}
};

// var _onAutoSaveSuc = Scene_Base.prototype.onAutosaveSuccess;
// Scene_Base.prototype.onAutosaveSuccess = function() {
// 	_onAutoSaveSuc.call(this);

// };
// ==============================================================================================================
// 
// 		Map_Start 地图上读取类
// 
// ==============================================================================================================

Scene_Map.prototype.reLoadEnemies = function(){
	for( i = 0 ; i < $gameMap.events().length ; i ++ ){
		var events =  $gameMap.events();
		sxlSimpleABS.reloadedEvents = i;
		if($gameSelfSwitches.value([$gameMap._mapId,events[i]._eventId, 'D'], true)){
			$gameSelfSwitches.setValue([$gameMap._mapId,events[i]._eventId, 'D'], false);
		};
		if( $gameMap.events()[i]._deadDeal == 1 || !$gameMap.events()[i]._deadDeal ){
			$gameMap.events()[i]._deadDeal = 0;
		};
	};
};

Scene_Map.prototype.loadCanMoveTime = function(){
	var events =  $gameMap.events();
	var followers = $gamePlayer._followers._data
	$gamePlayer._stun = 0 ;
	$gamePlayer._stunMax = 0 ;
	$gamePlayer._waitTime = 0 ;
	for( i = 0 ; i < events.length ; i ++ ){
		if(!events[i]._stun) events[i]._stun = 0 ;
		if(!events[i]._stunMax) events[i]._stunMax = 0 ;
		if(!events[i]._waitTime) events[i]._waitTime = 0 ;
	};
	for( i = 0 ; i < followers.length ; i ++ ){
		if(!followers[i]._stun) followers[i]._stun = 0 ;
		if(!followers[i]._stunMax) followers[i]._stunMax = 0 ;
		if(!followers[i]._waitTime) followers[i]._waitTime = 0 ;
	};
};

Scene_Map.prototype.loadEnemies = function(){
	var events =  $gameMap.events();

	for(i = 0 ; i < events.length ; i ++ ){
		var isFoe = /<enemy:([0-9]*?)>/i.exec($gameMap.events()[i].event().note);
		
		if( isFoe != null ){
			if(!events[i]._battler){
				var foe = /<enemy:([0-9]*?)>/i.exec($gameMap.events()[i].event().note)[1];
				var isAffectedEnemies = new Array();
				events[i]._battler = new Game_Enemy(foe, 0, 0);
				events[i].locked = false;
				events[i]._battler.eventId = i;
				if(!$gameMap.events()[i].sequencesWait){
					$gameMap.events()[i].sequencesWait = 0;
				}
				if(!$gameMap.events()[i].sequence){
					$gameMap.events()[i].sequence = [];
				}
				if(sxlSimpleABS.sequenceUser.indexOf($gameMap.events()[i])<0){
					sxlSimpleABS.sequenceUser.push($gameMap.events()[i]);
				}
				$gameSwitches.setValue(1,true);
			};
		};
		if($gameMap.events()[i]._battler && $dataEnemies[$gameMap.events()[i]._battler._enemyId].meta.bossGauge){
			this.showBossGauge($gameMap.events()[i]);
		}else{
			this.showEnemiesGauge($gameMap.events()[i]);
		}
	};
};


Scene_Map.prototype.loadFollowers = function(){
	var player = $gamePlayer;
	if(!player._battler){
		player._battler = new Game_Actor($gameParty.members()[0]._actorId);
		player._tgr = 0;
		this.showLeaderGauge(player);
	}
	for(var i = 0; i < $gamePlayer._followers._data.length; i++){
		this.showFollowerGauge($gamePlayer._followers._data[i]);
		if(!$gamePlayer._followers._data[i]._battler && $gameParty.members()[i+1]){
			let follower = $gameParty.members()[i+1]._actorId;
			$gamePlayer._followers._data[i]._battler = new Game_Actor(follower);
			$gamePlayer._followers._data[i]._tgr = 0;
			$gamePlayer._followers._data[i].target = null;
		};
	};
};

Scene_Map.prototype.loadMembersPlayers = function(){
	for(var i = 0; i < $gameParty.members().length; i++){
		var theActor = $gameParty.members()[i];
		var skill = theActor.skills()[0];
		if( skill && !theActor.spCD ){
			theActor.spCD = skill.meta.spCD?
							Number(skill.meta.spCD):sxlSimpleABS.defaultSPCD;
		}
		$gameParty.members()[i].followerId =  i - 1 ;
		$gameParty.members()[i].player = (i == 0? $gamePlayer:$gamePlayer._followers._data[ i - 1 ])
	}
};



// ==============================================================================================================
// 
// 		Map_Update 地图上更新类
// 
// ==============================================================================================================

Scene_Map.prototype.updateCanMoveTime = function(){
	if(Input.isTriggered('ok')){
		// if(!$gamePlayer.isJumping()) $gamePlayer.jumpButton(0,0);
	}
	for(i = 0 ; i < $gameParty.members().length ; i++){
		var playerChar = (	i == 0?
							$gamePlayer:
							$gamePlayer._followers._data[ i - 1 ]);
		if( playerChar._waitTime <= 0){
			playerChar._waitTime = 0;
		}else{
			playerChar._waitTime --;
		}
		if( playerChar._stun <= 0 ){
			playerChar._stun = 0 ;
			playerChar._stunMax = 0
		}else{
			playerChar._stun -- ;
		};
		if( playerChar.sequencesWait <= 0 ){
			playerChar.sequencesWait = 0 ;
			playerChar.sequencesWait = 0
		}else{
			playerChar.sequencesWait -- ;
		};
		if( playerChar._cooldown <= 0 || !playerChar._cooldown ){
			playerChar._cooldown = 0 ;
		}else{
			playerChar._cooldown -- ;
		};
		if( playerChar.isAttack <= 0 || !playerChar.isAttack ){
			playerChar.isAttack = 0 ;
		}else{
			playerChar.isAttack -- ;
		};
		if( playerChar.waitForMotion <= 0 || !playerChar.waitForMotion ){
			playerChar.waitForMotion = 0 ;
		}else{
			playerChar.waitForMotion -- ;
		};
		if($gameParty.members()[i].damageHp){
			$gameParty.members()[i].damageHp -= $gameParty.members()[i].damageHp*0.2 ;
		}
		if(!playerChar.lastSkill&&!playerChar.lastSkillTimer){
			playerChar.lastSkill = [];
			playerChar.lastSkillTimer = [];
		}
		if(playerChar.lastSkill){
			for(lastSkills in playerChar.lastSkill){
				if(playerChar.lastSkillTimer[lastSkills] < 0){
					playerChar.lastSkill.splice(lastSkills,1);
					playerChar.lastSkillTimer.splice(lastSkills,1);
				}else{
					playerChar.lastSkillTimer[lastSkills] -- ;
				}
			}
		}
		if(!playerChar.rushCount) playerChar.rushCount = 0;
		if(playerChar.rushCount == 0){
			playerChar.rushAngle = Math.atan2((playerChar.screenY()-TouchInput.y), (playerChar.screenX()-TouchInput.x))*(180/Math.PI)+270;
			if(playerChar.rushAngle<0){
				playerChar.rushAngle=playerChar.rushAngle+360;
			}
			if(playerChar.rushAngle>=360){
				playerChar.rushAngle=playerChar.rushAngle-360;
			}
		}else{
			if(playerChar.storeDirectionFix){
				user._directionFix = playerChar.storeDirectionFix;
			}
		}

		if(playerChar.rushCount && playerChar.rushCount != 0){
			playerChar.storeDirectionFix = user._directionFix ;
			user._directionFix = true;
			if(playerChar._direction==2){
				var canMoveMore = playerChar.canPass(playerChar.x,playerChar.y+1,playerChar._direction)
			}else if(playerChar._direction==4){
				var canMoveMore = playerChar.canPass(playerChar.x-1,playerChar.y,playerChar._direction)
			}else if(playerChar._direction==6){
				var canMoveMore = playerChar.canPass(playerChar.x+1,playerChar.y,playerChar._direction)
			}else if(playerChar._direction==8){
				var canMoveMore = playerChar.canPass(playerChar.x,playerChar.y-1,playerChar._direction)
			}
			canMoveMore = true;
			if(!playerChar.isMoving()){
				if(!canMoveMore){
					playerChar.rushCount = 0;
				}else{
					if(playerChar.rushCount>0){
						playerChar.dotMoveByDeg(playerChar.rushAngle);
						playerChar.rushCount --;
					}else{
						playerChar.dotMoveByDeg(-playerChar.rushAngle);
						playerChar.rushCount ++;
					}
					
				}
			}
			if(playerChar.delaySkill && playerChar.delaySkill[0] && playerChar.rushCount == 0 ){
				this.triggerSkillnoTarget(playerChar,$gameParty.members()[i],playerChar.delaySkill[0]);
				playerChar.delaySkill.splice(0,1);

			}
		}
		if($gameParty.members()[i]){
			if($gameParty.members()[i]._mp<0)$gameParty.members()[i]._mp = 0;
			if($gameParty.members()[i]._hp<0)$gameParty.members()[i]._hp = 0;
			
			//读取吸血
			if(!$gameParty.members()[i].HPSteal){
				$gameParty.members()[i].HPSteal = 0;
			}
			var equipsHPSteal = 0;
			var stateHPSteal = 0;
			for( equip of $gameParty.members()[i].equips()){
				if(equip.meta.HPSteal){
					equipsHPSteal += Number(equip.meta.HPSteal)
				}
			}
			for( state of $gameParty.members()[i].states()){
				if(state.meta.HPSteal){
					stateHPSteal += Number(state.meta.HPSteal)
				}
			}
			$gameParty.members()[i].HPSteal = equipsHPSteal+stateHPSteal;

			//读取装备耐久消耗系数
			if(!$gameParty.members()[i].durabilityConsFreq){
				$gameParty.members()[i].durabilityConsFreq = 1;
			}
			var equipsDurabilityConsFreq = 0;
			var stateDurabilityConsFreq = 0;
			for( equip of $gameParty.members()[i].equips()){
				if(equip.meta.durabilityConsFreq){
					equipsDurabilityConsFreq += Number(equip.meta.durabilityConsFreq)
				}
			}
			for( state of $gameParty.members()[i].states()){
				if(state.meta.durabilityConsFreq){
					stateDurabilityConsFreq += Number(state.meta.durabilityConsFreq)
				}
			}
			$gameParty.members()[i].durabilityConsFreq = Math.max(1,equipsDurabilityConsFreq+stateDurabilityConsFreq);

			//读取吸魔
			if(!$gameParty.members()[i].MPSteal){
				$gameParty.members()[i].MPSteal = 0;
			}
			var equipsMPSteal = 0;
			var stateMPSteal = 0;
			for( equip of $gameParty.members()[i].equips()){
				if(equip.meta.MPSteal){
					equipsMPSteal += Number(equip.meta.MPSteal)
				}
			}
			for( state of $gameParty.members()[i].states()){
				if(state.meta.MPSteal){
					stateMPSteal += Number(state.meta.MPSteal)
				}
			}
			$gameParty.members()[i].MPSteal = equipsMPSteal+stateMPSteal;

			//读取吸魔
			if(!$gameParty.members()[i].castSpeed){
				$gameParty.members()[i].castSpeed = 1;
			}
			var equipscastSpeed = 0;
			var statecastSpeed = 0;
			for( equip of $gameParty.members()[i].equips()){
				if(equip.meta.castSpeed){
					equipscastSpeed += Number(equip.meta.castSpeed)
				}
			}
			for( state of $gameParty.members()[i].states()){
				if(state.meta.castSpeed){
					statecastSpeed += Number(state.meta.castSpeed)
				}
			}
			$gameParty.members()[i].castSpeedParam = equipscastSpeed+statecastSpeed;
			$gameParty.members()[i].castSpeed = 1/(1+(equipscastSpeed+statecastSpeed)/100) ;

			//移动速度的处理，最高移速为7，更高也许会穿墙
			var normalSpeed = Math.min(3+Math.pow(($gameParty.members()[i].agi)/1000,0.5)*3,7);

			//读取冲刺技能暂未完工
			if(!$gameParty.members()[i].dashSkill){
				$gameParty.members()[i].dashSkill = 0;
			}
			var dashSkill = null;
			for( equip of $gameParty.members()[i].equips()){
				if(equip.meta.dashSkill){
					dashSkill = Number(equip.meta.dashSkill)
				}
			}
			for( state of $gameParty.members()[i].states()){
				if(state.meta.dashSkill){
					dashSkill = Number(state.meta.dashSkill)
				}
			}
			$gameParty.members()[i].dashSkill = dashSkill;



			//奔跑的处理
			if( i != 0) {
				playerChar._moveSpeed = normalSpeed;
			}else{
				if(Input.isPressed('shift') && $gamePlayer.energy>0){
					$gamePlayer.isRushing = true;
					playerChar._moveSpeed = Math.min(normalSpeed+0.5,7);
				}else{
					playerChar._moveSpeed = normalSpeed;
					
				}
				
				if( Input.isPressed('shift') && 
				   (Input.isPressed('a') || 
					Input.isPressed('s') ||
					Input.isPressed('d') ||
					Input.isPressed('w') ||
					Input.isPressed('up') ||
					Input.isPressed('down') ||
					Input.isPressed('left') ||
					Input.isPressed('right'))
				   ){
					if($gamePlayer.energy>0){
						$gamePlayer.energy--;
					}
					$gameParty.members()[0].addState(sxlSimpleABS.noEnergyRecoverStateId);
				}else{
					if( $gamePlayer.energy<$gamePlayer.energyMax && 
						!$gameParty.members()[0].isStateAffected(sxlSimpleABS.noEnergyRecoverStateId)){
						$gamePlayer.energy+=$gamePlayer.energyMax/30;
					}
					if( $gamePlayer.energy>=$gamePlayer.energyMax ){
						$gamePlayer.energy = $gamePlayer.energyMax;
					}
				}
			}
		}
		
	};
	//读取耐力
	if(!$gamePlayer.energyMax){
		$gamePlayer.energyMax = 100;
		$gamePlayer.energy = 100;
	}
	var equipsBonus = 0;
	var stateBonus = 0;
	for( equip of $gameParty.members()[0].equips()){
		if(equip.meta.energyBonus){
			equipsBonus += Number(equip.meta.energyBonus)
		}
	}
	for( state of $gameParty.members()[0].states()){
		if(state.meta.energyBonus){
			stateBonus += Number(state.meta.energyBonus)
		}
	}
	$gamePlayer.energyMax = 100+equipsBonus+stateBonus;

	


	if($gamePlayer.waitForCast&&$gamePlayer.waitForCast>1){
		$gamePlayer.waitForCast -- ;
	}else if ($gamePlayer.waitForCast && $gamePlayer.castSkill && $gamePlayer.waitForCast <= 1) {
		$gamePlayer.waitForCast = 1;
		if($gamePlayer.castSkill.meta.noTarget){
			this.triggerSkillInstantNotarget($gamePlayer,$gameParty.members()[0],$gamePlayer.castSkill)
		}else{
			this.triggerSkillInstant($gamePlayer,$gameParty.members()[0],$gamePlayer.target,$gamePlayer.targetMember,$gamePlayer.castSkill)
		}
		
	}
	// 敌人
	for( i = 0 ; i < $gameMap.events().length ; i ++ ){
		var theEvent = $gameMap.events()[i];
		if(theEvent.sequencesWait <= 0){
			theEvent.sequencesWait = 0
		}else{
			theEvent.sequencesWait --;
		}
		if( theEvent._battler && theEvent._stun <= 0 ){
			theEvent._stun = 0;
			theEvent._stunMax = 0;
			theEvent._moveSpeed = 4*(theEvent._battler.agi/1000+1);
		}else{
			theEvent._stun --;
		}
		if(!theEvent.rushCount) theEvent.rushCount = 0;
		if( theEvent.rushCount != 0 ){
			if(theEvent.rushCount > 0 && !theEvent.isMoving()){
				theEvent.moveForward();
				theEvent.rushCount --;
			}
			if(theEvent.rushCount < 0 && !theEvent.isMoving()){
				theEvent.moveBackward();
				theEvent.rushCount ++;
			}
		}
		if( theEvent._battler && theEvent._waitTime <= 0 ){
			theEvent._waitTime = 0;
		}else{
			theEvent._waitTime -- ;
		};
		if( !theEvent.jumpCooldown){
			theEvent.jumpCooldown = 0;
		}else{
			theEvent.jumpCooldown --;
		}
		if( theEvent.isAttack <= 0 || !theEvent.isAttack ){
			theEvent.isAttack = 0 ;
		}else{
			theEvent.isAttack -- ;
		};
		if( theEvent._battler && 
			theEvent._battler.damageHp){
			theEvent._battler.damageHp -= theEvent._battler.damageHp*0.2 ;
		}
		if( theEvent._battler && (theEvent._battler._hp > (theEvent._battler.hrg*100/60 + 1)) && (theEvent._battler._hp < theEvent._battler.mhp)){
			theEvent._battler._hp += theEvent._battler.hrg*100/60;
			theEvent._battler._mp += theEvent._battler.mrg*100/60;
		}
		if( theEvent._battler && theEvent._battler._hp > theEvent._battler.mhp ){
			theEvent._battler._hp = theEvent._battler.mhp ;
		}
		if(theEvent._battler && theEvent._battler._hp <= 0 ){
			theEvent._battler._hp = 0; 
		}
		if(!theEvent.lastSkill&&!theEvent.lastSkillTimer){
			theEvent.lastSkill = [];
			theEvent.lastSkillTimer = [];
		}
		
		if(theEvent.lastSkill){
			for(lastSkills in theEvent.lastSkill){
				if(theEvent.lastSkillTimer[lastSkills] < 0){
					theEvent.lastSkill.splice(lastSkills,1);
					theEvent.lastSkillTimer.splice(lastSkills,1);
				}else{
					theEvent.lastSkillTimer[lastSkills] -- ;
				}
			}
		}
	};

	for( i = 0 ; i < $gameParty.members().length ; i ++ ){
		if( $gameParty.members()[i]._hp <= 0 ){
			$gameParty.members()[i]._hp = 0;
			$gameParty.members()[i].addState(1);
		}else{
			$gameParty.members()[i].removeState(1);
			if($gameParty.members()[i]._hp > $gameParty.members()[i].hrg*100/60 + 1 ){
				$gameParty.members()[i]._hp += $gameParty.members()[i].hrg*100/60;
			}
			$gameParty.members()[i]._mp += $gameParty.members()[i].mrg*100/60;
		};
		if( $gameParty.members()[i]._hp > $gameParty.members()[i].mhp ){
			$gameParty.members()[i]._hp = $gameParty.members()[i].mhp;
		};
		if( $gameParty.members()[i]._mp > $gameParty.members()[i].mmp ){
			$gameParty.members()[i]._mp = $gameParty.members()[i].mmp;
		};
	};
};

Scene_Map.prototype.updateTP = function(){
	// 队友
	for(i = 0 ; i < $gameParty.members().length ; i++){
		if( $gameParty.members()[i]._tp < 0){
			$gameParty.members()[i]._tp = 0;
		}else if( $gameParty.members()[i]._tp >= 100){
			$gameParty.members()[i]._tp = 100;
		}else{
			$gameParty.members()[i]._tp += $gameParty.members()[i].trg * 100 ;
		};
		if(!$gameParty.members()[i]){
			$gameParty.members()[i].useSkillId = $gameParty.members()[i].attackSkillId();
		}
	};
	// 敌人
	for( i = 0 ; i < $gameMap.events().length ; i ++ ){
		var theEvent = $gameMap.events()[i];
		if( theEvent._battler ){
			if( theEvent._battler._tp < 0 ){
				theEvent._battler._tp = 0;
			}else if( theEvent._battler._tp >= 100 ){
				theEvent._battler._tp = 100 ;
			}else{
				theEvent._battler._tp += theEvent._battler.trg * 100 ;
			}
		};
	};
};

Scene_Map.prototype.fixEmptyWeapon = function(){
	for(i = 0 ; i < $gameParty.members().length ; i ++){
		if ($gameParty.members()[i]._equips[0]._itemId == 0 ||
			(sxlSimpleItemList.durabilityAllowed && 
			$gameParty.durabilityWeapons[$gameParty.members()[i].weapons()[0].id-1]<=0)){
			$gameParty.members()[i].changeEquip(0, $dataWeapons[1]);
		};
	};
	for(i = 0 ; i < $gameParty.members().length ; i ++){
		if( $gameParty.members()[i].slotType()==1 && $gameParty.members()[i]._equips[1]._dataClass){
			$gameParty.members()[i]._equips[1]._dataClass='weapon';
			$gameParty.members()[i]._equips[1]._itemId=1;
		}
		if ( $gameParty.members()[i].slotType()==1 &&
			( $gameParty.members()[i]._equips[1]._itemId == 0 ||
			(sxlSimpleItemList.durabilityAllowed &&  ($gameParty.members()[i].weapons()[1] && $gameParty.durabilityWeapons[$gameParty.members()[i].weapons()[1].id-1]<=0))
			)
			){

			$gameParty.members()[i].changeEquip(1, $dataWeapons[1])

		};
	};
	for(i = 0 ; i < $gameParty.members().length ; i ++){
		for( j = 0 ; j < $gameParty.members()[i].equips().length ; j ++ ){
			var theEquip = $gameParty.members()[i].equips()[j];
			if( sxlSimpleItemList.durabilityAllowed&&
				theEquip.etypeId && 
				$gameParty.durabilityArmors[$gameParty.members()[i].equips()[j].id-1]<=0){
				if(!$gameParty.hasItem($dataArmors[$gameParty.members()[i].equips()[j].etypeId-1])){
					$gameParty.gainItemHide($dataArmors[$gameParty.members()[i].equips()[j].etypeId-1],1)
				}
				$gameParty.members()[i].changeEquip(0, $dataArmors[$gameParty.members()[i].equips()[j].etypeId-1]);
			}
		}
	};
	for(i = 0 ; i < $gameParty.members().length ; i ++){
		if ($gameParty.members()[i].equips()[0].meta.dualWield){
			$gameParty.members()[i].changeEquip(1, $dataArmors[1]);
		};
	};

};

Scene_Map.prototype.updateMembers = function(){
	for(let i = 0 ; i < $gameParty.members().length ; i++){
		var _character = i == 0 ? $gamePlayer : $gamePlayer._followers._data[ i - 1 ];
		var actor = $gameParty.members()[i];
		var dataActor = $dataActors[$gameParty.members()[i]._actorId]
		var weapon = $dataWeapons[actor._equips[0]._itemId];
		var follower = $gamePlayer._followers._data;
		// 装备添加状态
		for(const equip of actor.equips()){
			if(equip.meta.equipStates){
				for( state in equip.meta.equipStates.split(',') ){
					actor.addState(equip.meta.equipStates.split(',')[state])
				}
			}
		}
		if(dataActor.meta.summoned){
			if(actor.aliveTime>1 && (actor._hp >= 1 && !actor.isStateAffected(1))){
				$gameActors.actor(actor._actorId).hideGauge = false;
			}
			if(actor.aliveTime<=1 || actor._hp < 1 || actor.isStateAffected(1)){
				$gameActors.actor(actor._actorId).hideGauge = true;
			}
			if(actor.aliveTime<=1 || $gameActors.actor(actor._actorId).hideGauge == true){
				var xDistJump = ($gamePlayer.x) - (actor.player._x)
				var yDistJump = ($gamePlayer.y) - (actor.player._y)
				actor.player.jump(xDistJump,yDistJump);
				$gameParty.removeActor(actor._actorId);
			}else{
				actor.aliveTime--;
			}
			if(actor._hp <= 1 && ( !actor._deathDeal || actor._deathDeal == 0 ) || $gameActors.actor(actor._actorId).hideGauge == true){
				var xDistJump = ($gamePlayer.x) - (actor.player._x)
				var yDistJump = ($gamePlayer.y) - (actor.player._y)
				actor.player.jump(xDistJump,yDistJump);
				$gameParty.removeActor(actor._actorId);
			}
		}
		if( actor._hp <= 0 && ( !actor._deathDeal || actor._deathDeal == 0 ) && !$dataActors[actor._actorId].meta.summoned ){
			if( actor._hp<0 ) actor._hp = 0;
			if(i != 0){
				var information = '【' + actor._name  + '】 已经阵亡 ……';
				sxlSimpleABS.informationColor.push('#ffffff');
				sxlSimpleABS.information.push(information);
				
				this.refreshInformation();
				actor.addState(1);
				if($dataActors[actor._actorId].meta.deathAnimation){
					$gameTemp.requestAnimation( [follower[ i - 1 ]] , Number($dataActors[actor._actorId].meta.deathAnimation) , false )
				}
				if($dataActors[actor._actorId].meta.deathVoice){
					var allParam = $dataActors[actor._actorId].meta.deathVoice.split(',')
					var _name = String(allParam[0]);
					var _volume = Number(allParam[1])||90;
					var _pitch = Number(allParam[2])||100;
					AudioManager.playSe({name:_name,volume:_volume,pitch:_pitch})
				}
				
				$gameParty.removeActor(actor._actorId);
			}else{
				var information = '【' + actor._name  + '】 已经阵亡 ……';
				sxlSimpleABS.informationColor.push('#ffffff');
				sxlSimpleABS.information.push(information);
				this.refreshInformation();
				var actorData = $dataActors;
				var deathCharacter = actorData[actor._actorId].meta.deathImg?
									 actorData[actor._actorId].meta.deathImg : '$CommonDeath' ;
				var deathIndex = actorData[actor._actorId].meta.deathIndex?
								 actorData[actor._actorId].meta.deathIndex : 0 ;
				var deathDirection = actorData[actor._actorId].meta.deathDirection?
									 actorData[actor._actorId].meta.deathDirection : 2 ;
				$gamePlayer._direction = deathDirection;
				// $gamePlayer._directionFix = true ;
				$gamePlayer._characterName = deathCharacter;
				$gamePlayer._characterIndex = deathIndex;
				actor.addState(1);
				actor._deathDeal = 1 ;
			};
		};
		//更新隐身状态
		for(var state of actor._states){
			actor.player.vanish = false;
			actor.player._opacity = 255;
			var stateData = $dataStates[state];
			if(stateData.meta.vanish){
				actor.player._opacity = 128;
				actor.player.vanish = true;
				break;
			}
		}
	};
};

Scene_Map.prototype.updateStates = function(){
	for( i = 0 ; i < $gameParty.members().length; i ++ ){
		for( j = 0 ; j < $gameParty.members()[i]._states.length ; j ++ ){
			var stateId = $gameParty.members()[i]._states[j];
			var needUpdate = $dataStates[stateId].meta.always?
							 Number($dataStates[stateId].meta.always):0;
			
			if( $gameParty.members()[i]._stateTurns[stateId] > 0){
				if(needUpdate != 1) $gameParty.members()[i]._stateTurns[stateId] -- ;
			}else{
				$gameParty.members()[i]._stateTurns[stateId] = 0 ;
				$gameParty.members()[i].removeState(stateId);
			}
		};
	};
	for( i = 0 ; i < $gameMap.events().length ; i ++ ){
		var theEvent = $gameMap.events();
		if(theEvent[i]._battler){
			for( j = 0 ; j < theEvent[i]._battler._states.length ; j ++ ){
				var stateId = theEvent[i]._battler._states[j];
				var needUpdate = $dataStates[stateId].meta.always;
				
				if( theEvent[i]._battler._stateTurns[stateId] > 0){
					if(needUpdate != 1) {
						theEvent[i]._battler._stateTurns[stateId] -- ;
					}
				}else{
					theEvent[i]._battler._stateTurns[stateId] = 0 ;
					theEvent[i]._battler.removeState(stateId);
				};
			};
		};
	};
};


Scene_Map.prototype.updateFollowers = function(){
	for( i = 0 ; i <  $gameParty.members().length ; i++ ){
		var follower = $gamePlayer._followers._data;
		var member = $gameParty.members()[i];
		var dataMember = $dataActors[member._actorId]
		if(i>=1){
			var distanceXtoPlayer = Math.abs(follower[i-1].x - $gamePlayer.x);
			var distanceYtoPlayer = Math.abs(follower[i-1].y - $gamePlayer.y);
		}else{
			var distanceX = 0;
			var distanceY = 0;
		}
		var disToBefX = 0;
		var disToBefY = 0;
		if( i > 0  && member ) {
			this.refreshFollowerGauge(sxlSimpleABS.followerGauges[i-1], follower[i-1]);
		}
		if( i > 1 && member ){
			var disToBefX = Math.abs(follower[i-1].x - follower[i-2].x);
			var disToBefY = Math.abs(follower[i-1].y - follower[i-2].y);
			var disToPX = Math.abs(follower[i-1].x - $gamePlayer.x);
			var disToPY = Math.abs(follower[i-1].y - $gamePlayer.y);
		}else if (i==1 && member) {
			var disToBefX = Math.abs(follower[i-1].x - $gamePlayer.x);
			var disToBefY = Math.abs(follower[i-1].y - $gamePlayer.y);
		}
		var range = $gameParty.members()[i].cnt * 100 + 1;
		if( i>0 && 
			$gameParty.members()[i]._hp > 0 && 
			!member.isStateAffected(1) &&  
			follower[i-1]._waitTime <= 0 && 
			follower[i-1]._stun <= 0 && 
			sxlSimpleItemList.canMove &&
			(!follower[i-1].target ||follower[i-1].target==-1) )
		{	
			var memberFollowRange = dataMember.meta.followRnage?
									Number(dataMember.meta.followRnage):15;
			if( (distanceXtoPlayer>memberFollowRange||
				distanceYtoPlayer>memberFollowRange)){
				const sx = follower[i-1].x - $gamePlayer.x;
				const sy = follower[i-1].y - $gamePlayer.y;
				follower[i-1].jump(-sx, -sy);
			};
			if( i >= 1 && (disToBefX == 0 && disToBefY == 0)){
				if( !follower[i-1].isMoving()) follower[i-1].moveRandom();
			}
			if( i > 1 && member && (disToPX == 0 && disToPY == 0)){
				if( !follower[i-1].isMoving()) follower[i-1].moveRandom();
			}
			if(distanceXtoPlayer > 2 || distanceYtoPlayer > 2){
				if( !follower[i-1].isMoving() ) follower[i-1].moveTowardPlayer();
			}else if (distanceXtoPlayer < 1 && distanceYtoPlayer < 1){
				if( !follower[i-1].isMoving() ) follower[i-1].moveAwayFromPlayer();
			}
			
		}
		if( i >= 1 && Input.isLongPressed( 't' ) ){
			const sx = follower[i-1].x - $gamePlayer.x;
			const sy = follower[i-1].y - $gamePlayer.y;
			follower[i-1].jump(-sx, -sy);
		}
		if( i>0 && $gameMap.events()[follower[i-1].target] 
			&& $gameParty.members()[i]._hp > 0
			&& !member.isStateAffected(1)
			&& $gameParty.members()[i].player.isAttack <= 0 
			&& (sxlSimpleItemList.canMove )){
			if( $gameMap.events()[follower[i-1].target] 
				&& $gameMap.events()[follower[i-1].target]._battler 
				&& follower[i-1]._waitTime <= 0 
				&& follower[i-1]._stun <= 0 ){
				var target = $gameMap.events()[follower[i-1].target];
				if($gameMap.events()[follower[i-1].target]){
					var targetX = target.x;
					var targetY = target.y;
				}
				var distanceX = Math.abs(follower[i-1].x - targetX);
				var distanceY = Math.abs(follower[i-1].y - targetY);
				var meta = $dataActors[member._actorId].meta;
				var metaVision = meta.vision ? Number( meta.vision ) : 1 ;
				var random = (Math.random() >= 0.5) ? 1 : -1 ;
				
				if( (distanceX <= Number( metaVision ) && distanceY <= Number( metaVision )) && 
				(target._battler && target._battler._hp>0 && !target._battler.isStateAffected(1))){
					if( distanceX < range && distanceY < range && i != 0 ){
						if( !follower[i-1].isMoving() ) follower[i-1].moveAwayFromCharacter(target);
					}else if ( distanceX > range || distanceY > range && i != 0 ) {
						if( !follower[i-1].isMoving() ) follower[i-1].moveTowardCharacter(target);
					};
				};
				if( distanceX < 0 ){
					var canThrough = $gameMap.isPassable( follower[i-1].x - 1, follower[i-1].y, follower[i-1]._direction )
				}
				if( distanceX > 0 ){
					var canThrough = $gameMap.isPassable( follower[i-1].x + 1, follower[i-1].y, follower[i-1]._direction )
				}
				if( distanceY < 0 ){
					var canThrough = $gameMap.isPassable( follower[i-1].x ,follower[i-1].y - 1, follower[i-1]._direction )
				}
				if( distanceY > 0 ){
					var canThrough = $gameMap.isPassable( follower[i-1].x ,follower[i-1].y + 1, follower[i-1]._direction )
				}
				if( !target ||
					!target._battler ||
					target._battler._hp<=1 || 
					distanceX > Number( metaVision ) ||
					distanceY > Number( metaVision ) ||
					!canThrough
					){
					follower[i-1].target = null;
				}
			};
		};
	};
};

Scene_Map.prototype.updateEnemies = function(){
	for(let i = 0; i< $gameMap.events().length; i++){
		if($gameMap.events()[i]._battler) var dataEnemy = $dataEnemies[Number($gameMap.events()[i]._battler._enemyId)];
		if($gameMap.events()[i]._battler && sxlSimpleABS.gauges[i] && $dataEnemies[$gameMap.events()[i]._battler._enemyId].meta.bossGauge){
			this.refreshBossGauge(sxlSimpleABS.gauges[i], $gameMap.events()[i])
		}else{
			if($gameMap.events()[i]._battler && sxlSimpleABS.gauges[i]){
				this.refreshEnemiesGauge(sxlSimpleABS.gauges[i], $gameMap.events()[i]);
			}
		}
		if($gameMap.events()[i]._battler && $gameMap.events()[i]._battler._hp <= 1 ){
			if( !$gameMap.events()[i]._deadDeal || $gameMap.events()[i]._deadDeal == 0 ){
				this.touchAttackabkeEnemy = false
				var exp = $dataEnemies[ $gameMap.events()[i]._battler._enemyId ].exp
				this.refreshInformation();
				$gameMap.events()[i]._battler.addState[1];
				$gameMap.events()[i]._battler._hp = 0 ;
				$gameMap.events()[i]._deadDeal = 1 ;
				$gameSelfSwitches.setValue([$gameMap._mapId,$gameMap.events()[i]._eventId, 'D'], true);
			};
		};
		if($gameMap.events()[i]._battler){
			for(var state of $gameMap.events()[i]._battler._states){
				$gameMap.events()[i].vanish = false;
				$gameMap.events()[i]._opacity = 255;
				var stateData = $dataStates[state];
				if(stateData.meta.vanish){
					$gameMap.events()[i]._opacity = 0;
					$gameMap.events()[i].vanish = true;
					break;
				}
			}
		}
		
		if( $gameMap.events()[i]._waitTime == 0 && 
			$gameMap.events()[i]._stun == 0 ){
			if($gameMap.events()[i]._battler && 
				$gameMap.events()[i]._battler._aggro && sxlSimpleItemList.canMove ){
				var range = $gameMap.events()[i]._battler.cnt*100 + 1;
				var theGoal = $gameMap.events()[i]._battler._aggro[0];
				if( theGoal ){
					var goalActor = theGoal == $gamePlayer?
									$gameParty.members()[0]:$gameParty.members()[theGoal._memberIndex];
					var distanceX = Math.abs($gameMap.events()[i].x - theGoal.x);
					var distanceY = Math.abs($gameMap.events()[i].y - theGoal.y);
					if( goalActor &&
						!$gameMap.events()[i].isMoving() && 
						$gameMap.events()[i]._battler._hp > 0 &&
						!goalActor.player.vanish ){
						if( distanceX > range || distanceY > range ){
							$gameMap.events()[i]._moveFrequency = 5;
							if(!dataEnemy.meta.cantMove && !$gameMap.events()[i].locked ) $gameMap.events()[i].moveTowardCharacter(theGoal);
						}else if( distanceX < range && distanceY < range ){
							$gameMap.events()[i]._moveFrequency = 5;
							if(!dataEnemy.meta.cantMove && !$gameMap.events()[i].locked) $gameMap.events()[i].moveAwayFromCharacter(theGoal);
						};
					}else if( goalActor && ( goalActor._hp<=0 || goalActor.player.vanish) ){
						$gameMap.events()[i]._moveFrequency = 5;
						$gameMap.events()[i]._battler._aggro.splice( 0, 1 );
					};
				};
			};
		};
	};
};

Scene_Map.prototype.updateAggro = function(){
	for( j = 0 ; j < $gameMap.events().length ; j ++ ){
		for( i = 0 ; i < $gameParty.members().length ; i ++ ){
			if( i == 0 ){
				var targetX = $gamePlayer.x;
				var targetY = $gamePlayer.y;
				var target = $gamePlayer;
			}else{
				var targetX = $gamePlayer._followers._data[ i - 1 ].x;
				var targetY = $gamePlayer._followers._data[ i - 1 ].y; 
				var target = $gamePlayer._followers._data[ i - 1 ];
			};
			if( $gameMap.events()[j]._battler && !target.vanish ){
				var userX = $gameMap.events()[j].x;
				var userY = $gameMap.events()[j].y;
				var distanceToTargetX = Math.abs(userX - targetX);
				var distanceToTargetY = Math.abs(userY - targetY);
				var dataEnemy = $dataEnemies[ $gameMap.events()[j]._battler._enemyId ];
				var vision = dataEnemy.meta.vision ? Number( dataEnemy.meta.vision ) : 5 ;
				if($gameMap.events()[j]._battler._hp <= 0 || $gameMap.events()[j]._battler.isStateAffected(1)){
					$gameMap.events()[j]._battler._aggro = [];
				}
				if( distanceToTargetX < vision && distanceToTargetY < vision ){
					if( !$gameMap.events()[j]._battler._aggro ){
						$gameMap.events()[j]._battler._aggro = [];
					}
					if(!$gameMap.events()[j]._battler._aggro.includes(target)){
						$gameMap.events()[j]._battler._aggro.push( target ) ;
						target._tgr += 10 ;
					}
					target._tgr += 0.1 ;
				};
			};
		};
	};
};

Scene_Map.prototype.updateDamageWord = function(){
	if(this.damageWord){
		for(let i = 0; i < sxlSimpleABS.damages.length; i++){
			if(sxlSimpleABS.damages.length>sxlSimpleABS.maxDamageAmount){
				sxlSimpleABS.damages[0].bitmap.clear();
				sxlSimpleABS.damages.splice(0,1);
				sxlSimpleABS.damagesTarget.splice(0,1);
			}
			if(sxlSimpleABS.damageWordType == 0){
				if(sxlSimpleABS.damages[i]){
					if(!sxlSimpleABS.damages[i].modifyY){
						sxlSimpleABS.damages[i].modifyY = 0;
						if(!sxlSimpleABS.damages[i].item){
							sxlSimpleABS.damages[i].scale.x = 0.6
							sxlSimpleABS.damages[i].scale.y = 0.6;
						}
					};
					sxlSimpleABS.damages[i].modifyY ++;
					if(sxlSimpleABS.damages[i].item){
						if(sxlSimpleABS.damages[i].modifyY < 30 ){
							sxlSimpleABS.damages[i].y = sxlSimpleABS.damagesTarget[i].screenY() - 128 ;
							sxlSimpleABS.damages[i].x = sxlSimpleABS.damagesTarget[i].screenX();
							if(sxlSimpleABS.damages[i].scale.x > 1.3) sxlSimpleABS.damages[i].scale.x -= 0.3;
							if(sxlSimpleABS.damages[i].scale.y > 1.3) sxlSimpleABS.damages[i].scale.y -= 0.3;
							sxlSimpleABS.damages[i].opacity += 30 ;
						}else{
							sxlSimpleABS.damages[i].y -= sxlSimpleABS.damages[i].modifyY/10 ;
							sxlSimpleABS.damages[i].x = sxlSimpleABS.damagesTarget[i].screenX;
							sxlSimpleABS.damages[i].opacity -= 5
						}
					}else{
						if(sxlSimpleABS.flyDamageWord>0){
							if(sxlSimpleABS.damages[i].modifyY < 15 ){
								sxlSimpleABS.damages[i].scale.x += 0.06;
								sxlSimpleABS.damages[i].scale.y += 0.06;
								// sxlSimpleABS.damages[i].y = sxlSimpleABS.damagesTarget[i].screenY() - 128 ;
								sxlSimpleABS.damages[i].x += (sxlSimpleABS.damages[i].randomDelta-0.5)*sxlSimpleABS.flyDamageWord;
								sxlSimpleABS.damages[i].y -= (15-sxlSimpleABS.damages[i].modifyY);
								sxlSimpleABS.damages[i].opacity += 60 ;
							}else{
								sxlSimpleABS.damages[i].scale.x -= 0.06;
								sxlSimpleABS.damages[i].scale.y -= 0.06;
								sxlSimpleABS.damages[i].y += (sxlSimpleABS.damages[i].modifyY-15) ;
								sxlSimpleABS.damages[i].x += (sxlSimpleABS.damages[i].randomDelta-0.5)*sxlSimpleABS.flyDamageWord;
								sxlSimpleABS.damages[i].opacity -= 15;
							}
						}else{
							if(sxlSimpleABS.damages[i].modifyY < 30 ){
								sxlSimpleABS.damages[i].y = sxlSimpleABS.damagesTarget[i].screenY() - 128 ;
								sxlSimpleABS.damages[i].x = sxlSimpleABS.damagesTarget[i].screenX();
								if(sxlSimpleABS.damages[i].scale.x > 1.3) sxlSimpleABS.damages[i].scale.x -= 0.3;
								if(sxlSimpleABS.damages[i].scale.y > 1.3) sxlSimpleABS.damages[i].scale.y -= 0.3;
								sxlSimpleABS.damages[i].opacity += 30 ;
							}else{
								sxlSimpleABS.damages[i].y -= sxlSimpleABS.damages[i].modifyY/10 ;
								sxlSimpleABS.damages[i].x = sxlSimpleABS.damagesTarget[i].screenX;
								sxlSimpleABS.damages[i].opacity -= 5
							}
						}
						

					}
					
					if( sxlSimpleABS.damages[i].opacity <= 0 ){
						sxlSimpleABS.damages[i].bitmap.clear();
						sxlSimpleABS.damages.splice(i,1);
						sxlSimpleABS.damagesTarget.splice(i,1);
					} ;
				}
			};
			if(sxlSimpleABS.damageWordType == 1){
				if( sxlSimpleABS.damages[i-1] && sxlSimpleABS.damages[i-1].target == sxlSimpleABS.damages[i].target){
					sxlSimpleABS.damages[i-1].y = sxlSimpleABS.damages[i].y - sxlSimpleABS.damages[i-1].modifyY/60-16 ;
				}
				if(sxlSimpleABS.damages[i]){
					if(!sxlSimpleABS.damages[i].modifyY){
						sxlSimpleABS.damages[i].modifyY = 0;
						sxlSimpleABS.damages[i].scale.x = 1
						sxlSimpleABS.damages[i].scale.y = 1;
					};
					sxlSimpleABS.damages[i].modifyY ++;
					// if(sxlSimpleABS.damages[i-1]){
					// 	sxlSimpleABS.damages[i-1].opacity -= 5;
					// }
					if(sxlSimpleABS.damages[i].modifyY < 15 ){
						sxlSimpleABS.damages[i].y = sxlSimpleABS.damagesTarget[i].screenY()-96 ;
						sxlSimpleABS.damages[i].x = sxlSimpleABS.damagesTarget[i].screenX();
						sxlSimpleABS.damages[i].opacity += 255 ;
					}else{
						sxlSimpleABS.damages[i].y -= sxlSimpleABS.damages[i].modifyY/60 ;
						sxlSimpleABS.damages[i].x = sxlSimpleABS.damagesTarget[i].screenX();
						sxlSimpleABS.damages[i].opacity -= 5;
					}
					
					if( sxlSimpleABS.damages[i].opacity <= 0 ){
						sxlSimpleABS.damages[i].bitmap.clear();
						sxlSimpleABS.damages.splice(i,1);
						sxlSimpleABS.damagesTarget.splice(i,1);
					} ;

				}
			}
			
			
		};
	};
};


Scene_Map.prototype.updateAura = function(){
	for( i = 0 ; i < $gameParty.members().length ; i ++ ){
		var auraUserX = $gameParty.members()[i].player.x;
		var auraUserY = $gameParty.members()[i].player.y;
		$gameParty.members()[i].player.auraLight = null;
		$gameParty.members()[i].player.auraImg = null;
		$gameParty.members()[i].player.auraRange = 0;
		
		for( k in $gameParty.members()[i].skills() ){
			if ($gameParty.members()[i].skills()[k].meta.addState) {
				$gameParty.members()[i].addState(Number($gameParty.members()[i].skills()[k].meta.addState));
			}
			if($gameParty.members()[i].skills()[k].meta.aura){
				$gameParty.members()[i].auraSkill = Number($gameParty.members()[i].skills()[k].meta.aura)
				let meta = $gameParty.members()[i].skills()[k].meta;
				let auraImg = meta.auraImg?meta.auraImg:null;
				let auraRange = meta.auraRange?Number(meta.auraRange):0;
				if(auraImg){
					$gameParty.members()[i].player.auraImg = auraImg;
				}
				if(meta.auraLight){
					$gameParty.members()[i].player.auraLight = meta.auraLight;
				}
				if(meta.auraLight){
					$gameParty.members()[i].player.auraRange = meta.auraRange;
				}
				if( meta.auraRange && Number(meta.auraRange)>0 && auraImg ){
					
				}
				$gameParty.members()[i].auraRange = auraRange;
				var theUserActor = $gameParty.members()[i];
			}
		}
		for( j = 0 ; j < $gameParty.members().length ; j ++ ){
			if(theUserActor){
				let auraAffectX = $gameParty.members()[j].player.x;
				let auraAffectY = $gameParty.members()[j].player.y;
				let auraStateId = Number(theUserActor.auraSkill);
				let distanceX = Math.abs(auraUserX - auraAffectX);
				let distanceY = Math.abs(auraUserY - auraAffectY);
				let auraRangeCalc = theUserActor.auraRange;
				if( distanceX <= auraRangeCalc && distanceY <= auraRangeCalc){
					$gameParty.members()[j].addState(auraStateId);
				}
			}
		}
	};
	
	for( i in $gameMap.events() ){
		
		if( $gameMap.events()[i]._battler ){
			if( $gameMap.events()[i]._battler._hp > 0 && 
				$dataEnemies[$gameMap.events()[i]._battler._enemyId].meta.aura){
				let meta = $dataEnemies[$gameMap.events()[i]._battler._enemyId].meta.aura.split(',');
				let auraImg =  meta[0];
				let auraStateId = Number(meta[1]);
				let auraRange =  Number(meta[2])||2;
				$gameMap.events()[i].auraImg = auraImg;
				$gameMap.events()[i].auraRange = auraRange;
				$gameMap.events()[i]._battler.auraState = auraStateId;
				$gameMap.events()[i]._battler.auraRange = auraRange;
				var theUser = $gameMap.events()[i];
			}
		}
	};
	for( j in $gameMap.events() ){
		if($gameMap.events()[j]._battler && theUser){
			let auraAffectX = $gameMap.events()[j].x;
			let auraAffectY = $gameMap.events()[j].y;
			let distanceX = Math.abs(theUser.x - auraAffectX);
			let distanceY = Math.abs(theUser.y - auraAffectY);
			let auraRangeCalc = theUser._battler.auraRange;
			if(	distanceX <= auraRangeCalc && distanceY <= auraRangeCalc ){
				$gameMap.events()[j]._battler.addState(theUser._battler.auraState);

			}
		}
	}
};


Scene_Map.prototype.updateParticles = function(){
	
};

Scene_Map.prototype.clearFollower = function(){
	for( i = 0 ; i < $gameParty.members().length ; i ++ ){
		var fid = $gameParty.members()[i].followerId;
		var char = (fid == -1?
					$gamePlayer : $gamePlayer._followers._data[fid]);

		if( !$gameParty.members()[i].isStateAffected(1) && $gameParty.members()[i]._hp > 0 ){
			char._characterName = $dataActors[$gameParty.members()[i]._actorId].characterName;
			char._characterIndex = $dataActors[$gameParty.members()[i]._actorId].characterIndex;
			// char._directionFix = false;

			$gameParty.members()[i]._deathDeal = 0 ;
		};
		if( $gameParty.members()[i].isStateAffected(1) && $gameParty.members()[i]._hp <= 0 ){
			$gameParty.members()[i].addState(1);
			$gameParty.members()[i]._hp = 0 ;
			var _character = i == 0 ? $gamePlayer : $gamePlayer._followers._data[ i - 1 ];
			var actor = $gameParty.members()[i];
			var weapon = $dataWeapons[actor._equips[0]._itemId];
			var follower = $gamePlayer._followers._data;
			var actorData = $dataActors;
			var deathCharacter = actorData[actor._actorId].meta.deathImg?
								 actorData[actor._actorId].meta.deathImg : '$CommonDeath' ;
			var deathIndex = actorData[actor._actorId].meta.deathIndex?
							 actorData[actor._actorId].meta.deathIndex : 0 ;
			var deathDirection = actorData[actor._actorId].meta.deathDirection?
								 actorData[actor._actorId].meta.deathDirection : 2 ;
			follower[ i - 1 ]._direction = deathDirection;
			// follower[ i - 1 ]._directionFix = true ;
			follower[ i - 1 ]._characterName = deathCharacter;
			follower[ i - 1 ]._characterIndex = deathIndex;
			actor.addState(1);
			actor._deathDeal = 1 ;
		};
	};	
};

Scene_Map.prototype.updateDestinationColor = function(){
	var destinationX = $gameTemp.destinationX();
	var destinationY = $gameTemp.destinationY();
	var playerX = $gamePlayer.x;
	var playerY = $gamePlayer.y;
	var user = $gameParty.members()[0];
	var skill = $dataSkills[ user.attackSkillId() ]
	var skillDistanceMeta = skill.meta.distance?Number(skill.meta.distance):1;
	var attackDistance = user.cnt*100+skillDistanceMeta;
	var distanceToDestinationX = Math.abs( playerX - destinationX );
	var distanceToDestinationY = Math.abs( playerY - destinationY );
	var skillRange = skill.meta.range?
					Number(skill.meta.range):1;
	if( distanceToDestinationX <= attackDistance &&
		distanceToDestinationY <= attackDistance){
		sxlSimpleABS.destinationColor = 'destination_activate';
		if( sxlSimpleABS.destination ){
			sxlSimpleABS.destination.scale.x = sxlSimpleABS.destination._frameCount/30 + skillRange ;
			sxlSimpleABS.destination.scale.y = sxlSimpleABS.destination.scale.x;
		}
	}else{
		sxlSimpleABS.destinationColor = 'destination_normal';
		if( sxlSimpleABS.destination ){
			sxlSimpleABS.destination.scale.x = sxlSimpleABS.destination._frameCount/30 + skillRange ;
			sxlSimpleABS.destination.scale.y = sxlSimpleABS.destination.scale.x;
		}
	}
};



// ==============================================================================================================
// 
// 		Map_Update 地图攻击类
// 
// ==============================================================================================================

Scene_Map.prototype.commonAttack = function(){
	var usersArray = [];
	var targetArray = [];
	if( $gamePlayer._waitTime < 1 && 
		sxlSimpleABS.moveAttackMode == true && 
		(!$gamePlayer.delaySkill || $gamePlayer.delaySkill.length == 0 ) && //没有后续技能才可使用 
		$gameParty.members()[0]._tp>=100 && 
		TouchInput.isPressed() && 
		sxlSimpleItemList._isMoveable  ){
		$gamePlayer.delaySkill = [];
		var userMember = $gameParty.members()[0];
		$gameParty.members()[0]._tp -= 100;
		for( theEquip in userMember.equips()){

			if(userMember.equips()[theEquip].meta.triggerSkill){
				var random = Math.random();
				var randomSkills = []
				var split = userMember.equips()[theEquip].meta.triggerSkill.split(',')
				var chance = split[0];
				for( theSkill = 1 ; theSkill < split.length ; theSkill ++ ){
					randomSkills.push(split[theSkill]);
				}
				var randomSkillId = Math.floor(Math.random()*randomSkills.length);
				if( random <= chance ){
					this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],$dataSkills[Number(randomSkills[randomSkillId])]);
				}
			}
		}
		var xDist = TouchInput.x - $gamePlayer.screenX();
		var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
		var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
		if(sxlSimpleABS._2direction == true){
			if(TouchInput.x <= $gamePlayer.screenX()){
				$gamePlayer._direction=2;
			}else{
				$gamePlayer._direction=4;
			}
		}else{
			if(angle>112.5&&angle<157.5){
				$gamePlayer._direction8dir=1;
			}else if(angle>22.5&&angle<67.5){
				$gamePlayer._direction8dir=3;
			}else if(angle>-67.5&&angle<-22.5){
				$gamePlayer._direction8dir=9;
			}else if(angle>-157.7&&angle<-112.5){
				$gamePlayer._direction8dir=7;
			}else{
				$gamePlayer._direction8dir = $gamePlayer._direction;
			}
		}
		this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0], $dataSkills[ $gameParty.members()[0].attackSkillId() ])
		if($dataSkills[$gameParty.members()[0].attackSkillId()].meta.jump) $gamePlayer.jump(0,0,15)
		
	}
	if( $gamePlayer._waitTime < 1 && 
		// sxlSimpleABS.moveAttackMode == true && 
		TouchInput.isCancelled() && 
		(!$gamePlayer.delaySkill || $gamePlayer.delaySkill.length == 0 ) && //没有后续技能才可使用 
		sxlSimpleItemList._isMoveable  ){
		var userMember = $gameParty.members()[0];
		var xDist = TouchInput.x - $gamePlayer.screenX();
		var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
		var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
		if(sxlSimpleABS._2direction == true){
			if(TouchInput.x <= $gamePlayer.screenX()){
				$gamePlayer._direction=2;
			}else{
				$gamePlayer._direction=4;
			}
		}else{
			if(angle>112.5&&angle<157.5){
				$gamePlayer._direction8dir=1;
			}else if(angle>22.5&&angle<67.5){
				$gamePlayer._direction8dir=3;
			}else if(angle>-67.5&&angle<-22.5){
				$gamePlayer._direction8dir=9;
			}else if(angle>-157.7&&angle<-112.5){
				$gamePlayer._direction8dir=7;
			}else{
				$gamePlayer._direction8dir = $gamePlayer._direction;
			}
		}
		if(this.rightClickSkill){
			$gamePlayer.delaySkill = [];
			this.useSCItem(this.rightClickSkill);
			
		}
		
	}
	
	for(let i in $gameMap.events()){
		if($gameMap.events()[i]._battler && $gameMap.events()[i]._battler._hp > 0 && 
			(sxlSimpleItemList.canMove)){
			for(let j = 0 ; j < $gameParty.members().length ; j++){
				var user = $gameParty.members()[j];
				var target = $gameMap.events()[i];

				var skill = $dataSkills[ user.attackSkillId() ]
				var userChar = ( j == 0?
								 $gamePlayer:
								 $gamePlayer._followers._data[ j - 1 ]);
				var distanceX = Math.abs(userChar.x - target.x);
				var distanceY = Math.abs(userChar.y - target.y);
				let enemyBoxL = target.screenX()-64;
				let enemyBoxR = target.screenX()+64;
				let enemyBoxT = target.screenY()-64;
				let enemyBoxB = target.screenY()+64;
				var skillDistanceMeta = skill.meta.distance?Number(skill.meta.distance):1;
				var skillDistance = user.cnt * 100 + skillDistanceMeta ;
				var skillRange = (	skill.meta.range?
									Number(skill.meta.range) : 1 );
				var castAnim = ( skill.meta.castAnim?
								 Number(skill.meta.castAnim) : 0 );
				var aimAnim = ( skill.meta.aimAnim?
								 Number(skill.meta.aimAnim) : 0 );
				var skillCast = skill.meta.cast?
								Number(skill.meta.cast):0;
				if(sxlSimpleABS.moveAttackMode == true){
					if( j != 0 && this.canAttack(target,skillDistance,distanceX,distanceY,user,userChar ) ) {	
						if( target._battler && target._battler._hp>1 )userChar.target = i;
						userChar.rushCount = 0;
						var xDist = TouchInput.x - $gamePlayer.screenX();
						var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
						var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
						
						if( skill.meta.attackStateNotarget ){
							$gameParty.members()[j].addState( Number(skill.meta.attackStateNotarget) )
						};
						if( skill.meta.removeStateNotarget ){
							$gameParty.members()[j].removeState( Number(skill.meta.removeStateNotarget) );
						};
						if(userChar._waitTime == 0) {
							targetArray.push( target )
							usersArray.push( userChar );
							if( aimAnim != 0 ){
								var sacle = $dataAnimations[ aimAnim ].scale;
								$dataAnimations[ aimAnim ].scale = skillRange * 100 ;
								$gameTemp.requestAnimation( targetArray , aimAnim , false );
							};
							$gameTemp.requestAnimation( usersArray , castAnim , false );
							
							if( aimAnim != 0 ){
								$dataAnimations[ aimAnim ].scale = sacle;
							};
							userChar._waitTime = user.castSpeed*skillCast;
							usersArray = [];
							userChar.isAttack = skill.meta.poseTime?Numebr(skill.meta.poseTime):0;
							userChar.waitForMotion = userChar.isAttack;
							if(skill.meta.canMove){
								userChar.waitForMotion = 0;
							}
							this.skillPose(skill,userChar);
						};
						if(userChar._waitTime <= 1 && userChar.isAttack >= 0 ){
							if(skill.meta.skillSound){
								var allParam = skill.meta.skillSound.split(',')
								var _name = String(allParam[0]);
								var _volume = Number(allParam[1])||90;
								var _pitch = Number(allParam[2])||100;
								AudioManager.playSe({name:_name,volume:_volume,pitch:_pitch})
							}

							userChar.isAttack = sxlSimpleABS.weaponSwingTime;
							userChar.waitForMotion = userChar.isAttack;
							if(skill.meta.canMove){
								userChar.waitForMotion = 0;
							}
							if(skill.meta.moveRush) this.rush( user, target, Number(skill.meta.moveRush) )
							if(skill.meta.moveBack) this.moveBack( user, target, Number(skill.meta.moveBack) )
							if(skill.meta.jump) userChar.jump(0,0,15)
							$gameParty.members()[j]._tp -= 100;
							userChar.turnTowardCharacter(target);
							// sxlSimpleABS.weaponSpritesUser.push(userChar);
							// this.createWeaponSprite(userChar,j-1);
							// userChar.jump(0,0);
							if($dataSkills[$gameParty.members()[j].attackSkillId()].meta.img){
								sxlSimpleABS.spritesetMap.createParticle($gameParty.members()[j].player , $gameMap.events()[i], 'player', skill);
							}else{
								this.playersAttack($gameMap.events()[i], $gameParty.members()[j], j-1,skill);
							};
							sxlSimpleABS.castAnimation = [];
							if( skill.meta.nextSkill ){
								var nextSkill = $dataSkills[Number(skill.meta.nextSkill)]
								if(nextSkill.meta.noTarget){
									this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],nextSkill)
								}else{
									this.triggerSkill($gamePlayer,$gameParty.members()[0],$gameMap.events()[i],$gameMap.events()[i]._battler,nextSkill)
								}
							}
						}
					}
				}
				
				if(sxlSimpleABS.moveAttackMode == false){
					if( TouchInput.x >= enemyBoxL && TouchInput.x <= enemyBoxR &&
						TouchInput.y >= enemyBoxT && TouchInput.y <= enemyBoxB){
						sxlSimpleABS.target = target;
					}
					if( TouchInput.isHovered()){
						sxlSimpleABS.target = null;
					}
					

					if( this.canAttackOnlyDist(target,skillDistance,distanceX,distanceY,user ) &&
						TouchInput.x >= enemyBoxL && TouchInput.x <= enemyBoxR &&
						TouchInput.y >= enemyBoxT && TouchInput.y <= enemyBoxB ){
						this.touchAttackabkeEnemy = true ;
						$gameTemp.requestAnimation([target],126)
						}else{
							this.touchAttackabkeEnemy = false ;
						}
					
						if( (j == 0 && TouchInput.isPressed() &&
							TouchInput.x >= enemyBoxL && TouchInput.x <= enemyBoxR &&
							TouchInput.y >= enemyBoxT && TouchInput.y <= enemyBoxB &&
							this.canAttack(target,skillDistance,distanceX,distanceY,user,userChar ) ) ||
							(j != 0 &&this.canAttack(target,skillDistance,distanceX,distanceY,user,userChar) ) )
						{	
							if( target._battler && target._battler._hp>1 )userChar.target = target;
							userChar.rushCount = 0;
							var xDist = TouchInput.x - $gamePlayer.screenX();
							var yDist = TouchInput.y - ($gamePlayer.screenY()-24);
							var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
							if(angle>45&&angle<135){
								$gamePlayer._direction=2;
							}else if(angle>-45&&angle<45){
								$gamePlayer._direction=6;
							}else if(angle>-135&&angle<-45){
								$gamePlayer._direction=8;
							}else{
								$gamePlayer._direction=4;
							}
							if(skill.meta.skillSound){
								var allParam = skill.meta.skillSound.split(',')
								var _name = String(allParam[0]);
								var _volume = Number(allParam[1])||90;
								var _pitch = Number(allParam[2])||100;
								AudioManager.playSe({name:_name,volume:_volume,pitch:_pitch})
							}
							if( skill.meta.attackStateNotarget ){
								$gameParty.members()[j].addState( Number(skill.meta.attackStateNotarget) )
							};
							if( skill.meta.removeStateNotarget ){
								$gameParty.members()[j].removeState( Number(skill.meta.removeStateNotarget) );
							};
							if(userChar._waitTime == 0) {
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
								userChar._waitTime = user.castSpeed/$gameParty.members()[j].agi*skillCast;
								usersArray = [];
								userChar.isAttack = skill.meta.poseTime?Numebr(skill.meta.poseTime):0;
								userChar.waitForMotion = userChar.isAttack;
								if(skill.meta.canMove){
									userChar.waitForMotion = 0;
								}
								this.skillPose(skill,userChar);
							};
							if(userChar._waitTime <= 1 && userChar.isAttack >= 0 ){
								userChar.isAttack = sxlSimpleABS.weaponSwingTime;
								userChar.waitForMotion = userChar.isAttack;
								if(skill.meta.canMove){
									userChar.waitForMotion = 0;
								}
								if(skill.meta.moveRush) this.rush( user, target, Number(skill.meta.moveRush) )
								if(skill.meta.moveBack) this.moveBack( user, target, Number(skill.meta.moveBack) )
								if(skill.meta.jump) userChar.jump(0,0,15)
								$gameParty.members()[j]._tp -= 100;
								userChar.turnTowardCharacter(target);
								// sxlSimpleABS.weaponSpritesUser.push(userChar);
								// this.createWeaponSprite(userChar,j-1);
								// userChar.jump(0,0);
								if($dataSkills[$gameParty.members()[j].attackSkillId()].meta.img){
									sxlSimpleABS.spritesetMap.createParticle($gameParty.members()[j].player , $gameMap.events()[i], 'player', skill);
								}else{
									this.playersAttack($gameMap.events()[i], $gameParty.members()[j], j-1,skill);
								};
								sxlSimpleABS.castAnimation = [];
								if( skill.meta.nextSkill ){
									var nextSkill = $dataSkills[Number(skill.meta.nextSkill)]
									if(nextSkill.meta.noTarget){
										this.triggerSkillnoTarget($gamePlayer,$gameParty.members()[0],nextSkill)
									}else{
										this.triggerSkill($gamePlayer,$gameParty.members()[0],$gameMap.events()[i],$gameMap.events()[i]._battler,nextSkill)
									}
								}
							}
						}
					if( skill.meta.delaySkill ){
						if(!userChar.delaySkill) userChar.delaySkill=[];
						var delaySkill = $dataSkills[Number(skill.meta.delaySkill)]
						userChar.delaySkill.push(delaySkill);
					}
					userChar.isAttack = 0;
					userChar.waitForMotion = 0;
				};
			};
		};
	};	
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


Scene_Map.prototype.enemyAction = function(){
	for(let i in $gameMap.events()){
		if($gameMap.events()[i]._battler && 
			$gameMap.events()[i]._battler._hp > 0 && 
			$gameMap.events()[i]._stun == 0){
			for(j = 0 ; j < $gameParty.members().length ; j ++){
				var user = $gameMap.events()[i]._battler
				var userChar = $gameMap.events()[i];
				var userData = $dataEnemies[user._enemyId];
				$gameMap.events()[i]._battler.eactionsArray = userData.actions;
				var actionRateMax = 0;
				$gameMap.events()[i]._battler.canUseAction = [];
				var userHpRate = user._hp/user.mhp;
				var userMpRate = user._mp/user.mmp;
				for( action in $gameMap.events()[i]._battler.eactionsArray ){
					if( $gameMap.events()[i]._battler.eactionsArray[action].conditionType == 0 ||
						( $gameMap.events()[i]._battler.eactionsArray[action].conditionType == 2 && (userHpRate >= $gameMap.events()[i]._battler.eactionsArray[action].conditionParam1 && userHpRate <= $gameMap.events()[i]._battler.eactionsArray[action].conditionParam2))||
						( $gameMap.events()[i]._battler.eactionsArray[action].conditionType == 3 && (userMpRate >= $gameMap.events()[i]._battler.eactionsArray[action].conditionParam1 && userMpRate <= $gameMap.events()[i]._battler.eactionsArray[action].conditionParam2))||
						( $gameMap.events()[i]._battler.eactionsArray[action].conditionType == 4 && user.isStateAffected($gameMap.events()[i]._battler.eactionsArray[action].conditionParam1))||
						( $gameMap.events()[i]._battler.eactionsArray[action].conditionType == 5 && $gameParty.members()[0]._level>=$gameMap.events()[i]._battler.eactionsArray[action].conditionParam1)||
						( $gameMap.events()[i]._battler.eactionsArray[action].conditionType == 6 && $gameSwitches.value($gameMap.events()[i]._battler.eactionsArray[action].conditionParam1))){
						$gameMap.events()[i]._battler.canUseAction.push($gameMap.events()[i]._battler.eactionsArray[action]);
					}
				}
				var skill = $dataSkills[user.attackSkillId()];
				for( action in $gameMap.events()[i]._battler.canUseAction ){
					var actionRateRandom = Math.random()*9;
					if(actionRateRandom<=$gameMap.events()[i]._battler.canUseAction[action].rating){
						skill = $dataSkills[$gameMap.events()[i]._battler.canUseAction[action].skillId];
					}
				};
				userChar.rushCount = 0;
				var playerTeam = $gameParty.members()[j].player;
				var skillCast = skill.meta.cast?
								Number(skill.meta.cast):1;
				let distanceX = Math.abs(playerTeam.x - $gameMap.events()[i].x);
				let distanceY = Math.abs(playerTeam.y - $gameMap.events()[i].y);
				var skillDistanceMeta = skill.meta.distance?Number(skill.meta.distance):1;
				var skillDistance = user.cnt * 100 + skillDistanceMeta ;
				if( distanceX <= skillDistance && 
					distanceY <= skillDistance && 
					$gameMap.events()[i]._battler._tp >= 100 &&
					$gameParty.members()[j]._hp >= 0 &&
					!$gameParty.members()[j].isStateAffected(1) &&
					!$gameParty.members()[j].player.vanish)
					{
						
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
				};
			};
		};
	};
};


Scene_Map.prototype.canAttack = function(target, attackRange, distanceX, distanceY, user, userChar){
	if( distanceX <= attackRange && 
		distanceY <= attackRange &&
		user._tp >= 100 && 
		user._hp >= 1 &&
		userChar._stun == 0){
		return true;
	};
};

Scene_Map.prototype.canAttackOnlyDist = function(target, attackRange, distanceX, distanceY, user){
	var userChar = $gameParty.members()[0].player;
	if( distanceX <= attackRange && 
		distanceY <= attackRange ){
		return true;
	};
};

Scene_Map.prototype.skillPose = function(skill,userChar){
	if(skill.meta.pose){
		if(skill.meta.pose == 'random'){
			var randomPose = Math.random();
			if(randomPose<0.33){
				userChar.pose = 'swingUp';
			}else if(randomPose>=0.33 && randomPose<0.66){
				userChar.pose = 'swingDown';
			}else{
				userChar.pose = 'thrust';
			}
		}
		if(skill.meta.pose == 'swingUp'){
			userChar.pose = 'swingUp';
		}
		if(skill.meta.pose == 'swingDown'){
			userChar.pose = 'swingDown';
		}
		if(skill.meta.pose == 'thrust'){
			userChar.pose = 'thrust';
		}
		if(skill.meta.pose == 'shoot'){
			userChar.pose = 'shoot';
		}
		if(skill.meta.pose == 'upAndDown'){
			if(userChar.pose == 'swingDown'){
				userChar.pose = 'swingUp';
			}else{
				userChar.pose = 'swingDown';
			}
		}
	}else{
		userChar.pose = 'swingDown';
	}
};



Scene_Map.prototype.playersAttack = function(target, user, userCharacter, skill){
	var isAffectedEnemies = [];
	var hpDamageNumber = 0;
	var result;
	var information;
	if(user){
		if(user.equips){
			var animation = skill.animationId == -1 ?
							user.equips()[0].animationId:skill.animationId;
		}else{
			var animation = skill.animationId == -1 ?
							1:skill.animationId;
		}
		var userFollower = user ==  $gameParty.members()[0]?
									$gamePlayer:user;
		
		
		isAffectedEnemies.push(target);
		if(isAffectedEnemies&&animation){
			$gameTemp.requestAnimation(isAffectedEnemies,animation,false);
		}
		
							
		var userChar = user.player;
		this.attackAffect(user, target, userChar, skill);
		hpDamageNumber = target._battler._result.hpDamage;
		result = target._battler._result;
		target._battler._hp -= hpDamageNumber;
		if(!target._battler.damageHp){
			target._battler.damageHp = hpDamageNumber;
		}else{
			target._battler.damageHp += hpDamageNumber;
			target._battler.storeDamageHp = hpDamageNumber;
		}
		if(result.critical){
			$gameTemp.requestAnimation(isAffectedEnemies,12,false);
		};

		if(user == $gameParty.members()[0] && sxlSimpleItemList.durabilityAllowed && !user.weapons()[0].meta.unbreakable && !skill.meta.noDurabilityConsume){
			var rn = Math.random();
			if(rn<(1*user.durabilityConsFreq)/sxlSimpleItemList.durabilityDecRate){
				$gameParty.durabilityWeapons[user.weapons()[0].id-1]--;
				if( $gameParty.durabilityWeapons[user.weapons()[0].id-1]<=0){
					var storeItem = user.weapons()[0];
					user.changeEquip(0, $dataWeapons[1]);
					$gameParty.durabilityWeapons[storeItem.id-1] = storeItem.meta.durability?Number(storeItem.meta.durability):100;
					$gameParty.loseItem(storeItem,1,true)
					
				}
			}
		}
	}
	
};

Scene_Map.prototype.enemiesAttack = function(target, user,skill){
	var isAffectedEnemies = [];
	var hpDamageNumber = 0;
	var result;
	if(skill){
		var animation = skill.animationId
	}else{
		if(user._battler){
			var animation = $dataSkills[user._battler.attackSkillId()].animationId;
		}else{
			var animation = $dataSkills[user.attackSkillId()].animationId;
		}
	}
	
	
	isAffectedEnemies.push(target);
	this.enemyAttackAffect(user._battler, target, skill);	
	if(target == $gamePlayer && $gameParty.members()[0]){
		result = $gameParty.members()[0]._result;
		hpDamageNumber = result.hpDamage;
		$gameParty.members()[0]._hp -= hpDamageNumber;
		$gameParty.members()[0].damageHp = hpDamageNumber;
		$gameParty.members()[0].storeDamageHp = hpDamageNumber;
	}else if (target && target._memberIndex && $gameParty.members()[target._memberIndex]){
		result = $gameParty.members()[target._memberIndex]._result;
		hpDamageNumber = result.hpDamage;
		$gameParty.members()[target._memberIndex]._hp -= hpDamageNumber;
		$gameParty.members()[target._memberIndex].damageHp = hpDamageNumber;
		$gameParty.members()[target._memberIndex].storeDamageHp = hpDamageNumber;
	}else{
		target = null ;
	}
	if(target){
		user.turnTowardCharacter(target);
		$gameTemp.requestAnimation(isAffectedEnemies,animation,false);
	}
	var etid = Math.floor(Math.random()*($gameParty.members()[0].equips().length-1));
	if(target == $gamePlayer && sxlSimpleItemList.durabilityAllowed && !$gameParty.members()[0].equips()[etid+1].meta.unbreakable){
		var rn = Math.random();

		if(rn<1*$gameParty.members()[0].durabilityConsFreq/sxlSimpleItemList.durabilityDecRate){
			$gameParty.durabilityArmors[$gameParty.members()[0].equips()[etid+1].id-1]--;
			if( $gameParty.durabilityArmors[$gameParty.members()[0].equips()[etid+1].id-1]<=0){
				var storeItem = $gameParty.members()[0].equips()[etid+1];
				$gameParty.durabilityArmors[storeItem.id-1] = storeItem.meta.durability?Number(storeItem.meta.durability):100;
				$gameParty.loseItem(storeItem,1,true)
				
			}
		}
	}
	
};

Scene_Map.prototype.hitBack = function(target, user, skill, forward ){
	if(user){
		if(user.player){
			var userChar = user.player;
		}else{
			var userChar = $gameMap.events()[user.eventId];
		}
		if(skill.meta.hitHeight){
			var height = Number(skill.meta.hitHeight);
		}else{
			var height = 1;
		}
		// target.turnTowardCharacter(userChar);
		var skillKnockBack = skill.meta.knockBack?Number( skill.meta.knockBack ):1;
		var userKnockBuff = user.mrf;
		if(target._memberIndex){
			if(target == $gamePlayer){
				var targetMember = $gameParty.members()[0]
			}else{
				var targetMember = $gameParty.members()[target._memberIndex]
			}
			var targetDistanceKB = targetMember.grd;
		}else{
			var targetDistanceKB = target._battler.grd;
		};
		
		var KBdistance = skillKnockBack + ( userKnockBuff * 100 + 1 ) - ( targetDistanceKB + 1 );
		if(KBdistance>0){
			// target.jump(0,0)
			if(userChar._direction == 2){
				var xChange = 0;
				for( i = 0 ; i < KBdistance ; i ++ ){
					if( $gameMap.isPassable(target.x,target.y+i) ){
						var yChange = i;
					}
				}
			}else if( userChar._direction == 4 ){
				var yChange = 0;
				for( i = 0 ; i < KBdistance ; i ++ ){
					if( $gameMap.isPassable(target.x-i,target.y) ){
						var xChange = -i;
					}
				}
			}else if( userChar._direction == 6 ){
				var yChange = 0;
				for( i = 0 ; i < KBdistance ; i ++ ){
					if( $gameMap.isPassable(target.x+i,target.y) ){
						var xChange = i;
					}
				}
			}else if( userChar._direction == 8 ){
				var xChange = 0;
				for( i = 0 ; i < KBdistance ; i ++ ){
					if( $gameMap.isPassable(target.x,target.y-i) ){
						var yChange = -i;
					}
				}
			};
			for(hitDist = 0 ; hitDist < KBdistance ; hitDist ++ ){
				// target.moveAwayFromCharacter( userChar );
			};
			if(isNaN(xChange)){xChange=0};
			if(isNaN(yChange)){yChange=0};
			// target.jump(xChange,yChange,height)
			target.kbAngle = Math.atan2((userChar.screenY()-target.screenY()), (userChar.screenX()-target.screenX()))*(180/Math.PI)+270;
			if(target.kbAngle<0){
				target.kbAngle=target.kbAngle+360;
			}
			if(target.kbAngle>=360){
				target.kbAngle=target.kbAngle-360;
			}
					
			for( i = 0 ; i < KBdistance ; i ++ ){
				target.dotMoveByDeg(target.kbAngle);
				// if(forward){
				// 	target.moveForward();
				// }else{
				// 	target.moveBackward();
				// }
				
			}
			
			target.turnTowardCharacter(userChar);
		}
	}
	
};

Scene_Map.prototype.hitHook = function(target, user, skill ){
	if(user.player){
		var userChar = user.player;
	}else{
		var userChar = $gameMap.events()[user.eventId];
	}
	
	target.turnTowardCharacter(userChar);
	var skillKnockBack = skill.meta.knockBack?Number( skill.meta.knockBack ):1;
	var userKnockBuff = user.mrf;
	if(target._memberIndex){
		if(target == $gamePlayer){
			var targetMember = $gameParty.members()[0]
		}else{
			var targetMember = $gameParty.members()[target._memberIndex]
		}
		var targetDistanceKB = targetMember.grd;
	}else{
		var targetDistanceKB = target._battler.grd;
	};
	var KBdistance = skillKnockBack + ( userKnockBuff * 100 + 1 ) - ( targetDistanceKB + 1 );
	target.jump(0,0,0)
	for(hitDist = 0 ; hitDist < KBdistance ; hitDist ++ ){
		target.moveTowardCharacter( userChar );
		
	};
	target.turnTowardCharacter(userChar);
};

Scene_Map.prototype.rush = function(user, target,distance ){
	if(target){

	}else{
		user.rushCount = distance;
	}
};

Scene_Map.prototype.moveBack = function(user, target,distance ){
	if(user.player){
		var userChar = user.player;
	}else{
		var userChar = $gameMap.events()[user.eventId];
	}
	if(!distance) distance = 3;
	userChar.turnTowardCharacter( target );
	userChar._moveSpeed += 2;
	for( i = 0 ; i < distance ; i++ ){
		userChar.moveAwayFromCharacter( target );
	}
	userChar._moveSpeed -= 2;
	userChar.turnTowardCharacter( target );
};

Scene_Map.prototype.attackAffect = function(user, target, userCharacter, skill){
	var userFix;
	var aggroFix;
	var information;
	var nextTargets = [];
	const action = new Game_Action(user);
	if(skill.effects){
		for( effect in skill.effects ){
			if(skill.effects[effect].code == 44){
				$gameTemp.reserveCommonEvent(skill.effects[effect].dataId);
			}
		}
	}
	for( theEnemyAarray = 0 ; theEnemyAarray < $gameMap.events().length ; theEnemyAarray ++ ){
		var targetX = target.x;
		var targetY = target.y;
		var distX = Math.abs( targetX - $gameMap.events()[theEnemyAarray].x );
		var distY = Math.abs( targetY - $gameMap.events()[theEnemyAarray].y );
		var skillRange = skill.meta.range?
						 skill.meta.range : 0;
		if(	target != $gameMap.events()[theEnemyAarray]
			&& distX <= skillRange 
			&& distY <= skillRange 
			&& $gameMap.events()[theEnemyAarray]._battler
			&& $gameMap.events()[theEnemyAarray]._battler._hp>1)
		{
			nextTargets.push( $gameMap.events()[theEnemyAarray] );
		}
		if(	skill.meta.img
			&& target != $gameMap.events()[theEnemyAarray]
			&& distX <= skillRange 
			&& distY <= skillRange 
			&& $gameMap.events()[theEnemyAarray]._battler
			&& $gameMap.events()[theEnemyAarray]._battler._hp>1)
		{
			nextTargets.push( $gameMap.events()[theEnemyAarray] );
		}
	};
	action.setItemObject(skill);
	action.apply(target._battler);
	var result = target._battler._result;
	var hpDamageNumber = result.hpDamage;
	var mpDamageNumber = result.mpDamage;
	// 吸血判定
	if(user.HPSteal>0){
		var steal = Math.max(hpDamageNumber*(user.HPSteal/100),1);
		user._hp+=steal;
		if(sxlSimpleABS.showStealWord >0) this.showDamage( user.player , sxlSimpleABS.stealWordHP+'+'+Math.floor(steal) , 14 ,24, 'word'  )
		
	}
	if(user.MPSteal>0){
		var steal = Math.max(hpDamageNumber*(user.MPSteal/100),1)
		user._mp+=steal;
		if(sxlSimpleABS.showStealWord >0) this.showDamage( user.player , sxlSimpleABS.stealWordMP+'+'+Math.floor(steal) , 14 ,16, 'word'  )
	}
	if(hpDamageNumber>0){
		this.showDamage(target, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null, result, 0);
	}
	if(mpDamageNumber>0){
		this.showDamage(target, mpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null, result, 16);
	}
	if(hpDamageNumber<0){
		this.showDamage(target, '+'+hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null, result, 24);
	}
	if(mpDamageNumber<0){
		this.showDamage(target, '+'+mpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null, result, 16);
	}
	if( skill.meta.attackState ){
		if(skill.meta.attackStateRate){
			var ramdomNumber = Math.random();
			if( ramdomNumber<=Number(skill.meta.attackStateRate) ){
				user.addState( Number(skill.meta.attackState) )
			}
		}else{
			user.addState( Number(skill.meta.attackState) )
		}
	};
	if( skill.meta.removeState ){
		user.removeState( Number(skill.meta.removeState) );
	};
	var dataSkill = $dataSkills[skill.id];
	if(sxlSimpleABS.showDamageInformation == true){
		if( !target._battler._result.evaded && !target._battler._result.missed){
			if( user._memberIndex ){
				information = '【'+ $gameParty.members()[user._memberIndex]._name  + '】 使用 【'+dataSkill.name+'】 对 【' + $dataEnemies[target._battler._enemyId].name + '】 造成 ' + target._battler._result.hpDamage  + ' 点伤害';
			}else{
				information = '【'+  user._name +  '】 使用 【'+dataSkill.name+'】 对 【'+ $dataEnemies[target._battler._enemyId].name + '】 造成 ' + target._battler._result.hpDamage  + ' 点伤害';
			}
		}else{
			if( user._memberIndex ){
				information = '【'+ $gameParty.members()[user._memberIndex]._name  + '】 使用 【'+dataSkill.name+'】 对 【'  + $dataEnemies[target._battler._enemyId].name + '】 的攻击没有击中';
			}else{
				information = '【'+  user._name +  '】 使用 【'+dataSkill.name+'】 对 【' + $dataEnemies[target._battler._enemyId].name + '】 的攻击没有击中';
			}
		}
	}
	if( !target._battler._aggro ){
		target._battler._aggro = [];
	};
	if(userFix in target._battler._aggro){
		if(userFix._tgr){
			userFix._tgr += target._battler._result.hpDamage/100;
		}else{
			userFix._tgr = target._battler._result.hpDamage/100;
		}
	}else{
		if(!(target._battler._aggro.includes(aggroFix))){
			target._battler._aggro.unshift(aggroFix);
		}
	}
	target._battler._aggro.sort( function(a, b){
		if(a == $gamePlayer ){
			var ida = 0;
		}else{
			if(a) var ida = a._memberIndex;
		}
		if(b == $gamePlayer ){
			var idb = 0;
		}else{
			if(b) var idb = b._memberIndex;
		}
		if($gameParty.members()[ida]  && $gameParty.members()[idb]){
			var atgr = $gameParty.members()[ida]._tgr
			var btgr = $gameParty.members()[idb]._tgr
		}
		return atgr - btgr
	} );
	for( j = 0 ; j < target._battler._states.length ; j ++ ){
		if( $dataStates[target._battler._states[j]].restriction == 4 ){
			var stateId =  $dataStates[target._battler._states[j]].id
			target._stun = target._battler._stateTurns[stateId] ;
			target._stunMax = target._battler._stateTurns[stateId] ; 
		};
	};
	if(sxlSimpleABS.showDamageInformation == true){
		sxlSimpleABS.informationColor.push('#ffffff');
		sxlSimpleABS.information.push(information);
	}
	
	this.refreshInformation();
};

Scene_Map.prototype.enemyAttackAffect = function(user, target, skill){
	if(!skill){
		var skill = $dataSkills[user.attackSkillId()];
	}
	var action = new Game_Action(user);
	var targetBattler;
	var nextTargets = [];
	var nextChar = [];
	if(target && target == $gamePlayer){
		targetBattler = $gameParty.members()[0];
	}else if(target && target._memberIndex){
		targetBattler = $gameParty.members()[target._memberIndex];
	}else{
		targetBattler = null;
	}

	
	if(targetBattler){
		for( k = 0 ; k < $gameParty.members().length ; k ++ ){
			var followerX = $gameParty.members()[k].player.x;
			var followerY = $gameParty.members()[k].player.y;
			var follower = $gameParty.members()[k].player;
			var followerBattler = $gameParty.members()[k]	
			var distX = Math.abs( target.x - followerX );
			var distY = Math.abs( target.y - followerY );
			var skillRange = $dataSkills[user.attackSkillId()].meta.range?
							 Number($dataSkills[user.attackSkillId()].meta.range):0;
			if( distX < skillRange && distY < skillRange && target != follower ){
				nextTargets.push( followerBattler );
				nextChar.push( follower );
			};
		};

		action.setItemObject(skill);

		action.apply(targetBattler);
		// if(skill.meta.hitBack) this.hitBack(target, user, skill);
		if(skill.meta.hitHook) this.hitHook(target, user, skill);
		var result = targetBattler._result;
		var hpDamageNumber = result.hpDamage;
		var mpDamageNumber = result.mpDamage;
		if(hpDamageNumber>0){
			this.showDamage(target, hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null,result,0);
		}
		if(mpDamageNumber>0){
			this.showDamage(target, mpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null,result,0);
		}
		if(hpDamageNumber<0){
			this.showDamage(target, '+'+hpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null, result, 24);
		}
		if(mpDamageNumber<0){
			this.showDamage(target, '+'+mpDamageNumber, result.critical, result.evaded, result.missed, result.drain, skill,null, result, 16);
		}
		var dataSkill = $dataSkills[skill.id];
		if(sxlSimpleABS.showDamageInformation == true){
			if(target == $gamePlayer){
				if( !$gameParty.members()[0]._result.evaded && !$gameParty.members()[0]._result.missed ){
					information = '【'+ $dataEnemies[user._enemyId].name  + '】 使用 【'+dataSkill.name+'】 对 【'+ $gameParty.members()[0]._name + '】 造成 ' + $gameParty.members()[0]._result.hpDamage  + ' 点伤害';
				}else{
					information = '【'+ $dataEnemies[user._enemyId].name  + '】 使用 【'+dataSkill.name+'】 对 【' + $gameParty.members()[0]._name + '】 的攻击没有击中';
				}
				
			}else{
				if( !$gameParty.members()[target._memberIndex]._result.evaded && !$gameParty.members()[target._memberIndex]._result.missed ){
					information = '【'+ $dataEnemies[user._enemyId].name  + '】 使用 【'+dataSkill.name+'】 对 【'+ $gameParty.members()[target._memberIndex]._name + '】 造成 ' + $gameParty.members()[target._memberIndex]._result.hpDamage  + ' 点伤害';
				}else{
					information = '【'+ $dataEnemies[user._enemyId].name  + '】 使用 【'+dataSkill.name+'】 对 【'+ $gameParty.members()[target._memberIndex]._name + '】 的攻击没有击中';
				}
			};
		};
		var theTarget = target._memberIndex?$gameParty.members()[target._memberIndex]:$gameParty.members()[0];
		for( j = 0 ; j < theTarget._states.length ; j ++ ){
			if($dataStates[theTarget._states[j]].restriction == 4 ){
				var stateId =  $dataStates[theTarget._states[j]].id
				target._stun = theTarget._stateTurns[stateId] ;
				target._stunMax = theTarget._stateTurns[stateId] ;
			};
		};

		// 处理伤害时的特效
		for( const state of targetBattler.states() ){
			if(state.meta.damageSkill){
				var damageSkill = $dataSkills[state.meta.damageSkill.split(',')[0]];
				if(state.meta.damageSkill.split(',')[1]){
					var rate = state.meta.damageSkill.split(',')[1];
				}else{
					var rate = 1;
				}
				
				var random = Math.random();
				if(random<=rate){
					this.triggerSkillnoTarget(target,targetBattler,damageSkill);
				}
			}
		}
		if(sxlSimpleABS.showDamageInformation == true){
			sxlSimpleABS.informationColor.push('#ffffff');
			sxlSimpleABS.information.push(information);
		}

		this.refreshInformation();
	};
	
	
};


Scene_Map.prototype.showDamage = function(target, damage, isCritical, isEvaded, isMissed, isDarin, skill, item, result, color){
	this.damageWord = new Sprite(new Bitmap(128,128));
	this.damageWord.target = target;
	this.damageWord.x = target.screenX();
	this.damageWord.y = target.screenY()-48;
	this.damageWord.anchor.x = 0.5;
	this.damageWord.anchor.y = 0.5;
	this.damageWord.scale.x = 5;
	this.damageWord.scale.y = 5;
	this.damageWord.opacity = 0;
	this.damageWord.bitmap.fontFace = $gameSystem.mainFontFace();
	this.damageWord.bitmap.fontSize = 16;
	this.damageWord.bitmap.smooth = false;
	if(!color){
		color = 0;
	}
	this.damageWord.bitmap.textColor = ColorManager.textColor(color);
	if(isMissed && isMissed == 'word'){
		this.damageWord.bitmap.fontSize = isCritical;
		this.damageWord.bitmap.textColor = ColorManager.textColor(isEvaded);
		this.damageWord.bitmap.drawText(damage,0,0,128,128,'center');
		
	}else{
		if(item){
			this.damageWord.item = true;
			if(item == 'gold'){
				this.damageWord.bitmap.fontSize = 14;
				var textColor = ColorManager.textColor(14);
				this.damageWord.bitmap.textColor = textColor;
				this.damageWord.bitmap.drawText('获得金币×'+sxlSimpleABS.requestShowItemGold,0,0,128,128,'center');
			}else{
				this.damageWord.bitmap.fontSize = 14;
				var textColor = item.meta.textColor?
								ColorManager.textColor(Number(item.meta.textColor)):
								'#ffffff';
				this.damageWord.bitmap.textColor = textColor;
				this.damageWord.bitmap.drawText('获得:'+item.name,0,0,128,128,'center');
			}
			
		}else{
			this.damageWord.randomDelta = Math.random();
			if(isEvaded||false){
				this.damageWord.bitmap.drawText('Evaded',0,0,128,128,'center');
			}else if(isMissed||false){
				this.damageWord.bitmap.drawText('Miss',0,0,128,128,'center');
			}else if(damage != 0){
				this.damageWord.bitmap.drawText(Math.abs(damage),0,0,128,128,'center');
			};
			if(isCritical){
				this.damageWord.bitmap.fontSize = 24;
				this.damageWord.bitmap.fontItalic = true;
				this.damageWord.bitmap.textColor = 'red';
				this.damageWord.bitmap.drawText('Critical!',0,-12,128,128,'center');
			};
		}
	} 
	

	
	this.addChild(this.damageWord);
	sxlSimpleABS.damages.push(this.damageWord);
	sxlSimpleABS.damagesTarget.push(target);
};

Scene_Map.prototype.changeActorPose = function(actor,character,poseName){
	character._characterName = '$Actor_' + actor._actorId + '_' + poseName;
	character._stepAnime = true;
};

Scene_Map.prototype.resetActorPose = function(actor, character){
	character._characterName = $dataActors[actor._actorId].characterName;
	character._characterIndex = $dataActors[actor._actorId].characterIndex;
	character._stepAnime = false;
};

// ==============================================================================================================
// 
// 		Map_Update 血条
// 
// ==============================================================================================================


Scene_Map.prototype.showEnemiesGauge = function(target){
	this.enemyGauge = new Sprite(new Bitmap(512,128));
	this.enemyGauge.x = target.screenX();
	this.enemyGauge.y = target.screenY() + sxlSimpleABS.offsetY;
	this.enemyGauge.anchor.x = 0.5;
	this.enemyGauge.anchor.y = 1.2;
	this.enemyGauge.opacity = 255;
	this.enemyGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this.enemyGauge.bitmap.fontSize = 16;
	this.enemyGauge.target = target;
	this.addChildAt(this.enemyGauge, 1 );
	sxlSimpleABS.gauges.push(this.enemyGauge);
};

Scene_Map.prototype.showBossGauge = function(target){
	this.bossGauge = new Sprite(new Bitmap(Graphics.width*0.4,300));
	this.bossGauge.anchor.x = 0.5;
	this.bossGauge.anchor.y = 0;
	this.bossGauge.opacity = 255;
	this.bossGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this.bossGauge.bitmap.fontSize = 20;
	this.bossGauge.target = target;
	this.bossGauge.backGround = new Sprite(new Bitmap(Graphics.width*0.4,300))
	this.bossGauge.backGround.x = this.bossGauge.x;
	this.bossGauge.backGround.y = this.bossGauge.y;
	this.bossGauge.backGround.anchor.x = 0.5;
	this.bossGauge.backGround.anchor.y = 0;
	this.bossGauge.backGround.opacity = 192;
	this.bossGauge.backGround.bitmap.fontFace = $gameSystem.mainFontFace();
	this.bossGauge.backGround.bitmap.fontSize = 20;
	this.bossGauge.backGround.target = target;
	// this.bossGauge.face = new Sprite();
	// this.bossGauge.face.bitmap =  ImageManager.loadSystem("IconSet");
	// this.bossGauge.face.x = this.bossGauge.x;
	// this.bossGauge.face.y = this.bossGauge.y;
	// this.bossGauge.face.anchor.x = 0;
	// this.bossGauge.face.anchor.y = 0;
	// this.bossGauge.face.opacity = 255;
	// this.bossGauge.face.bitmap.fontFace = $gameSystem.mainFontFace();
	// this.bossGauge.face.bitmap.fontSize = 20;
	// this.bossGauge.face.target = target;
	
	this.addChild(this.bossGauge );
	this.addChild(this.bossGauge.backGround );
	// this.addChild(this.bossGauge.face);
	sxlSimpleABS.gauges.push(this.bossGauge);
};

Scene_Map.prototype.showFollowerGauge = function(target){
	this.followerGauge = new Sprite(new Bitmap(512,128));
	this.followerGauge.x = target.screenX();
	this.followerGauge.y = target.screenY() + sxlSimpleABS.offsetY;
	this.followerGauge.anchor.x = 0.5;
	this.followerGauge.anchor.y = 1.2;
	this.followerGauge.opacity = 255;
	this.followerGauge.bitmap.fontSize = 16;
	this.followerGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this.addChildAt(this.followerGauge, 1 );
	sxlSimpleABS.followerGauges.push(this.followerGauge);
};

Scene_Map.prototype.showLeaderGauge = function(target){
	this.leaderGauge = new Sprite(new Bitmap(512,128+sxlSimpleABS.padding*2));
	// this.leaderGauge.z = $gamePlayer.screenZ();
	this.leaderGauge.anchor.x = 0.5;
	this.leaderGauge.anchor.y = 1.2;
	this.leaderGauge.opacity = 255;
	this.leaderGauge.bitmap.fontFace = $gameSystem.mainFontFace();
	this.leaderGauge.bitmap.fontSize = 16;
	this.addChildAt(this.leaderGauge, 1 );
};

Scene_Map.prototype.refreshBossGauge = function(target, enemy){

	if((enemy._battler._hp<=0 || !enemy._battler || enemy._battler.isStateAffected(1))){
		target.opacity = 0;
	}else{
		var vision = $dataEnemies[enemy._battler._enemyId].meta.vision?Number($dataEnemies[enemy._battler._enemyId].meta.vision):15
		if(Math.abs(enemy.x-$gamePlayer.x)<vision && Math.abs(enemy.y-$gamePlayer.y)<vision ){
			target.opacity += 30;
		}else{
			target.opacity -= 30;
		}

	}
	var maxWidth = Graphics.width*0.4;
	var padding = 2;
	if(target && enemy._battler){
		target.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		let rate = enemy._battler._hp / enemy._battler.mhp;
		target.splash = enemy._battler.damageHp;
		target.states = [];
		var splashRate = target.splash / enemy._battler.mhp;
		var shake = Math.random()*splashRate*128-splashRate*128/2;
		let name = $dataEnemies[enemy._battler._enemyId].name;
		let color = $dataEnemies[enemy._battler._enemyId].meta.textColor?
					 ColorManager.textColor(Number($dataEnemies[enemy._battler._enemyId].meta.textColor)):'#ffffff';
		var rateTp = enemy._battler._tp / 100;
		var stunRate =  enemy._stun / enemy._stunMax;
		var skillCast = $dataSkills[enemy._battler.attackSkillId()].meta.cast?
						Number($dataSkills[enemy._battler.attackSkillId()].meta.cast):1;
		var iconSet = $dataEnemies[enemy._battler._enemyId].meta.bossFace?
						Number($dataEnemies[enemy._battler._enemyId].meta.bossFace):0;
		var waitTimeRate = enemy._waitTime / ( skillCast);

		target.x = Graphics.width/2 + shake;
		target.y = Graphics.height*0.025 + shake;
		target.backGround.x = target.x;
		target.backGround.y = target.y;
		target.bitmap.fontSize = 18;
		target.bitmap.textColor = color;
		target.bitmap.fillRect(0,80-padding,maxWidth+padding*2,24+padding*2, '#696969');
		target.bitmap.gradientFillRect (padding,80,(maxWidth-padding*2),24,'#494949','#292929',true);

		target.backGround.blendMode = 1;
		target.backGround.opacity = target.opacity/2;
		target.bitmap.gradientFillRect (padding,80,(maxWidth-padding*2)*rate,24,'#B80000','#BA55D3');
		target.bitmap.fillRect((maxWidth-padding*2)*rate,80,splashRate*(maxWidth-padding*2),24,'#FFFFFF');
		target.bitmap.drawText(name,0,0,maxWidth,128,'center');
		target.backGround.bitmap.gradientFillRect (padding,80,(maxWidth-padding*2),24,'#000000','#888888',true);
		target.backGround.bitmap.fillRect (padding,80+4,(maxWidth-padding*2),2,'#ffffff');

		target.bitmap.smooth = false;
		if( enemy._waitTime > 0 ){
			target.bitmap.fillRect(padding,80+24-8,(maxWidth-padding*2)*(1-waitTimeRate),8,'#BA55D3');
		};
		target.bitmap.fillRect(padding,80+24-8,(maxWidth-padding*2)*stunRate,8,'#000000');	
		if(  enemy._battler._states.length > 0 ){
			for( j = 0 ; j < enemy._battler._states.length ; j ++ ){
				target.bitmap.fontSize = 16;
				
				let enemyMember = enemy._battler;
				let stateId = enemyMember._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line += (state.length+2)*target.bitmap.fontSize ;
					if(stateIndata.meta.textColor) target.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor));
					if(stateSteps!=0){
						target.bitmap.drawText('['+state+':'+stateSteps+']',line-96,56,96,128,'left');
					}else{
						target.bitmap.drawText('['+state+']',line-96,56,96,128,'left');
					}
					if(stateIndata.meta.textColor) target.bitmap.textColor = '#ffffff';
				}
			};
		};
	};
};

Scene_Map.prototype.refreshLeaderGauge = function(enemy){
	if(this.leaderGauge && $gameParty.members()[0]){
		// enemy.bitmap.clear();
		this.leaderGauge.bitmap.clear();
		var line = 0 ; 
		var lineHeight = 14
		var rate = $gameParty.members()[0]._hp / $gameParty.members()[0].mhp;
		var rateMp = $gameParty.members()[0]._mp /  $gameParty.members()[0].mmp;
		var rateTp = $gameParty.members()[0]._tp / 100;
		var rateEnergy = $gamePlayer.energy / $gamePlayer.energyMax;
		var name = $dataActors[$gameParty.members()[0]._actorId].name;
		var label = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.label
		var stunRate =  enemy._stun / enemy._stunMax;
		var skillCast = enemy.skillCast?
						Number(enemy.skillCast):0;
		var waitTimeRate = $gamePlayer.waitForCast / ( $gameParty.members()[0].castSpeed * skillCast ) ;
		var totalHeight = sxlSimpleABS.padding*3+sxlSimpleABS.gaugeHeight+sxlSimpleABS.gaugeHeightMP;

		this.splash = $gameParty.members()[0].damageHp;
		var splashRate = this.splash / $gameParty.members()[0].mhp;
		this.leaderGauge.x = enemy.screenX();
		this.leaderGauge.y = enemy.screenY() + sxlSimpleABS.offsetY;
		if( rate <= 0.3 ){
			this.leaderGauge.fontColor = '#FFFF00';
		}else{
			this.leaderGauge.fontColor = '#FFFFFF';
		}
		this.leaderGauge.bitmap.fontSize = 12;

		this.leaderGauge.bitmap.drawText(name,this.leaderGauge.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		this.leaderGauge.bitmap.gradientFillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);
		this.leaderGauge.bitmap.gradientFillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeightMP,'#606060','#404040',true);

		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');

		
		if(Input.isPressed('shift')){
			this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateEnergy,sxlSimpleABS.gaugeHeightMP,'#FFD700');
			this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateEnergy,1,'#ffffff');
		}else{
			this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateMp,sxlSimpleABS.gaugeHeightMP,'#00BFFF');
			this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateMp,1,'#ffffff');
		}

		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		this.leaderGauge.bitmap.smooth = false;
		this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');	
		this.leaderGauge.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		if( $gamePlayer.waitForCast > 0 ){
			if(waitTimeRate>1){
				this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),sxlSimpleABS.gaugeHeightMP,'#800000');
			}else{
				this.leaderGauge.bitmap.fillRect(this.leaderGauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),sxlSimpleABS.gaugeHeightMP,'#BA55D3');
			}
			
		};
		if(label){
			line ++ ;
			this.leaderGauge.bitmap.textColor1 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor?
										ColorManager.textColor(Number( $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor )):ColorManager.textColor(0);
			this.leaderGauge.bitmap.textColor2 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2?
										ColorManager.textColor(Number($gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2)):this.leaderGauge.bitmap.textColor1;
			this.leaderGauge.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),this.leaderGauge.width,lineHeight,'center',this.leaderGauge.bitmap.textColor1,this.leaderGauge.bitmap.textColor2);
		}
		if(  $gameParty.members()[0]._states.length > 0 ){
			for( j = 0 ; j < $gameParty.members()[0]._states.length ; j ++ ){
				
				let enemyMember = $gameParty.members();
				let stateId = enemyMember[0]._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember[0]._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) this.leaderGauge.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						this.leaderGauge.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),this.leaderGauge.width,lineHeight,'center');
					}else{
						this.leaderGauge.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),this.leaderGauge.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) this.leaderGauge.bitmap.textColor = '#ffffff';
				}
			};
		}
	}else{
		this.leaderGauge.bitmap.clear();
	};
};

Scene_Map.prototype.hideFollowerGauge = function(target){
	if(target) target.opacity = 0;
};

Scene_Map.prototype.refreshFollowerGauge = function(target, enemy){
	if(enemy){
		target.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		var rate = $gameParty.members()[enemy._memberIndex]._hp / $gameParty.members()[enemy._memberIndex].mhp;
		var name = $dataActors[$gameParty.members()[enemy._memberIndex]._actorId].name;
		var rateTp = $gameParty.members()[enemy._memberIndex]._tp / 100;
		var skillCast = $dataSkills[$gameParty.members()[enemy._memberIndex].attackSkillId()].meta.cast?
						Number($dataSkills[$gameParty.members()[enemy._memberIndex].attackSkillId()].meta.cast):0;
		var stunRate =  enemy._stun/enemy._stunMax;
		
		var waitTimeRate =  $gamePlayer._followers._data[ enemy._memberIndex - 1 ]._waitTime / 
							($gameParty.members()[enemy._memberIndex].castSpeed * skillCast ) ;
		var totalHeight = sxlSimpleABS.padding*2+sxlSimpleABS.gaugeHeight;
		totalHeight = sxlSimpleABS.padding*3+sxlSimpleABS.gaugeHeight+sxlSimpleABS.gaugeHeightMP;

		if( rate <= 0.3 ){
			target.fontColor = '#FFFF00';
		}else{
			target.fontColor = '#FFFFFF';
		}
		target.x = enemy.screenX();
		target.y = enemy.screenY() + sxlSimpleABS.offsetY;
		target.member = $gameActors.actor($gameParty.members()[enemy._memberIndex]._actorId)
		target.splash = $gameParty.members()[enemy._memberIndex].damageHp;
		var splashRate = target.splash / $gameParty.members()[enemy._memberIndex].mhp;
		var label = $gameParty.members()[enemy._memberIndex].equips()[sxlSimpleABS.labelEtypeID-1].meta.label
		target.bitmap.fontSize = 12;
		target.bitmap.smooth = false;
		target.bitmap.drawText(name,target.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
		target.bitmap.fillRect(target.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		target.bitmap.gradientFillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);
		target.bitmap.gradientFillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeightMP,'#606060','#404040',true);

		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');

		target.bitmap.fillRect(target.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		target.bitmap.smooth = false;
		if( $gameParty.members()[enemy._memberIndex].aliveTime){

			var aliveTimeRate = $gameParty.members()[enemy._memberIndex].aliveTime/$gameParty.members()[enemy._memberIndex].aliveTimeMax;
			// console.log($gameParty.members()[enemy._memberIndex].aliveTime+'/'+$gameParty.members()[enemy._memberIndex].aliveTimeMax)
			target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*aliveTimeRate,sxlSimpleABS.gaugeHeightMP,'#FFD700');
		}
		target.bitmap.fillRect(target.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');
		target.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		if( waitTimeRate > 0 ){
			if(waitTimeRate>1){
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),sxlSimpleABS.gaugeHeightMP,'#800000');
			}else{
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),sxlSimpleABS.gaugeHeightMP,'#BA55D3');
			}
			
		};
		if(label){
			line ++ ;
			target.bitmap.textColor1 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor?
										ColorManager.textColor(Number( $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor )):ColorManager.textColor(0);
			target.bitmap.textColor2 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2?
										ColorManager.textColor(Number($gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2)):target.bitmap.textColor1;
			target.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center',target.bitmap.textColor1,target.bitmap.textColor2);
		}
		if(  $gameParty.members()[enemy._memberIndex]._states.length > 0 ){
			for( j = 0 ; j < $gameParty.members()[enemy._memberIndex]._states.length ; j ++ ){
				
				let enemyMember = $gameParty.members();
				let stateId = enemyMember[enemy._memberIndex]._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember[enemy._memberIndex]._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) target.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						target.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}else{
						target.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) target.bitmap.textColor = '#ffffff';
				}
			};
		}	
	}
};



Scene_Map.prototype.refreshEnemiesGauge = function(target, enemy){

	if(enemy._battler._hp<=0 || !enemy._battler || enemy._battler.isStateAffected(1)){
		target.opacity = 0;
	}else{
		if( Math.abs($gamePlayer.x - enemy.x <= sxlSimpleABS.hideRange) && 
			Math.abs($gamePlayer.y - enemy.y <= sxlSimpleABS.hideRange) && 
			$gameVariables.value(sxlSimpleABS.opacityVarID)>0 ){
			target.opacity += 10;
		}else if( (Math.abs($gamePlayer.x - enemy.x > sxlSimpleABS.hideRange)  || 
			Math.abs($gamePlayer.y - enemy.y > sxlSimpleABS.hideRange)) && 
			$gameVariables.value(sxlSimpleABS.opacityVarID)>0 ){
			target.opacity -= 10;
		}else{
			target.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		}
	}
	if(target && enemy._battler  ){

		target.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		let rate = enemy._battler._hp / enemy._battler.mhp;
		target.splash = enemy._battler.damageHp;
		var splashRate = target.splash / enemy._battler.mhp;

		let name = $dataEnemies[enemy._battler._enemyId].name;
		let color = $dataEnemies[enemy._battler._enemyId].meta.textColor?
					 ColorManager.textColor(Number($dataEnemies[enemy._battler._enemyId].meta.textColor)):'#ffffff';
		var rateTp = enemy._battler._tp / 100;
		var stunRate =  enemy._stun / enemy._stunMax;
		var skillCast = $dataSkills[enemy._battler.attackSkillId()].meta.cast?
						Number($dataSkills[enemy._battler.attackSkillId()].meta.cast):1;
		var waitTimeRate = enemy._waitTime / ( skillCast);
		var totalHeight = sxlSimpleABS.padding*2+sxlSimpleABS.gaugeHeight;
		var label = $dataEnemies[enemy._battler._enemyId].meta.label
		target.x = enemy.screenX();
		target.y = enemy.screenY() + sxlSimpleABS.offsetY;
		target.bitmap.fontSize = 12;
		target.bitmap.textColor = color;

		target.bitmap.fontSize = 12;
		target.bitmap.smooth = false;
		target.bitmap.drawText(name,target.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
		target.bitmap.fillRect(target.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		target.bitmap.gradientFillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);

		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');

		target.bitmap.fillRect(target.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		target.bitmap.smooth = false;
		target.bitmap.fillRect(target.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');	
		// target.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		if( waitTimeRate > 0 ){
			if(waitTimeRate>1){
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),sxlSimpleABS.gaugeHeightMP,'#800000');
			}else{
				target.bitmap.fillRect(target.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),sxlSimpleABS.gaugeHeightMP,'#BA55D3');
			}
			
		};
		if(label){
			line ++ ;
			target.bitmap.textColor1 = $dataEnemies[enemy._battler._enemyId].meta.labelTextColor?
										ColorManager.textColor(Number( $dataEnemies[enemy._battler._enemyId].meta.labelTextColor)):ColorManager.textColor(0);
			target.bitmap.textColor2 = $dataEnemies[enemy._battler._enemyId].meta.labelTextColor2?
										ColorManager.textColor(Number($dataEnemies[enemy._battler._enemyId].meta.labelTextColor2)):target.bitmap.textColor1;
			target.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center',target.bitmap.textColor1,target.bitmap.textColor2);
		}
		if(  enemy._battler._states.length > 0 ){
			for( j = 0 ; j <  enemy._battler._states.length ; j ++ ){
				
				let enemyMember =  enemy._battler;
				let stateId = enemy._battler._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(enemyMember._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) target.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						target.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}else{
						target.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),target.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) target.bitmap.textColor = '#ffffff';
				}
			};
		}
	};
};

Scene_Map.prototype.showInformation = function(){
};

Scene_Map.prototype.updateInformation = function(){
	
	for( i = 0 ; i < sxlSimpleABS.informationLines.length ; i ++){
		sxlSimpleABS.informationLines[i].opacity -= 1 ;
		sxlSimpleABS.informationLines[i]._stayTime -- ;
		if(sxlSimpleABS.informationLines[i].opacity <= 0 ||
			sxlSimpleABS.informationLines[i]._stayTime <= 0){
			sxlSimpleABS.informationLines[i].bitmap.clear();
			sxlSimpleABS.informationLines.splice( i, 1 );
			sxlSimpleABS.information.splice( i, 1 );
			this.line --;
		}
	}

};

Scene_Map.prototype.refreshInformation = function(){
	var padding = 12;
	var fontSize = 16;
	this.lineMaxHeight = 128;
	this.line ++ ;
	if(!this.screenInformation){
		this.screenInformation = new Sprite(new Bitmap(Graphics.width, 302));
		this.screenInformation.bitmap.smooth = false;
		this.addChild(this.screenInformation);
		this.screenInformation.bckGrd = new Sprite(new Bitmap(Graphics.width, 302));
		this.screenInformation.bckGrd.bitmap.smooth = false;
		this.screenInformation.bckGrd.opacity = 0;
		this.screenInformation.bckGrd.blendMode = 2;
		this.addChildAt(this.screenInformation.bckGrd,1);
		this.screenInformation.scroll = new Sprite(new Bitmap(10, 20));
		this.screenInformation.scroll.bitmap.smooth = false;
		this.screenInformation.scroll.opacity = 0;
		this.addChild(this.screenInformation.scroll);
		this.screenInformation.buttonClear = new Sprite(new Bitmap(400, 100));
		this.screenInformation.buttonClear.bitmap.smooth = false;
		this.screenInformation.buttonClear.opacity = 0;
		this.addChild(this.screenInformation.buttonClear);
	};
	if(this.screenInformation.bckGrd){
		this.screenInformation.bckGrd.bitmap.clear();
		this.screenInformation.bckGrd.x = padding;
		this.screenInformation.bckGrd.y = this.screenInformation.y-7;
		this.screenInformation.bckGrd.bitmap.gradientFillRect(0,0,400,this.screenInformation.height/2+7,'#000000','#ffffff',false);
	}
	if( this.screenInformation.scroll){
		this.screenInformation.scroll.bitmap.clear();
		this.screenInformation.scroll.x = this.screenInformation.bckGrd.x;
		this.screenInformation.scroll.anchor.y = 0.5;
		this.screenInformation.scroll.bitmap.fillRect(6,0,2,20,'#ffffff');
	}
	if(this.screenInformation.buttonClear){
		this.screenInformation.buttonClear.bitmap.clear();
		this.screenInformation.buttonClear.x = this.screenInformation.bckGrd.x;
		this.screenInformation.buttonClear.y = this.screenInformation.bckGrd.y-16;
		this.screenInformation.buttonClear.anchor.y = 0.5;
		this.screenInformation.buttonClear.blendMode = 2;
		this.screenInformation.buttonClear.bitmap.gradientFillRect(0,34,400,32,'#000000','#ffffff',false);
		this.screenInformation.buttonClear.bitmap.drawText('  清空',0,0,200,100,'left');
	}


	this.screenInformation.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID);
	this.screenInformation.bitmap.clear();
	this.screenInformation.bitmap.fontFace = $gameSystem.mainFontFace();
	this.screenInformation.bitmap.fontSize = fontSize;
	this.screenInformation.x = padding+12;
	this.screenInformation.anchor.x = 0;
	this.screenInformation.anchor.y = 0;
	var lineHeight = this.screenInformation.bitmap.fontSize + 2 ;
	this.screenInformation.y = Graphics.height - this.screenInformation.height/2 - padding ;
	for(i = 0 ; i < sxlSimpleABS.information.length ; i ++ ){
		var length = sxlSimpleABS.information.length;
		if(sxlSimpleABS.information[i-sxlSimpleABS.informPage]){
			this.screenInformation.bitmap.textColor = sxlSimpleABS.informationColor[i-sxlSimpleABS.informPage];
			this.screenInformation.bitmap.drawText(sxlSimpleABS.information[i-sxlSimpleABS.informPage],0, - (length - i) * lineHeight ,420, this.screenInformation.height,'left');
			
		}
		this.screenInformation.bitmap.textColor = '#ffffff';
	};	
};

Scene_Map.prototype.updateScreenInformation = function(){;
	if( this.screenInformation &&
		TouchInput.x > this.screenInformation.x &&
		TouchInput.x < this.screenInformation.x + 400 &&
		TouchInput.y > this.screenInformation.y - 32 &&
		TouchInput.y < this.screenInformation.y + this.screenInformation.height){
		
		this.screenInformation.opacity += 10;
		if(this.screenInformation.bckGrd && this.screenInformation.bckGrd.opacity <= 128 ){
			this.screenInformation.bckGrd.opacity += 5;
			this.screenInformation.bckGrd.y = this.screenInformation.y-7;
			this.screenInformation.scroll.opacity += 5;
			this.screenInformation.buttonClear.x = this.screenInformation.bckGrd.x;
			this.screenInformation.buttonClear.y = this.screenInformation.bckGrd.y-24;
			this.screenInformation.buttonClear.opacity = this.screenInformation.bckGrd.opacity;
		}
		if(TouchInput.wheelY > 0 ){
			sxlSimpleABS.informPage -= 1;
			this.refreshInformation();
		}
		if(TouchInput.wheelY < 0 ){
			sxlSimpleABS.informPage += 1;
			this.refreshInformation();
		}
		
		if(this.isOnInformWindow ==true&&TouchInput.isClicked()){
			sxlSimpleABS.information = [];
			sxlSimpleABS.informationLines = [];
			sxlSimpleABS.informationColor = [];
		};
	};
	if( this.screenInformation && 
		!(TouchInput.x > this.screenInformation.x &&
		  TouchInput.x < this.screenInformation.x + 400 &&
		  TouchInput.y > this.screenInformation.y - 32 &&
		  TouchInput.y < this.screenInformation.y + this.screenInformation.height)){
		this.screenInformation.opacity -- ;
		if(this.screenInformation.bckGrd ){
			this.screenInformation.bckGrd.opacity -=8;
			this.screenInformation.scroll.opacity -=8;
			this.screenInformation.buttonClear.opacity = this.screenInformation.bckGrd.opacity;
		};
	};
	if(sxlSimpleABS.informPage<=0){
		sxlSimpleABS.informPage = 0;
	};
	if(sxlSimpleABS.informPage >= sxlSimpleABS.information.length){
		sxlSimpleABS.informPage =  sxlSimpleABS.information.length;
	};
	if( this.screenInformation && this.screenInformation.scroll){
		this.screenInformation.scroll.y = ((this.screenInformation.bckGrd.y + this.screenInformation.bckGrd.height/2)  -
										  (this.screenInformation.bckGrd.height/2*sxlSimpleABS.informPage/sxlSimpleABS.information.length)*0.8)-14;
	};
};
Scene_Map.prototype.setSpecialSkillCD = function(){
	for( i in $gameParty.members()){
		var theActor = $gameParty.members()[i];
		var skill = theActor.useSkillId;
		if( skill ){
			if( theActor.spCD ){
				if ( theActor.spCD > 0 ){
					theActor.spCD -- ;
				}else{
					theActor.spCD = 0;
				}
			}
		}
	}
};

Scene_Map.prototype.triggerSpecialSkill = function(){
	for( i in $gameParty.members()){
		var theActor = $gameParty.members()[i];
		var char = theActor.player;
		var skill = theActor.skills()[0]
		if( TouchInput.isLongPressed() &&
			TouchInput.x >= char.screenX()-36 &&
			TouchInput.x <= char.screenX()+36 &&
			TouchInput.y >= char.screenY()-36 &&
			TouchInput.y <= char.screenY()+36 && 
			theActor.spCD == 0
			){
			if( skill.meta.addState ){
				theActor.spCD = skill.meta.spCD?
								Number(skill.meta.spCD):sxlSimpleABS.defaultSPCD;
				theActor.hasAnimated = 0 ;
				theActor.addState( Number(skill.meta.addState) );
				var actorArray = [char];
				$gameTemp.requestAnimation( actorArray , skill.animationId , false );
			}
		}
		if( theActor.spCD == 0 && (theActor.hasAnimated == 0 || !theActor.hasAnimated) ){
			var actorArray = [char];
			var readyAnim = skill.meta.readyAnim?
							Number(skill.meta.readyAnim):117;
			$gameTemp.requestAnimation( actorArray , readyAnim , false );
			theActor.hasAnimated = 1 ;
		}
	}
};

Scene_Map.prototype.refreshAttackSkill = function(){
	for( k in $gameParty.members()){
		for( i in $dataActors[$gameParty.members()[k]._actorId].traits){
			if($dataActors[$gameParty.members()[k]._actorId].traits[i].code == 35){
				$gameParty.members()[k]._attackSkillId1 = $dataActors[$gameParty.members()[k]._actorId].traits[i].dataId;
			}
		}
		for( i in $gameParty.members()[k].weapons()[0].traits){
			if($gameParty.members()[k].weapons()[0].traits[i].code == 35){
				$gameParty.members()[k]._attackSkillId1 = $gameParty.members()[k].weapons()[0].traits[i].dataId;
			}
		}
		for( i in $gameParty.members()[k]._states){
			if( $gameParty.members()[k]._states[i] ){
				for( j in $dataStates[$gameParty.members()[k]._states[i]].traits){
					if($dataStates[$gameParty.members()[k]._states[i]].traits[j].code == 35 ){
						$gameParty.members()[k]._attackSkillId1 = $dataStates[$gameParty.members()[k]._states[i]].traits[j].dataId;
						
					}
				}
			}
		}
	}
};

// ==============================================================================================================
// 
// 		Game_Followers 跟随者类
// 
// ==============================================================================================================

Game_Followers.prototype.jumpAll = function() {
};

Game_Follower.prototype.update = function() {
	Game_Character.prototype.update.call(this);
	this.setMoveSpeed($gamePlayer.realMoveSpeed());
};

Game_Party.prototype.maxBattleMembers = function() {
	return $dataActors.length;
};

Game_Followers.prototype.updateMove = function() {
};

// ==============================================================================================================
// 
// 		Game_Player 玩家类
// 
// ==============================================================================================================
// 
// 
Game_Player.prototype.isMoveDiagonally = function(direction) {
    return [1, 3, 7, 9].contains(direction);
};

Game_Player.prototype.isMoveStraight = function(direction) {
    return [2, 4, 6, 8].contains(direction);
};

Game_Character.prototype.getDiagonallyMovement = function(direction) {
    var horz = 0;
    var vert = 0;
    if (direction === 1) {
        horz = 4;
        vert = 2;
    } else if (direction === 3) {
        horz = 6;
        vert = 2;
    } else if (direction === 7) {
        horz = 4;
        vert = 8;
    } else if (direction === 9) {
        horz = 6;
        vert = 8;
    }
    return [horz, vert];
};

Game_Player.prototype.processMoveByInput = function(direction) {
	if (this.isMoveStraight(direction)) {
		this.moveStraight(direction);
	} else if (this.isMoveDiagonally(direction)) {
		var diagonal = this.getDiagonallyMovement(direction);
		this.moveDiagonally.apply(this, diagonal);
	}
};

Game_Player.prototype.canMove = function() {
	if ($gamePlayer._waitTime > 0 || $gamePlayer._stun > 0 || $gamePlayer.locked
		|| ( (sxlSimpleABS.moveAttackMode&&sxlSimpleABS.attackMoveable) ? false : this.waitForMotion > 0) 
		|| (!sxlSimpleABS.moveAttackMode&&(!sxlSimpleItemList.canMove || !sxlSimpleItemList._isMoveable || !sxlSimpleItemList._isMoveableFace)))
		{
		return false;
	}
	if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
		return false;
	}
	if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
		return false;
	}
	if (this._vehicleGettingOn || this._vehicleGettingOff) {
		return false;
	}
	if (this.isInVehicle() && !this.vehicle().canMove()) {
		return false;
	}
	return true;
};


Game_Action.prototype.subject = function() {
	if (this._subjectActorId > 0) {
		return $gameActors.actor(this._subjectActorId);
	} else {
		return sxlSimpleABS.enemySubject;
	}
};

Scene_Base.prototype.checkGameover = function() {
};

Game_Actor.prototype.stepsForTurn = function() {
	return null;
};

Game_Actor.prototype.displayLevelUp = function(newSkills) {
};


Sprite_Destination.prototype.update = function() {
	Sprite.prototype.update.call(this);
	if ($gameTemp.isDestinationValid()) {
		this.updatePosition();
		this.updateAnimation();
		this.visible = true;
	} else {
		this._frameCount = 0;
		this.visible = false;
	}
	this.bitmap = ImageManager.loadSystem(sxlSimpleABS.destinationColor);
};

Sprite_Destination.prototype.createBitmap = function() {
	const tileWidth = $gameMap.tileWidth();
	const tileHeight = $gameMap.tileHeight();
	this.bitmap = ImageManager.loadSystem('destination_normal');
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.blendMode = 1;

};


Sprite_Destination.prototype.updateAnimation = function() {
	sxlSimpleABS.destination = this;
	this._frameCount++;
	this._frameCount %= 20;
	this.opacity = (20 - this._frameCount) * 6;
	this.scale.x = this._frameCount/30 + 1;
	this.scale.y = this.scale.x;
	this.rotation = this._frameCount/100;
};



Game_BattlerBase.prototype.attackSkillId = function() {
	const set = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_SKILL);
	if(this._attackSkillId1){
		return this._attackSkillId1;
	}else{
		return set.length > 0 ? set[0] : 1;
	}
};

Game_Party.prototype.addActor = function(actorId) {
	if (!this._actors.includes(actorId)) {
		this._actors.push(actorId);
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
		$gameTemp.requestBattleRefresh();
		if (this.inBattle()) {
			const actor = $gameActors.actor(actorId);
			if (this.battleMembers().includes(actor)) {
				actor.onBattleStart();
			}
		}
	}
	sxlSimpleABS.requestRefreshMember = true;
};

Game_Player.prototype.updateDashing = function() {
	if (this.isMoving()) {
		return;
	}
	if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
		this._dashing =
			this.isDashButtonPressed();
	} else {
		this._dashing = false;
	}
};

Game_Player.prototype.isDashButtonPressed = function() {
	const shift = TouchInput.isLongPressed() && $gameTemp.isDestinationValid();
	if (ConfigManager.alwaysDash) {
		return !shift;
	} else {
		return shift;
	}
};

Game_CharacterBase.prototype.realMoveSpeed = function() {
	var dashSpeed = this.isDashing() ? 0.5 : 0
	// var agiBuff = $gameParty.members()[0].agi/1000;
	var speed = (this._moveSpeed + dashSpeed) ;
	return  speed;
};



Game_CharacterBase.prototype.jump = function(xPlus, yPlus, jumpHeight) {
	if(!jumpHeight) jumpHeight = 1;
	if (Math.abs(xPlus) > Math.abs(yPlus)) {
		if (xPlus !== 0) {
			this.setDirection(xPlus < 0 ? 4 : 6);
		}
	} else {
		if (yPlus !== 0) {
			this.setDirection(yPlus < 0 ? 8 : 2);
		}
	}
	this._x += xPlus;
	this._y += yPlus;
	const distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
	this._jumpPeak = (10 + distance - this._moveSpeed)*jumpHeight;
	this._jumpCount = this._jumpPeak * 2;
	this.resetStopCount();
	this.straighten();
};

Game_CharacterBase.prototype.jumpButton = function(xPlus, yPlus, jumpHeight) {
	if(!jumpHeight) jumpHeight = 1;
	if (Math.abs(xPlus) > Math.abs(yPlus)) {
		if (xPlus !== 0) {
			this.setDirection(xPlus < 0 ? 4 : 6);
		}
	} else {
		if (yPlus !== 0) {
			this.setDirection(yPlus < 0 ? 8 : 2);
		}
	}
	this._x += xPlus;
	this._y += yPlus;
	const distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
	this._jumpPeak = (10 + distance - this._moveSpeed)*($gameParty.members()[0].mrf*5+2);
	this._jumpCount = this._jumpPeak * 2;
	this.resetStopCount();
	this.straighten();
};

Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
	const container = this.itemContainer(item);
	if (container) {
		
		const lastNumber = this.numItems(item);
		const newNumber = lastNumber + amount;
		if(amount>0){
			var information = '获得物品: 【 '+ item.name + ' 】 ' + '×'+amount;
		}else{
			var information = '失去物品: 【 '+ item.name + ' 】 ' + '×'+Math.abs(amount);
		}
	   
		informationColor =  item.meta.textColor?
							ColorManager.textColor(Number(item.meta.textColor)):
							'#ffffff';
		sxlSimpleABS.informationColor.push(informationColor);
		sxlSimpleABS.information.push(information);
		sxlSimpleABS.requestShowItemGainItem = item;
		container[item.id] = newNumber.clamp(0, this.maxItems(item));
		if (container[item.id] === 0) {
			delete container[item.id];
		}
		if (includeEquip && newNumber < 0) {
			this.discardMembersEquip(item, -newNumber);
		}
		if(amount>0){
			sxlSimpleABS.floatItemsInform.push(item);	
		}
		$gameMap.requestRefresh();
	}
	if(sxlSimpleItemList.itemShow ){
		 sxlSimpleItemList.smp.createItems()
		 sxlSimpleItemList.smp.createEquips()
	}
};

Game_Party.prototype.gainItemHide = function(item, amount, includeEquip) {
	const container = this.itemContainer(item);
	if (container) {
		const lastNumber = this.numItems(item);
		const newNumber = lastNumber + amount;
		container[item.id] = newNumber.clamp(0, this.maxItems(item));
		if (container[item.id] === 0) {
			delete container[item.id];
		}
		if (includeEquip && newNumber < 0) {
			this.discardMembersEquip(item, -newNumber);
		}
		$gameMap.requestRefresh();
	}
	if(sxlSimpleItemList.itemShow ){
		 sxlSimpleItemList.smp.createItems()
		 sxlSimpleItemList.smp.createEquips()
	}
};

Game_Party.prototype.gainGold = function(amount) {
	
	this._gold = (this._gold + amount).clamp(0, this.maxGold());
	informationColor =	ColorManager.textColor(14);
	
	sxlSimpleABS.requestShowItemGainItem = 'gold';
	sxlSimpleABS.requestShowItemGold = amount;
	if(amount>0){
		var information = '获得金币×'+amount;
	}else{
		var information = '失去金币×'+Math.abs(amount);
	}
	sxlSimpleABS.informationColor.push(informationColor);
	sxlSimpleABS.information.push(information);
	sxlSimpleABS.floatItemsInform.push('gold');
	if(sxlSimpleItemList.itemShow ){
		 sxlSimpleItemList.smp.createItems()
		 sxlSimpleItemList.smp.createEquips()
	}
};

Game_Party.prototype.gainGoldHide = function(amount) {
	this._gold = (this._gold + amount).clamp(0, this.maxGold());
	if(sxlSimpleItemList.itemShow ){
		 sxlSimpleItemList.smp.createItems()
		 sxlSimpleItemList.smp.createEquips()
	}
};

Game_Party.prototype.removeActor = function(actorId) {
    if (this._actors.includes(actorId)) {
        const actor = $gameActors.actor(actorId);
        const wasBattleMember = this.battleMembers().includes(actor);
        this._actors.remove(actorId);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
        $gameTemp.requestBattleRefresh();
        if (this.inBattle() && wasBattleMember) {
            actor.onBattleEnd();
        }
        for( i in sxlSimpleABS.followerGauges){
        	sxlSimpleABS.smp.hideFollowerGauge(sxlSimpleABS.followerGauges[i]) 
        }
        sxlSimpleABS.followerGauges=[];
        sxlSimpleABS.smp.loadFollowers();
    }
};

//  快捷指令

sxlSimpleABS.gainItem = function( type, id, amount ){
	switch (type){
		case 'gold':
			$gameParty.gainGold(amount);
			break;
		case 'item':
			$gameParty.gainItem($dataItems[id],amount);
			break;
		case 'weapon':
			$gameParty.gainItem($dataWeapon[id],amount);
			break;
		case 'armor':
			$gameParty.gainItem($dataArmors[id],amount);
			break;
	}

};

sxlSimpleABS.loot = function( enemyId , itemNumber){
	if($dataEnemies[enemyId].meta.dropItems){
		var obj = $dataEnemies[enemyId].meta.dropItems.split(';')
		var objSup = obj[itemNumber].split(',')
		var type = String(objSup[0]).replace(/[\r\n]/g,"");
		var id = Number(objSup[1]);
		var rate = Number(objSup[2]);
		if(Math.random()<=rate){
			sxlSimpleABS.gainItem(type,id,1)
		}
	}
};

sxlSimpleABS.showInformation = function( text , textColor ){
	var information = text
	sxlSimpleABS.informationColor.push(textColor);
	sxlSimpleABS.information.push(information);
}


Game_Action.prototype.apply = function(target) {
	const result = target.result();
	this.subject().clearResult();
	result.clear();
	result.used = this.testApply(target);
	result.missed = result.used && Math.random() >= this.itemHit(target);
	result.evaded = !result.missed && ((Math.random()*this.subject().hit)  < this.itemEva(target));
	result.physical = this.isPhysical();
	result.drain = this.isDrain();
	if (result.isHit()) {
		if (this.item().damage.type > 0) {
			result.critical = Math.random() < this.itemCri(target);
			if(result.critical){
				$gameTemp.reserveCommonEvent(sxlSimpleABS.criCommonEventID);
			}
			const value = this.makeDamageValue(target, result.critical);
			this.executeDamage(target, value);
		}
		for (const effect of this.item().effects) {
			this.applyItemEffect(target, effect);
		}
		this.applyItemUserEffect(target);
	}
	this.updateLastTarget(target);
};

DataManager.saveGame = function(savefileId) {
	var eventLight = 0;
	var memberLight = 0;
	if(sxlSimpleABS.damages.length>0 ){
		for( i in sxlSimpleABS.damages){
			sxlSimpleABS.damages[i].opacity = 0 ;
		}
		sxlSimpleABS.showInformation(      
		'【系统】正在清理战斗冗杂文件，请再次点击快速存档', 
		ColorManager.textColor(10)
		)
		for( event of $gameMap.events() ){
			if(event.light){
				event.light.destroy();
				event.light = null;
			}
		}
		for(member of $gameParty.members()){
			if(member.player && member.player.auraLightSprite){
				member.player.auraLightSprite.destroy();
				member.player.auraLightSprite = null;
			}
		}
	}else{
		sxlSimpleABS.showInformation('【系统】快速存档完成！', ColorManager.textColor(24));
		const contents = this.makeSaveContents();
	    const saveName = this.makeSavename(savefileId);
	    return StorageManager.saveObject(saveName, contents).then(() => {
	        this._globalInfo[savefileId] = this.makeSavefileInfo();
	        this.saveGlobalInfo();
	        return 0;
	    });
	}
};


Game_Actor.prototype.changeExp = function(exp, show) {
	let oldExp = this._exp[this._classId];

    this._exp[this._classId] = Math.max(exp, 0);
    let addExp = this._exp[this._classId] - oldExp;
    let addExpOnly = addExp/this.finalExpRate()
    let addExpBuff = addExp-addExpOnly;
    const lastLevel = this._level;
    const lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }
    this.refresh();
    // 显示经验获取
    sxlSimpleABS.smp.showDamage( this.player , 'EXP+'+ Math.floor((addExp)*100)/100 , 12 ,17, 'word'  )
    if(this.finalExpRate()>1){ 
    	sxlSimpleABS.smp.showDamage( this.player , 'EXP+'+ Math.floor(addExpBuff*100)/100+'('+Math.round((this.finalExpRate()-1)*100)+'%'+')' , 12 ,4, 'word'  );
    }
    if(this.finalExpRate()<1){ 
    	sxlSimpleABS.smp.showDamage( this.player , 'EXP'+ Math.floor(addExpBuff*100)/100+'('+Math.round((this.finalExpRate()-1)*100)+'%'+')' , 12 ,4, 'word'  );
    }
};

sxlSimpleABS.useSkill = function(skill,user,target,forced){
	if(skill.forced){
		forced = true;
	}
	let userMember;
	let animation = skill.animationId
	if(user == $gamePlayer){
		userMember = $gameParty.members()[0];
		user.faction = 'player';
	}
	if(user._memberIndex){
		userMember = $gameParty.members()[user._memberIndex];
		user.faction = 'player';
	}
	if(user._battler && user._battler._enemyId){
		userMember = user._battler;
		user.faction = 'enemy';
		if($dataEnemies[user._battler._enemyId].meta.friendly){
			user.faction = 'player';
		}
		if($dataEnemies[user._battler._enemyId].meta.neutral){
			user.faction = 'neutral';
		}
	}
	user.skillCast = 0;
	user.waitForCast = 0;
	if( skill.mpCost){
		userMember._mp -= skill.mpCost;
	}
	user.sequence = [];
	if(user.sequence.length<=0 || forced){
		let sequences = skill.meta.skillSequence.split('\n');
		for(step of sequences){
			let stepName = null;
			let stepParam = null;
			let stepParam2 = null;
			if(step.split(':')[1]){
				stepName = step.split(':')[0];
				stepParam = step.split(':')[1];
				stepParam2 = step.split(':')[2];
				stepParam3 = step.split(':')[2];
			}else{
				stepName = step;
			}
			
			//跳
			if(stepName=='jump'){
				let stepParamNumber = Number(stepParam);
				user.sequence.push({stepName:stepName,stepParam:stepParamNumber});
			}
			//姿态
			if(stepName=='pose'){
				user.sequence.push({stepName:stepName,stepParam:stepParam,stepParam2:Number(stepParam2)});
			}
			//弹道
			if(stepName=='trigger'){
				let pSkill;
				if(!stepParam){
					pSkill = skill;
				}else{
					pSkill = $dataSkills[Number(stepParam)];
				}
				user.sequence.push({stepName:stepName,stepParam: pSkill,stepParam2: target});
			}
			//状态增加
			if(stepName=='addState'){
				user.sequence.push({stepName:stepName,stepParam:Number(stepParam)});
			}
			//状态去除
			if(stepName=='removeState'){
				user.sequence.push({stepName:stepName,stepParam:Number(stepParam)});
			}
			//等待
			if(stepName=='wait'){
				user.sequence.push({stepName:stepName,stepParam:Number(stepParam)});
			}
			//冲刺
			if(stepName=='rush'){
				if(stepParam2 == 'true') stepParam2 = true;
				if(stepParam2 == 'false') stepParam2 = false;
				user.sequence.push({stepName:stepName,stepParam:Number(stepParam),stepParam2:stepParam2});
			}
			//等待
			if(stepName=='se'){
				if(!stepParam2) stepParam2 = 90;
				if(!stepParam3) stepParam3 = 100;
				user.sequence.push({stepName:stepName,stepParam:stepParam,stepParam2:Number(stepParam2),stepParam3:Number(stepParam3)});
			}
			//动画
			if(stepName=='animation'){
				if(stepParam3 == 'true') stepParam2 = true;
				if(stepParam3 == 'false') stepParam2 = false;
				user.sequence.push({stepName:stepName,stepParam:stepParam,stepParam2:stepParam2});
			}
			//锁定
			if(stepName=='user locked'){
				user.sequence.push({stepName:stepName});
			}
			//解锁
			if(stepName=='user unlocked'){
				user.sequence.push({stepName:stepName});
			}
			//霸体
			if(stepName=='user endure on'){
				user.sequence.push({stepName:stepName});
			}
			//解除霸体
			if(stepName=='user endure off'){
				user.sequence.push({stepName:stepName});
			}
			//公共事件
			if(stepName=='commonEvent'){
				user.sequence.push({stepName:stepName,stepParam:Number(stepParam)});
			}
			//方向锁定
			if(stepName=='user directionFix on'){
				user.sequence.push({stepName:stepName});
			}
			//方向锁定解除
			if(stepName=='user directionFix off'){
				user.sequence.push({stepName:stepName});
			}
		}
	}
};

Scene_Map.prototype.updateSequence = function(){
	for( user of sxlSimpleABS.sequenceUser ){
		if(user.sequence.length > 0){
			let stepSequence = user.sequence[0];
			// 等待
			if(stepSequence.stepName=='wait' && user.sequencesWait<=0 ){
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.sequence.splice(0,1);
				}else{
					user.sequencesWait = Number(stepSequence.stepParam);
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
					sxlSimpleABS.shootParticle(user, stepSequence.stepParam2, user.faction, stepSequence.stepParam);
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
				if(user.isStuned() && !user.endure){
					// 被控制时跳过
					user.rushCount = 0;
					user.sequence.splice(0,1);
				}else{
					if(user.rushCount == 0){
						user.rushCount = stepSequence.stepParam;
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
					console.log(stepSequence)
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
		}
	}
	
};

sxlSimpleABS.shootParticle = function(user,target,faction,skill,storeX,storeY){
	//创造弹道
	sxlSimpleABS.spritesetMap.createParticle(user,target,faction,skill,storeX,storeY)
};

sxlSimpleABS.setPose = function(user,pose,time){
	//设定角色动作
	user.pose = pose;
	user.isAttack = Number(time);
};


Game_Character.prototype.battler = function() {
	if(this == $gamePlayer){
		return $gameParty.members()[0];
	}
	if(this._memberIndex){
		return $gameParty.members()[this._memberIndex];
	}
    if(this._battler && this._battler._enemyId){
		return this._battler;
	}
};

Game_Character.prototype.isStuned = function() {
	let stunState = 0;
	for( state of this.battler().states()){
		if(state.restriction == 4){
			stunState++;
		}
	}
	return stunState>0;
};

Game_Character.prototype.spriteIndex = function(){
	for(charSprite of sxlSimpleABS.spritesetMap._characterSprites){
		if(charSprite._character == this){
			return charSprite;
		}
	}
};

