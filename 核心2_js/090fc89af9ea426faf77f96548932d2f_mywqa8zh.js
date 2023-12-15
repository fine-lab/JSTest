let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let lrb = request.lrb; //利润表
    let zcb = request.zcb; //资产负债表
    let result = "";
    if (isNotEmpty(lrb) && isNotEmpty(zcb)) {
      result = dataSyncEntry(request, lrb) + ";" + dataSyncEntry(request, zcb);
    } else if (isNotEmpty(lrb)) {
      result = dataSyncEntry(request, lrb);
    } else if (isNotEmpty(zcb)) {
      result = dataSyncEntry(request, zcb);
    }
    return { result };
    function dataSyncEntry(request, type) {
      let funurl = ""; //函数URL
      let datatype = "";
      let title = "";
      //报表模板数据
      if ("lirunbiao" == type) {
        datatype = "Profit";
        title = "利润表";
        funurl = "AT175542E21C400007.backDefaultGroup.incomeCheck";
      } else if ("zichanfuzhaibiao" == type) {
        datatype = "Balance";
        title = "资产负债表";
        funurl = "AT175542E21C400007.backDefaultGroup.balanceCheck";
      } else {
        throw new Error("没有满足条件的报表类型！");
      }
      let reportConfigDatas = getReportTemplateData(funurl);
      if (!isNotEmpty(reportConfigDatas)) {
        return "失败:" + title + "报表模板数据不满足要求！";
      }
      let indexconfigdatas = getIndexConfigData(request, type, title);
      if (!isNotEmpty(indexconfigdatas)) {
        return "失败:" + title + "未查询到满足条件的指标数据！";
      }
      let items = getZBYDataItems(reportConfigDatas, type, indexconfigdatas);
      let result = pushData2ZBY(request, title, datatype, items);
      return title + "数据同步" + result;
    }
    function isNotEmpty(objobj) {
      let isnotempty = true;
      if (undefined == objobj || "" == objobj || null == objobj || objobj.length == 0) {
        isnotempty = false;
      }
      return isnotempty;
    }
    //获得报表模板数据
    function getReportTemplateData(type) {
      let reporttemplatedatas = new Array();
      let func = extrequire(type);
      let res = func.execute();
      for (let i in res) {
        if (res[i].length != undefined) {
          reporttemplatedatas = res[i];
        }
      }
      return reporttemplatedatas;
    }
    function pushData2ZBY(request, title, datatype, items) {
      let pushdatasuccess = "失败";
      let zbytoken = getZbyToken(request, title);
      if (isNotEmpty(zbytoken)) {
        let kj = request.kjqj.split("-");
        let reportObject = {
          type: datatype,
          title: title,
          orgCode: request.orgCode, // 客户定义为所属组织的
          year: kj[0],
          period: kj[1],
          currencyUnit: "元",
          timestamp: request.mytime,
          items: items
        };
        pushdatasuccess = pushReportData(zbytoken, reportObject, request, title);
      }
      return pushdatasuccess;
    }
    //获取包含智保云token
    function getZbyToken(request, title) {
      let func = extrequire("AT175542E21C400007.backDefaultGroup.tokenCreate4zby");
      let res = func.execute();
      let zbyToken = "";
      for (let i in res) {
        if (res[i].length != undefined) {
          let obj_zbyToken = JSON.parse(res[i]);
          if (obj_zbyToken.hasOwnProperty("access_token")) {
            zbyToken = obj_zbyToken.access_token;
          } else {
            insertLog4ReportSyn(request, title, "失败", "获取智保云token出错" + JSON.stringify(obj_zbyToken));
          }
        }
      }
      return zbyToken;
    }
    //推送表数据
    function pushReportData(zbyToken, submitBody, request, title) {
      let issuccess = "失败";
      let param = {
        submitBody: submitBody,
        zbyToken: zbyToken
      };
      let func = extrequire("AT175542E21C400007.backDefaultGroup.toTrueServer");
      let res = func.execute(param);
      for (let i in res) {
        if (res[i].length != undefined) {
          let obj_zby = JSON.parse(res[i]);
          if (obj_zby.hasOwnProperty("code") && "200" == obj_zby.code) {
            insertLog4ReportSyn(request, title, "成功", "");
            issuccess = "成功";
          } else {
            insertLog4ReportSyn(request, title, "失败", "推送智保云接口出错" + JSON.stringify(obj_zby));
          }
        }
      }
      return issuccess;
    }
    function getZBYDataItems(reportConfigDatas, type, indexItems) {
      let valuemap = new Map();
      let items = new Array();
      for (let j = 0; j < indexItems.length; j++) {
        let rfItemsTwo = indexItems[j];
        let itemcode = undefined == rfItemsTwo.itemCode ? "ERRORCODE" : rfItemsTwo.itemCode;
        let itemvalue = undefined == rfItemsTwo.value ? 0 : rfItemsTwo.value;
        valuemap.set(itemcode, itemvalue);
      }
      if ("lirunbiao" == type) {
        items = makeLirunDatabasketIncome(reportConfigDatas, valuemap);
      } else {
        items = makeZichanfuzhaiData(reportConfigDatas, valuemap);
      }
      return items;
    }
    //组装利润表数据
    function makeLirunDatabasketIncome(basketIncome, valuemap) {
      let items = new Array();
      for (let i = 0; i < basketIncome.length; i++) {
        let basketTwo = basketIncome[i];
        let benqi = basketTwo.benqi;
        let bennianleiji = basketTwo.bennianleiji;
        if (null != valuemap.get(benqi) && null != valuemap.get(bennianleiji)) {
          const obj = {};
          obj.code = basketTwo.incomebianma; // 项目编码
          obj.name = basketTwo.incomexiangmu; // 项目名称
          obj.rowNumber = basketTwo.incomexingci; // 行次
          obj.amountBegin = valuemap.get(benqi); // 本月金额
          obj.amountEnd = valuemap.get(bennianleiji); // 本年累计
          obj.description = ""; // 说明
          items.push(obj);
        }
      }
      return items;
    }
    //组装资产负债表数据
    function makeZichanfuzhaiData(basketBalance, valuemap) {
      let items = new Array();
      for (let i = 0; i < basketBalance.length; i++) {
        let basketTwo = basketBalance[i];
        let beginyear = basketTwo.beginyear;
        let endperiod = basketTwo.endperiod;
        if (null != valuemap.get(beginyear) && null != valuemap.get(endperiod)) {
          const obj = {};
          obj.code = basketTwo.balancebianmahao; // 项目编码
          if (basketTwo.balancezichan != "/") {
            obj.name = basketTwo.balancezichan;
          } else {
            obj.name = basketTwo.balancefuzhaihesuoyouzhequanyi;
          }
          obj.rowNumber = basketTwo.balancexingci; // 行次
          obj.amountBegin = valuemap.get(beginyear); // 期初金额
          obj.amountEnd = valuemap.get(endperiod); // 期末金额
          obj.description = ""; // 说明
          items.push(obj);
        }
      }
      return items;
    }
    //指标数据配置查询
    function getIndexConfigData(request, datapushtype, title) {
      let indexconfigdatas = new Array();
      let param = { kuaijiqijian: request.kjqj, datapushtype: datapushtype };
      let func = extrequire("AT175542E21C400007.backDefaultGroup.indexQuery");
      let res = func.execute(param);
      for (let i in res) {
        if (res[i].length != undefined) {
          let reportForm = JSON.parse(res[i]);
          if (isNotEmpty(reportForm)) {
            if (reportForm.data.hasOwnProperty("data")) {
              insertLog4ReportSyn(request, title, "失败", "调用指标数据查询接口出错" + JSON.stringify(reportForm.data));
            } else {
              if (reportForm.data[0].hasOwnProperty("items")) {
                indexconfigdatas = reportForm.data[0].items;
              } else {
                throw new Error("sheetCode:[" + reportForm.data[0].sheetCode + "]" + reportForm.data[0].errMsg);
              }
            }
          }
        } else {
          throw new Error(JSON.stringify(res));
        }
      }
      return indexconfigdatas;
    }
    //记录报表更新日志
    function insertLog4ReportSyn(request, reporttypename, pushstatus, message) {
      var myDate = request.myDate;
      var log = {};
      log.zhangbumingchen = "";
      log.zuzhi = request.orgCode;
      log.huijiqijian = request.kjqj;
      log.baobiaoleixing = reporttypename;
      log.tuisongzhuangtai = pushstatus;
      log.tuisongshijian = request.time;
      log.caozuorenyuan = JSON.parse(AppContext()).currentUser.name;
      log.message = message;
      let param2 = { log: log };
      let func = extrequire("AT175542E21C400007.backDefaultGroup.insertForLog");
      let res = func.execute(param2);
    }
  }
}
exports({ entryPoint: MyAPIHandler });