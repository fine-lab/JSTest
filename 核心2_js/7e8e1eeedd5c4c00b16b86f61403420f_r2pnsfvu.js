let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 代理商存储校验。
    let data = param.data[0];
    debugger;
    var hsql = `select id from GT7239AT6.GT7239AT6.cmmssn_merchant_h where dr =0 and (name ='${data.name}' )`;
    var res = ObjectStore.queryByYonQL(hsql);
    if (res.length > 1) {
      throw new Error("代理商名称不可重复！");
    }
    res = ObjectStore.selectById("GT7239AT6.GT7239AT6.cmmssn_merchant_h", {
      id: data.id,
      compositions: [{ name: "cmmssn_merchant_bList" }]
    });
    let children = res.cmmssn_merchant_bList;
    let operatorIdArray = children.map(function (v) {
      return v.operatorId;
    });
    var set = new Set(operatorIdArray);
    if (set.size !== operatorIdArray.length) {
      throw new Error(`名称为[${res.name}]的代理商表体操作员不能重复！${JSON.stringify({ res, set, operatorIdArray })}`);
    }
    let { importMode } = param;
    if (importMode && param.data.length > 0) {
      let object = param.data.map(function (d) {
        return { id: d.id, isImported: "Y" };
      });
      ObjectStore.updateBatch("GT7239AT6.GT7239AT6.cmmssn_merchant_h", object);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });