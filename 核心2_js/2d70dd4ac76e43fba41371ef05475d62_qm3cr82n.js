let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let bid = request.bid;
    let header = {
      appkey: "yourkeyHere",
      appsecret: "yoursecretHere"
    };
    let body = {
      appId: "yourIdHere",
      menuId: bid,
      appName: "用友大事记",
      url: "https://www.example.com/" + bid,
      expireAt: 1709815959346,
      auth: "yourauthHere",
      username: "15801402818",
      password: "yourpasswordHere"
    };
    let url = "https://www.example.com/";
    let res = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    res = JSON.parse(res);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });