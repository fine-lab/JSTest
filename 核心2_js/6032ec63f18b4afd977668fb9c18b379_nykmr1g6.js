let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询主表数据
    //查询子表数据
    //查询批次号
    let batch = param.data[0].SY01_warehousedeList[0].picihao;
    if (typeof batch == "undefined") {
      throw new Error("xxx:" + param.data[0].SY01_warehousedeList[0].picihao);
    }
  }
}
exports({ entryPoint: MyTrigger });