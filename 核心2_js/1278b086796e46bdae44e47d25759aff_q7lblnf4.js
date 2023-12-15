let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let jsonStringList = JSON.parse(param.requestData);
    var object = { id: jsonStringList[0].id };
    //实体查询
    var res = ObjectStore.selectById("GT72367AT17.GT72367AT17.yonggongshenqing1", object);
    var sql = "select gongzhong from GT72367AT17.GT72367AT17.yonggongshenqingzb1 where yonggongshenqing1_id = '" + jsonStringList[0].id + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var payBillbArray = [];
    for (var i = 0; i < res1.length; i++) {
      var map = {};
      var wuliaoSql = "select name,code from pc.product.Product where id = '" + res1[i].gongzhong + "'";
      var wuliaoRes1 = ObjectStore.queryByYonQL(wuliaoSql, "productcenter");
      map.material_code = wuliaoRes1[0].code;
      map.material_name = wuliaoRes1[0].name;
      if (i == 0) {
        map.taxRate = 1;
        map.natSum = res.zongjine;
        map.natMoney = res.zongjine - res.zongjine * 0.01;
        map.oriSum = res.zongjine;
        map.oriMoney = res.zongjine - res.zongjine * 0.01;
        map.oriTax = res.zongjine * 0.01;
      } else {
        map.taxRate = 0;
        map.natSum = 0;
        map.natMoney = 0;
        map.oriSum = 0;
        map.oriMoney = 0;
        map.oriTax = 0;
      }
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
          supplier_code: res.gongyingshangbianma,
          currency: "2560400749976320",
          natCurrency: "2560400749976320",
          exchRate: 1,
          project_code: res.xiangmubianma,
          project_name: res.xiangmu,
          tradetype_code: "07",
          _status: "Insert",
          oapDetail: payBillbArray,
          "headItem!define1": "发票",
          "headItem!id": 2645578107736320,
          "headItem!define4": res.danjuhao,
          "headfree!define1": "2596876309093120",
          "headfree!define1_null": "人工",
          "headfree!id": 2645578107736320
        }
      ]
    };
    //请求数据
    let base_path = "https://www.example.com/";
    let apiResponse = openLinker("post", base_path, "GT72367AT17", JSON.stringify(body));
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