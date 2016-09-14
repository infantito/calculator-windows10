'use strict';
const {app, BrowserWindow, globalShortcut} = require('electron');

let winCalculator = null;

app.on('ready', () => {
	winCalculator = new BrowserWindow({
		width: 285,
		height: 440,
		resizable: false,
		maximizable: false,
		fullscreenable: false,
		autoHideMenuBar: true,
		icon: `${__dirname}/favicon.ico`
	});
	
	winCalculator.loadURL(`file://${__dirname}/index.html`);
	winCalculator.focus();

	winCalculator.on('closed', () => {
		winCalculator = null;
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
