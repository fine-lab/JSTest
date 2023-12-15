let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var now = request.r;
    let body = { context: { CultureName: "zh-CN", EntCode: "1", OrgCode: "108401", UserCode: "BIP" }, opType: "GetAddress", jsonData: '{"AddressType":"镇","ModifiedOn":"2022-11-23"}' };
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "5976476309014519a627bde4ac43ddc7",
      appkey: "yourkeyHere"
    };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    var resData = JSON.parse(strResponse);
    var afDatas = JSON.parse(resData.d);
    var shengData = afDatas.STREET;
    //批量插入
    var dataArr = [];
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
    var res = ObjectStore.insertBatch("AT16388E3408680009.AT16388E3408680009.town", dataArr, "yb68b09181");
    return { sss: res };
  }
}
exports({ entryPoint: MyAPIHandler });