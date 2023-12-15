let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = new Array();
    var info = {
      code: param.data[0].code,
      name: {
        zh_CN: param.data[0].name,
        en_US: param.data[0].name,
        zh_TW: param.data[0].name
      },
      custdocdefid_code: "sale_contract",
      orgid: param.data[0].salesOrgId,
      enable: 1
    };
    data.push(info);
    let body = {
      data: data
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SACT", JSON.stringify(body));
    return { apiResponse };
    return {};
  }
}
exports({ entryPoint: MyTrigger });