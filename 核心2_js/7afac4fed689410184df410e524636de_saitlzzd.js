let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查询转换卡主表数据
    var sql = "select * from GT5646AT1.GT5646AT1.conversioncard";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    var list = [];
    for (var i = 0; i < result.length; i++) {
      // 获取转换卡主表菜品编码(物料Id)
      var disCode = result[i].dishescode;
      // 获取转换卡主表的主键
      var id = result[i].id;
      // 根据转化卡子表的外键等于主表的主键查询转化卡子表数据(关联实际品项列表)
      var sqlSon = "select * from GT5646AT1.GT5646AT1.Relatedtoactualproduct where conversioncard_id = " + id + "";
      var resultSon = ObjectStore.queryByYonQL(sqlSon);
      var resultMap = {};
      // 转化卡主表菜品编码作为key,子表集合作为value返回
      resultMap[disCode] = resultSon;
      list.push(resultMap);
    }
    return { list };
  }
}
exports({ entryPoint: MyAPIHandler });