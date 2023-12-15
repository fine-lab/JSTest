let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var source_idValue = param.data[0].source_id;
    if (source_idValue == "" || source_idValue == null) {
      throw new Error("没有找到上游单据");
    }
    var querySql;
    if (param.data[0].issuingContract_code != null) {
      //由外部出证合同推送过来
      querySql = "select * from GT60601AT58.GT60601AT58.issuingContract where id=" + source_idValue;
    } else {
      querySql = "select * from GT60601AT58.GT60601AT58.inCertContract where id=" + source_idValue;
    }
    var res = ObjectStore.queryByYonQL(querySql);
    var updateId = param.data[0].id;
    if (updateId == "" || updateId == null) {
      throw new Error("没有找到更新主键上游单据");
    }
    var creatorVal = res[0].creator;
    var object = { id: updateId, creator: creatorVal };
    ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot", object, "9a3bc57c");
    return {};
  }
}
exports({ entryPoint: MyTrigger });