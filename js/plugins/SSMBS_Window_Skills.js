//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Skill Window
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简单的技能窗口
 * @author 神仙狼
 *	
 */



var SSMBS_Window_Skills = SSMBS_Window_Skills||{};

SSMBS_Window_Skills.windowTitle = '技 能';
SSMBS_Window_Skills.hotKey = 'k';
SSMBS_Window_Skills.width = 298;
SSMBS_Window_Skills.height = 498;

SSMBS_Window_Skills.defaultX = 800;
SSMBS_Window_Skills.defaultY = 200;

SSMBS_Window_Skills.fontSize = 12;
SSMBS_Window_Skills.startX = 96;
SSMBS_Window_Skills.wordStartX = 18;
SSMBS_Window_Skills.startY = 48;
SSMBS_Window_Skills.wordStartY = SSMBS_Window_Skills.height-SSMBS_Window_Skills.fontSize*3;;
SSMBS_Window_Skills.gridsSize = 32;
SSMBS_Window_Skills.gridsSpace = 18;
SSMBS_Window_Skills.gridsPerLine = 4;
SSMBS_Window_Skills.gridsLines = 12;

SSMBS_Window_Skills.SkillListButtonLine = 11.13;
SSMBS_Window_Skills.wordStartY = SSMBS_Window_Skills.SkillListButtonLine*SSMBS_Window_Skills.fontSize*3+SSMBS_Window_Skills.startY+6;
SSMBS_Window_Skills.SkillListSpace = 40;
SSMBS_Window_Skills.SkillListFirst = 0;

SSMBS_Window_Skills.drawWindowY = 32;

SSMBS_Window_Skills.nowSkillTree = 0;


const _SSMBS_Window_Skills_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_SSMBS_Window_Skills_mapLoad.call(this);
	this.createSkillWindow();
	SSMBS_Window_Skills.isOpen = false;
	for(i = 0 ; i < $gameParty.members().length ; i ++ ){
		this.loadSkillLevel($gameParty.members()[i]);
	}
};

const _SSMBS_Window_Skills_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_SSMBS_Window_Skills_mapUpdate.call(this);
	if(SSMBS_Window_Skills.isOpen){
		this.updateSkillWindow();
		this.skillWindow.opacity = 255 ;
		this.skillWindowBlack.opacity = 72;
		this.skillIconBackGround.opacity = 255;
		this.skillIcon.opacity = 255;

	}else{
		this.skillWindow.opacity = 0 ;
		this.skillWindowBlack.opacity = 0;
		this.skillIconBackGround.opacity = 0;
		this.skillIcon.opacity = 0;
	}
	if(Input.isTriggered(SSMBS_Window_Skills.hotKey)){
		SoundManager.playCursor();
		SSMBS_Window_Skills.isOpen = !SSMBS_Window_Skills.isOpen;
		this.skillWindow.x = $gameSystem.windowSkillX?$gameSystem.windowSkillX:SSMBS_Window_Skills.defaultX;
		this.skillWindow.y = $gameSystem.windowSkillY?$gameSystem.windowSkillY:SSMBS_Window_Skills.defaultY;
		
	}
	if(!SSMBS_Window_Skills.clickCd ){
		SSMBS_Window_Skills.clickCd = 0;
	}
	if(SSMBS_Window_Skills.clickCd > 0 ){
		SSMBS_Window_Skills.clickCd --;
	}
	if(!$gameParty.members()[0].skillPoints){
		$gameParty.members()[0].skillPoints = 0;
	}
	if(TouchInput.isHovered()){
		this.isDrawing = false;
	}
	for(let i = 0 ; i < $gameParty.members()[0].skillLevelsPlus.length ; i ++ ){
		$gameParty.members()[0].skillLevelsPlus[i] = 0;
	}
	this.equipAddSkill();
	this.calcSkillLevel();
	
};

Scene_Map.prototype.createSkillWindow = function(){
	this.skillWindow = new Sprite( new Bitmap( SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height ));
	this.addChild(this.skillWindow);
	this.skillWindowBlack = new Sprite( new Bitmap( SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height ));
	this.skillWindowBlack.opacity = 72;
	this.addChild(this.skillWindowBlack);
	this.skillIconBackGround = new Sprite( new Bitmap( SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height ));
	this.skillIconBackGround.setColorTone ([0,0,0,255]);
	this.addChild(this.skillIconBackGround);
	this.skillIcon = new Sprite( new Bitmap( SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height ));
	this.addChild(this.skillIcon);
};

Scene_Map.prototype.loadSkillLevel = function( actor ){
	if(!actor.skillLevels){
		actor.skillLevels = [];
	}
	if(!actor.skillLevelsPlus){
		actor.skillLevelsPlus = [];
	}
	if(!actor.skillLevelsPoints){
		actor.skillLevelsPoints = [];
	}
	for(let i = 0 ; i < $dataSkills.length ; i ++ ){
		actor.skillLevels.push(0);
		actor.skillLevelsPlus.push(0);
		actor.skillLevelsPoints.push(0);
	}
};

Scene_Map.prototype.equipAddSkill = function(){
	
	for( let i = 0 ; i < $gameParty.members()[0].equips().length ; i ++ ){
		if($gameParty.members()[0].equips()[i].meta.skillLevel ){
			for(let s = 0 ; s <  $gameParty.members()[0].equips()[i].meta.skillLevel.split(',').length ; s ++ ){
				let skill = Number($gameParty.members()[0].equips()[i].meta.skillLevel.split(',')[s].split('+')[0]);
				let level = Number($gameParty.members()[0].equips()[i].meta.skillLevel.split(',')[s].split('+')[1]);
				$gameParty.members()[0].skillLevelsPlus[skill] += level;
			}
		}
	}
};

Scene_Map.prototype.calcSkillLevel = function(){
	for(let i = 0 ; i < $gameParty.members()[0].skillLevels.length ; i ++ ){
		$gameParty.members()[0].skillLevels[i]=$gameParty.members()[0].skillLevelsPlus[i]+$gameParty.members()[0].skillLevelsPoints[i];
	}
};

Scene_Map.prototype.updateSkillWindow = function(){
	this.skillWindow.bitmap.clear();
	this.skillIconBackGround.bitmap.clear();
	this.skillIcon.bitmap.clear();
	this.skillWindowBlack.bitmap.clear()
	this.skillWindowBlack.x = this.skillWindow.x;
	this.skillWindowBlack.y = this.skillWindow.y;
	this.skillIconBackGround.x = this.skillWindow.x;
	this.skillIconBackGround.y = this.skillWindow.y;
	this.skillIcon.x = this.skillWindow.x;
	this.skillIcon.y = this.skillWindow.y;
	this.skillWindow.bitmap.blt(
		ImageManager.loadSystem('window_black'),
		0,0, //切割坐标
		SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height,//切割尺寸
		0, 0,// 绘制坐标
		SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height //最终大小
	)
	let meta = $dataActors[$gameParty.members()[0]._actorId].meta.skills.concat($dataClasses[$gameParty.members()[0]._classId].meta.skills);
	let metaName = $dataActors[$gameParty.members()[0]._actorId].meta.skillsName.concat($dataClasses[$gameParty.members()[0]._classId].meta.skillsName);
	let skillTrees = meta.split('\n');
	let skillTreesName = metaName.split('\n');
	let lineheight = SSMBS_Window_Skills.fontSize*3;
	this.skillWindow.bitmap.drawText( SSMBS_Window_Skills.windowTitle,0,0,SSMBS_Window_Skills.width,36,'center' );
	this.skillWindow.bitmap.textColor = ColorManager.textColor(0);
	let stX = this.skillWindow.x + SSMBS_Window_Skills.width-32;
	let stY = this.skillWindow.y + SSMBS_Window_Skills.drawWindowY/2-SSMBS_Window_Skills.fontSize/2;
	let edX = stX + SSMBS_Window_Skills.fontSize;
	let edY = stY + SSMBS_Window_Skills.fontSize;
	
	if(ssmbsBasic.isTouching(stX,stY,edX,edY)){
		this.skillWindow.bitmap.textColor = ColorManager.textColor(8);
		if(TouchInput.isClicked()){
			SSMBS_Window_Skills.isOpen = false;
		}
	}
	// 关闭窗口
	this.skillWindow.bitmap.drawText( 'x', SSMBS_Window_Skills.width-32,SSMBS_Window_Skills.drawWindowY/2-SSMBS_Window_Skills.fontSize/2 ,SSMBS_Window_Skills.fontSize,SSMBS_Window_Skills.fontSize,'right' )
	this.skillWindow.bitmap.textColor = ColorManager.textColor(0);
	this.skillWindowBlack.bitmap.fillRect( SSMBS_Window_Skills.startX-6,SSMBS_Window_Skills.startY-6, SSMBS_Window_Skills.width-SSMBS_Window_Skills.startX-12+SSMBS_Window_Skills.wordStartX/2,SSMBS_Window_Skills.height-SSMBS_Window_Skills.startY-12,'#000000' );
	if(SSMBS_Window_Skills.nowSkillTree >= 0){
		this.skillWindowBlack.bitmap.fillRect( SSMBS_Window_Skills.wordStartX-6,SSMBS_Window_Skills.startY+SSMBS_Window_Skills.nowSkillTree*lineheight-6, SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX ,lineheight,'#000000' )
	}else{
		this.skillWindowBlack.bitmap.fillRect( SSMBS_Window_Skills.wordStartX-6,SSMBS_Window_Skills.startY+SSMBS_Window_Skills.SkillListButtonLine*lineheight-6, SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX ,lineheight,'#000000' )
	}
	//拖动窗口
	if( TouchInput.isPressed() && !this.isDrawing && !this.drawingWindow &&
		TouchInput.x > this.skillWindow.x
		&& TouchInput.x < this.skillWindow.x+SSMBS_Window_Skills.width
		&& TouchInput.y > this.skillWindow.y
		&& TouchInput.y < this.skillWindow.y+SSMBS_Window_Skills.drawWindowY){
		this.isDrawing = true;
		this.drawingWindow = 'skill';
		if(!SSMBS_Window_Skills.xDelta) SSMBS_Window_Skills.xDelta = TouchInput.x - this.skillWindow.x;
		if(!SSMBS_Window_Skills.yDelta) SSMBS_Window_Skills.yDelta = TouchInput.y - this.skillWindow.y;
	}else if (TouchInput.isHovered()) {
		this.isDrawing = false;
		this.drawingWindow = null;
		SSMBS_Window_Skills.xDelta = 0;
		SSMBS_Window_Skills.yDelta = 0;
	}
	if(TouchInput.isPressed() && !this.nowPickedItem && this.drawingWindow == 'skill'){
		this.skillWindow.x += (TouchInput.x - this.skillWindow.x)-SSMBS_Window_Skills.xDelta;
		this.skillWindow.y += (TouchInput.y - this.skillWindow.y)-SSMBS_Window_Skills.yDelta;
		//防止出屏
		if(this.skillWindow.x <= 0 ){
			this.skillWindow.x = 0;
		}
		if(this.skillWindow.y <= 0 ){
			this.skillWindow.y = 0;
		}
		if(this.skillWindow.x + SSMBS_Window_Equip.width >= Graphics.width ){
			this.skillWindow.x = Graphics.width - SSMBS_Window_Equip.width;
		}
		if(this.skillWindow.y + SSMBS_Window_Equip.drawWindowY >= Graphics.height ){
			this.skillWindow.y = Graphics.height - SSMBS_Window_Equip.drawWindowY;
		}
		this.skillWindowBlack.x = this.skillWindow.x;
		this.skillWindowBlack.y = this.skillWindow.y;
		this.skillIconBackGround.x = this.skillWindow.x;
		this.skillIconBackGround.y = this.skillWindow.y;
		this.skillIcon.x = this.skillWindow.x;
		this.skillIcon.y = this.skillWindow.y;
		$gameSystem.windowSkillX = this.skillWindow.x;
		$gameSystem.windowSkillY = this.skillWindow.y;
	}
	// 绘制背景图标
	
	for( let t = 0 ; t < skillTrees.length ; t ++ ){
		this.skillIcon.bitmap.drawText(skillTreesName[t]?skillTreesName[t]:'技能树 '+ t , SSMBS_Window_Skills.wordStartX-6 , SSMBS_Window_Skills.startY+t*lineheight-6, SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX , lineheight,'center');
		if(ssmbsBasic.isTouching(this.skillWindow.x+SSMBS_Window_Skills.wordStartX,this.skillWindow.y+SSMBS_Window_Skills.startY+t*lineheight-6,this.skillWindow.x+SSMBS_Window_Skills.wordStartX+SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX ,this.skillWindow.y+SSMBS_Window_Skills.startY+t*lineheight+lineheight)){
			this.skillWindowBlack.bitmap.fillRect( SSMBS_Window_Skills.wordStartX-6,SSMBS_Window_Skills.startY+t*lineheight-6, SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX ,lineheight,'#ffffff' )
			if(TouchInput.isClicked()){
				SSMBS_Window_Skills.nowSkillTree = t;
			}
		}
	}
	this.skillIcon.bitmap.drawText('技能列表' , SSMBS_Window_Skills.wordStartX-6 , SSMBS_Window_Skills.startY+SSMBS_Window_Skills.SkillListButtonLine*lineheight-6, SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX , lineheight,'center');
	if(ssmbsBasic.isTouching(this.skillWindow.x+SSMBS_Window_Skills.wordStartX,this.skillWindow.y+SSMBS_Window_Skills.startY+SSMBS_Window_Skills.SkillListButtonLine*lineheight-6,this.skillWindow.x+SSMBS_Window_Skills.wordStartX+SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX ,this.skillWindow.y+SSMBS_Window_Skills.startY+SSMBS_Window_Skills.SkillListButtonLine*lineheight+lineheight)){
		this.skillWindowBlack.bitmap.fillRect( SSMBS_Window_Skills.wordStartX-6,SSMBS_Window_Skills.startY+SSMBS_Window_Skills.SkillListButtonLine*lineheight-6, SSMBS_Window_Skills.startX -SSMBS_Window_Skills.wordStartX ,lineheight,'#ffffff' )
		if(TouchInput.isClicked()){
			SSMBS_Window_Skills.nowSkillTree = -1;
		}
	}
	if(SSMBS_Window_Skills.nowSkillTree >= 0){
		this.skillIcon.bitmap.drawText( '剩余技能点: '+$gameParty.members()[0].skillPoints,SSMBS_Window_Skills.startX-6,SSMBS_Window_Skills.wordStartY,SSMBS_Window_Skills.width-SSMBS_Window_Skills.startX-12+SSMBS_Window_Skills.wordStartX/2,SSMBS_Window_Skills.fontSize,'center' );
		for( let t = 0 ; t < skillTrees.length ; t ++ ){
			let skills = skillTrees[SSMBS_Window_Skills.nowSkillTree].split(',');
			for( let s = 0 ; s < skills.length ; s ++  ){
				let skill = Number(skills[s]);
				if(skill){ // skill是ID数字
					//描绘技能背景（黑白色）
					this.skillIconBackGround.bitmap.blt(
						ImageManager.loadSystem('IconSet'),
						$dataSkills[ skill ].iconIndex % 16*32,Math.floor($dataSkills[ skill ].iconIndex / 16)*32, //切割坐标
						32,	32,//切割尺寸
						SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),
						SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),// 绘制坐标
						SSMBS_Window_Skills.gridsSize,	SSMBS_Window_Skills.gridsSize //最终大小
					)
					//如果学会技能则覆盖彩色图标
					if($gameParty.members()[0].hasSkill(skill)){
						this.skillIcon.bitmap.blt(
							ImageManager.loadSystem('IconSet'),
							$dataSkills[ skill ].iconIndex % 16*32,Math.floor($dataSkills[ skill ].iconIndex / 16)*32, //切割坐标
							32,	32,//切割尺寸
							SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),
							SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),// 绘制坐标
							SSMBS_Window_Skills.gridsSize,	SSMBS_Window_Skills.gridsSize //最终大小
						)
					}
					this.skillIcon.bitmap.fontSize = SSMBS_Window_Skills.fontSize;
					let skillMaxLevel = $dataSkills[ skill ].meta.maxLevel?Number( $dataSkills[ skill ].meta.maxLevel ):1;
					
					let wordX = this.skillWindow.x+SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace);
					let wordY = this.skillWindow.y+SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace)+SSMBS_Window_Skills.gridsSize;
					let wordMaxX = wordX+SSMBS_Window_Skills.gridsSize;
					let wordMaxY = wordY+SSMBS_Window_Skills.fontSize;
					if(ssmbsBasic.isTouching(wordX,wordY,wordMaxX,wordMaxY)){
						this.skillIcon.bitmap.drawText(
							'学习',
							SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),
							SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace)+SSMBS_Window_Skills.gridsSize,// 绘制坐标
							SSMBS_Window_Skills.gridsSize,	SSMBS_Window_Skills.fontSize, //限制长宽
							'center'
						)
						this.skillIcon.bitmap.drawText(
							$gameParty.members()[0].skillLevels[skill]+'/'+skillMaxLevel,
							SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),
							SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace)+SSMBS_Window_Skills.gridsSize-SSMBS_Window_Skills.fontSize,// 绘制坐标
							SSMBS_Window_Skills.gridsSize,	SSMBS_Window_Skills.fontSize, //限制长宽
							'center'
						)
						//学习技能
						if(
						($gameParty.members()[0].skillPoints>=Number($dataSkills[skill].meta.skpCost)? Number($dataSkills[skill].meta.skpCost):1) && 
						($dataSkills[skill].meta.needlevel? $gameParty.members()[0].level>=Number($dataSkills[skill].meta.needlevel) : true) &&
						($dataSkills[skill].meta.needSkill? $gameParty.members()[0].hasSkill(Number($dataSkills[skill].meta.needSkill)) : true)
						){
							if(TouchInput.isClicked() && SSMBS_Window_Skills.clickCd == 0){
								if( $gameParty.members()[0].skillLevelsPoints[skill] < skillMaxLevel ){
									$gameParty.members()[0].skillLevelsPoints[skill]+=1;
									$gameParty.members()[0].skillPoints-=$dataSkills[skill].meta.skpCost;
									SSMBS_Window_Skills.clickCd = 1;
								}
								if($gameParty.members()[0].skillLevelsPoints[skill]>0&&!$gameParty.members()[0].hasSkill(skill)){
									$gameParty.members()[0].learnSkill(skill);
								}
							}
						}
					}else{
						this.skillIcon.bitmap.drawText(
							$gameParty.members()[0].skillLevels[skill]+'/'+skillMaxLevel,
							SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),
							SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace)+SSMBS_Window_Skills.gridsSize,// 绘制坐标
							SSMBS_Window_Skills.gridsSize,	SSMBS_Window_Skills.fontSize, //限制长宽
							'center'
						)
					}
					//判断鼠标触碰技能
					let theX = this.skillWindow.x+SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace);
					let theY = this.skillWindow.y+SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace);
					if( ssmbsBasic.isTouching(theX,theY,theX+SSMBS_Window_Skills.gridsSize,theY+SSMBS_Window_Skills.gridsSize)  ){
						if(!this.isDrawing){
							this.itemInform = $dataSkills[ skill ];
						}
						if($gameParty.members()[0].hasSkill(skill) && TouchInput.isPressed() && !this.nowPickedItem && !this.isDrawing ){
							this.isDrawing = true;
							this.nowPickedItem = $dataSkills[ skill ];
							this.touchIcon.item = $dataSkills[ skill ];
							this.isHandledItem = this.touchIcon;
							this.item = this.touchIcon.item;
							this.itemType = 'skill';
							this.isDrawingItem = true;
						}
					}
				}
				
			}
		}
	}else{
		let theX = this.skillWindow.x+SSMBS_Window_Skills.startX;
		let theY = this.skillWindow.y+SSMBS_Window_Skills.startY;
		let maxX = theX+SSMBS_Window_Skills.width-theX-6;
		let maxY = theX+SSMBS_Window_Skills.height-theY-6;
		this.skillIcon.bitmap.drawText( '当前条目: '+SSMBS_Window_Skills.SkillListFirst,SSMBS_Window_Skills.startX-6,SSMBS_Window_Skills.wordStartY,SSMBS_Window_Skills.width-SSMBS_Window_Skills.startX-12+SSMBS_Window_Skills.wordStartX/2,SSMBS_Window_Skills.fontSize,'center' );
		if( ssmbsBasic.isTouching(theX,theY,maxX,maxY) ){
			if(TouchInput.wheelY < 0 && SSMBS_Window_Skills.SkillListFirst>0){
				SSMBS_Window_Skills.SkillListFirst -= 1;
			}
			if(TouchInput.wheelY > 0 ){
				SSMBS_Window_Skills.SkillListFirst ++;
			}
		}
		if( $gameParty.members()[0].skills().length>0 ){
			let line = 0 ;
			let lineHeight = SSMBS_Window_Skills.SkillListSpace;
			for( let i = SSMBS_Window_Skills.SkillListFirst ; i < $gameParty.members()[0].skills().length ; i ++ ){
				if($gameParty.members()[0].skills()[i]){
					this.skillIcon.bitmap.blt(
						ImageManager.loadSystem('IconSet'),
						$gameParty.members()[0].skills()[i].iconIndex % 16*32,Math.floor($gameParty.members()[0].skills()[i].iconIndex / 16)*32, //切割坐标
						32,	32,//切割尺寸
						SSMBS_Window_Skills.startX,
						SSMBS_Window_Skills.startY+line*lineHeight,// 绘制坐标
						SSMBS_Window_Skills.gridsSize,	SSMBS_Window_Skills.gridsSize //最终大小
					)
					if($gameParty.members()[0].skillLevels[$gameParty.members()[0].skills()[i].id]>0){
						var text = ' (技能等级: '+$gameParty.members()[0].skillLevels[$gameParty.members()[0].skills()[i].id]+')';
					}else{
						var text = ' (装备附带)';
					}
					if($gameParty.members()[0].skills()[i].meta.textColor){
						var color  = Number($gameParty.members()[0].skills()[i].meta.textColor);
					}else{
						var color  = 0;
					}
					if($gameParty.members()[0].skills()[i].meta.textColor2){
						var color2  = Number($gameParty.members()[0].skills()[i].meta.textColor2);
					}else{
						var color2  = color;
					}
					this.skillIcon.bitmap.drawTextGradient(
						$gameParty.members()[0].skills()[i].name+text,
						SSMBS_Window_Skills.startX+SSMBS_Window_Skills.gridsSize+8,
						SSMBS_Window_Skills.startY+line*lineHeight,// 绘制坐标
						SSMBS_Window_Skills.width,SSMBS_Window_Skills.gridsSize, //限制长宽
						'left',	ColorManager.textColor(color),ColorManager.textColor(color2)
					)
					let skillX = this.skillWindow.x + SSMBS_Window_Skills.startX;
					let skillY = this.skillWindow.y + SSMBS_Window_Skills.startY+line*lineHeight;
					let skillMaxX = skillX+SSMBS_Window_Skills.gridsSize;
					let skillMaxY = skillY+SSMBS_Window_Skills.gridsSize;
					
					if( ssmbsBasic.isTouching(skillX,skillY,skillMaxX,skillMaxY)){
						if(!this.isDrawing){
							this.itemInform = $gameParty.members()[0].skills()[i];
						}
						if(TouchInput.isPressed()  && !this.nowPickedItem && !this.isDrawing ){
							this.isDrawing = true;
							this.nowPickedItem =  $gameParty.members()[0].skills()[i];
							this.touchIcon.item = $gameParty.members()[0].skills()[i];
							this.isHandledItem = this.touchIcon;
							this.item = this.touchIcon.item;
							this.itemType = 'skill';
						}
					}
					line ++ ;
				}
			}
		}
	}
};