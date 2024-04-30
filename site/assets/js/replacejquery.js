
let inputValue = "";

let outputValue = "";

var inputEditor = CodeMirror(document.getElementById("input-container"), {
    value: inputValue,
    mode: "javascript",
    indentUnit: 4,
    lineNumbers: true,
});

inputEditor.setSize("100%", "100%")

var outputEditor = CodeMirror(document.getElementById("output-container"), {
    value: outputValue,
    mode: "javascript",
    indentUnit: 4,
    lineNumbers: true,
});

outputEditor.setSize("100%", "100%")

// clear button
const clearButton = document.getElementById("clear-button");
const clearBtnTooltip = document.getElementById('clearTooltip');

clearButton.addEventListener('mouseover', () => {
    clearBtnTooltip.style.visibility = 'visible';
});
clearButton.addEventListener('mouseout', () => {
    clearBtnTooltip.style.visibility = 'hidden';
});
clearButton.addEventListener("click", function () {
    inputEditor.setValue("");
    outputEditor.setValue("");
});

// copy button
const copyButton = document.getElementById("copySvg");
const copyBtnTooltip = document.getElementById('myTooltip');
copyButton.addEventListener('mouseover', () => {
    copyBtnTooltip.style.visibility = 'visible';
});
copyButton.addEventListener('mouseout', () => {
    copyBtnTooltip.style.visibility = 'hidden';
});
copyButton.addEventListener("click", () => {
    const code = outputEditor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        copyBtnTooltip.textContent = 'Copied!';
        setTimeout(() => {
            copyBtnTooltip.textContent = 'Copy';
        }, 1500);
    }).catch((error) => {
        console.error("Failed to copy code:", error);
        copyBtnTooltip.textContent = 'Failed Copy!';
        setTimeout(() => {
            copyBtnTooltip.textContent = 'Copy';
        }, 1500);
    });
});

//input textarea maximize/minimize function 
const fullscreenButton = document.getElementById("input-maximize-button");
const inputEditerSection = document.getElementById("input-text-function");
const exitFullscreenButton = document.getElementById("input-minimize-button");
const maximizeBtnTooltip = document.getElementById('fullscreenTooltip');
const exitBtnTooltip = document.getElementById('exitTooltip');

exitFullscreenButton.addEventListener('mouseover', () => {
    exitBtnTooltip.style.visibility = 'visible';
});
exitFullscreenButton.addEventListener('mouseout', () => {
    exitBtnTooltip.style.visibility = 'hidden';
});
fullscreenButton.addEventListener('mouseover', () => {
    maximizeBtnTooltip.style.visibility = 'visible';
});
fullscreenButton.addEventListener('mouseout', () => {
    maximizeBtnTooltip.style.visibility = 'hidden';
});
fullscreenButton.addEventListener("click", function () {
    // make textarea fullscreen
    inputEditerSection.classList.add("fullscreen");
    document.getElementById('input-container').style.height = '100vh';
    document.body.style.overflow = 'hidden';
    // hide maximize button
    document.getElementById("input-maximize-button").style.display = 'none';
    // show minimize button
    document.getElementById("input-minimize-button").style.display = 'block';
});
exitFullscreenButton.addEventListener("click", function () {
    // make textarea fullscreen
    inputEditerSection.classList.remove("fullscreen");
    document.getElementById('input-container').style.height = '450px';
    document.body.style.overflow = 'auto';
    // hide maximize button
    document.getElementById("input-minimize-button").style.display = 'none';
    // show minimize button
    document.getElementById("input-maximize-button").style.display = 'block';
});

//output textarea maximize/minimize function 
const outputFullscreenBtn = document.getElementById("output-maximize-button");
const outputEditerSection = document.getElementById("output-text-function");
const outputMinimizeBtn = document.getElementById("output-minimize-button");
const maxBtnTooltip = document.getElementById('maxTooltip');
const minBtnTooltip = document.getElementById('minTooltip');

outputMinimizeBtn.addEventListener('mouseover', () => {
    minBtnTooltip.style.visibility = 'visible';
});
outputMinimizeBtn.addEventListener('mouseout', () => {
    minBtnTooltip.style.visibility = 'hidden';
});

outputFullscreenBtn.addEventListener('mouseover', () => {
    maxBtnTooltip.style.visibility = 'visible';
});
outputFullscreenBtn.addEventListener('mouseout', () => {
    maxBtnTooltip.style.visibility = 'hidden';
});
outputFullscreenBtn.addEventListener("click", function () {
    // make textarea fullscreen
    outputEditerSection.classList.add("fullscreen");
    document.getElementById('output-container').style.height = '100vh';
    document.body.style.overflow = 'hidden';
    // hide maximize button
    document.getElementById("output-maximize-button").style.display = 'none';
    // show minimize button
    document.getElementById("output-minimize-button").style.display = 'block';
});
outputMinimizeBtn.addEventListener("click", function () {
    // make textarea fullscreen
    outputEditerSection.classList.remove("fullscreen");
    document.getElementById('output-container').style.height = '450px';
    document.body.style.overflow = 'auto';
    // hide maximize button
    document.getElementById("output-minimize-button").style.display = 'none';
    // show minimize button
    document.getElementById("output-maximize-button").style.display = 'block';
});

// convert button
const mainConvertBtn = document.getElementById("main-convert-btn");
const subConvertBtn = document.getElementById("sub-convert-btn");

mainConvertBtn.addEventListener("click", function () {
    console.log('convert clicked main');

    ReplaceJquery(inputValue)
        .then((output) => {
            outputEditor.setValue(output);
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
});

subConvertBtn.addEventListener("click", function () {
    console.log('convert clicked sub');

    ReplaceJquery(inputValue)
        .then((output) => {
            outputEditor.setValue(output);
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
});

//dialogue box close function
document.getElementById('alert-close-svg').addEventListener('click', function () {
    document.getElementById('dialogue-box-main').style.display = 'none';
});