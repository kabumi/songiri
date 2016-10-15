//=============================================================================
 /*:
 * @plugindesc かぶみの機能追加、修正等
 * @author かぶみ
 *
 * @param Magic Reflection Effect
 * @desc 魔法反射時に魔法のエフェクトを表示する？ ON - true OFF - false
 * @default false
 *
 * @param Full Recover After Battle
 * @desc 戦闘後にHPMPを全回復？ ON - true OFF - false
 * @default true
 *
 * @help
 *
 */
//=============================================================================

//プラグインのラベルみたいなもの
var Imported = Imported || {};
Imported.KAB_CustomFunc = true;



(function(){



//かぶみプラグインのパラメータや関数保存用の変数
var KAB = KAB || {};
//上書き前の関数保存用
KAB.CF = KAB.CF || {};

//プラグインのパラメータを読み込み
KAB.Parameters = PluginManager.parameters("KAB_CustomFunc");
KAB.Param = KAB.Param || {};

KAB.Param.CFMREffect = Boolean(KAB.Parameters["Magic Reflection Effect"] === "true" || false);
KAB.Param.CFFullRecover = Boolean(KAB.Parameters["Full Recover After Battle"] === "true" || false);



//-----------------------------------------------------------------------------------------
//	魔法反射時に一回一回魔法のエフェクトを表示するか？
//	rpg_windows.js
//→YEP_BattleEngineCore.js
//-----------------------------------------------------------------------------------------
if(Imported.YEP_BattleEngineCore){
	Window_BattleLog.prototype.displayReflection = function(target) {
		if (eval(Yanfly.Param.BECShowRflText)) {
			this.addText(TextManager.magicReflection.format(target.name()));
		}
		target.performReflection();

		//非表示なら以下を飛ばす---------------
		if ( !KAB.Param.CFMREffect ) return;
		//----------------------

		var animationId = BattleManager._action.item().animationId;
		this.showNormalAnimation([BattleManager._subject], animationId);
		this.waitForAnimation();
	};
};

//-----------------------------------------------------------------------------------------
//	戦闘背景の変更
//	スマホでなぜか機能しないのでコード修正
//	新しいSpriteを作って、addChiledしてやるという無理やりな方法…
//	(誰かもっとスマートな方法を教えて)
//	元となる背景が設定されていない場合もバグる
//	HIME_ChangeBattleback.jsを修正
//-----------------------------------------------------------------------------------------
if( Imported.ChangeBattleback){
	Spriteset_Battle.prototype.refreshBattleback = function() {

		var margin = 32;
		var x = -this._battleField.x - margin;
		var y = -this._battleField.y - margin;
		var width = Graphics.width + margin * 2;
		var height = Graphics.height + margin * 2;

		var old_back1 = this._back1Sprite;
		var old_back2 = this._back2Sprite;

		this._back1Sprite = new TilingSprite();
		this._back2Sprite = new TilingSprite();
		this._back1Sprite.bitmap = this.battleback1Bitmap();
		this._back2Sprite.bitmap = this.battleback2Bitmap();
		this._back1Sprite.move(x, y, width, height);
		this._back2Sprite.move(x, y, width, height);
		this._battleField.addChildAt(this._back1Sprite,0);
		this._battleField.addChildAt(this._back2Sprite,1);
		this._back1Sprite._bitmap.addLoadListener(function(){this.locateBattleback();this._battleField.removeChild(old_back1);}.bind(this));
		this._back2Sprite._bitmap.addLoadListener(function(){this.locateBattleback();this._battleField.removeChild(old_back2);}.bind(this));

/*
		//元のコード
		this._back1Sprite.bitmap = this.battleback1Bitmap();
		this._back2Sprite.bitmap = this.battleback2Bitmap();
*/
	};
};

//-----------------------------------------------------------------------------------------
//	戦闘後にパーティのHPMPを全回復
//	rpg_managers.js
//-----------------------------------------------------------------------------------------
KAB.CF.BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
	if(KAB.Param.CFFullRecover){
		for(i = 0; i < $gameParty.size(); i++){
		    $gameParty.battleMembers()[i]._hp = $gameParty.battleMembers()[i].mhp;
		    $gameParty.battleMembers()[i]._mp = $gameParty.battleMembers()[i].mmp;
		}
	}
	KAB.CF.BattleManager_endBattle.call(this);
};




//-----------------------------------------------------------------------------------------
//	パラライズの行動キャンセルのバグ対策
//→YEP_BuffsStatesCore.js
//-----------------------------------------------------------------------------------------
//ステートに以下のメモを追加でパラライズ
/*
<Cancel Instant Skill: 1 to 2000>
<Cancel Instant Item: 1 to 2000>

<Custom Action Start Effect>
// パラライズの確率
var paralyzeRate = 0.33;
if ( !BattleManager._processingForcedAction && Math.random() < paralyzeRate) {
  //パラライズ発動時のアニメ
  user.startAnimation(190);

 //行動のキャンセル
  user.clearActions();

 //メッセージの表示
  var logWindow = SceneManager._scene._logWindow;
  if (state.message3) {
    var msg = '<CENTER>' + user.name() + state.message3;
    logWindow.addText(msg);
  }
  BattleManager.actionWaitForAnimation();
  logWindow.push('clear');
}
</Custom Action Start Effect>
*/
if(Imported.YEP_BuffsStatesCore){
	BattleManager.startAction = function() {
		if (this._subject) this._subject.onActionStartStateEffects();
		//パラライズでアクションが削除されていたら飛ばす-----------
		if (!this._subject || !this._subject.currentAction()) return;
		//----------------------
		Yanfly.BSC.BattleManager_startAction.call(this);
	};
};


//-----------------------------------------------------------------------------------------
//	ダメージのポップアップが2重にupdateされているバグっぽいの修正
//→rpg_sprites.js
//-----------------------------------------------------------------------------------------
Sprite_Battler.prototype.updateDamagePopup = function() {
	this.setupDamagePopup();
	if (this._damages.length > 0) {
//		for (var i = 0; i < this._damages.length; i++) {
//			this._damages[i].update();
//		}
		if (!this._damages[0].isPlaying()) {
			this.parent.removeChild(this._damages[0]);
			this._damages.shift();
		}
	}
};

//-----------------------------------------------------------------------------------------
// 終わり
//-----------------------------------------------------------------------------------------
})();
