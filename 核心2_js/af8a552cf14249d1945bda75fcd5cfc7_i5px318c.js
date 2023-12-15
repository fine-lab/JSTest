let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取到传过来的数据param
    var requestData = param.requestData;
    let requestdata = "";
    if (Object.prototype.toString.call(requestData) === "[object Array]") {
      requestdata = requestData[0];
    }
    if (Object.prototype.toString.call(requestData) === "[object String]") {
      requestdata = JSON.parse(requestData);
    }
    var id;
    if (requestdata.id == null) {
      //判断requestdata中是否有id
      id = requestdata[0].id; //前端传的数据id，根据数据id去查数据库
    } else {
      id = requestdata.id; //前端传的数据id，根据数据id去查数据库
    }
    //查营销物料申领表
    var sql = "select * from dsfa.terminalassets.TerminalAssets where id = '" + id + "'";
    var TerminalAssets = ObjectStore.queryByYonQL(sql, "yycrm");
    //查物料详情子表
    var sql1 = "select * from dsfa.terminalassets.TerminalAssetsDetail where terminalassetsId = '" + id + "'";
    var TerminalAssetsDetail = ObjectStore.queryByYonQL(sql1, "yycrm");
    let bodys = [];
    let productids = [];
    let detailids = [];
    for (let jrow = 0; jrow < TerminalAssetsDetail.length; jrow++) {
      let TerminalAssetsDetailData = TerminalAssetsDetail[jrow];
      productids.push(TerminalAssetsDetailData.product); //申领物料id
      detailids.push(TerminalAssetsDetailData.id); //申领物料详情的id
    }
    //查物料编码与单位
    var sql2 = "select id, code, unit from pc.product.Product where id in (" + productids + ")";
    var productcodes = ObjectStore.queryByYonQL(sql2, "productcenter");
    //获取物料详情
    for (let irow = 0; irow < TerminalAssetsDetail.length; irow++) {
      let TerminalAssetsDetailData = TerminalAssetsDetail[irow];
      let bid = TerminalAssetsDetailData.id; //id
      let productid = TerminalAssetsDetailData.product; //申领物料id
      let quantity = TerminalAssetsDetailData.quantity; //申领物料数量
      let terminalid = TerminalAssetsDetailData.terminal; //终端id
      let detailid = TerminalAssetsDetailData.id; //申领物料详情的id
      let define5;
      let cmaterialvid;
      //获取物料编码
      var productitems = productcodes.filter((item) => item.id == productid);
      if (productid != null) {
        cmaterialvid = productitems[0].code;
      }
      //获取物料单位
      var sql8 = "select code from pc.unit.Unit where id in ( select unit from pc.product.Product where id in (" + productid + ") )";
      var unitcode = ObjectStore.queryByYonQL(sql8, "yycrm");
      let body = {
        material: cmaterialvid,
        cunit: unitcode[0].code,
        num: quantity,
        crmbcode: bid
      };
      bodys.push(body);
    }
    //获取组织
    let orgid = TerminalAssets[0].org;
    var sql3 = "select code from org.func.BaseOrg where id = '" + orgid + "'";
    var orgcode = ObjectStore.queryByYonQL(sql3, "yycrm");
    //获取员工编码
    let psnid = TerminalAssets[0].proposer;
    var sql5 = "select code from bd.staff.Staff where id = '" + psnid + "'";
    var psncode = ObjectStore.queryByYonQL(sql5, "yycrm");
    //请求NCC销售赠送单主表
    let head = {
      cbizcode: psncode[0].code,
      orgcode: orgcode[0].code,
      crmcode: TerminalAssets[0].code
    };
    //请求参数
    let json = {
      head: head,
      bodys: bodys
    };
    let url = "http://ncctest.pilotpen.com.cn:9080/uapws/rest/total/AddReserve";
    var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
    throw new Error(JSON.stringify(strResponse));
    if (strResponse.status == 1) {
      throw new Error("NCC:" + strResponse.msg);
    } else if (strResponse.status == 0) {
      var result = strResponse.result;
      let data = [];
      for (let i = 0; i < result.length; i++) {
        let dataitem = {
          attrext70: result[i].nnccode,
          id: result[i].crmbcode,
          ytenant: "i5px318c",
          _status: "Update"
        };
        data.push(dataitem);
      }
      let object = {
        fullname: "dsfa.terminalassets.TerminalAssetsDetailDefineCharacter",
        data: data
      };
      var apiSaveResponse = postman("post", "https://www.example.com/", null, JSON.stringify(object));
      var strSaveResponse = JSON.parse(apiSaveResponse);
      if (strSaveResponse.code != 200) {
        throw new Error(JSON.stringify(strSaveResponse));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });