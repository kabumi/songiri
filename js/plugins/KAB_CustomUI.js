//=============================================================================
 /*:
 * @plugindesc 640×480用のUI変更他
 * @author かぶみ
 *
 * @help
 *
 */
//=============================================================================

//プラグインのラベルみたいなもの
var Imported = Imported || {};
Imported.KAB_CustomUI = true;



(function(){



//かぶみプラグインのパラメータや関数保存用の変数
var KAB = KAB || {};
//上書き前の関数保存用
KAB.CU = KAB.CU || {};


	
//-----------------------------------------------------------------------------------------
//	選択ウィンドウの行幅を大きくしてやる
//	スマホ用に
//	rpg_windows.js
//-----------------------------------------------------------------------------------------
//ベースになるWindow_CommandのlineHeightを変更
Window_Command.prototype.lineHeight = function() {
	return 72;
};

//個別
//タイトル画面
Window_TitleCommand.prototype.lineHeight = function() {
	return 72; //54; //72;
};

//メニュー画面
Window_MenuCommand.prototype.lineHeight = function() {
	return 72; //54; //60;
};

Window_Status.prototype.lineHeight = function() {
	return 36;
};

Window_MenuActor.prototype.lineHeight = function() {
	return 36;
};

Window_SavefileList.prototype.lineHeight = function() {
	return 36;
}; 

//オプション画面
Window_Options.prototype.lineHeight = function() {
    return 72; //54; //72;
};

//終了画面
Window_GameEnd.prototype.lineHeight = function() {
    return 72; //54; //72;
};   

//選択肢
Window_EventItem.prototype.lineHeight = function() {
    return 72; //66;
};

Window_ChoiceList.prototype.lineHeight = function() {
    return 72; //60;
};

Window_ChoiceList.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
//    this.drawTextEx(this.commandName(index), rect.x, rect.y + 9);
    this.drawTextEx(this.commandName(index), rect.x, rect.y + 15);
};


//-----------------------------------------------------------------------------------------
//	数字選択をスマホ用に大きく
//-----------------------------------------------------------------------------------------
Window_NumberInput.prototype.lineHeight = function() {
	return 94;
};

Window_NumberInput.prototype.createButtons = function() {
	var bitmap = ImageManager.loadSystem('ButtonSet72');
	var buttonWidth = 72;
	var buttonHeight = 72;
	this._buttons = [];
		for (var i = 0; i < 3; i++) {
		var button = new Sprite_Button();
		var x = buttonWidth * [1, 2, 4][i];
		var w = buttonWidth * (i === 2 ? 2 : 1);
		button.bitmap = bitmap;
		button.setColdFrame(x, 0, w, buttonHeight);
		button.setHotFrame(x, buttonHeight, w, buttonHeight);
		button.visible = false;
		this._buttons.push(button);
		this.addChild(button);
	}
	this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
	this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
	this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
};

Window_NumberInput.prototype.placeButtons = function() {
	var numButtons = this._buttons.length;
	var spacing = 16;
	var totalWidth = -spacing;
	for (var i = 0; i < numButtons; i++) {
		totalWidth += this._buttons[i].width + spacing;
	}
	var x = (this.width - totalWidth) / 2;
	for (var j = 0; j < numButtons; j++) {
		var button = this._buttons[j];
		button.x = x;
		button.y = this.buttonY() + 240;
		x += button.width + spacing;
	}
};

//-----------------------------------------------------------------------------------------
//	メニュー画面のステータス簡易表示を640×480向けに整形
//	rpg_windows.js
//-----------------------------------------------------------------------------------------
Window_MenuStatus.prototype.lineHeight = function() {
	return 36;
};

Window_MenuStatus.prototype.numVisibleRows = function() {
	return 3;
};

Window_MenuStatus.prototype.itemHeight = function() {
	var clientHeight = this.height - this.padding * 2;
	return Math.floor(clientHeight / this.numVisibleRows());
};

Window_MenuStatus.prototype.drawItemBackground = function(index) {
	if (index === this._pendingIndex) {
		var rect = this.itemRect(index);
		var color = this.pendingColor();
		this.changePaintOpacity(false);
		this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
		this.changePaintOpacity(true);
	}
};

Window_MenuStatus.prototype.drawItemImage = function(index) {
	var actor = $gameParty.members()[index];
	var rect = this.itemRect(index);
	this.changePaintOpacity(actor.isBattleMember());
	this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
	this.changePaintOpacity(true);
};

Window_MenuStatus.prototype.drawItemStatus = function(index) {
	var actor = $gameParty.members()[index];
	var rect = this.itemRect(index);
	var x = rect.x + 144 + 12 //162;
	var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5; //1.5; //真ん中に寄せてやる
	var width = rect.width - x - this.textPadding();
	this.drawActorSimpleStatus(actor, x, y, width);
};

Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
	var lineHeight = this.lineHeight();
	var x2 = x + 140;
	var width2 = Math.min(200, width - this.textPadding());
	this.drawActorName(actor, x, y, 132);
	this.drawActorLevel(actor, x2, y);
	//必要のないステートとクラスは非表示に
	//   this.drawActorIcons(actor, x, y + lineHeight * 1);
	//    this.drawActorClass(actor, x2, y);
	this.drawActorHp(actor, x, y + lineHeight * 1, width2);
	this.drawActorMp(actor, x, y + lineHeight * 2, width2);
};

//-----------------------------------------------------------------------------------------
//	ステータス詳細表示を640×480用に整形
//	rpg_windows.js
//-----------------------------------------------------------------------------------------
Window_Status.prototype.lineHeight = function() {
	return 36; //36;
};

Window_Status.prototype.refresh = function() {
	this.contents.clear();
	if (this._actor) {
		var y_correct = 10;
		var lineHeight = this.lineHeight();
		//クラスや二つ名表示は非表示	
		//this.drawBlock1(lineHeight * 0);
		//this.drawHorzLine(lineHeight * 1);
		this.drawBlock2(lineHeight * 0 + y_correct);
		this.drawHorzLine(lineHeight * 4 + y_correct);
		this.drawBlock3(lineHeight * 5 + y_correct);
		//メモも非表示
		//this.drawHorzLine(lineHeight * 11);
		//this.drawBlock4(lineHeight * 11);
	}
};

//顔、レベルとHPMP表示、経験値表示
Window_Status.prototype.drawBlock2 = function(y) {
	this.drawActorFace(this._actor, 0, y);
	this.drawBasicInfo(160, y);
	this.drawExpInfo(400, y);
//元コード
//    this.drawActorFace(this._actor, 12, y);
//    this.drawBasicInfo(204, y);
//    this.drawExpInfo(456, y);
};

//レベルとHPMP表示
Window_Status.prototype.drawBasicInfo = function(x, y) {
	var lineHeight = this.lineHeight();

	this.drawActorName(this._actor, x, y, 130);
	this.drawActorLevel(this._actor, x + 140, y, 80);
	//ステートは非表示
	//    this.drawActorIcons(this._actor, x, y + lineHeight * 1);
	this.drawActorHp(this._actor, x, y + lineHeight * 2, 210);
	this.drawActorMp(this._actor, x, y + lineHeight * 3, 210);
};

//経験値表示
Window_Status.prototype.drawExpInfo = function(x, y) {
	var lineHeight = this.lineHeight();
	var expTotal = TextManager.expTotal.format(TextManager.exp);
	var expNext = TextManager.expNext.format(TextManager.level);
	var value1 = this._actor.currentExp();
	var value2 = this._actor.nextRequiredExp();
	if (this._actor.isMaxLevel()) {
		value1 = '-------';
		value2 = '-------';
	}
	this.changeTextColor(this.systemColor());
	this.drawText(expTotal, x, y + lineHeight * 0, 200);
	this.drawText(expNext, x, y + lineHeight * 2, 200);
	this.resetTextColor();
	this.drawText(value1, x, y + lineHeight * 1, 200, 'right');
	this.drawText(value2, x, y + lineHeight * 3, 200, 'right');
};

//能力値と装備表示
Window_Status.prototype.drawBlock3 = function(y) {
	this.drawParameters(30, y);
	this.drawEquipments(310, y);
//元コード
//    this.drawParameters(48, y);
//    this.drawEquipments(432, y);
};

//-----------------------------------------------------------------------------------------
//	メッセージウィンドウの整形
//	rpg_windows.js
//	YEP_MessageCore.js
//-----------------------------------------------------------------------------------------
//顔グラフィックのサイズ
Window_Base._faceWidth  = 144; //108; //144;
Window_Base._faceHeight = 144; //108; //144;

//ウィンドウとの間のpadding
Window_Base.prototype.standardPadding = function() {
	return 18;
};

//一行幅
Window_Base.prototype.lineHeight = function() {
	return 36;
};

//テキストとテキストの間隔
Window_Base.prototype.textPadding = function() {
	return 6;
};

//フォントサイズ
Window_Base.prototype.standardFontSize = function() {
	return 28;
};

//メッセージウインドウの行替え幅
//デフォルトではlineHeightがいくらであろうとテキストの幅で行替えされるので
//lineHeightとテキストの幅、大きな方で行替えするように修正
Window_Message.prototype.newPage = function(textState) {
	//YEP_MessageCore.jsとの競合対策
	if(Imported.YEP_MessageCore){
		this.adjustWindowSettings();
	}
	
	this.contents.clear();
	this.resetFontSettings();
	this.clearFlags();
	this.loadMessageFace();
	textState.x = this.newLineX();
	textState.y = 0;
	textState.left = this.newLineX();
	//元コード
	//textState.height = this.calcTextHeight(textState, false);
	//-----------
	textState.height = Math.max(this.calcTextHeight(textState, false),this.lineHeight());
};

//-----------------------------------------------------------------------------------------
//	戦闘関連
//	rpg_windows.js
//-----------------------------------------------------------------------------------------
//パーティコマンド
Window_PartyCommand.prototype.lineHeight = function() {
//    return 36;
//    return 54;
//	return 48;
	return 72;
};   

Window_PartyCommand.prototype.windowWidth = function() {
//    return 120;
//    return 160;
	return 180;
};

Window_PartyCommand.prototype.windowHeight = function() {
//    return 144;
	return 180;
}; 

Window_PartyCommand.prototype.numVisibleRows = function() {
	return 2;
};

//アクターのコマンド
Window_ActorCommand.prototype.lineHeight = function() {
//    return 36;
//    return 54;
//	return 48;
	return 72;
};

Window_ActorCommand.prototype.maxCols = function() {
	return 1;
};

Window_ActorCommand.prototype.windowHeight = function() {
//    return 144;
	return 180;
};

Window_ActorCommand.prototype.windowWidth = function() {
//    return 120;
//    return 160;
	return 180;
};

Window_ActorCommand.prototype.numVisibleRows = function() {
	return 2;
};

//アクターのステータスウィンドウ
Window_BattleStatus.prototype.windowWidth = function() {
//    return 360;
//    return 360;
	return 460;
};

Window_BattleStatus.prototype.windowHeight = function() {
	return 180;
};

Window_BattleStatus.prototype.lineHeight = function() {
		return 48;
};

Window_BattleStatus.prototype.numVisibleRows = function() {
	return 3;
};

Window_BattleStatus.prototype.textPadding = function() {
	return 6;
};

//HPMPのゲージ表示領域
Window_BattleStatus.prototype.gaugeAreaWidth = function() {
	return 280;
//    return 230;
//    return 202;
    //return 330;
};

//名前とステート表示領域
Window_BattleStatus.prototype.basicAreaRect = function(index) {
	var rect = this.itemRectForText(index);
	rect.width -= this.gaugeAreaWidth() + 12 //6; //+15
	return rect;
};

/*
Window_BattleStatus.prototype.gaugeAreaRect = function(index) {
    var rect = this.itemRectForText(index);
    rect.x += rect.width - this.gaugeAreaWidth();
    rect.width = this.gaugeAreaWidth();
    return rect;
};
*/

Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
	this.drawActorName(actor, rect.x + 0, rect.y, 85);
	this.drawActorIcons(actor, rect.x + 88, rect.y + 7, 32);
};

Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
	this.drawActorHp(actor, rect.x + 0, rect.y - 4, 180);
	this.drawActorMp(actor, rect.x + 192,  rect.y - 4, 88);
};

Window_BattleStatus.prototype.drawActorHp = function(actor, x, y, width) {
	width = width || 186;
	var color1 = this.hpGaugeColor1();
	var color2 = this.hpGaugeColor2();
	this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
	this.changeTextColor(this.systemColor());

	this.drawText(TextManager.hpA, x, y, 30); //44
	//	this.drawText(TextManager.hpA, x, y, 22); //44

	this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
	                       this.hpColor(actor), this.normalColor());
};

Window_BattleStatus.prototype.drawActorMp = function(actor, x, y, width) {
	width = width || 186;
	var color1 = this.mpGaugeColor1();
	var color2 = this.mpGaugeColor2();
	this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
	this.changeTextColor(this.systemColor());

	this.drawText(TextManager.mpA, x, y, 30); //44
	//    this.drawText(TextManager.mpA, x, y, 22); //44

	this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
	                       this.mpColor(actor), this.normalColor());
};

//スキルリスト
//列数
Window_BattleSkill.prototype.maxCols = function() {
    return 2;
//いまいちだった…
//    return 3;
};

//列間隔
Window_BattleSkill.prototype.spacing = function() {
//    return 24;
    return 36;
};

//行幅
Window_BattleSkill.prototype.lineHeight = function() {
//    return 36;
//    return 54;
//	return 48;
	return 72;
};

//YEP_CoreEngine.jsを修正
//アイコンのpaddingが大きくなりすぎる問題の修正
/*
//元はこれ
Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = this.lineHeight();
        var padding = (iconBoxWidth - Window_Base._iconWidth) / 2;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + padding, y + padding);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};
*/
if(Imported.YEP_CoreEngine){
	Window_Base.prototype.drawItemName = function(item, x, y, width) {
		width = width || 312;
		if (item) {
			var iconBoxHeight = this.lineHeight();
			var y_padding = (iconBoxHeight - Window_Base._iconHeight) / 2;
			var x_padding = 2;
			var iconBoxWidth = Window_Base._iconWidth + x_padding * 2;

			this.resetTextColor();
			this.drawIcon(item.iconIndex, x + x_padding, y + y_padding);
			this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth );
		}
	};
}

//バトルログの位置修正
Window_BattleLog.prototype.standardPadding = function() {
//    return 18;
//画面の一番上に
	return 0;
};

Window_BattleLog.prototype.drawSimpleActionLine = function(index) {
	var text = this._lines[index].replace('<SIMPLE>', '');
	var rect = this.itemRectForText(index);
	this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
	if (this._actionIcon) {
		var tw = this.textWidth(text);
		// アイコンをちょうどいい位置に
		//      var ix = (rect.width - tw) / 2 - 4;
		var ix = (rect.width - tw) / 2 - 4 + this.textPadding() - Window_Base._iconWidth + rect.x;
		this.drawIcon(this._actionIcon, ix, rect.y + 2);
	}
	this.drawText(text, rect.x, rect.y, Graphics.boxWidth, 'center');
};

//敵位置修正
//結局、使わず
Game_Enemy.prototype.setup = function(enemyId, x, y) {
	this._enemyId = enemyId;
	this._screenX = x;
	this._screenY = y; //+ 40;
	this.recoverAll();
};

//キャラの頭の上に表示されるステートアイコンの位置が
//遠すぎるので修正
Sprite_StateIcon.prototype.initMembers = function() {
	this._battler = null;
	this._iconIndex = 0;
	this._animationCount = 0;
	this._animationIndex = 0;
	this.anchor.x = 0.5;
	//    this.anchor.y = 0.5;
	this.anchor.y = 0.1;
};


//逃げるコマンドを飛ばす
//バグるのでやめ
/*
Scene_Battle.prototype.changeInputWindow = function() {
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
//            this.startPartyCommandSelection();
            // 戦う・逃げるの決定飛ばす
            BattleManager._actorIndex = 0;
            this.startActorCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};
*/


//コマンドウインドウとステータスウインドウの位置を入れ替え
//やっぱりやめ
Scene_Battle.prototype.updateWindowPositions = function() {
    var statusX = 0;
    if (BattleManager.isInputting()) {
        statusX = this._partyCommandWindow.width;
    } else {
        statusX = this._partyCommandWindow.width / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }

/*
//使いにくかったのでやめ
    var statusX = 0;
    var comandX = 0;
    if (BattleManager.isInputting()) {
        statusX = 0;
        this._partyCommandWindow.x = this._statusWindow.width;
        this._actorCommandWindow.x = this._statusWindow.width;
    } else {
        statusX = this._partyCommandWindow.width / 2;
    }
    if (this._statusWindow.x < statusX) {
        this._statusWindow.x += 16;
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x = statusX;
        }
    }
    if (this._statusWindow.x > statusX) {
        this._statusWindow.x -= 16;
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x = statusX;
        }
    }
*/
};



//-----------------------------------------------------------------------------------------
// 終わり
//-----------------------------------------------------------------------------------------
})();
