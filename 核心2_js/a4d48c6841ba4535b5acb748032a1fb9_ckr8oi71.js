let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取时间
    var dates = request.date;
    //查询批次日存栏数据库
    var BatchDailySql = "select * from AT17604A341D580008.AT17604A341D580008.batchColumn where dr = 0 and tongjiriqi like '" + dates + "'";
    var BatchDailyRes = ObjectStore.queryByYonQL(BatchDailySql, "developplatform");
    function unique(arr) {
      // 第一层for循环控制第一个数
      for (let i1 = 0; i1 < arr.length; i1++) {
        // 第二层循环控制第二个数
        for (let j1 = i1 + 1; j1 < arr.length; j1++) {
          // 判断前后是否相等
          if (arr[i1].latitude === arr[j1].latitude) {
            arr.splice(j1, 1); //j：下标 1：删除个数
            // 后面的往前移一位
            j1--;
          }
        }
      }
    }
    var array = [];
    if (BatchDailyRes.length != 0) {
      for (var a = 0; a < BatchDailyRes.length; a++) {
        //猪只类型
        var NpigTP = BatchDailyRes[a].zhuzhileixing;
        //批次号
        var Npch = BatchDailyRes[a].picihao;
        var s = Npch + "-" + NpigTP;
        var BatchNumberSq = "select * from AT17604A341D580008.AT17604A341D580008.batchColumn where dr = 0 and tongjiriqi like '" + dates + "' and picihao = '" + Npch + "'";
        var BatchNumberRes = ObjectStore.queryByYonQL(BatchNumberSq, "developplatform");
        var summation = 0;
        if (BatchNumberRes.length != 0) {
          for (var a1 = 0; a1 < BatchNumberRes.length; a1++) {
            var n1 = BatchNumberRes[a1].zhuzhileixing;
            if (n1 === NpigTP) {
              var Nqmcl = BatchNumberRes[a1].qimocunlan;
              summation = summation + Nqmcl;
            }
          }
        }
        var NewSet = {
          picihao: Npch,
          qimocunlan: summation,
          zhuzhileixing: NpigTP,
          latitude: s
        };
        array.push(NewSet);
      }
    }
    unique(array);
    //查询当月价格
    var dateMoneySql = "select sum(AmountOfExpense) from AT17604A341D580008.AT17604A341D580008.Expense_sheet where dr = 0 and period like '" + dates + "'";
    var dateMoneyRes = ObjectStore.queryByYonQL(dateMoneySql, "developplatform");
    var money = 0;
    if (dateMoneyRes.length != 0) {
      money = dateMoneyRes[0].AmountOfExpense;
    }
    //组装计算费用
    var AllRes = [];
    if (BatchDailyRes.length != 0) {
      var value = 0;
      for (var i = 0; i < array.length; i++) {
        var zhuzlx = array[i].zhuzhileixing;
        var pigBzSql = "select * from AT17604A341D580008.AT17604A341D580008.ShareProportion where dr = 0 and zhuzhileixing = '" + zhuzlx + "'";
        var pigBzRes = ObjectStore.queryByYonQL(pigBzSql, "developplatform");
        var bzPrice = 0;
        if (pigBzRes.length != 0) {
          bzPrice = pigBzRes[0].bizhong;
        }
        var batxhID = array[i].picihao;
        var qimo = array[i].qimocunlan;
        var dyz = qimo * bzPrice;
        value = dyz + value;
        var body = {
          batxhID: batxhID,
          pigType: zhuzlx,
          proportion: bzPrice,
          NumberOfHeads: qimo,
          MotivationValue: dyz,
          SummaryofDriverValues: value
        };
        AllRes.push(body);
      }
    }
    //过滤相同的数据
    var tolValue = 0;
    if (AllRes != null) {
      for (var a = 0; a < AllRes.length; a++) {
        var ves = AllRes[a].MotivationValue;
        tolValue = tolValue + ves;
      }
    }
    return { AllRes: AllRes, money: money, tolValue: tolValue };
  }
}
exports({ entryPoint: MyAPIHandler });