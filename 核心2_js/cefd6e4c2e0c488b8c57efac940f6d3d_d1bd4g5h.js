let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { context: { CultureName: "zh-CN", EntCode: "1", OrgCode: "108401", UserCode: "BIP" }, opType: "GetAddress", jsonData: '{"AddressType":"省","ModifiedOn":"2022-01-06"}' };
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    var resData = JSON.parse(strResponse);
    var afDatas = JSON.parse(resData.d);
    var shengData = afDatas.PROVINCE;
    const dataArr = [];
    var datas = {};
    for (var i = 0; i < shengData.length; i++) {
      datas = { code: "" + shengData[i].Code + "", name: "" + shengData[i].Name + "" };
      dataArr.push(datas);
    }
    var res = ObjectStore.insertBatch("AT16388E3408680009.AT16388E3408680009.province", dataArr, "ybfde8f288");
    return { sss: res };
  }
}
exports({ entryPoint: MyAPIHandler });