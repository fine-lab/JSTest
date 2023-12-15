viewModel.get("button39wg") &&
  viewModel.get("button39wg").on("click", function (data) {
    // 批量发送快递--单击
    var rows = viewModel.getGridModel().getSelectedRows();
    if (rows.length == 0) {
      cb.utils.confirm("请先选择需要发送的数据！");
      return false;
    } else {
      //循环处理选中的数据
      var rowMap = new Map();
      for (var i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (!rowMap.has(row.id)) {
          rowMap.set(row.id, row.code);
        }
      }
      var arrayRes = cb.rest.invokeFunction("ST.cn.queryAttrext", {}, function (err, res) {}, viewModel, { async: false });
      if (arrayRes.error) {
        cb.utils.confirm("查询自定义项【快递类型】配置信息异常：" + arrayRes.error.message);
        return false;
      }
      var array = arrayRes.result.apiArray;
      for (let idnumber of rowMap.keys()) {
        var billDataRes = cb.rest.invokeFunction("ST.backDesignerFunction.queryBillData", { idnumber: idnumber, array: array }, function (err, res) {}, viewModel, { async: false });
        if (billDataRes.error) {
          cb.utils.confirm("查询单据数据异常：" + billDataRes.error.message);
          return false;
        }
        var billData = billDataRes.result.bill[0]; //当前最新数据
        if (billData.def4Vcode == null) {
          cb.utils.confirm("【" + billData.code + "】快递类型转换失败,请检查！");
          return false;
        }
        if (billData.def5 != null) {
          //快递单号不为空
          cb.utils.confirm(rowMap.get(idnumber) + "已存在快递号，不可继续寄快递");
          return false;
        } else {
          if (billData.def4 == "顺丰") {
            var sfRes = cb.rest.invokeFunction("ST.sf.sendDataToSF", { billData: billData }, function (err, res) {}, viewModel, { async: false });
            if (sfRes.error) {
              cb.utils.confirm(rowMap.get(idnumber) + "发送顺丰快递失败：" + sfRes.error.message);
              return false;
            }
          } else {
            var cnRes = cb.rest.invokeFunction("ST.cn.sendDataToCn", { billData: billData }, function (err, res) {}, viewModel, { async: false });
            if (cnRes.error) {
              cb.utils.confirm(rowMap.get(idnumber) + "发送菜鸟快递失败：" + cnRes.error.message);
              return false;
            }
          }
        }
      }
      cb.utils.confirm("批量快递发送成功！");
      viewModel.execute("refresh");
    }
  });
viewModel.get("button80dd") &&
  viewModel.get("button80dd").on("click", function (data) {
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
        var dataRes = cb.rest.invokeFunction("ST.cn.queryDataById", { idnumber: rows[i].id }, function (err, res) {}, viewModel, { async: false });
        if (dataRes.error) {
          errorMessage = errorMessage + "编码【" + rows[i].code + "】打印异常：" + dataRes.error.message + " \n;";
          continue;
        }
        var dataValue = dataRes.result.dataRuslt;
        if (dataValue.printdata != null) {
          doPrint(dataValue.mdh, dataValue.printdata, dataValue.subQty);
        } else {
          errorMessage = errorMessage + "编码【" + rows[i].code + "】未获取到打印信息,请检查; \n";
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
    function doPrint(waybillNO, printData, subQty) {
      var request = getRequestObject("print");
      request.task = new Object();
      request.task.taskID = getUUID(8, 10);
      request.task.preview = false;
      request.task.printer = defaultPrinter;
      var documents = new Array();
      var doc = new Object();
      doc.documentID = waybillNO;
      var waybill = getWaybillJson(printData, subQty);
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
    function getWaybillJson(printData, subQty) {
      var printDataValue = JSON.parse(printData);
      var contentValue = new Array();
      contentValue.push(printDataValue);
      var ss = {
        data: {
          count: subQty
        },
        templateURL: "https://www.example.com/"
      };
      contentValue.push(ss);
      var ret = {
        content: contentValue
      };
      return ret.content;
    }
  });
viewModel.get("st_salesoutlist") &&
  viewModel.get("st_salesoutlist").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
    const btjmx = viewModel.get("sumSwitch").getValue();
    //表体+明细
    if (btjmx == false) {
      viewModel.get("button39wg").setVisible(false); //批量发送快递
      viewModel.get("button80dd").setVisible(false); //
    } else {
      //表头
      viewModel.get("button39wg").setVisible(true); //批量发送快递
      viewModel.get("button80dd").setVisible(true); //批量打印快递
    }
  });