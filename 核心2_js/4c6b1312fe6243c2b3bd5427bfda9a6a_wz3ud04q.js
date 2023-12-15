let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let minConfig = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_configurev2", { id: configId });
    let productUdi = "";
    if (minConfig != null && minConfig.length != 0) {
      productUdi = minConfig[0].bzcpbs;
    }
    request.productUdi = productUdi;
    let udiCode = "";
    let udiCodeList = [];
    //查询生成配置规则
    let configObj = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_configurev2", { id: configId });
    let querySql =
      "select * from ISVUDI.ISVUDI.sy01_udi_create_config_sonv2 where sy01_udi_create_config_id in (select id from ISVUDI.ISVUDI.sy01_udi_create_configv2 where id='" +
      configObj[0].udiCreateConfigId +
      "')";
    let createRules = ObjectStore.queryByYonQL(querySql);
    if (createRules != null && createRules.length != 0) {
      let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
      let materialFileFilterUrl = apiPreAndAppCode.apiRestPre + "/udiManageController/createUdiCode";
      request.createRules = createRules;
      //通过后端脚创建UDI
      let result = postman("POST", materialFileFilterUrl, null, JSON.stringify(request));
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error(JSON.stringify(result));
      }
      udiCode = result.udiCode;
      let createUdiNum = request.createUdiNum;
      //生成UDI数量大于1 根据生成数量自增序列号 例如001 002
      let serialNo = request.serialNo; //serialNo = 001
      let num = parseInt(serialNo); //将序列号转换数字 num = 1
      let startNum = 1; //开始自增数字
      let startStr = ""; //序列号包含的字符串
      let startStrLength = 0; //序列号包含字符串的长度
      let isNum = true;
      if (!isNaN(num)) {
        //判断是否转换数字成功
        let numIndexOf = serialNo.indexOf(num); //获取数字在字符串中的下标 001情况下 numIndexOf = 2
        startNum = num; //将输入序号作为起始增长序号
        if (numIndexOf == 0) {
          //下标为零 代表序列号为纯数字 序列号为123
        } else {
          //下标不为零代表序列号为 001这种
          startStr = serialNo.substr(0, numIndexOf); //startStr = 00
          startStrLength = startStr.length; // startStrLength =2
        }
        let udiObj = { udiCode: udiCode, udiState: 1, productUdi: productUdi, serialNo: request.serialNo };
        udiCodeList.push(udiObj);
      } else {
        //非纯数字类型 a001 直接在后面添加数字 a0011 a00012
        startStr = serialNo;
        startNum = 0;
        isNum = false;
      }
      let numStr = num + "";
      for (let i = 0; i < createUdiNum && createUdiNum != udiCodeList.length; i++) {
        startNum += 1;
        let startNumStr = startNum + "";
        //匹配上一次自增的序列号和本次自增的位数 如果位数增加 则需要减少序列号字符串的长度再添加数字
        if (isNum && startNumStr.length > numStr.length) {
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
        let newUdiCode = udiCode.replace("(21)" + serialNo, "(21)" + startStr + startNum);
        let udiObj = { udiCode: newUdiCode, udiState: 1, productUdi: productUdi, serialNo: startStr + startNum };
        udiCodeList.push(udiObj);
      }
      if (result.serialNoSize != udiCodeList[udiCodeList.length - 1].serialNo.length || result.serialNoSize != udiCodeList[0].serialNo.length) {
        //自增的序列号位数超过生成规则的位数 例如从1 自增到10
        throw new Error("序列号长度和生成规则位数不一致");
      }
    } else {
      throw new Error("没有UDI生成规则");
    }
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });