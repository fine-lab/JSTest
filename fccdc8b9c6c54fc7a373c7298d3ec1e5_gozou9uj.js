let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取参数 SN
    var aggData = JSON.parse(param.requestData);
    if (aggData && aggData["freeChId!attrext5"]) {
      let SN = aggData["freeChId!attrext5"];
      var code = aggData.code;
      //根据sn 获取数据库中是否有相同数据
      var yonsql = "select freeChId.attrext5 from fa.fixedasset.FixedAssetsInfo  where  freeChId.attrext5 = '" + SN + "' and  code != '" + code + "'";
      var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
      if (res && res.length > 0) {
        throw new Error("SN编码重复：" + SN);
      }
    }
  }
}
exports({ entryPoint: MyTrigger });