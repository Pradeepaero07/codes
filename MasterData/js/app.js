var configurations = {};
var masterDataApp = (function () {
    var responseData = {};
    var accordion = [];
    var loginApp = function () {
        console.log("Successfully tested");
        validateLogin();
    };
    var validateLogin = function () {
        if ($("#username").val() != "" && $("#password").val() != "") {
            modifyView("login-container", "hide");
            modifyView("home-container", "show");
        } else {
            alert("Please enter the credentials");
        }
    };

    //This method hides and load the the element based on the action parameter
    // action -> show , hide
    var modifyView = function (divId, action) {
        if (action == "show") {
            $("#" + divId).show();
        } else {
            $("#" + divId).hide();
        }
    };
    var closeDropdown = function (id) {
        $("#" + id).attr("aria-expanded", false);
        $("#" + id).next().hide();
    };
    var dropDownToggle = function (id) {
        console.log("called:" + id);
        if ($("#" + id).attr("aria-expanded") == "false") {
            $("#" + id).attr("aria-expanded", true);
            $("#" + id).next().show();
        } else {
            $("#" + id).attr("aria-expanded", false);
            $("#" + id).next().hide();
        }
    }
    var selectAllPlines = function () {
        if ($("#all-productLines").attr("name") == "checked") {
            $("#all-productLines").attr("name", "unchecked");
            $("#all-productLines").parent().parent().parent().find("input").prop('checked', false);
        } else {
            $("#all-productLines").attr("name", "checked");
            $("#all-productLines").parent().parent().parent().find("input").prop('checked', true);
        }
    };

    var closeDropdownOffClick = function (id) {
        if (id != "multi-dropdown-menu" && id != "plDropDown" && $("#plDropDown").attr("aria-expanded") == "true") {
            $("#" + id).attr("aria-expanded", false);
            $("#multi-dropdown-menu").hide();
        }
    };

    var setValueToDropDown = function (id, value) {
        $("#" + id).text(value);
        $("#deptDropDown").css("border-color", "#ccc");
    };

    var checkAllPlOption = function () {
        var flag = true;
        $("#multi-dropdown-menu").find("input.plOption").each(function (itr, item) {
            if ($(this).prop("checked") == false) {
                flag = false;
                return false;
            }
        });
        if (flag) {
            $("#all-productLines").attr("name", "checked");
            $("#all-productLines").prop('checked', true);
        } else {
            $("#all-productLines").attr("name", "unchecked");
            $("#all-productLines").prop('checked', false);
        }
    };

    var searchReportDetails = function () {

        if (validateSelectedData()) {
            $("#accordion").remove();
            accordion = [];
            loadSelectedData(accordion);
            appendAccordions(accordion, "reports-table");
            $("#result-container").show();
            $("#accordion").accordion();
            $(".tabs").tabs();
            //  $("#ESP-report").load("./currentHCFRecord.html",function(){
            //     showProductLineItems();
            // });
            constructTableReport($("#deptDropDown").text().trim());
            loadAccordionChart(accordion);

        }

    };
    var constructTableReport = function (id) {
        $("#" + id + "-report").load("./report-table.html", function () {
            console.log("loaded");
        });
        var jqxhr = $.getJSON("./test-json.json", function () {
                console.log("success");
            })
            .done(function (data) {
                console.log("data received:["+data+"]response:["+responseData+"]");
                responseData = data;
                console.log("response:["+responseData[0]+"]");
                $.each(responseData["data"],function(itr,item){
                    $("#report-table").append("<tr><td>"+item.category
                    +"</td><td>"
                    +item["LR Dept"]
                    +"</td><td>"
                    +item["Bp-Dept"]
                    +"</td><td>");
                    $.each(item["records"],function(it,record){
                        $("#report-table").append("<td>Target/Demand(HC)</td>");
                    });
                    
                });

            })
            .fail(function () {
                console.log("error");
            });



    };

    var loadAccordionChart = function (accordion) {
        console.log("loadAcco is called");
        $("#" + accordion[0] + "-chart").append("<div class='chartArea'><canvas id='myChart'></canvas></div>");
        getBarChart();
    };
    var loadReportsAccordion = function (item) {
        $("#accordion").remove();
        appendAccordions(accordion, "reports-" + item);
        $("#reports-" + item).show();
        $("#accordion").accordion();
    };
    var appendAccordions = function (accordion, id) {
        $("#" + id).append($("<div ></div>").attr("id", "accordion").addClass(id + "-accordion"));
        $.each(accordion, function (index, accordionName) {
            $("." + id + "-accordion").append("<h3>" + accordionName + "</h3><div id='" + id + "-" + accordionName + "-content' class='accordion-content'><div id='" + accordionName + "-tabs' class='tabs'><ul><li><a href='#" + accordionName + "-report'>Report</a></li><li><a href='#" + accordionName + "-chart'>Charts</a></li></ul><div id='" + accordionName + "-report' class='tab-content'></div><div id='" + accordionName + "-chart' class='tab-content'></div></div></div>");
        });
    };
    var resetReportDetails = function () {
        $("#result-container").hide();
        $("#all-productLines").attr("name", "checked");
        $("#all-productLines").parent().parent().parent().find("input").prop('checked', true);
        closeDropdown("deptDropDown");
        closeDropdown("plDropDown");
        $("#deptDropDown").text("Select");
        $("#deptDropDown").css("border-color", "#ccc");
        accordion = [];
        responseData = {};

    };
    var loadSelectedData = function (accordion) {
        accordion.push($("#deptDropDown").text().trim());
        var listItems = $("#multi-dropdown-menu li");
        listItems.each(function (idx, li) {
            if ($(li).find("input").prop("checked") == true && $(li).find("div").attr("id") != "all_plOption") {
                console.log("test:" + $(li).find("label").text().trim());
                accordion.push($(li).find("label").text().trim());
            }
        });
    };
    var validateSelectedData = function () {
        if ($("#deptDropDown").text().trim() == "Select") {
            console.log("select any value");
            $("#deptDropDown").css("border-color", "red");
            $("#deptDropDown").trigger("click");
            return false;
        }
        console.log("'" + $("#deptDropDown").text() + "'");
        return true;
    };

    //table report generation
    var showProductLineItems = function () {

        //Added below data for testing purpose
        var productLineData = {
            "productLineName": "ESD_RV",
            "productLineItemList": [{
                    "Name": "Over All",
                    "productLineDataSet": {

                        "Target": [100, 200, 300, 400, 5000],
                        "Actual": [101, 202, 303, 44, 505],
                        "OpenPosition": [888, 200, 30, 400, 500],
                        "RampUp": [333, 200, 300, 400, 500]
                    }
                },
                {
                    "Name": "CC-DA/ESU Dev",
                    "productLineDataSet": {

                        "Target": [1, 20, 3, 4, 50],
                        "Actual": [11, 22, 33, 44, 55],
                        "OpenPosition": [888, 20, 30, 40, 50],
                        "RampUp": [333, 20, 30, 40, 50]
                    }
                },
                {
                    "Name": "CC-DA/ESU Test",
                    "productLineDataSet": {

                        "Target": [10, 20, 30, 40, 50],
                        "Actual": [10, 20, 30, 40, 50],
                        "OpenPosition": [10, 20, 30, 40, 50],
                        "RampUp": [10, 20, 30, 40, 50]
                    }
                },
                {
                    "Name": "RP3-A4",
                    "productLineDataSet": {

                        "Target": [1, 20, 3, 4, 50],
                        "Actual": [11, 22, 33, 44, 55],
                        "OpenPosition": [888, 20, 30, 40, 50],
                        "RampUp": [333, 20, 30, 40, 50]
                    }

                }
            ]
        };


        //Table header name as Product Line Name
        // document.getElementById("productheading").innerHTML = "Product Line Name:  " + productLineData.productLineName;
        var PLI = "";

        for (var i = 0; i < productLineData.productLineItemList.length; i++) {

            PLI += "<tr rowspan='4'>";
            PLI += "<th rowspan='4' align='center' class='coloumnHeader'><br><br>" + productLineData.productLineItemList[i].Name + "</th>";

            PLI += "<th class='secColoumnHeader'>Target Demand(HC)</th>";
            for (var j = 0; j < 12; j++) {
                if (productLineData.productLineItemList[i].productLineDataSet.Target[j] != null) {
                    PLI += "<td contenteditable>" + productLineData.productLineItemList[i].productLineDataSet.Target[j] + "</td>";
                } else {
                    PLI += "<td contenteditable></td>";

                }
            }
            PLI += "</tr>";

            PLI += "<tr>";
            PLI += "<th class='secColoumnHeader'>Actual</th>";
            for (var j = 0; j < 12; j++) {
                if (productLineData.productLineItemList[i].productLineDataSet.Actual[j] != null) {
                    PLI += "<td contenteditable>" + productLineData.productLineItemList[i].productLineDataSet.Actual[j] + "</td>";
                } else {
                    PLI += "<td contenteditable></td>";
                }
            }
            PLI += "</tr>";

            PLI += "<tr>";
            PLI += "<th class='secColoumnHeader'>Open Positions</th>";
            for (var j = 0; j < 12; j++) {
                if (productLineData.productLineItemList[i].productLineDataSet.OpenPosition[j] != null) {
                    PLI += "<td contenteditable>" + productLineData.productLineItemList[i].productLineDataSet.OpenPosition[j] + "</td>";
                } else {
                    PLI += "<td contenteditable></td>";
                }
            }

            PLI += "</tr>";

            PLI += "<tr>";
            PLI += "<th class='secColoumnHeader'>Projected Ramp Up</th>";
            for (var j = 0; j < 12; j++) {
                if (productLineData.productLineItemList[i].productLineDataSet.RampUp[j] != null) {
                    PLI += "<td contenteditable>" + productLineData.productLineItemList[i].productLineDataSet.RampUp[j] + "</td>";
                } else {
                    PLI += "<td contenteditable></td>";
                }
            }
            PLI += "</tr>";
            PLI += "<tr style='border-bottom:1px solid black; background-color: lightsteelblue;'> <td colspan='100%'></td> </tr>";

        }

        $('#productLineTab').append(PLI);

    }

    return {
        loginApp: loginApp,
        dropDownToggle: dropDownToggle,
        closeDropdown: closeDropdown,
        closeDropdownOffClick: closeDropdownOffClick,
        setValueToDropDown: setValueToDropDown,
        selectAllPlines: selectAllPlines,
        checkAllPlOption: checkAllPlOption,
        searchReportDetails: searchReportDetails,
        resetReportDetails: resetReportDetails,
        loadReportsAccordion: loadReportsAccordion
    }
}());

$(document).ready(function () {

    $("#login-container").hide();
    $("#home-container").show();
    $("#reports-chart").hide();
    $("#result-container").hide();

    //listeners
    $(document).on("click", function (event) {
        masterDataApp.closeDropdown("deptDropDown");
        masterDataApp.closeDropdown("plDropDown");
    });
    $("#login_btn").on("click", function () {
        masterDataApp.loginApp();
    });
    $("#deptDropDown").on("click", function (e) {
        masterDataApp.dropDownToggle(this.id);
        e.stopPropagation();
    });
    $("#plDropDown").on("click", function (e) {
        masterDataApp.dropDownToggle(this.id);
        e.stopPropagation();
    });

    $("#all_plOption").on("click", function (e) {
        masterDataApp.selectAllPlines();
        e.stopPropagation();
    });
    $(".plOption").on("click", function (e) {
        masterDataApp.checkAllPlOption();
        e.stopPropagation();
    });
    $("#search_btn").on("click", function () {
        masterDataApp.searchReportDetails();
    });
    $("#reset_btn").on("click", function () {
        masterDataApp.resetReportDetails();
    });

});