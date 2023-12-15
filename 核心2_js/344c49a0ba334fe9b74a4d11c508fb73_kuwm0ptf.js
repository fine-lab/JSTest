let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      var result = ObjectStore.queryByYonQL("select id from AT17AF88F609C00004.AT17AF88F609C00004.subjectDetails");
      var res = ObjectStore.deleteBatch("AT17AF88F609C00004.AT17AF88F609C00004.subjectDetails", result, "ybe40ce903");
      //预置信息
      var initializationMap = new Map();
      initializationMap.set("ROE税费负债类税费", []);
      initializationMap.set("ROE税费资产类税费", []);
      initializationMap.set("ROE负债", []);
      initializationMap.set("ROE资产", []);
      initializationMap.set("ROE其他收益", []);
      initializationMap.set("ROE费用期间费用", []);
      initializationMap.set("ROE费用税金", []);
      initializationMap.set("ROE费用其他损失", []);
      initializationMap.set("ROE费用其他", []);
      initializationMap.set("ROE营业外支出", ["营业外支出"]);
      initializationMap.set("ROE营业外收入", ["营业外收入"]);
      initializationMap.set("ROE营业成本", ["主营业务成本", "其他业务支出"]);
      initializationMap.set("ROE营业收入", ["主营业务收入", "其他业务收入"]);
      initializationMap.set("ROE费用总额", []);
      initializationMap.set("资产负债类资产", [
        "库存现金",
        "银行存款",
        "其它货币资金",
        "交易性金融资产",
        "应收票据",
        "应收账款",
        "预付账款",
        "应收股利",
        "应收利息",
        "其他应收款",
        "坏账准备",
        "代理业务资产",
        "材料采购",
        "在途物资",
        "原材料",
        "材料成本差异",
        "库存商品"
      ]);
      initializationMap.set("资产负债类负债", [
        "短期借款",
        "交易性金融负债",
        "衍生金融负债",
        "应付票据",
        "应付账款",
        "预收款项",
        "合同负债",
        "应付职工薪酬",
        "应交税费",
        "其他应付款",
        "持有待售负债",
        "一年内到期的非流动负债",
        "其他流动负债"
      ]);
      initializationMap.set("成本费用类营业成本", ["主营业务成本", "其他业务支出"]);
      initializationMap.set("成本费用类费用总额", ["销售费用", "管理费用", "财务费用"]);
      initializationMap.set("利润类其他收益", ["公允价值变动损益", "投资收益", "其它收益"]);
      initializationMap.set("利润类资本", ["实收资本", "资本公积"]);
      initializationMap.set("利润类费用期间费用", ["销售费用", "管理费用", "财务费用"]);
      initializationMap.set("利润类费用税金", ["税金及附加"]);
      initializationMap.set("利润类费用其他损失", ["资产减值损失"]);
      initializationMap.set("利润类费用其他", ["利息费用"]);
      initializationMap.set("利润类营业外支出", ["营业外支出"]);
      initializationMap.set("利润类营业外收入", ["营业外收入"]);
      initializationMap.set("利润类营业成本", ["主营业务成本", "其他业务支出"]);
      initializationMap.set("利润类营业收入", ["主营业务收入", "其他业务收入"]);
      initializationMap.set("利润类税费负债类税费", ["递延所得税", "应交所得税"]);
      initializationMap.set("利润类税费资产类税费", ["递延所得税"]);
      initializationMap.set("收入类", ["主营业务收入", "其他业务收入"]);
      //获取所有会计科目并保存在map中
      var getKjsubject = {};
      var kjsubject = ObjectStore.selectByMap("AT17AF88F609C00004.AT17AF88F609C00004.kjsubject", getKjsubject);
      var kjsubjectMap = new Map();
      kjsubject.forEach((item) => {
        kjsubjectMap.set(item.className, item.id);
      });
      //获取全部层级并保存在map中
      var getsubjects = {};
      var subjects = ObjectStore.selectByMap("AT17AF88F609C00004.AT17AF88F609C00004.subjects", getsubjects);
      var subjectMap = new Map();
      subjects.forEach((item) => {
        subjectMap.set(item.id, item.className);
      });
      var subjectList = [];
      //获取科目总表所有的科目信息并保存在map中
      var getAllSubjects = {};
      var allSubjects = ObjectStore.selectByMap("AT17AF88F609C00004.AT17AF88F609C00004.allsubjects", getAllSubjects);
      var allSubjectMap = new Map();
      allSubjects.forEach((item) => {
        var key = item.kjsubject_id + item.name;
        allSubjectMap.set(key, item);
      });
      //获取到科目树最底层对应的会计科目名称
      subjects.forEach((item) => {
        if (item.isEnd) {
          var ids = item.path.substr(0, item.path.length - 1).split("|");
          var name = "";
          ids.forEach((id) => {
            name = name + subjectMap.get(id);
          });
          //获取预制科目
          var initSubjects = initializationMap.get(name);
          //会计科目id
          var subjectId = kjsubjectMap.get(name);
          initSubjects.forEach((subname) => {
            //获取会计科目下的科目详情
            var initJson = {};
            var key1 = subjectId + subname;
            if (allSubjectMap.has(key1)) {
              initJson = {
                subjects_id: item.id,
                selectId: allSubjectMap.get(key1).id,
                direct: allSubjectMap.get(key1).direct,
                code: allSubjectMap.get(key1).code,
                name: allSubjectMap.get(key1).name
              };
            }
            subjectList.push(initJson);
          });
        }
      });
      var res1 = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.subjectDetails", subjectList, "ybe40ce903");
      return { res1 };
    } catch (e) {
      throw new Error(e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });