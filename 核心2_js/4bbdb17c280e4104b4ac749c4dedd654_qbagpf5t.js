let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      jobType: "2",
      jobName: "费用分摊SQL",
      projectName: "vivoPro",
      token:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoMCIsInRlbmFudElkIjoicWJhZ3BmNXQiLCJsb2dpbiI6IjJiZjdlNGQ2LTRjMjQtNGNiZC05NDNhLTdmNmZiNWNlZTgxYiJ9.dugtPyOEDc5DHBA8I9DiExvuiXo9ozO18NvuTvGzdZM"
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("post", url, "GT64805AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });