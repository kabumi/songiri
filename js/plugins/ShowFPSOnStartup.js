//=============================================================================
// ShowFPSOnStartup.js
//=============================================================================

/*:
 * @plugindesc Turns ON the specified ShowFPS when TitleScene.
 * @author tokineco
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc タイトル画面時にFPS表示をONにさせます
 * @author tokineco
 *
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {

    var _Window_TitleCommand_initialize = Window_TitleCommand.prototype.initialize;
	Window_TitleCommand.prototype.initialize = function() {
	    _Window_TitleCommand_initialize.call(this);
	    Graphics.showFps();
	};


})();
