let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pageIndex = request.pageIndex;
    let pageSize = request.pageSize;
    let sqltotal = "select DISTINCT (productId.code)  as materialCode from pc.product.ProductDetail where iUOrderStatus='Y' and productId.code!=50040005";
    let sqlwlarr = "select DISTINCT (productId.code) as materialCode  from pc.product.ProductDetail where iUOrderStatus='Y' and productId.code!=50040005 limit " + pageIndex + "," + pageSize;
    if (request.materialCode != null) {
      let materialCode = request.materialCode;
      sqltotal = "select DISTINCT (productId.code)  as materialCode from pc.product.ProductDetail where iUOrderStatus='Y' and productId.code like'" + materialCode + "'";
      sqlwlarr =
        "select DISTINCT (productId.code) as materialCode  from pc.product.ProductDetail where iUOrderStatus='Y' and productId.code like'" + materialCode + "' limit " + pageIndex + "," + pageSize;
    }
    var total = ObjectStore.queryByYonQL(sqltotal, "productcenter");
    var wlarr = ObjectStore.queryByYonQL(sqlwlarr, "productcenter");
    let body = { data: wlarr };
    //获取token
    let func = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    let token = func.execute().access_token;
    let xcldta = postman("post", "https://www.example.com/" + token, null, JSON.stringify(body));
    var objectList = [];
    if (JSON.parse(xcldta).code == 200) {
      let datastr = JSON.parse(xcldta).data;
      for (let i = 0; i < datastr.length; i++) {
        let wldata = datastr[i];
        var wlname = ObjectStore.queryByYonQL("select  name,unit.name,modelDescription from pc.product.Product where code='" + wldata.materialCode + "'", "productcenter");
        //获取主辅换算率
        var ProductAssistUnitExchange = ObjectStore.queryByYonQL(
          "select  assistUnitCount,mainUnitCount,assistUnit.name from pc.product.ProductAssistUnitExchange where productId.code='" + wldata.materialCode + "'",
          "productcenter"
        );
        let assistUnit_name = "";
        let conversion_rate = "";
        let mainUnitCount = 0;
        if (ProductAssistUnitExchange.length > 0) {
          assistUnit_name = ProductAssistUnitExchange[0].assistUnit_name;
          mainUnitCount = ProductAssistUnitExchange[0].mainUnitCount;
          let assistUnitCount = ProductAssistUnitExchange[0].assistUnitCount || 0;
          conversion_rate = mainUnitCount + "/" + assistUnitCount;
        }
        let kylobj = {
          astinventory: wldata.astinventory,
          inventory: wldata.astinventory * mainUnitCount,
          material_name: wlname[0].name,
          unit: wlname[0].unit_name,
          assistUnit: assistUnit_name,
          conversion_rate: conversion_rate,
          material_code: wldata.materialCode,
          specifications: wlname[0].modelDescription
        };
        objectList.push(kylobj);
      }
    }
    return { data: objectList, total: total.length };
  }
}
exports({ entryPoint: MyAPIHandler });