var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/onlineVoting";
function checkIsNull(value) {
    return value === "" || value === undefined || value === null ? true : false;
}
let adminUser = "admin@gmail.com";
let adminPassword = "Admin@1234";
var electionNameMap = {};
getElectionName();
function loginUser() {
    let requestBody = {
        "emailId": $("#emailId").val(),
        "password": $("#pwdId").val()
    }
    if (checkIsNull($("#emailId").val()) || checkIsNull($("#pwdId").val())) {
        alert("Mandatory Field Must Be Filled");
    } else if (requestBody.emailId.trim() === adminUser && requestBody.password === adminPassword) {
        localStorage.setItem("userName", "ADMIN");
        window.location.href = "vote.html";
    } else {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/voteRegister.json",
            data: JSON.stringify(requestBody),
            success: function (lresponse) {
                let loginUserList = [];
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValid = false;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].emailId == $("#emailId").val() && loginUserList[i].password == $("#pwdId").val()) {
                        isValid = true;
                        localStorage.setItem("userId", loginUserList[i].userId);
                        window.location.href = "vote.html";

                    }
                }
                if (!isValid) {
                    alert("User Does Not Exist");
                }
            }, error: function (error) {
                alert("Error !!");
            }
        });
    }
}
function registerUser() {
    if ($('#selfNomine').is(":checked") && checkIsNull($("#electionNameId").val())) {
        alert("Mandatory Field Must Be Filled");

    } else if (checkIsNull($("#userNameId").val()) || checkIsNull($("#dobId").val()) || checkIsNull($("#userEmailId").val())
        || checkIsNull($("#passwordId").val()) || checkIsNull($("#contactId").val())
        || checkIsNull($("input[name='genderRadio']:checked").val())) {
        alert("Mandatory Field Must Be Filled");
    } else {
        let requestBody = {
            "userName": $("#userNameId").val(),
            "dob": $("#dobId").val(),
            "emailId": $("#userEmailId").val(),
            "password": $("#passwordId").val(),
            "contactNum": $("#contactId").val(),
            "gender": $("input[name='genderRadio']:checked").val(),
            "selfNomine": $('#selfNomine').is(":checked"),
            "voterCount": 0
        }
        if (requestBody.selfNomine) {
            requestBody['elNameId'] = $("#electionNameId").val();
            requestBody['elName'] = electionNameMap[$("#electionNameId").val()];
        }
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            cache: false,
            url: URL + "/voteRegister.json",
            data: JSON.stringify(requestBody),
            success: function (lresponse) {
                $('#regModelId').modal('hide');
                alert("Registered Successfully!!!");
            }, error: function (error) {
                alert("Error !!");
            }
        });
    }
}
function getElectionName() {
    $("#electionNameMainDivID").hide();
    $.ajax({
        type: 'get',
        contentType: "application/json",
        dataType: 'json',
        cache: false,
        url: URL + "/electionName.json",
        success: function (lresponse) {
            let electionNameList = [];
            for (let i in lresponse) {
                let data = lresponse[i];
                data["elNameId"] = i;
                electionNameList.push(data);
                electionNameMap[i] = data.elName
            }
            $("#electionNameId").empty();
            $("#electionNameId").append('<option value="">Select Name</option>');
            for (let i = 0; i < electionNameList.length; i++) {
                $("#electionNameId").append('<option value="' + electionNameList[i].elNameId + '">' + electionNameList[i].elName + '</option>');
            }
        }, error: function (error) {
            alert("Error !!");
        }
    });
}
function resetData() {
    $("#userNameId").val("");
    $("#dobId").val("");
    $("#userEmailId").val("");
    $("#passwordId").val("");
    $("#contactId").val("");
    $("input[type=radio][name=genderRadio]").prop("checked", false);
    $('#selfNomine').prop('checked', false);
    $("#electionNameId").val('');

}
$(document).ready(function () {
    $('#regModelId').on('hidden.bs.modal', function (e) {
        resetData();
    })
    $('#selfNomine').change(function () {
        if (this.checked) {
            $("#electionNameMainDivID").show();
        } else {
            $("#electionNameMainDivID").hide();
            $("#electionNameId").val('');
        }
    });
});
