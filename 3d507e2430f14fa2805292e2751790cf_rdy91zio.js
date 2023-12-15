let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //项目终验数据存储数组
    var ys_projectEnding = new Array();
    //获取crm的token
    const crm_token_Url = "https://www.example.com/";
    const crm_Url = "https://www.example.com/";
    //（根据项目ID或编码查询项目终验信息）接口地址
    const ys_projectAcceptance_Url = "https://www.example.com/";
    //销售订单详情查询接口地址
    const salesOrder_Url = "https://www.example.com/";
    //销售自定义项更新接口地址
    const updateDefinesInfo = "https://www.example.com/";
    //自建销售订单变更接口地址
    const saleOrderUpdata_Url = "https://www.example.com/";
    const objName = "jfls";
    //当前应用编号
    const appCode = "CKAM";
    //页码
    const pageIndex = 1;
    //页大小
    const pageSize = 500;
    const billnum = "voucher_order";
    const token_body = {
      client_id: "youridHere",
      client_secret: "yoursecretHere",
      password: "yourpasswordHere",
      username: "https://www.example.com/",
      grant_type: "password",
      redirect_uri: "https://api.tencent.xiaoshouyi.com"
    };
    //调用crm接口获取token
    var crm_token_link = postman("post", crm_token_Url, null, JSON.stringify(token_body));
    var crm_token_link_value = JSON.parse(crm_token_link);
    var crm_token = crm_token_link_value.access_token;
    //获取项目终验单据数据
    ys_projectEnding = param.requestData;
    //获取项目终验单据code
    let ys_projectEnd = JSON.parse(ys_projectEnding);
    //项目终验实体URL
    var projectAcceptanceUrl = "ckam.projectacceptance.ProjectAcceptance";
    var domainKey = "yourKeyHere";
    var projectAcceptanceSql = `select projectId,acceptDate from ${projectAcceptanceUrl} where id=${ys_projectEnd[0].id}`;
    //获取项目终验行id
    var projectAcceptanceResponse = ObjectStore.queryByYonQL(projectAcceptanceSql, domainKey)[0];
    var ys_id = projectAcceptanceResponse.projectId;
    //获得验收日期
    var ys_date = projectAcceptanceResponse.acceptDate;
    var acceptDate = new Date(ys_date);
    var seperator1 = "-";
    var year = acceptDate.getFullYear();
    var month = acceptDate.getMonth() + 1;
    var strDate = acceptDate.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    var projectAcceptance_body = {
      projectId: ys_id
    };
    //调用接口查询单据状态
    let projectEnding = openLinker("POST", ys_projectAcceptance_Url, appCode, JSON.stringify(projectAcceptance_body));
    var projectEnding_json = JSON.parse(projectEnding);
    //获取订单状态
    var orderStatus = "已审核";
    //获取项目终验子表信息
    var other;
    if (projectEnding_json.data.projectAcceptanceDeliverys == null || projectEnding_json.data.projectAcceptanceDeliverys == undefined || projectEnding_json.data.projectAcceptanceDeliverys == "") {
      return {};
    } else {
      other = projectEnding_json.data.projectAcceptanceDeliverys;
    }
    //获取销售订单id
    var main_saleOrderId = other[0].saleOrderId;
    //调用销售订单查询接口
    let saleOrder_link = openLinker("GET", `${salesOrder_Url}?id=${main_saleOrderId}`, appCode, null);
    let saleOrder_list = JSON.parse(saleOrder_link);
    var saleOrder_list_value = saleOrder_list.data.orderDetails;
    var saleOrder_data_JSON = JSON.stringify(saleOrder_list.data);
    var saleOrder_data = JSON.parse(saleOrder_data_JSON);
    var saleOrder_defined = saleOrder_list.data.orderDefineCharacter;
    var orderDetails_orderPrices = saleOrder_list.data.orderPrices;
    var salesOrgId = saleOrder_data.code;
    var orderDetails = new Array();
    for (let j = 0; j < saleOrder_list.data.orderDetails.length; j++) {
      let item = {
        orderDefineCharacter__icexiangmu001: orderStatus, //验收状态
        orderDefineCharacter__icexiangmu002: currentdate, //验收时间
        crmid: saleOrder_list.data.orderDetails[j].memo,
        productId: saleOrder_list.data.orderDetails[j].productId,
        oriSum: saleOrder_list.data.orderDetails[j].oriSum,
        priceQty: saleOrder_list.data.orderDetails[j].priceQty,
        qty: saleOrder_list.data.orderDetails[j].qty,
        subQty: saleOrder_list.data.orderDetails[j].subQty,
        orderProductType: saleOrder_list.data.orderDetails[j].orderProductType
      };
      orderDetails.push(item);
    }
    // 调用销售自定义更新接口改写项目终验日期、状态
    var ys_updataDefines = new Object();
    ys_updataDefines = {
      datas: [
        {
          id: main_saleOrderId,
          orderDefineCharacter: {
            icexiangmu001: "已审核",
            icexiangmu002: currentdate
          }
        }
      ]
    };
    // 调用销售自定义更新接口
    let saleOrder_DefinesInfo_link = openLinker("POST", updateDefinesInfo, appCode, JSON.stringify(ys_updataDefines));
    for (var i = 0; i < other.length; i++) {
      //将需要的数据放到item数组里
      let crm_item = {
        status: 1, //状态
        orderCode: salesOrgId, //crm订单id   （订单编号）
        orderItem: saleOrder_list_value[i].memo, //crm订单明细id   （明细id）
        number: other[i].num, //交付数量     (num)
        postDate: currentdate, //交付日期	       （
        code: ys_projectEnd[0].id //交付流水号     (主表id）
      };
      var rows = new Array();
      rows.push(crm_item);
      //定义crm接口数据
      var crm_header = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + crm_token
      };
      var crm_body = {
        objName: objName,
        rows: rows
      };
      //将数据推送给crm接口
      var crm_link = postman("post", crm_Url, JSON.stringify(crm_header), JSON.stringify(crm_body));
    }
    console.log("ypd 测试");
    return {};
  }
}
exports({ entryPoint: MyTrigger });