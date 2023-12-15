let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, subjectType) {
    try {
      // 将一级节点的id和名称查询出来，此处可加where条件，筛选所需的五个大类（收入，利润，资产负债，成本费用，ROE）
      var sqlFirst = "select id ,className from AT17AF88F609C00004.AT17AF88F609C00004.subjects where level =1 and className = '" + subjectType + "'";
      var sqlFirstResult = ObjectStore.queryByYonQL(sqlFirst);
      // 定义一个list  用于存放一级，二级，三级所有节点的id和className，先把一级节点放进去
      var nodeList = sqlFirstResult;
      // 定义一个list  用于存放二级节点的id和className
      var sqlSecondResultList = [];
      sqlFirstResult.forEach((sqlFirstItem) => {
        // 将二级节点的id和名称查询出来（通过parent），将一级节点名称与二级节点名称拼起来
        let sqlSecond = "select id ,className from AT17AF88F609C00004.AT17AF88F609C00004.subjects where level =2 and parent = '" + sqlFirstItem.id + "'";
        let sqlSecondResult = ObjectStore.queryByYonQL(sqlSecond);
        sqlSecondResult.forEach((sqlSecondItem) => {
          let secondSubject = {
            id: sqlSecondItem.id,
            className: sqlFirstItem.className + sqlSecondItem.className
          };
          // 总list存放二级节点
          nodeList.push(secondSubject);
          // 存放二级节点的id和className
          sqlSecondResultList.push(secondSubject);
        });
      });
      // 定义一个list  用于存放三级节点的id和className
      var sqlThirdResultList = [];
      sqlSecondResultList.forEach((sqlSecondItem) => {
        // 将三级节点的id和名称查询出来（通过parent），将三级节点名称与二级节点名称拼起来
        let sqlThird = "select id ,className from AT17AF88F609C00004.AT17AF88F609C00004.subjects where level =3 and parent = '" + sqlSecondItem.id + "'";
        let sqlThirdResult = ObjectStore.queryByYonQL(sqlThird);
        sqlThirdResult.forEach((sqlThirdItem) => {
          let thirdSubject = {
            id: sqlThirdItem.id,
            className: sqlSecondItem.className + sqlThirdItem.className
          };
          // 总list存放三级节点
          nodeList.push(thirdSubject);
          // 存放三级节点的id和className
          sqlThirdResultList.push(thirdSubject);
        });
      });
      // 定义一个json对象用于存放所有类别下的科目以及其借贷方向
      var allType = {};
      // 定义一个codes的list  用于存放科目编码所有
      var codes = [];
      // 定义一个list  存放科目名称、编码、借贷方向  用于相关信息的使用
      var subject = [];
      // 将节点id作为关联条件，查询出来所有下述科目
      nodeList.forEach((nodeItem) => {
        let sql =
          "select name,code,direct from AT17AF88F609C00004.AT17AF88F609C00004.subjectDetails left join  AT17AF88F609C00004.AT17AF88F609C00004.subjects t1 on t1.id=subjects_id where subjects_id = '" +
          nodeItem.id +
          "'";
        let sqlResult = ObjectStore.queryByYonQL(sql);
        // 定义一个codeCredit的list 用于存放科目编码贷方
        let codeCredit = [];
        // 定义一个codeDebit的list  用于存放科目编码借方
        let codeDebit = [];
        sqlResult.forEach((sqlItem) => {
          codes.push(sqlItem.code);
          // 对借贷方向进行判断
          if (sqlItem.direct == "借") {
            subject.push({ name: sqlItem.name, code: sqlItem.code, direct: "debit" });
            codeDebit.push(sqlItem.code);
          } else {
            subject.push({ name: sqlItem.name, code: sqlItem.code, direct: "credit" });
            codeCredit.push(sqlItem.code);
          }
        });
        allType[nodeItem.className] = { codeDebit: codeDebit, codeCredit: codeCredit };
      });
      var res = { allType: allType, codes: codes, subject: subject };
      return { res };
    } catch (e) {
      throw new Error("执行脚本getSubjectType报错：" + e);
    }
  }
}
exports({ entryPoint: MyTrigger });