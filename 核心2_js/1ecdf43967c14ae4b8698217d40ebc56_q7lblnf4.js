let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let jsonStringList = JSON.parse(param.requestData);
    var object = { id: jsonStringList[0].id };
    //实体查询
    var res = ObjectStore.selectById("GT72690AT22.GT72690AT22.cailiaofukuandan", object);
    var sql = "select jine from GT72690AT22.GT72690AT22.cailiaofukuandanzibiao where cailiaofukuandan_id = '" + jsonStringList[0].id + "'";
    var res1 = ObjectStore.queryByYonQL(sql);
    var payBillbArray = [];
    for (var i = 0; i < res1.length; i++) {
      var map = {};
      map.quickType_code = "6";
      map.oriSum = res1[i].jine;
      map.natSum = res1[i].jine;
      map.supplier_name = res.ProjectVO;
      map._status = "Insert";
      payBillbArray.push(map);
    }
    payBillbArray = distinctArrObj(payBillbArray);
    let body = {
      data: [
        {
          vouchdate: res.riqi,
          accentity_code: "A01",
          exchangeRateType_code: "01",
          supplier_code: res.gongyingshangbianma,
          currency: "2560400749976320",
          natCurrency_priceDigit: "2",
          natCurrency_moneyDigit: "2",
          exchRate: "1",
          exchangeRateType_digit: "2",
          project_code: res.xaingmubianma,
          project_name: res.xiangmu,
          tradetype_code: "CLK",
          _status: "Insert",
          PayBillb: payBillbArray
        }
      ]
    };
    //请求数据
    let base_path = "https://www.example.com/";
    let apiResponse = openLinker("post", base_path, "GT72690AT22", JSON.stringify(body));
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