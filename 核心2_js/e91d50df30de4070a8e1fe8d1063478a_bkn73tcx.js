let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let gmgsr = request.gmgsr;
    let hetong = "";
    let xname = "";
    for (var i = 0; i < gmgsr.length; i++) {
      hetong = gmgsr[i].hetongbianhao; //合同编号
      xname = gmgsr[i].xiangmumingchen_name; //项目名称
    }
    return { hetong, xname };
  }
}
exports({ entryPoint: MyAPIHandler });