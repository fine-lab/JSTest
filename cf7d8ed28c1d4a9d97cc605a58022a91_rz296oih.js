let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //算力服务物料
    let extendSuanli = param.data[0].adjustDetails[0].extendSuanli;
    //合同编号
    let extendContract = param.data[0].adjustDetails[0].extendContract;
    let extendSuanliName = param.data[0].adjustDetails[0].extendSuanli_name;
    let extendContractName = param.data[0].adjustDetails[0].extendContract_name;
    let sql = "select extendSuanli, extendContract  from marketing.price.PriceAdjustDetail where extendSuanli = '" + extendSuanli + "'  and extendContract = '" + extendContract + "' ";
    var res = ObjectStore.queryByYonQL(sql);
    if (!res || res.length <= 0) {
      return {};
    }
    throw new Error("算力服务物料+合同编码已存在");
  }
}
exports({ entryPoint: MyTrigger });