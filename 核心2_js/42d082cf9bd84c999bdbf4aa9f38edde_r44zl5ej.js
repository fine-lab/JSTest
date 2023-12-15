let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apicode = "714e57c5298c410393fc503b85975e56";
    let res = {};
    if (param.data[0].asset_name != undefined) {
      let margin = {
        politics: "涉政敏感词列表",
        porn: "涉黄敏感词列表",
        ad: "广告敏感词列表",
        abuse: "辱骂敏感词列表",
        contraband: "违禁品敏感词列表",
        flood: "灌水文本"
      };
      let url = "https://www.example.com/";
      let body = {
        categories: ["ad", "politics", "abuse", "porn", "contraband", "flood"],
        items: [
          {
            text: param.data[0].asset_name,
            type: "content"
          }
        ]
      }; //请求参数
      let header = {
        apicode: apicode,
        "Content-Type": "application/json"
      };
      var apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
      let xxx = JSON.parse(apiResponse);
      if (xxx.success === true) {
        if (xxx.data.detail !== undefined && Object.keys(xxx.data.detail).length > 0) {
          let detail = xxx.data.detail;
          let xxmsg = "";
          for (let key in margin) {
            if (detail[key] !== undefined) {
              xxmsg += margin[key] + ":" + detail[key] + "\n";
            }
          }
          if (xxmsg !== "") {
            res.message = xxmsg;
            throw new Error(xxmsg);
          }
        } else {
          res.message = "success";
        }
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });