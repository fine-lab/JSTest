let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ww = JSON.parse(param.requestData);
    // 获取页面上的合同号
    var Contractno = param.data[0].contractno;
    if (param.requestData._status == null) {
      var ddd = JSON.parse(param.requestData);
    } else {
      var ddd = param.requestData;
    }
    // 获取现在的页面状态
    var vvv = ddd._status;
    // 查询安装合同主表，取出合同号
    var sql = "select contractno,id from GT102917AT3.GT102917AT3.basicinformation";
    var res = ObjectStore.queryByYonQL(sql);
    // 查询安装合同子表生产工号，取出id和安装合同主表id
    var sql3 = "select BasicInformationDetailsFk,Productionworknumber from GT102917AT3.GT102917AT3.BasicInformationDetails";
    var res3 = ObjectStore.queryByYonQL(sql3);
    //获取页面子表集合
    var subList = ddd.BasicInformationDetailsList;
    // 判断导入时的页面状态
    if (vvv == "Insert") {
      for (var i = 0; i < res.length; i++) {
        var hth = res[i].contractno;
        if (hth == Contractno) {
          throw new Error("合同号重复");
        }
      }
      if (subList != null) {
        var sum1 = 0;
        for (var k = 0; k < subList.length; k++) {
          for (var l = 0; l < subList.length; l++) {
            if (subList[k].Productionworknumber == subList[l].Productionworknumber) {
              sum1 = sum1 + 1;
            }
          }
        }
        if (sum1 != subList.length) {
          throw new Error("生产工号重复");
        }
      }
      if (subList != null) {
        for (var m = 0; m < subList.length; m++) {
          for (var n = 0; n < res3.length; n++) {
            if (subList[m].Productionworknumber == res3[n].Productionworknumber) {
              throw new Error("生产工号" + subList[m].Productionworknumber + "重复");
            }
          }
        }
      }
    } else {
      // 判断现在的页面状态
      if (vvv == "Update") {
        if (subList != null) {
          for (var j = 0; j < subList.length; j++) {
            if (subList[j]._tableDisplayOutlineAll == false && subList[j].Productionworknumber != null) {
              if (subList[j].id != null) {
                //根据生产工号查询安装合同子表id
                var sql1 = "select id from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + subList[j].Productionworknumber + "'";
                var res1 = ObjectStore.queryByYonQL(sql1);
                for (var a = 0; a < res1.length; a++) {
                  if (res1[a].id != subList[j].id) {
                    throw new Error("生产工号" + subList[j].Productionworknumber + "重复");
                  }
                }
              } else {
                //根据查询安装合同子表生产工号
                var sql2 = "select Productionworknumber from GT102917AT3.GT102917AT3.BasicInformationDetails";
                var res2 = ObjectStore.queryByYonQL(sql2);
                for (var b = 0; b < res2.length; b++) {
                  if (res2[b].Productionworknumber == subList[j].Productionworknumber) {
                    throw new Error("生产工号" + subList[j].Productionworknumber + "重复");
                  }
                }
              }
            }
          }
        }
        if (subList != null) {
          var sum1 = 0;
          var sum2 = 0;
          for (var k = 0; k < subList.length; k++) {
            if (subList[k]._tableDisplayOutlineAll == false && subList[k].Productionworknumber != null) {
              sum2 = sum2 + 1;
              for (var l = 0; l < subList.length; l++) {
                if (subList[k].Productionworknumber == subList[l].Productionworknumber && subList[l]._tableDisplayOutlineAll == false && subList[l].Productionworknumber != null) {
                  sum1 = sum1 + 1;
                }
              }
            }
          }
          if (sum1 != sum2) {
            throw new Error("生产工号重复");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });