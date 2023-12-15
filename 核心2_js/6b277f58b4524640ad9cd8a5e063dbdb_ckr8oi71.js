let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = request.data.value != undefined ? request.data.value : undefined;
    if (date == undefined) {
      throw new Error("请选择时间区间");
    }
    //获取日期区间
    var dateInterval = substring(date, 0, 7);
    //根据期间查询批次日存栏的批次号、猪只类型
    var resul = "select picihao,zhuzhileixing from AT17604A341D580008.AT17604A341D580008.batchColumn where tongjiriqi like '" + dateInterval + "' and dr=0";
    var reData = ObjectStore.queryByYonQL(resul, "developplatform");
    unique(reData);
    var Alldata = [];
    for (var i = 0; i < reData.length; i++) {
      var picihao = reData[i].picihao;
      var PigType = reData[i].zhuzhileixing;
      function getPigType(PigType) {
        var newPigTpe = "";
        //匹配类型名称
        if (PigType === "1") {
          newPigTpe = "后备公猪";
        } else if (PigType === "2") {
          newPigTpe = "后备母猪";
        } else if (PigType === "3") {
          newPigTpe = "种公猪";
        } else if (PigType === "4") {
          newPigTpe = "待配母猪";
        } else if (PigType === "5") {
          newPigTpe = "怀孕母猪";
        } else if (PigType === "6") {
          newPigTpe = "哺乳母猪";
        } else if (PigType === "7") {
          newPigTpe = "哺乳仔猪";
        } else if (PigType === "8") {
          newPigTpe = "保育猪";
        } else if (PigType === "9") {
          newPigTpe = "育肥猪";
        }
        return newPigTpe;
      }
      //折旧费用 --查询固定资产
      var zJmoney = 0;
      var resgdzc = "select * from fa.famain.FixedAssetsInfo where tagno = '" + picihao + "' and dr=0"; //id
      var reAssets = ObjectStore.queryByYonQL(resgdzc, "yonbip-fi-efa");
      if (reAssets.length == 0) {
        zJmoney = 0;
      }
      l: for (var s = 0; s < reAssets.length; s++) {
        var freeChId = reAssets[s].freeChId;
        if (freeChId != undefined) {
          var typePig = freeChId.pigType;
          if (typePig != PigType) {
            continue l;
          }
        } else {
          continue l;
        }
        var assetId = reAssets[s].id;
        //资产折旧清单明细
        var resgdzczb = "select * from fa.fadepr.DeprAssignDtl where assetId = " + assetId + " and period = '" + dateInterval + "'"; //id
        var reAssetszb = ObjectStore.queryByYonQL(resgdzczb, "yonbip-fi-efa");
        if (reAssetszb.length != 0) {
          for (var c = 0; c < reAssetszb.length; c++) {
            var moneyS = reAssetszb[c].monthDeprAmount;
            zJmoney = zJmoney + moneyS;
          }
        } else {
          zJmoney = 0;
        }
      }
      //折旧费用 --查询折旧清单取值
      //根据code查询固定资产
      //期间费用
      var BatchNumberSq = "select id from AT17604A341D580008.AT17604A341D580008.sharingEntity where dr = 0 and TimeInterval like '" + dateInterval + "'";
      var BatchNumberRes = ObjectStore.queryByYonQL(BatchNumberSq, "developplatform");
      var summation = 0;
      if (BatchNumberRes.length != 0) {
        for (var i1 = 0; i1 < BatchNumberRes.length; i1++) {
          var mainId = BatchNumberRes[i1].id;
          var sonSq =
            "select * from AT17604A341D580008.AT17604A341D580008.CostSharingTable where dr = 0 and sharingEntity_id = '" +
            mainId +
            "' and picihao = '" +
            picihao +
            "' and zhuzhileixing='" +
            PigType +
            "'";
          var sonRes = ObjectStore.queryByYonQL(sonSq, "developplatform");
          if (sonRes.length != 0) {
            for (var p = 0; p < sonRes.length; p++) {
              var apportionment = sonRes[p].feiyongfentan;
              summation += apportionment;
            }
          }
        }
      }
      //根据期间查询材料出库主表
      var resAdv = "select id from st.materialout.MaterialOut where vouchdate like '" + dateInterval + "'";
      var reDate = ObjectStore.queryByYonQL(resAdv, "ustock");
      //判断是否为空
      var Batchrice = 0;
      for (var p1 = 0; p1 < reDate.length; p1++) {
        var id = reDate[p1].id;
        //根据主表id查询材料出库子表金额
        var res = "select natMoney,materialOutsDefineCharacter from st.materialout.MaterialOuts where mainid ='" + id + "'";
        var reBatch = ObjectStore.queryByYonQL(res, "ustock");
        if (reBatch.length != 0) {
          for (var p = 0; p < reBatch.length; p++) {
            if (reBatch[p].materialOutsDefineCharacter.picihao == picihao && reBatch[p].materialOutsDefineCharacter.pigType == PigType) {
              //循环累加成本金额
              Batchrice += Number(reBatch[p].natMoney);
            }
          }
        }
      }
      //组装参数返回
      var body = {
        picihao: picihao,
        liaoyaomiao: Batchrice,
        PigType: PigType,
        money: summation,
        zhejiu: zJmoney,
        weidu: picihao + "," + PigType
      };
      Alldata.push(body);
    }
    function unique(arr) {
      // 第一层for循环控制第一个数
      for (let i1 = 0; i1 < arr.length; i1++) {
        // 第二层循环控制第二个数
        for (let j1 = i1 + 1; j1 < arr.length; j1++) {
          // 判断前后是否相等
          if (arr[i1].zhuzhileixing === arr[j1].zhuzhileixing && arr[i1].picihao === arr[j1].picihao) {
            arr.splice(j1, 1); //j：下标 1：删除个数
            // 后面的往前移一位
            j1--;
          }
        }
      }
    }
    return { Alldata };
  }
}
exports({ entryPoint: MyAPIHandler });