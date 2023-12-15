let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.querydate === null || typeof request.querydate == "undefined" || request.querydate == "") {
      return { weather: "-" };
    }
    var strResponse = postman("get", "https://www.example.com/", null, null);
    let resJson = eval("(" + strResponse + ")");
    if (resJson.code == "200") {
      let dayweather = resJson.daily[0];
      let day = dayweather.textDay;
      let night = dayweather.textNight;
      let tempText = dayweather.tempMax + "℃/" + dayweather.tempMin + "℃";
      if (day != night) {
        day = day + "转" + night;
      }
      day = day + " " + tempText;
      return { weather: day };
    } else {
      return { weather: "-" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });