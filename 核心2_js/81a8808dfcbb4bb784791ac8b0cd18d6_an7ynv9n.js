let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 组织ID
    var orgId = request.orgId;
    // 物料ID
    var materialId = request.materialId;
    if (orgId === undefined) {
      throw new Error("组织不能为空");
    }
    // 分单主表
    var parent = ObjectStore.queryByYonQL("select id,enable,new9 as defTranCode from GT80750AT4.GT80750AT4.fendan1 where org_id ='" + orgId + "' ");
    if (parent.length === 0) {
      return {};
    }
    // 分单子表
    var sons = ObjectStore.queryByYonQL("select id,new4 as tranCode from GT80750AT4.GT80750AT4.fendan1zi1 where fendan1_id = '" + parent[0].id + "'");
    if (sons.length === 0) {
      return {};
    }
    let sonIds = "";
    // 记录交易类型编码
    let sonId2TransCode = new Map();
    for (var i = sons.length - 1; i >= 0; i--) {
      if (i === 0) {
        sonIds += "'" + sons[i].id + "'";
      } else {
        sonIds += "'" + sons[i].id + "',";
      }
      sonId2TransCode.set(sons[i].id, sons[i].tranCode);
    }
    // 分单孙表
    var grandsonsSql = "select * from GT80750AT4.GT80750AT4.fendan1sun1 where fendan1zi1_id in (" + sonIds + ") ";
    if (materialId !== undefined) {
      grandsonsSql += " and shangpin = '" + materialId + "' ";
    }
    var grandsons = ObjectStore.queryByYonQL(grandsonsSql);
    // 物料对应分单规则信息
    let materials = [];
    if (grandsons.length > 0) {
      grandsons.forEach((self, index) => {
        self.transCode = sonId2TransCode.get(self.fendan1zi1_id);
        materials.push(self);
      });
    }
    // 返回数据
    let result = {
      enable: parent[0].enable,
      defTranCode: parent[0].defTranCode,
      materials: materials
    };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });