let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let childId = request.childId; //申请-反馈子表主键
    let content = request.content; //反馈内容
    let attachment = request.attachment; //附件
    var obj = { id: id, PresaleA_1List: [{ id: childId, fujian: attachment, PreSaleFeedback: content, _status: "Update" }] };
    var res = ObjectStore.updateById("GT65292AT10.GT65292AT10.PresaleAppon", obj);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });