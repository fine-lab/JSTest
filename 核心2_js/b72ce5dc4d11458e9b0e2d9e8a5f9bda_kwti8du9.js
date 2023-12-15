let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let dateParam = new Object();
    let pubts = param.pubts;
    var skuList = new Array();
    let funcSkuRecordNew = extrequire("GZTBDM.essentialData.getSkuRecordNew");
    if (pubts != undefined && pubts != null && pubts.length > 0) {
      dateParam.beginTime = pubts + " 00:00:00";
      dateParam.endTime = pubts + " 23:59:59";
    } else {
      dateParam.beginTime = getYesterday().beginTime;
      dateParam.endTime = getYesterday().endTime;
    }
    let wlCodeList = new Array();
    let wlIdList = new Array();
    let idList = new Array();
    if (param.code != undefined && param.code.length > 0) {
      wlCodeList.push(param.code);
    } else {
      wlIdList = funcSkuRecordNew.execute(null, dateParam).res;
      for (var i = 0; i < wlIdList.length; i++) {
        idList.push(wlIdList[i].productId);
      }
    }
    let queryParam = new Object();
    let queryParamList = new Array();
    if (wlCodeList.length > 0) {
      queryParam = {
        data: {
          code: wlCodeList
        }
      };
    }
    if (wlIdList.length > 0) {
      queryParamList = group(idList, 10);
    }
    let url = URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/product/batch";
    let header = {
      "Content-Type": "application/json"
    };
    //物料编码
    if (wlCodeList.length > 0) {
      var strResponse = openLinker("POST", url, "GZTBDM", JSON.stringify(queryParam));
      var responseJson = JSON.parse(strResponse);
      var data = responseJson.data;
      var recordList = data.recordList;
      if (data.endPageIndex <= queryParam.pageIndex) {
        isNext = false;
      } else {
        queryParam.pageIndex = queryParam.pageIndex + 1;
      }
      if (recordList.length > 0) {
        for (let i = 0; i < recordList.length; i++) {
          let record = recordList[i];
          if (record.pc_productlist_userDefine007 != undefined && record.pc_productlist_userDefine007 != record.code) {
            skuList.push(record);
          }
        }
      }
    }
    if (queryParamList.length > 0) {
      for (var i = 0; i < queryParamList.length; i++) {
        queryParam = {
          data: {
            id: queryParamList[i]
          }
        };
        var strResponse = openLinker("POST", url, "GZTBDM", JSON.stringify(queryParam));
        var responseJson = JSON.parse(strResponse);
        var data = responseJson.data;
        var recordList = data.recordList;
        if (recordList.length > 0) {
          for (let i = 0; i < recordList.length; i++) {
            let record = recordList[i];
            if (record.pc_productlist_userDefine007 != undefined && record.pc_productlist_userDefine007 != record.code) {
              skuList.push(record);
            }
          }
        }
      }
    }
    return { skuList };
  }
}
function getYesterday() {
  var dateTime = new Object();
  var today = new Date();
  var yesterday = new Date(today.setTime(today.getTime() - 24 * 60 * 60 * 1000));
  var y = yesterday.getFullYear();
  var m = yesterday.getMonth() + 1;
  var d = yesterday.getDate();
  var s = y + "-" + add0(m) + "-" + add0(d) + " 00:00:00"; //开始
  var e = y + "-" + add0(m) + "-" + add0(d) + " 23:59:59"; //结束
  dateTime.beginTime = s;
  dateTime.endTime = e;
  return dateTime;
}
function add0(m) {
  return m < 10 ? "0" + m : m;
}
function group(array, subNum) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subNum)));
  }
  return newArray;
}
exports({ entryPoint: MyTrigger });