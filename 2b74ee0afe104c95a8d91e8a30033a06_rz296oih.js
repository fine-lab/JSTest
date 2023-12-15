let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //声明返回信息
    var retData = {
      //是否成功的标识
      success: true,
      //错误信息
      message: "",
      data: []
    };
    //根据接口数据拼接查询条件，并将请求数据封装成map结构后续数据更新
    let condition = "";
    let dataMap = {};
    //根据查询条件，获取需要更新的库存信息实体
    let querySql = "select * from AT170EA44616400003.AT170EA44616400003.predictionStock";
    var res = ObjectStore.queryByYonQL(querySql);
    //遍历查询结果，对数据进行更新
    var resUpdateData = [];
    //调用实体操作，对实体进行更新
    var res = ObjectStore.updateBatch("AT170EA44616400003.AT170EA44616400003.predictionStock", resUpdateData, "predictionStock");
    //根据执行结果，构建返回值
    return { retData };
  }
}
exports({ entryPoint: MyTrigger });