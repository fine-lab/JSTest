let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    requestData = replace(JSON.stringify(requestData), "defines!", "defines");
    requestData = JSON.parse(requestData);
    let updateDefine = "https://www.example.com/";
    let updatebody = {
      data: {
        resubmitCheckKey: replace(uuid(), "-", ""),
        id: requestData.definesdefine2,
        _status: "Update",
        memo: "",
        headDefine: {
          id: requestData.definesdefine2,
          _status: "Update",
          define1: " "
        }
      }
    };
    let xtzhResponse = openLinker("POST", updateDefine, "ST", JSON.stringify(updatebody));
    return {};
  }
}
exports({ entryPoint: MyTrigger });