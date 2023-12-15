let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //当选择两行数据时方可进行核销 否则提示
    let data = param.requestData;
    if (data.length != 2) {
      throw new Error("请选择两行数据。");
    }
    //校验是否满足核销条件  1 信息匹配
    if (
      data[0].agentId != data[1].agentId ||
      data[0].salesOrgId != data[1].salesOrgId ||
      data[0].originalPk != data[1].originalPk ||
      data[0].useWayCode != data[1].useWayCode ||
      data[0].status != 1 ||
      data[1].status != 1
    ) {
      throw new Error("至少需要包含相同客户、相同销售组织、相同币种、相同应用方式且已审核的两张不同应用类型的费用单。");
    }
    //校验是否满足核销条件  2 余额必须一正一负
    if ((data[0].surplusMoney > 0 && data[1].surplusMoney > 0) || (data[0].surplusMoney < 0 && data[1].surplusMoney < 0)) {
      throw new Error("所选数据不满足可用余额一正一负的条件。");
    }
    //查询调整单信息 用于取调整客户B
    for (let i = 0; i < data.length; i++) {
      if (data[i].surplusMoney > 0) {
        //待调整客户费用单id
        const id = data[i].id;
        var resdata = ObjectStore.queryByYonQL("select * from AT162603C809880007.AT162603C809880007.khfytz001 where costid = '" + id + "' ", "developplatform"); //客户
        const customer = resdata[0].customer; //调整金额
        const adjustMoney = resdata[0].adjustMoney; //调用客户费用-金额单据保存 与 审批接口
        saveAndApproveAction(data[i], customer, adjustMoney);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });
//参数为 待调客户费用信息 客户b 调整金额
function saveAndApproveAction(data, customer, adjustMoney) {
  // 保存调用传参赋值
  var body = {
    data: {
      resubmitCheckKey: data.id,
      //销售组织
      salesOrgId: data.salesOrgId,
      //单据日期
      vouchdate: data.vouchdate,
      //客户
      agentId: customer,
      //开票组织
      settlementOrgId: data.settlementOrgId,
      //兑付方式 TOPRODUCT:订单折扣 TOCASH:订单抵现 应用类型为【费用扣减】时，兑付方式固定为【订单折扣】
      useWayCode: data.useWayCode,
      //应用类型 ADD:费用增加 REDUCE费用扣减 这里生成红字固定 费用扣减
      useType: data.useType,
      //有效期开始时间
      validStartDate: data.vouchdate,
      //有效期结束时间
      validEndDate: data.validEndDate,
      //客户费用金额
      rebateMoney: adjustMoney,
      //客户费用币种
      originalPk: data.originalPk,
      //操作标识, Insert:新增、 Update:更新
      _status: "Insert"
    }
  };
  //调用客户费用  获取 access_token Api函数
  let func = extrequire("BBSMK.backDesignerFunction.getOpenApiToken");
  let res = func.execute("");
  var access_token = res.access_token;
  // 客户费用-金额(保存)Api
  const saveurl = "https://www.example.com/" + access_token;
  //调用客户费用-金额单据保存接口
  let apiResponse = postman("post", saveurl, null, JSON.stringify(body));
  let jsondata = JSON.parse(apiResponse);
  let { code } = jsondata;
  //判断是否重复提交数据
  if (code == 200) {
    //提交 暂无审批流 无需提交直接审
    //调用客户费用-金额单据审批接口
    const approveurl = "https://www.example.com/" + access_token;
    // 审批调用传参赋值
    let { id } = jsondata.data;
    var approvebody = {
      data: [
        {
          resubmitCheckKey: id,
          id: id
        }
      ]
    };
    let approveapiResponse = postman("post", approveurl, null, JSON.stringify(approvebody));
  } else {
  }
}