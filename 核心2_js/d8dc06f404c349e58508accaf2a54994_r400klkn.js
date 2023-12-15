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
      if (proIdList.length == 1) {
        if (typeof proIdList[i] == "undefined") {
          proIdList.splice(i, 1);
          i--;
        }
      } else if (proIdList.length > 1) {
        for (let j = i + 1; j < proIdList.length; j++) {
          if (proIdList[i] == proIdList[j]) {
            proIdList.splice(j, 1);
            j--;
          }
        }
      }
    }
    for (let i = 0; i < batchNoList.length; i++) {
      if (batchNoList.length == 0) {
        if (batchNoList[i] == undefined) {
          batchNoList.splice(i, 1);
          i--;
        }
      } else if (batchNoList.length > 1) {
        for (let j = i + 1; j < batchNoList.length; j++) {
          if (batchNoList[i] == batchNoList[j] || typeof batchNoList[j] == "undefined") {
            batchNoList.splice(j, 1);
            j--;
          }
        }
      }
    }
    //查询原厂物料档案
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
    //查询医药物料档案
    let apiResponseProductSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " + orgId;
    let apiResponseProduct = ObjectStore.queryByYonQL(apiResponseProductSql);
    //循环查询批次号接口
    let recordList = [];
    for (let i = 0; i < proIdList.length; i++) {
      for (let j = 0; j < batchNoList.length; j++) {
        let batchNoUrl = apiPreAndAppCode.apiPrefix + "/yonbip/scm/batchno/report/list";
        let Body = {
          product: proIdList[i],
          batchno: batchNoList[j],
          pageIndex: "1",
          pageSize: "100"
        };
        let apiResponseBatch = openLinker("POST", batchNoUrl, apiPreAndAppCode.appCode, JSON.stringify(Body));
        apiResponseBatch = JSON.parse(apiResponseBatch);
        let batchInfoList = apiResponseBatch.data.recordList[0];
        if (proIdList[i] == batchInfoList.product && batchNoList[j] == batchInfoList.batchno) {
          recordList.push(batchInfoList);
        }
      }
    }
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
                if (apiResponseProduct.length > 0) {
                  for (let k = i + 1; k < proList.length; k++) {
                    for (let l = 0; l < apiResponseProduct.length; l++) {
                      if (
                        apiResponseProduct[l].material == proList[k].id &&
                        merchantQtyInfo[i].product == proList[k].id &&
                        recordList[j].batchno == merchantQtyInfo[i].batchno &&
                        recordList[j].product == proList[k].id &&
                        apiResponseProduct[l].curingTypeName == "一般养护"
                      ) {
                        apiResponseProduct[l].batchNo = recordList[i].batchno;
                        apiResponseProduct[l].currentqty = merchantQtyInfo[i].currentqty;
                        apiResponseProduct[l].expireDateNo = recordList[j].expireDateNo;
                        apiResponseProduct[l].expireDateUnit = recordList[j].expireDateUnit;
                        apiResponseProduct[l].producedate = recordList[j].producedate;
                        apiResponseProduct[l].invaliddate = recordList[j].invaliddate;
                        apiResponseProduct[l].unit = proList[k].unit;
                        apiResponseProduct[l].unit_Name = proList[k].unit_Name;
                        apiResponseProduct[l].materialName = proList[k].name.zh_CN;
                        console.log("apiResponseProduct[l]>>>>>:" + apiResponseProduct[l]);
                        goodsArr.push(apiResponseProduct[l]);
                      }
                    }
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
            if (goodsArr[k].material == mainCurRes[l].product_code && goodsArr[k].batchNo == mainCurRes[l].lot_number) {
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