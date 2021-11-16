var ssmbsItemPlus = ssmbsItemPlus || {};
ssmbsItemPlus.prefix = [
{id: 0, name: '毁灭之', atk: 3000}


]


const _ssmbs_itemPlusMapLoad = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
	_ssmbs_itemPlusMapLoad.call(this);
	if(!$gameParty.plusItems){
		$gameParty.plusItems = [];
	}
	for( i in $gameParty.plusItems ){
		var fixedItem = $gameParty.plusItems[i];
		fixedItem.store = (fixedItem.baseItemType == 'weapon')?$dataWeapons[fixedItem.baseItemId]:$dataArmors[fixedItem.baseItemId];
		for( j in fixedItem.prefix ){
			fixedItem.store.prefix[i] = ssmbsItemPlus.prefix[fixedItem.prefix[i]]
			fixedItem.store.name += (' ' +  ssmbsItemPlus.prefix[fixedItem.prefix[i]].name );
			fixedItem.store.params[0] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].mhp?ssmbsItemPlus.prefix[fixedItem.prefix[i]].mhp:0;
			fixedItem.store.params[1] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].mmp?ssmbsItemPlus.prefix[fixedItem.prefix[i]].mmp:0;
			fixedItem.store.params[2] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].atk?ssmbsItemPlus.prefix[fixedItem.prefix[i]].atk:0;
			fixedItem.store.params[3] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].def?ssmbsItemPlus.prefix[fixedItem.prefix[i]].def:0;
			fixedItem.store.params[4] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].mat?ssmbsItemPlus.prefix[fixedItem.prefix[i]].mat:0;
			fixedItem.store.params[5] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].mdf?ssmbsItemPlus.prefix[fixedItem.prefix[i]].mdf:0;
			fixedItem.store.params[6] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].agi?ssmbsItemPlus.prefix[fixedItem.prefix[i]].agi:0;
			fixedItem.store.params[7] += ssmbsItemPlus.prefix[fixedItem.prefix[i]].luk?ssmbsItemPlus.prefix[fixedItem.prefix[i]].luk:0;
		}
		fixedItem = fixedItem.store;
	}
};

ssmbsItemPlus.getItem = function(baseItem,prefixMeta){
	var fixedItem = baseItem;
	fixedItem.baseItemType = baseItem.wtypeId?'weapon':'armor';
	fixedItem.baseItemId = baseItem.id;
	fixedItem.prefix=[];
	for ( i in prefixMeta ){
		fixedItem.name += (' ' +  ssmbsItemPlus.prefix[prefixMeta[i]].name );
		fixedItem.params[0] += ssmbsItemPlus.prefix[prefixMeta[i]].mhp?ssmbsItemPlus.prefix[prefixMeta[i]].mhp:0;
		fixedItem.params[1] += ssmbsItemPlus.prefix[prefixMeta[i]].mmp?ssmbsItemPlus.prefix[prefixMeta[i]].mmp:0;
		fixedItem.params[2] += ssmbsItemPlus.prefix[prefixMeta[i]].atk?ssmbsItemPlus.prefix[prefixMeta[i]].atk:0;
		fixedItem.params[3] += ssmbsItemPlus.prefix[prefixMeta[i]].def?ssmbsItemPlus.prefix[prefixMeta[i]].def:0;
		fixedItem.params[4] += ssmbsItemPlus.prefix[prefixMeta[i]].mat?ssmbsItemPlus.prefix[prefixMeta[i]].mat:0;
		fixedItem.params[5] += ssmbsItemPlus.prefix[prefixMeta[i]].mdf?ssmbsItemPlus.prefix[prefixMeta[i]].mdf:0;
		fixedItem.params[6] += ssmbsItemPlus.prefix[prefixMeta[i]].agi?ssmbsItemPlus.prefix[prefixMeta[i]].agi:0;
		fixedItem.params[7] += ssmbsItemPlus.prefix[prefixMeta[i]].luk?ssmbsItemPlus.prefix[prefixMeta[i]].luk:0;
		fixedItem.suffix.push(suffixMeta)
	}
	$gameParty.plusItems.push(fixedItem);
}

ssmbsItemPlus.gainItemPlus = function( item , prefix){
	let itemPlus = new Game_Item;
	itemPlus.id = 1000;
	itemPlus.name = prefix+' '+itemPlus.name;
	console.log(itemPlus)
	$gameParty.gainItem(itemPlus,1)
};