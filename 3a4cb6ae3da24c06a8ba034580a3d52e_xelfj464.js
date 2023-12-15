let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let AppCode = "AT17F6A93816F80004";
    var nowDate = new Date(); // 2023-07-04
    var now = new Date(nowDate.getTime() + 28800000); //+8个小时换算成北京时间
    let oneWeeksCurrentTimeEnd = new Date(now.setDate(now.getDate() - 1)); //2023-07-03
    let oneWeeksCurrentTimeBegin = new Date(now.setDate(now.getDate() - 6)); //2023-06-27
    let twoWeeksCurrentTimeEnd = new Date(now.setDate(now.getDate() - 1)); //2023-06-26
    let twoWeeksCurrentTimeBegin = new Date(now.setDate(now.getDate() - 6)); //2023-06-20
    //提前两周Body
    let twoWeeksBody = {
      pageIndex: 1,
      pageSize: 10,
      isSum: false,
      simpleVOs: [
        {
          op: "eq",
          value1: "0",
          field: "orderDefineCharacter.ReceiptDateStatus"
        },
        {
          op: "between", //大于等于两周
          value1: convertTime(twoWeeksCurrentTimeBegin),
          field: "orderDefineCharacter.DateOfReceipt",
          value2: convertTime(twoWeeksCurrentTimeEnd)
        }
      ]
    };
    //提前一周Body
    let oneWeeksBody = {
      pageIndex: 1,
      pageSize: 10,
      isSum: false,
      simpleVOs: [
        {
          op: "eq",
          value1: "0",
          field: "orderDefineCharacter.ReceiptDateStatus"
        },
        {
          op: "between",
          value1: convertTime(oneWeeksCurrentTimeBegin),
          field: "orderDefineCharacter.DateOfReceipt",
          value2: convertTime(oneWeeksCurrentTimeEnd)
        }
      ]
    };
    //超时
    let body = {
      pageIndex: 1,
      pageSize: 10,
      isSum: false,
      simpleVOs: [
        {
          op: "eq",
          value1: "0",
          field: "orderDefineCharacter.ReceiptDateStatus"
        },
        {
          op: "gt",
          value1: convertTime(oneWeeksCurrentTimeEnd),
          field: "orderDefineCharacter.DateOfReceipt"
        }
      ]
    };
    //销售订单列表查询
    let url = "https://www.example.com/";
    //销售订单自定义项
    let updateOrderDefineCharacterUrl = "https://www.example.com/";
    //（提前两周预警）
    let twoWeeksApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(twoWeeksBody)));
    var twoWeeksArr = new Array();
    //（提前yi周预警）
    let oneWeeksApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(oneWeeksBody)));
    var oneWeeksArr = new Array();
    //（超时预警）
    let ApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(body)));
    var arr = new Array();
    for (var i = twoWeeksApiResponse.data.recordList.length - 1; i >= 0; i--) {
      twoWeeksArr.push(twoWeeksApiResponse.data.recordList[i].code);
    }
    for (var i = oneWeeksApiResponse.data.recordList.length - 1; i >= 0; i--) {
      oneWeeksArr.push(oneWeeksApiResponse.data.recordList[i].code);
    }
    for (var i = ApiResponse.data.recordList.length - 1; i >= 0; i--) {
      arr.push(ApiResponse.data.recordList[i].code);
    }
    //发送邮件
    var result;
    var uspaceReceiver = ["90015fa6-858f-4296-99f9-1ffe72e3a0f7"];
    var channels = ["uspace"];
    var title = "销售订单预警";
    //提前两周预警
    if (twoWeeksArr.length > 0) {
      var content = `提前两周预警的订单code: ${JSON.stringify(twoWeeksArr)}`;
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        uspaceReceiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content,
        groupCode: "prewarning"
      };
      result = sendMessage(messageInfo);
    }
    if (oneWeeksArr.length > 0) {
      var content = `提前一周预警的订单code: ${JSON.stringify(oneWeeksArr)}`;
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        uspaceReceiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content,
        groupCode: "prewarning"
      };
      result = sendMessage(messageInfo);
    }
    if (arr.length > 0) {
      var content = `超时预警的订单code: ${JSON.stringify(arr)}`;
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        uspaceReceiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content,
        groupCode: "prewarning"
      };
      result = sendMessage(messageInfo);
    }
    //转换时间
    function convertTime(b) {
      let result = b;
      result = `${result.getFullYear()}-${formatSingleDigit(result.getMonth() + 1)}-${formatSingleDigit(result.getUTCDate())}`;
      return result;
    }
    //日期2023-7-4转换成2023-07-04
    function formatSingleDigit(a) {
      let result = a;
      if (a < 10) {
        result = `0${a}`;
      }
      return result;
    }
    return { arr };
  }
}
exports({ entryPoint: MyTrigger });