let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(request) {
    //递归
    if (request.function == "queryById") {
      let param = request.param;
      let domainKey = param.domainKey;
      let mainUrl = param.url;
      let mainYonql = "select * from " + mainUrl + " where id = '" + param.id + "'";
      let mainRes = ObjectStore.queryByYonQL(mainYonql, domainKey)[0];
      if (param.sub != undefined && param.sub.length > 0) {
        for (let i = 0; i < param.sub.length; i++) {
          let subUrl = param.sub[i].url;
          let subYonql = "select * from " + subUrl + " where " + param.sub[i].linkField + " = '" + param.id + "'";
          let subRes = ObjectStore.queryByYonQL(subYonql, domainKey);
          mainRes[param.sub[i].name] = subRes;
        }
      }
      return { data: mainRes };
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });