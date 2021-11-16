//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Simple Quest
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 简易的任务窗口
 * @author 神仙狼
 *
 * @help SSMBS_SimpleQuest.js
 * 
 * @param 任务快捷键
 * @type String
 * @desc 任务快捷键
 * @default q
 *
 * @param 返回按钮行数
 * @type Number
 * @desc 返回按钮行数
 * @default 18
 *
 * @param 任务种类
 * @type String
 * @desc 任务种类
 * @default 主线任务,支线任务
 * 
 * @param 每页任务数量
 * @type Number
 * @desc 每页任务数量
 * @default 10
 *
 * @param 窗口行高
 * @type number
 * @desc 窗口行高
 * @default 24
 *
 * @param 窗口边缘宽度
 * @type number
 * @desc 窗口边缘宽度
 * @default 24
 * 
 * @param 标题边缘宽度
 * @type number
 * @desc 标题边缘宽度
 * @default 48
 *
 * @param 任务最大值
 * @type number
 * @desc 任务最大值
 * @default 3
 * 
 */

var simpleQuest = simpleQuest||{};
simpleQuest.parameters = PluginManager.parameters('SSMBS_SimpleQuest');

simpleQuest.hotKey = String(simpleQuest.parameters['任务快捷键'] || 'q');
simpleQuest.backButtonLine = Number(simpleQuest.parameters['返回按钮行数'] || 18);
simpleQuest.questTypes = String(simpleQuest.parameters['任务种类'] || '主线任务,支线任务');
simpleQuest.pageQuestAmount = Number(simpleQuest.parameters['每页任务数量'] || 10);
simpleQuest.lineHeight = Number(simpleQuest.parameters['窗口行高'] || 24);
simpleQuest.padding = Number(simpleQuest.parameters['窗口边缘宽度'] || 24);
simpleQuest.paddingTitle = Number(simpleQuest.parameters['标题边缘宽度'] || 48);
simpleQuest.maxQuests = Number(simpleQuest.parameters['任务最大值'] || 3);

simpleQuest.questTypeArray = simpleQuest.questTypes.split(',');
simpleQuest.questTypeArray.unshift('所有任务')
simpleQuest.questTypeArray.push('已完成')
simpleQuest.nowQuestType = 0;
simpleQuest.nowPage = 0;

const _simpleQuestLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_simpleQuestLoad.call(this);		
};

const _simpleQuestUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_simpleQuestUpdate.call(this);
	this.createQuestWindow();
	if(Input.isTriggered( simpleQuest.hotKey )){
		SoundManager.playCursor();
		if( !this.openQuestWIndow ){
			this.openQuestWIndow = true ;
			if(this.background){
				this.background.x = this.questWindowSaveX ;
				this.background.y = this.questWindowSaveY ;
			}
		}else{
			this.openQuestWIndow = false ;
			this.background.x = 999999;
			this.background.y = 999999;
		}
	}
	if(!$gameParty.quests){
		$gameParty.quests = [];
	}
	
};

