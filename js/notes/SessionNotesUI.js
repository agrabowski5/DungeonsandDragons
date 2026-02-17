import { el, $, clearChildren, showModal } from '../utils/dom.js';
import { Storage } from '../utils/storage.js';

const PREFIX = 'dnd_notes_';
const DATA_KEY = PREFIX + 'data';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export class SessionNotesUI {
    constructor(container) {
        this.container = container;
        this.data = Storage.load(DATA_KEY, { campaigns: [] });
        this.activeCampaignId = null;
        this.activeSessionId = null;
        this._saveTimer = null;
        this.render();
    }

    render() {
        clearChildren(this.container);
        const layout = el('div', { className: 'notes-layout' });
        layout.appendChild(this._buildSidebar());
        layout.appendChild(this._buildEditor());
        this.container.appendChild(layout);
    }

    _buildSidebar() {
        const sidebar = el('div', { className: 'notes-sidebar' });
        sidebar.appendChild(el('div', { className: 'notes-sidebar__header' }, [
            el('h3', { className: 'card__header', textContent: 'Campaigns' }),
            el('button', { className: 'btn btn--sm btn--primary', textContent: '+ Campaign', onClick: () => this._addCampaign() }),
        ]));

        const list = el('div', { className: 'notes-campaign-list' });
        for (const campaign of this.data.campaigns) {
            const isActive = campaign.id === this.activeCampaignId;
            const campEl = el('div', { className: `notes-campaign ${isActive ? 'notes-campaign--active' : ''}` });

            const header = el('div', { className: 'notes-campaign__header', onClick: () => {
                this.activeCampaignId = isActive ? null : campaign.id;
                this.activeSessionId = null;
                this.render();
            }}, [
                el('span', { className: 'notes-campaign__name', textContent: campaign.name }),
                el('span', { className: 'notes-campaign__toggle', textContent: isActive ? '\u25BC' : '\u25B6' }),
            ]);
            campEl.appendChild(header);

            if (isActive) {
                const actions = el('div', { className: 'notes-campaign__actions' }, [
                    el('button', { className: 'btn btn--sm', textContent: '+ Session', onClick: (e) => { e.stopPropagation(); this._addSession(campaign.id); } }),
                    el('button', { className: 'btn btn--sm btn--danger', textContent: 'Del', onClick: (e) => { e.stopPropagation(); this._deleteCampaign(campaign.id); } }),
                ]);
                campEl.appendChild(actions);

                for (const session of (campaign.sessions || [])) {
                    const isSessionActive = session.id === this.activeSessionId;
                    const sessEl = el('div', {
                        className: `notes-session ${isSessionActive ? 'notes-session--active' : ''}`,
                        onClick: () => { this.activeSessionId = session.id; this.render(); },
                    }, [
                        el('span', { className: 'notes-session__title', textContent: session.title }),
                        el('span', { className: 'notes-session__date', textContent: session.date || '' }),
                    ]);
                    campEl.appendChild(sessEl);
                }
            }
            list.appendChild(campEl);
        }

        if (this.data.campaigns.length === 0) {
            list.appendChild(el('p', { className: 'notes-empty', textContent: 'No campaigns yet. Create one to get started!' }));
        }

        sidebar.appendChild(list);
        return sidebar;
    }

    _buildEditor() {
        const editor = el('div', { className: 'notes-editor' });
        const session = this._getActiveSession();

        if (!session) {
            editor.appendChild(el('div', { className: 'notes-editor__empty' }, [
                el('h3', { textContent: 'Session Notes', className: 'notes-editor__placeholder-title' }),
                el('p', { textContent: 'Select a session from the sidebar to start writing, or create a new campaign.' }),
            ]));
            return editor;
        }

        // Title bar
        const titleBar = el('div', { className: 'notes-editor__titlebar' });
        const titleInput = el('input', {
            className: 'input notes-editor__title-input',
            type: 'text',
            value: session.title,
            placeholder: 'Session Title...',
            onInput: (e) => { session.title = e.target.value; this._debounceSave(); },
        });
        const dateInput = el('input', {
            className: 'input input--sm notes-editor__date-input',
            type: 'date',
            value: session.date || '',
            onInput: (e) => { session.date = e.target.value; this._debounceSave(); },
        });
        const deleteBtn = el('button', {
            className: 'btn btn--sm btn--danger',
            textContent: 'Delete Session',
            onClick: () => this._deleteSession(this.activeCampaignId, session.id),
        });
        titleBar.appendChild(titleInput);
        titleBar.appendChild(dateInput);
        titleBar.appendChild(deleteBtn);
        editor.appendChild(titleBar);

        // Formatting toolbar
        const formatBar = el('div', { className: 'notes-format-bar' });
        const formats = [
            { cmd: 'bold', label: 'B', style: 'font-weight:bold' },
            { cmd: 'italic', label: 'I', style: 'font-style:italic' },
            { cmd: 'underline', label: 'U', style: 'text-decoration:underline' },
            { cmd: 'insertUnorderedList', label: '\u2022 List' },
            { cmd: 'insertOrderedList', label: '1. List' },
            { cmd: 'formatBlock_h3', label: 'H3' },
            { cmd: 'insertHorizontalRule', label: '---' },
        ];
        for (const fmt of formats) {
            formatBar.appendChild(el('button', {
                className: 'btn btn--sm notes-format-btn',
                innerHTML: fmt.style ? `<span style="${fmt.style}">${fmt.label}</span>` : fmt.label,
                onClick: () => {
                    if (fmt.cmd === 'formatBlock_h3') {
                        document.execCommand('formatBlock', false, 'h3');
                    } else {
                        document.execCommand(fmt.cmd, false, null);
                    }
                    this._debounceSave();
                },
            }));
        }
        editor.appendChild(formatBar);

        // Content editable area
        const content = el('div', {
            className: 'notes-editor__content',
            contentEditable: 'true',
            innerHTML: session.content || '<p>Start writing your session notes here...</p>',
        });
        content.addEventListener('input', () => {
            session.content = content.innerHTML;
            this._debounceSave();
        });
        content.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b') { e.preventDefault(); document.execCommand('bold'); }
            if (e.ctrlKey && e.key === 'i') { e.preventDefault(); document.execCommand('italic'); }
            if (e.ctrlKey && e.key === 'u') { e.preventDefault(); document.execCommand('underline'); }
        });
        editor.appendChild(content);

        // Word count
        const text = (session.content || '').replace(/<[^>]*>/g, ' ').trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        editor.appendChild(el('div', { className: 'notes-editor__footer', textContent: `${wordCount} words` }));

        return editor;
    }

    _getActiveSession() {
        if (!this.activeCampaignId || !this.activeSessionId) return null;
        const campaign = this.data.campaigns.find(c => c.id === this.activeCampaignId);
        if (!campaign) return null;
        return campaign.sessions.find(s => s.id === this.activeSessionId) || null;
    }

    _addCampaign() {
        const input = el('input', { className: 'input', type: 'text', placeholder: 'Campaign name...' });
        const wrapper = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Campaign Name' }), input,
        ]);
        showModal('New Campaign', wrapper, () => {
            const name = input.value.trim();
            if (!name) return;
            const campaign = { id: uid(), name, createdAt: Date.now(), sessions: [] };
            this.data.campaigns.push(campaign);
            this.activeCampaignId = campaign.id;
            this._save();
            this.render();
        });
        setTimeout(() => input.focus(), 100);
    }

    _addSession(campaignId) {
        const campaign = this.data.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        const num = campaign.sessions.length + 1;
        const session = {
            id: uid(),
            title: `Session ${num}`,
            date: new Date().toISOString().split('T')[0],
            content: '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        campaign.sessions.push(session);
        this.activeSessionId = session.id;
        this._save();
        this.render();
    }

    _deleteCampaign(campaignId) {
        const msg = el('p', { textContent: 'Delete this campaign and all its sessions?' });
        showModal('Delete Campaign', msg, () => {
            this.data.campaigns = this.data.campaigns.filter(c => c.id !== campaignId);
            if (this.activeCampaignId === campaignId) {
                this.activeCampaignId = null;
                this.activeSessionId = null;
            }
            this._save();
            this.render();
        });
    }

    _deleteSession(campaignId, sessionId) {
        const campaign = this.data.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        campaign.sessions = campaign.sessions.filter(s => s.id !== sessionId);
        if (this.activeSessionId === sessionId) this.activeSessionId = null;
        this._save();
        this.render();
    }

    _debounceSave() {
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => this._save(), 1000);
    }

    _save() {
        Storage.save(DATA_KEY, this.data);
    }
}
