
//=============================================================================
// RPG Maker MZ - Sxl Simple Map Battle System - KeyMap
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 键位扩展
 * @author 神仙狼
 *
 * @help SSMBS_KeyMap.js
 *
 * 想要增加键位的话，在插件里面增加。
 * 格式为
 * 键码(keycode): "键位名称",
 * 引号不可省略
 *
 * 除了最后一行，每一行最后必须加上英文逗号
 * 最后一行必须不加逗号
 *
 * 调用的命令为
 * Input.isTriggered("键位名称")
 *   
 */

Input.keyMapper = {
    9: "tab", // tab
    13: "ok", // enter
    16: "shift", // shift
    17: "control", // control
    18: "alt", // alt
    27: "escape", // escape
    32: "ok", // space
    33: "pageup", // pageup
    34: "pagedown", // pagedown
    37: "left", // left arrow
    38: "up", // up arrow
    39: "right", // right arrow
    40: "down", // down arrow
    45: "escape", // insert
    81: "pageup", // Q
    87: "pagedown", // W
    88: "escape", // X
    90: "ok", // Z
    96: "escape", // numpad 0
    98: "down", // numpad 2
    100: "left", // numpad 4
    102: "right", // numpad 6
    104: "up", // numpad 8
    120: "debug", // F9

    //主键盘区数字
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",

    //预留快捷键区
    73: "i",
    75: "k",
    192:"~",
    81: "q",

    87: "w",
    65: "a",
    83: "s",
    68: "d",
    90: 'z',
    84: 't',
    66: 'b',
    80: 'p'

};