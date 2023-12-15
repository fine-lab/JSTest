let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var idnumber = request.idnumber;
    var queryBody = "select * from st.pickingrequisition.PickingRequisitionDetail where requisitionId='" + idnumber + "'";
    var bodyres = ObjectStore.queryByYonQL(queryBody, "ustock");
    if (bodyres.length > 0) {
      var rowsMap = new Map();
      for (var i = 0; i < bodyres.length; i++) {
        //项目id
        var project = bodyres[i].projectId;
        //物料id
        var product = bodyres[i].productId;
        //数量
        var quantity = bodyres[i].quantity;
        if (rowsMap.has(product + "" + project)) {
          var ss = rowsMap.get(product + "" + project);
          quantity = quantity + ss.quantity;
          bodyres[i].quantity = quantity;
          rowsMap.set(product + "" + project, bodyres[i]);
        } else {
          rowsMap.set(product + "" + project, bodyres[i]);
        }
      }
      var datas = new Array();
      for (var key of rowsMap.keys()) {
        var newdata = rowsMap.get(key);
        //项目id
        var project = newdata.projectId;
        //物料id
        var product = newdata.productId;
        //出库申请子表数量
        var oldqty = newdata.quantity;
        //查询关系表主表
        var queryPro = "select id from GT65690AT1.GT65690AT1.prjMaterRelevance where dr=0 and project='" + project + "'";
        var prores = ObjectStore.queryByYonQL(queryPro, "developplatform");
        if (prores.length === 1) {
          //查询关系表子表
          var querySql = "select * from GT65690AT1.GT65690AT1.prjMaterRelevance_a where dr=0 and product='" + product + "' and prjMaterRelevance_id='" + prores[0].id + "'";
          var res = ObjectStore.queryByYonQL(querySql, "developplatform");
          if (res.length == 1) {
            var useshuliang = 0;
            if (res[0].useshuliang !== undefined) {
              useshuliang = res[0].useshuliang;
            }
            var shuliang = 0;
            if (res[0].shuliang !== undefined) {
              shuliang = res[0].shuliang;
            }
            if (useshuliang - oldqty < 0) {
              throw new Error("还原物料【" + res[0].product_name + "】对应的关系表子表【使用数量】错误，数据还原后小于0");
            }
            if (shuliang < useshuliang - oldqty) {
              throw new Error("还原物料【" + res[0].product_name + "】对应的关系表子表【使用数量】错误，数据还原后大于【数量】");
            }
            var newuseshuliang = useshuliang - oldqty;
            var data = {
              id: res[0].id,
              useshuliang: newuseshuliang + ""
            };
            datas.push(data);
          }
        }
        if (datas.length > 0) {
          let func1 = extrequire("ST.backDefaultGroup.getApitoken");
          let resToken = func1.execute();
          var token = resToken.access_token;
          let contenttype = "application/json;charset=UTF-8";
          let header = {
            "Content-Type": contenttype
          };
          var body = { datas: datas };
          let getExchangerate = "https://www.example.com/" + token;
          let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
          let rateresponseobj = JSON.parse(rateResponse);
          if (rateresponseobj.code != "200") {
            throw new Error("还原关系表子表【使用数量】错误，" + rateresponseobj.message);
          }
        }
      }
    }
    return { bodyres };
  }
}
exports({ entryPoint: MyAPIHandler });