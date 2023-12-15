let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    var Data = param.convBills;
    if (Data.length > 0) {
      for (let i = 0; i < Data.length; i++) {
        // 单号
        var code = Data[i].code;
        // 组织
        var org = Data[i].org;
        // 组织单元详情查询
        let OrgResponse = postman("get", "https://www.example.com/" + token + "&id=" + org, JSON.stringify(headers), null);
        let OrgObject = JSON.parse(OrgResponse);
        if (OrgObject.code == 200) {
          var orgCode = OrgObject.data.code;
          var detail = Data[0].stockStatusChanges;
          throw new Error(JSON.stringify(detail));
          var List = new Array();
          if (detail.length > 0) {
            for (let j = 0; j < detail.length; j++) {
              // 仓库
              var warehouse = detail[j].warehouse;
              let Sql = "select code from aa.warehouse.Warehouse where id = '" + warehouse + "'";
              let inwarehouseRes = ObjectStore.queryByYonQL(Sql, "productcenter");
              // 仓库名称
              var warehouseCode = inwarehouseRes[0].code;
              // 物料id
              var product = detail[j].product;
              let productDeatliSql = "select name,code from pc.product.Product where id = '" + product + "'";
              let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
              var productName = productDeatliRes[0].name;
              var productCode = productDeatliRes[0].code;
              // 库存单位
              var stockUnitId = detail[j].stockUnitId;
              // 计量单位详情查询
              let stockUnitsResponse = postman(
                "get",
                "https://www.example.com/" + token + "&id=" + stockUnitId,
                JSON.stringify(headers),
                null
              );
              let stockUnitObject = JSON.parse(stockUnitsResponse);
              if (stockUnitObject.code == 200) {
                // 库存单位名称
                var stockUnit_name = stockUnitObject.data.name.zh_CN;
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
              if (inStockStatusDoc == "1459540345215254543") {
                instockDoc = "合格";
              } else if (inStockStatusDoc == "1479622495685836808") {
                instockDoc = "放行";
              } else if (inStockStatusDoc == "1459540345215254544") {
                instockDoc = "待检";
              } else if (inStockStatusDoc == "1459540345215254545") {
                instockDoc = "冻结";
              } else if (inStockStatusDoc == "1459540345215254546") {
                instockDoc = "不合格";
              } else if (inStockStatusDoc == "1459540345215254547") {
                instockDoc = "废品";
              } else if (inStockStatusDoc == "1479622384030842885") {
                instockDoc = "待检";
              } else if (inStockStatusDoc == "1479622495685836808") {
                instockDoc = "放行";
              } else if (inStockStatusDoc == "1479622753376010241") {
                instockDoc = "禁用";
              }
              if (outStockStatusDoc == "1459540345215254543") {
                outstockDoc = "合格";
              } else if (outStockStatusDoc == "1479622495685836808") {
                outstockDoc = "放行";
              } else if (outStockStatusDoc == "1459540345215254544") {
                outstockDoc = "待检";
              } else if (outStockStatusDoc == "1459540345215254545") {
                outstockDoc = "冻结";
              } else if (outStockStatusDoc == "1459540345215254546") {
                outstockDoc = "不合格";
              } else if (outStockStatusDoc == "1459540345215254547") {
                outstockDoc = "废品";
              } else if (outStockStatusDoc == "1479622384030842885") {
                outstockDoc = "待检";
              } else if (outStockStatusDoc == "1479622495685836808") {
                outstockDoc = "放行";
              } else if (outStockStatusDoc == "1479622753376010241") {
                outstockDoc = "禁用";
              }
              let orderLines = {
                inventoryType: "FX",
                unit: stockUnit_name,
                planQty: qty,
                actualQty: qty,
                beforeInventoryType: outstockDoc,
                afterInventoryType: instockDoc,
                itemInfo: { itemCode: productCode, itemName: productName }
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
            let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
            let str = JSON.parse(strResponse);
            if (str.success != true) {
              throw new Error("调用OMS更新库存状态API失败：" + str.message);
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });