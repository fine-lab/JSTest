let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端数据
    var data = request.data;
    //获取当前组织
    var org = data.org;
    //获取当前终端id
    var terminal = data.terminal;
    //先查当前物料分类下的物料id
    var productSql = "select * from  pc.product.Product where manageClass in ('1682303720372568071','1682303368183676935')";
    var productDatas = ObjectStore.queryByYonQL(productSql, "productcenter");
    let ids = [];
    for (let irow = 0; irow < productDatas.length; irow++) {
      let productData = productDatas[irow];
      ids.push(productData.id);
    }
    //去台账查询当前物料和终端的所有物料信息
    var sql = "select existQuantity,product,terminal from  dsfa.assetstandbook.AssetsStandBook  where  org='" + org + "' and terminal = '" + terminal + "' and  product in (" + ids + ")";
    var datas = ObjectStore.queryByYonQL(sql, "yycrm");
    //定义一个boolean
    let isChoose = true;
    if (datas) {
      isChoose = false;
      throw new Error(JSON.stringify(isChoose));
    }
    return { isChoose };
  }
}
exports({ entryPoint: MyAPIHandler });