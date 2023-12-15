let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    function getValue(data, map) {
      if (data !== map && map !== null) {
        return map;
      } else {
        return data;
      }
    }
    //时间转换
    function formatDate(date) {
      var dates = new Date(date);
      var YY = dates.getFullYear() + "-";
      var MM = (dates.getMonth() + 1 < 10 ? "0" + (dates.getMonth() + 1) : datesgetMonth() + 1) + "-";
      var DD = dates.getDate() < 10 ? "0" + dates.getDate() : dates.getDate();
      var hh = (dates.getHours() < 10 ? "0" + dates.getHours() : dates.getHours()) + ":";
      var mm = (dates.getMinutes() < 10 ? "0" + dates.getMinutes() : dates.getMinutes()) + ":";
      var ss = dates.getSeconds() < 10 ? "0" + dates.getSeconds() : dates.getSeconds();
      return YY + MM + DD + " " + hh + mm + ss;
    }
    //查询原单据数据
    let sql1 = "select * from st.storein.StoreIn where id=" + pdata.id;
    var res1 = ObjectStore.queryByYonQL(sql1, "ustock");
    let sql2 = "select * from st.storein.StoreInDetail where mainid=" + res1[0].id;
    var res2 = ObjectStore.queryByYonQL(sql2, "ustock");
    var data = pdata;
    data.id = res1[0].id;
    data.outorg = getValue(pdata.outorg, res1[0].outorg);
    data.code = getValue(pdata.code, res1[0].code);
    data.outaccount = getValue(pdata.outaccount, res1[0].outaccount);
    data.vouchdate = getValue(pdata.vouchdate, res1[0].vouchdate);
    data.bustype = getValue(pdata.bustype, res1[0].bustype);
    data.bizType = getValue(pdata.bizType, res1[0].bizType);
    data.breturn = getValue(pdata.breturn, res1[0].breturn);
    data.outwarehouse = getValue(pdata.outwarehouse, res1[0].outwarehouse);
    data.inorg = getValue(pdata.inorg, res1[0].inorg);
    data.inaccount = getValue(pdata.inaccount, res1[0].inaccount);
    data.inwarehouse = getValue(pdata.inwarehouse, res1[0].inwarehouse);
    data.inwarehouse_iSerialManage = false;
    data.warehouse_isGoodsPosition = false;
    data.pubts = null;
    data["_status"] = "Update";
    var headItem = {
      id: pdata.id
    };
    var details = res2;
    var bodyItem = { id: res2[0].id };
    details[0]["bodyItem"] = bodyItem;
    details[0]["_status"] = "Update";
    var st_storein_sn = [
      {
        id: res1[0].id,
        sn: res2[0].id,
        _status: "Update"
      }
    ];
    data["headItem"] = headItem;
    data["details"] = details;
    data["st_storein_sn"] = st_storein_sn;
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
exports({ entryPoint: MyTrigger });