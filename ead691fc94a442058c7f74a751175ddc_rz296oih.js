let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let array = request.aggvodata;
    // 校验数据里的物料编码和供应商字段是否存在，若不存在，则不进行导入
    let erpOuterCode = [];
    let vendorName = [];
    array.forEach((headData) => {
      headData["espoplandetailsList"].forEach((bodyData) => {
        if (!bodyData["pk_material"]) {
          erpOuterCode.push(headData["erpOuterCode"]);
        }
        if (!bodyData["vendor"]) {
          vendorName.push(headData["vendorName"]);
        }
      });
    });
    if (erpOuterCode.length) {
      throw new Error(`编码[${[...new Set(erpOuterCode)].join(",")}]算力物料不存在`);
    }
    if (vendorName.length) {
      throw new Error(`供应商[${[...new Set(vendorName)].join(",")}]不存在`);
    }
    var currentUser = JSON.parse(AppContext()).currentUser;
    let res = ObjectStore.insertBatch("GT37522AT1.GT37522AT1.espoplan", array, "55549037");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });