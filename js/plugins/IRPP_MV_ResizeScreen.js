//=============================================================================
// IRPP_MV_ResizeScreen.js
//=============================================================================

/*:
 * @plugindesc (※上部)(V1.1)画面サイズを自由に変更します。
 * @author イロスマRPG制作委員会
 *
 * @param Page1
 * @text 画面サイズ
 *
 * @param Screen Width
 * @desc 画面の横幅を調整します。
 * 通常: 816
 * @default 816
 * @type number
 * @min 160
 * @max 1900
 * @parent Page1
 *
 * @param Screen Height
 * @desc 画面の縦幅を調整します
 * 通常: 624
 * @default 624
 * @type number
 * @min 120
 * @max 960
 * @parent Page1
 *
 * @param Page2
 * @text オプション
 *
 * @param Scale Battlebacks
 * @desc 戦闘背景の画像を画面サイズに合わせて調整しますか？
 * @default 1
 * @type select
 * @option false
 * @value 0
 * @option true
 * @value 1
 * @parent Page2
 *
 * @param Scale Title
 * @desc タイトル画面の画像を画面サイズに合わせて調整しますか？
 * @default 1
 * @type select
 * @option false
 * @value 0
 * @option true
 * @value 1
 * @parent Page2
 *
 * @param Scale GameOver
 * @desc ゲームオーバー画面の画像を画面サイズに合わせて調整しますか？
 * @default 1
 * @type select
 * @option false
 * @value 0
 * @option true
 * @value 1
 * @parent Page2
 *
 * @help このプラグインを導入している時は敵キャラの位置が自動的に調整されます。
 * 画面の横幅は1280、縦幅は960までにしてください。
 * また、横幅や縦幅を大きくしすぎるとゲームの処理が遅くなり、
 * 画面の大きいPCでしか動作しなくなります。
 * 
 * 更新履歴：
 * V1.1:Version1.6.0以上のプロジェクトに対応
 */

var Imported = Imported || {};
Imported.IRPP_MV_ResizeScreen = true;
(function() {
var Parameters = PluginManager.parameters('IRPP_MV_ResizeScreen');
var scaleBattlebacks = Number(Parameters['Scale Battlebacks'] || 1);
var scaleTitle = Number(Parameters['Scale Title'] || 1);
var scaleGameOver = Number(Parameters['Scale GameOver'] || 1);

SceneManager._screenWidth       = Number(Parameters['Screen Width'] || 816);
SceneManager._screenHeight      = Number(Parameters['Screen Height'] || 624);
SceneManager._boxWidth          = Number(Parameters['Screen Width'] || 816);
SceneManager._boxHeight         = Number(Parameters['Screen Height'] || 624);

var _ScreenSprite_initialize = ScreenSprite.prototype.initialize
ScreenSprite.prototype.initialize = function() {
    _ScreenSprite_initialize.call(this);
    this.scale.x = Graphics.boxWidth * 10;
    this.scale.y = Graphics.boxHeight * 10;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.x = 0;
    this.y = 0;
};

var _SceneManager_run = SceneManager.run
SceneManager.run = function(sceneClass) {
    _SceneManager_run.call(this, sceneClass);
    if (Utils.isMobileDevice()) {
      return;
    }
    if (Utils.isMobileSafari()) {
      return;
    }
    if (Utils.isAndroidChrome()) {
      return;
    }
    var resizeWidth = Graphics.boxWidth - window.innerWidth;
    var resizeHeight = Graphics.boxHeight - window.innerHeight;
    window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
    window.resizeBy(resizeWidth, resizeHeight);
};

var _Scene_Title_start = Scene_Title.prototype.start;
Scene_Title.prototype.start = function() {
    _Scene_Title_start.call(this);
    if (scaleTitle == 1) {
      this.rescaleTitle();
    }
};

Scene_Title.prototype.rescaleTitle = function() {
    this.rescaleTitleSprite(this._backSprite1);
    this.rescaleTitleSprite(this._backSprite2);
};

Scene_Title.prototype.rescaleTitleSprite = function(sprite) {
    if (sprite.bitmap.width <= 0 || sprite.bitmap <= 0) {
      return;
    }
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var ratioX = width / sprite.bitmap.width;
    var ratioY = height / sprite.bitmap.height;
    if (ratioX > 1.0) {
      sprite.scale.x = ratioX;
    }
    if (ratioY > 1.0) {
      sprite.scale.y = ratioY;
    }
    this.centerSprite(sprite);
};

var _Scene_Gameover_start = Scene_Gameover.prototype.start;
Scene_Gameover.prototype.start = function() {
    _Scene_Gameover_start.call(this);
    if (scaleGameOver == 1) {
      this.rescaleBackground();
    }
};

Scene_Gameover.prototype.rescaleBackground = function() {
    this.rescaleImageSprite(this._backSprite);
};

Scene_Gameover.prototype.rescaleImageSprite = function(sprite) {
    if (sprite.bitmap.width <= 0 || sprite.bitmap <= 0) {
      return;
    }
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var ratioX = width / sprite.bitmap.width;
    var ratioY = height / sprite.bitmap.height;
    if (ratioX > 1.0) {
      sprite.scale.x = ratioX;
    }
    if (ratioY > 1.0) {
      sprite.scale.y = ratioY;
    }
    this.centerSprite(sprite);
};

Scene_Gameover.prototype.centerSprite = function(sprite) {
    sprite.x = Graphics.width / 2;
    sprite.y = Graphics.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
};

var _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler
Sprite_Enemy.prototype.setBattler = function(battler) {
    _Sprite_Enemy_setBattler.call(this, battler);
    if (!this._enemy._alteredScreenY) {
      this._homeY += Graphics.boxHeight - 624;
      this._enemy._screenY = this._homeY;
      this._enemy._alteredScreenY = true;
    }
    if ($gameSystem.isSideView()) {
      return;
    }
    if (!this._enemy._alteredScreenX) {
      this._homeX += (Graphics.boxWidth - 816) / 2;
      this._enemy._screenX = this._homeX;
      this._enemy._alteredScreenX = true;
    }
};

function Sprite_Battleback() {
    this.initialize.apply(this, arguments);
}

Sprite_Battleback.prototype = Object.create(Sprite.prototype);
Sprite_Battleback.prototype.constructor = Sprite_Battleback;

Sprite_Battleback.prototype.initialize = function(bitmapName, type) {
  Sprite.prototype.initialize.call(this);
  this._bitmapName = bitmapName;
  this._battlebackType = type;
  this.createBitmap();
};

Sprite_Battleback.prototype.createBitmap = function() {
  if (this._bitmapName === '') {
    this.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
  } else {
    if (this._battlebackType === 1) {
      this.bitmap = ImageManager.loadBattleback1(this._bitmapName);
    } else {
      this.bitmap = ImageManager.loadBattleback2(this._bitmapName);
    }
    this.scaleSprite();
  }
};

Sprite_Battleback.prototype.scaleSprite = function() {
  if (this.bitmap.width <= 0) return setTimeout(this.scaleSprite.bind(this), 5);
  var width = Graphics.boxWidth;
  var height = Graphics.boxHeight;
  if (this.bitmap.width < width) {
    this.scale.x = width / this.bitmap.width;
  }
  if (this.bitmap.height < height) {
    this.scale.y = height / this.bitmap.height;
  }
  this.anchor.x = 0.5;
  this.x = Graphics.boxWidth / 2;
  if ($gameSystem.isSideView()) {
    this.anchor.y = 1;
    this.y = Graphics.boxHeight;
  } else {
    this.anchor.y = 0.5;
    this.y = Graphics.boxHeight / 2;
  }
};

if (scaleBattlebacks == 1) {

if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= '1.3.2') {

Spriteset_Battle.prototype.createBattleback = function() {
  this._back1Sprite = new Sprite_Battleback(this.battleback1Name(), 1);
  this._back2Sprite = new Sprite_Battleback(this.battleback2Name(), 2);
  this._battleField.addChild(this._back1Sprite);
  this._battleField.addChild(this._back2Sprite);
};

Spriteset_Battle.prototype.updateBattleback = function() {
};

};

}
})();