const { app, ipcMain, BrowserWindow } = require("electron");

let appWin;

createWindow = () => {
    appWin = new BrowserWindow({
        /*width: 800,
        height: 600,*/
        title: "Angular and Electron",
        resizable: true,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false
        }
    });
    
    appWin.loadURL(`file://${__dirname}/dist/index.html`);

    appWin.setMenu(null);

    appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("message", (event) => event.reply("reply", "pong"));