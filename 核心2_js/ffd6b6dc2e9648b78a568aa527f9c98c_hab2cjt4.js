let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var kf = parseFloat(data.yuliuziduan6);
    var deptId = data.yuliuziduan7;
    var object = {
      floatIntergal: kf,
      deptId: deptId
    };
    var header = {
      "Content-Type": "application/json"
    };
    let func1 = extrequire("GT43085AT4.backDefaultGroup.getToken");
    let res = func1.execute();
    var strResponse = postman(
      "post",
      "https://www.example.com/" + "?access_token=" + res.access_token,
      JSON.stringify(header),
      JSON.stringify(object)
    );
    return {};
  }
}
exports({ entryPoint: MyTrigger });