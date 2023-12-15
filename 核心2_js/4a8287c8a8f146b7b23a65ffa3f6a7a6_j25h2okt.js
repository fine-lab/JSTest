let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取SKU物料
    let func1 = extrequire("GZTBDM.essentialData.getSkuRecord");
    let func2 = extrequire("GT101792AT1.common.sendWMS");
    let func3 = extrequire("GZTBDM.essentialData.getSkuWmsBody");
    let res = func1.execute(null, null);
    let skuList = res.skuList;
    //克东SKU
    let kdSkuList = new Array();
    //依安SKU
    let yaSkuList = new Array();
    //电商001
    let dsSkuList = new Array();
    if (skuList.length > 0) {
      for (var i = 0; i < skuList.length; i++) {
        let sku = skuList[i];
        if (sku.pc_productlist_userDefine008 != undefined) {
          //克东SKU
          if (sku.pc_productlist_userDefine008 == "1473041368737644546") {
            kdSkuList.push(sku);
            //依安SKU
          } else if (sku.pc_productlist_userDefine008 == "1473045320098643975") {
            yaSkuList.push(sku);
            //电商工厂
          } else if (sku.pc_productlist_userDefine008 == "") {
            dsSkuList.push(sku);
          }
        }
      }
    }
    if (kdSkuList.length > 0) {
      let kdSkuBody = func3.execute("KEDONG001", kdSkuList);
      let method = "putSKU";
      let paramData = {
        data: kdSkuBody.body,
        method: method
      };
      let res2 = func2.execute(null, paramData);
      let sendWMSResult = res2.jsonResponse;
      let Response = sendWMSResult.Response.return;
      if (Response.returnCode != "0000") {
        throw new Error("Ys推送克东工厂WMS失败：" + JSON.stringify(Response.returnDesc));
      }
    }
    if (yaSkuList.length > 0) {
      let yaSkuBody = func3.execute("YIAN001", yaSkuList);
      let method = "putSKU";
      let paramData = {
        data: yaSkuBody.body,
        method: method
      };
      let res2 = func2.execute(null, paramData);
      let sendWMSResult = res2.jsonResponse;
      let Response = sendWMSResult.Response.return;
      if (Response.returnCode != "0000") {
        throw new Error("Ys推送依安工厂WMS失败：" + JSON.stringify(Response.returnDesc));
      }
    }
    if (dsSkuList.length > 0) {
      let dsSkuBody = func3.execute("001", dsSkuList);
      let method = "putSKU";
      let paramData = {
        data: dsSkuBody.body,
        method: method
      };
      let res2 = func2.execute(null, paramData);
      let sendWMSResult = res2.jsonResponse;
      let Response = sendWMSResult.Response.return;
      if (Response.returnCode != "0000") {
        throw new Error("Ys推送电商仓WMS失败：" + JSON.stringify(Response.returnDesc));
      }
    }
  }
}
exports({ entryPoint: MyTrigger });