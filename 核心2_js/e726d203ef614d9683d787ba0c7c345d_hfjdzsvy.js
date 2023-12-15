let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function PrefixInteger(num, length) {
      return (Array(length).join("0") + num).slice(-length);
    }
    let configId = request.configId; //最小包装id
    let serialList = request.serialList; //订单序列号
    let minConfig = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { id: configId });
    let productUdi = "";
    if (minConfig != null && minConfig.length != 0) {
      productUdi = minConfig[0].bzcpbs;
    }
    request.productUdi = productUdi;
    let udiCode = "";
    let udiCodeList = [];
    let otherOrderUdi = []; //其他单据生成UDI列表
    //查询生成配置规则
    let configObj = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { id: configId });
    let querySql =
      "select * from I0P_UDI.I0P_UDI.sy01_udi_create_config_sonv3 where sy01_udi_create_config_id in (select id from I0P_UDI.I0P_UDI.sy01_udi_create_configv3 where id='" +
      configObj[0].udiCreateConfigId +
      "') order by serialNum asc";
    let createRules = ObjectStore.queryByYonQL(querySql);
    if (createRules != null && createRules.length != 0) {
      let apiPreAndAppCode = extrequire("I0P_UDI.publicFunction.getApiPreAndApp").execute();
      let materialFileFilterUrl = apiPreAndAppCode.apiRestPre + "/udiManageController/createUdiCode";
      request.createRules = createRules;
      //通过后端脚创建UDI
      let result = postman("POST", materialFileFilterUrl, null, JSON.stringify(request));
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error(result.errorMessage);
      }
      udiCode = result.udiCode;
      let createUdiNum = request.createUdiNum;
      let serialNo = request.serialNo; //serialNo = k001k002
      if (serialList != null && serialList != undefined && serialList.length > 0) {
        let releaseUdiSerial = ObjectStore.queryByYonQL(
          "select serialNumber  from I0P_UDI.I0P_UDI.UDIFilev3 where dr = 0 and UDI in (select udiCode from I0P_UDI.I0P_UDI.udi_release_data_infov3 where dr = 0 and sourceCode = '" +
            request.billCode +
            "' and sourceType= '" +
            request.billType +
            "' )"
        );
        for (let i = 0; releaseUdiSerial != null && releaseUdiSerial != undefined && i < releaseUdiSerial.length; i++) {
          for (let j = 0; j < serialList.length; j++) {
            if (releaseUdiSerial[i].serialNumber == serialList[j].sn) {
              serialList.splice(j, 1);
              break;
            }
          }
        }
        for (let i = 0; i < serialList.length && udiCodeList.length < createUdiNum; i++) {
          //从生成订单序列号中获取序列号
          let newUdiCode = udiCode.replace("(21)" + serialNo, "(21)" + serialList[i].sn);
          let releaseUdi = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.udi_release_data_infov3", { udiCode: newUdiCode });
          let udiFile = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { UDI: newUdiCode });
          if ((releaseUdi == null && udiFile == null) || (releaseUdi.length <= 0 && udiFile.length <= 0)) {
            //判断序列号是否已发布
            let udiObj = { udiCode: newUdiCode, udiState: 1, productUdi: productUdi, serialNo: serialList[i].sn };
            udiCodeList.push(udiObj);
          } else if (releaseUdi.length <= 0 || releaseUdi[0].sourceType != request.billType || releaseUdi[0].sourceCode != request.billCode) {
            //其他单据生成UDI
            otherOrderUdi.push(newUdiCode);
          }
        }
        if (udiCodeList == null || udiCodeList.length == 0) {
          throw new Error("当前UDI码已经存在：" + JSON.stringify(otherOrderUdi));
        }
      } else {
        //自定义序列号
        //生成UDI数量大于1 根据生成数量自增序列号 例如001 002
        let firstnumpos = -1;
        let lastnumpos = -1;
        let reg = /^[0-9]+.?[0-9]*$/;
        for (let i = serialNo.length - 1; i >= 0; i--) {
          //找到从右向左第一个数值结束位
          if (reg.test(serialNo.charAt(i)) && lastnumpos == -1 && firstnumpos == -1) lastnumpos = i;
          //找到从右向左数值前的第一个非数值
          if (!reg.test(serialNo.charAt(i)) && firstnumpos == -1 && lastnumpos > i && lastnumpos != -1) firstnumpos = i;
        }
        if (firstnumpos == -1 && lastnumpos == -1) {
          throw new Error("序列号中不存在数值数据，无法自动生成,请检查!");
        }
        firstnumpos = firstnumpos + 1; //得出从右向左第一个数值开始位
        let prefix = serialNo.substring(0, firstnumpos); //前缀
        let postfix = serialNo.substring(lastnumpos + 1, serialNo.length); //后缀
        let serialnumber = serialNo.substring(firstnumpos, lastnumpos + 1);
        let udiObj = { udiCode: udiCode, udiState: 1, productUdi: productUdi, serialNo: request.serialNo };
        udiCodeList.push(udiObj);
        for (let m = 1; m < createUdiNum; m++) {
          //进行空行赋值
          if (serialnumber.length > 1) {
            //表示2位数
            let length = serialnumber.length > (parseInt(serialnumber) + 1 + "").length ? serialnumber.length : (parseInt(serialnumber) + 1 + "").length;
            serialnumber = PrefixInteger(parseInt(serialnumber) + 1, length);
          } else {
            serialnumber = parseInt(serialnumber) + 1;
          }
          let rowsn = prefix + serialnumber + postfix;
          let newUdiCode = udiCode.replace("(21)" + serialNo, "(21)" + rowsn);
          let udiObj = { udiCode: newUdiCode, udiState: 1, productUdi: productUdi, serialNo: rowsn };
          udiCodeList.push(udiObj);
        }
      }
      if (request.serialNoSize != undefined && request.serialNoSize != null && udiCodeList.length > 0) {
        if (result.serialNoSize != udiCodeList[udiCodeList.length - 1].serialNo.length || result.serialNoSize != udiCodeList[0].serialNo.length) {
          //自增的序列号位数超过生成规则的位数 例如从1 自增到10
          throw new Error("序列号长度和生成规则位数不一致，生成规则位数为：" + result.serialNoSize);
        }
      }
    } else {
      throw new Error("没有UDI生成规则");
    }
    return { result: udiCodeList, otherOrderUdi: otherOrderUdi };
  }
}
exports({ entryPoint: MyAPIHandler });