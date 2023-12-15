let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //声明变量
    let productOrderMaterialWarehouseId = "0"; //生产订单材料信息仓库Id
    //获取当前日期
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month > 9 ? month : "0" + month;
    day = day > 9 ? day : "0" + day;
    var vouchdate = date.getFullYear() + "-" + month + "-" + day;
    let AppCode = "ST";
    //产品入库单保存前的参数
    var requestParam = JSON.parse(request.param);
    var product_AssisMain = 1;
    if (requestParam.memo == "废品入库") {
      //物料档案详情查询
      var productListUrl = "https://www.example.com/" + "?id=" + requestParam.storeProRecords[0].product + "&orgId=1736590062580662273";
      var product_Assis = JSON.parse(openLinker("GET", productListUrl, AppCode, null));
      if (product_Assis.data.productAssistUnitExchanges != undefined && product_Assis.data.productAssistUnitExchanges != null) {
        if (requestParam.memo == "废品入库") {
          //辅计量
          product_AssisMain = product_Assis.data.productAssistUnitExchanges[0].assistUnitCount;
        } else {
          //辅计量
          product_AssisMain = product_Assis.data.productAssistUnitExchanges[0].mainUnitCount;
        }
      }
    }
    //回写生产制造单Url
    let putInNumberUrl = "https://www.example.com/";
    //获取生产制造单
    let getManufacturingUrl = `https://c2.yonyoucloud.com/iuap-api-gateway/e2e3w2hu/commonProductCls/commonProduct/getObject`;
    let manufacturingRequest = {
      srcBillNO: requestParam.srcBillNO
    };
    let manufacturingResponseStr = openLinker("POST", getManufacturingUrl, "AT17AA2EFA09C00009", JSON.stringify(manufacturingRequest));
    let manufacturingResponse = JSON.parse(manufacturingResponseStr);
    if (manufacturingResponse.response.length > 0) {
      let manufacturingTypeName = manufacturingResponse.response[0].type_name;
      if (manufacturingTypeName === "SCZZD") {
        //生产订单详情查询
        let productionorderDetailUrl = "https://www.example.com/";
        let productionorderNumber; //产品入库生产入库数量
        let memo; //备注
        let srcBill; //单据编号
        var data_v1;
        //生产订单详情
        let productionorderDetailResponseStr = openLinker("GET", productionorderDetailUrl + "?id=" + requestParam.storeProRecords[0].moid, AppCode, null);
        var productionorderDetailResponse = JSON.parse(productionorderDetailResponseStr);
        if (productionorderDetailResponse.code == 200) {
          data_v1 = productionorderDetailResponse.data;
          productOrderMaterialWarehouseId = data_v1.orderProduct[0].orderMaterial[0].warehouseId;
        } else {
          return {};
        }
        memo = requestParam.memo;
        productionorderNumber = requestParam.totalQuantity;
        srcBill = requestParam.srcBill;
        //材料出库保存URL
        let materialoutSaveURL = "https://www.example.com/";
        //材料出库保存Body
        let materialoutSaveBody;
        //材料出库保存Data
        let materialoutSaveData = {
          org: data_v1.orgId,
          vouchdate: vouchdate,
          factoryOrg: data_v1.orgId,
          warehouse: productOrderMaterialWarehouseId,
          bustype: "2322624487216386",
          department: data_v1.productionDepartmentId,
          srcBillType: "",
          srcBillNO: requestParam.srcBillNO,
          srcBill: requestParam.srcBill,
          headItem: {
            define1: requestParam.memo == "生产入库" ? "1" : "3" //产品入库单Id
          },
          _status: "Insert",
          materOuts: ""
        };
        let iWaste_Qty = 0;
        for (let j = 0; j < requestParam.storeProRecords.length; j++) {
          if (requestParam.storeProRecords[j].product_cCode == data_v1.orderProduct[0].productCode) {
            iWaste_Qty += parseInt(requestParam.storeProRecords[j].qty);
          }
        }
        //材料出库明细
        let materialoutSaveDetail = new Array();
        for (var i = 0; i < data_v1.orderProduct[0].orderMaterial.length; i++) {
          //如果材料是入库倒冲
          if (data_v1.orderProduct[0].orderMaterial[i].supplyType != "1") {
            continue;
          }
          let calcQty = Math.ceil(data_v1.orderProduct[0].orderMaterial[i].bomUnitUseQuantity * productionorderNumber * product_AssisMain * 100) / 100;
          if (requestParam.memo == "废品入库") {
            calcQty = Math.ceil(iWaste_Qty * data_v1.orderProduct[0].orderMaterial[i].bomUnitUseQuantity);
          }
          let materOuts = {
            product: data_v1.orderProduct[0].orderMaterial[i].productCode,
            productsku: data_v1.orderProduct[0].orderMaterial[i].skuCode,
            qty: calcQty,
            unit: data_v1.orderProduct[0].orderMaterial[i].mainUnit,
            stockUnitId: data_v1.orderProduct[0].orderMaterial[i].stockUnitId,
            invExchRate: data_v1.orderProduct[0].orderMaterial[i].changeRate,
            source: "st_storeprorecord",
            sourcecode: requestParam.code,
            upcode: requestParam.storeProRecords[0].upcode, //来源单据号
            firstsource: "po_order", //来源订单类型
            firstupcode: requestParam.storeProRecords[0].mocode, //来源订单号
            sourceid: requestParam.srcBill,
            sourceautoid: requestParam.storeProRecords[0].sourceautoid,
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
        let saveResponse = JSON.parse(materialoutSaveResponse);
        if (saveResponse.data.failCount > 0) {
          throw new Error(JSON.stringify(saveResponse.data.messages));
        }
        //回写生产制造单
        let backNumberBody = {};
        if (memo == "废品入库") {
          //回写生产制造单
          backNumberBody = {
            Id: srcBill,
            Number: productionorderNumber,
            status_code: "1",
            waste_quantity: requestParam.waste_quantity,
            summary_length: requestParam.summary_length
          };
        } else {
          //回写生产制造单
          backNumberBody = {
            Id: srcBill,
            Number: productionorderNumber,
            waste_quantity: requestParam.waste_quantity,
            summary_length: requestParam.summary_length,
            status_code: "2"
          };
        }
        let backNumberResponse = openLinker("POST", putInNumberUrl, AppCode, JSON.stringify(backNumberBody));
        let res1 = "ok";
        return {
          res1
        };
      }
    }
    return {};
  }
}
exports({
  entryPoint: MyAPIHandler
});