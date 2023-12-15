let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用公共函数--------------begin
    let func1 = extrequire("AT17AA2EFA09C00009.backDesignerFunction.getTokenApi");
    let res = func1.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var AppCode = "ST";
    var root_url = "https://www.example.com/";
    var finishedreport_save = `${root_url}/yonbip/mfg/finishedreport/new/save`;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    //添加参数
    var finishedreport_save_body = {
      data: {
        resubmitCheckKey: substring(uuid(), 0, 32),
        creatorId: "yourIdHere",
        creator: "赵铭哲",
        createTime: "2023-11-06 17:24:17",
        orgId: "yourIdHere",
        orgName: "日丰南非有限公司",
        orgCode: "1410",
        transTypeId: "yourIdHere",
        transTypeName: "完工报告",
        transTypeCode: "RF001",
        autoGenBatchNo: false,
        vouchdate: "2023-11-06 00:00:00",
        code: "WGBG20231106000003",
        productionDepartmentId: "yourIdHere",
        departmentName: "采购部",
        status: 0,
        createDate: "2023-11-06 17:24:17",
        isGenerateBarcode: false,
        isWfControlled: false,
        isSnManage: false,
        autoInspection: false,
        verifystate: 0,
        returncount: 0,
        autoPush: 0,
        isCard: 0,
        offChartReceipt: 0,
        finishedReportDetail: [
          {
            inspection: false,
            stockByInspection: false,
            sourceType: "1",
            hasDefaultInit: true,
            auxiliaryQuantity: 1000,
            productionUnitPrecision: 2,
            productionType: "0",
            mainUnitTruncationType: 4,
            orgId: "yourIdHere",
            orgCode: "1410",
            productionUnitTruncationType: 4,
            skuName: "搭接焊铝塑管C-1620-不定长-土黄/无(SAF01)",
            lineNo: 10,
            isBatchManage: false,
            isExpiryDateManage: false,
            mainUnitPrecision: 2,
            product_Name: "搭接焊铝塑管C-1620-不定长-土黄/无(SAF01)",
            product_Name2: "搭接焊铝塑管C-1620-不定长-土黄/无(SAF01)",
            changeRate: 1,
            isSerialNoManage: 0,
            skuId: "yourIdHere",
            mainUnit: 2333808074772736,
            bomId: "yourIdHere",
            quantity: 1000,
            orgName: "日丰南非有限公司",
            qualifiedQuantity: 1000,
            productId: "yourIdHere",
            changeType: "0",
            materialCode: "2100028784",
            qualifiedAuxiliaryQuantity: 1000,
            materialId: "yourIdHere",
            businessAttribute: "1,7,3",
            productionUnitId: 2333808074772736,
            productionUnitName: "米",
            bomVersion: "1.00",
            mainUnitName: "米",
            materialName: "搭接焊铝塑管C-1620-不定长-土黄/无(SAF01)",
            finishedReportId: "yourIdHere",
            finishDate: "2023-11-06 15:22:50",
            skuCode: "2100028784",
            product_Code: "2100028784",
            finishedReportSn: null,
            _id: "youridHere",
            _status: "Insert"
          }
        ],
        _status: "Insert"
      }
    };
    let requestUrl = finishedreport_save.concat("?access_token=" + token);
    let apiResponse = postman("post", finishedreport_save.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(finishedreport_save_body));
    throw new Error(JSON.stringify(apiResponse));
    var storeprorecord_mergesourcedata_save = `${root_url}/yonbip/scm/storeprorecord/mergeSourceData/save`;
    var storeprorecord_mergesourcedata_save_body = {
      data: {
        resubmitCheckKey: substring(uuid(), 0, 32),
        mergeSourceData: true,
        vouchdate: "2023-11-07",
        bustype: "",
        warehouse: "1682935527240105991",
        _status: "Insert",
        storeProRecords: {
          makeRuleCode: "poFinishedReportToStoreprorecordQualifiedReceive",
          sourceid: "youridHere",
          sourceautoid: "youridHere",
          sourceGrandchildrenId: "",
          _status: "Insert"
        }
      }
    };
    var storeprorecord_mergesourcedata_save_result = JSON.parse(openLinker("POST", storeprorecord_mergesourcedata_save, "ST", JSON.stringify(storeprorecord_mergesourcedata_save_body)));
    throw new Error(JSON.stringify(storeprorecord_mergesourcedata_save_result));
    var morphologyconversion_save = `${root_url}/yonbip/scm/morphologyconversion/save`;
    var morphologyconversion_save_body = {
      data: {
        org: "",
        businesstypeId: "",
        conversionType: 1,
        mcType: 1,
        vouchdate: "2023-11-06",
        morphologyconversiondetail: [
          {
            groupNumber: "1",
            lineType: "1",
            warehouse: "",
            product: "1702160591130984579",
            mainUnitId: "yourIdHere",
            stockUnitId: "yourIdHere",
            invExchRate: "",
            qty: 1,
            subQty: 1
          }
        ],
        _status: "Insert"
      }
    };
    var morphologyconversion_save_result = JSON.parse(openLinker("POST", morphologyconversion_save, "ST", JSON.stringify(morphologyconversion_save_body)));
    var returnMsg = "操作成功";
    return { returnMsg };
  }
}
exports({ entryPoint: MyAPIHandler });