//=============================================================================
// chunkof_AudioAlert  Audioアラート
// author:  chunkof (http://chunkof.net/)
// License: MIT
// Version: 1.1.0 : パラメータ追加：displayAlert 警告文の表示(true/false)
// Version: 1.0.2 : 文言修正：WebAudio -> Web Audio
// Version: 1.0.1 : 2回目以降はアラートを表示しない(「タイトルへ戻る」を選択したときなど）
// Version: 1.0.0 : 新規作成
//=============================================================================
/*:
 * @plugindesc In the case of not support Web Audio , to continue without audio and displays an alert.
 *
 * @author chunkof (http://chunkof.net/)
 *
 * @param displayAlert
 * @desc true/false
 * @default true
 *
 * @help  Default alert message is Japanese .
 * Please overwrite the "chunkof_AudioAlert.createWindow" If you want to change .
 *
 */
/*:ja
 * @plugindesc WebAudio非対応ブラウザで開かれた場合「警告表示」「音声なしでプレイ続行」を行います。
 *
 * @author chunkof (http://chunkof.net/)
 * *
 * @param displayAlert
 * @desc 警告文の表示(true/false)
 * @default true
 *
 * @help  「警告表示」の文言を変更したい場合は"chunkof_AudioAlert.createWindow"を上書きしてください。
 *
 * プラグインコマンドはありません。
 */

//-----------------------------------------------------------------------------
// Global
var chunkof_AudioAlert = chunkof_AudioAlert || {};

(function() {
  //-----------------------------------------------------------------------------
  // Plugin parameters
  var params = PluginManager.parameters('chunkof_AudioAlert');
  var param_displayAlert = Boolean((params['displayAlert'] === 'true') || false);

  //-----------------------------------------------------------------------------
  // Audio flag
  chunkof_AudioAlert.supportAudio = true;
  chunkof_AudioAlert.alreadyDisplayedAlert = false;

  //-----------------------------------------------------------------------------
  // AudioManager (Catch audio error)
  var AudioManager_checkWebAudioError = AudioManager.checkWebAudioError;
  AudioManager.checkWebAudioError = function(webAudio) {
    try {
      AudioManager_checkWebAudioError.call(this, webAudio);
    }
    catch(e) {
      chunkof_AudioAlert.supportAudio = false;
    }
  };

  //-----------------------------------------------------------------------------
  // SceneManager (Catch audio error)
  var SceneManager_initAudio = SceneManager.initAudio;
  SceneManager.initAudio = function() {
    try {
      SceneManager_initAudio.call(this);
    }
    catch(e) {
      chunkof_AudioAlert.supportAudio = false;
    }
  };

  //-----------------------------------------------------------------------------
  // SceneManager (NOP checkFileAccess)
  SceneManager.checkFileAccess = function() {
    // 実際はファイルアクセスできるのにここで弾いてしまう場合があるのでNOP。
    // (IEでGitHubPagesに乗せてるゲームを開いたとき等)
  };

  //-----------------------------------------------------------------------------
  // chunkof_AudioAlert.Window
  //
  chunkof_AudioAlert.Window = function() {
    this.initialize.apply(this, arguments);
  };
  chunkof_AudioAlert.Window.prototype = Object.create(Window_Base.prototype);
  chunkof_AudioAlert.Window.prototype.constructor = chunkof_AudioAlert.Window;
  chunkof_AudioAlert.Window.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    var x = 0;
    var y = (Graphics.boxHeight - height) / 2;
    Window_Base.prototype.initialize.call(this, x, y, width, height);

    this._text = '';
    this.setBackgroundType(1);
  };
  chunkof_AudioAlert.Window.prototype.setText = function(text) {
    if (this._text !== text) {
      this._text = text;
      this.refresh();
    }
  };
  chunkof_AudioAlert.Window.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
  };
  chunkof_AudioAlert.Window.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this.isTriggered()){
      this.close();
    }
  };
  chunkof_AudioAlert.Window.prototype.isTriggered = function() {
    return (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
    TouchInput.isRepeated());
  };
  chunkof_AudioAlert.Window.prototype.dimColor1 = function() {
    return 'rgba(0, 0, 0, 0.8)';
  };

  //-----------------------------------------------------------------------------
  // chunkof_AudioAlert.createWindow（static function)
  //
  chunkof_AudioAlert.createWindow = function (){
    var alertWindow = new chunkof_AudioAlert.Window(9);
    var text = "                  ★注意★\n";
    text    += "\n";
    text    += "   お使いのブラウザはWeb Audio非対応です。\n";
    text    +=  "   ゲーム中の\\C[14]BGMや効果音が鳴りません。\\C\n";
    text    += "\n";
    text    +=  "   他にも不都合が生じる場合があります。\n";
    text    += "   \\C[23]Web Audio対応ブラウザ\\C[0]をご利用ください。\n";
    text    += "   \\C[23]（Chrome/FireFox/Safari/Edgeなど）\\C[0]";
    alertWindow.setText(text);

    return alertWindow;
  };

  //-----------------------------------------------------------------------------
  // Scene_Title (Append "_alertWindow")
  //
  var Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
  Scene_Title.prototype.createCommandWindow = function() {
    Scene_Title_createCommandWindow.call(this);

    if ( param_displayAlert &&
        !chunkof_AudioAlert.supportAudio &&
        !chunkof_AudioAlert.alreadyDisplayedAlert){
      chunkof_AudioAlert.alreadyDisplayedAlert = true;
      this._commandWindow.deactivate();
      this._commandWindow.hide();
      this._alertWindow = chunkof_AudioAlert.createWindow();
      this.addWindow(this._alertWindow );
    }
  };
  var Scene_Title_update = Scene_Title.prototype.update;
  Scene_Title.prototype.update = function() {
    Scene_Title_update.call(this);

    var pendingCommand = !this._commandWindow.visible || !this._commandWindow.active;
    var closedAlert    = this._alertWindow && this._alertWindow.isClosing();
    if (pendingCommand && closedAlert){
      this._commandWindow.show();
      this._commandWindow.activate();
    }
  };
})();