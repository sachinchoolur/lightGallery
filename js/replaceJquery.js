"use strict";

var inputValue = '';
var outputValue = '';
var inputEditor = CodeMirror(document.getElementById('replace-jq-centre-convert-btn-input-container'), {
  value: inputValue,
  mode: 'javascript',
  indentUnit: 2,
  lineNumbers: true
});
inputEditor.setSize('100%', '100%');
var outputEditor = CodeMirror(document.getElementById('output-container'), {
  value: outputValue,
  mode: 'javascript',
  indentUnit: 2,
  lineNumbers: true
});
var $wrap = document.getElementById('replace-jq-main');
outputEditor.setSize('100%', '100%'); // clear button

var clearButton = document.getElementById('replace-jq-centre-convert-btn-taskbar-clear-button');
var clearBtnTooltip = document.getElementById('clearTooltip');
clearButton.addEventListener('mouseover', function () {
  clearBtnTooltip.style.visibility = 'visible';
  clearBtnTooltip.style.opacity = '1';
});
clearButton.addEventListener('mouseout', function () {
  clearBtnTooltip.style.visibility = 'hidden';
  clearBtnTooltip.style.opacity = '0';
});
clearButton.addEventListener('click', function () {
  inputEditor.setValue('');
  outputEditor.setValue('');
}); // copy button

var copyButton = document.getElementById('replace-jq-centre-convert-btn-taskbar-copy');
var copyBtnTooltip = document.getElementById('myTooltip');
copyButton.addEventListener('mouseover', function () {
  copyBtnTooltip.style.visibility = 'visible';
  copyBtnTooltip.style.opacity = '1';
});
copyButton.addEventListener('mouseout', function () {
  copyBtnTooltip.style.visibility = 'hidden';
  copyBtnTooltip.style.opacity = '0';
});
copyButton.addEventListener('click', function () {
  var code = outputEditor.getValue();
  console.log('code:', code, navigator.clipboard);
  navigator.clipboard.writeText(code).then(function () {
    copyBtnTooltip.textContent = 'Copied!';
    setTimeout(function () {
      copyBtnTooltip.textContent = 'Copy';
    }, 1500);
  }).catch(function (error) {
    console.error('Failed to copy code:', error);
    copyBtnTooltip.textContent = 'Failed Copy!';
    setTimeout(function () {
      copyBtnTooltip.textContent = 'Copy';
    }, 1500);
  });
}); //input textarea maximize/minimize function

var fullscreenButton = document.getElementById('replace-jq-centre-convert-btn-taskbar-maximize-button');
var inputEditerSection = document.getElementById('replace-jq-centre-convert-btn-editor-wrap');
var exitFullscreenButton = document.getElementById('replace-jq-centre-convert-btn-taskbar-minimize');
var maximizeBtnTooltip = document.getElementById('fullscreenTooltip');
var exitBtnTooltip = document.getElementById('exitTooltip');
exitFullscreenButton.addEventListener('mouseover', function () {
  exitBtnTooltip.style.visibility = 'visible';
  exitBtnTooltip.style.opacity = '1';
});
exitFullscreenButton.addEventListener('mouseout', function () {
  exitBtnTooltip.style.visibility = 'hidden';
  exitBtnTooltip.style.opacity = '0';
});
fullscreenButton.addEventListener('mouseover', function () {
  maximizeBtnTooltip.style.visibility = 'visible';
  maximizeBtnTooltip.style.opacity = '1';
});
fullscreenButton.addEventListener('mouseout', function () {
  maximizeBtnTooltip.style.visibility = 'hidden';
  maximizeBtnTooltip.style.opacity = '0';
});
fullscreenButton.addEventListener('click', function () {
  // make textarea fullscreen
  inputEditerSection.classList.add('fullscreen');
  document.getElementById('replace-jq-centre-convert-btn-input-container').style.height = '100vh';
  document.body.style.overflow = 'hidden'; // hide maximize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-maximize-button').style.display = 'none'; // show minimize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-minimize').style.display = 'block';
});
exitFullscreenButton.addEventListener('click', function () {
  // make textarea fullscreen
  inputEditerSection.classList.remove('fullscreen');
  document.getElementById('replace-jq-centre-convert-btn-input-container').style.height = '650px';
  document.body.style.overflow = 'auto'; // hide maximize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-minimize').style.display = 'none'; // show minimize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-maximize-button').style.display = 'block';
}); //output textarea maximize/minimize function

var outputFullscreenBtn = document.getElementById('replace-jq-centre-convert-btn-taskbar-output-maximize');
var outputEditerSection = document.getElementById('output-text-function');
var outputMinimizeBtn = document.getElementById('replace-jq-centre-convert-btn-taskbar-output-minimize');
var maxBtnTooltip = document.getElementById('maxTooltip');
var minBtnTooltip = document.getElementById('minTooltip');
outputMinimizeBtn.addEventListener('mouseover', function () {
  minBtnTooltip.style.visibility = 'visible';
  minBtnTooltip.style.opacity = '1';
});
outputMinimizeBtn.addEventListener('mouseout', function () {
  minBtnTooltip.style.visibility = 'hidden';
  minBtnTooltip.style.opacity = '0';
});
outputFullscreenBtn.addEventListener('mouseover', function () {
  maxBtnTooltip.style.visibility = 'visible';
  maxBtnTooltip.style.opacity = '1';
});
outputFullscreenBtn.addEventListener('mouseout', function () {
  maxBtnTooltip.style.visibility = 'hidden';
  maxBtnTooltip.style.opacity = '0';
});
outputFullscreenBtn.addEventListener('click', function () {
  // make textarea fullscreen
  outputEditerSection.classList.add('fullscreen');
  document.getElementById('output-container').style.height = '100vh';
  document.body.style.overflow = 'hidden'; // hide maximize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-output-maximize').style.display = 'none'; // show minimize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-output-minimize').style.display = 'block';
});
outputMinimizeBtn.addEventListener('click', function () {
  // make textarea fullscreen
  outputEditerSection.classList.remove('fullscreen');
  document.getElementById('output-container').style.height = '650px';
  document.body.style.overflow = 'auto'; // hide maximize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-output-minimize').style.display = 'none'; // show minimize button

  document.getElementById('replace-jq-centre-convert-btn-taskbar-output-maximize').style.display = 'block';
}); // convert button

var mainConvertBtn = document.getElementById('replace-jq-main-convert-btn');
var subConvertBtn = document.getElementById('replace-jq-centre-convert-btn-sub-convert-btn');

var convertTOJS = function convertTOJS() {
  var inputValue = inputEditor.getValue();

  if (!inputValue) {
    return;
  }

  ReplaceJquery(inputValue).then(function (output) {
    console.log('output:', output);
    outputEditor.setValue(output.formattedOutput);

    if (output.remainingMethods && output.remainingMethods.length) {
      $wrap.classList.add('show-alert');
      document.getElementById('alert-box-remaining-methods').textContent = output.remainingMethods.join(', ');
    } else {
      $wrap.classList.remove('show-alert');
    }
  }).catch(function (error) {
    console.error('An error occurred:', error);
  });
};

mainConvertBtn.addEventListener('click', convertTOJS);
subConvertBtn.addEventListener('click', convertTOJS);
document.getElementById('alert-close-svg').addEventListener('click', function () {
  $wrap.classList.remove('show-alert');
});
