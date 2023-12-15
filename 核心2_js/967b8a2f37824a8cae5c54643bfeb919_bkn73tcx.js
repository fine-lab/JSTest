let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取上月所有合同号
    var dateData = getData();
    //查询当月报告合同号及部门
    var sqlCode = "select distinct ziduan2,dept_name from GT59740AT1.GT59740AT1.RJ01 where " + " isCost!=1 and baogaori between '" + dateData.data.startDate + "' and '" + dateData.data.endDate + "'";
    var htCodeList = ObjectStore.queryByYonQL(sqlCode);
    var result = [];
    let func6 = extrequire("GT62395AT3.backDefaultGroup.getCBGJdata");
    let func5 = extrequire("GT59740AT1.backDefaultGroup.updatejzResult");
    let func4 = extrequire("GT59740AT1.backDefaultGroup.addcbjz");
    let func3 = extrequire("GT62395AT3.backDefaultGroup.getBeforeCbjzMoney");
    let func2 = extrequire("GT62395AT3.backDefaultGroup.getBalanceQuery");
    let func1 = extrequire("GT59740AT1.backDefaultGroup.getXMdata");
    //当前会计月
    let dqkjqj = substring(dateData.data.startDate, 0, 7);
    //上期会计月
    let beforedate = getBeforeData(dateData.data.startDate);
    let beforekjqj = beforedate.data.month;
    if (htCodeList.length > 0) {
      for (var i = 0; i < htCodeList.length; i++) {
        //报告合同号
        var ziduan2 = htCodeList[i].ziduan2;
        var dept_name = htCodeList[i].dept_name;
        var benqisql =
          "select * from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" +
          ziduan2 +
          "'" +
          " and dept_name='" +
          dept_name +
          "' and baogaori between '" +
          dateData.data.startDate +
          "' and '" +
          dateData.data.endDate +
          "'";
        //按照合同号、部门查找当月对应的报告数据
        var bqhtDataList = ObjectStore.queryByYonQL(benqisql);
        var totalsql = "select * from GT59740AT1.GT59740AT1.RJ01 where ziduan2='" + ziduan2 + "'" + " and dept_name='" + dept_name + "'";
        //按照合同号、部门查找所有对应的报告数据
        var totalhtDataList = ObjectStore.queryByYonQL(totalsql);
        let xmList = func1.execute(ziduan2);
        //根据合同号，会计期间查询成本归集主表信息
        let cbgjdata = func6.execute(dqkjqj, ziduan2);
        let mainID = cbgjdata.id;
        result.push(mainID);
        let xmtype = undefined;
        let httotalMoney = undefined;
        let ystitalMoney = undefined;
        if (xmList !== "undefined") {
          let xmresult = xmList.xmList;
          let xm = xmresult[0];
          xmtype = xm.classifyid_name;
          let defines = xm.defineCharacter;
          httotalMoney = defines.attrext6;
          ystitalMoney = defines.attrext14;
          if (xmtype === "undefined" || httotalMoney === "undefined" || ystitalMoney === "undefined") {
            let resultBg = {
              jzCode: 0,
              jzxmCode: ziduan2,
              message: "当前合同未设定合同类型或者未设定合同总金额以及合同预算基金"
            };
            result.push(resultBg);
            continue;
          }
        } else {
          let resultBg = {
            jzCode: 0,
            jzxmCode: ziduan2,
            message: "当前合同在合同列表中未找到"
          };
          result.push(resultBg);
          continue;
        }
        let cbjzje = 0;
        //本期出具报告金额
        let bqbgMoney = 0;
        //总出具报告金额
        let totalBgMoney = 0;
        //本期签收报告金额
        let bqqsbgMoney = 0;
        //上期已发生总成本
        let sqyfstotalMoney = 0;
        //上期已结转成本
        let sqyjzcb = 0;
        //本期发生成本
        let bqyfscb = 0;
        //累计已签收报告金额
        let ljyqsbgje = 0;
        //单价合同执行算法
        if (
          ((dept_name == "地基一部" || dept_name == "地基二部" || dept_name == "监测部" || dept_name == "结构部" || dept_name == "路桥部") && xmtype == "单价合同") ||
          (dept_name == "材料部" && (xmtype == "单价合同" || xmtype == "常规合同"))
        ) {
          if (bqhtDataList.length > 0) {
            for (var i = 0; i < bqhtDataList.length; i++) {
              var bqdata = bqhtDataList[i];
              if (bqdata.baogaori != "") {
                bqbgMoney += bqdata.baogaojine;
              }
              if (bqdata.qianshouri != "") {
                bqqsbgMoney += bqdata.baogaojine;
              }
            }
          }
          if (totalhtDataList.length > 0) {
            for (var i = 0; i < totalhtDataList.length; i++) {
              var totaldata = totalhtDataList[i];
              if (totaldata.baogaori != "") {
                totalBgMoney += totaldata.baogaojine;
              }
              if (totaldata.qianshouri != "") {
                ljyqsbgje += totaldata.baogaojine;
              }
            }
          }
          //科目全景查询上期结余(会计期间+合同编码)
          let sqdate = func2.execute(beforekjqj, ziduan2);
          //科目全景查询本期结余及发生额(会计期间+合同编码)
          let bqdate = func2.execute(dqkjqj, ziduan2);
          sqyfstotalMoney = sqdate.dataMoney.BalanceMoney;
          bqyfscb = bqdate.dataMoney.CurrentamountMoney;
          //在成本归集中查询上期该部门的成本结转金额
          let sqyjzcbMoney = func3.execute(beforekjqj, dept_name, ziduan2);
          sqyjzcb = sqyjzcbMoney.sqjzmonry;
          //本期签收报告金额/（总出具报告金额-累计已签收报告金额+本期出具报告金额）*（上期结存成本（上期已发生总成本-上期已结转成本）+本期发生成本）
          if (totalBgMoney - ljyqsbgje + bqbgMoney !== 0) {
            cbjzje = MoneyFormatReturnBd((bqqsbgMoney / (totalBgMoney - ljyqsbgje + bqbgMoney)) * (sqyfstotalMoney - sqyjzcb + bqyfscb), 2);
          }
        } else if ((dept_name == "地基一部" || dept_name == "地基二部" || dept_name == "监测部" || dept_name == "结构部" || dept_name == "路桥部") && xmtype == "常规合同") {
          //常规合同执行算法
          if (bqhtDataList.length > 0) {
            for (var i = 0; i < bqhtDataList.length; i++) {
              var bqdata = bqhtDataList[i];
              if (bqdata.qianshouri != "") {
                bqqsbgMoney += bqdata.baogaojine;
              }
            }
          }
          //是否末期
          let isLast = false;
          if (bqhtDataList.length > 0) {
            a: for (var i = 0; i < bqhtDataList.length; i++) {
              var bqdata = bqhtDataList[i];
              if (bqdata.isEnd == "1") {
                isLast = true;
                break a;
              }
            }
          }
          if (isLast) {
            //科目全景查询本期结余及发生额(会计期间+合同编码)
            let dqsjgjcb = func2.execute(dqkjqj, ziduan2);
            let dqsjgjcbMoney = dqsjgjcb.dataMoney.BalanceMoney;
            cbjzje = MoneyFormatReturnBd((bqqsbgMoney / httotalMoney) * dqsjgjcbMoney, 2);
          } else {
            cbjzje = MoneyFormatReturnBd((bqqsbgMoney / httotalMoney) * ystitalMoney, 2);
          }
        } else if ((dept_name == "地基一部" || dept_name == "地基二部" || dept_name == "监测部" || dept_name == "结构部" || dept_name == "路桥部" || dept_name == "材料部") && xmtype == "包干合同") {
          //总包干合同执行算法
          //是否末期
          let isLast = false;
          if (bqhtDataList.length > 0) {
            a: for (var i = 0; i < bqhtDataList.length; i++) {
              var bqdata = bqhtDataList[i];
              if (bqdata.isEnd == "1") {
                isLast = true;
                break a;
              }
            }
          }
          if (isLast) {
            let zbghtmoney = func2.execute(dqkjqj, ziduan2);
            cbjzje = zbghtmoney.dataMoney.BalanceMoney;
          }
        }
        let cbjzdata = {
          cbjzMoney: cbjzje,
          deptName: dept_name,
          main_Id: mainID,
          httotalMoney: httotalMoney,
          ystitalMoney: ystitalMoney
        };
        let addcbjzMoney = func4.execute(cbjzdata);
        result.push(addcbjzMoney);
        let updateData = {
          ziduan2: ziduan2,
          dept_name: dept_name,
          baogaori_str: dateData.data.startDate,
          baogaori_end: dateData.data.endDate
        };
        let updatejzcbMoney = func5.execute(updateData);
        result.push(updatejzcbMoney);
      }
    }
    return { result };
    //获取上个月开始结尾
    function getData() {
      var nowdays = new Date();
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var myDate = new Date(year, month, 0);
      var startDate = "2022-02-01 00:00:00";
      var endDate = "2022-02-28 23:59:00";
      var data = {
        startDate: startDate,
        endDate: endDate
      };
      return { data };
    }
    function getBeforeData(date) {
      var nowdays = new Date(date);
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var myDate = new Date(year, month, 0);
      var monthdate = year + "-" + month; //上个月
      var data = {
        month: monthdate
      };
      return { data };
    }
  }
}
exports({ entryPoint: MyAPIHandler });