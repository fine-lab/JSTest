let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //测试
    //查询 原厂-销售合同的code，name，contractstatus（sact 是销售合同所在领域的domainKey）
    var sql = "select id from sact.contract.SalesContract where code = 'SACT20220519000002'";
    var nameObj = ObjectStore.queryByYonQL(sql, "sact");
    //存货核算的结算结账单
    //存货核算的存货明细账
    throw new Error(JSON.stringify(nameObj));
    var codes = new Array();
    for (var i = 0; i < nameObj.length; i++) {
      var defsql = "select code from bd.customerdoc.customerdoc where custdocdefid = 'youridHere' and code in ('" + nameObj[i].code + "') ";
      var defObj = ObjectStore.queryByYonQL(defsql, "ucfbasedoc");
      if (defObj.length == 0) {
        codes.push(nameObj[i]);
      }
    }
    throw new Error(JSON.stringify(codes));
    if (codes.length > 0) {
      var data = new Array();
      for (var i = 0; i < codes.length; i++) {
        var info = {
          code: codes[i].code,
          name: {
            zh_CN: codes[i].name,
            en_US: codes[i].name,
            zh_TW: codes[i].name
          },
          custdocdefid_code: "sale_contract",
          orgCode: "global00",
          enable: 1
        };
        data.push(info);
      }
      let body = {
        data: data
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "SACT", JSON.stringify(body));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });