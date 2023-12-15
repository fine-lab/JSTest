let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let body = {
      pageIndex: 0,
      status: "purall",
      pageSize: ""
    };
    let apiResponse = openLinker("POST", url, "AT168516D809980006", JSON.stringify(body));
    let num = JSON.parse(apiResponse).data.data.result;
    for (let i = 0; i < num.length; i++) {
      //合同编码
      var value1 = JSON.parse(apiResponse).data.data.result[i].billno;
      //合同名称
      var value2 = JSON.parse(apiResponse).data.data.result[i].subject;
      //采购订单编号
      // 采购订单名称
      // 订单金额
      var value5 = JSON.parse(apiResponse).data.data.result[i].totalnum;
      //填写日期
      var value6 = JSON.parse(apiResponse).data.data.result[i].createTime;
      //采购合同名称
      var value7 = JSON.parse(apiResponse).data.data.result[i].title;
      var sql1 = " select * from AT168516D809980006.AT168516D809980006.purchaseContract where test111='" + value1 + "'";
      var res1 = ObjectStore.queryByYonQL(sql1);
      var object = { test111: value1, test222: value2, new5: value5, new6: value6, new7: value7 };
      if (res1.length == 0) {
        //新增
        var res = ObjectStore.insert("AT168516D809980006.AT168516D809980006.purchaseContract", object, "ybb43688c5List");
      } else {
        //更新
        var object1 = { id: res1[0].id, test222: value2, new5: value5, new6: value6, new7: value7 };
        var res = ObjectStore.updateById("AT168516D809980006.AT168516D809980006.purchaseContract", object1, "ybb43688c5");
      }
    }
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });