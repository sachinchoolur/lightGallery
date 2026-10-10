/**
 * The converter page's UI: two CodeMirror editors in a card, convert,
 * copy, clear, per-pane fullscreen and the "methods we skipped" notice.
 * `CodeMirror` and `ReplaceJquery` are globals from the classic scripts
 * the page loads before this one.
 */
(function () {
    const SAMPLE = [
        "$('.nav a').on('click', function () {",
        "    $('.nav a').removeClass('active');",
        "    $(this).addClass('active');",
        '});',
        '',
        "$('#count').text($('.item').length);",
        "$('#panel').attr('aria-hidden', 'false').show();",
        '',
    ].join('\n');

    const byId = (id) => document.getElementById(id);

    const editorOptions = {
        mode: 'javascript',
        indentUnit: 4,
        lineNumbers: true,
        lineWrapping: true,
    };

    const inputEditor = CodeMirror(byId('jq-input-editor'), {
        ...editorOptions,
        value: SAMPLE,
        autofocus: false,
        extraKeys: {
            'Ctrl-Enter': convert,
            'Cmd-Enter': convert,
        },
    });
    const outputEditor = CodeMirror(byId('jq-output-editor'), {
        ...editorOptions,
        value: '',
        readOnly: true,
        placeholder: 'The JavaScript appears here.',
    });

    // ---- Notice ------------------------------------------------------------
    const notice = byId('jq-notice');
    const noticeTitle = byId('jq-notice-title');
    const noticeBody = byId('jq-notice-body');

    function showNotice(title, body) {
        noticeTitle.textContent = title;
        noticeBody.textContent = body;
        notice.hidden = false;
    }
    function hideNotice() {
        notice.hidden = true;
    }
    byId('jq-notice-close').addEventListener('click', hideNotice);

    // ---- Convert -----------------------------------------------------------
    const convertButton = byId('jq-convert');

    function convert() {
        const source = inputEditor.getValue();
        if (!source.trim()) {
            inputEditor.focus();
            return;
        }
        convertButton.disabled = true;
        ReplaceJquery(source)
            .then((output) => {
                outputEditor.setValue(output.formattedOutput || '');
                const skipped = output.remainingMethods || [];
                if (skipped.length) {
                    showNotice(
                        'No JavaScript for these methods yet:',
                        skipped.join(', '),
                    );
                } else {
                    hideNotice();
                }
            })
            .catch((error) => {
                outputEditor.setValue('');
                showNotice(
                    'Could not convert this code.',
                    (error && error.message) || String(error),
                );
            })
            .finally(() => {
                convertButton.disabled = false;
            });
    }
    convertButton.addEventListener('click', convert);

    // ---- Clear / copy ------------------------------------------------------
    byId('jq-clear').addEventListener('click', () => {
        inputEditor.setValue('');
        outputEditor.setValue('');
        hideNotice();
        inputEditor.focus();
    });

    const copyButton = byId('jq-copy');
    const copyLabel = copyButton.querySelector('.jq-action-label');
    let copyTimer;
    function flashCopy(text) {
        copyLabel.textContent = text;
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
            copyLabel.textContent = 'Copy';
        }, 1500);
    }
    copyButton.addEventListener('click', () => {
        const code = outputEditor.getValue();
        if (!code) {
            flashCopy('Nothing to copy');
            return;
        }
        navigator.clipboard
            .writeText(code)
            .then(() => flashCopy('Copied'))
            .catch(() => flashCopy('Copy failed'));
    });

    // ---- Fullscreen --------------------------------------------------------
    // One pane at a time fills the viewport; Escape or the same button
    // brings it back into the card.
    const editors = {
        'jq-input-pane': inputEditor,
        'jq-output-pane': outputEditor,
    };
    let fullscreenPane = null;

    function setFullscreen(pane, on) {
        pane.classList.toggle('is-fullscreen', on);
        document.body.classList.toggle('jq-has-fullscreen', on);
        const button = pane.querySelector('[data-fullscreen]');
        button.setAttribute('aria-pressed', String(on));
        button.querySelector('.jq-action-label').textContent = on
            ? 'Exit fullscreen'
            : 'Fullscreen';
        fullscreenPane = on ? pane : null;
        editors[pane.id].refresh();
        if (on) editors[pane.id].focus();
    }

    document.querySelectorAll('[data-fullscreen]').forEach((button) => {
        button.addEventListener('click', () => {
            const pane = byId(button.dataset.fullscreen);
            if (fullscreenPane && fullscreenPane !== pane) {
                setFullscreen(fullscreenPane, false);
            }
            setFullscreen(pane, !pane.classList.contains('is-fullscreen'));
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && fullscreenPane) {
            setFullscreen(fullscreenPane, false);
        }
    });
})();
