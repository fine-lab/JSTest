let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 定义token
    var accessToken;
    //获取分页及查询参数
    let pageIndex = request.pageIndex;
    let pageSize = request.pageSize / 2;
    let define10 = request.define10; //所属分销商
    let agentId_name = request.agentId_name; //客户
    let define7 = request.define7; //是否整车
    let define3 = request.define3; //整车标识号
    let code = request.code; //单据号
    let creator = request.creator; //创建人
    let modifier = request.modifier; //修改人
    //获取销售订单数量 订单状态不等于开立态
    var xsquery = [
      {
        op: "neq",
        value1: "CONFIRMORDER",
        field: "nextStatus"
      }
    ];
    var thquery = [];
    //添加过滤条件
    addWhere("xsquery", "headItem.define10", define10);
    addWhere("xsquery", "agentId.name", agentId_name);
    addWhere("xsquery", "headItem.define7", define7);
    addWhere("xsquery", "headItem.define3", define3);
    addWhere("xsquery", "creator", creator);
    addWhere("xsquery", "modifier", modifier);
    addWhere("xsquery", "code", code);
    addWhere("thquery", "headItem.define10", define10);
    addWhere("thquery", "agentId.name", agentId_name);
    addWhere("thquery", "headItem.define7", define7);
    addWhere("thquery", "headItem.define3", define3);
    addWhere("thquery", "creator", creator);
    addWhere("thquery", "modifier", modifier);
    addWhere("thquery", "code", code);
    let xsbody = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      isSum: false,
      simpleVOs: xsquery
    };
    //获取销售退货订单数量
    let thbody = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      isSum: false,
      simpleVOs: thquery
    };
    let xsdata = postman("post", "https://www.example.com/" + getAccessToken(), null, JSON.stringify(xsbody));
    let thdata = postman("post", "https://www.example.com/" + getAccessToken(), null, JSON.stringify(thbody));
    return { xsdata: xsdata, thdata: thdata };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("GT80750AT4.backDefaultGroup.getToKen").execute().access_token;
      }
      return accessToken;
    }
    function addWhere(list, key, value) {
      if (value != null && value != "") {
        let data = {
          op: "eq",
          value1: value,
          field: key
        };
        if (list == "xsquery") {
          xsquery.push(data);
        } else {
          thquery.push(data);
        }
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });