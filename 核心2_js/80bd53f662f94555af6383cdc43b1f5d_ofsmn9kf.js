let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let paramObj = { sy01_udi_product_configure2_id: configId };
    let productUdi = "";
    //查询udi配置方案获取产品标识
    let querySql =
      "select t3.productUdi from GT22176AT10.GT22176AT10.sy01_udi_product_configure2 t1 left join GT22176AT10.GT22176AT10.sy01_udi_product_info t2 on t1.sy01_udi_product_info_id = t2.id left join GT22176AT10.GT22176AT10.sy01_udi_relation_product t3 on t2.sy01_udi_relation_product_id = t3.id where t1.id='" +
      configId +
      "')";
    let udiConfigObj = ObjectStore.queryByYonQL(querySql);
    if (udiConfigObj != null && udiConfigObj.length != 0) {
      productUdi = udiConfigObj[0].productUdi;
    }
    request.productUdi = productUdi;
    let udiCode = "";
    let udiCodeList = [];
    //查询生成配置规则
    let createRules = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.sy01_udi_create_info2", paramObj);
    if (createRules != null && createRules.length != 0) {
      let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
      let materialFileFilterUrl = apiPreAndAppCode.apiRestPre + "/udiManageController/createUdiCode";
      request.createRules = createRules;
      throw new Error(JSON.stringify(request));
      //通过后端脚创建UDI
      let result = postman("POST", materialFileFilterUrl, null, JSON.stringify(request));
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error("生成UDI失败！");
      }
      udiCode = result.udiCode;
      let udiObj = { udiCode: udiCode, udiState: 1, productUdi: productUdi };
      udiCodeList.push(udiObj);
      if (createUdiNum > 1) {
        //生成UDI数量大于1 根据生成数量自增序列号 例如001 002
        let serialNo = request.serialNo; //serialNo = 001
        let createUdiNum = request.createUdiNum;
        let num = parseInt(serialNo); //将序列号转换数字 num = 1
        let startNum = 1; //开始自增数字
        let startStr = ""; //序列号包含的字符串
        let startStrLength = 0; //序列号包含字符串的长度
        if (!isNaN(num)) {
          //判断是否转换数字成功
          let numIndexOf = serialNo.indexOf(num); //获取数字在字符串中的下标 001情况下 numIndexOf = 2
          if (numIndexOf == 0) {
            //下标为零 代表序列号为纯数字 序列号为123
            startNum = num;
          } else {
            //下标不为零代表序列号为 001这种
            startStr = serialNo.substr(0, numIndexOf); //startStr = 00
            startStrLength = startStr.length; // startStrLength =2
          }
        }
        let numStr = num + "";
        for (let i = 1; i < createUdiNum; i++) {
          startNum += 1;
          let startNumStr = startNum + "";
          //匹配上一次自增的序列号和本次自增的位数 如果位数增加 则需要减少序列号字符串的长度再添加数字
          if (startNumStr.length > numStr.length) {
            //例如从1 加到 10 则001变成010
            if (startStr != "") {
              //判断序列号是否包含字符串 00
              if (startStrLength == 1) {
                //如果只包含一个 0 直接置空
                startStr = "";
              } else {
                //减少一位0并且长度减一
                startStr = startStr.substr(0, startStrLength - 1);
                startStrLength -= 1;
              }
            }
          }
          numStr = startNumStr; //将本次自增序列号赋值用于下一次匹配
          //替换原序列号为自增序列号
          let newUdiCode = udiCode.replace("(21)" + serialNo, "(21)" + startNum);
          let udiObj = { udiCode: newUdiCode, udiState: 1, productUdi: productUdi };
          udiCodeList.push(udiObj);
        }
      }
    } else {
      throw new Error("没有UDI生成规则");
    }
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });