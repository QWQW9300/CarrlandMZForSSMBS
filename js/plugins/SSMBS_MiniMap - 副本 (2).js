
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Minimap
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 小地图插件
 * @author 神仙狼
 *
 * @help SSMBS_MiniMap.js
 *
 * 变量1~9必须预留不可使用。
 *
 * @param 小地图X偏移
 * @type Number
 * @desc 小地图X偏移，默认位置在屏幕右下
 * @default 0
 *
 * @param 小地图Y偏移
 * @type Number
 * @desc 小地图Y偏移，默认位置在屏幕右下
 * @default 0
 * 
 * @param 小地图窗口尺寸
 * @type Number
 * @desc 长宽相等，默认200*200
 * @default 200
 *
 * @param 小地图边框空余
 * @type Number
 * @desc 小地图素材外围大小，长宽相等，默认13
 * @default 13
 * 
 */

var sxlSimpleMinimap = sxlSimpleMinimap || {};
sxlSimpleMinimap.parameters = PluginManager.parameters('SSMBS_MiniMap');
sxlSimpleMinimap.windowXoffset = Number(sxlSimpleMinimap.parameters['小地图X偏移'] || 0);
sxlSimpleMinimap.windowYoffset = Number(sxlSimpleMinimap.parameters['小地图Y偏移'] || 0);
sxlSimpleMinimap.windowSize = Number(sxlSimpleMinimap.parameters['小地图窗口尺寸'] || 200);
sxlSimpleMinimap.windowPadding = Number(sxlSimpleMinimap.parameters['小地图边框空余'] || 13);


var pointWidth = 12;
var pointHeight = 12;

ImageManager.loadMinimap = function(filename) {
    return this.loadBitmap("img/minimap/", filename);
};

const _ssmbs_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_ssmbs_mapLoad.call(this);
	this.storeMapPosition = {x:0,y:0}
	this.pointFixX = Math.min(-($gamePlayer.x-6)*pointWidth,-1);
	this.pointFixY = Math.min(-($gamePlayer.y-6)*pointHeight,-1);
	this.minimapEventIconArray = [];
	this.minimap = new Sprite(new Bitmap (sxlSimpleMinimap.windowSize,sxlSimpleMinimap.windowSize) );
	this.minimap.x = Graphics.width-sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding+sxlSimpleMinimap.windowXoffset;
	this.minimap.y = Graphics.height-sxlSimpleMinimap.windowSize-sxlSimpleMinimap.windowPadding+sxlSimpleMinimap.windowYoffset;

	this.minimap.windowBackground=new Sprite();
	this.minimap.windowBackground.bitmap = ImageManager.loadSystem('minimapWindowBackground');
	this.minimap.windowBackground.x = this.minimap.x;
	this.minimap.windowBackground.y = this.minimap.y;

	this.addChild(this.minimap.windowBackground);
	if($dataMap.meta.minimapBackground){
		this.minimap.background = new Sprite();
		this.minimap.background.bitmap = ImageManager.loadMinimap($dataMap.meta.minimapBackground);
		this.minimap.background.x = this.minimap.x;
		this.minimap.background.y = this.minimap.y;
		this.addChild(this.minimap.background);
	}
	
	this.addChild(this.minimap);

	this.minimap.playerIcon=new Sprite();
	this.minimap.playerIcon.bitmap = ImageManager.loadSystem('IconSet');
	this.minimap.playerIcon.x = this.minimap.x-sxlSimpleMinimap.windowPadding;
	this.minimap.playerIcon.y = this.minimap.y-sxlSimpleMinimap.windowPadding;
	this.minimap.playerIcon.anchor.x = 0;
	this.minimap.playerIcon.anchor.y = 0;
	var icon = 464;
	this.minimap.playerIcon.setFrame( icon % 16*32,Math.floor( icon / 16)*32,32,32 )
	this.addChild(this.minimap.playerIcon);

	this.minimap.window=new Sprite();
	this.minimap.window.bitmap = ImageManager.loadSystem('minimapWindow');
	this.minimap.window.x = this.minimap.x-sxlSimpleMinimap.windowPadding;
	this.minimap.window.y = this.minimap.y-sxlSimpleMinimap.windowPadding;
	this.addChild(this.minimap.window);

	for( event of $gameMap.events() ){
		for ( list of event.page().list ){
			if(list.code == 108){
				for( parameters of list.parameters ){
					var text = parameters.split(':');
					if(text[0]=='minimapIcon'){
						event.minimapIconID = Number(text[1]);
						this.minimapIconEvent = new Sprite();
						this.minimapIconEvent.bitmap = ImageManager.loadSystem('IconSet');
						this.minimapIconEvent.setFrame(event.minimapIconID % 16*32,Math.floor( event.minimapIconID / 16)*32,32,32)
						this.minimapIconEvent.event = event;
						this.minimapIconEvent.anchor.x = 0.5;
						this.minimapIconEvent.anchor.y = 0.5;
						this.addChild(this.minimapIconEvent);
						this.minimapEventIconArray.push(this.minimapIconEvent);
					}
				}
			}
		}
	}
	//绘制地图方块
	this.createMinimapFinished = false;
};

const _ssmbs_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_ssmbs_mapUpdate.call(this);
	// this.updateMinimap();
	if(this.minimap.background){
		this.minimap.background.scale.x = pointWidth/48;
		this.minimap.background.scale.y = pointHeight/48;
	}
	if(!this.createMinimapFinished){
		this.createMinimap();
	}
	this.updateMinimap();
};

Scene_Map.prototype.createMinimap = function(){
	for( minimapPointX = 0 ; minimapPointX < $dataMap.width ; minimapPointX ++ ){
		for( minimapPointY = 0 ; minimapPointY < $dataMap.height ; minimapPointY ++ ){
			var boxColor=null;
			
			if( $gameMap.regionId(minimapPointX,minimapPointY) == 0 &&
				!$gamePlayer.canPass(minimapPointX,minimapPointY)){
				boxColor = '#444444';
			}

			if($gameMap.regionId(minimapPointX,minimapPointY) == 1){
				boxColor = '#FFFFE0'
			}
			if($gameMap.regionId(minimapPointX,minimapPointY) == 2){
				boxColor = '#7B68EE'
			}
			if( boxColor/* && playerDistanceX<=12 && playerDistanceY<=12*/){
			this.minimap.bitmap.fillRect( pointWidth*minimapPointX,
										  pointHeight*minimapPointY,
										  pointWidth, pointHeight, boxColor);
				
			}
		}
	}
	this.createMinimapFinished = true;
};

Scene_Map.prototype.updateMinimap = function(){
	var minimap = this.minimap;
	if(this.minimap.background){
		minimap = this.minimap.background;
	};
	minimap.setFrame((($gamePlayer._realX)*pointWidth),
					 (($gamePlayer._realY)*pointWidth),
					200,200)
	this.minimap.playerIcon.x = this.minimap.x+sxlSimpleMinimap.windowPadding+($gamePlayer._realX*pointWidth);
	this.minimap.playerIcon.y = this.minimap.y+sxlSimpleMinimap.windowPadding+($gamePlayer._realY*pointWidth);
}