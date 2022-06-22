const {app, BrowserWindow} = require('electron')
    const url = require("url");
    const path = require("path");

    let mainWindow

    function createWindow () {
      mainWindow = new BrowserWindow({
        /*width: 800,
        height: 600,*/
        webPreferences: {
          nodeIntegration: true
        }
      })
	  mainWindow.maximize();

      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/coreui-free-angular-admin-template/index.html`),
          protocol: "file:",
          slashes: true
        })
      );
      // Open the DevTools.
      //mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
	  mainWindow.setMenu(null);
    }
	
	
    app.on('ready', createWindow)

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('activate', function () {
      if (mainWindow === null) createWindow()
    })