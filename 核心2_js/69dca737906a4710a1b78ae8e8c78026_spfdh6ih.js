let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var idnumber = request.idnumber;
    var queryBody = "select * from st.pickingrequisition.PickingRequisitionDetail where requisitionId='" + idnumber + "'";
    var bodyres = ObjectStore.queryByYonQL(queryBody);
    if (bodyres.length > 0) {
      for (var i = 0; i < bodyres.length; i++) {
        //项目id
        var project = bodyres[i].projectId;
        //物料id
        var product = bodyres[i].productId;
        //数量
        var qty = bodyres[i].quantity;
        //查询关系表主表
        var queryPro = "select id from GT65690AT1.GT65690AT1.prjMaterRelevance where dr=0 and project='" + project + "'";
        var prores = ObjectStore.queryByYonQL(queryPro, "developplatform");
        if (prores.length == 1) {
          //查询关系表子表
          var querySql = "select * from GT65690AT1.GT65690AT1.prjMaterRelevance_a where dr=0 and product='" + product + "' and prjMaterRelevance_id='" + prores[0].id + "'";
          var res = ObjectStore.queryByYonQL(querySql, "developplatform");
          if (res.length == 1) {
            var olduseshuliang = 0;
            if (res[0].useshuliang !== undefined) {
              olduseshuliang = res[0].useshuliang;
            }
            var shuliang = 0;
            if (res[0].shuliang !== undefined) {
              shuliang = res[0].shuliang;
            }
            var newuseshuliang = olduseshuliang + qty;
            let func1 = extrequire("ST.backDefaultGroup.getApitoken");
            let resToken = func1.execute();
            var token = resToken.access_token;
            let contenttype = "application/json;charset=UTF-8";
            let header = {
              "Content-Type": contenttype
            };
            var body = { useshuliang: newuseshuliang, tableName: "GT65690AT1.GT65690AT1.prjMaterRelevance_a", formcode: "d99047a0", id: res[0].id };
            let getExchangerate = "https://www.example.com/" + token;
            let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
            let rateresponseobj = JSON.parse(rateResponse);
          }
        }
      }
    }
    return { bodyres };
  }
}
exports({ entryPoint: MyAPIHandler });