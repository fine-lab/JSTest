let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let code = data.code;
    let shifubuchongxieyi = data.shifubuchongxieyi; //是否关联合同
    var docid = data.id; //id
    var alldoc; //合同编号
    var type = "AT1653473C08780006.AT1653473C08780006.FKHTLR"; //单据URI
    var lsh; //流水号
    var docsql; //单据查询SQL
    var docres; //单据查询结果
    var yuanhetong = data.yuanhetong; //关联合同id
    if (shifubuchongxieyi === "1") {
      //如果有原合同，合同编码=原合同编码+2位流水号
      if (yuanhetong != null || yuanhetong != undefined) {
        var querysql = "select ziduan3 name,hetongbianma yuancode from AT1653473C08780006.AT1653473C08780006.FKHTLR where id = '" + yuanhetong + "'";
        var res = ObjectStore.queryByYonQL(querysql);
        var yuancode = res[0].yuancode;
        docsql =
          "select  hetongbianma a, substring(hetongbianma,1,length(hetongbianma)-6) b, substr(hetongbianma,length(hetongbianma)-1) hetongbianma from " +
          type +
          " where hetongbianma like '" +
          yuancode +
          "' and length(hetongbianma)>16 and id<>'" +
          docid +
          "' order by hetongbianma ";
        docres = ObjectStore.queryByYonQL(docsql);
        var count = 1;
        if (docres !== null && docres.length > 0) {
          for (var i = 0; i < docres.length; i++) {
            if (docres[i].b == yuancode) {
              let l = parseInt(docres[i].hetongbianma);
              if (count == l) {
                count = count + 1;
              } else {
                lsh = prefixInteger(count, 2);
                continue;
              }
            }
          }
        } else {
          lsh = "01";
        }
        if (lsh == undefined || lsh == "") {
          lsh = prefixInteger(count, 2);
        }
        alldoc = join([yuancode, "BC", lsh], "-");
      } else {
        throw new Error("请选择原合同！");
      }
      var object = {
        id: docid,
        hetongbianma: alldoc,
        code: alldoc
      };
      var ress = ObjectStore.updateById(type, object, "e6ef69f3");
    } else {
      var object = {
        id: docid,
        hetongbianma: code
      };
      var ress = ObjectStore.updateById(type, object, "e6ef69f3");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });