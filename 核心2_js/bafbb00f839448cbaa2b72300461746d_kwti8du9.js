let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let XSCKID = request.ID;
    var productData = {};
    var ArrayList = new Array();
    var SunList = {};
    let warehouseCode = {};
    var ArrList = new Array();
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 销售出库详情查询
    let apiResponse1 = postman("get", "https://www.example.com/" + token + "&id=" + XSCKID, JSON.stringify(headers), null);
    let XSCKapi = JSON.parse(apiResponse1);
    if (XSCKapi.code == 200) {
      var Data = XSCKapi.data;
      // 获取仓库id
      let warehouse = Data.warehouse;
      let saleoutcode = Data.code;
      // 查询仓库
      let CKSql = "select code from 	aa.warehouse.Warehouse where id = '" + warehouse + "'";
      let CKRes = ObjectStore.queryByYonQL(CKSql, "productcenter");
      var warehouse_Code = CKRes[0].code;
      let warehouse_name = Data.warehouse_name;
      // 判断仓库
      if (
        warehouse_Code != "YA01" &&
        warehouse_Code != "KD03" &&
        warehouse_Code != "KD04" &&
        warehouse_Code != "KD05" &&
        warehouse_Code != "KD06" &&
        warehouse_Code != "KD07" &&
        warehouse_Code != "KD08" &&
        warehouse_Code != "KD40" &&
        warehouse_Code != "KD50" &&
        warehouse_Code != "YA02" &&
        warehouse_Code != "YA03" &&
        warehouse_Code != "YA04" &&
        warehouse_Code != "YA05" &&
        warehouse_Code != "YA06" &&
        warehouse_Code != "YA07" &&
        warehouse_Code != "YA08" &&
        warehouse_Code != "YA09" &&
        warehouse_Code != "YA10" &&
        warehouse_Code != "YASDBCP" &&
        warehouse_Code != "YASDBCPBF" &&
        warehouse_Code != "KD05" &&
        warehouse_Code != "YASDBCPBHG" &&
        warehouse_Code != "YASDBCPGK" &&
        warehouse_Code != "YASDCP" &&
        warehouse_Code != "YASDCPBF" &&
        warehouse_Code != "YASDCPBHG" &&
        warehouse_Code != "YASDCPGK" &&
        warehouse_Code != "YAZKBCP" &&
        warehouse_Code != "YAZKBCPBF" &&
        warehouse_Code != "YAZKBCPBHG" &&
        warehouse_Code != "YAZKBCPGK" &&
        warehouse_Code != "YAZKCP" &&
        warehouse_Code != "YAZKCPBF" &&
        warehouse_Code != "YAZKCPBHG" &&
        warehouse_Code != "YAZKCPGK" &&
        warehouse_Code != "SZC-BHG" &&
        warehouse_Code != "SZC"
      ) {
        // 单据日期
        var vouchdate = Data.vouchdate;
        // 库存组织
        var invoiceOrg = Data.invoiceOrg;
        // 子表集合
        var details = Data.details;
        // 快递公司id
        var iLogisticId = Data.iLogisticId;
        let wlsql = "select corp_code from 	aa.deliverycorp.Deliverycorp where id = '" + iLogisticId + "'";
        let wlres = ObjectStore.queryByYonQL(wlsql, "productcenter");
        let iLogisticId_code = capitalizeEveryWord(wlres[0].corp_code);
        let iLogisticId_name = Data.iLogisticId_name;
        let cLogisticsBillNo = Data.cLogisticsBillNo;
        // 电商交易编号
        var OMSNo = Data["headDefine!define7"];
        // 订单查询
        var partDDParam = { headselectfields: "id", pageIndex: 1, pageSize: 10, bodyselectfields: "oid", tid: OMSNo, warehouseControl: false };
        let DDQuery = { partParam: partDDParam };
        // 交易原单查询
        let URL = "https://www.example.com/";
        let APIResponses = openLinker("POST", URL, "ST", JSON.stringify(DDQuery));
        let DDpopl = JSON.parse(APIResponses);
        let DDinfo = DDpopl.data.info;
        let DDID = DDinfo[0].id;
        var partParam = { tid: OMSNo, pageIndex: 1, pageSize: 10, headselectfields: "tid,id", bodyselectfields: "oid,productID" };
        let JYYDQuery = { partParam: partParam };
        // 交易原单查询
        let urls = "https://www.example.com/";
        let APIResponse = openLinker("POST", urls, "SDOC", JSON.stringify(JYYDQuery));
        let popl = JSON.parse(APIResponse);
        let info = popl.data.info;
        if (info.length > 0) {
          for (let j = 0; j < info.length; j++) {
            let orderId = info[j].id;
            // 发货明细查询
            let OrderSql = "select iquantity from ec.ec_tradeorder.ECShipDetail where parentid = '" + DDID + "'";
            var OrderRes = ObjectStore.queryByYonQL(OrderSql, "dst");
            var OrderQty = OrderRes[0].iquantity;
            let orderVouchDetail = info[j].orderVouchDetail;
            if (orderVouchDetail.length > 0) {
              for (let t = 0; t < orderVouchDetail.length; t++) {
                let oid = orderVouchDetail[t].oid;
                let Tproduct = orderVouchDetail[t].productID;
                var logisticsInfoData = {
                  deliveryMode: "2C",
                  logisticsCode: iLogisticId_code,
                  logisticsName: iLogisticId_name,
                  driverName: iLogisticId_name,
                  shippingCode: [cLogisticsBillNo]
                };
                if (details.length > 0) {
                  for (let i = 0; i < details.length; i++) {
                    // 辅计量数量
                    let subQty = details[i].subQty;
                    // 主计量数量
                    let qty = details[i].qty;
                    let productsku_cCode = details[i].productsku_cCode;
                    let product = details[i].product;
                    if (product == Tproduct && subQty == OrderQty) {
                      let batchno = details[i].batchno;
                      let productDate = details[i].producedate;
                      let expireDate = details[i].invaliddate;
                      var batch = {
                        batchCode: batchno,
                        inventoryType: "02",
                        batchQty: qty,
                        productDate: productDate,
                        expireDate: expireDate
                      };
                      var batchList = new Array();
                      batchList.push(batch);
                      productData = {
                        itemCode: productsku_cCode
                      };
                      ArrayList.push(productData);
                      SunList = {
                        orderLineNo: oid,
                        planQty: qty,
                        actualQty: qty,
                        inventoryType: "02",
                        status: "OUTBOUND",
                        itemInfo: productData,
                        remark: "",
                        batchInfoList: batchList,
                        logisticsInfo: {}
                      };
                      ArrList.push(SunList);
                      break;
                    }
                  }
                }
              }
              let jsonBody = {
                outBizOrderCode: saleoutcode,
                deliveryOrderTime: vouchdate,
                deliveryOrderCode: OMSNo,
                bizOrderType: "OUTBOUND",
                subBizOrderType: "XSCK",
                ownerCode: "001",
                warehouseCode: warehouse_Code,
                orderLines: ArrList,
                logisticsInfo: logisticsInfoData,
                isFinish: 0,
                status: "OUTBOUND"
              };
              let bodyes = {
                appCode: "beiwei-oms",
                appApiCode: "standard.sell.order.stockout.confirm",
                schemeCode: "bw47",
                jsonBody: jsonBody
              };
              let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(bodyes));
              let str = JSON.parse(strResponse);
              if (str.success != true) {
                throw new Error("下推OMS出库单失败!" + JSON.stringify(str));
              } else {
                let uuidStr = uuid();
                let uuids = replace(uuidStr, "-", "");
                let headDefine = {
                  id: XSCKID,
                  _status: "Update",
                  define11: true
                };
                let Data = { resubmitCheckKey: uuids, id: XSCKID, _status: "Update", headDefine: headDefine };
                let Body = { data: Data };
                let URL = "https://www.example.com/";
                let ApiResponse = openLinker("POST", URL, "SDOC", JSON.stringify(Body));
                let ApiState = JSON.parse(ApiResponse);
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });