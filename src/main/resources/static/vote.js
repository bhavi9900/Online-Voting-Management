var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/onlineVoting";
    $scope.userName = localStorage.getItem("userName");
    $scope.onload = function () {
        $scope.candidateList = [];
        $scope.viewUserData = [];
        $scope.candidateDetails = "";
        $scope.getUserTableData();
        $("#viewCandidateDivId").show();
        $("#castVoteDivId").hide();
        $("#viewResultDivId").hide();
        $("#electionAddDivId").hide();
        $scope.electionNameList = [];
        getElectionName();
    }

    $scope.getUserTableData = function () {

        $scope.viewUserData = [];
        let userData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/voteRegister.json",
            success: function (response) {
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    userData.unshift(data);
                }
                $scope.viewUserData = userData.filter(function (obj) {
                    return obj.selfNomine;
                })
                $scope.$apply();
            }, error: function (error) {
                alert("Error !!");
            }
        });
    }
    $scope.voteCandidate = function (isAdmin) {
        if (isAdmin) {
            cancelElection();
        } else {
            if ($scope.candidateDetails === "" || $scope.candidateDetails === undefined || $scope.candidateDetails === null) {
                alert("Please candidate name");
            } else {
                let count = $scope.candidateDetails.voterCount + 1;
                let requestBody = {
                    "voterCount": count
                }
                $.ajax({
                    type: 'patch',
                    contentType: "application/json",
                    dataType: 'json',
                    cache: false,
                    url: URL + "/voteRegister/" + $scope.candidateDetails.userId + ".json",
                    data: JSON.stringify(requestBody),
                    success: function (response) {
                        $scope.switchMenu("VIEW_RESULT", "viewResultDivId");
                        alert("Voted Successfully!!!");
                    }, error: function (error) {
                        alert("Error !!");
                    }
                });
            }
        }

    }
    function cancelElection() {
        if ($scope.electionNameModel === "") {
            alert("Please candidate name");
        } else {
            $.ajax({
                type: 'delete',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/electionName/" + $scope.electionNameModel + ".json",
                success: function (response) {
                    alert("Election Cancelled !!!");
                    getElectionName();
                }, error: function (error) {
                    alert("Error !!");
                }
            });
        }

    }

    $scope.logout = function () {
        localStorage.clear();
        window.location.href = "index.html";
    }
    $scope.addElection = function () {
        let method_type = 'post';
        let http_url = '/electionName.json';
        let msg = "Data added Successfully!!!";
        if ($scope.isEdit) {
            method_type = 'patch';
            http_url = '/electionName/' + $scope.electionData.elNameId + '.json';
            msg = "Updated Successfully!!!"
        }
        let requestBody = {
            "elName": $("#elNameId").val(),
            "startDate": $("#startDateId").val(),
            "endDate": $("#endDateId").val(),
            "location": $("#locationId").val(),
        };
        $.ajax({
            type: method_type,
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + http_url,
            data: JSON.stringify(requestBody),
            success: function (response) {
                alert(msg);
                getElectionName();
                resetData();
            }, error: function (error) {
                alert("Error !!");
            }
        });
    }
    $scope.editElectionDetails = function (event, details) {
        const isChecked = event.target.checked;
        $(".edit-cls").prop("checked", false);
        $(event.target).prop("checked", isChecked);
        $scope.electionData = details;
        if (!isChecked) {
            resetData();
        } else {
            $scope.isEdit = true;
            $("#elNameId").val(details.elName);
            $("#startDateId").val(details.startDate);
            $("#endDateId").val(details.endDate);
            $("#locationId").val(details.location);
        }
    }
    function getElectionName() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/electionName.json",
            success: function (lresponse) {
                $scope.electionNameList = [];
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["elNameId"] = i;
                    $scope.electionNameList.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Error !!");
            }
        });
    }
    $scope.getCandidateList = function (elId) {
        $scope.candidateList = $scope.viewUserData.filter(function (obj) { return obj.elNameId == elId });
        //$scope.$apply();
    }
    function resetData() {
        $scope.isEdit = false;
        $("#elNameId").val('');
        $("#startDateId").val('');
        $("#endDateId").val('');
        $("#locationId").val('');
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#viewCandidateDivId").hide();
        $("#castVoteDivId").hide();
        $("#viewResultDivId").hide();
        $("#electionAddDivId").hide();
        if (type == "VIEW-CANDIDATE") {
            $scope.getUserTableData();
            $("#viewCandidateDivId").show();
        } else if (type == "CAST_VOTE") {
            $scope.candidateDetails = "";
            $scope.getUserTableData();
            getElectionName();
            $("#castVoteDivId").show();
        } else if (type == "VIEW_RESULT") {
            $scope.getUserTableData();
            $("#viewResultDivId").show();
        } else if (type == "ELECTION_NAME") {
            getElectionName();
            $("#electionAddDivId").show();
            resetData();
        }

    }
});
