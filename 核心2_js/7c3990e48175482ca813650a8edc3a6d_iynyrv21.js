let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(xsckId, xtzhCode) {
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
      if (typeof data.headDefine == "undefined") {
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
  }
}
exports({ entryPoint: MyAPIHandler });