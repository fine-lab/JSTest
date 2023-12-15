let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var config = {
      //凭证保存url
      saveVou_url: "https://www.example.com/",
      book1003: "10030001", //1003实业公司账簿编码
      book1001: "10010001", //1001实业公司账簿编码
      makerMobile: "13967316058",
      makerEmail: "https://www.example.com/",
      //第一张凭证辅助核算配置
      vou01_AuxCode: "0004", // 供应商辅助
      vou01_AuxVal: "00DG000001", //
      //第二张凭证辅助核算配置
      vou0201_AuxCode: "0005", // 客户辅助
      vou0201_AuxVal: "00000000000001", //
      vou0202_AuxCode: "0001", // 部门辅助
      vou0202_AuxVal: "100104" //财务中心
    };
    return { config };
  }
}
exports({ entryPoint: MyTrigger });