//============================================================================
// 111_PartyCommandSkip.js
//============================================================================
// 2017 Aug 16 : fix bugs by Sasuke KANNNAZUKI
// 2019 Mar  5 : パーティーコマンドに常に戻らないモードを追加
// 2019 Mar  5 : YanflyBattleEngineCore.js に対応

/*:
 * @plugindesc 戦闘の戦う・逃げるを飛ばして戦闘へ
 * @author １１１（改変：神無月サスケ）
 *
 * @desc 戦闘の戦う・逃げるを飛ばして戦闘へ
 *
 * @param SwitchNumber
 * @desc このスイッチがONの時、「戦う・逃げる」メニューを飛ばします。
 * @default 111
 *
 * @param Never Display Switch Number
 * @desc このスイッチがONの時、「戦う・逃げる」メニューは表示されません。
 * @default 112
 *
 * @help
 * Parametersの番号のスイッチがONだった時、
 * 戦闘に入る時の「戦う・逃げる」メニューを飛ばして
 * そのまま戦闘へ。
 *
 * [神無月サスケ追記]
 * アクターコマンドの際にキャンセルを行うと「戦う・逃げる」が表示されるように
 * 仕様拡張
 *
 * [拡張機能]
 * オプションのスイッチ設定により、「戦う・逃げる」を一切表示しなくできます。
 * これは、アクターのコマンドに「逃げる」を入れる場合などを想定しており、
 * 普段はONにしないでください。
 *
 * YanflyBattleEngineCore.js と併用する場合、このプラグインを下に置いて下さい。
 *
 * [著作権表記]
 * このプラグインは、１１１様の 111_PartyCommandSkip.js をベースに、
 * 神無月サスケが大規模な加筆修正を行ったものです。１１１様に感謝します。
 *
 * このプラグインはパブリックドメインです。利用にいかなる制限もありません。
 */
(function() {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('111_PartyCommandSkip');
  var switchNumber = Number(parameters['SwitchNumber'] || '111');
  var neverDisplaySwitch = Number(parameters['Never Display Switch Number'] ||
   '112');

  //
  // add new class variable
  //
  var _Scene_Battle_initialize = Scene_Battle.prototype.initialize;
  Scene_Battle.prototype.initialize = function() {
    _Scene_Battle_initialize.call(this);
    this.hasAlreadyInputStart = false;
  };


  var _Scene_Battle_changeInputWindow =
   Scene_Battle.prototype.changeInputWindow;
  Scene_Battle.prototype.changeInputWindow = function() {
    if ($gameSwitches.value(neverDisplaySwitch)) {
      if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
          this.startActorCommandSelection();
        } else {
          BattleManager._actorIndex = 0;
          this.startActorCommandSelection();
          BattleManager.actor().setActionState('inputting');

        }
        return;
      }
    }
    if (!this.hasAlreadyInputStart) {
      if (BattleManager.isInputting() && $gameSwitches.value(switchNumber)) {
        BattleManager._actorIndex = 0;
        this.startActorCommandSelection();
        this.hasAlreadyInputStart = true;
        return;
      }
    }
    _Scene_Battle_changeInputWindow.call(this);
  };

  var _Scene_Battle_endCommandSelection =
   Scene_Battle.prototype.endCommandSelection;
  Scene_Battle.prototype.endCommandSelection = function() {
    _Scene_Battle_endCommandSelection.call(this);
    this.hasAlreadyInputStart = false;
  };

//
// For YanflyBattleEngineCore.js
//
  if ('Yanfly' in window && Yanfly.BEC) {
    Yanfly.BEC.Scene_Battle_selectPreviousCommand =
      Scene_Battle.prototype.selectPreviousCommand;
    Scene_Battle.prototype.selectPreviousCommand = function() {
      if (this.isStartActorCommand()) {
        BattleManager.selectPreviousCommand();
        if (BattleManager.isInputting() && BattleManager.actor()) {
          this.startActorCommandSelection();
        } else {
          if ($gameSwitches.value(neverDisplaySwitch)) {
            BattleManager._actorIndex = 0;
            this.startActorCommandSelection();
            return;
          }
          Yanfly.BEC.Scene_Battle_startPartyCommandSelection.call(this);
        }
      } else {
        Yanfly.BEC.Scene_Battle_selectPreviousCommand.call(this);
      }
    };
  }
})();