---
title: jQuery to javascript converter
description:
    'Convert your jQuery scripts to efficient JavaScript directly in your browser. Receive reliable, chainable, modern JavaScript code instantly that can be used as a minimal utility library, while keeping your existing code untouched'
lead:
    'Convert your jQuery scripts to efficient JavaScript directly in your browser. Receive reliable, chainable, modern JavaScript code instantly that can be used as a minimal utility library, while keeping your existing code untouched.'

date: 2024-05-01T08:48:57.000Z
---

<section class="rjq-main" id="replace-jq-main">
    <div class="container-fluid">
        <div class="replace-jq-centre-convert-btn-header">
            <h5 class="replace-jq-centre-convert-btn-head">jQuery to javascript converter</h5>
            <p class="replace-jq-centre-convert-btn-subhead">Convert your jQuery scripts to efficient JavaScript directly in your browser. Receive reliable, chainable, modern JavaScript code instantly that can be used as a minimal utility library, while keeping your existing code untouched.</p>
        </div>
    </div>
    <div class="container-fluid container-fluid-max">
        <div class="alert-dialogue-box" id="rjq-dialogue-box">
            <div class="alert-close-svg" id="alert-close-svg">
               <svg fill=none height=24 viewBox="0 0 24 24"width=24 xmlns=http://www.w3.org/2000/svg><path d="M18 6L6 18M6 6L18 18" stroke=currentcolor stroke-linecap=round stroke-linejoin=round stroke-width=2 /></svg>
            </div>
            <div class="alert-box-main-head">
                <h6 class="alert-box-head">Generated javascript for all methods except</h6>
                <p class="alert-box-sub" id="alert-box-remaining-methods"></p>
            </div>
        </div>
        <div class="rjq-main-row-sections editors-wrap">
            <div class="replace-jq-centre-convert-btn-expanded-textfield">
                <div class="replace-jq-centre-convert-btn-editor-wrap" id="replace-jq-centre-convert-btn-editor-wrap">
                    <div class="replace-jq-centre-convert-btn-taskbar">
                        <div class="replace-jq-centre-convert-btn-taskbar-head">
                            <h6 class="replace-jq-centre-convert-btn-taskbar-title">Enter jQuery code</h6>
                        </div>
                        <div class="replace-jq-centre-convert-btn-taskbar-btn-group">
                            <div class="replace-jq-centre-convert-btn-taskbar-btn clear-svg" id="replace-jq-centre-convert-btn-taskbar-clear-button">
                                <span class="replace-jq-tooltiptext" id="clearTooltip">clear</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"
                                    fill="none"> <path
                                        d="M20 7.5V6.5C20 5.09987 20 4.3998 19.7275 3.86502C19.4878 3.39462 19.1054 3.01217 18.635 2.77248C18.1002 2.5 17.4001 2.5 16 2.5H14C12.5999 2.5 11.8998 2.5 11.365 2.77248C10.8946 3.01217 10.5122 3.39462 10.2725 3.86502C10 4.3998 10 5.09987 10 6.5V7.5M12.5 14.375V20.625M17.5 14.375V20.625M3.75 7.5H26.25M23.75 7.5V21.5C23.75 23.6002 23.75 24.6503 23.3413 25.4525C22.9817 26.1581 22.4081 26.7317 21.7025 27.0913C20.9003 27.5 19.8502 27.5 17.75 27.5H12.25C10.1498 27.5 9.0997 27.5 8.29754 27.0913C7.59193 26.7317 7.01825 26.1581 6.65873 25.4525C6.25 24.6503 6.25 23.6002 6.25 21.5V7.5"
                                        stroke="#E0EAFD" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" /></svg>
                            </div>
                            <div class="replace-jq-centre-convert-btn-taskbar-btn maximize-svg" id="replace-jq-centre-convert-btn-taskbar-maximize-button">
                                <span class="replace-jq-tooltiptext" id="fullscreenTooltip">fullscreen</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"
                                    fill="none"><path
                                        d="M8 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M8 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V16M21 8V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H16M21 16V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H16"
                                        stroke="white" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" /></svg>
                            </div>
                            <div class="replace-jq-centre-convert-btn-taskbar-btn minimize-icon" id="replace-jq-centre-convert-btn-taskbar-minimize">
                                <span class="replace-jq-tooltiptext" id="exitTooltip">exit</span>
                                <svg fill=none height=32 viewBox="0 0 32 32"width=32 xmlns=http://www.w3.org/2000/svg><g filter=url(#filter0_dd_23_1647)><path d="M5.74988 10H5.99988C8.10007 10 9.15017 10 9.95234 9.59127C10.658 9.23175 11.2316 8.65807 11.5912 7.95246C11.9999 7.1503 11.9999 6.1002 11.9999 4V3.75M5.74988 20H5.99988C8.10007 20 9.15017 20 9.95234 20.4087C10.658 20.7683 11.2316 21.3419 11.5912 22.0475C11.9999 22.8497 11.9999 23.8998 11.9999 26V26.25M21.9999 3.75V4C21.9999 6.1002 21.9999 7.1503 22.4086 7.95246C22.7681 8.65807 23.3418 9.23175 24.0474 9.59127C24.8496 10 25.8997 10 27.9999 10H28.2499M21.9999 26.25V26C21.9999 23.8998 21.9999 22.8497 22.4086 22.0475C22.7681 21.3419 23.3418 20.7683 24.0474 20.4087C24.8496 20 25.8997 20 27.9999 20H28.2499"stroke=#E0EAFD stroke-linecap=round stroke-linejoin=round stroke-width=2 /></g><defs><filter color-interpolation-filters=sRGB filterUnits=userSpaceOnUse height=38 id=filter0_dd_23_1647 width=38 x=-2 y=0><feFlood flood-opacity=0 result=BackgroundImageFix /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dy=4 /><feGaussianBlur stdDeviation=2 /><feComposite in2=hardAlpha operator=out /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2=BackgroundImageFix mode=normal result=effect1_dropShadow_23_1647 /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dy=4 /><feGaussianBlur stdDeviation=2 /><feComposite in2=hardAlpha operator=out /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2=effect1_dropShadow_23_1647 mode=normal result=effect2_dropShadow_23_1647 /><feBlend in2=effect2_dropShadow_23_1647 mode=normal result=shape in=SourceGraphic /></filter></defs></svg>
                            </div></div>
                    </div>
                    <div class="replace-jq-centre-convert-btn-text-area-converter" id="replace-jq-centre-convert-btn-input-container">
                    </div>
                </div>
            </div>
            <div class="replace-jq-centre-convert-btn-circle-convert-btn" id="replace-jq-centre-convert-btn-sub-convert-btn">
                <div class="centre-convert-btn">
                    <svg fill=none height=22 viewBox="0 0 22 22"width=22 xmlns=http://www.w3.org/2000/svg><path d="M2.33789 6C4.06694 3.01099 7.29866 1 11.0001 1C16.5229 1 21.0001 5.47715 21.0001 11C21.0001 16.5228 16.5229 21 11.0001 21C7.29866 21 4.06694 18.989 2.33789 16M11 15L15 11M15 11L11 7M15 11H1"stroke=""stroke-linecap=round stroke-linejoin=round stroke-width=2 /></svg>
                </div>
            </div>
            <div class="replace-jq-main-btn">
                <button type="button" id="replace-jq-main-convert-btn" class="btn btn-outline-primary replace-jq-btn-convert"> Convert to JavaScript
                    <div class="btn-btn-svg">
                        <svg fill=none height=22 viewBox="0 0 22 22"width=22 xmlns=http://www.w3.org/2000/svg><path d="M2.33789 6C4.06694 3.01099 7.29866 1 11.0001 1C16.5229 1 21.0001 5.47715 21.0001 11C21.0001 16.5228 16.5229 21 11.0001 21C7.29866 21 4.06694 18.989 2.33789 16M11 15L15 11M15 11L11 7M15 11H1"stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=2 /></svg>
                    </div>
                </button>
            </div>
            <div class="replace-jq-centre-convert-btn-expanded-textfield">
                <div class="replace-jq-centre-convert-btn-editor-wrap" id="output-text-function">
                    <div class="replace-jq-centre-convert-btn-taskbar">
                        <div class="replace-jq-centre-convert-btn-taskbar-head">
                            <h6 class="replace-jq-centre-convert-btn-taskbar-title">JavaScript Output</h6>
                        </div>
                        <div class="replace-jq-centre-convert-btn-taskbar-btn-group">
                            <div class="replace-jq-centre-convert-btn-taskbar-btn" id="replace-jq-centre-convert-btn-taskbar-copy">
                                <span class="replace-jq-tooltiptext" id="myTooltip">Copy</span>
                                <svg fill=none height=30 viewBox="0 0 30 30"width=30 xmlns=http://www.w3.org/2000/svg><path d="M9.375 3.75H18.25C21.0503 3.75 22.4504 3.75 23.52 4.29497C24.4608 4.77433 25.2257 5.53924 25.705 6.48005C26.25 7.54961 26.25 8.94974 26.25 11.75V20.625M7.75 26.25H17.875C19.2751 26.25 19.9752 26.25 20.51 25.9775C20.9804 25.7378 21.3628 25.3554 21.6025 24.885C21.875 24.3502 21.875 23.6501 21.875 22.25V12.125C21.875 10.7249 21.875 10.0248 21.6025 9.49002C21.3628 9.01962 20.9804 8.63717 20.51 8.39748C19.9752 8.125 19.2751 8.125 17.875 8.125H7.75C6.34987 8.125 5.6498 8.125 5.11502 8.39748C4.64462 8.63717 4.26217 9.01962 4.02248 9.49002C3.75 10.0248 3.75 10.7249 3.75 12.125V22.25C3.75 23.6501 3.75 24.3502 4.02248 24.885C4.26217 25.3554 4.64462 25.7378 5.11502 25.9775C5.6498 26.25 6.34987 26.25 7.75 26.25Z"stroke=#E0EAFD stroke-linecap=round stroke-linejoin=round stroke-width=2 /></svg>
                            </div>
                            <div class="replace-jq-centre-convert-btn-taskbar-btn maximize-svg" id="replace-jq-centre-convert-btn-taskbar-output-maximize">
                                <span class="replace-jq-tooltiptext" id="maxTooltip">fullscreen</span>
                                <svg fill=none height=30 viewBox="0 0 24 24"width=30 xmlns=http://www.w3.org/2000/svg><path d="M8 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M8 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V16M21 8V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H16M21 16V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H16"stroke=white stroke-linecap=round stroke-linejoin=round stroke-width=2 /></svg>
                            </div>
                            <div class="replace-jq-centre-convert-btn-taskbar-btn minimize-icon" id="replace-jq-centre-convert-btn-taskbar-output-minimize">
                                <span class="replace-jq-tooltiptext" id="minTooltip">exit</span>
                                <svg fill=none height=32 viewBox="0 0 32 32"width=32 xmlns=http://www.w3.org/2000/svg><g filter=url(#filter0_dd_23_1647)><path d="M5.74988 10H5.99988C8.10007 10 9.15017 10 9.95234 9.59127C10.658 9.23175 11.2316 8.65807 11.5912 7.95246C11.9999 7.1503 11.9999 6.1002 11.9999 4V3.75M5.74988 20H5.99988C8.10007 20 9.15017 20 9.95234 20.4087C10.658 20.7683 11.2316 21.3419 11.5912 22.0475C11.9999 22.8497 11.9999 23.8998 11.9999 26V26.25M21.9999 3.75V4C21.9999 6.1002 21.9999 7.1503 22.4086 7.95246C22.7681 8.65807 23.3418 9.23175 24.0474 9.59127C24.8496 10 25.8997 10 27.9999 10H28.2499M21.9999 26.25V26C21.9999 23.8998 21.9999 22.8497 22.4086 22.0475C22.7681 21.3419 23.3418 20.7683 24.0474 20.4087C24.8496 20 25.8997 20 27.9999 20H28.2499"stroke=#E0EAFD stroke-linecap=round stroke-linejoin=round stroke-width=2 /></g><defs><filter color-interpolation-filters=sRGB filterUnits=userSpaceOnUse height=38 id=filter0_dd_23_1647 width=38 x=-2 y=0><feFlood flood-opacity=0 result=BackgroundImageFix /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dy=4 /><feGaussianBlur stdDeviation=2 /><feComposite in2=hardAlpha operator=out /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2=BackgroundImageFix mode=normal result=effect1_dropShadow_23_1647 /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"in=SourceAlpha result=hardAlpha /><feOffset dy=4 /><feGaussianBlur stdDeviation=2 /><feComposite in2=hardAlpha operator=out /><feColorMatrix type=matrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2=effect1_dropShadow_23_1647 mode=normal result=effect2_dropShadow_23_1647 /><feBlend in2=effect2_dropShadow_23_1647 mode=normal result=shape in=SourceGraphic /></filter></defs></svg>
                            </div>
                        </div>
                    </div>
                    <div class="replace-jq-centre-convert-btn-text-area-converter" id="output-container">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="section-header rjq-section-header-about text-center">
            <div class="container-xxl">
                <div class="row justify-content-center">
                    <div class="col-lg-9">
                        <h3 class="section-header-sub">Why?</h3>
                        <p>
                        While jQuery has been a staple in web development, it often becomes more than necessary, with many projects using just a minor fraction of its functionality. Modern browsers now natively support many features that jQuery was once needed for. However, the thought of removing jQuery can be daunting due to the extensive changes required in the codebase.</p>
                        <p>jQuery to JavaScript converter makes it easy to transition from jQuery to vanilla JavaScript, allowing you to make the switch smoothly without extensive modifications to your existing code.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="section section-faq section-faq-lite-blue">
        <div class="section-header text-center">
            <h3 class="section-header-sub">Frequently asked questions</h3>
        </div>
        <div class="container-xxl">
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    <div class="faq-item">
                        <h4>
                            What does the jQuery to JavaScript Converter do?
                        </h4>
                        <p>
                            This tool converts jQuery code into modern, efficient JavaScript. It allows you to replace jQuery with plain JavaScript while keeping your original code unchanged.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h4>
                             Is it necessary to modify my existing jQuery code after conversion?
                        </h4>
                        <p>
                            No, you do not need to modify your existing code. The tool is designed to provide you with JavaScript that can directly replace jQuery, ensuring your existing code runs as expected without the jQuery library.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h4>
                            What browsers do the generated JavaScript methods support?
                        </h4>
                        <p>
                            The generated JavaScript is compatible with all modern browsers, including Internet Explorer 11 and newer versions. This ensures broad usability across different user environments.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h4>
                            Do you support all jQuery methods?
                        </h4>
                        <p>
                            We support the majority of jQuery methods. However, for certain functions like Ajax, we recommend using lightweight libraries instead. A list of all supported methods can be found on our website.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h4>
                            Do you have a VS Code extension?
                        </h4>
                        <p>
                            Currently, we do not offer a VS Code extension. However, our library is open source, and contributions are welcome if you are interested in developing an extension or other features.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h4>
                            How does the conversion process work?
                        </h4>
                        <p>
                            The process starts by converting your source code into an Abstract Syntax Tree (AST). We then traverse this AST, identify jQuery methods, and replace them with equivalent vanilla JavaScript methods from our tested library, ultimately generating the output.
                        </p>
                    </div>
                    <div class="faq-item">
                        <h4>Can I use this tool for large projects?</h4>
                        <p>
                            For converting multiple files efficiently, we recommend using our CLI tool. It supports batch processing of multiple files and generates the JavaScript output for each, streamlining the conversion process for larger projects.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div class="section section-rjq-docs">
            <div class="container-xxl">
                <div class="row justify-content-center">
                    <div class="col-lg-9">

## CLI Installation and Usage

Along with the web version, we offer a CLI (Command Line Interface) tool. This allows you to convert jQuery to JavaScript directly from your terminal, making it even easier to integrate the conversion process into your workflow and handle large-scale projects efficiently.



To get started, install the replace-jquery using npm:

```sh
npm install -g replace-jquery
```

-   To convert jQuery methods in a specific file (sample.js) and output the vanilla JavaScript in another file (out.js), use:

```sh
replace-jquery src/sample.js out.js
```

-  To apply conversions across multiple files matching a pattern (e.g., all JavaScript files in a directory), run:

```sh
replace-jquery "src/*.js" out.js
```

-   To generate vanilla JavaScript alternatives for all available jQuery methods, execute:

```sh
replace-jquery --build-all out.js
```

-   For building vanilla JavaScript alternatives only for specific jQuery methods, the following command can be used:

```sh
replace-jquery --methods "addClass, removeClass, attr" -o utils.js
```

Please note that, the utility functions generated by `replace-jquery` are not completely equivalent to jQuery methods in all scenarios. Please consider this as a starting point and validate before you adopt it.
                    </div>
                </div>
            </div>
        </div>
    <div class="section section-rjq-docs">
        <div class="container-xxl">
            <div class="row justify-content-center">
                <div class="col-lg-9">




