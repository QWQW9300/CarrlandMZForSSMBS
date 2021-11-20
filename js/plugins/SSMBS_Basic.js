
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - Basic
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 一些基础改动
 * @author 神仙狼
 *
 * @help SSMBS_Basic.js
 *
 * 1. 渐变字体：drawTextGradient(text, x, y, maxWidth, lineHeight, align, color1, color2);
 * 2. 计算两点角度：ssmbsBasic.calcMoveAngle( point1 , point2)
 * 3. 数字转换器：ssmbsBasic.convertNumber( 数字,类型 ) // 类型：'second'将帧数转换为秒数 'thousand'用逗号划分数字
 * 4. 判定触碰：ssmbsBasic.isTouching(最小x,最小y,最大x,最大y)
 */

var ssmbsBasic = ssmbsBasic||{};

Bitmap.prototype.drawTextGradient = function(text, x, y, maxWidth, lineHeight, align, color1, color2,vertical) {
    // [Note] Different browser makes different rendering with
    //   textBaseline == 'top'. So we use 'alphabetic' here.
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
        tx += maxWidth / 2;
    }
    if (align === "right") {
        tx += maxWidth;
    }
    // context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    this._drawTextOutline(text, tx, ty, maxWidth);
    context.globalAlpha = alpha;
    this._drawTextBodyGradient(text, tx, ty, maxWidth,lineHeight,color1,color2,false);
};

Bitmap.prototype._drawTextBodyGradient = function(text, tx, ty, maxWidth,lineHeight,color1,color2,vertical) {
    const context = this.context;
    // context.fillStyle = this.textColor;
    const x1 = vertical ? tx : tx + this.measureTextWidth(text);
    const y1 = vertical ? ty + lineHeight : ty;
 	var gradient=context.createLinearGradient(tx,ty,x1,y1);
	gradient.addColorStop(0,color1);
	gradient.addColorStop(1,color2);
	context.save();
	context.fillStyle = gradient;
    context.fillText(text, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
};

ssmbsBasic.calcMoveAngle = function( point1, point2 ){
    let angle = Math.atan2((Number(point1.y)-Number(point2.y)), (Number(point1.x)-Number(point2.x)))*(180/Math.PI)+270;
    if(angle<0){
        return angle+360;
    }
    if(angle>=360){
        return angle-360;
    }
};

ssmbsBasic.convertNumber = function(number,type){
    if(type == 'second'){
        return Math.round(number/60);
    }
    if(type == 'thousand'){
        var result = '', counter = 0;
        number = (number || 0).toString();
        for (var i = number.length - 1; i >= 0; i--) {
            counter++;
            result = number.charAt(i) + result;
            if (!(counter % 3) && i != 0) { result = ',' + result; }
        }
        return result;
    }
}

ssmbsBasic.isTouching = function( x,y,maxX,maxY ){
    return TouchInput.x>x && TouchInput.y>y && TouchInput.x<maxX && TouchInput.y<maxY ;
};