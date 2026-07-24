let inputValue = '';

let outputValue = '';

var inputEditor = CodeMirror(
    document.getElementById('replace-jq-centre-convert-btn-input-container'),
    {
        value: inputValue,
        mode: 'javascript',
        indentUnit: 2,
        lineNumbers: true,
    },
);

inputEditor.setSize('100%', '100%');

var outputEditor = CodeMirror(document.getElementById('output-container'), {
    value: outputValue,
    mode: 'javascript',
    indentUnit: 2,
    lineNumbers: true,
});

const $wrap = document
            .getElementById('replace-jq-main');

outputEditor.setSize('100%', '100%');

// clear button
const clearButton = document.getElementById(
    'replace-jq-centre-convert-btn-taskbar-clear-button',
);
const clearBtnTooltip = document.getElementById('clearTooltip');

clearButton.addEventListener('mouseover', () => {
    clearBtnTooltip.style.visibility = 'visible';
    clearBtnTooltip.style.opacity = '1';
});
clearButton.addEventListener('mouseout', () => {
    clearBtnTooltip.style.visibility = 'hidden';
    clearBtnTooltip.style.opacity = '0';
});
clearButton.addEventListener('click', function () {
    inputEditor.setValue('');
    outputEditor.setValue('');
});

// copy button
const copyButton = document.getElementById(
    'replace-jq-centre-convert-btn-taskbar-copy',
);
const copyBtnTooltip = document.getElementById('myTooltip');
copyButton.addEventListener('mouseover', () => {
    copyBtnTooltip.style.visibility = 'visible';
    copyBtnTooltip.style.opacity = '1';
});
copyButton.addEventListener('mouseout', () => {
    copyBtnTooltip.style.visibility = 'hidden';
    copyBtnTooltip.style.opacity = '0';
});
copyButton.addEventListener('click', () => {
    const code = outputEditor.getValue();
    console.log('code:', code, navigator.clipboard);
    navigator.clipboard
        .writeText(code)
        .then(() => {
            copyBtnTooltip.textContent = 'Copied!';
            setTimeout(() => {
                copyBtnTooltip.textContent = 'Copy';
            }, 1500);
        })
        .catch((error) => {
            console.error('Failed to copy code:', error);
            copyBtnTooltip.textContent = 'Failed Copy!';
            setTimeout(() => {
                copyBtnTooltip.textContent = 'Copy';
            }, 1500);
        });
});

//input textarea maximize/minimize function
const fullscreenButton = document.getElementById(
    'replace-jq-centre-convert-btn-taskbar-maximize-button',
);
const inputEditerSection = document.getElementById(
    'replace-jq-centre-convert-btn-editor-wrap',
);
const exitFullscreenButton = document.getElementById(
    'replace-jq-centre-convert-btn-taskbar-minimize',
);
const maximizeBtnTooltip = document.getElementById('fullscreenTooltip');
const exitBtnTooltip = document.getElementById('exitTooltip');

exitFullscreenButton.addEventListener('mouseover', () => {
    exitBtnTooltip.style.visibility = 'visible';
    exitBtnTooltip.style.opacity = '1';
});
exitFullscreenButton.addEventListener('mouseout', () => {
    exitBtnTooltip.style.visibility = 'hidden';
    exitBtnTooltip.style.opacity = '0';
});
fullscreenButton.addEventListener('mouseover', () => {
    maximizeBtnTooltip.style.visibility = 'visible';
    maximizeBtnTooltip.style.opacity = '1';
});
fullscreenButton.addEventListener('mouseout', () => {
    maximizeBtnTooltip.style.visibility = 'hidden';
    maximizeBtnTooltip.style.opacity = '0';
});
fullscreenButton.addEventListener('click', function () {
    // make textarea fullscreen
    inputEditerSection.classList.add('fullscreen');
    document.getElementById(
        'replace-jq-centre-convert-btn-input-container',
    ).style.height = '100vh';
    document.body.style.overflow = 'hidden';
    // hide maximize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-maximize-button',
    ).style.display = 'none';
    // show minimize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-minimize',
    ).style.display = 'block';
});
exitFullscreenButton.addEventListener('click', function () {
    // make textarea fullscreen
    inputEditerSection.classList.remove('fullscreen');
    document.getElementById(
        'replace-jq-centre-convert-btn-input-container',
    ).style.height = '650px';
    document.body.style.overflow = 'auto';
    // hide maximize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-minimize',
    ).style.display = 'none';
    // show minimize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-maximize-button',
    ).style.display = 'block';
});

//output textarea maximize/minimize function
const outputFullscreenBtn = document.getElementById(
    'replace-jq-centre-convert-btn-taskbar-output-maximize',
);
const outputEditerSection = document.getElementById('output-text-function');
const outputMinimizeBtn = document.getElementById(
    'replace-jq-centre-convert-btn-taskbar-output-minimize',
);
const maxBtnTooltip = document.getElementById('maxTooltip');
const minBtnTooltip = document.getElementById('minTooltip');

outputMinimizeBtn.addEventListener('mouseover', () => {
    minBtnTooltip.style.visibility = 'visible';
    minBtnTooltip.style.opacity = '1';
});
outputMinimizeBtn.addEventListener('mouseout', () => {
    minBtnTooltip.style.visibility = 'hidden';
    minBtnTooltip.style.opacity = '0';
});

outputFullscreenBtn.addEventListener('mouseover', () => {
    maxBtnTooltip.style.visibility = 'visible';
    maxBtnTooltip.style.opacity = '1';
});
outputFullscreenBtn.addEventListener('mouseout', () => {
    maxBtnTooltip.style.visibility = 'hidden';
    maxBtnTooltip.style.opacity = '0';
});
outputFullscreenBtn.addEventListener('click', function () {
    // make textarea fullscreen
    outputEditerSection.classList.add('fullscreen');
    document.getElementById('output-container').style.height = '100vh';
    document.body.style.overflow = 'hidden';
    // hide maximize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-output-maximize',
    ).style.display = 'none';
    // show minimize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-output-minimize',
    ).style.display = 'block';
});
outputMinimizeBtn.addEventListener('click', function () {
    // make textarea fullscreen
    outputEditerSection.classList.remove('fullscreen');
    document.getElementById('output-container').style.height = '650px';
    document.body.style.overflow = 'auto';
    // hide maximize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-output-minimize',
    ).style.display = 'none';
    // show minimize button
    document.getElementById(
        'replace-jq-centre-convert-btn-taskbar-output-maximize',
    ).style.display = 'block';
});

// convert button
const mainConvertBtn = document.getElementById('replace-jq-main-convert-btn');
const subConvertBtn = document.getElementById(
    'replace-jq-centre-convert-btn-sub-convert-btn',
);

const convertTOJS = function () {
    const inputValue = inputEditor.getValue();
    if (!inputValue) {
        return;
    }
    ReplaceJquery(inputValue)
        .then((output) => {
            console.log('output:', output);
            outputEditor.setValue(output.formattedOutput);
            if (output.remainingMethods && output.remainingMethods.length) {
                $wrap
                    .classList.add('show-alert');
                    document.getElementById('alert-box-remaining-methods').textContent = output.remainingMethods.join(', ');
            } else {
                $wrap
                    .classList.remove('show-alert');
            }
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
};

mainConvertBtn.addEventListener('click', convertTOJS);

subConvertBtn.addEventListener('click', convertTOJS);

document.getElementById('alert-close-svg').addEventListener('click', function () {
    $wrap.classList.remove('show-alert');
});
