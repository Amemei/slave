//=============================================================================
// faceOnBattle.js
//=============================================================================

/*:
 * @plugindesc バトル時に顔グラを表示するプラグイン
 * @author カレーねずみ
 *
 * @help
 * 《効果/使い方》
 * アクターの顔グラに設定した画像が表示されます。
 * このプラグインを有効にすると全てのバトルに反映されます。
 * ※アイテム使用時にステータスウィンドウが横にずれてウィンドウが切れる仕様も修正しています。
 * 《注意点》
 * Window_BattleStatusクラスWindow_BattleActorクラスを変更しています。
 * 他のプラグインと併用する時はWindow_BattleStatusクラスとWindow_BattleActorクラスを変更していないか確認してください。
 *
 */
(function() {

  Window_BattleStatus.prototype.maxCols = function() {
      return 4;
  };

  Window_BattleStatus.prototype.drawItem = function(index) {
      const actor = $gameParty.battleMembers()[index];
      const rect = this.itemRectForText(index);
      this.contents.paintOpacity = 112;
      this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
      this.contents.paintOpacity = 255;
      this.drawBasicArea(rect, actor);
      this.drawGaugeArea(rect, actor);
  };

  Window_BattleStatus.prototype.itemRect = function(index) {
      const rect = new Rectangle();
      const maxCols = this.maxCols();
      rect.width = this.itemWidth();
      rect.height = this.windowHeight() - this.standardPadding() * 2;
      rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
      rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
      return rect;
  };

  Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
      this.drawActorName(actor, rect.x, rect.y, rect.width);
      this.drawActorIcons(actor, rect.x, rect.y + this.lineHeight(), rect.width);
  };

  Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
    const y = rect.y + this.lineHeight() * 2;
    this.drawActorHp(actor, rect.x, y, rect.width);
    this.drawActorMp(actor, rect.x, y + this.lineHeight(), rect.width);
  };

  Window_BattleActor.prototype.initialize = function(x, y) {
      Window_BattleStatus.prototype.initialize.call(this);
      this.openness = 255;
      this.hide();
  };

})();
