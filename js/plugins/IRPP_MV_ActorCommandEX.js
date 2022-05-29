//=============================================================================
// IRPP_MV_ActorCommandEX.js
//=============================================================================

/*:
 * @plugindesc (※最上部)戦闘時のアクターコマンドをカスタマイズします。
 * @author イロスマRPG制作委員会
 *
 * @param Show Attack Command
 * @desc 戦闘時のアクターコマンドで「攻撃」を表示しますか？
 * @default 1
 * @type select
 * @option false
 * @value 0
 * @option true
 * @value 1
 *
 * @param Show Guard Command
 * @desc 戦闘時のアクターコマンドで「防御」を表示しますか？
 * @default 1
 * @type select
 * @option false
 * @value 0
 * @option true
 * @value 1
 *
 * @param Show Item Command
 * @desc 戦闘時のアクターコマンドで「アイテム」を表示しますか？
 * @default 1
 * @type select
 * @option false
 * @value 0
 * @option true
 * @value 1
 *
 * @help このプラグインにはプラグインコマンドがありません。
 * IRPP_MV_RemoveSTypeWindowと併用するのがおすすめです。
 * 
 * ※「Show Guard Command」と「Show Item Command」の値が1以外の時は
 * 　プラグインの設定にかかわらず「攻撃」のコマンドが表示されます。
 */

var Imported = Imported || {};
Imported.IRPP_MV_ActorCommandEX = true;
(function() {
var Parameters = PluginManager.parameters('IRPP_MV_ActorCommandEX');
var showAttackCommand = Number(Parameters['Show Attack Command'] || 1);
var showGuardCommand = Number(Parameters['Show Guard Command'] || 1);
var showItemCommand = Number(Parameters['Show Item Command'] || 1);

Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        if ((showAttackCommand == 1) || (showGuardCommand != 1 && showItemCommand != 1)) {
            this.addAttackCommand();
        }
        this.addSkillCommands();
        if (showGuardCommand == 1) {
            this.addGuardCommand();
        }
        if (showItemCommand == 1) {
            this.addItemCommand();
        }
    }
};
})();