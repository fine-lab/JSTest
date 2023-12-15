viewModel.get("button24me") &&
  viewModel.get("button24me").on("click", function (data) {
    var socket, defaultPrinter;
    var waybillNO = "2027200037403746";
    socket = new WebSocket("ws://127.0.0.1:13528");
    // 打开Socket
    socket.onopen = function (event) {
      getPrintList();
      doPrint(waybillNO);
      // 监听消息
      socket.onmessage = function (event) {
        debugger;
        console.log("Client received a message", event);
        console.log(JSON.parse(event.data).defaultPrinter);
        defaultPrinter = JSON.parse(event.data).defaultPrinter;
      };
      // 监听Socket的关闭
      socket.onclose = function (event) {
        console.log("Client notified socket has closed", event);
      };
    };
    socket.onmessage = function (event) {
      var response = eval(event.data);
      if (response.cmd == "notifyPrintResult") {
        //打印通知
        console.log(response.taskID);
        if (response.taskStatus == "printed") {
          //打印完成回调 response.printStatus[0].documentID
        }
      }
    };
    //打印电子面单
    function doPrint(waybillNO) {
      debugger;
      var request = getRequestObject("print");
      request.task = new Object();
      request.task.taskID = getUUID(8, 10);
      request.task.preview = false;
      request.task.printer = defaultPrinter;
      var documents = new Array();
      var doc = new Object();
      doc.documentID = waybillNO;
      var waybill = getWaybillJson(waybillNO);
      doc.contents = waybill;
      documents.push(doc);
      request.task.documents = documents;
      if (socket.readyState === 1) {
        console.log(request);
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
      debugger;
      var request = getRequestObject("getPrinters");
      if (socket.readyState === 1) {
        console.log(request);
        socket.send(JSON.stringify(request));
      }
    }
    //获取运单数据 waybillNO 电子面单号
    function getWaybillJson(waybillNO) {
      var ret = {
        content: [
          {
            data: {
              _dataFrom: "waybill",
              cpCode: "SHENTONG",
              needEncrypt: false,
              parent: false,
              recipient: {
                address: {
                  city: "武汉市",
                  detail: "东湖路112号",
                  district: "武昌区",
                  province: "湖北省"
                },
                mobile: "13100000000",
                name: "张三"
              },
              routingInfo: {
                consolidation: {
                  code: "E30",
                  name: "中转集"
                },
                routeCode: "327 E70 000",
                sortation: {
                  name: "E70"
                }
              },
              sender: {
                address: {
                  city: "太原市",
                  detail: "太榆路185号",
                  district: "小店区",
                  province: "山西省"
                },
                mobile: "15500000000",
                name: "李四"
              },
              shippingOption: {
                code: "STANDARD_EXPRESS",
                title: "标准快递"
              },
              waybillCode: "2027200037403746"
            },
            templateURL: "https://www.example.com/"
          },
          {
            data: {
              tradeInfo: "图书画册 * 3"
            },
            templateURL: "https://www.example.com/"
          }
        ]
      };
      return ret.content;
    }
  });