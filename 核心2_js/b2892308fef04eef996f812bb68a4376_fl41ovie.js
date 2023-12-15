let AbstractTrigger = require("AbstractTrigger");
function test(obj) {
  let success = true;
  let res = Object.values(obj).reduce((obj, f) => {
    let flag = false;
    try {
      flag = f();
    } catch (e) {
      if ("object" == typeof e) {
        flag = e.message;
      } else {
        flag = e;
      }
    }
    if (success) {
      let type = typeof flag;
      if ("boolean" == type) {
        if (false === flag) {
          success = false;
        }
      } else if ("string" == type) {
        success = false;
      } else if ("object" == type) {
        if (undefined !== flag.success) {
          success = flag.success;
        } else if (!flag.flag) {
          success = false;
        }
      }
    }
    obj[f.name] = flag;
    return obj;
  }, {});
  return { success, res };
}
let diaoyongtest = {
  ublinker: function () {
    let header = {
      appkey: "yourkeyHere",
      appsecret: "yoursecretHere"
    };
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  },
  apiman: function () {
    let header = {
      appkey: "yourkeyHere",
      appsecret: "yoursecretHere"
    };
    let body = {};
    let url = "https://www.example.com/";
    let apiResponse = apiman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
  },
  postman: function () {
    var strResponse = postman("get", "https://www.example.com/" + URLEncoder("条件"), null, null);
    return { strResponse };
  }
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return test(diaoyongtest);
  }
}
exports({ entryPoint: MyTrigger });