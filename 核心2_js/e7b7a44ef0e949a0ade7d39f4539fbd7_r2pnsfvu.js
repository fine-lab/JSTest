// 代理商档案删除校验
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let ids = data.map((v) => v.id);
    let idsString = ids.join(",");
    let finalSql = `select id from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where dr=0 and cmmssn_merchant in (${idsString})`;
    var res = ObjectStore.queryByYonQL(finalSql);
    if (res.length > 0) {
      throw new Error("数据已被引用，无法删除！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });