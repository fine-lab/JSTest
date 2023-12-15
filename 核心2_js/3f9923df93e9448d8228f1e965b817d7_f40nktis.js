let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    try {
      var queryResult = ObjectStore.queryByYonQL("select *from AT17AF88F609C00004.AT17AF88F609C00004.kjsubject");
      return { queryResult };
      if (queryResult != []) {
        var deleteRes = ObjectStore.deleteBatch("AT17AF88F609C00004.AT17AF88F609C00004.kjsubject", queryResult, "yb17a323ca");
      }
      var accountBook = context.accbook;
      // 获取科目表  通过科目表的id和会计科目的accsubjectchart做关联 查询科目表下的所有科目
      // 获取会计科目  名称，编码，accproperty会计要素id
      // 获取账簿表  获取该账簿所属的科目表，accsubjectchart是科目表id，id是该账簿的id
      // 获取会计要素  accelementType为会计科目类别 资产zc 负债fz 收入sr 费用fy  成本cb  共同gt 所有者权益syzqy
      // 将会计科目作为主表 ，通过accsubjectchart关联科目表 ，通过accproperty关联会计要素表， 通过accsubjectchart筛选账簿所属的科目表
      var sql =
        "select name as 科目名称,code as 科目编码 ,t1.name as 科目表名称," +
        "(CASE direction WHEN 'Debit' THEN '借' WHEN 'Credit' THEN '贷' ELSE '0' END) 方向 ," +
        "(CASE t2.accelementType " +
        "WHEN 'zc' THEN '资产'  " +
        "WHEN 'fz' THEN '负债'  " +
        "WHEN 'fy' THEN '费用'  " +
        "WHEN 'cb' THEN '成本'  " +
        "WHEN 'gt' THEN '共同'  " +
        "WHEN 'sr' THEN '收入'  " +
        "WHEN 'syzqy' THEN '所有者权益'  " +
        "ELSE '其他' END) 科目类别   " +
        "from epub.subject.AccSubject " +
        "left join epub.subject.AccSubjectchart t1 on accsubjectchart = t1.id " +
        "left join epub.basic.AccProperty t2 on accproperty = t2.id " +
        "where accsubjectchart in ( select accsubjectchart from epub.accountbook.AccountBook where id = '" +
        accountBook +
        "') ";
      var sqlResult = ObjectStore.queryByYonQL(sql, "fiepub");
      var res;
      let subjectList = [
        "ROE税费负债类税费",
        "ROE税费资产类税费",
        "ROE负债",
        "ROE资产",
        "ROE其他收益",
        "ROE费用期间费用",
        "ROE费用税金",
        "ROE费用其他损失",
        "ROE费用其他",
        "ROE营业外支出",
        "ROE营业外收入",
        "ROE营业成本",
        "ROE营业收入",
        "ROE费用总额",
        "资产负债类资产",
        "资产负债类负债",
        "成本费用类营业成本",
        "成本费用类费用总额",
        "利润类其他收益",
        "利润类资本",
        "利润类费用期间费用",
        "利润类费用税金",
        "利润类费用其他损失",
        "利润类费用其他",
        "利润类营业外支出",
        "利润类营业外收入",
        "利润类营业成本",
        "利润类营业收入",
        "利润类税费负债类税费",
        "利润类税费资产类税费",
        "收入类"
      ];
      subjectList.forEach((item) => {
        let allsubjectsList = [];
        sqlResult.forEach((sqlItem) => {
          let allsubject = {
            code: sqlItem.科目编码,
            name: sqlItem.科目名称,
            className: sqlItem.科目类别,
            subjectName: sqlItem.科目表名称,
            direct: sqlItem.方向
          };
          allsubjectsList.push(allsubject);
        });
        var object = [
          {
            className: item,
            allsubjectsList: allsubjectsList
          }
        ];
        res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.kjsubject", object, "yb17a323ca");
      });
      return { res };
    } catch (e) {
      throw new Error("执行脚本getAccSubject报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });