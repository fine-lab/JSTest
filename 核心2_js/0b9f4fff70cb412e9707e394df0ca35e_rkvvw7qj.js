let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //表头
    let pdata = param.data[0];
    //表体数组
    var dataLineArray = pdata.khdzqrdh2List;
    //拼接表头和表体为一串json,后续将该json传递至二开系统
    //将 客户对账确认单的字段 对应到 Ebs销售订单出库接口 字段上
    let sql1 = "select define4 from org.func.BaseOrgDefine where id=" + pdata.deliveryOrg;
    let res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
    pdata.set("new12", res1[0].define4);
    let sql2 = "select define1 from org.func.BaseOrgDefine where id=" + pdata.deliveryOrg;
    let res2 = ObjectStore.queryByYonQL(sql2, "ucf-org-center");
    pdata.new13 = res2[0].define1;
    for (let i = 0; i < dataLineArray.length; i++) {
      var dataLine = dataLineArray[i]; //拿到每一行表体
      let sql3_01 = "select assistUnit from pc.product.ProductAssistUnitExchange where productId =" + dataLine.materialNo;
      let res3_01 = ObjectStore.queryByYonQL(sql3_01, "productcenter");
      dataLine.new13 = res3_01[0].assistUnit;
      dataLine.new14 = dataLine.confirmNum / dataLine.convert; //等于主计量数量（表体确认数量）/表体换算率
      dataLine.new15 = dataLine.unitPrice * dataLine.convert; //等于表体的单价*表体的换算率
    }
    // 现在还查不出来，因为没有实际业务数据！！！！！！！！ 后期查出来了把注释打开
    // 现在还查不出来，因为没有实际业务数据！！！！！！！！ 后期查出来了把注释打开
    //（2）普通销售订单，此时通过销售订单任一表体行的来源单据号查到销售订单
    //查询出库单业务类型：transactionTypeId/transactionTypeId_code，具体用哪个以及值是多少暂未确定。
    //调用二开接口
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    //拿到access_token
    let func = extrequire("GT18216AT3.backDefaultGroup.getOpenApiToken");
    let res = func.execute("");
    var token2 = res.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(pdata));
    //全部完成后，给表头传一个标识，供页面加载时判断，功能是：保存后不可编辑和删除（这两个按钮置灰，表头和明细都不可编辑和删除）
    pdata.set("new15", "ban");
    if (apiResponse == 200) {
      pdata.new15 = "ban";
    } else {
      throw new Error("调用EBS销售订单出库接口失败！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });