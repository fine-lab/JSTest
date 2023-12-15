let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 调拨订单主键
    var mainId = param.DBid;
    // 调用状态
    var state = param.state;
    // 调拨订单单号
    var srcBillNO = param.srcBillNO;
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    let DBAPI = postman("get", "https://www.example.com/" + token + "&id=" + mainId, JSON.stringify(headers), null);
    let DBParse = JSON.parse(DBAPI);
    if (DBParse.code == 200) {
      var Data = DBParse.data;
      if (state == "out") {
        // 单据创建日期
        let createTime = Data.createTime;
        // 调出库存组织
        let outorg = Data.outorg;
        // 调出库存组织名称
        let outorg_name = Data.outorg_name;
        // 调出会计主体
        let outaccount = Data.outaccount;
        // 调入库存组织
        let inorg = Data.inorg;
        // 调入库存组织名称
        let inorg_name = Data.inorg_name;
        // 调入会计主体
        let inaccount = Data.inaccount;
        // 调拨订单编码
        let code = Data.code;
        // 调出仓库id
        let outwarehouse = Data.outwarehouse;
        // 调出仓库名称
        let outwarehouse_name = Data.outwarehouse_name;
        // 调入仓库id
        let inwarehouse_name = Data.inwarehouse_name;
        // 调入仓库名称
        let inwarehouse = Data.inwarehouse;
        // 交易类型
        let bustype = Data.bustype;
        // 调出调入组织集合
        let OutInList = { OutOrg: outorg, InOrg: inorg };
        // 调出调入仓库集合
        let OutInWarehouseList = { OutWarehouse: outwarehouse, InWarehouse: inwarehouse };
        // 订单子表数据
        let transferApplys = Data.transferApplys;
        // 查询交易类型
        let bustypeURL = extrequire("ST.unit.bustypeAPI");
        let bustypeBody = bustypeURL.execute(null, bustype);
        if (bustypeBody.BusCode != null) {
          // 交易类型
          let BusCode = bustypeBody.BusCode;
          let bustypeCode = "";
          if (BusCode == "DB01") {
            bustypeCode = "DC01";
          } else if (BusCode == "DB02") {
            bustypeCode = "DC02";
          } else if (BusCode == "DB03") {
            bustypeCode = "DC03";
          } else if (BusCode == "DB04") {
            bustypeCode = "DC04";
          }
          // 查询组织单元
          let OutInOrgURL = extrequire("ST.unit.OutInOrgQuery");
          let OutInOrgBody = OutInOrgURL.execute(null, OutInList);
          if (OutInOrgBody.OutInReturn != null) {
            // 调入组织code
            let inorgCode = OutInOrgBody.OutInReturn.inorgCode;
            // 调出组织code
            let outorgCode = OutInOrgBody.OutInReturn.outorgCode;
            // 查询仓库
            let OutInWarehouseURL = extrequire("ST.unit.OutInWarehouse");
            let OutInWarehouseBody = OutInWarehouseURL.execute(null, OutInWarehouseList);
            if (OutInWarehouseBody.OutInWarehouseReturn != null) {
              // 调入仓库code
              let inwarehouseCode = OutInWarehouseBody.OutInWarehouseReturn.inwarehouseCode;
              // 调出仓库code
              let outwarehouseCode = OutInWarehouseBody.OutInWarehouseReturn.outwarehouseCode;
              if (transferApplys.length > 0) {
                let productData = {};
                let SunData = {};
                var orderLines = new Array();
                var stockStatusDoc_name = "FX";
                for (let i = 0; i < transferApplys.length; i++) {
                  // 物料id
                  let productMessage = transferApplys[i].product;
                  // 物料编码
                  let product_cCode = transferApplys[i].product_cCode;
                  // 物料名称
                  let product_cName = transferApplys[i].product_cName;
                  // 明细行id
                  let SunId = transferApplys[i].id;
                  // 主计量数量
                  let qty = transferApplys[i].qty;
                  // 实发数量
                  let subQty = transferApplys[i].subQty;
                  // 查询物料
                  let ProductURL = extrequire("ST.unit.productQuery");
                  let ProductBody = ProductURL.execute(null, productMessage);
                  if (ProductBody.productList != null) {
                    productData = {
                      itemCode: product_cCode,
                      itemName: product_cName,
                      itemType: ProductBody.productList.productClassCode,
                      itemTypeName: ProductBody.productList.productClassName
                    };
                    SunData = {
                      orderLineNo: SunId,
                      relationOrderLineNo: SunId,
                      ysId: Data.id, //上游单据id
                      firstsourceid: Data.id, //源头主表id
                      planQty: qty,
                      actualQty: qty,
                      inventoryType: stockStatusDoc_name,
                      unit: ProductBody.productList.stockUnit_name,
                      itemInfo: productData
                    };
                    orderLines.push(SunData);
                  }
                }
                let jsonBody = {
                  outBizOrderCode: srcBillNO,
                  bizOrderType: "OUTBOUND",
                  subBizOrderType: "DBCK",
                  orderSource: "MANUAL_IMPORT",
                  createTime: createTime,
                  outOwnerName: outorg_name,
                  outOwnerCode: outorgCode,
                  outWarehouseCode: outwarehouseCode,
                  outWarehouseName: outwarehouse_name,
                  inOwnerCode: inorgCode,
                  inOwnerName: inorg_name,
                  inWarehouseCode: inwarehouseCode,
                  inWarehouseName: inwarehouse_name,
                  warehouseCode: outwarehouseCode,
                  ownerCode: outorgCode,
                  orderLines: orderLines,
                  inorg: inorg,
                  outorg: outorg,
                  inaccountOrg: inaccount,
                  outaccountOrg: outaccount,
                  channelCode: "XDQD",
                  senderInfo: {},
                  receiverInfo: {},
                  SourcePlatformCode: "YS",
                  bustype: bustypeCode,
                  status: "WAIT_INBOUND"
                };
                let body = {
                  appCode: "beiwei-ys",
                  appApiCode: "ys.push.to.oms.dbck",
                  schemeCode: "bw47",
                  jsonBody: jsonBody
                };
                return { body: body };
              } else {
                throw new Error("未查询到调拨订单明细行信息！");
              }
            } else {
              throw new Error("未查询到仓库信息！");
            }
          } else {
            throw new Error("未查询到组织信息！");
          }
        } else {
          throw new Error("未查询到交易类型！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });