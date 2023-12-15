let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.type == "in") {
      let message = "";
      let map = extrequire("GT22176AT10.publicFunction.splitPurInRows").execute(request.id, request.purIds).map;
      let rows = request.rows;
      for (let i = 0; i < rows.length; i++) {
        //检测批号，库存状态，数量
        //库存状态与批号可能需要注释
        if (map[rows[i].sourceautoid][reviewIds[j]][rows[i].extendEntrySource].batch != rows[i].batchno) {
          message += "第" + (i + 1) + "行批号错误，需要与购进入库验收单对应";
        }
        if (map[rows[i].sourceautoid][reviewIds[j]][rows[i].extendEntrySource].quaInState != rows[i].stockStatusDoc) {
          message += "第" + (i + 1) + "行库存状态错误，请查看关联购进入库验收单中填写的";
        }
        if (map[rows[i].sourceautoid][reviewIds[j]][rows[i].extendEntrySource].qty - rows[i].qty < 0) {
          message += "第" + (i + 1) + "行数量错误，此行最多入库数量为：" + map[rows[i].sourceautoid][reviewIds[j]][rows[i].extendEntrySource].qty + ",请查看关联购进入库验收单中填写的";
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });