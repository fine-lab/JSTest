let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      mch_id: "youridHere",
      nonce_str: "2696142511",
      start_time: "2023-03-30 00:00:00",
      end_time: "2023-03-31 00:00:00",
      page_no: "1",
      page_size: "100",
      include_wm_order: true,
      sign: "4068E58D03A641A0206C65F6F75C9CAD"
    };
    let header = { "Content-Type": "application/json" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    throw new Error(JSON.stringify(strResponse));
    return {};
  }
}
exports({ entryPoint: MyTrigger });