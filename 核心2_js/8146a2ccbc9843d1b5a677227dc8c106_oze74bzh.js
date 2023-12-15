let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let funcx = extrequire("GT6948AT29.custom.getZFund_MTB_docid");
    let req = {};
    let resx = funcx.execute(req).res;
    let docId = resx.id;
    var request = {};
    function aftsv(act, args, url) {
      let insert = true;
      var ids = args["data"][0]["GL_fundID"];
      if (ids !== null && ids !== undefined && ids !== "") {
        let func1 = extrequire("GT6948AT29.YYFtest.searchUserDefinedSql");
        request.id = ids;
        let res = func1.execute(request).res;
        if (res.length > 0) insert = false;
      }
      var agsdata = args["data"];
      if (agsdata.length != 0) {
        if (args["data"][0]["fund_usedirection_name"] != "工作经费") {
          var code = args["data"][0]["code"];
          var name = args["data"][0]["name"];
          var orgid = args["data"][0]["org_id"];
          var orgid_name = args["data"][0]["org_id_name"];
          var id = args["data"][0]["GL_fundID"];
          var data = {};
          data.data = {};
          var description = args["data"][0]["org_id"] + "," + args["data"][0]["fund_usedirection"];
          if (!insert) data.data.id = request.id;
          data.data.orgid_name = orgid_name;
          data.data.orgid = orgid;
          data.data.code = code;
          data.data.name = name;
          data.data.custdocdefid = docId;
          data.data.dr = "0";
          data.data.description = description;
          data.data.enable = 1;
          if (insert) data.data._status = "Insert";
          else data.data._status = "Update";
          var ssss = JSON.stringify(data);
          var strResponse = postman("post", "".concat(url, act, "&custdocdefid=" + docId), null, JSON.stringify(data));
          var jsrs = JSON.parse(strResponse);
          if (jsrs["code"] != "200") {
            console.log("同步自定义档案失败");
          } else {
            var id = jsrs["data"]["id"];
            param.data[0].set("GL_fundID", id);
          }
        } else {
          var code = args["data"][0]["code"];
          var name = args["data"][0]["name"];
          var orgid = args["data"][0]["org_id"];
          var orgid_name = args["data"][0]["org_id_name"];
          var id = args["data"][0]["GL_fundID"];
          var data = {};
          data.data = {};
          data.data.orgid_name = orgid_name;
          data.data.orgid = orgid;
          data.data.code = code;
          data.data.name = name;
          data.data.custdocdefid = docId;
          data.data.dr = "0";
          data.data.enable = 1;
          if (insert) data.data._status = "Insert";
          else data.data._status = "Update";
          if (!insert) data.data.id = request.id;
          var strResponse = postman("post", "".concat(url, act, "&custdocdefid=" + docId), null, JSON.stringify(data));
          var jsrs = JSON.parse(strResponse);
          if (jsrs["code"] != "200") {
            console.log("同步自定义档案失败");
          } else {
            var id = jsrs["data"]["id"];
            param.data[0].set("GL_fundID", id);
          }
        }
      } else {
        return args;
      }
    }
    let func = extrequire("GT6948AT29.common.getOpenApiToken");
    let resx = func.execute(request);
    var url = "https://www.example.com/";
    var act = resx.access_token;
    aftsv(act, param, url);
    return {};
  }
}
exports({ entryPoint: MyTrigger });