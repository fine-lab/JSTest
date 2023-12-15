let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    throw new Error("he");
    //客户,已通过首营审批，不允许删除
    if (context.fullname == "aa.merchant.Merchant") {
      let errorMsg = "";
      let querySql = "select code,name,extend_syzt from aa.merchant.Merchant where id in (";
      for (let i = 0; i < param.data; i++) {
        querySql += "'" + param.data[i].id + "',";
      }
      let strLength = querySql.length;
      querySql = querySql.substring(0, querySql.length) + ")";
      let res = ObjectStore.queryByYonQL(querySql, "productcenter");
      for (let i = 0; i < res.length; i++) {
        if (res[i].extend_syzt == 1) {
          errorMsg += "客户【" + res[i].code + "】已通过首营审批,不允许删除！\n";
        }
      }
      if (errorMsg.length > 0) {
        throw new Error(errorMsg);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });