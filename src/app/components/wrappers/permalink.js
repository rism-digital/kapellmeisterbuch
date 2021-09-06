import { t } from '../../i18n/';

export default class PermalinkPlugin {
  constructor(core) {
    this.core = core;
    this.toolbarIcon;
    this.toolbarSide = 'right';
  }

  handleClick() {
    let url = document.location.origin + '/book#' + this.core.publicInstance.getCurrentPageURI().replace('https://iiif.rism.digital/image/ch/CH_E_925_03/pyr_', '').slice(0, -4);

    // make a transparent textarea
    var textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    // add the value...
    textArea.value = url;

    // add it to the page
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy to clipboard');
    }

    document.body.removeChild(textArea);

    var x = document.getElementById('snackbar');

    // Add the "show" class to DIV
    x.className = 'show';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace('show', ''); }, 3000);
  }

  createIcon() {
    const toolbarIcon = document.createElement('div');
    toolbarIcon.classList.add('diva-permalink-icon', 'diva-button');
    toolbarIcon.setAttribute('title', t('common.viewer.copy_link'));

    let root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    root.setAttribute('viewBox', '-6 -6 570 570');
    root.setAttribute('style', 'display: block; padding: 1%');
    root.setAttribute('width', '90%');
    root.id = `${this.core.settings.selector}permalink-icon`;

    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.id = `${this.core.settings.selector}permalink-icon-glyph`;
    g.setAttribute('class', 'diva-toolbar-icon');

    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M245.531,245.532c4.893-4.896,11.42-7.589,18.375-7.589s13.482,2.696,18.375,7.589l49.734,49.734\
        c1.723,1.72,4.058,2.689,6.49,2.689s4.771-0.967,6.49-2.689l49.733-49.734c1.724-1.72,2.69-4.058,2.69-6.49\
        c0-2.433-0.967-4.771-2.69-6.49l-49.733-49.734c-21.668-21.662-50.469-33.589-81.093-33.589s-59.425,11.928-81.093,33.586\
        L33.602,332.022C11.934,353.69,0,382.494,0,413.128c0,30.637,11.934,59.432,33.605,81.084l49.731,49.73\
        c21.65,21.668,50.447,33.603,81.081,33.603s59.438-11.935,81.108-33.603l84.083-84.082c2.705-2.705,3.448-6.803,1.869-10.285\
        c-1.496-3.295-4.776-5.386-8.356-5.386c-0.205,0-0.407,0.007-0.615,0.021c-2.959,0.199-5.958,0.297-8.917,0.297\
        c-23.354,0-46.322-6.208-66.417-17.956c-1.444-0.844-3.042-1.254-4.629-1.254c-2.375,0-4.725,0.921-6.494,2.689l-53.238,53.238\
        c-4.902,4.901-11.426,7.604-18.372,7.604c-6.949,0-13.479-2.699-18.381-7.604l-49.734-49.734\
        c-4.908-4.896-7.61-11.411-7.616-18.348c-0.003-6.953,2.699-13.489,7.616-18.406L245.531,245.532z');
    g.appendChild(path);

    let path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M543.942,83.324L494.208,33.59C472.556,11.931,443.762,0,413.128,0s-59.438,11.928-81.105,33.587l-84.086,84.119\
        c-2.705,2.705-3.448,6.806-1.867,10.288c1.497,3.292,4.777,5.382,8.354,5.382c0.205,0,0.413-0.006,0.621-0.021\
        c2.987-0.202,6.013-0.303,9-0.303c23.4,0,46.316,6.206,66.274,17.947c1.45,0.854,3.057,1.267,4.65,1.267\
        c2.375,0,4.725-0.921,6.494-2.689l53.274-53.274c4.893-4.896,11.42-7.589,18.375-7.589s13.482,2.696,18.375,7.589l49.734,49.734\
        c10.123,10.135,10.123,26.634-0.003,36.775L332.017,332.014c-4.894,4.905-11.408,7.604-18.348,7.604\
        c-6.956,0-13.495-2.702-18.415-7.61l-49.723-49.725c-1.723-1.72-4.057-2.69-6.49-2.69c-2.433,0-4.771,0.967-6.49,2.69\
        l-49.734,49.734c-3.586,3.586-3.586,9.397,0,12.983l49.734,49.734c21.668,21.668,50.469,33.602,81.093,33.602\
        c30.625,0,59.426-11.934,81.094-33.602l149.205-149.206c21.668-21.658,33.603-50.462,33.603-81.102S565.61,104.983,543.942,83.324z');
    g.appendChild(path2);


    root.appendChild(g);

    toolbarIcon.appendChild(root);

    let snackbar = document.createElement('div');
    snackbar.setAttribute('id', 'snackbar');
    snackbar.textContent = t('common.viewer.copied');
    toolbarIcon.appendChild(snackbar);

    return toolbarIcon;
  }
}

PermalinkPlugin.prototype.pluginName = 'permalink';
PermalinkPlugin.prototype.isPageTool = false;

/**
 * Make this plugin available in the global context
 * as part of the 'Diva' namespace.
 **/
(function (global) {
  global.Diva.PermalinkPlugin = PermalinkPlugin;
})(window);