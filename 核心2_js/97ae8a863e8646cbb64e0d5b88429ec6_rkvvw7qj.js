let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var resquest = request;
    var datas = resquest["date"];
    //查询原单据数据
    let sql1 = "select * from st.storein.StoreIn where id=" + request["date"].id;
    var res1 = ObjectStore.queryByYonQL(sql1, "ustock");
    let sql2 = "select * from st.storein.StoreInDetail where mainid=" + res1[0].id;
    var res2 = ObjectStore.queryByYonQL(sql2, "ustock");
    var data = res1[0];
    data.inwarehouse_iSerialManage = false;
    data.warehouse_isGoodsPosition = false;
    data.pubts = null;
    data["_status"] = "Update";
    var headItem = {
      id: res1[0].id
    };
    var details = res2[0];
    var bodyItem = { id: res2[0].id };
    details["bodyItem"] = bodyItem;
    details["_status"] = "Update";
    var st_storein_sn = [
      {
        id: res1[0].id,
        sn: res1[0].id,
        _status: "Update"
      }
    ];
    if (!data.hasOwnProperty("headItem")) {
      data["headItem"] = headItem;
    }
    if (!data.hasOwnProperty("defines")) {
      data["defines"] = {};
    }
    data["details"] = details;
    if (!data.hasOwnProperty("st_storein_sn")) {
      data["st_storein_sn"] = st_storein_sn;
    }
    for (var key in datas) {
      if (key === "headItem" || key === "details" || key === "st_storein_sn" || key === "defines") {
        for (var key2 in datas[key]) {
          data[key][key2] = datas[key][key2];
        }
      } else {
        data[key] = datas[key];
      }
    }
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var pdatas = { data: data };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res_r = func.execute("");
    var token2 = res_r.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(pdatas));
    var strrr = JSON.stringify(pdatas);
    //加判断
    var obj = JSON.parse(apiResponse);
    var resp = obj.message;
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    }
    return { code: code };
  }
}
exports({ entryPoint: MyAPIHandler });