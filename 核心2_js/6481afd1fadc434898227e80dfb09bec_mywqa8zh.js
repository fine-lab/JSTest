viewModel.get("button22yc") &&
  viewModel.get("button22yc").on("click", function (data) {
    // 批量面单打印--单击
    var socket, defaultPrinter;
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows.length == 0) {
      cb.utils.alert("打印异常，请先选择数据！");
      return false;
    }
    socket = new WebSocket("ws://127.0.0.1:13528");
    var errorMessage = "";
    // 打开Socket
    socket.onopen = function (event) {
      getPrintList();
      //获取选中数据
      for (var i = 0; i < rows.length; i++) {
        var dataRes = cb.rest.invokeFunction("GT8AT43.backDesignerFunction.queryDataById", { idnumber: rows[i].id }, function (err, res) {}, viewModel, { async: false });
        if (dataRes.error) {
          errorMessage = errorMessage + "编码【" + rows[i].code + "】查询信息异常：" + dataRes.error.message + " \n;";
          continue;
        }
        var data = dataRes.result.dataRuslt;
        if (data.ziduan1 != null) {
          errorMessage = errorMessage + "编码【" + rows[i].code + "】获取到菜单面单号" + data.ziduan1 + " \n";
        } else {
          errorMessage = errorMessage + "编码【" + rows[i].code + "】未获取到菜单面单号; \n";
          continue;
        }
      }
      // 监听消息
      socket.onmessage = function (event) {
        defaultPrinter = JSON.parse(event.data).defaultPrinter;
      };
      // 监听Socket的关闭
      socket.onclose = function (event) {
      };
      if ("" != errorMessage) {
        cb.utils.alert(errorMessage);
        return false;
      }
    };
    socket.onmessage = function (event) {
      var response = eval(event.data);
      if (response.cmd == "notifyPrintResult") {
        //打印通知
        if (response.taskStatus == "printed") {
          //打印完成回调 response.printStatus[0].documentID
        }
      }
    };
    //打印电子面单
    function doPrint(waybillNO, printData) {
      var request = getRequestObject("print");
      request.task = new Object();
      request.task.taskID = getUUID(8, 10);
      request.task.preview = false;
      request.task.printer = defaultPrinter;
      var documents = new Array();
      var doc = new Object();
      doc.documentID = waybillNO;
      var waybill = getWaybillJson(printData);
      doc.contents = waybill;
      documents.push(doc);
      request.task.documents = documents;
      if (socket.readyState === 1) {
        socket.send(JSON.stringify(request));
      }
    }
    function getUUID(len, radix) {
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
      var uuid = [],
        i;
      radix = radix || chars.length;
      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
      } else {
        var r;
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
      var request = new Object();
      request.requestID = getUUID(8, 16);
      request.version = "1.0";
      request.cmd = cmd;
      return request;
    }
    function getPrintList() {
      var request = getRequestObject("getPrinters");
      if (socket.readyState === 1) {
        socket.send(JSON.stringify(request));
      }
    }
    //获取运单数据 waybillNO 电子面单号
    function getWaybillJson(printData) {
      var printDataValue = JSON.parse(printData);
      var contentValue = new Array();
      contentValue.push(printDataValue);
      var ret = {
        content: contentValue
      };
      return ret.content;
    }
  });