let AbstractAPIHandler = require("AbstractAPIHandler");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let code = request.code;
    if (!id && !code) {
      throw new Error("id和code不可以同时为空！");
    }
    if (!id) {
      let sql = "select id from GT52668AT9.GT52668AT9.checkOrder where code = " + code;
      let temp = ObjectStore.queryByYonQL(sql);
      if (!temp) {
        throw new Error("没有查询到对应的检验单！");
      }
      request.id = temp[0].id;
    }
    //查询库存状态id
    if (request.checkconclusion) {
      let sql = "select id from st.stockStatusRecord.stockStatusRecord where statusName = " + request.checkconclusion;
      let temp = ObjectStore.queryByYonQL(sql, "ustock");
      if (temp) {
        request.checkconclusion = temp[0].id;
      }
    }
    //查询转换单交易类型id
    //查询其它出库交易类型id
    if (request.otheroutbusinesstype) {
      let otheroutbusinesstype = queryUtils.getIdByName("aa.businesstype.Businesstype", request.otheroutbusinesstype, "transtype");
      if (otheroutbusinesstype) {
        request.otheroutbusinesstype = otheroutbusinesstype;
      }
    }
    if (queryUtils.isEmpty(request.otheroutbusinesstype)) {
      throw new Error("其它出库单交易类型不能为空");
    }
    var res = ObjectStore.updateById("GT52668AT9.GT52668AT9.checkOrder", request, "checkOrder");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });