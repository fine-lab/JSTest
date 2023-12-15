let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取SKU物料
    let code = { code: param.code, pubts: param.pubts };
    let func1 = extrequire("GZTBDM.essentialData.getSkuRecord"); //获取需要同步的物料sku集合
    let func2 = extrequire("GT101792AT1.common.sendWMS"); //同步wms的方法
    let func3 = extrequire("GZTBDM.essentialData.getSkuWmsBody"); //获取同步wms之前的body，此函数用于组装body
    let res = func1.execute(null, code);
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
          if (sku.pc_productlist_userDefine008 == "2390178757465088") {
            kdSkuList.push(sku);
            //依安SKU
          } else if (sku.pc_productlist_userDefine008 == "2522102344422656") {
            yaSkuList.push(sku);
            //电商工厂
          } else if (sku.pc_productlist_userDefine008 == "2369205391741184") {
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