## Basic Concepts and usage

The jQuery to JavaScript converter is designed to replicate the functionality of jQuery through generated vanilla JavaScript. Once you convert your code, the resulting output acts as your own utility library, mirroring jQuery's behavior. The generated JavaScript methods are chainable and applicable across all matching elements, just like jQuery. After conversion, simply replace the jQuery dependency in your project with the newly created output. Please note that maintaining the generated code, should modifications be necessary, will be your responsibility.

Note: The below code is just to demonstrate the basics concepts and not covered all scenarios.

Suppose, you have the below jQuey code in your codebase

```js
$(".vue").siblings().addClass("highlight");
```

```html
<ul>
  <li class="jquery">jQuery</li>
  <li class="react">React</li>
  <li class="vue">Vue.js</li>
  <li class="angular">Angular</li>
  <li class="lit">Lit</li>
</ul>
```

```css
.highlight {
  background-color: red;
  color: #fff;
}
```

The generated output is shown below. It supports chainable methods similar to jQuery. You can rename the $utils alias to $ to more closely resemble jQuery syntax and replace the jQuery library with the code provided

```js
export class Utils {
  constructor(selector) {
    this.elements = Utils.getSelector(selector);
    this.element = this.get(0);
    return this;
  }

  static getSelector(selector, context = document) {
    if (typeof selector !== 'string') {
      return selector;
    }
    if (isId(selector)) {
      return document.getElementById(selector.substring(1))
    }
    return context.querySelectorAll(selector);
  }

  each(func) {
    if (!this.elements) {
      return this;
    }
    if (this.elements.length !== undefined) {
      [].forEach.call(this.elements, func);
    } else {
      func(this.element, 0);
    }
    return this;
  }

  siblings() {
    if (!this.element) {
      return this;
    }
    const elements = [].filter.call(
      this.element.parentNode.children,
      (child) => child !== this.element
    );
    return new Utils(elements);
  }

  get(index) {
    if (index !== undefined) {
      return this.elements[index];
    }
    return this.elements;
  }

  addClass(classNames = '') {
    this.each((el) => {
      // IE doesn't support multiple arguments
      classNames.split(' ').forEach((className) => {
        el.classList.add(className);
      });
    });
    return this;
  }
}

export default function $utils(selector) {
  return new Utils(selector);
}
```

#### usage

```js
$utils(".vue").siblings().addClass("highlight");
```

Demo - <https://codepen.io/sachinchoolur/pen/oNWNdxE>


</div></div></div></div>
    <div class="section section-rjq-docs">
        <div class="container-xxl">
            <div class="row justify-content-center">
                <div class="col-lg-9">

## List of available jQuery alternative methods
Below is a list of alternative methods in pure JavaScript that replace common jQuery functions. We have intentionally excluded functions like Ajax, recommending the use of more efficient libraries like axios or the native fetch API for such functionalities.


##### addClass

Adds the specified class(es) to each element in the set of matched elements.

```js
addClass(classNames = '') {
  this.each((el) => {
    classNames.split(' ').forEach((className) => {
      el.classList.add(className);
    });
  });
  return this;
}
```

```js
// Usage
$utils('ul li').addClass('myClass yourClass');
```

##### append

Insert content, specified by the parameter, to the end of each element in the set of matched elements.

```js
append(html) {
  this.each((el) => {
    if (typeof html === 'string') {
      el.insertAdjacentHTML('beforeend', html);
    } else {
      el.appendChild(html);
    }
  });
  return this;
}
```

##### attr

Get the value of an attribute for the first element in the set of matched elements or set one or more attributes for every matched element.


```js
attr(name, value) {
  if (value === undefined) {
    if (!this.element) {
      return '';
    }
    return this.element.getAttribute(name);
  }
  this.each((el) => {
    el.setAttribute(name, value);
  });
  return this;
}
```

##### children

```js
children() {
  return new Utils(this.element.children);
}
```

##### closest

```js
closest(selector) {
  if (!this.element) {
    return this;
  }
  const matchesSelector =
    this.element.matches ||
    this.element.webkitMatchesSelector ||
    this.element.mozMatchesSelector ||
    this.element.msMatchesSelector;

  while (this.element) {
    if (matchesSelector.call(this.element, selector)) {
      return new Utils(this.element);
    }
    this.element = this.element.parentElement;
  }
  return this;
}
```

##### css

```js
css(css, value) {
  if (value !== undefined) {
    this.each((el) => {
      Utils.setCss(el, css, value);
    });
    return this;
  }
  if (typeof css === 'object') {
    for (const property in css) {
      if (Object.prototype.hasOwnProperty.call(css, property)) {
        this.each((el) => {
          Utils.setCss(el, property, css[property]);
        });
      }
    }
    return this;
  }
  const cssProp = Utils.camelCase(css);
  const property = Utils.styleSupport(cssProp);
  return getComputedStyle(this.element)[property];
}
```

##### data

```js
data(name, value) {
  return this.attr(`data-${name}`, value);
}
```

##### each

```js
each(func) {
    if (!this.elements) {
        return this;
    }
    if (this.elements.length !== undefined) {
        [].slice.call(this.elements).forEach((el, index) => {
            func.call(el, el, index);
        });
    } else {
        func.call(this.element, this.element, 0);
    }
    return this;
}
```

##### empty

```js
empty() {
  this.each((el) => {
    el.innerHTML = '';
  });
  return this;
}
```

##### eq

```js
eq(index) {
  return new Utils(this.elements[index]);
}
```

##### find

```js
find(selector) {
  return new Utils(Utils.getSelector(selector, this.element));
}
```

##### first

```js
first() {
  if (this.elements && this.elements.length !== undefined) {
    return new Utils(this.elements[0]);
  }
  return new Utils(this.elements);
}
```

##### get

```js
get() {
  return this.elements;
}
```

##### hasClass

```js
hasClass(className) {
  if (!this.element) {
    return false;
  }
  return this.element.classList.contains(className);
}
```

##### height

```js
height() {
  if (!this.element) {
    return 0;
  }
  const style = window.getComputedStyle(this.element, null);
  return parseFloat(style.height.replace('px', ''));
}
```

##### html

```js
html(html) {
  if (html === undefined) {
    if (!this.element) {
      return '';
    }
    return this.element.innerHTML;
  }
  this.each((el) => {
    el.innerHTML = html;
  });
  return this;
}
```

##### index

```js
index() {
  if (!this.element) return -1;
  let i = 0;
  do {
    i++;
  } while ((this.element = this.element.previousElementSibling));
  return i;
}
```

##### is

```js
is(el) {
  if (typeof el === 'string') {
    return (
      this.element.matches ||
      this.element.matchesSelector ||
      this.element.msMatchesSelector ||
      this.element.mozMatchesSelector ||
      this.element.webkitMatchesSelector ||
      this.element.oMatchesSelector
    ).call(this.element, el);
  }
  return this.element === (el.element || el);
}
```

##### next

```js
next() {
  if (!this.element) {
    return this;
  }
  return new Utils(this.element.nextElementSibling);
}
```

##### nextAll

```js
nextAll(filter) {
  if (!this.element) {
    return this;
  }
  const sibs = [];
  let nextElem = this.element.parentNode.firstChild;
  do {
    if (nextElem.nodeType === 3) continue; // ignore text nodes
    if (nextElem === this.element) continue; // ignore this.element of target
    if (nextElem === this.element.nextElementSibling) {
      if (!filter || filter(this.element)) {
        sibs.push(nextElem);
        this.element = nextElem;
      }
    }
  } while ((nextElem = nextElem.nextSibling));
  return new Utils(sibs);
}
```

##### off

```js
off(event) {
  if (!this.elements) {
    return this;
  }
  Object.keys(Utils.eventListeners).forEach((eventName) => {
    if (Utils.isEventMatched(event, eventName)) {
      Utils.eventListeners[eventName].forEach((listener) => {
        this.each((el) => {
          el.removeEventListener(
            eventName.split('.')[0],
            listener
          );
        });
      });
    }
  });

  return this;
}
```

##### offset

```js
offset() {
  if (!this.element) {
    return {
      left: 0,
      top: 0,
    };
  }
  const box = this.element.getBoundingClientRect();
  return {
    top:
      box.top +
      window.pageYOffset -
      document.documentElement.clientTop,
    left:
      box.left +
      window.pageXOffset -
      document.documentElement.clientLeft,
  };
}
```

##### offsetParent

```js
offsetParent() {
  if (!this.element) {
    return this;
  }
  return new Utils(this.element.offsetParent);
}
```

##### on

```js
on(events, listener) {
  if (!this.elements) {
    return this;
  }
  events.split(' ').forEach((event) => {
    if (!Array.isArray(Utils.eventListeners[event])) {
      Utils.eventListeners[event] = [];
    }
    Utils.eventListeners[event].push(listener);
    this.each((el) => {
      el.addEventListener(event.split('.')[0], listener);
    });
  });

  return this;
}
```

##### one

```js
one(event, listener) {
  this.each((el) => {
    new Utils(el).on(event, () => {
      new Utils(el).off(event);
      listener(event);
    });
  });
  return this;
}
```

##### outerHeight

```js
outerHeight(margin) {
  if (!this.element) {
    return 0;
  }
  if (margin !== undefined) {
    let height = this.element.offsetHeight;
    const style = getComputedStyle(this.element);

    height +=
      parseInt(style.marginTop, 10) +
      parseInt(style.marginBottom, 10);
    return height;
  }
  return this.element.offsetHeight;
}
```

##### outerWidth

```js
outerWidth(margin) {
  if (!this.element) {
    return 0;
  }
  if (margin !== undefined) {
    let width = this.element.offsetWidth;
    const style = window.getComputedStyle(this.element);

    width +=
      parseInt(style.marginLeft, 10) +
      parseInt(style.marginRight, 10);
    return width;
  }
  return this.element.offsetWidth;
}
```

##### parent

```js
parent() {
  return new Utils(this.element.parentElement);
}
```

##### parentsUntil

