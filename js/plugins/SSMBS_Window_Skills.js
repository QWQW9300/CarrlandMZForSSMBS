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
SSMBS_Window_Skills.width = 298;
SSMBS_Window_Skills.height = 498;

SSMBS_Window_Skills.startX = 72;
SSMBS_Window_Skills.startY = 48;
SSMBS_Window_Skills.gridsSize = 32;
SSMBS_Window_Skills.gridsSpace = 24;
SSMBS_Window_Skills.gridsPerLine = 4;
SSMBS_Window_Skills.gridsLines = 12;

SSMBS_Window_Skills.nowSkillTree = 0;


const _SSMBS_Window_Skills_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_SSMBS_Window_Skills_mapLoad.call(this);
	this.createSkillWindow();
};

const _SSMBS_Window_Skills_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_SSMBS_Window_Skills_mapUpdate.call(this);
	this.updateSkillWindow();
};

Scene_Map.prototype.createSkillWindow = function(){
	this.skillWindow = new Sprite( new Bitmap( SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height ));
	this.addChild(this.skillWindow);
	this.skillIconBackGround = new Sprite( new Bitmap( SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height ));
	this.skillIconBackGround.setColorTone ([0,0,0,255]);
	this.addChild(this.skillIconBackGround);
};

Scene_Map.prototype.updateSkillWindow = function(){
	this.skillWindow.bitmap.clear();
	this.skillIconBackGround.bitmap.clear();
	this.skillWindow.bitmap.blt(
		ImageManager.loadSystem('window_black'),
		0,0, //切割坐标
		SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height,//切割尺寸
		0, 0,// 绘制坐标
		SSMBS_Window_Skills.width ,SSMBS_Window_Skills.height //最终大小
	)
	this.skillWindow.bitmap.drawText( SSMBS_Window_Skills.windowTitle,0,0,SSMBS_Window_Skills.width,36,'center' );
	// 绘制背景图标
	let meta = $dataActors[$gameParty.members()[0]._actorId].meta.skills.concat($dataClasses[$gameParty.members()[0]._classId].meta.skills);
	let skillTrees = meta.split('\n');
	for( let t = 0 ; t < skillTrees.length ; t ++ ){
		let skills = skillTrees[SSMBS_Window_Skills.nowSkillTree].split(',');
		for( let s = 0 ; s < skills.length ; s ++  ){
			let skill = Number(skills[s]);
			if(skill){
				this.skillIconBackGround.bitmap.blt(
					ImageManager.loadSystem('IconSet'),
					$dataSkills[ skill ].iconIndex % 16*32,Math.floor($dataSkills[ skill ].iconIndex / 16)*32, //切割坐标
					32,	32,//切割尺寸
					SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),
					SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace),// 绘制坐标
					SSMBS_Window_Skills.gridsSize,	SSMBS_Window_Skills.gridsSize //最终大小
				)
				let theX = SSMBS_Window_Skills.startX+(s%SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace);
				let theY = SSMBS_Window_Skills.startY+Math.floor(s/SSMBS_Window_Skills.gridsPerLine)*(SSMBS_Window_Skills.gridsSize+SSMBS_Window_Skills.gridsSpace);
				if( ssmbsBasic.isTouching(theX,theY,theX+SSMBS_Window_Skills.gridsSize,theY+SSMBS_Window_Skills.gridsSize)  ){
					if(!this.isDrawing){
						this.itemInform = $dataSkills[ skill ];
					}
				}
			}
			
		}
	}
	
};