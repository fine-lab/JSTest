let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let jsonStringList = JSON.parse(param.requestData);
    var object = { id: jsonStringList[0].id };
    //实体查询
    var res = ObjectStore.selectById("GT74299AT32.GT74299AT32.lingxingjixiepgd", object);
    var sql = "select jine,wushuijine,shuie from GT74299AT32.GT74299AT32.lingxingjixiepgdzb where lingxingjixiepgd_id = '" + jsonStringList[0].id + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var payBillbArray = [];
    for (var i = 0; i < res1.length; i++) {
      var map = {};
      map.taxRate = res.shuilv;
      map.natSum = res1[i].jine;
      map.natMoney = res1[i].wushuijine;
      map.oriSum = res1[i].jine;
      map.oriMoney = res1[i].wushuijine;
      map.oriTax = res1[i].shuie;
      map.supplier_name = "测试";
      map._status = "Insert";
      payBillbArray.push(map);
    }
    payBillbArray = distinctArrObj(payBillbArray);
    let body = {
      data: [
        {
          vouchdate: res.riqi,
          accentity_code: "A01",
          period: "2566292723995904",
          exchangeRateType_code: "01",
          supplier_code: "9999000003",
          currency: "2560400749976320",
          natCurrency: "2560400749976320",
          exchRate: 1,
          tradetype_code: "10",
          _status: "Insert",
          oapDetail: payBillbArray,
          "headItem!define1": "机械派工单",
          "headItem!id": 2645578107736320,
          "headItem!define4": res.new9,
          "headfree!define1": "2596876409313280",
          "headfree!define1_null": "机械",
          "headfree!id": 2645578107736320
        }
      ]
    };
    //请求数据
    let base_path = "https://www.example.com/";
    let apiResponse = openLinker("post", base_path, "GT74299AT32", JSON.stringify(body));
    return { apiResponse };
    function distinctArrObj(arr) {
      var MyShow = typeof arr != "object" ? [arr] : arr; //确保参数总是数组
      for (let i = 0; i < MyShow.length; i++) {
        if (MyShow[i] === null || MyShow[i] === "" || JSON.stringify(MyShow[i]) === "{}") {
          MyShow.splice(i, 1);
          i = i - 1;
        }
      }
      return MyShow;
    }
  }
}
exports({ entryPoint: MyTrigger });