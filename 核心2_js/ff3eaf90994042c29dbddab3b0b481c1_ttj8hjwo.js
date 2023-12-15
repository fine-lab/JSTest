let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //更具 财务的三大报表取数插入到对应的数据当中
    //查询 资产负债表数据 3075DCE7-B15A-4AA6-A3E6-B0E96D23204F-> 杭州假日国际旅游有限公司
    console.log("=====开始进行数据取数任务====");
    throw new error("=====开始进行数据取数任务====");
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var kjdate = param.kjdate;
    if (!kjdate) {
      kjdate = year + "00" + month;
    }
    finseDataVO.kjdate = "20200008";
    finseDataVO.suodeshuifeiyong = 100.154;
    finseDataVO.lirunzonge = 100.154;
    finseDataVO.yingyewaishouru = 100.154;
    finseDataVO.yingyewaizhichu = 100.154;
    finseDataVO.qitashouyi = 100.154;
    finseDataVO.jcktqsy = 100.154;
    finseDataVO.yanfafeiyong = 100.154;
    finseDataVO.zichanzongji = 1012120.154;
    //将数据插入数据库
    var res = ObjectStore.insert("GT23468AT1.GT23468AT1.gl_finservice_f203", finseDataVO, "edcb8a01");
    resMessage.dataRes = res;
    return { resMessage };
  }
}
exports({ entryPoint: MyTrigger });