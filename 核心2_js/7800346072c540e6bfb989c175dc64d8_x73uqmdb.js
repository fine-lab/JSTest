let ws = new WebSocket("ws://localhost:13528");
//如果是https的话，端口是13529
// 打开Socket
ws.onopen = function (event) {
  // 监听消息
  ws.onmessage = function (event) {
    console.log("Client received a message", event);
  };
  // 监听Socket的关闭
  ws.onclose = function (event) {
    console.log("Client notified socket has closed", event);
  };
};
ws.onmessage = function (event) {
  let response = eval(event.data);
  if (response.cmd == "getPrinters") {
    getPrintersHandler(response); //处理打印机列表
  } else if (response.cmd == "printerConfig") {
    printConfigHandler(response);
  }
};
function getUUID(len, radix) {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}
function getRequestObject(cmd) {
  let request = new Object();
  request.requestID = getUUID(8, 16);
  request.version = "1.0";
  request.cmd = cmd;
  return request;
}
function getCustomAreaData(waybillNO) {
  //获取waybill对应的自定义区的JSON object，此处的ajaxGet函数是伪代码
  let jsonObject = ajaxGet(waybillNO);
  let ret = new Object();
  ret.templateURL = jsonObject.content.templateURL;
  ret.data = jsonObject.content.data;
  return ret;
}
function getWaybillJson(waybillNO) {
  //获取waybill对应的json object，此处的ajaxGet函数是伪代码
  let jsonObject = ajaxGet(waybillNO);
  return jsonObject;
}
function doPrint(printer, waybillArray) {
  let request = getRequestObject("print");
  request.task = new Object();
  request.task.taskID = getUUID(8, 10);
  request.task.preview = false;
  request.task.printer = printer;
  let documents = new Array();
  for (i = 0; i < waybillArray.length; i++) {
    let doc = new Object();
    doc.documentID = waybillArray[i];
    let content = new Array();
    let waybillJson = getWaybillJson(waybillArray[i]);
    let customAreaData = getCustomAreaData(waybillArray[i]);
    content.push(waybillJson, customAreaData);
    doc.content = content;
    documents.push(doc);
  }
  request.task.documents = documents;
  socket.send(JSON.stringify(request));
}
viewModel.get("button17jd") &&
  viewModel.get("button17jd").on("click", function (data) {
    // 按钮--单击
    var request = getRequestObject("getPrinters");
    ws.send(JSON.stringify(request));
    var request = getRequestObject("printerConfig");
    ws.send(JSON.stringify(request));
  });