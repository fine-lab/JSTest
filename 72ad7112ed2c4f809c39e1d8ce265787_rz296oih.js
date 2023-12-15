let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取时间
    let startExeTime = getTime();
    let endExeTime = startExeTime + 59 * 1000;
    let curPage = 1; // 当前页数
    let totalPageSize = 0; // 读取请求里的总页数
    let configFunc = extrequire("GT37595AT2.commonFun.configParamsFun");
    let config = configFunc.execute("", null);
    let sconfigFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    let body = { vendorCode: sconfig.BASE.SUPPLIER_CODE, orderChangeStatusByIn: "2" };
    let header = { "Content-Type": "application/json", "X-HW-ID": sconfig.BASE.X_HW_ID, "X-HW-APPKEY": sconfig.BASE.X_HW_APPKEY };
    for (var resc = 0; resc < curPage; resc++) {
      let postUrl = sconfig.BASE.URL + "/api/service/esupplier/findPagedOrderChange/1.0.0?suffix_path=/10/" + (resc + 1);
      let exeSRequestDate = getDate();
      let apiResponse = postman("post", postUrl, JSON.stringify(header), JSON.stringify(body));
      let exeSResponseDate = getDate();
      // 记录日志
      try {
        let logObj = { methodName: "findPagedOrderChange", requestParams: JSON.stringify(body), requestTime: exeSRequestDate, respResult: apiResponse, respTime: exeSResponseDate, url: postUrl };
        var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
      } catch (e) {}
      let requestData = JSON.parse(apiResponse);
      if (!requestData || !requestData.result || !requestData.result.result) {
        // 接口没有数据，直接返回
        return { status: 1 };
      }
      if (totalPageSize == 0 && requestData.result.pageVO && requestData.result.pageVO.totalPages > 1) {
        // 未读取过总页数
        totalPageSize = requestData.result.pageVO.totalPages;
        curPage = totalPageSize;
      }
      let result = requestData.result.result;
      let insertOrderChange = []; // 保存集成过来的变更指令
      let idsSet = new Set(); // 需要更新的要货计划ID
      let poNumberSet = new Set(); // 变更指令的需求号，用于调S接口获取对应需求号的最新要货计划
      let changeMap = new Map(); // 存放同一需求号+批次号的数据
      let pushChangeObjs = []; // 推送给供应商的对象
      for (let i = 0; i < result.length; i++) {
        // 已存在的不集成
        let existSql =
          "select count(1) cc from GT37595AT2.GT37595AT2.orderChangeInstructFinal where orderChangeId = '" +
          result[i].orderChangeId +
          "' and orderChangeDetailId = '" +
          result[i].orderChangeDetailId +
          "' ";
        let existRes = ObjectStore.queryByYonQL(existSql);
        if (existRes && existRes[0].cc > 0) {
          continue;
        }
        let insertChangeObj = {};
        insertChangeObj.orderChangeId = result[i].orderChangeId;
        insertChangeObj.orderChangeStatus = result[i].orderChangeStatus;
        insertChangeObj.orderHeaderNum = result[i].orderHeaderNum;
        insertChangeObj.batchNo = result[i].batchNo;
        insertChangeObj.vendorCode = result[i].vendorCode;
        insertChangeObj.orderChangeDetailId = result[i].orderChangeDetailId;
        insertChangeObj.changeField = result[i].changeField;
        insertChangeObj.changeFieldDesc = result[i].changeFieldDesc;
        insertChangeObj.oldValue = result[i].oldValue;
        insertChangeObj.newOfValue = result[i].newValue;
        insertChangeObj.changeReceivedTime = "";
        insertChangeObj.changeClosedTime = "";
        insertChangeObj.sourceId = result[i].sourceId;
        insertChangeObj.orderChangeRemark = result[i].orderChangeRemark;
        insertChangeObj.description = result[i].description;
        insertChangeObj.orderChangeTypeDesc = result[i].orderChangeTypeDesc;
        insertChangeObj.orderChangeTypeCnDesc = result[i].orderChangeTypeCnDesc;
        insertChangeObj.changeObjectType = result[i].changeObjectType;
        insertChangeObj.orderChangeStatusDesc = result[i].orderChangeStatusDesc;
        insertChangeObj.orderUpdateBy = result[i].orderUpdateBy;
        insertChangeObj.changeObjectId = result[i].changeObjectId;
        insertChangeObj.integrateStatus = "2"; // 默认设置状态为推送供应商
        insertChangeObj.sysncStatus = "1"; // 默认设置状态为未推送
        insertChangeObj.orderType = result[i].orderType;
        if (result[i].orderUpdateTime) {
          result[i].orderUpdateTime = result[i].orderUpdateTime.replace("T", " ").replace(".000+0800", "");
        }
        insertChangeObj.orderUpdateTime = result[i].orderUpdateTime;
        insertOrderChange.push(insertChangeObj);
        poNumberSet.add(result[i].orderHeaderNum);
        if (changeMap.has(result[i].orderHeaderNum + "_" + result[i].batchNo)) {
          let exitObjs = changeMap.get(result[i].orderHeaderNum + "_" + result[i].batchNo);
          exitObjs.push(insertChangeObj);
          changeMap.set(result[i].orderHeaderNum + "_" + result[i].batchNo, exitObjs);
        } else {
          changeMap.set(result[i].orderHeaderNum + "_" + result[i].batchNo, [insertChangeObj]);
        }
      }
      if (!insertOrderChange || insertOrderChange.length == 0) {
        continue;
      }
      let c = insertOrderChange;
      debugger;
      // 记录日志
      try {
        let logObj = { methodName: "testPagedOrderChange", requestParams: JSON.stringify(body), requestTime: exeSRequestDate, respResult: insertOrderChange, respTime: exeSResponseDate, url: postUrl };
        var resLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObj, "yb6b993e05");
      } catch (e) {}
      var insertRes = ObjectStore.insertBatch("GT37595AT2.GT37595AT2.orderChangeInstructFinal", insertOrderChange, "yb93f23c80");
      if (endExeTime - startExeTime <= 10000) {
        // 大于10S剩余时间则继续执行，避免因超时而导致报错
        break;
      }
    }
    return { status: 0 };
    function getDate() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      var timeStr = date.getFullYear() + "-";
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1 + "-";
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      timeStr += " ";
      timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      timeStr += ":";
      timeStr += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      timeStr += ":";
      timeStr += date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return timeStr;
    }
    function getTime() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      return date.getTime();
    }
  }
}
exports({ entryPoint: MyTrigger });