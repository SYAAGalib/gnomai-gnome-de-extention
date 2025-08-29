'use strict';

const { St, Gio, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

let aiExtension;

class AIExtension extends PanelMenu.Button {
    constructor() {
        super(0.0, 'AI Extension');
        this._aiKeys = this._loadKeys();
        this._activeAI = this._aiKeys.length > 0 ? this._aiKeys[0].name : null;
        this._history = this._loadHistory();
        this._buildUI();
    }

    _buildUI() {
        this.icon = new St.Icon({ gicon: Gio.icon_new_for_string(Me.path + '/gnomai-symbolic.svg'), style_class: 'system-status-icon' });
        this.add_child(this.icon);
        this.menu.removeAll();
        this._aiKeys.forEach(ai => {
            let item = new PopupMenu.PopupMenuItem(`Switch to ${ai.name}`);
            item.connect('activate', () => {
                this._activeAI = ai.name;
                this._saveActiveAI();
            });
            this.menu.addMenuItem(item);
        });
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        let historyItem = new PopupMenu.PopupMenuItem('Show History');
        historyItem.connect('activate', () => this._showHistory());
        this.menu.addMenuItem(historyItem);
    }

    _showHistory() {
        let dialog = new imports.ui.modalDialog.ModalDialog({ styleClass: 'prompt-dialog' });
        let label = new St.Label({ text: this._history.join('\n'), style_class: 'history-label' });
        dialog.contentLayout.add(label);
        dialog.open();
    }

    _loadKeys() {
        // Load from GSettings: expects entries like 'ChatGPT:sk-xxx', 'Claude:claude-xxx', etc.
        if (!this._settings) {
            const ExtensionUtils = imports.misc.extensionUtils;
            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.gnomai-extension');
        }
        let keys = this._settings.get_strv('ai-keys');
        // Parse entries into { name, key }
        return keys.map(entry => {
            let [name, ...keyParts] = entry.split(':');
            return { name: name.trim(), key: keyParts.join(':').trim() };
        }).filter(ai => ai.name && ai.key);
    }

    _loadHistory() {
        // TODO: Load from file
        return [];
    }

    _saveActiveAI() {
        // TODO: Save active AI to settings or file
    }

    destroy() {
        super.destroy();
    }
}

function init() {}

function enable() {
    const ExtensionUtils = imports.misc.extensionUtils;
    global.Me = ExtensionUtils.getCurrentExtension();
    aiExtension = new AIExtension();
    Main.panel.addToStatusArea('gnomai', aiExtension);
}

function disable() {
    if (aiExtension) {
        aiExtension.destroy();
        aiExtension = null;
    }
}
