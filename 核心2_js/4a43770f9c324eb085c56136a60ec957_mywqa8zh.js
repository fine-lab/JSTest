let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let s = request.responseData.bill;
    var warehouse = s.warehouse;
    var sql = "select * from aa.warehouse.Warehouse where id =" + warehouse;
    var fjrxx = ObjectStore.queryByYonQL(sql, "productcenter");
    var xxdz = fjrxx[0].address;
    var sheng = substring(xxdz, 0, 2); //省
    var shi = substring(xxdz, 0, 3);
    let param = {
      appid: "youridHere",
      sub_msg: "1111",
      orderid: s.code,
      receiver: {
        address: s.cReceiveAddress,
        province: s.cReceiveAddress,
        city: s.cReceiveAddress,
        name: s.modifier,
        county: s.cReceiveAddress,
        mobile: s.cReceiveMobile
      },
      sender: {
        address: xxdz,
        province: sheng,
        city: shi,
        name: fjrxx[0].linkman,
        county: shi,
        mobile: fjrxx[0].phone
      },
      backurl: "https://www.example.com/",
      sendstarttime: "2021-02-03 13:53:01"
    };
    let header = {
      "Content-Type": "application/json"
    };
    //调用韵达接口
    let url = "https://www.example.com/";
    let apiResponses = postman("post", url, JSON.stringify(header), JSON.stringify(param));
    let json = JSON.parse(apiResponses);
    return { json };
    s.kdh = json.orderid;
    //数据回写
    let func1 = extrequire("ST.backOpenApiFunction.updateXSCK");
    let bcdh = func1.execute(null, s);
    return { bcdh };
  }
}
exports({ entryPoint: MyAPIHandler });