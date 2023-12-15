let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productArray = request.productArray;
    for (var i = 0; i < productArray.length; i++) {
      // 获取全部数据
      var Productionworknumber = productArray[i]["生产工号"];
      //获取子表数据
      var sql1 = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + Productionworknumber + "'and dr = 0";
      var List = ObjectStore.queryByYonQL(sql1);
      var sql =
        "select BasicInformationDetailsFk.contractno,BasicInformationDetailsFk,BasicInformationDetailsFk.Acceptance_date from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" +
        Productionworknumber +
        "'and dr = 0";
      var data = ObjectStore.queryByYonQL(sql);
      // 获取id
      let id = data[0].BasicInformationDetailsFk;
      //获取安装合同号
      let contractno = data[0].BasicInformationDetailsFk_contractno;
      let settlementAmount = 0;
      let pid = "";
      // 更新主表条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = {};
      if (List != null) {
        //子表id
        pid = List[0].id;
        //查询分科名称，监理名称
        var sql1s = "select Supervisorystaff.name,branch.name from GT102917AT3.GT102917AT3.BasicInformationDetails where id = '" + pid + "'and dr = 0";
        var Listss = ObjectStore.queryByYonQL(sql1s);
        //获取子表生产工号
        var Productionworknumber = "";
        if (List[0].Productionworknumber != undefined) {
          Productionworknumber = List[0].Productionworknumber;
        }
        //状态设定初始值
        var state = "1";
        var jinchangriqi = null;
        var shijiyanshouriqi = null;
        if (List != null) {
          if (List.length > 0) {
            if (List[0].jinchangriqi != null) {
              //获取进场日期
              jinchangriqi = List[0].jinchangriqi;
            }
          }
        }
        if (List != null) {
          if (List.length > 0) {
            if (List[0].shijiyanshouriqi != null) {
              //获取实际验收日期
              shijiyanshouriqi = List[0].shijiyanshouriqi;
            }
          }
        }
        if (jinchangriqi != null) {
          state = "2";
          if (shijiyanshouriqi != null) {
            state = "3";
          }
        }
        //施工前表
        if (List != null) {
          if (List.length > 0) {
            //告知资料提交完成周期设初始值
            var DataSubmissionCompletionPeriod = "";
            //地盘报告2状态设定枚举值
            var DP = "0";
            //发货五天内状态设定枚举值
            var FH = "0";
            //接受合同30天状态设定枚举值
            var JS = "0";
            //判断上二排日期是否为空
            if (List[0].shangerpairiqi != null) {
              DP = "1";
              //获取上二排日期
              var SRP3 = List[0].shangerpairiqi;
              if (SRP3 != null) {
                var SRP2 = SRP3.replace(/-/g, "/"); // 2022/06/22 12:00:
                var SRP = new Date(SRP2).getTime();
              }
              //获取二次地盘检查报告日期
              var ERP3 = List[0].ercidipanjianchabaogao;
              if (ERP3 != null) {
                var ERP2 = ERP3.replace(/-/g, "/"); // 2022/06/22 12:00:
                var ERP = new Date(ERP2).getTime();
                DP = "2";
                var day = (ERP - SRP) / 86400000;
                if (day > 5) {
                  DP = "4";
                }
              } else {
                //获取当前时间戳
                var aa1 = new Date().getTime();
                var day = (aa1 - SRP) / 86400000;
                if (day > 5) {
                  DP = "3";
                }
              }
            }
            //判断日立发货日期是否为空
            if (List[0].rilifahuoriqi != null) {
              FH = "1";
              //获取日立发货日期
              var RLDate3 = List[0].rilifahuoriqi;
              if (RLDate3 != null) {
                var RLDate2 = RLDate3.replace(/-/g, "/"); // 2022/06/22 12:00:
                var RLDate = new Date(RLDate2).getTime();
              }
              //获取任务下达单提交日期
              var RXDate3 = List[0].renwuxiadadantijiaoriqi;
              //获取客户施工计划日期
              var KHDate3 = List[0].kehushigongjihua;
              //获取告知日期
              var GZDate3 = List[0].gaozhiriqi;
              if (RXDate3 != null && KHDate3 != null && GZDate3 != null) {
                var RXDate2 = RXDate3.replace(/-/g, "/"); // 2022/06/22 12:00:
                var RXDate = new Date(RXDate2).getTime();
                var KHDate2 = KHDate3.replace(/-/g, "/"); // 2022/06/22 12:00:
                var KHDate = new Date(KHDate2).getTime();
                var GZDate2 = GZDate3.replace(/-/g, "/"); // 2022/06/22 12:00:
                var GZDate = new Date(GZDate2).getTime();
                var maxDate = 0;
                FH = "2";
                if (maxDate < RXDate) {
                  maxDate = RXDate;
                }
                if (maxDate < KHDate) {
                  maxDate = KHDate;
                }
                if (maxDate < GZDate) {
                  maxDate = GZDate;
                }
                var day1 = (maxDate - RLDate) / 86400000;
                if (day1 > 5) {
                  FH = "4";
                }
              } else {
                //获取当前时间戳
                var AA1 = new Date().getTime();
                var day1 = (AA1 - RLDate) / 86400000;
                if (day1 > 5) {
                  FH = "3";
                }
              }
            }
            //判断接受合同日期是否为空
            if (data[0].BasicInformationDetailsFk_Acceptance_date != null) {
              JS = "1";
              //获取接受合同日期
              var APDate = data[0].BasicInformationDetailsFk_Acceptance_date;
              if (APDate != null) {
                var APDate1 = APDate.replace(/-/g, "/");
                APDate = new Date(APDate1).getTime(); // 2022/06/22 12:00:
              }
              //获取监理微信群日期
              var JLDate = List[0].jianliweixinqun;
              //获取一次地盘检查报告日期
              var YCDate = List[0].yicidipanjianchabaogao;
              //获取现场检查照片日期
              var XCDate = List[0].xianchangjianchazhaopian;
              //获取温馨提示日期
              var WXDate = List[0].wenxintishi;
              //获取报装资料提示日期
              var BZDate = List[0].baozhuangziliaotishi;
              if (JLDate != null && YCDate != null && XCDate != null && WXDate != null && BZDate != null) {
                var JLDate1 = JLDate.replace(/-/g, "/");
                JLDate = new Date(JLDate1).getTime(); // 2022/06/22 12:00:
                var YCDate1 = YCDate.replace(/-/g, "/");
                YCDate = new Date(YCDate1).getTime(); // 2022/06/22 12:00:
                var XCDate1 = XCDate.replace(/-/g, "/");
                XCDate = new Date(XCDate1).getTime(); // 2022/06/22 12:00:
                var WXDate1 = WXDate.replace(/-/g, "/");
                WXDate = new Date(WXDate1).getTime(); // 2022/06/22 12:00:
                var BZDate1 = BZDate.replace(/-/g, "/");
                BZDate = new Date(BZDate1).getTime(); // 2022/06/22 12:00:
                var maxDateA = 0;
                JS = "2";
                if (maxDateA < JLDate) {
                  maxDateA = JLDate;
                }
                if (maxDateA < YCDate) {
                  maxDateA = YCDate;
                }
                if (maxDateA < XCDate) {
                  maxDateA = XCDate;
                }
                if (maxDateA < WXDate) {
                  maxDateA = WXDate;
                }
                if (maxDateA < BZDate) {
                  maxDateA = BZDate;
                }
                let dayA1 = (maxDateA - APDate) / 86400000;
                if (dayA1 > 30) {
                  JS = "4";
                }
              } else {
                //获取当前时间戳
                var AAA1 = new Date().getTime();
                let dayA1 = (AAA1 - APDate) / 86400000;
                if (dayA1 > 30) {
                  JS = "3";
                }
              }
            }
            if (List[0].DateOfSubmissionOfNotificationInformationBySupervisor != null && List[0].rilifahuoriqi != null) {
              //获取监理提交告知资料日期
              let DateOfSubmissionOfNotificationInformationBySupervisor3 = List[0].DateOfSubmissionOfNotificationInformationBySupervisor;
              let DateOfSubmissionOfNotificationInformationBySupervisor2 = DateOfSubmissionOfNotificationInformationBySupervisor3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let DateOfSubmissionOfNotificationInformationBySupervisor = new Date(DateOfSubmissionOfNotificationInformationBySupervisor2).getTime();
              //获取日立发货日期
              let rilifahuoriqi3 = List[0].rilifahuoriqi;
              let rilifahuoriqi2 = rilifahuoriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let rilifahuoriqi = new Date(rilifahuoriqi2).getTime();
              //计算告知资料提交完成周期
              DataSubmissionCompletionPeriod = Math.ceil((DateOfSubmissionOfNotificationInformationBySupervisor - rilifahuoriqi) / 86400000) + "天";
            }
            //获取id
            let sid = List[0].id;
          }
        }
        if (List != null) {
          //施工中表
          if (List.length > 0) {
            var jianjiantijiaowanchengzhouqi = "";
            var jianjianshenpiwanchengzhouqi = "";
            var jijianwanchengzhouqi = "";
            var jijianbaogaozhouqi = "";
            var CompletionCycleOfSupervisionAndInspectionDataSubmission = "";
            var AcceptanceAompletionPeriod = "";
            if (List[0].rilifahuoriqi != null && List[0].DateOfSubmissionOfInspectionMaterialsBySupervisor != null) {
              //获取告知日期
              let gaozhiriqi3 = List[0].rilifahuoriqi;
              let gaozhiriqi2 = gaozhiriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let rilifahuoriqi = new Date(gaozhiriqi2).getTime();
              //获取监理提交监检资料日期
              let DateOfSubmissionOfInspectionMaterialsBySupervisor3 = List[0].DateOfSubmissionOfInspectionMaterialsBySupervisor;
              let DateOfSubmissionOfInspectionMaterialsBySupervisor2 = DateOfSubmissionOfInspectionMaterialsBySupervisor3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let DateOfSubmissionOfInspectionMaterialsBySupervisor = new Date(DateOfSubmissionOfInspectionMaterialsBySupervisor2).getTime();
              //计算监检提交完成周期
              CompletionCycleOfSupervisionAndInspectionDataSubmission = Math.ceil((DateOfSubmissionOfInspectionMaterialsBySupervisor - rilifahuoriqi) / 86400000) + "天";
            }
            if (List[0].jihuayanshouriqin != null && List[0].shijiyanshouriqi != null) {
              //获取计划验收日期
              let jihuayanshouriqin3 = List[0].jihuayanshouriqin;
              let jihuayanshouriqin2 = jihuayanshouriqin3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let jihuayanshouriqin = new Date(jihuayanshouriqin2).getTime();
              //获取实际验收日期
              let shijiyanshouriqi3 = List[0].shijiyanshouriqi;
              let shijiyanshouriqi2 = shijiyanshouriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shijiyanshouriqi = new Date(shijiyanshouriqi2).getTime();
              //计算验收完成周期
              AcceptanceAompletionPeriod = Math.ceil((shijiyanshouriqi - jihuayanshouriqin) / 86400000) + "天";
            }
            if (List[0].rilifahuoriqi != null && List[0].jianjiantijiaoriqi != null) {
              //获取告知日期
              let gaozhiriqi3 = List[0].rilifahuoriqi;
              let gaozhiriqi2 = gaozhiriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let rilifahuoriqi = new Date(gaozhiriqi2).getTime();
              //获取监检提交日期
              let jianjiantijiaoriqi3 = List[0].jianjiantijiaoriqi;
              let jianjiantijiaoriqi2 = jianjiantijiaoriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let jianjiantijiaoriqi = new Date(jianjiantijiaoriqi2).getTime();
              //计算监检提交完成周期
              jianjiantijiaowanchengzhouqi = Math.ceil((jianjiantijiaoriqi - rilifahuoriqi) / 86400000) + "天";
            }
            if (List[0].rilifahuoriqi != null && List[0].jianjianshenpiwanchengriqi != null) {
              //获取告知日期
              let gaozhiriqi3 = List[0].rilifahuoriqi;
              let gaozhiriqi2 = gaozhiriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let rilifahuoriqi = new Date(gaozhiriqi2).getTime();
              //获取审批完成日期
              let jianjianshenpiwanchengriqi3 = List[0].jianjianshenpiwanchengriqi;
              let jianjianshenpiwanchengriqi2 = jianjianshenpiwanchengriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let jianjianshenpiwanchengriqi = new Date(jianjianshenpiwanchengriqi2).getTime();
              //计算监检审批完成周期
              jianjianshenpiwanchengzhouqi = Math.ceil((jianjianshenpiwanchengriqi - rilifahuoriqi) / 86400000) + "天";
            }
            if (List[0].jihuajijianriqin != null && List[0].shijijijianriqi != null) {
              //获取计划技检日期
              let jihuajijianriqin3 = List[0].jihuajijianriqin;
              let jihuajijianriqin2 = jihuajijianriqin3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let jihuajijianriqin = new Date(jihuajijianriqin2).getTime();
              //获取实际技检日期
              let shijijijianriqi3 = List[0].shijijijianriqi;
              let shijijijianriqi2 = shijijijianriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shijijijianriqi = new Date(shijijijianriqi2).getTime();
              //计算技检完成周期
              jijianwanchengzhouqi = Math.ceil((shijijijianriqi - jihuajijianriqin) / 86400000) + "天";
            }
            if (List[0].shijijijianriqi != null && List[0].jijianbaogao) {
              //获取实际技检日期
              let shijijijianriqi3 = List[0].shijijijianriqi;
              let shijijijianriqi2 = shijijijianriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shijijijianriqi = new Date(shijijijianriqi2).getTime();
              //获取技检报告日期
              let jijianbaogao3 = List[0].jijianbaogao;
              let jijianbaogao2 = jijianbaogao3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let jijianbaogao = new Date(jijianbaogao2).getTime();
              //计算技检报告周期
              jijianbaogaozhouqi = Math.ceil((jijianbaogao - shijijijianriqi) / 86400000) + "天";
            }
          }
        }
        //完工表
        if (List != null) {
          if (List.length > 0) {
            var zhibaohetongwanchengzhouqi = "";
            var shiyongdengjizhengwanchengzhouqi = "";
            var diantiyijiaozhouqi = "";
            var yijiaoziliaozhouqi = "";
            var riliquerenwangongzhouqi = "";
            var yanshouwangongzhouqi = "";
            var jijianwangongzhouqi = "";
            var wangongdaiwanchengzhouqi = "";
            if (List[0].jijianbaogao != null && List[0].zhibaohetongshuangfanggaizhang != null) {
              //获取技检报告日期
              let jijianbaogao3 = List[0].jijianbaogao;
              let jijianbaogao2 = jijianbaogao3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let jijianbaogao = new Date(jijianbaogao2).getTime();
              //获取质保合同双方盖章日期
              let zhibaohetongshuangfanggaizhang3 = List[0].zhibaohetongshuangfanggaizhang;
              let zhibaohetongshuangfanggaizhang2 = zhibaohetongshuangfanggaizhang3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let zhibaohetongshuangfanggaizhang = new Date(zhibaohetongshuangfanggaizhang2).getTime();
              //计算质保合同完成周期
              zhibaohetongwanchengzhouqi = Math.ceil((zhibaohetongshuangfanggaizhang - jijianbaogao) / 86400000) + "天";
            }
            if (List[0].jijianbaogao != null && List[0].shiyongdengjizhengwanchengriqi != null) {
              //获取技检报告日期
              let jijianbaogao3 = List[0].jijianbaogao;
              let jijianbaogao2 = jijianbaogao3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let jijianbaogao = new Date(jijianbaogao2).getTime();
              //获取使用登记证完成日期
              let shiyongdengjizhengwanchengriqi3 = List[0].shiyongdengjizhengwanchengriqi;
              let shiyongdengjizhengwanchengriqi2 = shiyongdengjizhengwanchengriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shiyongdengjizhengwanchengriqi = new Date(shiyongdengjizhengwanchengriqi2).getTime();
              //计算使用登记证完成周期
              shiyongdengjizhengwanchengzhouqi = Math.ceil((shiyongdengjizhengwanchengriqi - jijianbaogao) / 86400000) + "天";
            }
            if (List[0].changjianbaogao != null && List[0].diantiyijiaoquerenshu != null) {
              //获取厂检报告日期
              let changjianbaogao3 = List[0].changjianbaogao;
              let changjianbaogao2 = changjianbaogao3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let changjianbaogao = new Date(changjianbaogao2).getTime();
              //获取电梯移交确认书上传日期
              let diantiyijiaoquerenshu3 = List[0].diantiyijiaoquerenshu;
              let diantiyijiaoquerenshu2 = diantiyijiaoquerenshu3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let diantiyijiaoquerenshu = new Date(diantiyijiaoquerenshu2).getTime();
              //计算电梯移交周期
              diantiyijiaozhouqi = Math.ceil((diantiyijiaoquerenshu - changjianbaogao) / 86400000) + "天";
            }
            if (List[0].shiyongdengjizhengwanchengriqi != null && List[0].ziliaoyijiaobiao != null) {
              //获取使用登记证完成日期
              let shiyongdengjizhengwanchengriqi3 = List[0].shiyongdengjizhengwanchengriqi;
              let shiyongdengjizhengwanchengriqi2 = shiyongdengjizhengwanchengriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shiyongdengjizhengwanchengriqi = new Date(shiyongdengjizhengwanchengriqi2).getTime();
              //获取移交资料上传日期
              let ziliaoyijiaobiao3 = List[0].ziliaoyijiaobiao;
              let ziliaoyijiaobiao2 = ziliaoyijiaobiao3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let ziliaoyijiaobiao = new Date(ziliaoyijiaobiao2).getTime();
              //计算移交资料周期
              yijiaoziliaozhouqi = Math.ceil((ziliaoyijiaobiao - shiyongdengjizhengwanchengriqi) / 86400000) + "天";
            }
            if (List[0].riliquerenwangong != null && List[0].shijiyanshouriqi != null) {
              //获取实际验收日期
              let shijiyanshouriqi3 = List[0].shijiyanshouriqi;
              let shijiyanshouriqi2 = shijiyanshouriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shijiyanshouriqi = new Date(shijiyanshouriqi2).getTime();
              //获取日立确认完工日期
              let riliquerenwangong3 = List[0].riliquerenwangong;
              let riliquerenwangong2 = riliquerenwangong3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let riliquerenwangong = new Date(riliquerenwangong2).getTime();
              //计算日立确认完工周期
              riliquerenwangongzhouqi = Math.ceil((riliquerenwangong - shijiyanshouriqi) / 86400000) + "天";
            }
            if (List[0].rilifahuoriqi != null && List[0].shijiyanshouriqi != null) {
              //获取实际验收日期
              let shijiyanshouriqi3 = List[0].shijiyanshouriqi;
              let shijiyanshouriqi2 = shijiyanshouriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shijiyanshouriqi = new Date(shijiyanshouriqi2).getTime();
              //获取日立发货日期
              let rilifahuoriqi3 = List[0].rilifahuoriqi;
              let rilifahuoriqi2 = rilifahuoriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let rilifahuoriqi = new Date(rilifahuoriqi2).getTime();
              //计算验收完工周期
              yanshouwangongzhouqi = Math.ceil((shijiyanshouriqi - rilifahuoriqi) / 86400000) + "天";
            }
            if (List[0].rilifahuoriqi != null && List[0].shijijijianriqi != null) {
              //获取实际技检日期
              let shijijijianriqi3 = List[0].shijijijianriqi;
              let shijijijianriqi2 = shijijijianriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shijijijianriqi = new Date(shijijijianriqi2).getTime();
              //获取日立发货日期
              let rilifahuoriqi3 = List[0].rilifahuoriqi;
              let rilifahuoriqi2 = rilifahuoriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let rilifahuoriqi = new Date(rilifahuoriqi2).getTime();
              //计算技检完工周期
              jijianwangongzhouqi = Math.ceil((shijijijianriqi - rilifahuoriqi) / 86400000) + "天";
            }
            if (List[0].wangongdaiwanchengriqi != null && List[0].shijiyanshouriqi != null) {
              //获取实际验收日期
              let shijiyanshouriqi3 = List[0].shijiyanshouriqi;
              let shijiyanshouriqi2 = shijiyanshouriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let shijiyanshouriqi = new Date(shijiyanshouriqi2).getTime();
              //获取完工袋完成日期
              let wangongdaiwanchengriqi3 = List[0].wangongdaiwanchengriqi;
              let wangongdaiwanchengriqi2 = wangongdaiwanchengriqi3.replace(/-/g, "/"); // 2022/06/22 12:00:
              let wangongdaiwanchengriqi = new Date(wangongdaiwanchengriqi2).getTime();
              //计算完工袋完成周期
              wangongdaiwanchengzhouqi = Math.ceil((wangongdaiwanchengriqi - shijiyanshouriqi) / 86400000) + "天";
            }
          }
        }
        // 更新子表条件
        var updateWrapper1 = new Wrapper();
        updateWrapper1.eq("id", pid);
        // 待更新字段内容
        var toUpdate1 = {
          state: state,
          getState: JS,
          jianjianshenpiwanchengzhouqi: jianjianshenpiwanchengzhouqi,
          jijianbaogaozhouqi: jijianbaogaozhouqi,
          jijianwangongzhouqi: jijianwangongzhouqi,
          jijianwanchengzhouqi: jijianwanchengzhouqi,
          AcceptanceCompletionPeriod: AcceptanceAompletionPeriod,
          dipanbaogao2zhuangtai: DP,
          fahuo5tiannazhuangtai: FH,
          MonitoringDataCycle: CompletionCycleOfSupervisionAndInspectionDataSubmission,
          jianjiantijiaowanchengzhouqi: jianjiantijiaowanchengzhouqi,
          DataSubmissionCompletionPeriod: DataSubmissionCompletionPeriod,
          zhibaohetongwanchengzhouqi: zhibaohetongwanchengzhouqi,
          shiyongdengjizhengwanchengzhouqi: shiyongdengjizhengwanchengzhouqi,
          diantiyijiaozhouqi: diantiyijiaozhouqi,
          yijiaoziliaozhouqi: yijiaoziliaozhouqi,
          riliquerenwangongzhouqi: riliquerenwangongzhouqi,
          yanshouwangongzhouqi: yanshouwangongzhouqi,
          wangongdaiwanchengzhouqi: wangongdaiwanchengzhouqi,
          productionNumber: Productionworknumber
        };
        // 执行更新
        var res2 = ObjectStore.update("GT102917AT3.GT102917AT3.BasicInformationDetails", toUpdate1, updateWrapper1, "86d71aab");
        //回写分包合同
        //根据生产工号查询分包合同子表
        var sql = "select id,subcontract_id.subcontractNo from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" + Productionworknumber + "'and dr = 0";
        var Lists = ObjectStore.queryByYonQL(sql);
        if (Lists) {
          for (var j = 0; j < Lists.length; j++) {
            //获取安装合同号
            var installationContractNumber = Lists[j].subcontract_id_subcontractNo;
            if (installationContractNumber == contractno) {
              //获取id
              var FBId = Lists[j].id;
              //获取监理人员
              var Supervisorystaff_name = "";
              if (Listss[0].Supervisorystaff_name != null) {
                Supervisorystaff_name = Listss[0].Supervisorystaff_name;
              }
              //获取分科
              var branch_name = "";
              if (Listss[0].branch_name != null) {
                branch_name = Listss[0].branch_name;
              }
              //获取安装组长
              var installationgroup = "";
              if (List[0].installationgroup != null) {
                installationgroup = List[0].installationgroup;
              }
              //获取日立监理
              var Hitachisupervision = "";
              if (List[0].Hitachisupervision != null) {
                Hitachisupervision = List[0].Hitachisupervision;
              }
              //获取进场日期
              if (List[0].jinchangriqi != null) {
                jinchangriqi = List[0].jinchangriqi;
              }
              //获取实际验收日期
              if (List[0].shijiyanshouriqi != null) {
                shijiyanshouriqi = List[0].shijiyanshouriqi;
              }
              //更新分包合同
              // 待更新字段内容
              var FBtoUpdate = {
                id: FBId,
                branch: branch_name,
                supervisoryStaff: Supervisorystaff_name,
                installationleader: installationgroup,
                hitachiSupervision: Hitachisupervision,
                dateOfEntry: jinchangriqi,
                actualAcceptanceDate: shijiyanshouriqi
              };
              // 执行更新
              var res2 = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontractDetails", FBtoUpdate, "82884516");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });