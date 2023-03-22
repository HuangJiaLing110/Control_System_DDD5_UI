'use strict'

import {app, protocol, BrowserWindow, ipcMain} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer'
import {initializeIpc} from '@/electron/bridge/ipc'
import {accessSync, constants, mkdirSync} from 'fs';
import ptp from "pdf-to-printer";

const fetch = require("node-fetch");
const fs = require("fs");
const os = require('os');

// const PDFWindow = require('electron-pdf-window')

console.log("=============initializeIpc" + initializeIpc)

const path = require("path");
// import  path from 'path'
// import {remote}  from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production'

// contextBridge.exposeInMainWorld(
//   'testDll',
//   {
//     doThing: () => ipcRenderer.send('do-a-thing'),
//     hello:testDll.Hello,
//     strlen:testDll.strlen,
//     plus:testDll.plus,
//   }
// )


// preload的本地缓存路径
// 注意，这里必须是remote.app.getPath的路径，不能为__dirname路径，__dirname打包后的路径不可读写了
// const preloadCachePath = path.join(remote.app.getPath('appData'), './bridge/preload.js');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {scheme: 'app', privileges: {secure: true, standard: true}}
])

require('@electron/remote/main').initialize(

)

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow = null,
  printWindow = null;

async function createWindow() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: '茂砼',
    center: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "/resoures/bridge/preload.js"),//使用预加载脚本
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })
  require("@electron/remote/main").enable(mainWindow.webContents)

  initializeIpc(app, mainWindow.webContents);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  printWeb();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


//打印设置(窗口打印)
function printWeb() {
  printWindow = new BrowserWindow({
    title: '菜单打印',
    show: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, //开启渲染进程中调用模块  即require
      webviewTag: true,
    }
  })
  //printWindow.webContents.openDevTools()
  // let url = path.join(__dirname,"/resoures/print/print.html")
  // console.log(url)
  // printWindow.loadFile(url);
  initPrintEvent()
}


function download(url, doneCallback) {
  return fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/octet-stream'},
  }).then(res => res.buffer()).then(_ => {
    let pdfFile = path.join(os.tmpdir(), 'mtPrintTemp');
    try {
      accessSync(pdfFile, constants.F_OK)
    } catch (err) {
      mkdirSync(pdfFile)
    }
    pdfFile = path.join(pdfFile, (new Date()).getTime() + ".pdf")

    console.log(pdfFile)
    fs.writeFile(pdfFile, _, "binary", function (err) {
      if (err) {
        console.error("下载文件 " + url + " 失败,原始是" + err)
      } else {
        doneCallback(pdfFile)
      }
    });
  });
}

function initPrintEvent() {
  ipcMain.on('print-start', (event, obj, deviceName) => {

    // const options = {
    //   printer: "Zebra",
    //   unix: ["-o fit-to-page"],
    //   win32: ['-print-settings "fit"'],
    // };
    // const options = {
    //   printer: "Zebra",
    //   unix: ["-o fit-to-page"],
    //   win32: ['-print-settings "fit"'],
    // };
    // let file = "D:\\IDE\\IDEA1\\workspace1\\erp\\erp-ui\\dist_electron\\dll\\test1.pdf"

    //node-fetch  https://github.com/bitinn/node-fetch


    // var url = "https://nodejs.org/dist/v8.9.4/node-v8.9.4-win-x64.zip";
    download(obj, (pdfFile) => {
      ptp.print(pdfFile)
        .then(console.log).catch(console.error)
    })

  })

  function handleIframe(webContents) {

    // const webContents = electronRemote.webContents.getAllWebContents()[1]

    //window.document.getElementsByClassName("dropdown-item")[0].click()
    // window.frames[0].window.print()

    let code =
      `
      console.log(3333);
    let parentWindow = window;
    window.document.createElement1 = window.document.createElement;

    window.document.createElement =(child)=>{
      let ccc  =  window.document.createElement1(child);

      if(child === 'iframe')
      {
        window.printIfrmae = ccc;

        ccc.onload =()=>{
          ccc.contentWindow.print = ()=>{console.log('======print')};
          setTimeout(()=>{
            let items = ccc.contentWindow.parent.document.body.children
            let itemCount = items.length;
            for(let i=itemCount-1;i>=0;i--)
            {
              let ccc1 = items[i]
              if(ccc1.tagName != 'SCRIPT' && ccc1.tagName != 'IFRAME')
              {
                ccc1.style.display = 'none'
                ccc1.style.width = '0px';
                ccc1.style.height = '0px';
                //ccc.contentWindow.parent.document.body.removeChild(ccc1);
              }
            }

            let h = 0;
            let w = 718;

            for(let i=0;i<ccc.contentWindow.document.body.children.length;i++)
            {
              console.log('d============================='+ccc.contentWindow.document.body.children[i].style.height)
              h+=parseFloat(ccc.contentWindow.document.body.children[i].style.height);
              console.log('d============================='+ccc.contentWindow.document.body.children[i].style.height)
              w = parseFloat(ccc.contentWindow.document.body.children[i].style.width);
            }
            ccc.style.position='absolute';

            console.log('d============================='+h)
            ccc.style.width = '718px';
            ccc.style.height = h+'px';
            ccc.style.left = '0px'
            ccc.style.top = '0px';
            ccc.style.display = 'block';
            ccc.style.zIndex =1000;
            ccc.contentWindow.initialized = true;
          },1000);
        }
  }
    return ccc;
  }
  `

    // contentWindow
    webContents.executeJavaScript(code, true)
      .then((result) => {
        console.log(result)
      }).catch((result) => {
      // debugger
      console.log(result) // Will be the JSON object from the fetch call
    })


  }

  ipcMain.on('print-start-web', (event, obj, deviceName) => {
    console.log('print-start url:' + obj + "\n deviceName: " + deviceName)
    printWindow.loadURL(obj);
    printWindow.webContents.once('did-finish-load', () => {
      console.log('=============did-finish-load')
      handleIframe(printWindow.webContents);
      let clickTryTimes = 10;
      let clickIntervalId = setInterval(() => {
        let code = `
              window.document.getElementsByClassName('ty-slider')[0].value =50;
              let ev = document.createEvent("HTMLEvents");
              ev.initEvent("change", false, true);
              window.document.getElementsByClassName('ty-slider')[0].dispatchEvent(ev)
              window.document.getElementsByClassName('dropdown-list')[0].children[0].click()`
        printWindow.webContents.executeJavaScript(code, true)
          .then(() => {
            clearInterval(clickIntervalId)
            console.log('======================== click')
              let intializeTryTimes = 10;
              let intializeIntervalId = setInterval(() => {
              let code = ` window.document.getElementById('jeecg_print_ty').contentWindow.initialized`
              printWindow.webContents.executeJavaScript(code, true)
                .then((result) => {
                  if(result)
                  {
                    console.log("==========================================initialized")
                    clearInterval(intializeIntervalId)

                    const printers = printWindow.webContents.getPrinters();
                    printers.forEach(element => {
                      console.log(element.name + "  " + element.status)
                      if (element.name === deviceName && element.status != 0) {
                        console.log("====mainWindow:" + mainWindow)
                        mainWindow.send('print-error', deviceName + '打印机异常');
                        printWindow.webContents.print({
                            silent: true,
                            printBackground: true,
                            deviceName: ''
                          },
                          (success, errorType) => {
                            if (!success)
                              console.log("=====Print error:" + ",errorType:" + errorType)
                            else
                              console.log("=====Print OK ")
                          });
                      } else if (element.name === deviceName && !element.status) {
                        console.log(element.status + '-====' + deviceName)
                        printWindow.webContents.print({
                            silent: true,
                            printBackground: true,
                            deviceName: deviceName
                          },
                          (success, errorType) => {
                            if (!success)
                              console.log("=====Print error:" + deviceName + ",errorType:" + errorType)
                            else
                              console.log("=====Print OK " + deviceName)
                          });
                      }
                    })
                  }
                }).catch((result) => {
                  intializeTryTimes--;
                  if(intializeTryTimes <=0)
                  {
                    clearInterval(intializeIntervalId)
                    console.log('========================初始化打印页面失败,'+result) // Will be the JSON object from the fetch call
                  }
                  console.log('========================等待初始化打印页面，重试：'+intializeTryTimes+'次') // Will be the JSON object from the fetch call
              })
            }, 1000)
          }).catch(() => {
            clickTryTimes--;
            if(clickTryTimes <=0)
            {
              clearInterval(clickIntervalId)
              console.log('========================加载打印页面失败') // Will be the JSON object from the fetch call
            }
            console.log('========================等待打印页面加载，重试：'+clickTryTimes+'次') // Will be the JSON object from the fetch call
        })
      }, 3000);

    })
    // event.returnValue = printWindow.webContents;
  })

  ipcMain.on('print-start-web1', (event, obj, deviceName) => {

    const printers = printWindow.webContents.getPrinters();
    printers.forEach(element => {
      console.log(element.name + "  " + element.status)
      if (element.name === deviceName && element.status != 0) {
        console.log("====mainWindow:" + mainWindow)
        mainWindow.send('print-error', deviceName + '打印机异常');
        printWindow.webContents.print({
            silent: true,
            printBackground: true,
            deviceName: ''
          },
          (success, errorType) => {
            if (!success)
              console.log("=====Print error:" + ",errorType:" + errorType)
            else
              console.log("=====Print OK ")
          });
      } else if (element.name === deviceName && !element.status) {
        console.log(element.status + '-====' + deviceName)
        printWindow.webContents.print({
            silent: true,
            printBackground: true,
            deviceName: deviceName
          },
          (success, errorType) => {
            if (!success)
              console.log("=====Print error:" + deviceName + ",errorType:" + errorType)
            else
              console.log("=====Print OK " + deviceName)
          });
      }
    })

    // event.returnValue = printWindow.webContents;
  })

  //获得打印机列表
  ipcMain.on('allPrint', () => {
    const printers = printWindow.webContents.getPrinters();
    mainWindow.send('printName', printers)
  })

  ipcMain.on('getWebContents', (event) => {
    event.returnValue = printWindow.webContents
  })

  // ipcMain.on('do', (event, deviceName) => {
  //   const printers = printWindow.webContents.getPrinters();
  //   printers.forEach(element => {
  //     if (element.name === deviceName && element.status != 0) {
  //       mainWindow.send('print-error', deviceName + '打印机异常');
  //       printWindow.webContents.print({
  //           silent: false,
  //           printBackground: false,
  //           deviceName: ''
  //         },
  //         (data) => {
  //           console.log("回调", data);
  //         });
  //     } else if (element.name === deviceName && !element.status) {
  //       console.log(element.status+'-'+deviceName)
  //       printWindow.webContents.print({
  //           silent: true,
  //           printBackground: false,
  //           deviceName: element.name
  //         },
  //         (data) => {
  //           console.log("回调", data);
  //         });
  //     }
  //   });
  //
  // })
}
