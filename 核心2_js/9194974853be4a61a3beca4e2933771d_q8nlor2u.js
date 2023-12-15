let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let table_config = {
      chayi_main_uri: "AT15CFB6F808300003.AT15CFB6F808300003.zc_daiobochayi",
      chayi_sub_uri: "AT15CFB6F808300003.AT15CFB6F808300003.zc_diaobochayi_sub"
    };
    let token_config = {
      appKey: "yourKeyHere",
      appSecret: "yourSecretHere"
    };
    let model_template_config = {
      mcode_chayi_list: "eab1692dList",
      mcode_chayi: "eab1692d"
    };
    let pz_config = {
      makerMobile: "15838560267" // 制单人手机
    };
    let gongyingshang_config = {
      KCY: "A00374",
      LLC: "A00375",
      XYS: "A00372",
      HIH: "A00373",
      LZH: "A00371"
    };
    let config = {
      table_config: table_config,
      token_config: token_config,
      pz_config: pz_config,
      model_template_config: model_template_config,
      gongyingshang_config: gongyingshang_config
    };
    return config;
  }
}
exports({ entryPoint: MyTrigger });