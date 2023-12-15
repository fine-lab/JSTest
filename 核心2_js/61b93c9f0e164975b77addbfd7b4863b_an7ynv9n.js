let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var body = { deletRow: 0, oaStatus: 3, wmsStatus: 3 };
    try {
      //查询出未被删除并且OA已经审批通过且推送WMS失败的信息
      var main = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.address_split_info", body);
      main.forEach((r) => {
        let pushbody = { udhNo: r.udhNo };
        let url = "https://www.example.com/";
        let apiResponse = openLinker("POST", url, "GT80750AT4", JSON.stringify(pushbody));
        updateRemark("调用pushWms接口的返回值" + JSON.stringify(apiResponse));
        const resp = JSON.parse(apiResponse);
        if (resp.code == "200") {
          updateWmsStatus("2");
          deleteRow();
          updateSplitAddressStatusToNcc(code);
          define18 = "是";
        } else {
          updateWmsStatus("3");
        }
      });
    } catch (e) {
      throw new Error("查询拆分地址信息失败：" + e.message);
    }
    return {};
    function updateRemark(remark) {
      let body = { remark: remark };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
    function deleteRow() {
      let body = { deletRow: 1 };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: code, data: body }));
    }
    function updateSplitAddressStatusToNcc(billNo) {
      let result = postman(
        "post",
        config.nccUrl + "/servlet/SoOrderdefUpdate",
        "",
        JSON.stringify({
          vbillcode: billNo,
          vdef64: "Y"
        })
      );
      result = JSON.parse(result);
      if (result.code + "" !== "200") {
        throw new Error(result.msg);
      }
    }
  }
}
exports({ entryPoint: MyTrigger });