function loadjs(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = params;
  headobj.appendChild(script);
}
loadjs("/iuap-yonbuilder-runtime/opencomponentsystem/public/RBSM/techfund.js?domainKey=developplatform");
viewModel.on("afterRule", function (args) {
  //获取报销人数据
  let pk_handlepsn = viewModel.get("pk_handlepsn").getValue();
  //获取费用承担部门数据
  let vfinacedeptid = viewModel.get("vfinacedeptid").getValue();
  console.log("afterRule====报销==== " + pk_handlepsn + "==费用承担部门== " + vfinacedeptid);
  if (pk_handlepsn && vfinacedeptid) {
    console.log("afterRule====报销==== " + pk_handlepsn + "==费用承担部门== " + vfinacedeptid);
  }
});
//编写加载元数据后事件
viewModel.on("afterBuildCode", function (args) {
  //获取当前单据交易类型
  let bustypeName = viewModel.get("bustype_name").getValue();
  console.log("加载元数据后事件=》单据交易类型：" + bustypeName);
  if (bustypeName == "通用报销单") {
    //隐藏按钮
    console.log("通用报销单");
  }
  if (bustypeName == "TECH FUND") {
    //获取报销人数据
    let pk_handlepsn = viewModel.get("pk_handlepsn").getValue();
    //获取费用承担部门数据
    let vfinacedeptid = viewModel.get("vfinacedeptid").getValue();
    console.log("加载元数据后事件====报销==== " + pk_handlepsn + "==费用承担部门== " + vfinacedeptid);
    if (pk_handlepsn && vfinacedeptid) {
      //清空数值
      viewModel.get("extend2").setValue("");
      viewModel.get("extend3").setValue("");
      viewModel.get("extend4").setValue("");
      viewModel.get("extend5").setValue("");
      viewModel.get("extend6").setValue("");
      viewModel.get("extend7").setValue("");
      viewModel.get("extend9").setValue("");
      cb.rest.invokeFunction("RBSM.rule.getHisData", { userId: pk_handlepsn, deptId: vfinacedeptid }, function (err, res) {
        console.log("编写加载元数据后事件****1111***111");
        console.log(err);
        console.log(res);
        //获取数据库查询结果数据
        if (res != null && res != undefined) {
          //余额数值设置
          viewModel.get("extend9").setValue(res.tfAmount);
          //手机出库时间
          if (res.tpObj != null && res.tpObj != undefined) {
            let tpObj = res.tpObj;
            let tpObjResSQL = res.tpObjResSQL;
            if (tpObj != null && tpObj != undefined && tpObj.length > 0) {
              viewModel.get("extend2").setValue(tpObj[0].name); //手机名称
            }
            if (tpObjResSQL != null && tpObjResSQL != undefined && tpObjResSQL.length > 0) {
              if (tpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != null && tpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != undefined) {
                const res1 = tpObjResSQL[0].othOutRecordDefineCharacter.headDefine3; //cTab_define3;//vouchdate.substring(0,11);
                console.log("XXXX " + res1);
                viewModel.get("extend3").setValue(res1); //电脑出库时间
              }
            }
          }
          //电脑出库时间
          if (res.lpObj != null && res.lpObj != undefined) {
            let lpObj = res.lpObj;
            let lpObjResSQL = res.lpObjResSQL;
            if (lpObj != null && lpObj != undefined && lpObj.length > 0) {
              viewModel.get("extend5").setValue(lpObj[0].name); //电脑名称
            }
            if (lpObjResSQL != null && lpObjResSQL != undefined && lpObjResSQL.length > 0) {
              if (lpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != null && lpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != undefined) {
                const res1 = lpObjResSQL[0].othOutRecordDefineCharacter.headDefine3; //cTab_define3;//vouchdate.substring(0,11);
                viewModel.get("extend4").setValue(res1); //电脑出库时间
              }
            }
          }
          if (res.pdObj != null && res.pdObj != undefined) {
            let pdObj = res.pdObj;
            let pdObjResSQL = res.pdObjResSQL;
            if (pdObj != null && pdObj != undefined && pdObj.length > 0) {
              viewModel.get("extend7").setValue(pdObj[0].name); //IPD名称
            }
            if (pdObjResSQL != null && pdObjResSQL != undefined && pdObjResSQL.length > 0) {
              if (pdObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != null && pdObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != undefined) {
                const res1 = pdObjResSQL[0].othOutRecordDefineCharacter.headDefine3; //cTab_define3;//vouchdate.substring(0,11);
                viewModel.get("extend6").setValue(res1); //IPD出库时间
              }
            }
          }
        }
      });
    }
  }
});
//查询出TF个人余额
viewModel.get("button157vi") &&
  viewModel.get("button157vi").on("click", function (data) {
    //交易类型
    let bustypeName = viewModel.get("bustype_name").getValue();
    console.log("查询出TF个人余额件=》单据交易类型：" + bustypeName);
    if (bustypeName == "TECH FUND") {
      //获取报销人数据
      let pk_handlepsn = viewModel.get("pk_handlepsn").getValue();
      //获取费用承担部门数据
      let vfinacedeptid = viewModel.get("vfinacedeptid").getValue();
      console.log("查询出TF个人余额====报销==== " + pk_handlepsn + "==费用承担部门== " + vfinacedeptid);
      //清空数值
      viewModel.get("extend9").setValue("");
      console.log("查询出TF个人余额===报销人===:" + pk_handlepsn + "====vfinacedeptid==:" + vfinacedeptid);
      cb.rest.invokeFunction("RBSM.rule.getTFAmount", { userId: pk_handlepsn, deptId: vfinacedeptid }, function (err, res) {
        console.log("查询出TF个人余额****1111***111");
        console.log(err);
        console.log(res);
        //获取数据库查询结果数据
        if (res != null && res != undefined) {
          //余额数值设置
          viewModel.get("extend9").setValue(res.tfAmount);
        }
      });
    }
  });
//出库记录按钮事件
viewModel.get("button97he") &&
  viewModel.get("button97he").on("click", function (data) {
    //交易类型
    let bustypeName = viewModel.get("bustype_name").getValue();
    console.log("出库记录按钮事件=》单据交易类型：" + bustypeName);
    if (bustypeName == "TECH FUND") {
      //获取报销人数据
      let pk_handlepsn = viewModel.get("pk_handlepsn").getValue();
      //获取费用承担部门数据
      let vfinacedeptid = viewModel.get("vfinacedeptid").getValue();
      console.log("出库记录按钮事===报销人===:" + pk_handlepsn + "====vfinacedeptid==:" + vfinacedeptid);
      if (pk_handlepsn && vfinacedeptid) {
        //清空数值
        viewModel.get("extend2").setValue("");
        viewModel.get("extend3").setValue("");
        viewModel.get("extend4").setValue("");
        viewModel.get("extend5").setValue("");
        viewModel.get("extend6").setValue("");
        viewModel.get("extend7").setValue("");
        viewModel.get("extend9").setValue("");
        cb.rest.invokeFunction("RBSM.rule.getHisData", { userId: pk_handlepsn, deptId: vfinacedeptid }, function (err, res) {
          console.log("111****1111***111");
          console.log(err);
          console.log(res);
          //获取数据库查询结果数据
          if (res != null && res != undefined) {
            //余额数值设置
            viewModel.get("extend9").setValue(res.tfAmount);
            //手机出库时间
            if (res.tpObj != null && res.tpObj != undefined) {
              let tpObj = res.tpObj;
              let tpObjResSQL = res.tpObjResSQL;
              if (tpObj != null && tpObj != undefined && tpObj.length > 0) {
                viewModel.get("extend2").setValue(tpObj[0].name); //手机名称
              }
              if (tpObjResSQL != null && tpObjResSQL != undefined && tpObjResSQL.length > 0) {
                if (tpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != null && tpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != undefined) {
                  const res1 = tpObjResSQL[0].othOutRecordDefineCharacter.headDefine3; //cTab_define3;//othOutRecordDefineCharacter.W9.substring(0,11);
                  console.log("XX222XX " + res1);
                  viewModel.get("extend3").setValue(res1); //手机出库时间
                }
              }
            }
            //电脑出库时间
            if (res.lpObj != null && res.lpObj != undefined) {
              let lpObj = res.lpObj;
              let lpObjResSQL = res.lpObjResSQL;
              if (lpObj != null && lpObj != undefined && lpObj.length > 0) {
                viewModel.get("extend5").setValue(lpObj[0].name); //电脑名称
              }
              if (lpObjResSQL != null && lpObjResSQL != undefined && lpObjResSQL.length > 0) {
                if (lpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != null && lpObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != undefined) {
                  const res1 = lpObjResSQL[0].othOutRecordDefineCharacter.headDefine3; //cTab_define3;//othOutRecordDefineCharacter.W9.substring(0,11);
                  viewModel.get("extend4").setValue(res1); //电脑出库时间
                }
              }
            }
            if (res.pdObj != null && res.pdObj != undefined) {
              let pdObj = res.pdObj;
              let pdObjResSQL = res.pdObjResSQL;
              if (pdObj != null && pdObj != undefined && pdObj.length > 0) {
                viewModel.get("extend7").setValue(pdObj[0].name); //IPD名称
              }
              if (pdObjResSQL != null && pdObjResSQL != undefined && pdObjResSQL.length > 0) {
                if (pdObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != null && pdObjResSQL[0].othOutRecordDefineCharacter.headDefine3 != undefined) {
                  const res1 = pdObjResSQL[0].othOutRecordDefineCharacter.headDefine3; //cTab_define3;//othOutRecordDefineCharacter.W9.substring(0,11);
                  viewModel.get("extend6").setValue(res1); //IPD出库时间
                }
              }
            }
          }
        });
      }
    }
  });
//提交前实现信息确认操作
viewModel.on("beforeSubmit", function (args) {
  //获取当前单据交易类型
  let bustypeName = viewModel.get("bustype_name").getValue();
  console.log("提交前实现信息确认=》单据交易类型：" + bustypeName);
  if (bustypeName == "TECH FUND") {
    var promise = new cb.promise();
    cb.utils.confirm(
      "经理审批后，此订单将进入采购流程无法取消，请再次确认所订物品及型号。",
      function () {
        // 点击确定
        return promise.resolve();
      },
      function () {
        // 点击取消
        promise.reject();
      }
    );
    return promise;
  }
});