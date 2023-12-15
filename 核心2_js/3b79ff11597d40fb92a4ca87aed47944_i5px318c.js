let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    var salesBusinessInfos = data.salesBusinessInfo;
    var code = data.codebianma;
    var name = data.name;
    var stop = data.stop;
    var id = data.id;
    var ids = "";
    var area = "";
    var org = "";
    for (let irow = 0; irow < 1; irow++) {
      let salesBusinessInfo = salesBusinessInfos[irow];
      ids = salesBusinessInfo.storeLevel;
      area = salesBusinessInfo.saleArea;
      org = salesBusinessInfo.saleOrg;
    }
    if (!ids && ids != null) {
      var sql = "select code from aa.store.StoreLevel where id = '" + ids + "'";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      ids = res[0].code;
    }
    if (!area && area != null) {
      var sql1 = "select code from aa.salearea.SaleArea where id = '" + area + "'";
      var res1 = ObjectStore.queryByYonQL(sql1, "productcenter");
      area = res1[0].code;
    }
    if (!org && org != null) {
      var sql2 = "select code from org.func.BaseOrg where id = '" + org + "'";
      var res2 = ObjectStore.queryByYonQL(sql2, "ucf-org-center");
      org = res2[0].code;
    }
    let json = {
      data: {
        id: id,
        name: name,
        code: code,
        stop: stop,
        level: ids,
        area: area,
        org: org
      }
    };
    let url = "http://219.133.71.172:39066/uapws/rest/integration/writeCust";
    var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
    if (strResponse.status == 1) throw new Error("U订货" + strResponse.msg);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });