let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pdata = request.data;
    //新建一个数组用于搭配OpenApi要求的内部是个数组的格式并存储数据
    let ddataList = [];
    let ddata = {};
    //根据传来的ebs出库单编码（define10）查st.salesout.SalesOutCustomItem表中的id，就是出库单id
    let sql7 = "select id from st.salesout.SalesOutCustomItem where define10='" + pdata.code + "'";
    let res7 = ObjectStore.queryByYonQL(sql7, "ustock");
    ddata["id"] = res7[0].id;
    ddataList[0] = ddata;
    //调用OpenApi的删除接口执行删除方法
    var resdata = JSON.stringify(ddataList);
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      data: resdata
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res = func.execute("");
    var token2 = res.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=2ad36e417f2c4f8484705798808519d8"), JSON.stringify(header), JSON.stringify(body));
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("删除失败!" + obj.message);
    } else {
      //调用删除成功，抛出异常以阻断后续函数执行
      throw new Error("出库单删除成功");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });