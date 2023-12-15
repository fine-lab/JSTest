let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //形态转换后反写形态转换单号到销售出库订单
    let func = extrequire("ST.backDefaultGroup.getToken");
    let resToken = func.execute();
    let token = resToken.access_token;
    //获取销售出库
    let xsckId = request.xsckId;
    let xtzhCode = request.xtzhCode;
    let getxsckDetail = "https://www.example.com/" + token + "&id=" + xsckId;
    let getXtzhUrl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    //销售出库修改形态转换单号
    let rst = "";
    let xsckDetailResponse = postman("GET", getxsckDetail, JSON.stringify(header), null);
    let xsckResponseobj = JSON.parse(xsckDetailResponse);
    if ("200" == xsckResponseobj.code) {
      let data = xsckResponseobj.data;
      let headDefine = {
        define1: xtzhCode,
        id: xsckId,
        _status: "Update"
      };
      data.headDefine = headDefine;
      data._status = "Update";
      let details = data.details;
      let detailsList = [];
      for (var i = 0; i < details.length; i++) {
        details[i]._status = "Update";
        details[i].stockUnit = details[i].stockUnitId;
      }
      data.resubmitCheckKey = replace(uuid(), "-", "");
      var datastr = replace(JSON.stringify(data), "headDefine!", "headDefine");
      var newData = JSON.parse(datastr);
      delete newData.modifier;
      delete newData.modifyTime;
      delete newData.headDefineid;
      delete newData.headDefinedefine1;
      delete newData.pubts;
      let body = {
        data: newData
      };
      let xtzhResponse = postman("POST", getXtzhUrl, JSON.stringify(header), JSON.stringify(body));
      let xtzhresponseobj = JSON.parse(xtzhResponse);
      if ("200" == xtzhresponseobj.code) {
        rst = { code: 1, message: data.code + "转换成功" };
      } else {
        rst = { code: 0, message: xtzhresponseobj.message };
      }
    } else {
      rst = { code: 0, message: xsckResponseobj.message };
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });