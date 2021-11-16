//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Skill Window
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简单的技能窗口
 * @author 神仙狼
 *
 * @param 技能快捷键
 * @type String
 * @desc 技能快捷键
 * @default k
 * 
 *@help SSMBS_SkillWindow.js
 *  
 *角色备注：
 *<skills:Number,Number......> 技能树排序，0代表空技能
 *<spVar:Number>               该角色SP变量ID
 *<spPerLv:Number>             该角色每一等级获得的SP
 *
 * 
 *技能备注：
 *<levelVar:Number>            技能等级变量ID
 *<maxLevel:Number>            技能最高等级
 *<needSp:Number>              技能所需SP
 *	
 */



var sxlSkillWindow = sxlSkillWindow||{};
sxlSkillWindow.memberId = 0;
sxlSkillWindow.skillTreeType = 0;
sxlSkillWindow.parameters = PluginManager.parameters('SSMBS_Window_Skills');
sxlSkillWindow.hotKey = String(sxlSkillWindow.parameters['技能快捷键'] || 'k');

const _sxlAbs_SkillWindowUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_sxlAbs_SkillWindowUpdate.call(this);
	this.userSkillWindow = true;
	sxlSkillWindow.member = $gameParty.members()[sxlSkillWindow.memberId];
	if(Input.isRepeated('alt')){

	}
	this.loadMembersSP();
	
	this.updateSkillWindow();
}

Scene_Map.prototype.loadMembersSP = function() {
	for(i in $gameParty.members()){
		if($dataActors[$gameParty.members()[i]._actorId].meta.spVar){
			var dataActorMeta = Number($dataActors[$gameParty.members()[i]._actorId].meta.spVar);
			$gameParty.members()[i].spVariable = $gameVariables.value(dataActorMeta)
			$gameParty.members()[i].spVarId = dataActorMeta;
		}
	}
};

Scene_Map.prototype.createSkillWindow = function() {
	if(!this.skillWindow){
		this.skillWindow = new Sprite();
		this.skillWindow.bitmap = ImageManager.loadSystem('skillBackground');
		this.skillWindow.x = this.skillWindowSaveX?this.skillWindowSaveX:Graphics.width/2-149;
		this.skillWindow.y = this.skillWindowSaveY?this.skillWindowSaveY:64;



		this.skillWindow.skillTreeImg = new Sprite();
		if(sxlSkillWindow.skillTreeType == 0){
			if($dataActors[$gameParty.members()[sxlSkillWindow.memberId]._actorId].meta.skillBackground){
				this.skillWindow.skillTreeImg.bitmap = ImageManager.loadSystem($dataActors[$gameParty.members()[sxlSkillWindow.memberId]._actorId].meta.skillBackground);
			}else{
				this.skillWindow.skillTreeImg.bitmap = ImageManager.loadSystem('skillImg');
			}
		}else{
			if($dataClasses[$gameParty.members()[sxlSkillWindow.memberId]._classId].meta.skillBackground){
				this.skillWindow.skillTreeImg.bitmap = ImageManager.loadSystem($dataClasses[$gameParty.members()[sxlSkillWindow.memberId]._classId].meta.skillBackground);
			}else{
				this.skillWindow.skillTreeImg.bitmap = ImageManager.loadSystem('skillImg');
			}
		}
		this.skillWindow.skillTreeImg.x = this.skillWindow.x;
		this.skillWindow.skillTreeImg.y = this.skillWindow.y;
		
		this.skillWindow.playerInform = new Sprite(new Bitmap(300,469));
		this.skillWindow.playerInform.x = this.skillWindow.x+24;
		this.skillWindow.playerInform.y = this.skillWindow.y +430;
		this.skillWindow.playerInform.bitmap.fontSize = 14;
		this.skillWindow.bitmap.fontFace = $gameSystem.mainFontFace();

		this.skillWindow_actorButton = new Sprite();
		this.skillWindow_actorButton.bitmap = ImageManager.loadSystem('Skill_Actor');
		this.skillWindow_actorButton.anchor.x = 0.5;
		this.skillWindow_actorButton.anchor.y = 0.5;
		this.skillWindow_actorButton.x = this.skillWindow.x + 78;
		this.skillWindow_actorButton.y = this.skillWindow.y + 52;

		this.skillWindow_classButton = new Sprite();
		this.skillWindow_classButton.bitmap = ImageManager.loadSystem('Skill_Class');
		this.skillWindow_classButton.anchor.x = 0.5;
		this.skillWindow_classButton.anchor.y = 0.5;
		this.skillWindow_classButton.x = this.skillWindow.x + 220;
		this.skillWindow_classButton.y = this.skillWindow.y + 52;
		this.addChild(this.skillWindow);
		this.addChild(this.skillWindow.skillTreeImg);
		this.addChild(this.skillWindow.playerInform);
		this.addChild(this.skillWindow_actorButton);
		this.addChild(this.skillWindow_classButton);
		
		if(sxlSkillWindow.skillTreeType == 0 ){
			var skillIds = $dataActors[sxlSkillWindow.member._actorId].meta.skills.split(',') ;
		}else{
			var skillIds = $dataClasses[sxlSkillWindow.member._classId].meta.skills.split(',') ;
			console.log(skillIds)
		}
		
		this.skillWindow.skillsArray = [];
		this.skillWindow.skillsStayArray = [];
		this.skillWindow.skillsBackArray = [];
		this.skillWindow.skillsWordsArray = [];

		for( i in skillIds ){
			if( skillIds[i]!=0 ){
				var theSkill = $dataSkills[ skillIds[i] ];
				var iconSet = theSkill.iconIndex
				var skillLevel = theSkill.meta.levelVar?$gameVariables.value(Number(theSkill.meta.levelVar)):1;
				var maxLevel = theSkill.meta.maxLevel?Number(theSkill.meta.maxLevel):1;
				var needSp = theSkill.meta.needSp?Number(theSkill.meta.needSp):1;

				this.skillWindow.skillback = new Sprite(new Bitmap(72,72));
				this.skillWindow.skillback.x = this.skillWindow.x + ((i % 5)* 58) + 16 - 2;
				this.skillWindow.skillback.y = this.skillWindow.y + 76 + Math.floor( i / 5 )* 64 - 2;
				this.skillWindow.skillback.bitmap.fillRect(0,0,36,50,'#000000');
				this.skillWindow.skillback.opacity = 100;
				this.skillWindow.skillback.needSp = needSp;
				this.skillWindow.skillback.skill = theSkill;
				this.skillWindow.skillback.skillId = theSkill.id;
				this.skillWindow.skillback.skillLevel = skillLevel;
				this.skillWindow.skillback.maxLevel = maxLevel;
				this.skillWindow.skillback.positionSave = i ;
				this.skillWindow.skillsBackArray.push(this.skillWindow.skillback);
				this.addChild(this.skillWindow.skillback);

				this.skillWindow.words = new Sprite(new Bitmap(72,72));
				this.skillWindow.words.x = this.skillWindow.x + ((i % 5)* 58) + 16;
				this.skillWindow.words.y = this.skillWindow.y + 76 + Math.floor( i / 5 )* 64;
				this.skillWindow.words.bitmap.fontSize = 12;
				this.skillWindow.words.needSp = needSp;
				this.skillWindow.words.skill = theSkill;
				this.skillWindow.words.skillId = theSkill.id;
				this.skillWindow.words.skillLevel = skillLevel;
				this.skillWindow.words.maxLevel = maxLevel;
				this.skillWindow.words.positionSave = i ;
				this.skillWindow.skillsWordsArray.push(this.skillWindow.words);
				this.addChild(this.skillWindow.words);

				this.skillWindow.skillStay = new Sprite()
				this.skillWindow.skillStay.bitmap = ImageManager.loadSystem('IconSet');
				this.skillWindow.skillStay.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
				this.skillWindow.skillStay.x = this.skillWindow.x + ((i % 5)* 58) + 16;
				this.skillWindow.skillStay.y = this.skillWindow.y + 76 + Math.floor( i / 5 )* 64;
				this.skillWindow.skillStay.needSp = needSp;
				this.skillWindow.skillStay.skill = theSkill;
				this.skillWindow.skillStay.skillId = theSkill.id;
				this.skillWindow.skillStay.skillLevel = skillLevel;
				this.skillWindow.skillStay.maxLevel = maxLevel;
				this.skillWindow.skillStay.positionSave = i ;
				this.skillWindow.skillsStayArray.push(this.skillWindow.skillStay);
				this.addChild(this.skillWindow.skillStay);

				this.skillWindow.skillIcon = new Sprite()
				this.skillWindow.skillIcon.bitmap = ImageManager.loadSystem('IconSet');
				this.skillWindow.skillIcon.setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
				this.skillWindow.skillIcon.x = this.skillWindow.x + ((i % 5)* 58) + 16;
				this.skillWindow.skillIcon.y = this.skillWindow.y + 76 + Math.floor( i / 5 )* 64;
				this.skillWindow.skillIcon.needSp = needSp;
				this.skillWindow.skillIcon.skill = theSkill;
				this.skillWindow.skillIcon.skillId = theSkill.id;
				this.skillWindow.skillIcon.maxLevel = maxLevel;
				this.skillWindow.skillIcon.positionSave = i ;
				this.skillWindow.skillIcon.saveX = this.skillWindow.skillIcon.x;
				this.skillWindow.skillIcon.saveY = this.skillWindow.skillIcon.y;
				this.skillWindow.skillsArray.push(this.skillWindow.skillIcon);
				this.addChild(this.skillWindow.skillIcon);		
			}
		}
	}
};

Scene_Map.prototype.updateSkillWindow = function() {
	if(this.openSkillWindow==true){
		this.createSkillWindow()
		
	}else if(this.openSkillWindow==false){
	}
	if(this.skillWindow){
		this.skillWindow.playerInform.x = this.skillWindow.x+24;
		this.skillWindow.playerInform.y = this.skillWindow.y +430;
		this.skillWindow.skillTreeImg.x = this.skillWindow.x;
		this.skillWindow.skillTreeImg.y = this.skillWindow.y;
		this.skillWindow_actorButton.x = this.skillWindow.x + 78;
		this.skillWindow_actorButton.y = this.skillWindow.y + 52;
		this.skillWindow_classButton.x = this.skillWindow.x + 220;
		this.skillWindow_classButton.y = this.skillWindow.y + 52;
		if( sxlSkillWindow.skillTreeType == 0 ){
			this.skillWindow_actorButton.setColorTone([0,0,0,0])
			this.skillWindow_classButton.setColorTone([0,0,0,255])
		}else{
			this.skillWindow_actorButton.setColorTone([0,0,0,255])
			this.skillWindow_classButton.setColorTone([0,0,0,0])
		}
		if (TouchInput.x > this.skillWindow_actorButton._bounds.minX &&
			TouchInput.x < this.skillWindow_actorButton._bounds.maxX &&
			TouchInput.y > this.skillWindow_actorButton._bounds.minY &&
			TouchInput.y < this.skillWindow_actorButton._bounds.maxY){
			if(this.skillWindow_actorButton.scale.x>=1.1){
				this.skillWindow_actorButton.addMode = '-';
			}
			if(this.skillWindow_actorButton.scale.x<=1){
				this.skillWindow_actorButton.addMode = '+';
			}
			if(this.skillWindow_actorButton.addMode=='+'){
				this.skillWindow_actorButton.scale.x += 0.005;
			}
			if(this.skillWindow_actorButton.addMode=='-'){
				this.skillWindow_actorButton.scale.x -= 0.005;
			}
			this.skillWindow_actorButton.scale.y = this.skillWindow_actorButton.scale.x;
			if(TouchInput.isClicked()){
				this.skillWindowSaveX = this.skillWindow.x;
				this.skillWindowSaveY = this.skillWindow.y;
				this.skillWindow.destroy();
				this.skillWindow.skillTreeImg.destroy();
				this.skillWindow.playerInform.destroy();
				this.skillWindow_actorButton.destroy();
				this.skillWindow_classButton.destroy();
				for( i in this.skillWindow.skillsArray){
					this.skillWindow.skillsArray[i].destroy();
					this.skillWindow.skillsStayArray[i].destroy();
					this.skillWindow.skillsBackArray[i].destroy();
					this.skillWindow.skillsWordsArray[i].destroy();
				}
				this.skillWindow = null;
				
				SoundManager.playOk();
				sxlSkillWindow.skillTreeType = 0;
				this.createSkillWindow();
			}
		}else{
			this.skillWindow_actorButton.scale.x = 1;
			this.skillWindow_actorButton.scale.y = 1;
		}
		if (TouchInput.x > this.skillWindow_classButton._bounds.minX &&
			TouchInput.x < this.skillWindow_classButton._bounds.maxX &&
			TouchInput.y > this.skillWindow_classButton._bounds.minY &&
			TouchInput.y < this.skillWindow_classButton._bounds.maxY){
			if(this.skillWindow_classButton.scale.x>=1.1){
				this.skillWindow_classButton.addMode = '-';
			}
			if(this.skillWindow_classButton.scale.x<=1){
				this.skillWindow_classButton.addMode = '+';
			}
			if(this.skillWindow_classButton.addMode=='+'){
				this.skillWindow_classButton.scale.x += 0.005;
			}
			if(this.skillWindow_classButton.addMode=='-'){
				this.skillWindow_classButton.scale.x -= 0.005;
			}
			this.skillWindow_classButton.scale.y = this.skillWindow_classButton.scale.x;
			if(TouchInput.isClicked()){
				this.skillWindowSaveX = this.skillWindow.x;
				this.skillWindowSaveY = this.skillWindow.y;
				this.skillWindow.destroy();
				this.skillWindow.skillTreeImg.destroy();
				this.skillWindow.playerInform.destroy();
				this.skillWindow_actorButton.destroy();
				this.skillWindow_classButton.destroy();
				for( i in this.skillWindow.skillsArray){
					this.skillWindow.skillsArray[i].destroy();
					this.skillWindow.skillsStayArray[i].destroy();
					this.skillWindow.skillsBackArray[i].destroy();
					this.skillWindow.skillsWordsArray[i].destroy();
				}
				this.skillWindow = null;
				SoundManager.playOk();
				sxlSkillWindow.skillTreeType = 1;
				this.createSkillWindow();

			}
		}else{
			this.skillWindow_classButton.scale.x = 1;
			this.skillWindow_classButton.scale.y = 1;
		}
		var skillPoint = $dataActors[sxlSkillWindow.member._actorId].meta.spVar?
						$gameVariables.value(Number($dataActors[sxlSkillWindow.member._actorId].meta.spVar)):0;
		var memberInformation = sxlSkillWindow.member._name+'  等级: '+sxlSkillWindow.member._level + '  技能点数: '+skillPoint;
		this.skillWindow.playerInform.bitmap.clear();
		this.skillWindow.playerInform.bitmap.drawText(memberInformation,0,0,250,36,'center');
		for( i in this.skillWindow.skillsBackArray ){
			this.skillWindow.skillsWordsArray[i].bitmap.clear();
			if(!sxlSkillWindow.member.hasSkill(this.skillWindow.skillsBackArray[i].skillId)){
			if (TouchInput.x > this.skillWindow.skillsBackArray[i]._bounds.minX &&
				TouchInput.x < this.skillWindow.skillsBackArray[i]._bounds.maxX - 32 &&
				TouchInput.y > this.skillWindow.skillsBackArray[i]._bounds.minY + 32 &&
				TouchInput.y < this.skillWindow.skillsBackArray[i]._bounds.maxY - 12){
				this.skillWindow.skillsWordsArray[i].bitmap.drawText('学习',0,28,32,24,'center');
			}else{
				this.skillWindow.skillsWordsArray[i].bitmap.drawText('未习得',0,28,32,24,'center');
			}
						
				
			}else{
				if( this.skillWindow.skillsWordsArray[i].skillLevel < this.skillWindow.skillsWordsArray[i].maxLevel ){
					if (TouchInput.x > this.skillWindow.skillsBackArray[i]._bounds.minX &&
						TouchInput.x < this.skillWindow.skillsBackArray[i]._bounds.maxX - 32 &&
						TouchInput.y > this.skillWindow.skillsBackArray[i]._bounds.minY + 32 &&
						TouchInput.y < this.skillWindow.skillsBackArray[i]._bounds.maxY - 12){
						this.skillWindow.skillsWordsArray[i].bitmap.drawText('提升+',0,28,32,24,'center');
					}else{
						this.skillWindow.skillsWordsArray[i].bitmap.drawText('Lv:'+this.skillWindow.skillsWordsArray[i].skillLevel,0,28,32,24,'center');
					}
					
				}else{
					this.skillWindow.skillsWordsArray[i].bitmap.drawText('Lv:MAX',0,28,32,24,'center');	
				}
			}

			if( TouchInput.isClicked() &&
				TouchInput.x > this.skillWindow.skillsBackArray[i]._bounds.minX &&
				TouchInput.x < this.skillWindow.skillsBackArray[i]._bounds.maxX - 32&&
				TouchInput.y > this.skillWindow.skillsBackArray[i]._bounds.minY + 32 &&
				TouchInput.y < this.skillWindow.skillsBackArray[i]._bounds.maxY - 12){
				var metaSkillNeedLevel = this.skillWindow.skillsBackArray[i].skill.meta.needLevel?
										 Number(this.skillWindow.skillsBackArray[i].skill.meta.needLevel):1;
				var metaNeedSkill = this.skillWindow.skillsBackArray[i].skill.meta.needSkill?
									Number(this.skillWindow.skillsBackArray[i].skill.meta.needSkill):null;
				if( sxlSkillWindow.member.spVariable >= this.skillWindow.skillsBackArray[i].needSp 
					&& sxlSkillWindow.member._level >= metaSkillNeedLevel
					&& (metaNeedSkill==null || sxlSkillWindow.member.hasSkill(metaNeedSkill) )
					&& (this.skillWindow.skillsBackArray[i].skillLevel < this.skillWindow.skillsBackArray[i].maxLevel ||
						!sxlSkillWindow.member.hasSkill(this.skillWindow.skillsBackArray[i].skillId)) ){
					var theSprite =  this.skillWindow.skillsBackArray[i]
					sxlSkillWindow.member.learnSkill( this.skillWindow.skillsBackArray[i].skillId );
					$gameVariables.setValue( Number(theSprite.levelVar), theSprite.skillLevel + 1 );
					$gameVariables.setValue( sxlSkillWindow.member.spVarId, sxlSkillWindow.member.spVariable - this.skillWindow.skillsBackArray[i].needSp  );
					sxlSkillWindow.member.learnSkill( this.skillWindow.skillsBackArray[i].skillId );
					if(!sxlSkillWindow.member.usedSP){
						sxlSkillWindow.member.usedSP = 0;
					}
					sxlSkillWindow.member.usedSP += this.skillWindow.skillsBackArray[i].needSp;
					SoundManager.playRecovery();
				}else{
					SoundManager.playBuzzer();
					if(sxlSkillWindow.member.spVariable<this.skillWindow.skillsBackArray[i].needSp){
						sxlSimpleABS.showInformation('【'+this.skillWindow.skillsBackArray[i].skill.name+'】 学习失败：技能点不足！',ColorManager.textColor(0));
						sxlSimpleABS.showInformation('拥有技能点:'+sxlSkillWindow.member.spVariable,ColorManager.textColor(0));
						sxlSimpleABS.showInformation('技能点需求: '+this.skillWindow.skillsBackArray[i].needSp,ColorManager.textColor(0));
					} 
					if(!sxlSkillWindow.member.hasSkill(metaNeedSkill)&&metaNeedSkill!=null){
						sxlSimpleABS.showInformation('【'+this.skillWindow.skillsBackArray[i].skill.name +'】 学习失败：尚未习得前置技能！',ColorManager.textColor(0));
						sxlSimpleABS.showInformation('需要前置技能: 【'+$dataSkills[metaNeedSkill].name+'】',ColorManager.textColor(0));
					}
					if(sxlSkillWindow.member._level<metaSkillNeedLevel){
						sxlSimpleABS.showInformation('【' + this.skillWindow.skillsBackArray[i].skill.name+'】 学习失败：'+sxlSkillWindow.member._name+'等级过低！',ColorManager.textColor(0));
						sxlSimpleABS.showInformation('现在等级: '+sxlSkillWindow.member._level,ColorManager.textColor(0));
						sxlSimpleABS.showInformation('需要等级: '+metaSkillNeedLevel,ColorManager.textColor(0));
					}
					if(this.skillWindow.skillsBackArray[i].skillLevel > this.skillWindow.skillsBackArray[i].maxLevel){
						sxlSimpleABS.showInformation('【' + this.skillWindow.skillsBackArray[i].skill.name+'】 学习失败：该技能已达到最高等级！',ColorManager.textColor(0));
					}
				}
			}
		}
		for( i in this.skillWindow.skillsArray ){
			var theSkill = this.skillWindow.skillsArray[i].skill;
			var iconSet = theSkill.iconIndex
			var skillLevel = theSkill.meta.levelVar?$gameVariables.value(Number(theSkill.meta.levelVar)):1;
			var levelVar = theSkill.meta.levelVar?(Number(theSkill.meta.levelVar)):0;
			var maxLevel = theSkill.meta.maxLevel?Number(theSkill.meta.maxLevel):1;
			var needSp = theSkill.meta.needSp?Number(theSkill.meta.needSp):1;
			this.skillWindow.skillsBackArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsBackArray[i].positionSave % 5)* 58) + 16 - 2;
			this.skillWindow.skillsBackArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsBackArray[i].positionSave / 5 )* 64 - 2;
			this.skillWindow.skillsBackArray[i].needSp = needSp;
			this.skillWindow.skillsBackArray[i].skill = theSkill;
			this.skillWindow.skillsBackArray[i].skillId = theSkill.id;
			this.skillWindow.skillsBackArray[i].skillLevel = skillLevel;
			this.skillWindow.skillsBackArray[i].levelVar = levelVar;
			this.skillWindow.skillsBackArray[i].maxLevel = maxLevel;

			this.skillWindow.skillsWordsArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsWordsArray[i].positionSave % 5)* 58) + 16;
			this.skillWindow.skillsWordsArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsWordsArray[i].positionSave / 5 )* 64;
			this.skillWindow.skillsWordsArray[i].needSp = needSp;
			this.skillWindow.skillsWordsArray[i].skill = theSkill;
			this.skillWindow.skillsWordsArray[i].skillId = theSkill.id;
			this.skillWindow.skillsWordsArray[i].skillLevel = skillLevel;
			this.skillWindow.skillsWordsArray[i].levelVar = levelVar;
			this.skillWindow.skillsWordsArray[i].maxLevel = maxLevel;

			this.skillWindow.skillsStayArray[i].bitmap = ImageManager.loadSystem('IconSet');
			this.skillWindow.skillsStayArray[i].setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
			this.skillWindow.skillsStayArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsStayArray[i].positionSave % 5)* 58) + 16;
			this.skillWindow.skillsStayArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsStayArray[i].positionSave / 5 )* 64;
			this.skillWindow.skillsStayArray[i].needSp = needSp;
			this.skillWindow.skillsStayArray[i].skill = theSkill;
			this.skillWindow.skillsStayArray[i].skillId = theSkill.id;
			this.skillWindow.skillsStayArray[i].skillLevel = skillLevel;
			this.skillWindow.skillsStayArray[i].levelVar = levelVar;
			this.skillWindow.skillsStayArray[i].maxLevel = maxLevel;

			this.skillWindow.skillsArray[i].bitmap = ImageManager.loadSystem('IconSet');
			this.skillWindow.skillsArray[i].setFrame(iconSet % 16*32,Math.floor(iconSet / 16)*32,32,32);
			if(!this.isHandledItem){
				this.skillWindow.skillsArray[i].anchor.x = 0;
				this.skillWindow.skillsArray[i].anchor.y = 0;
				this.skillWindow.skillsArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsArray[i].positionSave % 5)* 58) + 16;
				this.skillWindow.skillsArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsArray[i].positionSave / 5 )* 64;
				if(!sxlSkillWindow.member.hasSkill(this.skillWindow.skillsArray[i].skillId)){
					this.skillWindow.skillsArray[i].setColorTone([0,0,0,255])
				}else{
					this.skillWindow.skillsArray[i].setColorTone([0,0,0,0])
				}
			};
			this.skillWindow.skillsArray[i].needSp = needSp;
			this.skillWindow.skillsArray[i].skill = theSkill;
			this.skillWindow.skillsArray[i].skillId = theSkill.id;
			this.skillWindow.skillsArray[i].maxLevel = maxLevel;
			this.skillWindow.skillsArray[i].levelVar = levelVar;
		}
		if( TouchInput.isTriggered() &&
			TouchInput.x > this.skillWindow._bounds.minX &&
			TouchInput.x < this.skillWindow._bounds.maxX-33 &&
			TouchInput.y > this.skillWindow._bounds.minY &&
			TouchInput.y < this.skillWindow.y + 32){
			if(!this.bindWindow){
				this.bindWindow = 'skillWindow';
			}
			this.moveSkillWindow = true;
		}else if( TouchInput.isHovered() ){
			this.moveSkillWindow = false;
			this.bindWindow = null;
		}
		if(this.moveSkillWindow == true && this.bindWindow == 'skillWindow'){
			this.skillWindow.x = TouchInput.x-this.skillWindow.width/2;
			this.skillWindow.y = TouchInput.y-16;
			if( this.skillWindow.x > Graphics.width - this.skillWindow.bitmap.width ){
				this.skillWindow.x = Graphics.width - this.skillWindow.bitmap.width;
			}
			if( this.skillWindow.y > Graphics.height - this.skillWindow.bitmap.height ){
				this.skillWindow.y = Graphics.height - this.skillWindow.bitmap.height;
			}
			if( this.skillWindow.x < 0 ){
				this.skillWindow.x = 0;
			}
			if( this.skillWindow.y < 0 ){
				this.skillWindow.y = 0;
			}
			this.skillWindow.playerInform.x = this.skillWindow.x+24;
			this.skillWindow.playerInform.y = this.skillWindow.y +430;
			this.skillWindow.skillTreeImg.x = this.skillWindow.x;
			this.skillWindow.skillTreeImg.y = this.skillWindow.y;
			this.skillWindow_actorButton.x = this.skillWindow.x + 78;
			this.skillWindow_actorButton.y = this.skillWindow.y + 52;
			this.skillWindow_classButton.x = this.skillWindow.x + 220;
			this.skillWindow_classButton.y = this.skillWindow.y + 52;
			for( i in this.skillWindow.skillsArray ){
				this.skillWindow.skillsBackArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsBackArray[i].positionSave % 5)* 58) + 16 - 2;
				this.skillWindow.skillsBackArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsBackArray[i].positionSave / 5 )* 64 - 2;
				this.skillWindow.skillsWordsArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsWordsArray[i].positionSave % 5)* 58) + 16;
				this.skillWindow.skillsWordsArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsWordsArray[i].positionSave / 5 )* 64;
				this.skillWindow.skillsStayArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsStayArray[i].positionSave % 5)* 58) + 16;
				this.skillWindow.skillsStayArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsStayArray[i].positionSave / 5 )* 64;
				if(!this.isHandledItem){
					this.skillWindow.skillsArray[i].x = this.skillWindow.x + ((this.skillWindow.skillsArray[i].positionSave % 5)* 58) + 16;
					this.skillWindow.skillsArray[i].y = this.skillWindow.y + 76 + Math.floor( this.skillWindow.skillsArray[i].positionSave / 5 )* 64;
				};
			}
		}
		if( TouchInput.x > this.skillWindow._bounds.maxX-32 &&
			TouchInput.x < this.skillWindow._bounds.maxX &&
			TouchInput.y > this.skillWindow._bounds.minY &&
			TouchInput.y < this.skillWindow.y + 32){
			$gameParty.members()[0]._tp = 0;
			if(TouchInput.isTriggered()){
				SoundManager.playCursor();
				this.openSkillWindow = false;
				this.skillWindowSaveX = this.skillWindow.x;
				this.skillWindowSaveY = this.skillWindow.y;
				this.skillWindow.x = 999999;
				this.skillWindow.y = 999999;
			}
			
		}
	}
	if(Input.isTriggered(sxlSkillWindow.hotKey)){
		SoundManager.playCursor();
		if(this.openSkillWindow == true){

			this.skillWindowSaveX = this.skillWindow.x;
			this.skillWindowSaveY = this.skillWindow.y;
			this.skillWindow.x = 999999;
			this.skillWindow.y = 999999;
			this.openSkillWindow = false;
		}else{
			if(this.skillWindow){
				this.skillWindow.x = this.skillWindowSaveX;
				this.skillWindow.y = this.skillWindowSaveY;
			};
			this.openSkillWindow = true;
		}
	}
};

const _skillWindwoLvUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
	_skillWindwoLvUp.call(this);
	sxlSimpleABS.showInformation('【'+this._name+'】等级提升！',ColorManager.textColor(0))
	if($dataActors[this._actorId].meta.spVar){
		var spId = Number($dataActors[this._actorId].meta.spVar)
		if($dataActors[this._actorId].meta.spPerLv){
			var spPerLv = Number($dataActors[this._actorId].meta.spPerLv)
		}else{
			var spPerLv = 1 ;
		}
		$gameVariables.setValue( spId , $gameVariables.value(spId) + spPerLv )
		if( spPerLv > 0 ){
			sxlSimpleABS.showInformation('【'+this._name+'】获得 '+ spPerLv +' 点技能点',ColorManager.textColor(0))
		}
		if( spPerLv < 0 ){
			sxlSimpleABS.showInformation('【'+this._name+'】失去 '+ Math.abs(spPerLv) +' 点技能点',ColorManager.textColor(0))
		}
	}
	this._hp += this.mhp;
	this._mp += this.mmp;
};

sxlSkillWindow.refreshSkill = function(user){
	var userFix = $gameActors.actor(user);
	console.log( userFix._skills )
	if(!userFix.usedSP){
		userFix.usedSP = 0;
	}

	for( i = 0 ; i < userFix._skills.length ; i ++  ){
		if($dataSkills[userFix._skills[i]]&&$dataSkills[userFix._skills[i]].meta.levelVar){
			$gameVariables.setValue( $dataSkills[userFix._skills[i]].meta.levelVar , 0 );
		}
	};
	userFix._skills = [];
	
	$gameVariables.setValue( Number($dataActors[userFix._actorId].meta.spVar), 
							 $gameVariables.value(Number($dataActors[userFix._actorId].meta.spVar)) + userFix.usedSP );

	sxlSimpleABS.showInformation('【'+userFix._name+'】失去所有技能并且获得 '+ userFix.usedSP +' 点技能点',ColorManager.textColor(0))
	userFix.usedSP = 0;
};