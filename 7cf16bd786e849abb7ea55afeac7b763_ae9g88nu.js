let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let materialId = request.productId;
    let productDetail = { materialId };
    //获取商品档案详情
    let apiResponseSupplier = extrequire("GT22176AT10.publicFunction.getProductDetail").execute(productDetail);
    let merchantInfo = apiResponseSupplier.merchantInfo;
    return { merchantInfo };
  }
}
exports({ entryPoint: MyAPIHandler });