
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
 *敏捷(agi)       移动速度
 *魔法反射率(mrf) 击退距离
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
 *<knockBack:Number>        击退距离
 *
 *<img:String>              弹道图像（储存在img/system）
 *<blendMode:Number>        弹道图像合成模式
 *<rotate:Number>           弹道每帧旋转（弧度）
 *<hideImg>                 弹道图像不会显示，仅判定范围
 *<infront:Number>          弹道从角色前方出现
 *<followUser>              弹道会跟随角色
 *
 *<destroyAnim:String>      弹道消失时触发的逐帧动画
 *<destroyAnimScale:Number> 逐帧动画的缩放率
 *<destroyAnimBlendMode:Number> 逐帧动画的合成模式
 *
 *<destroySkill:Number>     弹道消失时触发的技能
 *
 *<stayTime:Number>         弹道存留时间
 *<through>                 弹道穿透
 *<interval:Number>         弹道触发间隔
 *<damageInterval:Number>   弹道触发间隔（对目标）
 *<oneTime>                 弹道仅触发一次
 *<constantSpeed>           弹道速度不受攻击距离影响
 *
 *<cantDestroy>             弹道无法被弹道破坏
 *<cantSlow>                弹道无法被弹道减速
 *<cantReflect>             弹道无法被弹道反弹
 *<destroyParticle>         摧毁敌方弹道
 *<slowParticle:Number>     减速敌方弹道
 *<reflectParticle>         反弹敌方弹道
 *<noDurabilityConsume>     技能不消耗武器耐久度
 *
 *<needLevel:Number>        学习技能需要等级
 *<needSkill:Number>        前置技能
 *
 *状态备注：
 *<always:1>                状态永远存在
 *<hide>                    状态栏不会显示这个状态
 *<hideOnCharacter>         角色头顶不会显示这个状态
 *<skillOnly>               技能交替时自动清空这个状态
 *<textColor:Number>        字体颜色，包括头顶和状态详情
 *<damageSkill:46,0.75>     被攻击时概率触发技能，46代表46号技能，0.75代表触发概率75%
 *
 *<suitQuantity:Number>     套装件数（2代表两件触发这个效果）
 *<suit:w 14,a 15,a 17>     套装装备，w武器，a防具，w 14代表14号武器
 *<suitDesc:String>         套装效果描述
 *
 *装备/物品备注：
 *<hide>                    在物品栏中隐藏这个物品
 *<textColor:Number>        装备名称颜色
 *<textColor2:Number>       装备名称颜色渐变色 
 *（以上品质名称在SSMBS_ItemSprite中修改）
 *<gleam:String>            装备掉落在地上时的发光（储存在img/system）
 *
 *<scale:Number>            武器/盾牌缩放
 *<dualWield>               武器为双手武器（装备双手武器时无法装备副手）
 *
 *<suit:2 26,3 27>          套装件数 以及 对应的状态ID
 *<suitEquips:w 14,a 15,a 17> 套装对应的装备 w代表武器 a代表防具
 *
 *<durability:Number>       装备耐久度
 *<durabilityConsFreq:Number>装备耐久度消耗速度，数字越大消耗越快
 *<unbreakable>             装备无线耐久
 *
 *<img:String>              叠加外观（防具）
 *<showInMap:1184>          在地图上显示的图标ID(武器)
 *<swingLight:String>       挥舞武器时的特效（储存在img/system）
 *<label:String>            显示称号
 *<triggerSkill:0.1,27,39>  攻击时概率触发技能，例为10%概率触发27或者39号技能
 *
 *<HPSteal:5>               生命窃取，例为5%
 *<HPSteal:5>               魔法窃取，例为5%
 *
 *<cannotUpgrade>           装备无法强化
 *<upgradeCost:15>          强化消费，例为15金币
 *<upgradePlus:10>          每次强化提升属性，例为10点，默认为装备本身属性10%
 *(武器强化提升物理攻击力和魔法攻击力，防具提升物理防御力和魔法防御力)
 *
 *<requireLV:9999>          装备需求等级
 *<requireATK:99999>        装备需求物理攻击力
 *<requireDEF:5>            装备需求物理防御力
 *<requireMAT:99999>        装备需求魔法攻击力
 *<requireMDF:99999>        装备需求魔法防御力
 *<requireAGI:40>           装备需求敏捷
 *<requireLUK:99999>        装备需求幸运
 *<requireHP:9999999>       装备需求生命值
 *<requireMP:9999999>       装备需求魔法值
 *
 *<currency:48,5>           特殊货币，例为48号物品5个
 *
 *通用：
 *<desc:String>             描述。武器/防具/技能/状态等都可以使用这个备注。
 *在描述中/C代表更换颜色，更换颜色单独占据一行
 *
 *技能序列范本：（在技能备注中输入）
 *<skillSequence:
 *user locked
 *pose:swingUp:3
 *wait:3
 *se:Evasion1
 *pose:swingDown:30
 *rush:4
 *trigger
 *addState:5
 *waitAttack:20
 *user unlocked
 *>
 * 
 *技能序列词条：( 多个参数用英文冒号隔开 )
 *jump             角色小跳
 *pose             角色姿态（姿态名称:姿态持续时间)（默认仅有swingDown/swingUp/thrust三个，注意大小写）
 *trigger          触发技能（读取技能的ID（留空默认读取该技能）:目标（请留空）:弹道消失时触发的技能ID（留空默认不读取））
 *addState         角色增加状态
 *removeState      角色移除状态
 *wait             等待（帧数）
 *waitAttack       等待（帧数）（根据攻速（角色trg）调整长短）
 *waitSpell        等待（帧数）（根据吟唱速度调整长短）
 *rush             冲刺（距离:是否等待冲刺结束）*非玩家无法使用
 *se               音效（音效名:音量:音调）
 *animation        角色动画（动画ID）
 *user locked      角色锁定
 *user unlocked    角色锁定解除
 *user endure on   角色霸体
 *user endure off  解除角色霸体
 *commonEvent      公共事件（公共事件ID）
 *summon           召唤（召唤物角色ID:持续时间（帧数）:召唤动画（暂未实现））
 *
 *
 *脚本：
 *sxlSimpleABS.debugMode = true/false              开启/关闭测试模式
 *sxlSimpleABS.showDamageInformation = true/false  开启/关闭伤害信息
 *考虑到比较高频率的伤害技能，建议关闭伤害提示信息
 *sxlSimpleABS.openItemWindow()                    开启物品窗口
 *sxlSimpleABS.openSkillWindow()                   开启技能窗口
 *sxlSimpleABS.openQuestWindow()                   开启任务窗口
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
 * @param 即时信息栏x
 * @type number
 * @desc 即时信息栏x
 * @default 0
 *
 * @param 即时信息栏y
 * @type number
 * @desc 即时信息栏y
 * @default 0
 *
 * @param 即时信息栏清空按钮对齐
 * @type number
 * @desc 即时信息栏清空按钮对齐
 * @default right
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
sxlSimpleABS.informationWindowX = Number(sxlSimpleABS.parameters['即时信息栏x'] || 0);
sxlSimpleABS.informationWindowY = Number(sxlSimpleABS.parameters['即时信息栏y'] || 0);
sxlSimpleABS.informationClearAlign = String(sxlSimpleABS.parameters['即时信息栏清空按钮对齐'] || 'right');
sxlSimpleABS.padding = 1;
sxlSimpleABS.labelEtypeID = 7;
sxlSimpleABS.showDamageInformation = false; // 是否开启伤害信息
sxlSimpleABS.moveAttackMode = true;         // 是否开启走射模式，这个模式下鼠标无法控制移动，并且启用WASD移动模式
sxlSimpleABS.attackMoveable = false;         // 走射模式下可否一边移动一边攻击
sxlSimpleABS._2direction = false;            // 是否开启双方向模式（仅有左右方向），必须配合走射模式使用
sxlSimpleABS.wasdMode = true;

sxlSimpleABS.calcMoveAngle = function( point1, point2 ){
    let angle = Math.atan2((Number(point1.y)-Number(point2.y)), (Number(point1.x)-Number(point2.x)))*(180/Math.PI)+270;
    if(angle<0){
        return angle+360;
    }else if(angle>=360){
        return angle-360;
    }else{
    	return angle;
    }
}

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
	sxlSimpleABS.damagesTarget =[];
	sxlSimpleABS.sequenceUser = [];
	// sxlSimpleABS.battlerCharacters = [];
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

};

const _sxlAbs_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlAbs_mapUpdate.call(this);
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
	if($gameMessage.isBusy()){
		sxlSimpleABS.ABS_OFF = true;
	}else{
		sxlSimpleABS.ABS_OFF = false;
	}
	if(!sxlSimpleABS.ABS_OFF){
		this.commonAttack();
		this.enemyAction();
	}
	this.debugModeControl();
	this.moveControl();
	this.shiftDirectionFix();
	this.followerGaugesControl();
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
	this.refreshAttackSkill();
	this.updateScreenInformation();
	this.refreshInformation();
	this.isMoveable();
	this.isMoveableFace();
	this.updateSequence();
	this.clearInformation();
	this.requestWait();
	this.requestWaitShowDamge();
};

Scene_Map.prototype.debugModeControl = function(){
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
};

Scene_Map.prototype.shiftDirectionFix = function(){
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
};

Scene_Map.prototype.followerGaugesControl = function(){
	for( i = 0 ; i < sxlSimpleABS.followerGauges.length ; i ++ ){
		if( sxlSimpleABS.followerGauges[i].member &&
			(sxlSimpleABS.followerGauges[i].member._hp <= 0 || 
			sxlSimpleABS.followerGauges[i].member.isStateAffected(1) || 
			(sxlSimpleABS.followerGauges[i].member.aliveTime && sxlSimpleABS.followerGauges[i].member.aliveTime <= 0 ) || 
			sxlSimpleABS.followerGauges[i].member.hideGauge == true)){
			sxlSimpleABS.followerGauges[i].opacity = 0;
		}
	}
};

Scene_Map.prototype.moveControl = function(){
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
};

Scene_Map.prototype.requestWait = function(){
	if(!sxlSimpleABS.requestWait){
		sxlSimpleABS.requestWait = 0;
	}else{
		if(sxlSimpleABS.requestWait > 0){
			sxlSimpleABS.requestWait -- ;
		}else{
			sxlSimpleABS.requestWait = 0;
		}
	}
};

Scene_Map.prototype.requestWaitShowDamge = function(){
	if(sxlSimpleABS.floatItemsInform.length){
		for( let i = 0 ; i < sxlSimpleABS.floatItemsInform.length ; i ++ ){
			if(sxlSimpleABS.requestWait == 0){
				this.showDamage( $gamePlayer , 0 , false ,false, false, false, false, sxlSimpleABS.floatItemsInform[i] )
				sxlSimpleABS.floatItemsInform.splice(i,1);
				sxlSimpleABS.requestWait = 1;
			}
		}
	}
};

Scene_Map.prototype.clearInformation = function(){
	if( this.screenInformation.buttonClear.x &&
		TouchInput.x > this.screenInformation.buttonClear.x &&
		TouchInput.x < this.screenInformation.buttonClear.x + 48 &&
		TouchInput.y > this.screenInformation.buttonClear.y - 12 &&
		TouchInput.y < this.screenInformation.buttonClear.y + 32){
		$gameParty.members()[0]._tp=0;
		this.isOnInformWindow = true;
	}else{
		this.isOnInformWindow = false;
	}
};

//更新可活动状态 窗口
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
		  (sxlSimpleShop && (sxlSimpleShop.window &&
  		  TouchInput.x > sxlSimpleShop.window.x && 
  		  TouchInput.x < sxlSimpleShop.window.x + 298 &&
  		  TouchInput.y > sxlSimpleShop.window.y &&
  		  TouchInput.y < sxlSimpleShop.window.y + 48))||
		  sxlSimpleABS.ABS_OFF==true ||
		  this.touchAttackabkeEnemy == true ||
		  this.isHandledItem){
		  $gamePlayer.battler()._tp = 0;
		// sxlSimpleItemList._isMoveable = false;
		
	}else{
		// sxlSimpleItemList._isMoveable = true;
	}
};

//更新可活动状态 角色脸图
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
		 $gamePlayer.battler()._tp = 0;
		// sxlSimpleItemList._isMoveableFace = false;
	}else{
		// sxlSimpleItemList._isMoveableFace = true;
	}
};

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
				// if(sxlSimpleABS.battlerCharacters.indexOf(events[i])<0){
					// sxlSimpleABS.battlerCharacters.push(events[i]);
				// };
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
	// if(sxlSimpleABS.battlerCharacters.indexOf(player)<0){
		// sxlSimpleABS.battlerCharacters.push(player);
	// };
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
		$gamePlayer._followers._data[i].locked = false;
		
		// if(sxlSimpleABS.battlerCharacters.indexOf($gamePlayer._followers._data[i])<0){
			// sxlSimpleABS.battlerCharacters.push($gamePlayer._followers._data[i]);
		// };
		$gamePlayer._followers._data[i].target = null;
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
		$gameParty.members()[i].player = (i == 0? $gamePlayer:$gamePlayer._followers._data[ i - 1 ])
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
			for(let lastSkills = 0 ; lastSkills < playerChar.lastSkill.length ; lastSkills ++ ){
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
				playerChar._directionFix = playerChar.storeDirectionFix;
			}
		}

		if(playerChar.rushCount && playerChar.rushCount != 0){
			playerChar.storeDirectionFix = playerChar._directionFix ;
			playerChar._directionFix = true;
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
				// this.triggerSkillnoTarget(playerChar,$gameParty.members()[i],playerChar.delaySkill[0]);
				// playerChar.delaySkill.splice(0,1);

			}
		}else{
			playerChar._directionFix = playerChar.storeDirectionFix;
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
			for( let e = 0 ; e < $gameParty.members()[i].equips() ; e ++ ){
				let equip = $gameParty.members()[i].equips()[e];
				if(equip.meta.HPSteal){
					equipsHPSteal += Number(equip.meta.HPSteal)
				}
			}
			for( let s = 0 ; s < $gameParty.members()[i].states().length ; s ++ ){
				let state =  $gameParty.members()[i].states()[s];
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
			for( let e = 0 ; e < $gameParty.members()[i].equips().length ; e ++ ){
				let equip = $gameParty.members()[i].equips()[e];
				if(equip.meta.durabilityConsFreq){
					equipsDurabilityConsFreq += Number(equip.meta.durabilityConsFreq)
				}
			}
			for( let s = 0 ; s < $gameParty.members()[i].states().length ; s ++ ){
				let state = $gameParty.members()[i].states()[s];
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
			for( let e = 0 ; e < $gameParty.members()[i].equips().length ; e ++ ){
				let equip = $gameParty.members()[i].equips()[e];
				if(equip.meta.MPSteal){
					equipsMPSteal += Number(equip.meta.MPSteal)
				}
			}
			for( let s = 0 ; s < $gameParty.members()[i].states().length ; s ++ ){
				let state = $gameParty.members()[i].states()[s];
				if(state.meta.MPSteal){
					stateMPSteal += Number(state.meta.MPSteal)
				}
			}
			$gameParty.members()[i].MPSteal = equipsMPSteal+stateMPSteal;

			//读取吟唱速度
			if(!$gameParty.members()[i].castSpeed){
				$gameParty.members()[i].castSpeed = 1;
			}
			var equipscastSpeed = 0;
			var statecastSpeed = 0;
			for( let e = 0 ; e < $gameParty.members()[i].equips().length ; e ++){
				let equip = $gameParty.members()[i].equips()[e];
				if(equip.meta.castSpeed){
					equipscastSpeed += Number(equip.meta.castSpeed)
				}
			}
			for( let s = 0 ; s < $gameParty.members()[i].states().length ; s ++ ){
				let state =  $gameParty.members()[i].states()[s];
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
			for( let e = 0 ; e < $gameParty.members()[i].equips().length ; e ++ ){
				let equip = $gameParty.members()[i].equips()[e];
				if(equip.meta.dashSkill){
					dashSkill = Number(equip.meta.dashSkill)
				}
			}
			for( let s = 0 ; s < $gameParty.members()[i].states().length ; s ++ ){
				let state = $gameParty.members()[i].states()[s];
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
					$gamePlayer.isMoving() &&
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
	for( let e = 0 ; e < $gameParty.members()[0].equips().length ; e ++ ){
		let equip = $gameParty.members()[0].equips()[e];
		if(equip.meta.energyBonus){
			equipsBonus += Number(equip.meta.energyBonus)
		}
	}
	for( let s = 0 ; s < $gameParty.members()[0].states().length ; s ++ ){
		let state = $gameParty.members()[0].states()[s];
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
			// this.triggerSkillInstantNotarget($gamePlayer,$gameParty.members()[0],$gamePlayer.castSkill)
		}else{
			// this.triggerSkillInstant($gamePlayer,$gameParty.members()[0],$gamePlayer.target,$gamePlayer.targetMember,$gamePlayer.castSkill)
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
			for( let lastSkills = 0 ; lastSkills < theEvent.lastSkill.length ; lastSkills ++){
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
		for(let j = 0 ; j < actor.equips().length ; j ++){
			let equip = actor.equips()[j];
			if(equip.meta.equipStates){
				for( let state = 0 ; state < equip.meta.equipStates.split(',').length ; state ++ ){
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
		for(var s = 0 ; s < actor._states.length ; s++){
			let state = actor._states[s];
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
		if( i > 0  && member ) {
		this.refreshFollowerGauge(sxlSimpleABS.followerGauges[i-1], follower[i-1]);
		}
		$gamePlayer._followers._data[i]._directionFix =false;
	}
	for( let f = 0 ; f < $gamePlayer._followers._data.length ; f ++ ){
		let follower = $gamePlayer._followers._data[f];
		follower.moveAngle = sxlSimpleABS.calcMoveAngle( follower, $gamePlayer )
		if(!follower.target){
			let distanceToPlayerX = Math.abs($gamePlayer.x-follower.x)
			let distanceToPlayerY = Math.abs($gamePlayer.y-follower.y)

			if( distanceToPlayerX>1 || distanceToPlayerY>1 ){
				// follower.dotMoveByDeg(follower.moveAngle);
				follower.moveTowardCharacter($gamePlayer);
			}

			if( distanceToPlayerX<1 && distanceToPlayerY<1){
				// follower.dotMoveByDeg(-follower.moveAngle);
				follower.moveAwayFromCharacter($gamePlayer);
			}
		}

		if(follower.target){
			let target = follower.target;
			let distanceX = Math.abs(follower.x - follower.target.x);
			let distanceY = Math.abs(follower.y - follower.target.y);
			let vision = Number($dataActors[follower.battler()._actorId].meta.vision);
			let range = Math.max(Number(follower.battler().cnt) * 100 + 1,1);
			// if( (distanceX > Number( vision )) || distanceY > Number( vision )){
			// 	follower.target = null;
			// }
			
			if( (target._battler && target._battler._hp>0 
				&& !target._battler.isStateAffected(1))){
				if( distanceX < range && distanceY < range){
					if(!follower.isMoving() ) follower.moveAwayFromCharacter(target);
                    this.fixDirectionTarget(follower, target)
				}else{
					if(!follower.isMoving() ) follower.moveTowardCharacter(target);
                    this.fixDirectionTarget(follower, target)
				}
			}

			if(  !follower.isStuned() 
				&& follower.battler()._tp>=99 
				&& distanceX <= range && distanceY <= range) {
				if(!follower.isMoving()&& !follower.locked) follower.moveTowardCharacter(target);
                this.fixDirectionTarget(follower, target)
				if(!follower.locked){
					let skills = follower.battler().skills();
					let selectedSkill = skills[Math.floor(Math.random()*skills.length)];
					sxlSimpleABS.useSkill(selectedSkill,follower,follower.target);
					follower.battler()._tp = 0;
				}
			}
		}	
	}
	// for( i = 0 ; i <  $gameParty.members().length ; i++ ){
	// 	var follower = $gamePlayer._followers._data;
	// 	var member = $gameParty.members()[i];
	// 	var dataMember = $dataActors[member._actorId]

	// 	if(i>=1){
	// 		if(follower[i-1].targets){
	// 			follower[i-1].target = follower[i-1].targets[0]
	// 		}
	// 		var distanceXtoPlayer = Math.abs(follower[i-1].x - $gamePlayer.x);
	// 		var distanceYtoPlayer = Math.abs(follower[i-1].y - $gamePlayer.y);
	// 	}else{
	// 		var distanceX = 0;
	// 		var distanceY = 0;
	// 	}
	// 	var disToBefX = 0;
	// 	var disToBefY = 0;
	// 	if( i > 0  && member ) {
	// 		this.refreshFollowerGauge(sxlSimpleABS.followerGauges[i-1], follower[i-1]);
	// 	}
	// 	if( i > 1 && member ){
	// 		var disToBefX = Math.abs(follower[i-1].x - follower[i-2].x);
	// 		var disToBefY = Math.abs(follower[i-1].y - follower[i-2].y);
	// 		var disToPX = Math.abs(follower[i-1].x - $gamePlayer.x);
	// 		var disToPY = Math.abs(follower[i-1].y - $gamePlayer.y);
	// 	}else if (i==1 && member) {
	// 		var disToBefX = Math.abs(follower[i-1].x - $gamePlayer.x);
	// 		var disToBefY = Math.abs(follower[i-1].y - $gamePlayer.y);
	// 	}
	// 	var range = $gameParty.members()[i].cnt * 100 + 1;
	// 	if( i>0 && 
	// 		$gameParty.members()[i]._hp > 0 && 
	// 		!member.isStateAffected(1) &&  
	// 		follower[i-1]._waitTime <= 0 && 
	// 		follower[i-1]._stun <= 0 && 
	// 		sxlSimpleItemList.canMove &&
	// 		(!follower[i-1].target ||follower[i-1].target==-1) )
	// 	{	
	// 		var memberFollowRange = dataMember.meta.followRnage?
	// 								Number(dataMember.meta.followRnage):15;
	// 		if( (distanceXtoPlayer>memberFollowRange||
	// 			distanceYtoPlayer>memberFollowRange)){
	// 			const sx = follower[i-1].x - $gamePlayer.x;
	// 			const sy = follower[i-1].y - $gamePlayer.y;
	// 			follower[i-1].jump(-sx, -sy);
	// 		};
	// 		if( i >= 1 && (disToBefX == 0 && disToBefY == 0)){
	// 			if( !follower[i-1].isMoving()) follower[i-1].moveRandom();
	// 		}
	// 		if( i > 1 && member && (disToPX == 0 && disToPY == 0)){
	// 			if( !follower[i-1].isMoving()) follower[i-1].moveRandom();
	// 		}
	// 		if(distanceXtoPlayer > 2 || distanceYtoPlayer > 2){
	// 			if( !follower[i-1].isMoving() ) follower[i-1].moveTowardPlayer();
	// 		}else if (distanceXtoPlayer < 1 && distanceYtoPlayer < 1){
	// 			if( !follower[i-1].isMoving() ) follower[i-1].moveAwayFromPlayer();
	// 		}
			
	// 	}
	// 	if( i >= 1 && Input.isLongPressed( 't' ) ){
	// 		const sx = follower[i-1].x - $gamePlayer.x;
	// 		const sy = follower[i-1].y - $gamePlayer.y;
	// 		follower[i-1].jump(-sx, -sy);
	// 	}
	// 	if( i>0 && follower[i-1].target
	// 		&& $gameParty.members()[i]._hp > 0
	// 		&& !member.isStateAffected(1)
	// 		&& $gameParty.members()[i].player.isAttack <= 0 
	// 		&& (sxlSimpleItemList.canMove )){
	// 		if( follower[i-1].target
	// 			&& follower[i-1].target._battler 
	// 			&& follower[i-1]._waitTime <= 0 
	// 			&& follower[i-1]._stun <= 0 ){
	// 			var target = follower[i-1].target;
				
	// 			if($gameMap.events()[follower[i-1].target]){
	// 				var targetX = target.x;
	// 				var targetY = target.y;
	// 			}
	// 			var distanceX = Math.abs(follower[i-1].x - targetX);
	// 			var distanceY = Math.abs(follower[i-1].y - targetY);
	// 			var meta = $dataActors[member._actorId].meta;
	// 			var metaVision = meta.vision ? Number( meta.vision ) : 1 ;
	// 			var random = (Math.random() >= 0.5) ? 1 : -1 ;
				
				

	// 			if( distanceX < 0 ){
	// 				var canThrough = $gameMap.isPassable( follower[i-1].x - 1, follower[i-1].y, follower[i-1]._direction )
	// 			}
	// 			if( distanceX > 0 ){
	// 				var canThrough = $gameMap.isPassable( follower[i-1].x + 1, follower[i-1].y, follower[i-1]._direction )
	// 			}
	// 			if( distanceY < 0 ){
	// 				var canThrough = $gameMap.isPassable( follower[i-1].x ,follower[i-1].y - 1, follower[i-1]._direction )
	// 			}
	// 			if( distanceY > 0 ){
	// 				var canThrough = $gameMap.isPassable( follower[i-1].x ,follower[i-1].y + 1, follower[i-1]._direction )
	// 			}
	// 			if( !target ||
	// 				!target._battler ||
	// 				target._battler._hp<=1 || 
	// 				distanceX > Number( metaVision ) ||
	// 				distanceY > Number( metaVision ) ||
	// 				!canThrough
	// 				){
	// 				follower[i-1].target = null;
	// 			}
	// 		};
	// 	};
	// };
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
			for( let s = 0 ; s < $gameMap.events()[i]._battler._states.length ; s ++){
				let state = $gameMap.events()[i]._battler._states[s];
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
				if($gameMap.events()[i]._battler._aggro[0]){
					var theGoal = $gameActors.actor($gameMap.events()[i]._battler._aggro[0]).player;
				}
				if( theGoal ){
					var goalActor = theGoal.battler()
					var distanceX = Math.abs($gameMap.events()[i].x - theGoal.x);
					var distanceY = Math.abs($gameMap.events()[i].y - theGoal.y);
					if( goalActor &&
						!$gameMap.events()[i].isMoving() && 
						$gameMap.events()[i]._battler._hp > 0 &&
						!goalActor.player.vanish ){
						if( distanceX > range || distanceY > range ){
							$gameMap.events()[i]._moveFrequency = 5;
							if(!dataEnemy.meta.cantMove && !$gameMap.events()[i].locked ) $gameMap.events()[i].moveTowardCharacter(theGoal);
                            this.fixDirectionTarget($gameMap.events()[i],theGoal);
						}else if( distanceX < range && distanceY < range ){
							$gameMap.events()[i]._moveFrequency = 5;
							if(!dataEnemy.meta.cantMove && !$gameMap.events()[i].locked) $gameMap.events()[i].moveAwayFromCharacter(theGoal);
                            this.fixDirectionTarget($gameMap.events()[i],theGoal);
						};
					}else if( goalActor && ( goalActor._hp<=0 || goalActor.player.vanish) ){
						$gameMap.events()[i]._moveFrequency = 5;
						$gameMap.events()[i]._battler._aggro.splice( 0, 1 );
					};
					$gameMap.events()[i].target = theGoal;
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
					if($gameMap.events()[j]._battler._aggro.indexOf(target.battler()._actorId)<0){
						$gameMap.events()[j]._battler._aggro.push( target.battler()._actorId ) ;
						target._tgr += 10 ;
					}
					target._tgr += 0.1 ;
				};
			};
		};
	};
	for(let e = 0 ; e < $gameMap.events().length ; e ++){
		let event = $gameMap.events()[e];
		for(let f = 0 ; f < $gamePlayer._followers._data.length ; f ++ ){
			let follower = $gamePlayer._followers._data[f];
			follower.target = null;
			if(follower.battler() && event.battler()){
				let distanceToPlayerX = Math.abs($gamePlayer.x-follower.x)
				let distanceToPlayerY = Math.abs($gamePlayer.y-follower.y)
				let distanceX = Math.abs(follower.x - event.x);
				let distanceY = Math.abs(follower.y - event.y);
				let vision = Number($dataActors[follower.battler()._actorId].meta.vision);
				let range = follower.battler().cnt * 100 + 1;
				
				// if(follower.target && ( follower.target.battler()._hp<=0 || follower.target.battler().isStateAffected(1)
				//   || (distanceX > vision || distanceY > vision))){
					
				// }
				if(sxlSimpleABS.commonTarget && !follower.target){
					follower.target = sxlSimpleABS.commonTarget;
				}
				if(!sxlSimpleABS.commonTarget){
					follower.target = null;
				}
				if( !follower.target && (distanceX <= vision && distanceY <= vision)){
					follower.target = event;
				}
			}
		}
	}
	
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
		
		for( k = 0 ; k < $gameParty.members()[i].skills().length ; k++ ){
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
	
	for( let i = 0 ; i < $gameMap.events().length ; i ++ ){
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
	for( let j = 0 ; j < $gameMap.events().length ; j ++ ){
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
	if(TouchInput.isPressed() && $gamePlayer.isAttack <= 1){
		this.fixDirection($gamePlayer);
	};
	if(TouchInput.isPressed() 
		&& !$gamePlayer.sequence.length > 0
		&& this.skillUsable($gamePlayer,$dataSkills[$gamePlayer.battler().attackSkillId()])){
		this.fixDirection($gamePlayer)
		if( $gamePlayer.battler()._tp >= 100){
			sxlSimpleABS.useSkill($dataSkills[$gamePlayer.battler().attackSkillId()],$gamePlayer)
			for( let e = 0 ; e < $gamePlayer.battler().equips().length ; e ++ ){
				let equip = $gamePlayer.battler().equips()[e];
				if(equip && equip.meta.triggerSkill){
					let random = Math.random();
					let triggerSkill;
					if(equip.meta.triggerSkill.split(',')[1]){
						let length = equip.meta.triggerSkill.split(',').length-1;
						let randomSkill = Math.floor(Math.random()*length);
						triggerSkill = $dataSkills[Number(equip.meta.triggerSkill.split(',')[randomSkill+1])];
					}
					let triggerNumber = equip.meta.triggerSkill.split(',')[0]?Number(equip.meta.triggerSkill.split(',')[0]):1;
					if(random<triggerNumber){
						sxlSimpleABS.useSkill(triggerSkill,$gamePlayer)
					}
				}
			}
			$gamePlayer.battler()._tp -= 100;
		}
		
	};
	if( TouchInput.isCancelled() 
		&& $gamePlayer.rightClickSkillSCId
		&& this.shorcutItem[Number($gamePlayer.rightClickSkillSCId)].cd<=0
		&& !this.itemInform
		&& this.isMoveable) {
		this.fixDirection($gamePlayer)
		let scId = Number($gamePlayer.rightClickSkillSCId)+1;
		if( $gameVariables.value(scId).stypeId){
			let skill = ($gameVariables.value(scId));
			if(!$gamePlayer.sequence.length > 0 || skill.meta.forced){
				if(this.skillUsable($gamePlayer,skill)){
					sxlSimpleABS.useSkill(skill,$gamePlayer)
				}
			}
		}else{
			let item = ($gameVariables.value(scId));
			sxlSimpleABS.useItem(item,$gamePlayer)
		}
	}
};

Scene_Map.prototype.fixDirection = function(user){
	var xDist = TouchInput.x - user.screenX();
	var yDist = TouchInput.y - (user.screenY()-24);
	var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
	if(sxlSimpleABS._2direction == true){
		if(TouchInput.x <= user.screenX()){
			user._direction=2;
		}else{
			user._direction=4;
		}
	}else{
        user._direction8dir = 0;
        if(angle>30&&angle<60){
            user._direction8dir=3;
        }else if(angle>120&&angle<150){
            user._direction8dir=1;
        }else if(angle>-150&&angle<-120){
            user._direction8dir=7;
        }else if(angle>-60&&angle<-30){
            user._direction8dir=9;
        }
		if(angle>45&&angle<135){
			user._direction=2;
		}else if(angle>-45&&angle<45){
			user._direction=6;
		}else if(angle>-135&&angle<-45){
			user._direction=8;
		}else{
			user._direction=4;
		}
	}
};

Scene_Map.prototype.fixDirectionTarget = function(user,target){
    var xDist = target.screenX() - user.screenX();
    var yDist = target.screenY() - (user.screenY()-24);
    var angle = 180*Math.atan2(yDist,xDist)/Math.PI;
    if(sxlSimpleABS._2direction == true){
        if(target.screenX() <= user.screenX()){
            user._direction=2;
        }else{
            user._direction=4;
        }
    }else{
        user._direction8dir = 0;
        if(angle>30&&angle<60){
            user._direction8dir=3;
        }else if(angle>120&&angle<150){
            user._direction8dir=1;
        }else if(angle>-150&&angle<-120){
            user._direction8dir=7;
        }else if(angle>-60&&angle<-30){
            user._direction8dir=9;
        }
        if(angle>45&&angle<135){
            user._direction=2;
        }else if(angle>-45&&angle<45){
            user._direction=6;
        }else if(angle>-135&&angle<-45){
            user._direction=8;
        }else{
            user._direction=4;
        }
    }
};


Scene_Map.prototype.skillUsable = function(user,skill){
	return (!user.locked && 
			!user.isStuned() && 
			user.battler()._mp >= skill.mpCost);
};




Scene_Map.prototype.enemyAction = function(){
	for(let i = 0 ; i < $gameMap.events().length ; i ++ ){
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
				for( let action = 0 ; action < $gameMap.events()[i]._battler.eactionsArray.length ; action ++  ){
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
				for( let action = 0 ; action < $gameMap.events()[i]._battler.canUseAction.length ; action ++ ){
					var actionRateRandom = Math.random()*9;
					if(actionRateRandom<=$gameMap.events()[i]._battler.canUseAction[action].rating){
						skill = $dataSkills[$gameMap.events()[i]._battler.canUseAction[action].skillId];
					}
				};
				userChar.rushCount = 0;
				if(userChar.target){
					var playerTeam = userChar.target;
					var skillCast = skill.meta.cast?
									Number(skill.meta.cast):1;
					let distanceX = Math.abs(playerTeam.x - $gameMap.events()[i].x);
					let distanceY = Math.abs(playerTeam.y - $gameMap.events()[i].y);
					var skillDistanceMeta = skill.meta.distance?Number(skill.meta.distance):1;
					var skillDistance = user.cnt * 100 + skillDistanceMeta ;
					if( distanceX <= skillDistance && 
						distanceY <= skillDistance && 
						$gameMap.events()[i]._battler._tp >= 100 &&
						! userChar.locked &&
						$gameParty.members()[j]._hp > 0 &&
						!$gameParty.members()[j].isStateAffected(1) &&
						!$gameParty.members()[j].player.vanish)
						{	
							$gameMap.events()[i]._battler._tp -= 100;
							// console.log($gameMap.events()[i]._battler._tp)
							$gameMap.events()[i].turnTowardCharacter(playerTeam);
							sxlSimpleABS.useSkill(skill,userChar,userChar.target)

					};
				}
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
		if(isAffectedEnemies&&animation&&!result.missed&&!result.evaded){
			$gameTemp.requestAnimation(isAffectedEnemies,animation,false);
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
	if(target&&!result.missed&&!result.evaded){
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
                // if(!target.isJumping()){
                target.jump(0,0,Number(skill.meta.hitHeight));
                // }
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
		for( let effect = 0 ; effect < skill.effects.length ; effect++ ){
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
	if(action){
		action.setItemObject(skill);
		action.apply(target.battler());

	}
	
	// 处理伤害时的特效
	for( let s = 0 ; s < target.battler().states().length ; s ++ ){
		let state = target.battler().states()[s];
		if(state.meta.damageSkill){
			var damageSkill = $dataSkills[state.meta.damageSkill.split(',')[0]];
			if(state.meta.damageSkill.split(',')[1]){
				var rate = state.meta.damageSkill.split(',')[1];
			}else{
				var rate = 1;
			}
			
			var random = Math.random();
			if(random<=rate){
				target.sequence.unshift({stepName:'trigger',stepParam: damageSkill});
			}
		}
	};
	var result = target._battler._result;
	var hpDamageNumber = result.hpDamage;
	var mpDamageNumber = result.mpDamage;
	//吸血判定
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
	if(result.missed){
		this.showDamage(target, 'MISS', result.critical, result.evaded, result.missed, result.drain, skill,null, result, 0);
	}
	if(result.evaded){
		this.showDamage(target, 'EVADE', result.critical, result.evaded, result.missed, result.drain, skill,null, result, 0);
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
	if( userFix && target._battler._aggro.indexOf(userFix) >= 0 ){
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
		if(result.missed){
			this.showDamage(target, 'MISS', result.critical, result.evaded, result.missed, result.drain, skill,null, result, 0);
		}
		if(result.evaded){
			this.showDamage(target, 'EVADE', result.critical, result.evaded, result.missed, result.drain, skill,null, result, 0);
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
		for( let s = 0 ; s < targetBattler.states().length ; s ++  ){
			let state = targetBattler.states()[s];
			if(state.meta.damageSkill){
				var damageSkill = $dataSkills[state.meta.damageSkill.split(',')[0]];
				if(state.meta.damageSkill.split(',')[1]){
					var rate = state.meta.damageSkill.split(',')[1];
				}else{
					var rate = 1;
				}
				
				var random = Math.random();
				if(random<=rate){
					target.sequence.unshift({stepName:'trigger',stepParam: damageSkill});
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

Scene_Map.prototype.refreshLeaderGauge = function(user){
	if(this.leaderGauge && $gameParty.members()[0]){
		// user.bitmap.clear();
		this.leaderGauge.bitmap.clear();
		var line = 0 ; 
		var lineHeight = 14
		var rate = $gameParty.members()[0]._hp / $gameParty.members()[0].mhp;
		var rateMp = $gameParty.members()[0]._mp /  $gameParty.members()[0].mmp;
		var rateTp = $gameParty.members()[0]._tp / 100;
		var rateEnergy = $gamePlayer.energy / $gamePlayer.energyMax;
		var name = $dataActors[$gameParty.members()[0]._actorId].name;
		var label = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.label
		var stunRate =  user._stun / user._stunMax;
		var skillCast = user.skillCast?
						Number(user.skillCast):0;
		var waitTimeRate = $gamePlayer.waitForCast / ( $gameParty.members()[0].castSpeed * skillCast ) ;
		var totalHeight = sxlSimpleABS.padding*3+sxlSimpleABS.gaugeHeight+sxlSimpleABS.gaugeHeightMP;

		this.splash = $gameParty.members()[0].damageHp;
		var splashRate = this.splash / $gameParty.members()[0].mhp;
		this.leaderGauge.x = user.screenX();
		this.leaderGauge.y = user.screenY() + sxlSimpleABS.offsetY;
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

		// 耐力值
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
		if( $gamePlayer.waitForCast > 1 ){
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
				
				let userMember = $gameParty.members();
				let stateId = userMember[0]._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(userMember[0]._stateTurns[stateId]/60*10)/10;
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

Scene_Map.prototype.refreshFollowerGauge = function(gauge, user){
	if(user){
		gauge.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		var rate = $gameParty.members()[user._memberIndex]._hp / $gameParty.members()[user._memberIndex].mhp;
		var name = $dataActors[$gameParty.members()[user._memberIndex]._actorId].name;
		var rateTp = $gameParty.members()[user._memberIndex]._tp / 100;
		var skillCast = $dataSkills[$gameParty.members()[user._memberIndex].attackSkillId()].meta.cast?
						Number($dataSkills[$gameParty.members()[user._memberIndex].attackSkillId()].meta.cast):0;
		var stunRate =  user._stun/user._stunMax;
		
		var waitTimeRate =  $gamePlayer._followers._data[ user._memberIndex - 1 ]._waitTime / 
							($gameParty.members()[user._memberIndex].castSpeed * skillCast ) ;
		var totalHeight = sxlSimpleABS.padding*2+sxlSimpleABS.gaugeHeight;
		totalHeight = sxlSimpleABS.padding*3+sxlSimpleABS.gaugeHeight+sxlSimpleABS.gaugeHeightMP;
		let color = $dataActors[user.battler()._actorId].meta.textColor?
					 ColorManager.textColor(Number($dataActors[user.battler()._actorId].meta.textColor)):'#ffffff';

		if( rate <= 0.3 ){
			gauge.fontColor = '#FFFF00';
		}else{
			gauge.fontColor = '#FFFFFF';
		}
		gauge.x = user.screenX();
		gauge.y = user.screenY() + sxlSimpleABS.offsetY;
		gauge.member = $gameActors.actor($gameParty.members()[user._memberIndex]._actorId)
		gauge.splash = $gameParty.members()[user._memberIndex].damageHp;
		var splashRate = gauge.splash / $gameParty.members()[user._memberIndex].mhp;
		var label = $gameParty.members()[user._memberIndex].equips()[sxlSimpleABS.labelEtypeID-1].meta.label
		gauge.bitmap.fontSize = 12;
		gauge.bitmap.smooth = false;

		if(sxlSimpleABS.isTouchingCharacter(user)){

			$gameTemp.requestAnimation([user],126);
			gauge.bitmap.textColor = '#ffffff';
			if( $gameParty.members()[user._memberIndex].aliveTime ){
				gauge.bitmap.drawText('时间:'+Math.floor($gameParty.members()[user._memberIndex].aliveTime/60)+'秒',gauge.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
				line++
			}
			if(user.battler()._hp>9999999){
				gauge.bitmap.drawText('(???)',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
			}else{
				gauge.bitmap.drawText('('+Math.floor(user.battler()._hp)+')',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
			}
			line++
			gauge.bitmap.textColor = color;
			gauge.bitmap.drawText(name,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
		}
		// gauge.bitmap.drawText(name,gauge.width/2-24,80-lineHeight,sxlSimpleABS.gaugeWidth,lineHeight,'center');
		gauge.bitmap.fillRect(gauge.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		gauge.bitmap.gradientFillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);
		gauge.bitmap.gradientFillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeightMP,'#606060','#404040',true);

		gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');



		gauge.bitmap.fillRect(gauge.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		gauge.bitmap.smooth = false;
		if( $gameParty.members()[user._memberIndex].aliveTime){

			var aliveTimeRate = $gameParty.members()[user._memberIndex].aliveTime/$gameParty.members()[user._memberIndex].aliveTimeMax;
			// console.log($gameParty.members()[user._memberIndex].aliveTime+'/'+$gameParty.members()[user._memberIndex].aliveTimeMax)
			gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*aliveTimeRate,sxlSimpleABS.gaugeHeightMP,'#FFD700');
		}else{
			gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateTp,sxlSimpleABS.gaugeHeightMP,'#FFFFFF');
			gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rateTp,1,'#ffffff');
		}
		gauge.bitmap.fillRect(gauge.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');
		gauge.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		if( waitTimeRate > 0 ){
			if(waitTimeRate>1){
				gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),sxlSimpleABS.gaugeHeightMP,'#800000');
			}else{
				gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),sxlSimpleABS.gaugeHeightMP,'#BA55D3');
			}
			
		};
		if(label){
			line ++ ;
			gauge.bitmap.textColor1 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor?
										ColorManager.textColor(Number( $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor )):ColorManager.textColor(0);
			gauge.bitmap.textColor2 = $gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2?
										ColorManager.textColor(Number($gameParty.members()[0].equips()[sxlSimpleABS.labelEtypeID-1].meta.textColor2)):gauge.bitmap.textColor1;
			gauge.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center',gauge.bitmap.textColor1,gauge.bitmap.textColor2);
		}
		if(  $gameParty.members()[user._memberIndex]._states.length > 0 ){
			for( j = 0 ; j < $gameParty.members()[user._memberIndex]._states.length ; j ++ ){
				
				let userMember = $gameParty.members();
				let stateId = userMember[user._memberIndex]._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(userMember[user._memberIndex]._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) gauge.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						gauge.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
					}else{
						gauge.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) gauge.bitmap.textColor = '#ffffff';
				}
			};
		}	
	}
};

Scene_Map.prototype.refreshEnemiesGauge = function(gauge, user){

	if(user._battler._hp<=0 || !user._battler || user._battler.isStateAffected(1)){
		gauge.opacity = 0;
	}else{
		if( (Math.abs($gamePlayer.x - user.x <= sxlSimpleABS.hideRange) && 
			Math.abs($gamePlayer.y - user.y <= sxlSimpleABS.hideRange) && 
			$gameVariables.value(sxlSimpleABS.opacityVarID)>0) ||
			sxlSimpleABS.isTouchingCharacter(user) ){
			gauge.opacity += 10;
		}else if( (Math.abs($gamePlayer.x - user.x > sxlSimpleABS.hideRange)  || 
			Math.abs($gamePlayer.y - user.y > sxlSimpleABS.hideRange)) && 
			$gameVariables.value(sxlSimpleABS.opacityVarID)>0 ){
			gauge.opacity -= 10;
		}else{
			gauge.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		}
	}
	if(gauge && user._battler && gauge.opacity > 0 ){
		gauge.bitmap.clear();
		var line = 0 ;
		var lineHeight = 14;
		let rate = user._battler._hp / user._battler.mhp;
		gauge.splash = user._battler.damageHp;
		var splashRate = gauge.splash / user._battler.mhp;

		let name = $dataEnemies[user._battler._enemyId].name;
		let color = $dataEnemies[user._battler._enemyId].meta.textColor?
					 ColorManager.textColor(Number($dataEnemies[user._battler._enemyId].meta.textColor)):'#ffffff';
		var rateTp = user._battler._tp / 100;
		var stunRate =  user._stun / user._stunMax;
		var skillCast = $dataSkills[user._battler.attackSkillId()].meta.cast?
						Number($dataSkills[user._battler.attackSkillId()].meta.cast):1;
		var waitTimeRate = user._waitTime / ( skillCast);
		var totalHeight = sxlSimpleABS.padding*2+sxlSimpleABS.gaugeHeight;
		var label = $dataEnemies[user._battler._enemyId].meta.label
		gauge.x = user.screenX();
		gauge.y = user.screenY() + sxlSimpleABS.offsetY;
		gauge.bitmap.fontSize = 12;
		

		gauge.bitmap.fontSize = 12;
		gauge.bitmap.smooth = false;
		if(sxlSimpleABS.isTouchingCharacter(user)){
			$gameTemp.requestAnimation([user],126);
			sxlSimpleABS.commonTarget = user;
			gauge.bitmap.textColor = '#ffffff'
			if(user._battler._hp>9999999){
				gauge.bitmap.drawText('(???)',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
			}else{
				gauge.bitmap.drawText('('+Math.floor(user._battler._hp)+')',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
			}
			line++
			gauge.bitmap.textColor = color;
			gauge.bitmap.drawText(name,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
		}
		
		gauge.bitmap.fillRect(gauge.width/2-24,80,sxlSimpleABS.gaugeWidth,totalHeight,'#696969');
		gauge.bitmap.gradientFillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2,sxlSimpleABS.gaugeHeight,'#606060','#404040',true);

		gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,sxlSimpleABS.gaugeHeight,'#DC143C');
		gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.padding,(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,1,'#ffffff');

		gauge.bitmap.fillRect(gauge.width/2-24+(sxlSimpleABS.gaugeWidth-sxlSimpleABS.padding*2)*rate,80+sxlSimpleABS.padding,splashRate*sxlSimpleABS.gaugeWidth,sxlSimpleABS.gaugeHeight,'#FFFFFF');
		gauge.bitmap.smooth = false;
		gauge.bitmap.fillRect(gauge.width/2-24,80+sxlSimpleABS.gaugeHeight,sxlSimpleABS.gaugeWidth*stunRate,sxlSimpleABS.gaugeHeightMP,'#000000');	
		// gauge.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID)
		

		if( waitTimeRate > 0 ){
			if(waitTimeRate>1){
				gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(waitTimeRate-1),sxlSimpleABS.gaugeHeightMP,'#800000');
			}else{
				gauge.bitmap.fillRect(gauge.width/2-24+sxlSimpleABS.padding,80+sxlSimpleABS.gaugeHeight+sxlSimpleABS.padding*2,sxlSimpleABS.gaugeWidth*(1-waitTimeRate),sxlSimpleABS.gaugeHeightMP,'#BA55D3');
			}
		};
		if(label){
			line ++ ;
			gauge.bitmap.textColor1 = $dataEnemies[user._battler._enemyId].meta.labelTextColor?
										ColorManager.textColor(Number( $dataEnemies[user._battler._enemyId].meta.labelTextColor)):ColorManager.textColor(0);
			gauge.bitmap.textColor2 = $dataEnemies[user._battler._enemyId].meta.labelTextColor2?
										ColorManager.textColor(Number($dataEnemies[user._battler._enemyId].meta.labelTextColor2)):gauge.bitmap.textColor1;
			gauge.bitmap.drawTextGradient(label,0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center',gauge.bitmap.textColor1,gauge.bitmap.textColor2);
		}
		if(  user._battler._states.length > 0 ){
			for( j = 0 ; j <  user._battler._states.length ; j ++ ){
				
				let userMember =  user._battler;
				let stateId = user._battler._states[j];
				let state = $dataStates[stateId].name;
				let stateIndata = $dataStates[stateId];
				let stateSteps = Math.floor(userMember._stateTurns[stateId]/60*10)/10;
				if(!stateIndata.meta.hideOnCharacter){
					line ++ ;
					if(stateIndata.meta.textColor) gauge.bitmap.textColor = ColorManager.textColor(Number(stateIndata.meta.textColor))
					if( stateSteps != 0 ){
						gauge.bitmap.drawText('['+state+':'+stateSteps+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
					}else{
						gauge.bitmap.drawText('['+state+']',0,80-lineHeight/2-(line * lineHeight+totalHeight-sxlSimpleABS.padding),gauge.width,lineHeight,'center');
					}
					if(stateIndata.meta.textColor) gauge.bitmap.textColor = '#ffffff';
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
		if(sxlSimpleABS.informationClearAlign=='left'){
			this.screenInformation.bckGrd.bitmap.gradientFillRect(sxlSimpleABS.informationWindowX-24,0,400,this.screenInformation.height/2+7,'#000000','#ffffff',false);
		}else{
			this.screenInformation.bckGrd.bitmap.gradientFillRect(sxlSimpleABS.informationWindowX-24,0,400,this.screenInformation.height/2+7,'#000000','#000000',false);
		}
		
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
		this.screenInformation.buttonClear.bitmap.gradientFillRect(sxlSimpleABS.informationWindowX,34,400,32,'#000000','#ffffff',false);
		this.screenInformation.buttonClear.bitmap.drawText('  清空',sxlSimpleABS.informationWindowX,0,400,100,sxlSimpleABS.informationClearAlign);
	}


	this.screenInformation.opacity = $gameVariables.value(sxlSimpleABS.opacityVarID);
	this.screenInformation.bitmap.clear();
	this.screenInformation.bitmap.fontFace = $gameSystem.mainFontFace();
	this.screenInformation.bitmap.fontSize = fontSize;
	this.screenInformation.x = sxlSimpleABS.informationWindowX;
	this.screenInformation.anchor.x = 0;
	this.screenInformation.anchor.y = 0;
	var lineHeight = this.screenInformation.bitmap.fontSize + 2 ;
	this.screenInformation.y = sxlSimpleABS.informationWindowY;//Graphics.height - this.screenInformation.height/2 - padding ;
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


Scene_Map.prototype.refreshAttackSkill = function(){
	for( let k = 0 ; k < $gameParty.members().length ; k ++ ){
		for( let i = 0; i < $dataActors[$gameParty.members()[k]._actorId].traits.length ; i ++ ){
			if($dataActors[$gameParty.members()[k]._actorId].traits[i].code == 35){
				$gameParty.members()[k]._attackSkillId1 = $dataActors[$gameParty.members()[k]._actorId].traits[i].dataId;
			}
		}
		for( let i = 0; i < $gameParty.members()[k].weapons()[0].traits.length ; i ++){
			if($gameParty.members()[k].weapons()[0].traits[i].code == 35){
				$gameParty.members()[k]._attackSkillId1 = $gameParty.members()[k].weapons()[0].traits[i].dataId;
			}
		}
		for( let i = 0 ; i < $gameParty.members()[k]._states.length ; i ++ ){
			if( $gameParty.members()[k]._states[i] ){
				for( let j = 0 ; j < $dataStates[$gameParty.members()[k]._states[i]].traits.length ; j ++ ){
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
	if ( $gamePlayer._waitTime > 0 
		|| $gamePlayer.isStuned() 
		|| $gamePlayer.locked
		|| ( (sxlSimpleABS.moveAttackMode&&sxlSimpleABS.attackMoveable) ? false : this.waitForMotion > 0) 
		|| (!sxlSimpleABS.moveAttackMode&&(!sxlSimpleItemList.canMove 
		|| !sxlSimpleItemList._isMoveable 
		|| !sxlSimpleItemList._isMoveableFace)))
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
	// if (Math.abs(xPlus) > Math.abs(yPlus)) {
	// 	if (xPlus !== 0) {
	// 		this.setDirection(xPlus < 0 ? 4 : 6);
	// 	}
	// } else {
	// 	if (yPlus !== 0) {
	// 		this.setDirection(yPlus < 0 ? 8 : 2);
	// 	}
	// }
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
	
    if( SSMBS_Window_Inventory.firstEmptyGrid<=($gameParty.inventorySize*SSMBS_Window_Inventory.gridsPerLine-1)||amount<0 ){
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
            if(!item.position){
                item.position = sxlSimpleItemList.firstEmptyGrid+1;
            }
            $gameMap.requestRefresh();
        }
        if(sxlSimpleItemList.itemShow ){
             sxlSimpleItemList.smp.createItems()
             sxlSimpleItemList.smp.createEquips()
        }
    }else{
        if(item.itypeId){
            var type = 'item';
        } 
        if(item.wtypeId){
            var type = 'weapon';
        } 
        if(item.atypeId){
            var type = 'armor';
        } 
        let amount = $gameParty.numItems(item);
        ssmbsLoot.loot('aroundPlayer',type,item.id,amount);
                    
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
        if(!item.position){
            item.position = sxlSimpleItemList.firstEmptyGrid;
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
        for( let i = 0 ; i < sxlSimpleABS.followerGauges.length ; i ++ ){
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
		for (let e = 0 ; e < this.item().effects.length ; e ++ ) {
			let effect = this.item().effects[e];
			this.applyItemEffect(target, effect);
		}
		this.applyItemUserEffect(target);
	}
	this.updateLastTarget(target);
};

DataManager.saveGame = function(savefileId) {
	if(sxlSimpleABS.damages.length>0 ){
		for( let i = 0 ; i < sxlSimpleABS.damages.length ; i ++ ){
			sxlSimpleABS.damages[i].opacity = 0 ;
		}
		sxlSimpleABS.showInformation(      
		'【系统】正在清理战斗冗杂文件，请再次点击快速存档', 
		ColorManager.textColor(10)
		)
		for( let e = 0 ; e < $gameMap.events().length ; e ++ ){
			let event = $gameMap.events()[e];
			if(event.light){
				event.light.destroy();
				event.light = null;
			}
		}
		for(let m = 0 ; m < $gameParty.members().length ; m ++ ){
			let member = $gameParty.members()[m]
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
	if(this && this.battler()){
		for( let s = 0 ; s < this.battler().states().length ; s ++ ){
			let state =  this.battler().states()[s];
			if(state.restriction == 4){
				stunState++;
			}
		}
		return stunState>0;
	}else{
		return false;
	}
	
};

Game_Character.prototype.spriteIndex = function(){
	if(sxlSimpleABS.spritesetMap){
		for( let c = 0 ; c < sxlSimpleABS.spritesetMap._characterSprites.length ; c ++ ){
			let charSprite = sxlSimpleABS.spritesetMap._characterSprites[c];
			if(charSprite._character == this){
				return charSprite;
			}
		}
	}
	
};


sxlSimpleABS.isTouchingCharacter = function(target){
	if( target.spriteIndex() && 
		TouchInput.x > target.spriteIndex()._bounds.minX && TouchInput.x < target.spriteIndex()._bounds.maxX &&
		TouchInput.y > target.spriteIndex()._bounds.minY && TouchInput.y < target.spriteIndex()._bounds.maxY){
		return true;
	}
}

sxlSimpleABS.openItemWindow = function(){
	SoundManager.playCursor();
	sxlSimpleABS.smp.isHandledItem = null;
	sxlSimpleItemList.itemShow = true;
	sxlSimpleItemList.canMove = true;
	sxlSimpleABS.smp._active = true;
	sxlSimpleABS.smp.createBackbag();
	sxlSimpleABS.smp.createEquips();
	sxlSimpleABS.smp.createItems();
	for(i = 0 ; i < sxlSimpleABS.smp.itemArray.length ; i ++){
		sxlSimpleABS.smp.itemArray[i].bitmap.retry();
	};
	sxlSimpleABS.smp.createBackbag();
	sxlSimpleABS.smp.createEquips();
	sxlSimpleABS.smp.createItems();
};

sxlSimpleABS.openSkillWindow = function(){
	SoundManager.playCursor();
	if(sxlSimpleABS.smp.openSkillWindow == true){

		// sxlSimpleABS.smp.skillWindowSaveX = sxlSimpleABS.smp.skillWindow.x;
		// sxlSimpleABS.smp.skillWindowSaveY = sxlSimpleABS.smp.skillWindow.y;
		// sxlSimpleABS.smp.skillWindow.x = 999999;
		// sxlSimpleABS.smp.skillWindow.y = 999999;
		// sxlSimpleABS.smp.openSkillWindow = false;
	}else{
		if(sxlSimpleABS.smp.skillWindow){
			sxlSimpleABS.smp.skillWindow.x = sxlSimpleABS.smp.skillWindowSaveX;
			sxlSimpleABS.smp.skillWindow.y = sxlSimpleABS.smp.skillWindowSaveY;
		};
		sxlSimpleABS.smp.openSkillWindow = true;
	}
};

sxlSimpleABS.openQuestWindow = function(){
	SoundManager.playCursor();
	sxlSimpleABS.smp.openQuestWIndow = true ;
	if(sxlSimpleABS.smp.background){
		sxlSimpleABS.smp.background.x = sxlSimpleABS.smp.questWindowSaveX ;
		sxlSimpleABS.smp.background.y = sxlSimpleABS.smp.questWindowSaveY ;
	}
};