let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let funcx = extrequire("GT6948AT29.custom.getZItem_MTB_docid");
    let req = {};
    let resx = funcx.execute(req).res;
    let docId = resx.id;
    function aftsv(act, url) {
      let agsdata = param["data"];
      if (agsdata.length !== 0) {
        let code = param["data"][0]["code"];
        let name = param["data"][0]["name"];
        let orgid = param["data"][0]["org_id"];
        let orgid_name = param["data"][0]["org_id_name"];
        let gl_itemid = param["data"][0]["GL_itemID"];
        let data = {};
        data.data = {};
        if (param["data"][0]["fund_usedirection_name"] != "工作经费") {
          let description = param["data"][0]["org_id"] + "," + param["data"][0]["fund_usedirection"];
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
          if (!insert) data.data.id = gl_itemid;
          let strResponse = postman("post", "".concat(url, act, "&custdocdefid=" + docId), null, JSON.stringify(data));
          let jsrs = JSON.parse(strResponse);
          if (jsrs["code"] != "200") {
            console.log("同步自定义档案失败");
          } else {
            let id = jsrs.data.id;
            param.data[0].set("GL_itemID", id);
          }
          let pojid = param["data"][0]["GL_sysitemID"];
          let prt_dat = {};
          prt_dat.data = {};
          if (!insert) prt_dat.data.id = pojid;
          else prt_dat.data.id = param.data[0]["GL_itemID"];
          prt_dat.data.code = code;
          prt_dat.data.orgid = orgid;
          prt_dat.data.name = name;
          prt_dat.data.orgid = orgid;
          prt_dat.data.sysid = "youridHere";
          if (insert) prt_dat.data._status = "Insert";
          else prt_dat.data._status = "Update";
          let prt_url = "https://www.example.com/";
          let prt_res = postman("post", "".concat(prt_url, act, "&"), null, JSON.stringify(prt_dat));
          let jsrs2 = JSON.parse(prt_res);
          if (jsrs2["code"] != "200") {
            console.log("同步项目档案失败");
          } else {
            let id = jsrs2.data.id;
            param.data[0].set("GL_sysitemID", id);
            console.log("同步项目档案成功");
          }
        } else {
          data.data.orgid_name = orgid_name;
          data.data.orgid = orgid;
          data.data.code = code;
          data.data.name = name;
          data.data.custdocdefid = docId;
          data.data.dr = "0";
          data.data.enable = 1;
          if (insert) data.data._status = "Insert";
          else data.data._status = "Update";
          if (!insert) data.data.id = gl_itemid;
          var strResponse = postman("post", "".concat(url, act, "&custdocdefid=" + docId), null, JSON.stringify(data));
          let jsrs = JSON.parse(strResponse);
          if (jsrs["code"] != "200") {
            console.log("同步自定义档案失败");
          } else {
            let id = jsrs.data.id;
            param.data[0].set("GL_itemID", id);
            console.log("同步自定义档案成功");
          }
        }
      } else {
        return param;
      }
    }
    let request = {};
    let insert = param.data[0]["GL_itemID"] === null || param.data[0]["GL_itemID"] === undefined ? true : false;
    let func = extrequire("GT6948AT29.common.getOpenApiToken");
    let resx = func.execute(request);
    let url = "https://www.example.com/";
    let act = resx.access_token;
    let args = aftsv(act, url);
    return { args };
  }
}
exports({ entryPoint: MyTrigger });