let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    //获取单据状态
    //获取主表id
    let pId = pdata.id;
    //通过sql查询出其他入库单据单据号
    let childSQL = "select id,code,vdef1,vdef9 from znbzbx.commonexpensebill.CommonExpenseBillVO where id='" + pId + "' ";
    let childSQLRes = ObjectStore.queryByYonQL(childSQL);
    if (childSQLRes != null && childSQLRes != undefined) {
      if (childSQLRes.length > 0) {
        let othOrderCode = childSQLRes[0].vdef1;
        //通过查询其他入库单单据号，查询是否存在其他入库单单据数据
        let otherOrderSQL = " select id,code from st.othinrecord.OthInRecord where code='" + othOrderCode + "' ";
        let otherOrderRes = ObjectStore.queryByYonQL(otherOrderSQL);
        if (otherOrderRes != null && otherOrderRes != undefined) {
          if (otherOrderRes.length > 0) {
            throw new Error("已经产生下游单据，不允许撤回。请删除其他入库单之后再进行撤回操作");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });