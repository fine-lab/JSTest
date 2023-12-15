let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute() {
    try {
      var result = ObjectStore.queryByYonQL("select id from AT17AF88F609C00004.AT17AF88F609C00004.riskDetail");
      var res = ObjectStore.deleteBatch("AT17AF88F609C00004.AT17AF88F609C00004.riskDetail", result, "ybff4defab");
      //获取风险条例
      var sql =
        "select  " +
        "t2.zhibiao zhibiao, " +
        "t2.qijianweidu qijianweidu, " +
        "t2.bijiao bijiao, " +
        "t2.tiaojian tiaojian, " +
        "t2.zhi zhi, " +
        "t2.danwei danwei, " +
        "t2.qimoweidu qimoweidu, " +
        "t2.luoji luoji, " +
        "t2.zhangbu zhangbu, " +
        "bianma ," +
        "path , " +
        "id , " +
        "isEnd , " +
        "name , " +
        "guanlianzhuti ," +
        "guanlianzhutisousuoshu ," +
        "zhuangtai ," +
        "fengxianbiaoqian  " +
        "from AT17AF88F609C00004.AT17AF88F609C00004.ipoRiskMng  " +
        "inner join " +
        "AT17AF88F609C00004.AT17AF88F609C00004.ipoRiskList t2 on id = t2.ipoRiskMng_id ";
      var riskDatas = ObjectStore.queryByYonQL(sql);
      //主题
      var zhuti = new Map();
      zhuti.set("1", "关联交易");
      zhuti.set("2", "资金分析");
      zhuti.set("3", "收入分析");
      zhuti.set("4", "利润分析");
      zhuti.set("5", "资产分析");
      zhuti.set("6", "负债分析");
      zhuti.set("7", "成本费用");
      zhuti.set("8", "客户与供应商");
      //指标
      var zhibiao = new Map();
      zhibiao.set("1", "营业收入");
      zhibiao.set("2", "营业利润");
      zhibiao.set("3", "净利润");
      zhibiao.set("4", "毛利润");
      zhibiao.set("5", "经营性净现金流");
      zhibiao.set("6", "投资性净现金流");
      zhibiao.set("7", "筹资性净现金流");
      zhibiao.set("8", "成本金额");
      zhibiao.set("9", "费用金额");
      //条件
      var tiaojian = new Map();
      tiaojian.set("1", " = ");
      tiaojian.set("2", " != ");
      tiaojian.set("3", " > ");
      tiaojian.set("4", " >= ");
      tiaojian.set("5", " < ");
      tiaojian.set("6", " <= ");
      //逻辑
      var luoji = new Map();
      luoji.set("1", " || ");
      luoji.set("2", " && ");
      luoji.set("3", " ! ");
      //功能划分  手动加类
      var funcMap = new Map();
      funcMap.set("关联交易", "");
      funcMap.set("资金分析", "AT17AF88F609C00004.financeAnalysis.cashRisk");
      funcMap.set("收入分析", "AT17AF88F609C00004.incomeAnalysis.incomeRisk");
      funcMap.set("利润分析", "AT17AF88F609C00004.profitAnalysis.profitRisk");
      funcMap.set("资产分析", "AT17AF88F609C00004.assetAnalysis.assetRisk");
      funcMap.set("负债分析", "AT17AF88F609C00004.liabilityAnalysis.liabilitiesRisk");
      funcMap.set("成本费用", "AT17AF88F609C00004.costExpenses.costRisk");
      funcMap.set("客户与供应商", "");
      //风险条例划分
      var riskMap = new Map();
      riskDatas.forEach((item) => {
        var rkey = item.guanlianzhuti + ":" + item.path;
        if (riskMap.has(rkey)) {
          var list = riskMap.get(rkey);
          list.push(item);
          riskMap.set(rkey, list);
        } else {
          var data = [];
          data.push(item);
          riskMap.set(rkey, data);
        }
      });
      var str = JSON.stringify([...riskMap]);
      //根据不同主题调用不同方法
      var riskList = [];
      riskMap.forEach((value, key) => {
        if (value[0].zhuangtai == "1") {
          var strzhuti = key.split(":");
          let func = extrequire(funcMap.get(zhuti.get(strzhuti[0])));
          var flag = "";
          for (var i = 0; i < value.length; i++) {
            var period1 = value[i].qijianweidu;
            var period2 = value[i].qimoweidu;
            var param1 = {
              org: "2293903580617728", //会计主体ID,必填
              accbook: value[i].zhangbu, // 账簿
              period1: period1.substr(0, 7), //起始期间,必填
              period2: period2.substr(0, 7) //结束期间,必填
            };
            let funres = func.execute(param1); //实际数据
            //加逻辑  逻辑顺序不对怎么办呢？？？
            funres.resultList.forEach((mes) => {
              if (value[i].zhibiao == mes.zhibiao) {
                if (value[i].hasOwnProperty("luoji")) {
                  flag += mes.zhi + tiaojian.get(value[i].tiaojian) + value[i].zhi + luoji.get(value[i].luoji);
                } else {
                  flag += mes.zhi + tiaojian.get(value[i].tiaojian) + value[i].zhi;
                }
              }
            });
          }
          //条件是否成立判断
          var risk = {};
          if (eval(flag)) {
            //成立
            risk = {
              fengxianbianma: value[0].bianma,
              fengxianjiankangzhuangtai: "不健康",
              fengxianleibie: zhuti.get(value[0].guanlianzhuti),
              fengxianshixiang: value[0].zhibiao,
              fengxianzhuti: value[0].fengxianbiaoqian
            };
          } else {
            //不成立
            risk = {
              fengxianbianma: value[0].bianma,
              fengxianjiankangzhuangtai: "健康",
              fengxianleibie: zhuti.get(value[0].guanlianzhuti),
              fengxianshixiang: value[0].zhibiao,
              fengxianzhuti: value[0].fengxianbiaoqian
            };
          }
          riskList.push(risk);
        }
      });
      var res = ObjectStore.insert("AT17AF88F609C00004.AT17AF88F609C00004.riskDetail", riskList, "ybff4defab");
      return { zhibiaoTreeDatas };
    } catch (e) {
      throw new Error("riskMonitoring报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });