let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let dataItem = {};
    var context = jsonParse(AppContext());
    let userMsg = ObjectStore.user();
    if (data instanceof Array) {
      data[0].set("updateUser", userMsg.id);
      data[0].set("updateUserName", userMsg.name);
      if (data[0]["status"] == "0") {
        return {};
      }
      dataItem = data[0];
    } else {
      data.set("updateUser", userMsg.id);
      data.set("updateUserName", userMsg.name);
      dataItem = data;
    }
    if (!dataItem.suanliType) {
      dataItem.set("suanliType", dataItem.suanliId_code);
    }
    // 基准价、价格、价格2 必须大于0
    let zeroMsg = "算力服务产品编码：" + dataItem.suanliType + ",合同号：" + dataItem.contractNum + " ";
    let fieldMsg = "";
    if (dataItem.baseprice <= 0) {
      fieldMsg += "基准价、";
    }
    if (dataItem.priceOne <= 0) {
      fieldMsg += "价格、";
    }
    if (dataItem.priceTwo <= 0) {
      fieldMsg += "价格2、";
    }
    if (fieldMsg != "") {
      fieldMsg = fieldMsg.substring(0, fieldMsg.length - 1);
      throw new Error(zeroMsg + fieldMsg + "必须大于0！");
    }
    if (!dataItem.suanliId) {
      throw new Error("未找到算力服务产品编码：" + dataItem.suanliId_code + "的物料信息");
    }
    // 校验唯一性，算力服务产品编码+合同号+已启用 唯一
    let sql = "select count(1) co from AT1720668416580001.AT1720668416580001.suanliProductPrice ";
    sql += " where suanliId = '" + dataItem.suanliId + "' ";
    sql += " and contractNum = '" + dataItem.contractNum + "' ";
    sql += " and status = '1' ";
    sql += " and code != '" + dataItem.code + "' ";
    var res = ObjectStore.queryByYonQL(sql);
    if (!dataItem.suanliTypeName) {
      let productsql = " select id, name, code from pc.product.Product  where code = '" + dataItem.suanliId_code + "'";
      var productresult = ObjectStore.queryByYonQL(productsql, "productcenter");
      if (productresult.length > 0) {
        dataItem.set("suanliTypeName", productresult[0].name);
      }
    }
    if (res && res.length == 1 && res[0].co > 0) {
      throw new Error("算力服务产品编码：" + dataItem.suanliType + ",合同号：" + dataItem.contractNum + "已经开启，请勿重复操作！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });