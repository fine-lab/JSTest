let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let adv_id = request.adv_id; //确认单id
    let gather_id = request.gather_id; //业绩单子表id
    let objectAdv = { id: adv_id, contribution_confirm: "2" };
    let ObjectGather = { id: gather_id, contribution_confirm: "2" };
    let resAdv = ObjectStore.updateById("GT65292AT10.GT65292AT10.oppt_support_collect_adv", objectAdv);
    let resGather = ObjectStore.updateById("GT65292AT10.GT65292AT10.oppt_adviser_gather", ObjectGather);
    return { resAdv: resAdv, resGather: resGather };
  }
}
exports({ entryPoint: MyAPIHandler });