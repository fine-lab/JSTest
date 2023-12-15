let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let notSendSql = "select id,itemCode from AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast ";
    notSendSql += " where dataStatus = '1' and suppItemCode is null";
    let notSendRes = ObjectStore.queryByYonQL(notSendSql);
    if (!notSendRes || notSendRes.length == 0) {
      // 数据为空，返回
      return { notCount: 0, successCount: 0 };
    }
    // 拼接查询条件，查询对应物料编码
    let itemCodes = [];
    notSendRes.forEach((item) => {
      itemCodes.push(item.itemCode);
    });
    let productFunc = extrequire("AT173E4CEE16E80007.xqycxr.getProuductInfo");
    let productInfoMap = productFunc.execute(
      {},
      {
        itemCodes: itemCodes
      }
    );
    // 组装之前查询出物料信息为空的物料数据，填写物料信息，准备回填实体物料信息
    let updateObj = [];
    notSendRes.forEach((item) => {
      let product = productInfoMap[item.itemCode];
      if (product) {
        item.suppItemCode = product.code;
        item.suppItemDesc = product.name;
        item.sServiceType = product.manageClassDesc;
        updateObj.push(item);
      }
    });
    var res = ObjectStore.updateById("AT173E4CEE16E80007.AT173E4CEE16E80007.demandForecast", notSendRes, "ybe05ef960");
    // 提示语返回
    return { notCount: notSendRes.length - updateObj.length, successCount: updateObj.length };
  }
}
exports({ entryPoint: MyAPIHandler });