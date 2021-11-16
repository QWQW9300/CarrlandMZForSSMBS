const _ssmbs_mapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_ssmbs_mapLoad.call(this);
	this.minimap = new Sprite(new Bitmap (192,192) );
	this.minimap.x = Graphics.width-192;
	this.minimap.y = Graphics.height-192;
	this.addChild(this.minimap);
};

const _ssmbs_mapUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	_ssmbs_mapUpdate.call(this);

};

Scene_Map.prototype.updateMinimap = function(){
	this.minimap.bitmap.clear()
	// for( i = 0 ; i < $game)
}