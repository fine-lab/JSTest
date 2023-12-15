let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramRequest = JSON.parse(param.requestData);
    let paramRetrun = param.return;
    let z_CoopMember = paramRequest.z_CoopMember;
    let billnum = context.billnum;
    let entityUrl = "";
    if (billnum === "df6a3246List") {
      entityUrl = "GT104180AT23.GT104180AT23.CoopMember";
    } else if (billnum === "79b6e5f0List") {
      entityUrl = "GT104180AT23.GT104180AT23.CoopMember_C";
    }
    //同步到档案的参数
    let data = {
      orgid: paramRequest.org_id,
      code: paramRequest.code,
      name: {
        zh_CN: paramRequest.name
      },
      enable: 1,
      _status: z_CoopMember === undefined ? "Insert" : "Update"
    };
    if (z_CoopMember) {
      data.id = z_CoopMember;
    }
    let request = {};
    request.uri = "/yonbip/digitalModel/customerdoc/saveOrUpdate";
    request.body = { data: data };
    request.parm = { custdocdefcode: "z_CoopMember" };
    let func = extrequire("GT34544AT7.common.postWithPath");
    let res = func.execute(request).res;
    if (res.code === "200") {
      var object1 = { id: paramRequest.id, z_CoopMember: res.data.id };
      var res1 = ObjectStore.updateById(entityUrl, object1, context.cardKey);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });