let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let num = "";
    for (let i = 0; i < 6; i++) {
      let radom = Math.floor(Math.random() * 10);
      num += radom;
    }
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let goodsArr = [];
    let curPdoArr = [];
    //现存量查询
    let menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
    let menchantQueryBody = { org: orgId };
    let apiQtyResponse = openLinker("POST", menchantQueryUrl, apiPreAndAppCode.appCode, JSON.stringify(menchantQueryBody));
    apiQtyResponse = JSON.parse(apiQtyResponse);
    let merchantQtyInfo = apiQtyResponse.data;
    let batchNoList = [];
    //查询重点养护确认单
    let proIdList = [];
    let mainCurRes = [];
    if (typeof merchantQtyInfo != "undefined" && merchantQtyInfo != null) {
      for (let batch = 0; batch < merchantQtyInfo.length; batch++) {
        let batchNo = merchantQtyInfo[batch].batchno;
        if (batchNo !== null && typeof batchNo != "undefined") {
          let materialId = merchantQtyInfo[batch].product;
          let mainCurSql = "select * from GT22176AT10.GT22176AT10.SY01_mainproco_son where product_code='" + materialId + "' and lot_number='" + batchNo + "'";
          mainCurRes = ObjectStore.queryByYonQL(mainCurSql);
          if (typeof mainCurRes != "undefined" && mainCurRes != null) {
            let count = mainCurRes.length;
            if (count < 1) {
              proIdList.push(materialId);
              batchNoList.push(batchNo);
            } else if (count > 0) {
              for (let i = 0; i < mainCurRes.length; i++) {
                let billDate = mainCurRes[i].bill_date;
                let date = new Date(billDate);
                let nowDate = new Date();
                let difValue = Math.floor((nowDate - date) / (1000 * 60 * 60 * 24));
                if (difValue >= 30) {
                  proIdList.push(materialId);
                  batchNoList.push(batchNo);
                }
              }
            }
          }
        }
      }
    }
    for (let i = 0; i < proIdList.length; i++) {
      if (i == 0) {
        if (typeof proIdList[i] == "undefined") {
          proIdList.splice(i, 1);
          i--;
        }
      } else if (i > 0) {
        for (let j = i + 1; j < proIdList.length; j++) {
          if (proIdList[i] == proIdList[j]) {
            proIdList.splice(j, 1);
            j--;
          }
        }
      }
    }
    for (let i = 0; i < batchNoList.length; i++) {
      if (i == 0) {
        if (batchNoList[i] == undefined) {
          batchNoList.splice(i, 1);
          i--;
        }
      } else if (i > 0) {
        for (let j = i + 1; j < batchNoList.length; j++) {
          if (batchNoList[i] == batchNoList[j] || typeof batchNoList[j] == "undefined") {
            batchNoList.splice(j, 1);
            j--;
          }
        }
      }
    }
    batchNoList = JSON.stringify(batchNoList).replace(/'/g, '"');
    let menchantQueryPageUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/product/list";
    let bodyPage = {
      pageIndex: "1",
      pageSize: "100"
    };
    let materialProList = openLinker("POST", menchantQueryPageUrl, apiPreAndAppCode.appCode, JSON.stringify(bodyPage));
    materialProList = JSON.parse(materialProList);
    let proList = [];
    if (typeof materialProList != "undefined") {
      proList = materialProList.data.recordList;
    }
    let batchNoUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/batchno/report/list";
    let Body = {
      condition: {
        simpleVOs: [
          {
            conditions: [
              {
                op: "in",
                field: "batchno",
                value1: batchNoList
              },
              {
                op: "in",
                field: "product",
                value1: proIdList
              }
            ]
          }
        ]
      },
      pageIndex: "1",
      pageSize: "100"
    };
    let apiResponseBatch = openLinker("POST", batchNoUrl, apiPreAndAppCode.appCode, JSON.stringify(Body));
    apiResponseBatch = JSON.parse(apiResponseBatch);
    let recordList = apiResponseBatch.data.recordList;
    let test = { code: num, merchantQtyInfo: JSON.stringify(merchantQtyInfo), batchInfo: JSON.stringify(recordList), proList: JSON.stringify(materialProList) };
    let testRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_near_pro_cur_log", test, "SY01_near_pro_cur_log");
    if (typeof merchantQtyInfo != "undefined" && typeof recordList != "undefined" && merchantQtyInfo != null && recordList != null) {
      for (let i = 0; i < merchantQtyInfo.length; i++) {
        for (let j = 0; j < recordList.length; j++) {
          if (merchantQtyInfo[i].product == recordList[j].product && merchantQtyInfo[i].batchno == recordList[j].batchno) {
            if (typeof recordList[j].invaliddate != "undefined") {
              let endDate = recordList[j].invaliddate;
              let date = new Date(endDate);
              let nowDate = new Date();
              let difValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
              if (typeof proList != "undefined" && proList != null && typeof endDate != "undefined" && difValue >= 30) {
                for (let k = i + 1; k < proList.length; k++) {
                  if (
                    merchantQtyInfo[i].product == proList[k].id &&
                    recordList[j].batchno == merchantQtyInfo[i].batchno &&
                    recordList[j].product == proList[k].id &&
                    proList[k].extend_yhlb_curingTypeName == "一般养护"
                  ) {
                    proList[k].batchNo = recordList[i].batchno;
                    proList[k].currentqty = merchantQtyInfo[i].currentqty;
                    proList[k].expireDateNo = recordList[j].expireDateNo;
                    proList[k].expireDateUnit = recordList[j].expireDateUnit;
                    proList[k].producedate = recordList[j].producedate;
                    proList[k].invaliddate = recordList[j].invaliddate;
                    console.log("proList[k]>>>>>:" + proList[k]);
                    goodsArr.push(proList[k]);
                  }
                }
              }
            }
          }
        }
      }
    }
    if (typeof mainCurRes != "undefined" && mainCurRes != null) {
      if (mainCurRes.length > 0) {
        for (let l = 0; l < mainCurRes.length; l++) {
          for (let k = 0; k < goodsArr.length; k++) {
            if (goodsArr[k].id == mainCurRes[l].product_code && goodsArr[k].batchNo == mainCurRes[l].lot_number) {
              goodsArr.splice(k, 1);
              k--;
            }
          }
        }
      }
    }
    if (goodsArr.length < 1 || goodsArr == null) {
      return { goodsArr: [] };
    } else {
      return { goodsArr: goodsArr };
    }
  }
}
exports({ entryPoint: MyAPIHandler });