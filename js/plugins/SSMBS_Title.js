
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Title
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 标题画面插件
 * @author 神仙狼
 *
 * @help SSMBS_Title.js
 *
 */

var SSMBS_Title = SSMBS_Title||{};
SSMBS_Title.showSplash = 1;
SSMBS_Title.splash = 'splash_SSMBS';
SSMBS_Title.nowchoice = 0;
SSMBS_Title.lastchoice = 0;
SSMBS_Title.choiceStartX = 0;
SSMBS_Title.choiceStartY = 600;
SSMBS_Title.wordLineHeight = 40;
SSMBS_Title.wordMaxWidth = 200;
SSMBS_Title.optionBarMaxOption = 255;
SSMBS_Title.optionBarMinOption = 192;

SSMBS_Title.optionMax = 2;

SSMBS_Title.movingBackground = 1;


function Scene_Title() {
	this.initialize(...arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

Scene_Title.prototype.initialize = function() {
	Scene_Base.prototype.initialize.call(this);
};

Scene_Title.prototype.create = function() {
	Scene_Base.prototype.create.call(this);
	this.createBackground();
	this.createForeground();
	this.createWindowLayer();
	this.createCommandWindow();
};

Scene_Title.prototype.start = function() {
	Scene_Base.prototype.start.call(this);
	SceneManager.clearStack();
	this.adjustBackground();
	
	this.startFadeIn(this.fadeSpeed(), false);
};

Scene_Title.prototype.update = function() {
	if (!this.isBusy()) {
		// this._commandWindow.open();
	}
	Scene_Base.prototype.update.call(this);
	if(this._splash&& this._splash.opacity!=0){
		if(this._splash.opacity==255){
			this._splash.opacityMode = true;
		}
		if(this._splash.opacity==0){
			this._splash.opacityMode = false;
			SSMBS_Title.finishSplash = true;
		}
		if(!this._splash.opacityMode){
			this._splash.opacity ++;
		}else{
			this._splash.opacity --;
		}
		if(Input.isTriggered('ok')||Input.isTriggered('escape')||TouchInput.isClicked()||TouchInput.isCancelled()){
			this._splash.opacity = 0;
			SSMBS_Title.finishSplash = true;
		}
		if(SSMBS_Title.finishSplash){
			this._splash.opacity = 0;
		}
	}
	if(this._splash.opacity == 0 ){
		if(!this.isPlayingTitleMusic){
			this.playTitleMusic();
			this.isPlayingTitleMusic = true;
		}
		
		if(this._titleImg){
			this._titleImg.opacity +=2;
			if(this._titleImg.opacity>=100){
				this._backSprite1.opacity+=2
			}
		}
		if(this._titleImg.opacity>10&&(Input.isTriggered('ok')||Input.isTriggered('escape')||TouchInput.isClicked()||TouchInput.isCancelled())){
			SSMBS_Title.finishTitle = true;
		}
		if(SSMBS_Title.finishTitle){
			this._titleImg.opacity = 255;
			this._backSprite1.opacity = 255;
		}
		if(this._titleOptionsWord){

			this._titleOptionsWord.opacity ++;
			this._titleOptionsWord.bitmap.clear();
			let line = 0;
			let lineHeight = SSMBS_Title.wordLineHeight;
			let maxWidth = SSMBS_Title.wordMaxWidth;
			this._titleOptionsWord.bitmap.fontSize = 22;
			// this._titleOptionsWord.bitmap.textColor = ColorManager.textColor(0);
			this._titleOptionsWord.bitmap.drawText('NEW GAME', Graphics.width*0.5-maxWidth/2+SSMBS_Title.choiceStartX, SSMBS_Title.choiceStartY+line*lineHeight, maxWidth, lineHeight, 'center');
			 if( TouchInput.x > Graphics.width*0.5-maxWidth/2+SSMBS_Title.choiceStartX && TouchInput.x < Graphics.width*0.5-maxWidth/2 +SSMBS_Title.choiceStartX + maxWidth &&
				TouchInput.y > SSMBS_Title.choiceStartY+line*lineHeight && TouchInput.y < SSMBS_Title.choiceStartY+(line+1)*lineHeight){
				SSMBS_Title.nowchoice = 0;
			}
			line++
			this._titleOptionsWord.bitmap.drawText('CONTINUE', Graphics.width*0.5-maxWidth/2+SSMBS_Title.choiceStartX, SSMBS_Title.choiceStartY+line*lineHeight, maxWidth, lineHeight, 'center');
			if( TouchInput.x > Graphics.width*0.5-maxWidth/2+SSMBS_Title.choiceStartX && TouchInput.x < Graphics.width*0.5-maxWidth/2 +SSMBS_Title.choiceStartX + maxWidth &&
				TouchInput.y > SSMBS_Title.choiceStartY+line*lineHeight && TouchInput.y < SSMBS_Title.choiceStartY+(line+1)*lineHeight){
				SSMBS_Title.nowchoice = 1;
			}
			line++
			this._titleOptionsWord.bitmap.drawText('OPTIONS', Graphics.width*0.5-maxWidth/2+SSMBS_Title.choiceStartX, SSMBS_Title.choiceStartY+line*lineHeight, maxWidth, lineHeight, 'center');
			if( TouchInput.x > Graphics.width*0.5-maxWidth/2+SSMBS_Title.choiceStartX && TouchInput.x < Graphics.width*0.5-maxWidth/2 +SSMBS_Title.choiceStartX + maxWidth &&
				TouchInput.y > SSMBS_Title.choiceStartY+line*lineHeight && TouchInput.y < SSMBS_Title.choiceStartY+(line+1)*lineHeight){
				SSMBS_Title.nowchoice = 2;
			}
			line++

			if(Input.isTriggered('up')||Input.isTriggered('w')){
				if(SSMBS_Title.nowchoice == 0){
					SSMBS_Title.nowchoice = SSMBS_Title.optionMax;
				}else{
					 SSMBS_Title.nowchoice --;
				}

			}
			if(Input.isTriggered('down')||Input.isTriggered('s')){
				if(SSMBS_Title.nowchoice == SSMBS_Title.optionMax){
					SSMBS_Title.nowchoice = 0;
				}else{
					 SSMBS_Title.nowchoice++;
				}
			}
			if( (TouchInput.isClicked() && this._splash.opacity == 0 &&
				TouchInput.x > Graphics.width*0.5-maxWidth/2+SSMBS_Title.choiceStartX && TouchInput.x < Graphics.width*0.5-maxWidth/2 +SSMBS_Title.choiceStartX + maxWidth &&
				TouchInput.y > SSMBS_Title.choiceStartY && TouchInput.y < SSMBS_Title.choiceStartY+(SSMBS_Title.optionMax+1)*lineHeight)
				|| Input.isTriggered('ok')){
				SoundManager.playOk();
				switch (SSMBS_Title.nowchoice){
					case 0:
						this.commandNewGame();
						break
					case 1:
						this.commandContinue();
						break
					case 2:
						this.commandOptions();
						break
				}
			}
		}
		if(this._titleOptionsBar){
			if(this._titleOptionsBar.opacity==SSMBS_Title.optionBarMaxOption){
				this._titleOptionsBar.opacityMode = true;
			}
			if(this._titleOptionsBar.opacity==SSMBS_Title.optionBarMinOption){
				this._titleOptionsBar.opacityMode = false;
			}
			if( this._titleOptionsBar.opacityMode){
				this._titleOptionsBar.opacity--;
			}else{
				this._titleOptionsBar.opacity++;
			}
			if( SSMBS_Title.lastchoice > SSMBS_Title.nowchoice){
				 SSMBS_Title.lastchoice -= (SSMBS_Title.lastchoice-SSMBS_Title.nowchoice)*0.1;
			}
			if( SSMBS_Title.lastchoice < SSMBS_Title.nowchoice){
				 SSMBS_Title.lastchoice += (SSMBS_Title.nowchoice-SSMBS_Title.lastchoice)*0.1;
			}
			this._titleOptionsBar.x = Graphics.width*0.5+SSMBS_Title.choiceStartX;
			this._titleOptionsBar.y = SSMBS_Title.choiceStartY+(SSMBS_Title.lastchoice+0.5)*SSMBS_Title.wordLineHeight;



		}
		if(SSMBS_Title.movingBackground){
			let movingX = (Graphics.width/2-TouchInput.x)*0.01;
			let movingY = (Graphics.height/2-TouchInput.y)*0.01;
			this._backSprite1.x = Graphics.width/2+movingX;
			this._backSprite1.y = Graphics.height/2+movingY;
		}
	}
	
};

Scene_Title.prototype.isBusy = function() {
	return (
		// this._commandWindow.isClosing() ||
		Scene_Base.prototype.isBusy.call(this)
	);
};

Scene_Title.prototype.terminate = function() {
	Scene_Base.prototype.terminate.call(this);
	SceneManager.snapForBackground();
	if (this._gameTitleSprite) {
		this._gameTitleSprite.bitmap.destroy();
	}
};

Scene_Title.prototype.createBackground = function() {
	this._splash = new Sprite(
		ImageManager.loadTitle1(SSMBS_Title.splash)
	);
	if(SSMBS_Title.showSplash){
		this._splash.opacity = 1;
	}else{
		this._splash.opacity = 0;
	}
	//第一标题背景
	this._backSprite1 = new Sprite(
		ImageManager.loadTitle1($dataSystem.title1Name)
	);
	this._backSprite1.opacity = 0;
	
	// 标题LOGO图片
	this._titleImg = new Sprite(
		ImageManager.loadTitle1('Title_Carrland_SSMBS')
	);
	this._titleImg.opacity = 0;
	// 第二标题背景
	this._backSprite2 = new Sprite(
		ImageManager.loadTitle2($dataSystem.title2Name)
	);
	
	this.addChild(this._backSprite1);
	this.addChild(this._titleImg);
	this.addChild(this._backSprite2);
	this.addChild(this._splash);
};

Scene_Title.prototype.createForeground = function() {
	// this._gameTitleSprite = new Sprite(
	//     new Bitmap(Graphics.width, Graphics.height)
	// );
	// this.addChild(this._gameTitleSprite);
	// if ($dataSystem.optDrawTitle) {
	//     this.drawGameTitle();
	// }
	this._titleOptionsBar = new Sprite( ImageManager.loadTitle1('chooseBar'));
	this._titleOptionsBar.opacity = 0;
	this._titleOptionsBar.anchor.x = 0.5;
	this._titleOptionsBar.anchor.y = 0.5;
	this.addChild(this._titleOptionsBar);

	this._titleOptionsWord = new Sprite( new Bitmap(Graphics.width,Graphics.height) );
	this._titleOptionsWord.opacity = SSMBS_Title.optionBarMinOption;
	this.addChild(this._titleOptionsWord);

};

Scene_Title.prototype.drawGameTitle = function() {
	// const x = 20;
	// const y = Graphics.height / 4;
	// const maxWidth = Graphics.width - x * 2;
	// const text = $dataSystem.gameTitle;
	// const bitmap = this._gameTitleSprite.bitmap;
	// bitmap.fontFace = $gameSystem.mainFontFace();
	// bitmap.outlineColor = "black";
	// bitmap.outlineWidth = 8;
	// bitmap.fontSize = 72;
	// bitmap.drawText(text, x, y, maxWidth, 48, "center");
};

Scene_Title.prototype.adjustBackground = function() {
	this.scaleSprite(this._backSprite1);
	this.scaleSprite(this._backSprite2);
	if(SSMBS_Title.movingBackground){
		this._backSprite1.scale.x += 0.1;
		this._backSprite1.scale.y += 0.1;
		this._backSprite1.anchor.x= 0.5;
		this._backSprite1.anchor.y= 0.5;
		this._backSprite1.x = Graphics.width/2;
		this._backSprite1.y = Graphics.height/2;
	}
	this.centerSprite(this._backSprite1);
	this.centerSprite(this._backSprite2);
};

Scene_Title.prototype.createCommandWindow = function() {
	// const background = $dataSystem.titleCommandWindow.background;
	// const rect = this.commandWindowRect();
	// this._commandWindow = new Window_TitleCommand(rect);
	// this._commandWindow.setBackgroundType(background);
	// this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
	// this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
	// this._commandWindow.setHandler("options", this.commandOptions.bind(this));
	// this.addWindow(this._commandWindow);
};

Scene_Title.prototype.commandWindowRect = function() {
	// const offsetX = $dataSystem.titleCommandWindow.offsetX;
	// const offsetY = $dataSystem.titleCommandWindow.offsetY;
	// const ww = this.mainCommandWidth();
	// const wh = this.calcWindowHeight(3, true);
	// const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
	// const wy = Graphics.boxHeight - wh - 96 + offsetY;
	// return new Rectangle(wx, wy, ww, wh);
};

Scene_Title.prototype.commandNewGame = function() {
	DataManager.setupNewGame();
	// this._commandWindow.close();
	this.fadeOutAll();
	SceneManager.goto(Scene_Map);
};

Scene_Title.prototype.commandContinue = function() {
	// this._commandWindow.close();
	SceneManager.push(Scene_Load);
};

Scene_Title.prototype.commandOptions = function() {
	// this._commandWindow.close();
	SceneManager.push(Scene_Options);
};

Scene_Title.prototype.playTitleMusic = function() {
	AudioManager.playBgm($dataSystem.titleBgm);
	AudioManager.stopBgs();
	AudioManager.stopMe();
};