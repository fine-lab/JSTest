let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //调用客户费用  获取 access_token Api函数
    let func = extrequire("BBSMK.backDesignerFunction.getOpenApiToken");
    let res = func.execute("");
    var access_token = res.access_token;
    //获取当前页面数据 进行后续赋值
    var paramdata = param.data[0];
    // 客户费用调整审批后处理
    // 生成红字费用单
    // 客户费用-金额(保存)Api
    const saveurl = "https://www.example.com/" + access_token;
    //查询当前单据实体内容 用于红字费用单生成
    var object = {
      id: paramdata.id
    };
    //调整单实体查询
    var pdata = ObjectStore.selectById("AT162603C809880007.AT162603C809880007.khfytz001", object);
    //查询待调整费用单
    var resdatas = ObjectStore.queryByYonQL("select * from voucher.rebate.AmountRebate where id = '" + pdata.costid + "' ", "marketingbill");
    //获取原客户id
    let oldagentId = resdatas[0].agentId;
    // 保存调用传参赋值
    var body = {
      data: {
        resubmitCheckKey: pdata.id,
        //销售组织
        salesOrgId: pdata.salesOrgId,
        //单据日期
        vouchdate: pdata.vouchdate,
        //客户（原）
        agentId: oldagentId,
        //开票组织
        settlementOrgId: pdata.settlementOrgId,
        //兑付方式 TOPRODUCT:订单折扣 TOCASH:订单抵现 应用类型为【费用扣减】时，兑付方式固定为【订单折扣】
        useWayCode: pdata.useWayCode,
        //应用类型 ADD:费用增加 REDUCE费用扣减 这里生成红字固定 费用扣减
        useType: "REDUCE",
        //有效期开始时间
        validStartDate: pdata.vouchdate,
        //有效期结束时间
        validEndDate: pdata.validEndDate,
        //客户费用金额
        rebateMoney: -pdata.adjustMoney,
        //客户费用币种
        originalPk: pdata.originalPk,
        //操作标识, Insert:新增、 Update:更新
        _status: "Insert"
      }
    };
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });