let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var ywname = request.data.name;
    let sql = " select id, mD_YWLY.name as mD_YWLY_name from AT162B7B5E16700009.AT162B7B5E16700009.PM_ISSUES where G_WTLX='07' and mD_YWLY.name='" + ywname + "'";
    var res = ObjectStore.queryByYonQL(sql);
    for (let i = 0; i < res.length; i++) {
      let arrres = res[i];
      let id = arrres.id;
      let G_LY_GW_C_NAME = arrres.mD_YWLY_name; //领域名称
      let G_LY_GW = arrres.mD_YWLY;
      //查询新领域列表
      let sqlywly = "select id,C_NAME from AT162B7B5E16700009.AT162B7B5E16700009.MD_LY_LWH where C_NAME ='" + G_LY_GW_C_NAME + "'";
      var resywly = ObjectStore.queryByYonQL(sqlywly);
      if (resywly.length > 0) {
        for (let j = 0; j < resywly.length; j++) {
          let arrywly = resywly[j];
          let ywlyid = arrywly.id;
          let ywlyName = arrywly.C_NAME;
          var object = {
            id: id,
            G_LY_GW: ywlyid
          };
          var resultData = ObjectStore.updateById("AT162B7B5E16700009.AT162B7B5E16700009.PM_ISSUES", object);
          //批量更新
        }
      }
    }
    debugger;
    let resa = "成功查询";
    return { resa };
  }
}
exports({ entryPoint: MyAPIHandler });