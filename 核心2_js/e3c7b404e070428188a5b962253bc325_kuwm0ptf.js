let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let res = AppContext();
    //后端函数调用后端函数
    //也可以调用api函数
    //获取当前用户信息
    // 查询销售出库
    //查询物料
    var relSearch = "select productAssistUnitExchanges.* from pc.product.Product where id = 'youridHere'";
    var result = ObjectStore.queryByYonQL(relSearch, "productcenter");
    throw new Error(JSON.stringify(result));
    return { res };
  }
}
exports({ entryPoint: MyTrigger });