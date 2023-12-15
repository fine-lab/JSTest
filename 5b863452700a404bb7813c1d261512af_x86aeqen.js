let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billId = param.variablesMap.id;
    var sql = `select * from AT17FE7F8616F80008.AT17FE7F8616F80008.WDSQB WHERE id= ` + billId;
    var res = ObjectStore.queryByYonQL(sql);
    var gzlx = res[0].gZLX;
    var gzlxsql = `select * from AT17FE7F8616F80008.AT17FE7F8616F80008.GZLX`;
    var gzlxres = ObjectStore.queryByYonQL(gzlxsql);
    gzlxres = gzlxres.filter((item) => {
      return item.id == gzlx;
    });
    var guizeleixingbianma = gzlxres[0].guizeleixingbianma;
    var yssql = `select * from AT17FE7F8616F80008.AT17FE7F8616F80008.YSGL `;
    var ysres = ObjectStore.queryByYonQL(yssql);
    var param21 = { ziduan: "业务信息===" + JSON.stringify(ysres) };
    ObjectStore.insert("AT17FE7F8616F80008.AT17FE7F8616F80008.YWRZS", param21, "YWRZSList");
    ysres = ysres.filter((item) => {
      //要包含规则类型过滤，这里没加字段，暂时省略
      return item.WDSQB_id == billId;
    });
    var zxyq2;
    var zxyq4;
    var ZXR2;
    var ZXR4;
    for (var i = ysres.length - 1; i >= 0; i--) {
      //可以根据规则抽象一下逻辑
      if (ysres[i].huodongbianma == "HJ2") {
        zxyq2 = ysres[i].new5;
        ZXR2 = ysres[i].staffNew;
      }
      if (ysres[i].huodongbianma == "HJ4") {
        zxyq4 = ysres[i].new5;
        ZXR4 = ysres[i].staffNew;
      }
    }
    return {
      bindType: "multiVar",
      variables: {
        zxyq2: zxyq2,
        ZXR2: { dataType: "staff", data: ZXR2 },
        zxyq4: zxyq4,
        ZXR4: { dataType: "staff", data: ZXR4 }
      }
    };
  }
}
exports({ entryPoint: MyTrigger });