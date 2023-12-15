let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let num = request.num; //计数数量
    let batchNo = request.batchNo; //批次号
    let productCode = request.productCode; //物料编码
    let warehouseCode = request.warehouseCode; //仓库编码
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    // 仓库查询
    let warehouseQuerySql = "select id from aa.warehouse.Warehouse where code =" + warehouseCode;
    var warehouseRes = ObjectStore.queryByYonQL(warehouseQuerySql, "productcenter");
    if (warehouseRes.length == 0) {
      throw new Error("仓库编码" + warehouseCode + "在ys未找到");
    }
    // 物料档案查询
    let productQuerySql = "select id from 	pc.product.Product where code = " + productCode;
    var productRes = ObjectStore.queryByYonQL(productQuerySql, "productcenter");
    if (productRes.length == 0) {
      throw new Error("物料编码" + productCode + "在ys未找到");
    }
    // 现存量查询
    let body = {
      warehouse: warehouseRes[0].id, //需要修改成 warehouseRes,1462402339615801354
      product: productRes[0].id,
      batchno: batchNo
    };
    let func2 = extrequire("GT101792AT1.common.getApiToken");
    let res2 = func2.execute();
    var token = res2.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    // 调用现存量查询接口
    var reqCgdetailurl = URLData.URL + "/iuap-api-gateway/yonbip/scm/stock/QueryCurrentStocksByCondition?access_token=" + token;
    var cgResponse = postman("POST", reqCgdetailurl, JSON.stringify(header), JSON.stringify(body));
    var cgresponseobj = JSON.parse(cgResponse);
    let currentqty = 0;
    if (cgresponseobj.data != null) {
      let resdata = cgresponseobj.data;
      for (var i = 0; i < resdata.length; i++) {
        let product = resdata[i];
        currentqty += product.currentqty;
      }
    }
    if (currentqty < num) {
      //方便测试到时候改成小于号
      // 需要进行采购入库
      // 物料档案查询
      let func1 = extrequire("GT101792AT1.backOpenApiFunction.productQuery");
      let res = func1.execute(productCode);
      let recordList = res.cgresponseobj.data.recordList[0];
      let func3 = extrequire("GT101792AT1.backOpenApiFunction.purchaseSave");
      let gap = num - currentqty; //需要进行采购入库的数量
      // 请求参数
      let param = {
        recordList: recordList,
        gap: gap,
        warehouse: warehouseRes[0].id //需要修改成 warehouseRes[0].id            1462402339615801354
      };
      let res3 = func3.execute(param);
    }
    return { res3 };
  }
}
exports({ entryPoint: MyAPIHandler });