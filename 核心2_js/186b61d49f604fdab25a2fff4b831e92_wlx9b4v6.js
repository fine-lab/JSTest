let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //内部流转单主键
    var entCust_name = request.entCust_name;
    //内部完结单主键
    var idnumber = request.idnumber;
    //查询内部流转单的个数和完结单个数，完结单个数<=流转单个数
    var lzdsql = "select id from GT60601AT58.GT60601AT58.serCenInnerCircu where  id =" + entCust_name;
    var lzdrst = ObjectStore.queryByYonQL(lzdsql);
    if (lzdrst.length === 0) {
      throw new Error("所选流转单数据在数据库中未查询到，请检查！");
    }
    var sql = 'select id from GT60601AT58.GT60601AT58.circulationFinish where innerStatus="3" and entCust_name = "' + entCust_name + '" ';
    var rst = ObjectStore.queryByYonQL(sql);
    if (idnumber === undefined && rst.length == lzdrst.length) {
      throw new Error("所选流转单在本次流转中已存在完结单数据，不可再次添加！");
    } else if (idnumber !== undefined && rst.length == lzdrst.length) {
      var isok = false;
      for (var i = 0; i < rst.length; i++) {
        if (idnumber == rst[i].id) {
          isok = true;
        }
      }
      if (!isok) {
        throw new Error("所选流转单在本次流转中已存在完结单数据，不可再次添加！");
      }
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });