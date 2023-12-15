let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context) {
    let retData = {};
    //遍历查询结果，对数据进行更新
    let updateData = context.data;
    let pushFlagS = context.pushFlagS;
    let errorMessage = context.errorMessage;
    let errorMessageMap = {};
    //拆分S返回的错误信息，错误样例："line:{3}->数据唯一标识有重复!Z06GIM-001,SL030200130945,112725,NA,NA,2023-03-16;line:{4}->供应商物料编码[SL886000095916]数据不存在!;"
    if (!pushFlagS) {
      var errorMessageList = errorMessage.split(";");
      if (errorMessageList && errorMessageList.length > 0) {
        errorMessageList.map((message) => {
          if (message && message != "") {
            let temp = message.split("->");
            if (temp && temp.length > 1) {
              errorMessageMap[temp[0]] = temp[1];
            }
          }
        });
      }
    }
    let dataForUpdate = [];
    let codeToErrorMessageMap = {};
    updateData.map((item, index) => {
      if (item) {
        item._status = "update";
        item.pushFlagS = pushFlagS;
        let realIndex = index + 1;
        let key = "line:{" + realIndex + "}";
        let message = errorMessageMap[key];
        if (message) {
          if (message.length > 200) {
            message = message.substring(0, 199);
          }
          item.errorMessage = message;
          codeToErrorMessageMap[item.itemCode] = message;
        }
      }
    });
    updateData.map((item, index) => {
      if (item) {
        let message = codeToErrorMessageMap[item.itemCode];
        if (message) {
          item.errorMessage = message;
        } else {
          if (errorMessage.length > 200) {
            errorMessage = errorMessage.substring(0, 199);
          }
          item.errorMessage = errorMessage;
        }
      }
    });
    //调用实体操作，对实体进行更新
    if (updateData && updateData.length > 0) {
      var res = ObjectStore.updateBatch("AT173E4CEE16E80007.AT173E4CEE16E80007.demandStock", updateData, "ybf91e48c3");
      retData.data = res || [];
    } else {
      retData.success = false;
    }
    //根据执行结果，构建返回值
    return retData;
  }
}
exports({ entryPoint: MyTrigger });