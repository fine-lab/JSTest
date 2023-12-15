let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = typeof param.requestData == "string" ? param.requestData : JSON.stringify(param.requestData);
    let paramstr = replace(requestData, "!", "");
    let newparam = JSON.parse(paramstr);
    let xsckId = newparam.definesdefine2;
    let xtzhCode = newparam.code;
    let getxsckDetail = "https://www.example.com/" + xsckId;
    let updateDefine = "https://www.example.com/";
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    //销售出库修改形态转换单号
    let rst = "";
    let _status = "Update";
    let xsckDetailResponse = openLinker("GET", getxsckDetail, "ST", null);
    let xsckResponseobj = JSON.parse(xsckDetailResponse);
    if ("200" == xsckResponseobj.code) {
      let data = xsckResponseobj.data;
      data = replace(JSON.stringify(data), "headDefine!", "headDefine");
      data = JSON.parse(data);
      if (typeof data.headDefinedefine1 == "undefined") {
        _status = "Insert";
      }
      let updatebody = {
        data: {
          resubmitCheckKey: replace(uuid(), "-", ""),
          id: xsckId,
          _status: "Update",
          memo: "备注",
          headDefine: {
            id: xsckId,
            _status: _status,
            define1: xtzhCode
          }
        }
      };
      let xtzhResponse = openLinker("POST", updateDefine, "ST", JSON.stringify(updatebody));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });