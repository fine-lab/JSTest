let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let sumAmount = pdata.sumAmount;
    let dingdanjine = pdata.dingdanjine;
    if (sumAmount == undefined) {
      let sqlStr = "select sumAmount from GT3734AT5.GT3734AT5.QYSQD where id='" + pdata.id + "'";
      let res = ObjectStore.queryByYonQL(sqlStr);
      let dbSumAmount = res[0].sumAmount;
      if (dbSumAmount != dingdanjine) {
        throw new Error("订单金额与产品合计金额不等，不能保存!");
      }
    } else {
      if (dingdanjine != sumAmount) {
        throw new Error("订单金额与产品合计金额不等，不能保存!");
      }
    }
    let dingdanxiaoshougongxianlv = pdata.dingdanxiaoshougongxianlv;
    if (dingdanxiaoshougongxianlv == "" || dingdanxiaoshougongxianlv <= 0) {
      throw new Error("销售订单贡献率不能小于0!");
    }
    let id = pdata.id;
    let caiwupihao = pdata.caiwupihao; //isClosed=0 and
    let sqlStr = "select id,isClosed from GT3734AT5.GT3734AT5.QYSQD where (isClosed is null or isClosed=0) and caiwupihao='" + caiwupihao + "'";
    if (id != undefined && id != null && id != "") {
      sqlStr = sqlStr + " and id!='" + id + "'";
    }
    let res = ObjectStore.queryByYonQL(sqlStr);
    if (res.length > 0) {
      throw new Error("pi重复，不能保存!");
    }
    let schemeBillNo = pdata.schemeBillNo; //方案单据编码
    let schemeBillId = pdata.schemeBillId; //
    sqlStr = "select id,code from GT3734AT5.GT3734AT5.QYSQD where (isClosed is null or isClosed=0) and schemeBillId='" + schemeBillId + "'";
    if (id != undefined && id != null && id != "") {
      sqlStr = sqlStr + " and id!='" + id + "'";
    }
    res = ObjectStore.queryByYonQL(sqlStr);
    if (res.length > 0) {
      throw new Error("已存在关联方案编码为[" + schemeBillNo + "]的单据--" + res[0].code + "，不能保存!");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });