let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 入参：党组织名称
    var mecName = request.mecName;
    // 根据入参党组织查询该党组织下所有党员数据
    var sql =
      "select dangzuzhiid.jianchen,xingming,rudangriqi,xueli from GT27287AT208.GT27287AT208.zs_Members  left join dangzuzhiid d on dangzuzhiid = d.id where dangzuzhiid.jianchen = '" + mecName + "' "; //+ mecName ;
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });