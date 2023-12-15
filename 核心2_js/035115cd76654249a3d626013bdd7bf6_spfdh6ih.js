let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    console.log(JSON.stringify(request));
    function updateDate(type, data) {
      //项目id
      var project = data.projectId;
      //物料id
      var product = data.productId;
      //数量
      var qty = data.quantity;
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
          var newuseshuliang = 0;
          if (type == "add") {
            newuseshuliang = olduseshuliang + qty;
          } else if (type == "delete") {
            newuseshuliang = olduseshuliang - qty;
          }
          var data = {
            id: res[0].id,
            useshuliang: newuseshuliang + ""
          };
          return data;
        }
      }
    }
    let func1 = extrequire("ST.backDefaultGroup.getApitoken");
    let resToken = func1.execute();
    var token = resToken.access_token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    //缓存数据
    var cachrows = request.cachrows;
    if (cachrows !== undefined) {
      var cachDatas = new Array();
      for (var i = 0; i < cachrows.length; i++) {
        var carchdata = updateDate("delete", cachrows[i]);
        if (carchdata != null) {
          cachDatas.push(carchdata);
        }
      }
      if (cachDatas.length > 0) {
        var carchbody = { datas: cachDatas };
        let getExchangerate = "https://www.example.com/" + token;
        let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(carchbody));
        let rateresponseobj = JSON.parse(rateResponse);
      }
    }
    //界面数据
    var rows = request.rows;
    var rowDatas = new Array();
    for (var j = 0; j < rows.length; j++) {
      var rowdata = updateDate("add", rows[j]);
      if (rowdata != null) {
        rowDatas.push(rowdata);
      }
    }
    if (rowDatas.length > 0) {
      var rowbody = { datas: rowDatas };
      let getExchangerate = "https://www.example.com/" + token;
      let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(rowbody));
      let rateresponseobj = JSON.parse(rateResponse);
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });