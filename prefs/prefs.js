'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {}

function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.gnomai-extension');
    let widget = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 12, border_width: 12 });

    let aiKeysLabel = new Gtk.Label({ label: 'AI API Keys (name:key, comma separated):', xalign: 0 });
    widget.add(aiKeysLabel);
    let aiKeysEntry = new Gtk.Entry({ text: settings.get_strv('ai-keys').join(',') });
    widget.add(aiKeysEntry);

    aiKeysEntry.connect('changed', () => {
        let keys = aiKeysEntry.get_text().split(',').map(s => s.trim()).filter(Boolean);
        settings.set_strv('ai-keys', keys);
    });

    widget.show_all();
    return widget;
}
