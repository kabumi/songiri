//=============================================================================
/*:
 * @plugindesc
 * KMS_SomStyleDamageさんの改変版。クリティカルの文字を大きくする
 * @author kabumi
 *
 * @param MaxSpeed X
 * @default 0.7
 * @desc ダメージ数値を横に飛ばす最大速度です。(かぶみ値:2.0)
 *
 * @param InitialSpeed Y Max
 * @default -6
 * @desc ダメージの上下方向への初速の最大値です。(かぶみ値:-8)
 *
 * @param InitialSpeed Y Min
 * @default -6
 * @desc ダメージの上下方向への初速の最小値です。(かぶみ値:-12)
 *
 * @param Delay Y
 * @default -0.2
 * @desc ダメージの落下速度補正です。0.4 あたりになるとダメージが落ちてこなくなります。(かぶみ値:0.1)
 *
 * @param Step Scale Y
 * @default 0.02
 * @desc Y軸方向の文字の拡大スピード(かぶみ値:0.02)
 *
 * @param Critical Scale
 * @default 2.0
 * @desc クリティカル時のダメージの拡大率(かぶみ値:2.0)
 *
  * @param Popup Duration
 * @default 90
 * @desc ポップアップの表示時間 フレーム単位(かぶみ値:90)
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

//=============================================================================


//プラグインのラベルみたいなもの
var Imported = Imported || {};
Imported.KAB_DamagePopup = true;



(function() {



//かぶみプラグインのパラメータや関数保存用の変数
var KAB = KAB || {};
//上書き前の関数保存用
KAB.DP = KAB.DP || {};

//プラグインのパラメータを読み込み
KAB.Parameters = PluginManager.parameters("KAB_DamagePopup");
KAB.Param = KAB.Param || {};

KAB.Param.maxSpeedX = Number(KAB.Parameters['MaxSpeed X'] || 0.7);
KAB.Param.initialSpeedYMax = Number(KAB.Parameters['InitialSpeed Y Max'] || -6);
KAB.Param.initialSpeedYMin = Number(KAB.Parameters['InitialSpeed Y Min'] || -6);
KAB.Param.delayY = Number(KAB.Parameters['Delay Y'] || 0.2);
KAB.Param.StepScaleY = Number(KAB.Parameters['Step Scale Y'] || 0.02);
KAB.Param.CriticalScale = Number(KAB.Parameters['Critical Scale'] || 2.0);
KAB.Param.PopupDuration = Number(KAB.Parameters['Popup Duration'] || 90);

//-----------------------------------------------------------------------------
// Sprite_Damage

Sprite_Damage.prototype.initialize = function() {
	Sprite.prototype.initialize.call(this);
	this._duration = KAB.Param.PopupDuration;
	this._flashColor = [0, 0, 0, 0];
	this._flashDuration = 0;

	//改造したダメージ画像を読み込む
	this._damageBitmap = ImageManager.loadSystem('Damage_custom');
};

Sprite_Damage.prototype.setup = function(target){
	this._result = target.shiftDamagePopup();
	var result = this._result;

	if (result.missed || result.evaded) {
		this.createMiss();
	} else if (result.hpAffected) {
		//this.createDigits(0, result.hpDamage);
		//クリティカル時はダメージ画像の5列目を読み込む
		if(result.critical) {
		  	this.createDigits(5, result.hpDamage);
		}else{
			this.createDigits(0, result.hpDamage);
		}
	} else if (target.isAlive() && result.mpDamage !== 0) {
		this.createDigits(2, result.mpDamage);
	}
	
//デフォルトのクリティカル演出を飛ばす
//    if (result.critical) {
//      this.setupCriticalEffect();
//    }

	this.setupSomStyleDamageParameter();
};

Sprite_Damage.prototype.setupSomStyleDamageParameter = function(){
	var stepX = (Math.random() - 0.5) * 2 * KAB.Param.maxSpeedX;
	//上への動きもランダム性を持たせる
	var initialSpeedY = (KAB.Param.initialSpeedYMax - KAB.Param.initialSpeedYMin) * Math.random() + KAB.Param.initialSpeedYMin;

	for (var i = 0; i < this.children.length; i++){
		var sprite = this.children[i];
		//        sprite.dy = Params.initialSpeedY;
		sprite.dy = initialSpeedY;
		sprite._stepX = stepX;
		sprite._stepScaleY =KAB.Param.StepScaleY;
		sprite.scale.y = 0.1;
	}
};

KAB.DP.Sprite_Damage_updateChild = Sprite_Damage.prototype.updateChild;
Sprite_Damage.prototype.updateChild = function(sprite){
	sprite.dy -= KAB.Param.delayY;

	KAB.DP.Sprite_Damage_updateChild .call(this, sprite);

	sprite.x += sprite._stepX;

	if(this._result.critical)
		//クリティカルの場合、表示が大きい分、拡大のスピードも速い
		sprite.scale.y = Math.min(sprite.scale.y + sprite._stepScaleY * KAB.Param.CriticalScale, KAB.Param.CriticalScale);
	else
		sprite.scale.y = Math.min(sprite.scale.y + sprite._stepScaleY, 1.0);
};


Sprite_Damage.prototype.digitHeight = function() {
	return 32;
};


Sprite_Damage.prototype.digitWidth = function() {
    return 24;
};

Sprite_Damage.prototype.createDigits = function(baseRow, value) {
	var string = Math.abs(value).toString();
	var row = baseRow + (value < 0 ? 1 : 0);
	var w = this.digitWidth();
	var h = this.digitHeight();
	for (var i = 0; i < string.length; i++) {
		var sprite = this.createChildSprite();
		var n = Number(string[i]);
		sprite.setFrame(n * w, row * h, w, h);

		//クリティカルの場合、文字を拡大
		if(this._result.critical){
			sprite.x = (i - (string.length - 1) / 2) * w * KAB.Param.CriticalScale;
			sprite.scale.x = KAB.Param.CriticalScale;
		}
		else
			sprite.x = (i - (string.length - 1) / 2) * w;

		sprite.dy = -i;
	}
};



})();
