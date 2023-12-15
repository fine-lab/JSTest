let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let currentUser = JSON.parse(AppContext()).currentUser;
    let code = currentUser.code;
    let url = "https://www.example.com/" + code;
    let apiResponse = openLinker("GET", url, "AT1A0D359C16680006", JSON.stringify({}));
    let json = JSON.parse(apiResponse);
    let data = json["data"];
    let mainJob = {};
    if (data != null && data["mainJobList"].length > 0) {
      for (var i = 0; i < data["mainJobList"].length; i++) {
        if (!data["mainJobList"][i]["enddate"]) {
          mainJob = data["mainJobList"][i];
        }
      }
      return {
        code: data["code"],
        name: data["name"],
        email: data["email"],
        mainJob: mainJob
      };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });