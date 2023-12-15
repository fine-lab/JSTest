let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询客户的手机号密码
    var sql = "select * from pc.product.Product where name = 'A物料'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    //查询客户是否是订货客户    "businessRole"= "2",    merchantId 是客户ID
    //商品分类表
    //根据 物料查询对应的辅助分类信息   一个物料可能对应多个辅助分类  将辅助分类在一列中展示
    var sql1 = "select productId, group_concat(b.name) as name  from pc.product.ProductAssistClass  inner join pc.cls.PresentationClass b on b.id =  productClassId  group  by  productId ";
    var res1 = ObjectStore.queryByYonQL(sql1, "productcenter");
    // 物料的图片信息      传递"sort"值最小的    1,
    //根据客户查询物料价格  需要在完善
    return { res, res1 };
  }
}
exports({ entryPoint: MyAPIHandler });