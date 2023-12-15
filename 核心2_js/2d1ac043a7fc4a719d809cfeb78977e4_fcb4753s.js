import { BrowserRouter as Router, Route } from "react-router-dom";
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var server = function (req, res) {
      res.response("https://www.baidu.com");
      res.end();
    };
    return server();
  }
}
exports({ entryPoint: MyAPIHandler });