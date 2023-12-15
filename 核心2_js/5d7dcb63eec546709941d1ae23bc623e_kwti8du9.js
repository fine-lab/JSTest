let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.convBills;
    console.log(JSON.stringify(Data));
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "审核";
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    if (Data.length > 0) {
      for (let i = 0; i < Data.length; i++) {
        // 单号
        var code = Data[i].code;
        // 组织
        var org = Data[i].org;
        // 组织单元详情查询
        let OrgSQL = "select code from org.func.BaseOrg where id = '" + org + "'";
        let OrgRES = ObjectStore.queryByYonQL(OrgSQL, "ucf-org-center");
        var orgCode = OrgRES[0].code;
        var detail = Data[0].stockStatusChanges;
        var List = new Array();
        if (detail.length > 0) {
          for (let j = 0; j < detail.length; j++) {
            // 仓库
            var warehouse = detail[j].warehouse;
            let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
            let inwarehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
            // 仓库名称
            var warehouseCode = inwarehouseRes[0].code;
            var productSku = detail[j].productsku;
            let SkuSql = "select code,name from pc.product.ProductSKU where id = '" + productSku + "'";
            let SkuRes = ObjectStore.queryByYonQL(SkuSql, "productcenter");
            let SkuName = SkuRes[0].name;
            let SkuCode = SkuRes[0].code;
            // 物料id
            var product = detail[j].product;
            let productDeatliSql = "select name,code from pc.product.Product where id = '" + product + "'";
            let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
            var productName = productDeatliRes[0].name;
            var productCode = productDeatliRes[0].code;
            // 库存单位
            var stockUnitId = detail[j].stockUnitId;
            // 计量单位详情查询
            let UiucSql = "select name from pc.unit.Unit where id = '" + stockUnitId + "'";
            let UiucRes = ObjectStore.queryByYonQL(UiucSql, "productcenter");
            if (UiucRes.length > 0) {
              // 库存单位名称
              var stockUnit_name = UiucRes[0].name;
            } else {
              throw new Error("未查询到该物料的库存单位！");
            }
            // 数量
            var qty = detail[j].qty;
            // 目的库存状态id
            var inStockStatusDoc = detail[j].inStockStatusDoc;
            // 来源库存状态id
            var outStockStatusDoc = detail[j].outStockStatusDoc;
            // 目的库存状态编码
            var instockDoc = "";
            // 来源库存状态编码
            var outstockDoc = "";
            if (inStockStatusDoc == "2367300957197839") {
              instockDoc = "合格";
            } else if (inStockStatusDoc == "1501390687013175303") {
              instockDoc = "放行";
            } else if (inStockStatusDoc == "2367300957197840") {
              instockDoc = "待检";
            } else if (inStockStatusDoc == "2367300957197841") {
              instockDoc = "冻结";
            } else if (inStockStatusDoc == "2367300957197842") {
              instockDoc = "不合格";
            } else if (inStockStatusDoc == "2367300957197843") {
              instockDoc = "废品";
            } else if (inStockStatusDoc == "1501389845199585280") {
              instockDoc = "待检";
            } else if (inStockStatusDoc == "1501390687013175303") {
              instockDoc = "放行";
            } else if (inStockStatusDoc == "1501391064969773056") {
              instockDoc = "禁用";
            }
            if (outStockStatusDoc == "2367300957197839") {
              outstockDoc = "合格";
            } else if (outStockStatusDoc == "1501390687013175303") {
              outstockDoc = "放行";
            } else if (outStockStatusDoc == "2367300957197840") {
              outstockDoc = "待检";
            } else if (outStockStatusDoc == "2367300957197841") {
              outstockDoc = "冻结";
            } else if (outStockStatusDoc == "2367300957197842") {
              outstockDoc = "不合格";
            } else if (outStockStatusDoc == "2367300957197843") {
              outstockDoc = "废品";
            } else if (outStockStatusDoc == "1501389845199585280") {
              outstockDoc = "待检";
            } else if (outStockStatusDoc == "1501390687013175303") {
              outstockDoc = "放行";
            } else if (outStockStatusDoc == "1501391064969773056") {
              outstockDoc = "禁用";
            }
            let orderLines = {
              inventoryType: "FX",
              unit: stockUnit_name,
              planQty: qty,
              actualQty: qty,
              beforeInventoryType: outstockDoc,
              afterInventoryType: instockDoc,
              itemInfo: { itemCode: SkuCode, itemName: SkuName }
            };
            List.push(orderLines);
          }
          let jsonBody = {
            isFinished: 1,
            bizOrderType: "QUALITY_RELEASE",
            ownerCode: orgCode,
            orderStatus: "FINISH",
            warehouseCode: warehouseCode,
            orderLines: List,
            channelCode: "DEFAULT",
            orderSource: "PLATFORM_SYNC",
            subBizOrderType: "ZLFX",
            outBizOrderCode: code
          };
          let body = {
            appCode: "beiwei-ys",
            appApiCode: "ys.create.zlfx.order.interface",
            schemeCode: "bw47",
            jsonBody: jsonBody
          };
          console.log(JSON.stringify(body));
          let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
          console.log(JSON.stringify(strResponse));
          let str = JSON.parse(strResponse);
          // 打印日志
          let LogBody = { data: { code: code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType } };
          let LogResponse = postman("post", "https://www.example.com/" + token, JSON.stringify(headers), JSON.stringify(LogBody));
          console.log(LogResponse);
          if (str.success != true) {
            throw new Error("调用OMS更新库存状态API失败：" + str.errorMessage);
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });