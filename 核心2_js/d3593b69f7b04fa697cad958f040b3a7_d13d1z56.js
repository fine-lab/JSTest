let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let AppCode = "AT187732D008E80005";
    var nowDate = new Date(); // 2023-07-04
    var now = new Date(nowDate.getTime() + 28800000); //+8个小时换算成北京时间
    let oneWeeksCurrentTimeEnd = new Date(now.setDate(now.getDate() + 1)); //2023-07-03 //2023-07-05
    let oneWeeksCurrentTimeBegin = new Date(now.setDate(now.getDate() + 6)); //2023-06-27 //2023-07-11
    let twoWeeksCurrentTimeEnd = new Date(now.setDate(now.getDate() + 1)); //2023-06-26  //2023-07-12
    let twoWeeksCurrentTimeBegin = new Date(now.setDate(now.getDate() + 6)); //2023-06-20   //2023-07-18
    //获取缓存Url
    var getCacheDataUrl = "https://www.example.com/";
    //新增缓存Url
    var setCacheDataUrl = "https://www.example.com/";
    //提前两周Body
    let twoWeeksBody = {
      pageIndex: 1,
      pageSize: 100,
      isSum: true,
      simpleVOs: [
        {
          op: "eq",
          value1: "未收款",
          field: "orderDefineCharacter.attrext8"
        },
        {
          op: "between", //大于等于两周
          value1: convertTime(twoWeeksCurrentTimeEnd),
          field: "orderDefineCharacter.attrext19",
          value2: convertTime(twoWeeksCurrentTimeBegin)
        }
      ]
    };
    //提前一周Body
    let oneWeeksBody = {
      pageIndex: 1,
      pageSize: 100,
      isSum: true,
      simpleVOs: [
        {
          op: "eq",
          value1: "未收款",
          field: "orderDefineCharacter.attrext8"
        },
        {
          op: "between",
          value1: convertTime(oneWeeksCurrentTimeEnd),
          field: "orderDefineCharacter.attrext19",
          value2: convertTime(oneWeeksCurrentTimeBegin)
        }
      ]
    };
    //超时
    let body = {
      pageIndex: 1,
      pageSize: 100,
      isSum: true,
      simpleVOs: [
        {
          op: "eq",
          value1: "未收款",
          field: "orderDefineCharacter.attrext8"
        },
        {
          op: "lt",
          value1: convertTime(oneWeeksCurrentTimeEnd),
          field: "orderDefineCharacter.attrext19"
        }
      ]
    };
    //销售订单列表查询
    let url = "https://www.example.com/";
    var n = 1;
    //（提前两周预警）
    let twoWeeksApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(twoWeeksBody)));
    var twoWeeksArr = new Array();
    while (twoWeeksApiResponse.data.recordCount > 100 * (n - 1)) {
      for (var i = twoWeeksApiResponse.data.recordList.length - 1; i >= 0; i--) {
        //获取缓存
        let rdsGetBody = {
          companyId: "yourIdHere",
          key: `twoWeeks:${twoWeeksApiResponse.data.recordList[i].code}` //订单编号
        };
        let rdsGetResponse = JSON.parse(postman("post", getCacheDataUrl, null, JSON.stringify(rdsGetBody)));
        if (rdsGetResponse.data == twoWeeksApiResponse.data.recordList[i].orderDefineCharacter.attrext19) {
          continue;
        }
        var body_v1 = {
          code: twoWeeksApiResponse.data.recordList[i].code, //订单编号
          agentId_name: twoWeeksApiResponse.data.recordList[i].agentId_name, //客户名
          attrext22: twoWeeksApiResponse.data.recordList[i].orderDefineCharacter.attrext22, //原厂商
          attrext19: twoWeeksApiResponse.data.recordList[i].orderDefineCharacter.attrext19, //下次收款日期
          originalName: twoWeeksApiResponse.data.recordList[i].orderPrices.originalName, //币种
          payMoney: twoWeeksApiResponse.data.recordList[i].payMoney, //应收金额
          settlementOrgId_name: twoWeeksApiResponse.data.recordList[i].settlementOrgId_name, //销售组织
          id: twoWeeksApiResponse.data.recordList[i].creatorId
        };
        twoWeeksArr.push(body_v1);
      }
      twoWeeksBody.pageIndex = n + 1;
      twoWeeksApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(twoWeeksBody)));
      n++;
    }
    //（提前yi周预警）
    let oneWeeksApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(oneWeeksBody)));
    var oneWeeksArr = new Array();
    n = 1;
    while (oneWeeksApiResponse.data.recordCount > 100 * (n - 1)) {
      for (var i = oneWeeksApiResponse.data.recordList.length - 1; i >= 0; i--) {
        //获取缓存
        let rdsGetBody = {
          companyId: "yourIdHere",
          key: `oneWeeks:${oneWeeksApiResponse.data.recordList[i].code}` //订单编号
        };
        let rdsGetResponse = JSON.parse(postman("post", getCacheDataUrl, null, JSON.stringify(rdsGetBody)));
        if (rdsGetResponse.data == oneWeeksApiResponse.data.recordList[i].orderDefineCharacter.attrext19) {
          continue;
        }
        var body_v1 = {
          code: oneWeeksApiResponse.data.recordList[i].code, //订单编号
          agentId_name: oneWeeksApiResponse.data.recordList[i].agentId_name, //客户名
          attrext22: oneWeeksApiResponse.data.recordList[i].orderDefineCharacter.attrext22, //原厂商
          attrext19: oneWeeksApiResponse.data.recordList[i].orderDefineCharacter.attrext19, //下次收款日期
          originalName: oneWeeksApiResponse.data.recordList[i].orderPrices.originalName, //币种
          payMoney: oneWeeksApiResponse.data.recordList[i].payMoney, //应收金额
          settlementOrgId_name: oneWeeksApiResponse.data.recordList[i].settlementOrgId_name, //销售组织
          id: oneWeeksApiResponse.data.recordList[i].creatorId
        };
        oneWeeksArr.push(body_v1);
        twoWeeksArr.push(body_v1);
      }
      oneWeeksBody.pageIndex = n + 1;
      oneWeeksApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(oneWeeksBody)));
      n++;
    }
    //（超时预警）
    let ApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(body)));
    var arr = new Array();
    n = 1;
    while (ApiResponse.data.recordCount > 100 * (n - 1)) {
      for (var i = ApiResponse.data.recordList.length - 1; i >= 0; i--) {
        var body_v1 = {
          code: ApiResponse.data.recordList[i].code, //订单编号
          agentId_name: ApiResponse.data.recordList[i].agentId_name, //客户名
          attrext22: ApiResponse.data.recordList[i].orderDefineCharacter.attrext22, //原厂商
          attrext19: ApiResponse.data.recordList[i].orderDefineCharacter.attrext19, //下次收款日期
          originalName: ApiResponse.data.recordList[i].orderPrices.originalName, //币种
          payMoney: ApiResponse.data.recordList[i].payMoney, //应收金额
          settlementOrgId_name: ApiResponse.data.recordList[i].settlementOrgId_name, //销售组织
          id: ApiResponse.data.recordList[i].creatorId
        };
        arr.push(body_v1);
      }
      body.pageIndex = n + 1;
      ApiResponse = JSON.parse(openLinker("POST", url, AppCode, JSON.stringify(body)));
      n++;
    }
    var getBizDataUrl = "https://www.example.com/";
    //提前两周预警发通知
    let obj_v2 = {};
    let key_Array_v2 = [];
    for (var i = 0; twoWeeksArr.length > i; i++) {
      if (!obj_v2[twoWeeksArr[i].id]) {
        obj_v2[twoWeeksArr[i].id] = [];
        key_Array_v2.push(twoWeeksArr[i].id);
      }
      var twoWeeksBodys = {
        code: twoWeeksArr[i].code, //订单编号
        agentId_name: twoWeeksArr[i].agentId_name, //客户名
        attrext22: twoWeeksArr[i].attrext22, //原厂商
        attrext19: twoWeeksArr[i].attrext19, //下次收款日期
        originalName: twoWeeksArr[i].originalName, //币种
        payMoney: twoWeeksArr[i].payMoney, //应收金额
        settlementOrgId_name: twoWeeksArr[i].settlementOrgId_name //销售组织
      };
      obj_v2[twoWeeksArr[i].id].push(twoWeeksBodys);
    }
    for (var i = 0; key_Array_v2.length > i; i++) {
      var getBizDataBody = {
        condition: {
          simpleVOs: [
            {
              field: "id",
              op: "eq",
              value1: key_Array_v2[i]
            }
          ]
        },
        page: {
          pageIndex: 1,
          pageSize: 10
        }
      };
      var getBizData = JSON.parse(openLinker("POST", getBizDataUrl, AppCode, JSON.stringify(getBizDataBody)));
      var yhtUserId = getBizData.data.recordList[0].yhtUserId;
      //发送邮件
      var result;
      var uspaceReceiver = [yhtUserId];
      var channels = ["uspace"];
      var title = "销售订单预警";
      for (var j = 0; obj_v2[key_Array_v2[i]].length > j; j++) {
        //提前两周预警
        var content = `提前两周预警， 下次付款时间:${obj_v2[key_Array_v2[i]][j].attrext19}\n  销售组织:${obj_v2[key_Array_v2[i]][j].settlementOrgId_name}  订单编号:${
          obj_v2[key_Array_v2[i]][j].code
        }  客户名:${obj_v2[key_Array_v2[i]][j].agentId_name} 原厂商:${obj_v2[key_Array_v2[i]][j].attrext22} 币种:${obj_v2[key_Array_v2[i]][j].originalName} 应收金额:${
          obj_v2[key_Array_v2[i]][j].payMoney
        }`;
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
        if (result.msg == "消息发送成功") {
          let rdsSetBody = {
            companyId: "yourIdHere",
            key: `twoWeeks:${obj_v2[key_Array_v2[i]][j].code}`,
            value: obj_v2[key_Array_v2[i]][j].attrext19,
            ssl: -1
          };
          let rdsSetResponse = postman("post", setCacheDataUrl, null, JSON.stringify(rdsSetBody));
        }
      }
    }
    //提前一周预警发通知
    let obj_v1 = {};
    let key_Array_v1 = [];
    for (var i = 0; oneWeeksArr.length > i; i++) {
      if (!obj_v1[oneWeeksArr[i].id]) {
        obj_v1[oneWeeksArr[i].id] = [];
        key_Array_v1.push(oneWeeksArr[i].id);
      }
      var oneWeeksBodys = {
        code: oneWeeksArr[i].code,
        agentId_name: oneWeeksArr[i].agentId_name,
        attrext22: oneWeeksArr[i].attrext22,
        attrext19: oneWeeksArr[i].attrext19,
        originalName: oneWeeksArr[i].originalName,
        payMoney: oneWeeksArr[i].payMoney,
        settlementOrgId_name: oneWeeksArr[i].settlementOrgId_name //销售组织
      };
      obj_v1[oneWeeksArr[i].id].push(oneWeeksBodys);
    }
    for (var i = 0; key_Array_v1.length > i; i++) {
      var getBizDataBody = {
        condition: {
          simpleVOs: [
            {
              field: "id",
              op: "eq",
              value1: key_Array_v1[i]
            }
          ]
        },
        page: {
          pageIndex: 1,
          pageSize: 10
        }
      };
      var getBizData = JSON.parse(openLinker("POST", getBizDataUrl, AppCode, JSON.stringify(getBizDataBody)));
      var yhtUserId = getBizData.data.recordList[0].yhtUserId;
      //发送邮件
      var result;
      var uspaceReceiver = [yhtUserId];
      var channels = ["uspace"];
      var title = "销售订单预警";
      for (var j = 0; obj_v1[key_Array_v1[i]].length > j; j++) {
        //提前一周预警
        var content = `提前一周预警， 下次付款时间:${obj_v1[key_Array_v1[i]][j].attrext19}\n  销售组织:${obj_v1[key_Array_v1[i]][j].settlementOrgId_name}  订单编号:${
          obj_v1[key_Array_v1[i]][j].code
        }  客户名:${obj_v1[key_Array_v1[i]][j].agentId_name} 原厂商:${obj_v1[key_Array_v1[i]][j].attrext22} 币种:${obj_v1[key_Array_v1[i]][j].originalName} 应收金额:${
          obj_v1[key_Array_v1[i]][j].payMoney
        }`;
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
        if (result.msg == "消息发送成功") {
          let rdsSetBody = {
            companyId: "yourIdHere",
            key: `oneWeeks:${obj_v1[key_Array_v1[i]][j].code}`,
            value: obj_v1[key_Array_v1[i]][j].attrext19,
            ssl: -1
          };
          let rdsSetResponse = postman("post", setCacheDataUrl, null, JSON.stringify(rdsSetBody));
        }
      }
    }
    //超时预警发通知
    let obj = {};
    let key_Array = [];
    for (var i = 0; arr.length > i; i++) {
      if (!obj[arr[i].id]) {
        obj[arr[i].id] = [];
        key_Array.push(arr[i].id);
      }
      var arrBodys = {
        code: arr[i].code,
        agentId_name: arr[i].agentId_name,
        attrext22: arr[i].attrext22,
        attrext19: arr[i].attrext19,
        originalName: arr[i].originalName,
        payMoney: arr[i].payMoney,
        settlementOrgId_name: arr[i].settlementOrgId_name //销售组织
      };
      obj[arr[i].id].push(arrBodys);
    }
    for (var i = 0; key_Array.length > i; i++) {
      var getBizDataBody = {
        condition: {
          simpleVOs: [
            {
              field: "id",
              op: "eq",
              value1: key_Array[i]
            }
          ]
        },
        page: {
          pageIndex: 1,
          pageSize: 10
        }
      };
      var getBizData = JSON.parse(openLinker("POST", getBizDataUrl, AppCode, JSON.stringify(getBizDataBody)));
      var yhtUserId = getBizData.data.recordList[0].yhtUserId;
      //发送邮件
      var result;
      var uspaceReceiver = [yhtUserId];
      var channels = ["uspace"];
      var title = "销售订单预警";
      for (var j = 0; obj[key_Array[i]].length > j; j++) {
        //超时预警
        var content = `超时预警， 下次付款时间:${obj[key_Array[i]][j].attrext19}\n  销售组织:${obj[key_Array[i]][j].settlementOrgId_name}  订单编号:${obj[key_Array[i]][j].code}  客户名:${
          obj[key_Array[i]][j].agentId_name
        } 原厂商:${obj[key_Array[i]][j].attrext22} 币种:${obj[key_Array[i]][j].originalName} 应收金额:${obj[key_Array[i]][j].payMoney}`;
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