```js
parentsUntil(selector, filter) {
  if (!this.element) {
    return this;
  }
  const result = [];
  const matchesSelector =
    this.element.matches ||
    this.element.webkitMatchesSelector ||
    this.element.mozMatchesSelector ||
    this.element.msMatchesSelector;

  // match start from parent
  let el = this.element.parentElement;
  while (el && !matchesSelector.call(el, selector)) {
    if (!filter) {
      result.push(el);
    } else if (matchesSelector.call(el, filter)) {
      result.push(el);
    }
    el = el.parentElement;
  }
  return new Utils(result);
}
```

##### position

```js
position() {
  return {
    left: this.element.offsetLeft,
    top: this.element.offsetTop,
  };
}
```

##### prepend

```js
prepend(html) {
  this.each((el) => {
    if (typeof html === 'string') {
      el.insertAdjacentHTML('afterbegin', html);
    } else {
      el.insertBefore(html, el.firstChild);
    }
  });
  return this;
}
```

##### prev

```js
prev() {
  if (!this.element) {
    return this;
  }
  return new Utils(this.element.previousElementSibling);
}
```

##### prevAll

```js
prevAll(filter) {
  if (!this.element) {
    return this;
  }
  const sibs = [];
  while ((this.element = this.element.previousSibling)) {
    if (this.element.nodeType === 3) {
      continue; // ignore text nodes
    }
    if (!filter || filter(this.element)) sibs.push(this.element);
  }
  return new Utils(sibs);
}
```

##### remove

```js
remove() {
  this.each((el) => {
    el.parentNode.removeChild(el);
  });
  return this;
}
```

##### removeAttr

```js
removeAttr(attributes) {
  const attrs = attributes.split(' ');
  this.each((el) => {
    attrs.forEach((attr) => el.removeAttribute(attr));
  });
  return this;
}
```

##### removeClass

```js
removeClass(classNames) {
  this.each((el) => {
    // IE doesn't support multiple arguments
    classNames.split(' ').forEach((className) => {
      el.classList.remove(className);
    });
  });
  return this;
}
```

##### siblings

```js
siblings() {
  if (!this.element) {
    return this;
  }
  const elements = Array.prototype.filter.call(
    this.element.parentNode.children,
    (child) => child !== this.element
  );
  return new Utils(elements);
}
```

##### text

```js
text(text) {
  if (text === undefined) {
    if (!this.element) {
      return '';
    }
    return this.element.textContent;
  }
  this.each((el) => {
    el.textContent = text;
  });
  return this;
}
```

##### toggleClass

```js
toggleClass(className) {
  if (!this.element) {
    return this;
  }
  this.element.classList.toggle(className);
}
```

##### trigger

```js
trigger(event, detail) {
  if (!this.element) {
    return this;
  }
  const eventName = event.split('.')[0];
  const isNativeEvent =
    typeof document.body[`on${eventName}`] !== 'undefined';
  if (isNativeEvent) {
    this.each((el) => {
      el.dispatchEvent(new Event(eventName));
    });
    return this;
  }
  const customEvent = new CustomEvent(eventName, {
    detail: detail || null,
  });
  this.each((el) => {
    el.dispatchEvent(customEvent);
  });
  return this;
}
```

##### unwrap

```js
unwrap() {
  this.each((el) => {
    const elParentNode = el.parentNode;

    if (elParentNode !== document.body) {
      elParentNode.parentNode.insertBefore(el, elParentNode);
      elParentNode.parentNode.removeChild(elParentNode);
    }
  });
  return this;
}
```

##### val

```js
val(value) {
  if (!this.element) {
    return '';
  }
  if (value === undefined) {
    return this.element.value;
  }
  this.element.value = value;
}
```

##### width

```js
width() {
  if (!this.element) {
    return 0;
  }
  const style = window.getComputedStyle(this.element, null);
  return parseFloat(style.width.replace('px', ''));
}
```

##### wrap

```js
wrap(className) {
  this.each((el) => {
    const wrapper = document.createElement('div');
    wrapper.className = className;
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
  return this;
}
```
</div></div></div></div>
</section>
