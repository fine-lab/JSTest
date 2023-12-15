let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取物料档案详情
    let menchantQueryUrl = extrequire("ISY_2.public.getProduct").execute({ materialId: request.materialId });
    let materialSql = "select * from pc.product.Product where id = " + request.materialId;
    let merchantInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
    merchantInfo[0].detail = menchantQueryUrl.merchantInfo;
    return { merchantInfo };
  }
}
exports({ entryPoint: MyAPIHandler });