let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let body = { content: data.projectFeedBack, attachment: data.blueprint, childId: data.sourcechild_id, id: data.source_id };
    let func1 = extrequire("GT65292AT10.backDefaultGroup.getToken");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    let url = "https://www.example.com/" + token;
    let apiResponse = null;
    apiResponse = postman("POST", url, null, JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });