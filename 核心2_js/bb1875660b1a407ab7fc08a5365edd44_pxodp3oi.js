let AbstractTrigger = require("AbstractTrigger");
const getU8Domain = (keyParams) => {
  let U8DOMAIN = "https://www.example.com/";
  return U8DOMAIN + keyParams;
};
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let LogToDB = true;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let funcRes = extrequire("AT1703B12408A00002.selfServ.getAccessToken").execute(null);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 99, description: "调用接口获取AccessToken", reqt: "", resp: JSON.stringify(funcRes) })); //调用领域内函数写日志
    let accessToken = null;
    if (funcRes.rst) {
      accessToken = funcRes.accessToken;
    }
    if (accessToken == null || accessToken == "") {
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "AccessToken为空异常-无法对接U8", reqt: "", resp: "" })); //调用领域内函数写日志
      return;
    }
    funcRes.urlKey = "yourKeyHere"; //yourKeyHere//api_url_orderstatus_get
    let url = extrequire("AT1703B12408A00002.selfServ.getUrlParams").execute(null, funcRes);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "URL", reqt: url, resp: "" })); //调用领域内函数写日志
    let commUrl = "";
    let commResp = "";
    //科目表查询
    let subjectChartUrl = DOMAIN + "/yonbip/fi/fipub/accsubjectchart/getSubjectChart";
    let subjectChartApiResp = openLinker("POST", subjectChartUrl, "AT1703B12408A00002", null);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "科目表查询", reqt: subjectChartUrl, resp: subjectChartApiResp }));
    let baseDataType = "科目查询";
    baseDataType = "成本中心";
    commUrl = DOMAIN + "/yonbip/AMP/bd/v1/costcenter/getCostCenterInnerByCondition";
    commResp = openLinker("POST", commUrl, "AT1703B12408A00002", JSON.stringify([{}]));
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: JSON.stringify(commResp) }));
    //业务伙伴--无
    //利润中心--无
    //业务活动类型--无
    baseDataType = "银行类别";
    commUrl = DOMAIN + "/yonbip/digitalModel/basedocbank/list";
    commResp = openLinker("POST", commUrl, "AT1703B12408A00002", JSON.stringify({ pageIndex: 1, pageSize: 200 }));
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: JSON.stringify(commResp) }));
    baseDataType = "银行账户";
    commUrl = DOMAIN + "/yonbip/digitalModel/enterprisebank/list";
    commResp = openLinker("POST", commUrl, "AT1703B12408A00002", JSON.stringify({ pageIndex: 1, pageSize: 200 }));
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: JSON.stringify(commResp) }));
    baseDataType = "自定义档案-财务PI号";
    commUrl = DOMAIN + "/yonbip/digitalModel/customerdoc/list";
    commResp = openLinker("POST", commUrl, "AT1703B12408A00002", JSON.stringify({ custdocdefcode: "9999", pageIndex: 1, pageSize: 100 })); //财务PI在自定义档案中的编码9999
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: JSON.stringify(commResp) }));
    let subjMap = new Map();
    subjMap.set("0001", { code: "0001", name: "部门", id: "youridHere" });
    subjMap.set("0002", { code: "0002", name: "项目", id: "youridHere" });
    subjMap.set("0003", { code: "0003", name: "人员", id: "youridHere" });
    subjMap.set("0004", { code: "0004", name: "供应商", id: "youridHere" });
    subjMap.set("0005", { code: "0005", name: "客户", id: "youridHere" });
    subjMap.set("0006", { code: "0006", name: "物料", id: "youridHere" });
    subjMap.set("0007", { code: "0007", name: "物料分类", id: "youridHere" });
    subjMap.set("0008", { code: "0008", name: "成本中心", id: "youridHere" });
    subjMap.set("0009", { code: "0009", name: "业务伙伴", id: "youridHere" });
    subjMap.set("0010", { code: "0010", name: "利润中心", id: "youridHere" });
    subjMap.set("0011", { code: "0011", name: "业务活动类型", id: "youridHere" });
    subjMap.set("0012", { code: "0012", name: "银行账户", id: "youridHere" });
    subjMap.set("0013", { code: "0013", name: "类别", id: "youridHere" });
    subjMap.set("0014", { code: "0014", name: "财务PI", id: "youridHere" });
    subjMap.set("0015", { code: "0015", name: "币种", id: "youridHere" });
    baseDataType = "币种";
    commUrl = DOMAIN + "/yonbip/digitalModel/currency/list";
    commResp = openLinker("POST", commUrl, "AT1703B12408A00002", JSON.stringify({ pageIndex: 1, pageSize: 100 }));
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: commResp }));
    let commRespObj = JSON.parse(commResp);
    let recordsList = commRespObj.data.recordList;
    let currencyObjs = [];
    let syncTime = getNowDate();
    let currencyRst = ObjectStore.queryByYonQL("select * from AT1703B12408A00002.AT1703B12408A00002.currency", "developplatform");
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "查询币种", reqt: "", resp: JSON.stringify(currencyRst) }));
    if (currencyRst != null && currencyRst.length == 0) {
      for (var idx in recordsList) {
        let recordObj = recordsList[idx];
        currencyObjs.push({
          baseC_id: recordObj.id,
          baseC_name: recordObj.name,
          baseC_code: recordObj.code,
          baseC_enable: recordObj.enable,
          currTypeSign: recordObj.currTypeSign,
          priceDigit: recordObj.priceDigit,
          moneyDigit: recordObj.moneyDigit,
          syncTime: syncTime,
          u8Sync: false,
          u8des: "初始化，尚未同步"
        });
      }
      ObjectStore.insertBatch("AT1703B12408A00002.AT1703B12408A00002.currency", currencyObjs, "ybf54db917");
    } else {
      for (var idx in recordsList) {
        let recordObj = recordsList[idx];
        let isExisted = false;
        for (var i in currencyRst) {
          let currencyRstObj = currencyRst[i];
          if (currencyRstObj.baseC_id == recordObj.id) {
            isExisted = true;
            if (
              currencyRstObj.baseC_name != recordObj.name ||
              currencyRstObj.baseC_code != recordObj.code ||
              currencyRstObj.baseC_enable != recordObj.enable ||
              currencyRstObj.currTypeSign != recordObj.currTypeSign ||
              currencyRstObj.priceDigit != recordObj.priceDigit ||
              currencyRstObj.moneyDigit != recordObj.moneyDigit
            ) {
              ObjectStore.updateById(
                "AT1703B12408A00002.AT1703B12408A00002.currency",
                {
                  id: currencyRstObj.id,
                  baseC_name: recordObj.name,
                  baseC_code: recordObj.code,
                  baseC_enable: recordObj.enable,
                  currTypeSign: recordObj.currTypeSign,
                  priceDigit: recordObj.priceDigit,
                  moneyDigit: recordObj.moneyDigit,
                  syncTime: syncTime,
                  u8Sync: false,
                  u8des: "数据变更" + syncTime
                },
                "ybf54db917"
              );
            }
          }
        }
        if (!isExisted) {
          ObjectStore.insert(
            "AT1703B12408A00002.AT1703B12408A00002.currency",
            {
              baseC_id: recordObj.id,
              baseC_name: recordObj.name,
              baseC_code: recordObj.code,
              baseC_enable: recordObj.enable,
              currTypeSign: recordObj.currTypeSign,
              priceDigit: recordObj.priceDigit,
              moneyDigit: recordObj.moneyDigit,
              syncTime: syncTime,
              u8Sync: false,
              u8des: "初始化，尚未同步"
            },
            "ybf54db917"
          );
        }
      }
    }
    let u8Domain = getU8Domain("currency/batch_get");
    baseDataType = "U8币种"; //U8没有增加接口-只能两边手工维护
    commUrl = u8Domain + "?from_account=" + funcRes.from_account + "&to_account=" + funcRes.to_account + "&app_key=" + funcRes.app_key + "&token=" + funcRes.accessToken;
    commResp = postman("get", commUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({}));
    let rstObj = JSON.parse(commResp);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: commResp }));
    currencyRst = ObjectStore.queryByYonQL("select * from AT1703B12408A00002.AT1703B12408A00002.currency", "developplatform");
    let u8cList = rstObj.currency;
    for (var i in u8cList) {
      let u8cObj = u8cList[i];
      let cexch_code = u8cObj.cexch_code;
      if (cexch_code == "RMB") {
        cexch_code = "CNY";
      }
      for (var j in currencyRst) {
        let currencyRstObj = currencyRst[j];
        if (currencyRstObj.baseC_code == cexch_code) {
          ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.currency", { id: currencyRstObj.id, syncTime: syncTime, u8Sync: true, u8des: "U8数据已同步" }, "ybf54db917");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });