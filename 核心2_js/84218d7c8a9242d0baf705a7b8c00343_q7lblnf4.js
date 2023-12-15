let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let jsonStringList = JSON.parse(param.requestData);
    var object = { id: jsonStringList[0].id };
    //实体查询
    var res = ObjectStore.selectById("GT86986AT50.GT86986AT50.qitafeiyongdan", object);
    var sql = "select Product,jine from GT86986AT50.GT86986AT50.qitafeiyongdanzb where qitafeiyongdan_id = '" + jsonStringList[0].id + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var payBillbArray = [];
    for (var i = 0; i < res1.length; i++) {
      var map = {};
      var wuliaoSql = "select name,code from pc.product.Product where id = '" + res1[i].Product + "'";
      var wuliaoRes1 = ObjectStore.queryByYonQL(wuliaoSql, "productcenter");
      map.material_code = wuliaoRes1[0].code;
      map.material_name = wuliaoRes1[0].name;
      map.taxRate = 1;
      map.natSum = res1[i].jine;
      map.natMoney = res1[i].jine - res1[i].jine * 0.01;
      map.oriSum = res1[i].jine;
      map.oriMoney = res1[i].jine - res1[i].jine * 0.01;
      map.oriTax = res1[i].jine * 0.01;
      map.supplier_name = "测试";
      map._status = "Insert";
      payBillbArray.push(map);
    }
    payBillbArray = distinctArrObj(payBillbArray);
    let body = {
      data: [
        {
          vouchdate: res.ziduan1,
          accentity_code: "A01",
          period: "2566292723995904",
          exchangeRateType_code: "01",
          supplier_code: res.gongyingshangbianma,
          currency: "2560400749976320",
          natCurrency: "2560400749976320",
          exchRate: 1,
          project_code: res.xiangmubianma,
          project_name: res.xiangmu,
          tradetype_code: "11",
          _status: "Insert",
          oapDetail: payBillbArray,
          "headItem!define1": "发票",
          "headItem!id": 2645578107736320,
          "headfree!define1": "2596876309093120",
          "headfree!define1_null": "人工",
          "headfree!id": 2645578107736320
        }
      ]
    };
    //请求数据
    let base_path = "https://www.example.com/";
    let apiResponse = openLinker("post", base_path, "GT86986AT50", JSON.stringify(body));
    let body1 = {
      data: [
        {
          vouchdate: res.ziduan1,
          accentity_code: "A01",
          period: "2566292723995904",
          exchangeRateType_code: "01",
          supplier_code: res.gongyingshangbianma,
          currency: "2560400749976320",
          natCurrency: "2560400749976320",
          exchRate: 1,
          project_code: res.xiangmubianma,
          project_name: res.xiangmu,
          tradetype_code: "12",
          _status: "Insert",
          oapDetail: payBillbArray,
          "headItem!define1": "发票",
          "headItem!id": 2645578107736320,
          "headfree!define1": "2596876309093120",
          "headfree!define1_null": "人工",
          "headfree!id": 2645578107736320
        }
      ]
    };
    let apiResponse1 = openLinker("post", base_path, "GT86986AT50", JSON.stringify(body1));
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