Scene_Map.prototype.createQuestWindow = function() {
	// if($gameParty.quests){
	// 	if( simpleQuest.questTypeArray[simpleQuest.nowQuestType] != '所有任务' ){
	// 		this.nowQuestNum = 0;
	// 		for(i in $gameParty.quests){
	// 			if($gameParty.quests.type == simpleQuest.questTypeArray[simpleQuest.nowQuestType] ){
	// 				this.nowQuestNum ++
	// 			}
	// 		}
	// 		simpleQuest.maxPage = Math.floor(this.nowQuestNum/simpleQuest.pageQuestAmount) + 1
	// 	}else{
	// 		this.nowQuestNum = 0;
	// 		for(i in $gameParty.quests){
	// 			if($gameParty.quests.type == ['已完成']){
	// 				this.nowQuestNum ++
	// 			}
	// 		}
	// 		simpleQuest.maxPage = Math.floor(($gameParty.quests.length-this.nowQuestNum-1)/simpleQuest.pageQuestAmount) + 1;
	// 	}
	// }else{
	// 	simpleQuest.maxPage = 1;
	// }
	if(!this.questWindow){
		this.questWindowSaveX = Graphics.width - 48 - 298 ;
		this.questWindowSaveY = 64;
		this.windowTitle = new Sprite();
		this.windowTitle.bitmap = ImageManager.loadSystem('questBackground')
		this.addChild(this.windowTitle);
		// this.windowBetween = new Sprite()
		// this.windowBetween.bitmap = ImageManager.loadSystem('QuestBetween')
		// this.addChild(this.windowBetween);
		// this.windowBottom = new Sprite();
		// this.windowBottom.bitmap = ImageManager.loadSystem('QuestBottom')
		// this.addChild(this.windowBottom);
		this.background = new Sprite(new Bitmap(298,this.lineHeight))
		this.background.opacity = 0;
		this.background.x = 999999 ;
		this.background.y = 999999 ;
		this.addChild(this.background);
		this.questSelectbar = new Sprite( new Bitmap(298,900) );
		this.questSelectbar.blendMode = 1;
		this.questSelectbar.opacity = 72;
		this.addChild(this.questSelectbar);
		this.questWindow = new Sprite(new Bitmap(298,900))
		this.addChild(this.questWindow);
		
	}else{
		this.background.bitmap.clear();
		this.questSelectbar.bitmap.clear();
		this.questWindow.bitmap.fontBold = false;
		this.questWindow.bitmap.fontSize = 14;
		this.background.bitmap.fillRect(0,0,298-simpleQuest.padding*2,24,'#000000');
		this.questWindow.bitmap.clear();
		if(!this.questWindowPage || this.questWindowPage == 'title'){
			this.questWindowQuest = null;
		}
		if(!this.questWindowQuest){
			this.questWindowPage = 'title';
		}
		var line = 0;
		var lineHeight = simpleQuest.lineHeight;
		//任务列表
		if(this.questWindowPage == 'title'){
			this.questWindow.bitmap.textColor = ColorManager.textColor(0);
			this.questWindow.bitmap.fontSize = 14;
			//任务类型
			this.questWindow.bitmap.drawText(simpleQuest.questTypeArray[simpleQuest.nowQuestType],simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'center')
			line ++ ;
			this.questWindow.bitmap.fontSize = 14;
			//任务页数
			this.questWindow.bitmap.drawText(simpleQuest.nowPage+1,simpleQuest.padding,simpleQuest.backButtonLine*lineHeight,298-simpleQuest.padding*2,lineHeight,'center')
			if(simpleQuest.nowPage+1 == 1){
				this.questWindow.bitmap.textColor = ColorManager.textColor(7);
			}else{
				this.questWindow.bitmap.textColor = ColorManager.textColor(0);
			}
			this.questWindow.bitmap.fontBold = false;
			this.questWindow.bitmap.fontSize = 14;
			this.questWindow.bitmap.drawText('上一页',simpleQuest.padding,simpleQuest.backButtonLine*lineHeight,298-simpleQuest.padding*2,lineHeight,'left');
			this.questWindow.bitmap.fontSize = 14;
			if(simpleQuest.nowPage+1 == simpleQuest.maxPage){
				this.questWindow.bitmap.textColor = ColorManager.textColor(7);
			}else{
				this.questWindow.bitmap.textColor = ColorManager.textColor(0);
			}
			this.questWindow.bitmap.fontBold = false;
			this.questWindow.bitmap.fontSize = 14;
			this.questWindow.bitmap.drawText('下一页',simpleQuest.padding,simpleQuest.backButtonLine*lineHeight,298-simpleQuest.padding*2,lineHeight,'right');
			this.questWindow.bitmap.fontSize = 14;
			for( i in $gameParty.quests){
				$gameParty.quests[i].id = i;
				$gameParty.quests[i].page = Math.floor($gameParty.quests[i].id / simpleQuest.pageQuestAmount) + 1;
				if( ((simpleQuest.questTypeArray[simpleQuest.nowQuestType] == '所有任务' && $gameParty.quests[i].type != '已完成') 
					|| $gameParty.quests[i].type == simpleQuest.questTypeArray[simpleQuest.nowQuestType])
					&& $gameParty.quests[i].page == simpleQuest.nowPage+1){
					var questALL = $gameParty.quests[i]
					var title = questALL.title;
					var subtitle = questALL.subtitle;
					var description = questALL.description;
					var descSplit = description.split('/NL')
					var nowVariables = $gameVariables.value(questALL.progress);
					var needVariables = questALL.maxProgress;
					var award = questALL.award;
					this.questWindow.bitmap.fontBold = true;

					this.questWindow.bitmap.fontSize = 14;
					this.questWindow.bitmap.fontFace = $gameSystem.mainFontFace();
					this.questWindow.bitmap.textColor = '#ffffff';
					if(questALL.color){
						this.questWindow.bitmap.textColor = ColorManager.textColor(Number(questALL.color))
					}
					if(questALL.type2){
						this.questWindow.bitmap.drawText('['+questALL.type+']'+'['+questALL.type2+']'+title,simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')	
					}else{
						this.questWindow.bitmap.drawText('['+questALL.type+']'+title,simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')	
					}
					this.questWindow.bitmap.textColor = '#ffffff';
					this.questWindow.bitmap.fontBold = false;

					$gameParty.quests[i].line = line;
					$gameParty.quests[i].y = line*lineHeight+simpleQuest.paddingTitle;
					$gameParty.quests[i].x = simpleQuest.padding;
					$gameParty.quests[i].maxY = $gameParty.quests[i].y + lineHeight;
					$gameParty.quests[i].maxX = $gameParty.quests[i].x + 298-simpleQuest.padding*2;
					line ++ ;

					this.questWindow.bitmap.textColor = '#ffffff'
					this.questWindow.bitmap.fontBold = false;
					this.questWindow.bitmap.fontSize = 14;
					this.questWindow.bitmap.drawText(subtitle,simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')
					this.questWindow.bitmap.fontSize = 14;
					this.questWindow.bitmap.fontBold = false;

					this.questWindow.bitmap.textColor = '#ffffff';

					line ++ ;
				}
				
				
			}
		}else{
			//任务内容
			var questALL = this.questWindowQuest;
			var title = questALL.title;
			var subtitle = questALL.subtitle;
			var description = questALL.description;
			var descSplit = description.split('/NL')
			var nowVariables = questALL.progress;
			var needVariables = questALL.maxProgress;
			var award = questALL.award;
			
			this.questWindow.bitmap.fontSize = 18;
			this.questWindow.bitmap.textColor = '#ffffff';
			if(questALL.color){
				this.questWindow.bitmap.textColor = ColorManager.textColor(Number(questALL.color))
			}
			this.questWindow.bitmap.fontBold = true;
			this.questWindow.bitmap.drawText(title,simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'center')
			this.questWindow.bitmap.textColor = '#ffffff';
			this.questWindow.bitmap.fontBold = false;
			this.questWindow.bitmap.fontSize = 14;
			line ++ ;
			this.questWindow.bitmap.fontBold = false;
			this.questWindow.bitmap.fontSize = 14;
			this.questWindow.bitmap.textColor = '#ffffff';
			if(questALL.type2){
				this.questWindow.bitmap.drawText(questALL.type+'('+questALL.type2+')',simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'center')
			}else{
				this.questWindow.bitmap.drawText(questALL.type,simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'center')
			}
			line ++ ;
			this.questWindow.bitmap.fontBold = false;
			this.questWindow.bitmap.fontSize = 14;
			this.questWindow.bitmap.textColor = '#ffffff';
			this.questWindow.bitmap.drawText(subtitle,simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'center')
			line ++ ;
			line ++ ;
			for( j in descSplit){
				this.questWindow.bitmap.drawText(descSplit[j],simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')
				line ++ ;
			}
			if(nowVariables>=needVariables){
				this.questWindow.bitmap.textColor = ColorManager.textColor(24);
			}
			// line ++ ;
			// this.questSelectbar.bitmap.gradientFillRect(2,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding,lineHeight,'#FFFFFF','#000000');
			this.questWindow.bitmap.textColor = ColorManager.textColor(0);
			this.questWindow.bitmap.drawText('进度: ',simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')
			this.questWindow.bitmap.textColor = '#ffffff'
			line ++ ;
			for( a in questALL.targets){
				this.questWindow.bitmap.drawText(questALL.targets[a]+': '+$gameVariables.value(nowVariables[a])+' / '+needVariables[a],simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')
				line ++ ;
			}
			// line ++ ;
			// this.questSelectbar.bitmap.gradientFillRect(2,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding,lineHeight,'#FFFFFF','#000000');
			this.questWindow.bitmap.textColor = ColorManager.textColor(0);
			this.questWindow.bitmap.drawText('奖励: ',simpleQuest.padding,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')
			line ++ ;
			for( a in award){
				let theAward = award[a];
				if(theAward.itypeId || theAward.etypeId){
					this.questWindow.bitmap.textColor = '#ffffff'
					if(theAward.meta.textColor){
						this.questWindow.bitmap.textColor = ColorManager.textColor(Number(theAward.meta.textColor));
					}
					this.questWindow.bitmap.blt(
						ImageManager.loadSystem('IconSet'),
						theAward.iconIndex% 16*32,Math.floor(theAward.iconIndex / 16)*32, //切割坐标
						32,	32,//切割尺寸
						simpleQuest.padding, line*lineHeight+simpleQuest.paddingTitle+4,// 绘制坐标
						16,	16 //最终大小
					)
					if( TouchInput.x > this.background.x + simpleQuest.padding && TouchInput.y > this.background.y + line*lineHeight+simpleQuest.paddingTitle+4 && 
						TouchInput.x < this.background.x + simpleQuest.padding+16 && TouchInput.y < this.background.y + line*lineHeight+simpleQuest.paddingTitle+4+16 ){
						this.itemInform = theAward;
					}
					this.questWindow.bitmap.drawText(theAward.name+' * '+questALL.awardAmounts[a],simpleQuest.padding+20,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')
				}else{
					this.questWindow.bitmap.drawText(theAward,simpleQuest.padding+20,line*lineHeight+simpleQuest.paddingTitle,298-simpleQuest.padding*2,lineHeight,'left')
				}
				this.questWindow.bitmap.textColor = '#ffffff'
				line ++ ;
			}
			this.questWindow.bitmap.drawText('点击返回',simpleQuest.padding,simpleQuest.backButtonLine*lineHeight,298-simpleQuest.padding*2,lineHeight,'center')
		}
		

		this.windowTitle.y = this.background.y;
		// this.windowBetween.y = this.background.y + 48;
		// this.windowBetween.scale.y = Math.max(line-1,0);
		// this.windowBottom.y = this.windowBetween.scale.y == 0?
									 // this.background.y + 48 : this.background.y + lineHeight* (line+1)
		this.questWindow.x = this.background.x;
		this.questWindow.y = this.background.y;
		this.windowTitle.x = this.background.x;
		this.questSelectbar.x = this.background.x;
		this.questSelectbar.y = this.background.y;
		
		// this.windowBetween.x = this.background.x;
		// this.windowBottom.x = this.background.x;
	}
	//选择
	//任务类型
	if(TouchInput.isClicked() ){
		simpleQuest.refreshNowQuests();
	}
	if( this.questWindowPage == 'title' &&
		TouchInput.x > this.background.x+simpleQuest.padding&&
		TouchInput.x < this.background.x+298-simpleQuest.padding*2&&
		TouchInput.y > this.background.y+simpleQuest.paddingTitle&&
		TouchInput.y < this.background.y+simpleQuest.lineHeight+simpleQuest.paddingTitle){
		this.questSelectbar.bitmap.fillRect(simpleQuest.padding,simpleQuest.paddingTitle,298-simpleQuest.padding*2,simpleQuest.lineHeight,'#FFFFFF');
		if( TouchInput.isClicked() ){
			if(simpleQuest.nowQuestType==simpleQuest.questTypeArray.length-1){
				simpleQuest.nowQuestType = 0;
			}else{
				simpleQuest.nowQuestType ++;
			}
		}
	}
	//页数
	if(this.questWindowPage == 'title'){
		if( TouchInput.x > this.background.x + simpleQuest.padding &&
			TouchInput.x < this.background.x + 298-simpleQuest.padding*2&&
			TouchInput.y > this.background.y + lineHeight*(simpleQuest.backButtonLine) &&
		 	TouchInput.y < this.background.y + lineHeight*(simpleQuest.backButtonLine+1)){
			if(TouchInput.x < this.background.x + (298-simpleQuest.padding*2)/2){
				this.questSelectbar.bitmap.gradientFillRect(simpleQuest.padding/2, lineHeight*simpleQuest.backButtonLine,298-simpleQuest.padding,lineHeight,'#FFFFFF','#000000');
				if( TouchInput.isClicked() ){
					if(simpleQuest.nowPage+1 > 1){
						simpleQuest.nowPage --;
					}
				}
			}else{
				this.questSelectbar.bitmap.gradientFillRect(simpleQuest.padding/2, lineHeight*simpleQuest.backButtonLine,298-simpleQuest.padding,lineHeight,'#000000','#FFFFFF');
				if( TouchInput.isClicked() ){
					simpleQuest.nowPage ++;
				}
			}
			
		}
	}
	//返回界面
	if(this.questWindowPage == 'content'){
		if( TouchInput.x > this.background.x +simpleQuest.padding &&
			TouchInput.x < this.background.x+298-simpleQuest.padding*2&&
			TouchInput.y > this.background.y + lineHeight*(simpleQuest.backButtonLine) &&
		 	TouchInput.y < this.background.y + lineHeight*(simpleQuest.backButtonLine+1)){
			this.questSelectbar.bitmap.fillRect(simpleQuest.padding, lineHeight*simpleQuest.backButtonLine,298-simpleQuest.padding*2,lineHeight,'#FFFFFF');
			if( TouchInput.isClicked() ){
				this.questWindowPage = 'title';
				this.questWindowQuest = null;
			}
		}
	}

	//选择任务
	for( i in simpleQuest.nowQuests){
		if( this.questWindowPage == 'title' &&
			TouchInput.x > this.background.x + simpleQuest.nowQuests[i].x &&
			TouchInput.x < this.background.x + simpleQuest.nowQuests[i].maxX&&
			TouchInput.y > this.background.y + simpleQuest.nowQuests[i].y &&
			TouchInput.y < this.background.y + simpleQuest.nowQuests[i].maxY){
			this.questSelectbar.bitmap.fillRect(simpleQuest.nowQuests[i].x,simpleQuest.nowQuests[i].y,298-simpleQuest.padding*2,lineHeight,'#FFFFFF');
			if( TouchInput.isClicked() ){
				this.questWindowPage = 'content';
				this.questWindowQuest = simpleQuest.nowQuests[i];
			}
		}
	}
	if(TouchInput.x > this.background.x &&
		TouchInput.x < this.background.x + 298 &&
		TouchInput.y > this.background.y &&
		TouchInput.y < this.background.y + 500){
		$gameParty.members()[0]._tp = 0 ;
	}
	if( TouchInput.isTriggered() &&
		TouchInput.x > this.background.x &&
		TouchInput.x < this.background.x + 298 - 32 &&
		TouchInput.y > this.background.y &&
		TouchInput.y < this.background.y + 32){

		if(!this.bindWindow){
			this.bindWindow = 'questWindow';
		}
		this.moveQuestWindow = true;
		}else if( TouchInput.isHovered() ){
			this.moveQuestWindow = false;
			this.bindWindow = null;
		}
	if(this.moveQuestWindow == true && this.bindWindow == 'questWindow'){
		this.background.x = TouchInput.x-this.windowTitle.width/2;
		this.background.y = TouchInput.y-16;
		if(this.background.x<0) this.background.x=0;
		if(this.background.y<0) this.background.y=0;
		if(this.background.x>Graphics.width - this.windowTitle.width) this.background.x=Graphics.width - this.windowTitle.width;
		if(this.background.y>Graphics.height - this.windowTitle.height) this.background.y=Graphics.height - this.windowTitle.height;
		this.questWindowSaveX = this.background.x;
		this.questWindowSaveY = this.background.y;
	}
	if( (TouchInput.isClicked() &&
		TouchInput.x > this.background.x + 298 -32 &&
		TouchInput.x < this.background.x + 298 &&
		TouchInput.y > this.background.y &&
		TouchInput.y < this.background.y + 32)){
		SoundManager.playCursor();
		this.openQuestWIndow = false;
		this.background.x = 999999;
		this.background.y = 999999;
	}
};

simpleQuest.refreshNowQuests = function(){
	simpleQuest.nowQuests = [];
	for( i in $gameParty.quests){
		if( ((simpleQuest.questTypeArray[simpleQuest.nowQuestType] == '所有任务' && $gameParty.quests[i].type != '已完成') 
		|| $gameParty.quests[i].type == simpleQuest.questTypeArray[simpleQuest.nowQuestType])
		&& $gameParty.quests[i].page == simpleQuest.nowPage+1){
			simpleQuest.nowQuests.push($gameParty.quests[i])
		}
	}
	
}

simpleQuest.addNewQuest = function( questTitle, questSubtitle, questDescription, targets, questProgress, questMaxProgress, questAward, awardAmounts, type, color ){
	// for( i in $gameParty.quests ){
	// 	if( $gameParty.quests[i] == varId){
	// 		$gameParty.quests.splice(i,1);
	// 	}
	// }
	// if( $gameParty.quests.length < simpleQuest.maxQuests){
	// 	$gameParty.quests.push(varId);
	// }
	if(!$gameParty.quests){
		$gameParty.quests = [];
	}
	$gameParty.quests.push(
		{
		 title:questTitle,
		 subtitle:questSubtitle,
		 description:questDescription,
		 targets:targets,
		 progress:questProgress,
		 maxProgress:questMaxProgress,
		 award:questAward,
		 awardAmounts:awardAmounts,
		 type:type,
		 color:color
		}
	)
};

simpleQuest.removeQuest = function( questTitle ){
	for( i in $gameParty.quests ){
		if($gameParty.quests[i].title == questTitle){
			$gameParty.quests.splice(i,1);
		}
	}
};

simpleQuest.hasQuest = function( questTitle ){
	for( i in $gameParty.quests ){
		if($gameParty.quests[i].title == questTitle){
			return true;
		}
	}
};

simpleQuest.completeQuset = function( questTitle , goldGain){
	for( i in $gameParty.quests ){
		if($gameParty.quests[i].title == questTitle){
			$gameParty.quests[i].type2 = $gameParty.quests[i].type;
			$gameParty.quests[i].type = '已完成';
			if(goldGain){
				$gameParty.gainGold(goldGain);
			}
			for(j in $gameParty.quests[i].award){
				if($gameParty.quests[i].awardAmounts[j]>0){
					$gameParty.gainItem($gameParty.quests[i].award[j],$gameParty.quests[i].awardAmounts[j]);
				}
			}
		}
	}
};