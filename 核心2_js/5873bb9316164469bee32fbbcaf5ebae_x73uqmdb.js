let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //使用实体操作 批量查询单表数据
    //使用yonql组合查询 主子关系
    //没有主子关系  有关联关系
    //使用yonql子查询 不需要有关系
    //使用yonql关联查询 主子关系
    //获取用户信息
    //上面json为抓取的新增数据json
    //新增单条主子数据 创建人和创建时间系统会自动赋值
    //批量新增
    //更新实体 只更新主表
    //更新实体 只更新子表
    //更新实体 主子同时更新
    //更新实体 更新主表 子表数据删除后新增
    //更新实体 更新主表 子表数据有更新 也有删除后新增
    //批量更新实体 参照更新单个实体
    //根据wrapper条件更新实体  相对于以上按照主表id，wrapper可以按照主表自定义条件进行更新
    //删除实体
    //查询内容
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("GT79146AT92.GT79146AT92.funcStore", object, "upu");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });