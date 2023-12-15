let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //库存组织
    var accountOrg = request.accountOrg;
    //单据编号
    var code = request.code;
    //创建时间
    var createDate1 = request.createDate;
    var sj = new Date(createDate1);
    var year = sj.getFullYear();
    var month = sj.getMonth() + 1;
    var createDate = year.toString() + "-" + month.toString();
    //仓库
    var warehouse = request.warehouse;
    var accountOrg = accountOrg != undefined ? accountOrg : 0;
    var code = code != undefined ? code : 0;
    var createDate = createDate != undefined ? createDate : 0;
    var warehouse = warehouse != undefined ? warehouse : 0;
    //存储返回值的
    var values = new Array();
    if (accountOrg != 0 || code != 0 || createDate != 0 || warehouse != 0) {
      //交易类型  标准用料
      var sqlSelZ = "select * from st.materialout.MaterialOut where bustype = '1557377819104247842'";
      if (accountOrg != 0) {
        sqlSelZ = sqlSelZ + " and accountOrg='" + accountOrg + "'";
      }
      if (code != 0) {
        sqlSelZ = sqlSelZ + " and code='" + code + "'";
      }
      if (createDate != 0) {
        sqlSelZ = sqlSelZ + " and createDate like '" + createDate + "'";
      }
      if (warehouse != 0) {
        sqlSelZ = sqlSelZ + " and warehouse='" + warehouse + "'";
      }
      var resmain = ObjectStore.queryByYonQL(sqlSelZ, "ustock");
      for (var i = 0; i < resmain.length; i++) {
        var ids = resmain[i].id;
        var mainValue = resmain[i];
        //子表
        var sqlSelS = "select * from st.materialout.MaterialOuts where mainid ='" + resmain[i].id + "'";
        var sonValue = ObjectStore.queryByYonQL(sqlSelS, "ustock");
        var body = {
          mainValue,
          sonValue
        };
        values.push(body);
      }
    } else {
      //主表
      //交易类型  标准用料
      var sqlSelZ = "select * from st.materialout.MaterialOut where bustype = '1557377819104247842'";
      var resmain = ObjectStore.queryByYonQL(sqlSelZ, "ustock");
      for (var i = 0; i < resmain.length; i++) {
        var ids = resmain[i].id;
        var mainValue = resmain[i];
        //子表
        var sqlSelS = "select * from st.materialout.MaterialOuts where mainid ='" + resmain[i].id + "'";
        var sonValue = ObjectStore.queryByYonQL(sqlSelS, "ustock");
        var body = {
          mainValue,
          sonValue
        };
        values.push(body);
      }
    }
    return { values };
  }
}
exports({ entryPoint: MyAPIHandler });