let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //更具 财务的三大报表取数插入到对应的数据当中
    //查询 资产负债表数据 3075DCE7-B15A-4AA6-A3E6-B0E96D23204F-> 杭州假日国际旅游有限公司
    console.log("=====开始进行数据取数任务====");
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
    let resMessage = new Object();
    let body = { accbook: "3075DCE7-B15A-4AA6-A3E6-B0E96D23204F", period: "2020-08" };
    let url = "https://www.example.com/";
    //获取资产负债表数据
    let apiResponse = JSON.parse(openLinker("POST", url, "GT23468AT1", JSON.stringify(body)));
    resMessage.firpt = apiResponse;
    //模拟数据
    let finseDataVO = new Object();
    if (apiResponse && apiResponse.code == 200) {
      let items = apiResponse.data && apiResponse.data.items;
      items.forEach((item) => {
        switch (item.name) {
          case "资产总计":
            finseDataVO.zichanzongji = item.TERMINAL;
            break;
          case "负债合计":
            finseDataVO.fuzhaiheji = item.TERMINAL;
            break;
          case "所有者权益合计":
            finseDataVO.syzqyhj = item.TERMINAL;
            break;
        }
      });
    }
    //获取利润表数据
    url = "https://www.example.com/";
    apiResponse = JSON.parse(openLinker("POST", url, "GT23468AT1", JSON.stringify(body)));
    resMessage.profit = apiResponse;
    if (apiResponse && apiResponse.code == 200) {
      let items = apiResponse.data && apiResponse.data.items;
      items.forEach((item) => {
        switch (item.name) {
          case "营业收入":
            finseDataVO.yingyeshouru = item.GRAND;
            break;
          case "营业成本":
            finseDataVO.yingyechengben = item.GRAND;
            break;
          case "税金及附加":
            finseDataVO.shuijinjifujia = item.GRAND;
            break;
          case "销售费用":
            finseDataVO.xiaoshoufeiyong = item.GRAND;
            break;
          case "管理费用":
            finseDataVO.guanlifeiyong = item.GRAND;
            break;
          case "研发费用":
            finseDataVO.yanfafeiyong = item.GRAND;
            break;
          case "财务费用":
            finseDataVO.caiwufeiyong = item.GRAND;
            break;
          case "资产减值损失":
            finseDataVO.zichanjianzhisunshi = item.GRAND;
            break;
          case "信用减值损失":
            finseDataVO.xinyongjianzhisunshi = item.GRAND;
            break;
          case "公允价值变动收益":
            finseDataVO.gyjzbdsy = item.GRAND;
            break;
          case "资产处置收益":
            finseDataVO.zcczsy = item.GRAND;
            break;
          case "投资收益":
            finseDataVO.touzishouyi = item.GRAND;
            break;
          case "净敞口套期收益":
            finseDataVO.jcktqsy = item.GRAND;
            break;
          case "其他收益":
            finseDataVO.qitashouyi = item.GRAND;
            break;
          case "营业利润":
            finseDataVO.yingyelirun = item.GRAND;
            break;
          case "营业外收入":
            finseDataVO.yingyewaishouru = item.GRAND;
            break;
          case "营业外支出":
            finseDataVO.yingyewaizhichu = item.GRAND;
            break;
          case "利润总额":
            finseDataVO.lirunzonge = item.GRAND;
            break;
          case "所得税费用":
            finseDataVO.suodeshuifeiyong = item.GRAND;
            break;
        }
      });
    }
    finseDataVO.kjdate = "20200008";
    //将数据插入数据库
    var res = ObjectStore.insert("GT23468AT1.GT23468AT1.gl_finservice_f203", finseDataVO, "edcb8a01");
    resMessage.dataRes = res;
    return { resMessage };
  }
}
exports({ entryPoint: MyTrigger });