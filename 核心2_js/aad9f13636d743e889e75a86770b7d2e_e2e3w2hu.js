let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let AppCode = "ST";
    //回写生产制造单Url
    let putInNumberUrl = "https://www.example.com/";
    //产品入库详情查询URL
    let storeprorecordDetailUrl = "https://www.example.com/";
    //生产订单详情查询
    let productionorderDetailUrl = "https://www.example.com/";
    //产品入库详情查询
    let storeprorecordDetailResponse = JSON.parse(openLinker("GET", storeprorecordDetailUrl + "?id=" + request.id, AppCode, null));
    let productionorderId; //产品入库Id
    let productionorderNumber; //产品入库生产入库数量
    let memo; //备注
    let srcBill; //单据编号
    let vouchdate; //单据日期
    //生产订单详情
    var productionorderDetailResponse;
    var data_v1;
    if (storeprorecordDetailResponse.code == 200) {
      productionorderDetailResponse = JSON.parse(openLinker("GET", productionorderDetailUrl + "?id=" + storeprorecordDetailResponse.data.storeProRecords[0].moid, AppCode, null));
      productionorderId = storeprorecordDetailResponse.data.Id;
      productionorderNumber = storeprorecordDetailResponse.data.totalQuantity;
      memo = storeprorecordDetailResponse.data.memo;
      srcBill = storeprorecordDetailResponse.data.srcBill;
      vouchdate = storeprorecordDetailResponse.data.vouchdate;
      if (productionorderDetailResponse.code == 200) {
        data_v1 = productionorderDetailResponse.data;
      } else {
        return {};
      }
    } else {
      return {};
    }
    //材料出库保存URL
    let materialoutSaveURL = "https://www.example.com/";
    //材料出库保存Body
    let materialoutSaveBody;
    //材料出库保存Data
    let materialoutSaveData = {
      org: data_v1.orgId,
      vouchdate: vouchdate,
      factoryOrg: data_v1.orgId,
      warehouse: data_v1.orderProduct[0].warehouseId,
      bustype: "2322624487216386",
      department: data_v1.productionDepartmentId,
      _status: "Insert",
      materOuts: ""
    };
    //材料出库明细
    let materialoutSaveDetail = new Array();
    for (var i = 0; i < data_v1.orderProduct[0].orderMaterial.length; i++) {
      if (data_v1.orderProduct[0].orderMaterial[i].supplyType != "1") {
        continue;
      }
      let materOuts = {
        product: data_v1.orderProduct[0].orderMaterial[i].productCode,
        productsku: data_v1.orderProduct[0].orderMaterial[i].skuCode,
        qty: Math.ceil(data_v1.orderProduct[0].orderMaterial[i].bomUnitUseQuantity * productionorderNumber * 100) / 100,
        unit: data_v1.orderProduct[0].orderMaterial[i].mainUnit,
        stockUnitId: data_v1.orderProduct[0].orderMaterial[i].stockUnitId,
        invExchRate: data_v1.orderProduct[0].orderMaterial[i].changeRate,
        sourceid: request.id,
        sourceautoid: storeprorecordDetailResponse.data.storeProRecords[0].id,
        _status: "Insert"
      };
      materialoutSaveDetail.push(materOuts);
    }
    materialoutSaveData.materOuts = materialoutSaveDetail;
    materialoutSaveBody = {
      data: materialoutSaveData
    };
    //材料出库单新增
    let materialoutSaveResponse = openLinker("POST", materialoutSaveURL, AppCode, JSON.stringify(materialoutSaveBody));
    //回写生产制造单
    let backNumberBody = {};
    if (memo == "废品入库") {
      //回写生产制造单
      backNumberBody = {
        Id: srcBill,
        Number: productionorderNumber,
        status_code: "1"
      };
    } else {
      //回写生产制造单
      backNumberBody = {
        Id: srcBill,
        Number: productionorderNumber,
        status_code: "2"
      };
    }
    let backNumberResponse = openLinker("POST", putInNumberUrl, AppCode, JSON.stringify(backNumberBody));
    return {
      materialoutSaveResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});