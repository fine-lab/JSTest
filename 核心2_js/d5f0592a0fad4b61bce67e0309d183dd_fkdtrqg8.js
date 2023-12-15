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
    if (requestdata.id == null) {
      //判断requestdata中是否有id
      var id = requestdata[0].id; //前端传的数据id，根据数据id去查数据库
    } else {
      var id = requestdata.id; //前端传的数据id，根据数据id去查数据库
    }
    //查营销物料申领表
    var sql = "select * from dsfa.terminalassets.TerminalAssets where id = '" + id + "'";
    var TerminalAssets = ObjectStore.queryByYonQL(sql, "yycrm");
    //查物料详情子表
    var sql1 = "select * from dsfa.terminalassets.TerminalAssetsDetail where terminalassetsId = '" + id + "'";
    var TerminalAssetsDetail = ObjectStore.queryByYonQL(sql1, "yycrm");
    let so_saleorder_b = []; //请求NCC出库申请单子表
    let productids = [];
    let detailids = [];
    for (let jrow = 0; jrow < TerminalAssetsDetail.length; jrow++) {
      let TerminalAssetsDetailData = TerminalAssetsDetail[jrow];
      productids.push(TerminalAssetsDetailData.product); //申领物料id
      detailids.push(TerminalAssetsDetailData.id); //申领物料详情的id
    }
    //查询营销物料详情子表里边的详细地址（详细地址是自定义项，从自定义项表里边查询）
    var sql9 = "select * from dsfa.terminalassets.TerminalAssetsDetailFreeDef where id in (" + detailids + ")";
    var address = ObjectStore.queryByYonQL(sql9, "yycrm");
    var sql2 = "select id, code, unit from pc.product.Product where id in (" + productids + ")";
    var productcodes = ObjectStore.queryByYonQL(sql2, "productcenter");
    //获取物料详情
    for (let irow = 0; irow < TerminalAssetsDetail.length; irow++) {
      let TerminalAssetsDetailData = TerminalAssetsDetail[irow];
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
      //获取终端组织
      var sql6 = "select id,code from org.func.BaseOrg where id in (select org from aa.store.Store where id in (" + terminalid + "))";
      var terminalorg = ObjectStore.queryByYonQL(sql6, "yycrm");
      //获取终端地址
      var addressitem = address.filter((item) => item.id == detailid);
      if (addressitem[0] != null) {
        define5 = addressitem[0].define5;
      }
      let product = {
        cqtunitid: unitcode[0].code, //报价单位
        nqtunitnum: quantity, //报价单位数量
        cmaterialvid: cmaterialvid, //物料编码
        castunitid: unitcode[0].code, //单位
        terminal: terminalid, //终端的id——接口中根据终端id去生成一张或多张销售赠送单
        terminalorg: terminalorg[0].code, //终端组织
        address: define5 //营销物料子表的详细地址
      };
      so_saleorder_b.push(product);
    }
    //获取人员的组织
    let orgid = TerminalAssets[0].org;
    var sql3 = "select code from org.func.BaseOrg where id = '" + orgid + "'";
    var orgcode = ObjectStore.queryByYonQL(sql3, "yycrm");
    //获取人员的部门
    let deptid = TerminalAssets[0].applyDept;
    var sql4 = "select code from bd.adminOrg.DeptOrgVO where id = '" + deptid + "'";
    var deptcode = ObjectStore.queryByYonQL(sql4, "yycrm");
    //获取员工编码
    let psnid = TerminalAssets[0].proposer;
    var sql5 = "select code from bd.staff.Staff where id = '" + psnid + "'";
    var psncode = ObjectStore.queryByYonQL(sql5, "yycrm");
    //请求NCC销售赠送单主表
    let so_saleorder = {
      cdeptid: deptcode[0].code, //部门最新版本
      cdeptvid: deptcode[0].code, //部门
      vtrantypecode: "30-Cxx-11", //订单类型编码——默认销售赠送单（30-Cxx-11）
      ccustomerid: "youridHere", //客户————默认百乐（youridHere）
      pk_org: orgcode[0].code, //销售组织
      chreceiveaddid: "youridHere", //收货地址——默认临时地址（youridHere）
      vdef16: "CRM-" + TerminalAssets[0].code, //CRM+物料申领编码
      cemployeeid: psncode[0].code //业务员
    };
    //请求参数
    let json = {
      so_saleorder: so_saleorder, //主表
      so_saleorder_b: so_saleorder_b //子表
    };
    let url = "http://219.133.71.172:39066/uapws/rest/total/OutboundOrder";
    var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
    if (strResponse.status == 1) {
      throw new Error("NCC:" + strResponse.msg);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });