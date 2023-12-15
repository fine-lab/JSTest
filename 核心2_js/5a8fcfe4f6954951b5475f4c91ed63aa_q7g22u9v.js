let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code; //分类编码
    var name = request.name; //分类名称
    var validityManagement = request.validityManagement; //效期管理
    var businessScopeManagement = request.businessScopeManagement; //经营范围管理
    var parent_name = request.superiorClassification; //上级分类
    var remarks = request.remarks; //备注
    var enable = request.enable; //开启状态
    if (request === null) {
      return { status: "fail", error: "请写入数据!" };
    } else {
      var data = {};
      if (typeof code == "undefined" || code === null || typeof name == "undefined" || name === null) {
        return { status: "fail", error: "code和name字段为必填项,请写入code和name数据!" };
      } else {
        if (typeof parent_name == "undefined" || parent_name === null) {
          data = {
            code: code,
            name: name,
            validityManagement: validityManagement,
            businessScopeManagement: businessScopeManagement,
            remarks: remarks,
            enable: enable
          };
        } else {
          var parent = "";
          var parentSql = "select * from GT59181AT30.GT59181AT30.XPH_EQType where name='" + parent_name + "'";
          var parentSelect = ObjectStore.queryByYonQL(parentSql);
          if (parentSelect.length === 0) {
            return { status: "fail", error: "未查询到该上级分类,请确认后重新调用!" };
          } else {
            parent = parentSelect[0].id;
          }
          data = {
            code: code,
            name: name,
            validityManagement: validityManagement,
            businessScopeManagement: businessScopeManagement,
            parent: parent,
            remarks: remarks,
            enable: enable,
            parent_name: parent_name
          };
        }
        var res = ObjectStore.insert("GT59181AT30.GT59181AT30.XPH_EQType", data, "d6ecb514");
        return { status: "success", data: data, url: "GT59181AT30.GT59181AT30.XPH_EQType", massage: res };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });