let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let myYonqlUtil = new Object();
    //定义一些查询函数
    {
      myYonqlUtil.queryStoreInByCode = function (code) {
        let sql = " select * from st.storein.StoreIn where code = '" + code + "'";
        var res = ObjectStore.queryByYonQL(sql, "ustock");
        return res;
      };
    }
    var object = { memo: "00" };
    var res = ObjectStore.selectByMap("GT13847AT1.GT13847AT1.zc_diaobochayi_test12312", object);
    let rs = {
      code: 200,
      message: "",
      data: {
        sucess_num: 0
      }
    };
    {
      rs.data.res = "";
    }
    return rs;
  }
}
exports({ entryPoint: MyAPIHandler });