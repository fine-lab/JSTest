let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  // 代理商客户品种档案销售组织+操作员+代理商唯一性校验
  execute(context, param) {
    let { data } = param;
    for (let bill of data) {
      let { org_id, operatorId, cmmssn_merchant, id } = bill;
      let sql = `select * from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where id != ${id} and org_id = 'youridHere' and operatorId = ${operatorId} and cmmssn_merchant = ${cmmssn_merchant}`;
      let sameItems = ObjectStore.queryByYonQL(sql);
      if (sameItems && sameItems.length > 0) {
        throw new Error("数据已重复，请检查");
      }
    }
    return null;
  }
}
exports({ entryPoint: MyTrigger });