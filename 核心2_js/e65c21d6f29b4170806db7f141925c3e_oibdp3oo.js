let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { context: { CultureName: "zh-CN", EntCode: "2", OrgCode: "108401", UserCode: "demo" }, opType: "GetAddress", jsonData: '{"AddressType":"市","ModifiedOn":"2022-01-06"}' };
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "5976476309014519a627bde4ac43ddc7",
      appkey: "yourkeyHere"
    };
    const Rdata = JSON.stringify({
      context: { CultureName: "zh-CN", EntCode: "1", OrgCode: "108401", UserCode: "BIP" },
      opType: "GetAddress",
      jsonData: '{"AddressType":"省","ModifiedOn":"2022-11-23"}'
    });
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    var resData = JSON.parse(strResponse);
    var afDatas = JSON.parse(resData.d);
    var shengData = afDatas.CITY;
    //批量插入
    const dataArr = [];
    var datas = {};
    for (var i = 0; i < shengData.length; i++) {
      datas = {
        code: "" + shengData[i].Code + "",
        name: "" + shengData[i].Name + "",
        type: "" + shengData[i].Type + "",
        parentCode: "" + shengData[i].ParentCode + "",
        parentType: "" + shengData[i].ParentType + ""
      };
      dataArr.push(datas);
    }
    var res = ObjectStore.insertBatch("AT16388E3408680009.AT16388E3408680009.city", dataArr, "yb136bacbb");
    return { sss: shengData };
  }
}
exports({ entryPoint: MyAPIHandler });