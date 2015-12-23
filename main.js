var mainApp = angular.module("mainApp", ['ngRoute', 'ui.bootstrap', 'door3.css', 'chart.js']);
 
mainApp.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'mainCtrl',
            css: 'styles/index.css'
        })
        .when('/ownerGetStarted', {
            templateUrl: 'ownerGetStarted.html',
            controller: 'mainCtrl',
             css: 'styles/ownerGetStarted.css'
        })
        .when('/managerGetStarted', {
            templateUrl: 'managerGetStarted.html',
            controller: 'mainCtrl',
             css: 'styles/managerGetStarted.css'
        })
        .when('/business', {
            templateUrl: 'business.html',
            controller: 'mainCtrl',
             css: 'styles/business.css'
        })
        .when('/businessManager', {
            templateUrl: 'businessManager.html',
            controller: 'mainCtrl',
             css: 'styles/businessManager.css'
        })
        .otherwise({
            redirectTo: '/home'
        });

});

mainApp.controller('mainCtrl', ['$scope', '$http', '$location', '$rootScope',
    function($scope, $http, $location, $rootScope) {

var init = function(){
$scope.newUser = {};
$scope.user = {};
};


$scope.invalidLogin = false;
$scope.showSignUp = true;
$scope.emailPattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/i;
$scope.date = new Date();

$scope.logIn = function(){
  init();
  $scope.showSignUp = false;
  
};
$scope.signUp = function(){
  init();
  $scope.showSignUp = true;
  
};

$scope.sortType = 'Sales'; //default
$scope.sortReverse  = false;

var newSignUpOwnerPath = "/ownerGetStarted";
var newSignUpManagerPath = "/managerGetStarted";
var ManagerBusinessPath = "/businessManager";
var OwnerBusinessPath = "/business";
var homePath = "/home";

$scope.goToHome = function(){

    $('#businessSelectModal').modal('hide');

    $location.path(homePath);  
    
}

$scope.logout = function(){
  $rootScope.loggedInUser = {};
  $location.path(homePath);  

}


function toTitleCase(str){
    
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$scope.newSignUpSubmit = function(newUser){

    console.log(newUser.fullName);
    console.log(newUser.email);
    console.log(newUser.password);
    console.log(newUser.role);

        var User = {
            fullName: newUser.fullName,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role
          };



          $http.post('api/server.php/business/signup', User)
            .then(function(response) {

              //console.log(response);
              $rootScope.User = {
            fullName: response.data.fullName,
            email: response.data.email,
            password: response.data.password,
            role: response.data.role
        };

        console.log($rootScope.User);

              if(newUser.role === 'owner'){
                $scope.Auth(
                    {
                        email: $rootScope.User.email,
                        password: $rootScope.User.password,
                        role: $rootScope.User.role
                    }
                        );
                  $location.path(newSignUpOwnerPath);  
              }
              else if(newUser.role === 'manager'){

                $scope.Auth(
                    {
                        email: $rootScope.User.email,
                        password: $rootScope.User.password,
                        role: $rootScope.User.role
                    }
                        );

                 $location.path(newSignUpManagerPath); 
              }

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);
            });

}

$scope.Auth = function(user){

 $http.post('api/server.php/business/login', user)
            .then(function(response) {

              //console.log(response);
              console.log("Logged In");

              $rootScope.loggedInUser = response.data;    

              console.log($rootScope.loggedInUser);        
              

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });

}
$scope.newLogIn = function(user){

  $scope.loginSuccess = false;

  var User = {
            email: user.logInEmail,
            password: user.logInPassword,
            role: user.logInRole
          };

          $http.post('api/server.php/business/login', User)
            .then(function(response) {

              if(typeof(response.data) === 'string'){
              $scope.invalidLogin = true;
              $scope.loginSuccess = false;
              }
              else{
              console.log("Successfully Logged In");
              $rootScope.loggedInUser = response.data;
              //console.log($rootScope.loggedInUser);

              $scope.loginSuccess = true;

              if(user.logInRole === 'owner'){
                 $location.path(OwnerBusinessPath);
              }
              else if(user.logInRole === 'manager'){
                 $location.path(ManagerBusinessPath);
              }

              }
              
              

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);
              $scope.invalidLogin = true;
              $scope.loginSuccess = false;
            });


}
$scope.getBusiness = function(ownerID){

    $http.get('api/server.php/business/' + ownerID)
            .then(function(response) {

              console.log(response);
               if(typeof(response.data) === 'string'){

                $scope.noBusiness = true;


              }
              else{
             $rootScope.Business = response.data;
             $scope.noBusiness = false;
              console.log($rootScope.Business);

              $scope.getBusinessManagers($rootScope.Business.BusinessID);
              $scope.getBusinessPendingManagers($rootScope.Business.BusinessID);

              $scope.getLogs($rootScope.Business.BusinessID);
              }
             

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });
}
$scope.goToOwnerGetStarted = function(){
  $location.path(newSignUpOwnerPath);
}

$scope.getBusinessManager = function(businessID){

    $http.get('api/server.php/business/manager/' + businessID)
            .then(function(response) {

              console.log(response);
              if(typeof(response.data) === 'string'){

                $scope.noBusiness = true;

              }
              else{
              $rootScope.Business = response.data;
              console.log($rootScope.Business);

              $scope.getLogs($rootScope.Business.BusinessID);

              $scope.noBusiness = false;
              }


            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });
}

$scope.getAllBusinesses = function(){

    $http.get('api/server.php/allBusiness')
            .then(function(response) {

              //console.log(response);
              $scope.AllBusinessArr = response.data;
              console.log($scope.AllBusinessArr);

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });

}
$scope.getBusinessManagers = function(businessID){
    $http.get('api/server.php/business/managers/' + businessID)
            .then(function(response) {

              $rootScope.Managers = response.data;
              console.log($rootScope.Managers);

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });
}

$scope.getBusinessPendingManagers = function(businessID){
    $http.get('api/server.php/business/managers/requests/' + businessID)
            .then(function(response) {

              $rootScope.PendingManagers = response.data;
              $scope.managerNotification = $rootScope.PendingManagers.length;
              console.log($rootScope.PendingManagers);

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });
}

$scope.acceptManagerRequest = function(pendingManager){

    var acceptRequest = {

        BusinessID: $rootScope.Business.BusinessID,
        ManagerID: pendingManager.ManagerID

    };

    $http.post('api/server.php/business/managers/accept', acceptRequest)
            .then(function(response) {

              //console.log(response);
              $scope.getBusinessManagers($rootScope.Business.BusinessID);
              $scope.getBusinessPendingManagers($rootScope.Business.BusinessID);
              console.log("Successfully Added Manager"); 


            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error.status);
            });

}

$scope.removeManagerRequest = function(pendingManager){


    $http.delete('api/server.php/business/managers/request/' + pendingManager.ManagerID)
            .then(function(response) {

              //console.log(response);
              $scope.getBusinessPendingManagers($rootScope.Business.BusinessID);
              console.log("Successfully Removed Manager Request"); 


            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error.status);
            });

}

$scope.newBusinessInfo = function(business){

    console.log(business.businessName);
    console.log(business.businessAddress);

  var Business = {
    BusinessName: business.businessName,
    BusinessAddress: business.businessAddress,
    OwnerID: $rootScope.loggedInUser.OwnerID
          };

          $http.post('api/server.php/business', Business)
            .then(function(response) {

              //console.log(response);
              console.log("Successfully Created Business"); 
              $scope.getBusiness($rootScope.loggedInUser.OwnerID);


              
              $location.path(OwnerBusinessPath); //goes to owner business page


            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error.status);
            });


}
$scope.getLogs = function(businessID){

    $http.get('api/server.php/business/logs/' + businessID)
            .then(function(response) {

              console.log(response);
              $rootScope.Logs = response.data;
              $scope.logs = $rootScope.Logs;
              $scope.totaltems = $scope.logs.length;
              console.log($rootScope.Logs);

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });

}

$scope.getCurrentManager = function(manager){

    $scope.currentManager = manager;

}

$scope.managerSelectBusiness = function(business){

    //var businessID = business.BusinessID;
    $scope.selectedBusinessName = business.BusinessName;

    var request = {

    BusinessID: business.BusinessID,
    ManagerID: $rootScope.loggedInUser.ManagerID,
    ManagerFullName: $rootScope.loggedInUser.ManagerFullName
    
  };

 $http.post('api/server.php/business/managers', request)
            .then(function(response) {

              //console.log(response);
              console.log("Request Made to:  " + business.BusinessName);

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);

            });

}

$scope.deleteManager = function(){

    $http.delete('api/server.php/business/manager/' + $scope.currentManager.ManagerID)
            .then(function(response) {

              console.log(response);
              $scope.getBusinessManagers($rootScope.Business.BusinessID);

            }, function(error) { 
              console.log('Error: ' + error);

            });

}

$scope.viewLog = function(log){

    console.log(log);
    $scope.currentLog = log;

}

$scope.deleteLog = function(log){

  
  if(confirm('Are you sure you want to delete this log?')){

    $http.delete('api/server.php/business/logs/' + log.LogsID)
            .then(function(response) {

              console.log(response);
              $scope.getLogs($rootScope.Business.BusinessID);

            }, function(error) { 
              console.log('Error: ' + error);

            });
  }

}



$scope.addNewLog = function(){

//businessID going to be a scope variable (businessID), from a get Business Info request
//LogsAuthorID giong to be a scope variable(ownerID/managerID) from a get Current User Info request
$scope.date = new Date();
  var Log = {
            businessID: $rootScope.Business.BusinessID,
            logsAuthorName: $rootScope.loggedInUser.OwnerFullName, 
            date: $scope.date,
            sales: $scope.newLog.sales,
            weather: $scope.newLog.weather,
            message: $scope.newLog.message, 
            DineInNo: $scope.newLog.DineInNo,
            TakeOutNo: $scope.newLog.TakeOutNo,
            DeliveryNo: $scope.newLog.DeliveryNo
          };

          $http.post('api/server.php/business/logs', Log)
            .then(function(response) {

              console.log(response);
              console.log("Successfully Added Log"); //works

              $scope.getLogs($rootScope.Business.BusinessID);
              //on success, get all logs from this business to refresh list with new log.

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);
            });

            $scope.resetModal();

}

$scope.newLog = {

            sales: "",
            weather: "",
            message: "",
            DineInNo: "",
            TakeOutNo: "",
            DeliveryNo: ""

};

$scope.addNewLogManager = function(){

//businessID going to be a scope variable (businessID), from a get Business Info request
//LogsAuthorID giong to be a scope variable(ownerID/managerID) from a get Current User Info request
  var Log = {
            businessID: $rootScope.Business.BusinessID,
            logsAuthorName: $rootScope.loggedInUser.ManagerFullName, 
            date: $scope.date,
            sales: $scope.newLog.sales,
            weather: $scope.newLog.weather,
            message: $scope.newLog.message,
            DineInNo: $scope.newLog.DineInNo,
            TakeOutNo: $scope.newLog.TakeOutNo,
            DeliveryNo: $scope.newLog.DeliveryNo
          };

          $http.post('api/server.php/business/logs', Log)
            .then(function(response) {

              console.log(response);
              $scope.getLogs($rootScope.Business.BusinessID);
              console.log("Successfully Added Log"); //works

              //on success, get all logs from this business to refresh list with new log.

            }, function(error) { //Error occured on http.post
              console.log('Error: ' + error);
            });

            $scope.resetModal();

}

//chart stuff added here 
$scope.optionChosen = "";
$scope.options = [{
    value: 'Last Week',
        label: 'Last Week'
  }, {
        value: 'Last Month',
        label: 'Last Month'
}];

$scope.openReport = function(salesReportsOption){
    //console.log(salesReportsOption.value);

    $scope.getLogs($rootScope.Business.BusinessID);

    $scope.showSpecialReports = false;

          $scope.notEnoughData = false;
        

    $scope.optionChosen = salesReportsOption.value;

var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";

$scope.data = [ [] ];
$scope.saleDates = [ [] ];

for(var i =0; i<$rootScope.Logs.length; i++){

      $scope.data[0].push(parseInt($rootScope.Logs[i].Sales));
      $scope.saleDates[0].push($rootScope.Logs[i].Date);
      console.log($rootScope.Logs[i].Sales);

    }

    console.log($scope.data);
    console.log($scope.saleDates);
    //var x = new Date($scope.saleDates[0][$scope.saleDates[0].length-1]); //last day of logs

    $scope.dateArr = [[]];

    for (var i = 0; i < $scope.saleDates[0].length; i++) {

      var day = new Date($scope.saleDates[0][i]);
       $scope.dateArr[0].push(day);
    };

   

    var weekArr = $scope.dateArr[0].slice($scope.dateArr[0].length-7)
    
 console.log(weekArr);

    // var oneWeekAgo = x;
    // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    // console.log(x);
    // console.log(weekday[x.getDay()]);
    // console.log(weekday[oneWeekAgo.getDay()]);


    if($scope.optionChosen == 'Last Week'){   //Run get for weekly sales 

       

       if($scope.data[0].length <7 || $scope.data[0].length == undefined){
          $scope.notEnoughData = true;
        }
        else{
                  $scope.series = ['Last Week'];
        $scope.labels = [weekday[weekArr[0].getDay()], weekday[weekArr[1].getDay()] ,weekday[weekArr[2].getDay()] ,weekday[weekArr[3].getDay()]
         ,weekday[weekArr[4].getDay()] ,weekday[weekArr[5].getDay()] ,weekday[weekArr[6].getDay()] ];

        $scope.data[0] = $scope.data[0].slice(Math.max($scope.data[0].length-7));
        }

 
    }
    else{

    // var oneMonthAgo = x;
    // oneMonthAgo.setDate(oneMonthAgo.getDate() - 28);
    // console.log(x);
    // console.log(weekday[x.getDay()]);
    // console.log(weekday[oneMonthAgo.getDay()]);

    var weekArr = $scope.dateArr[0].slice($scope.dateArr[0].length-28, $scope.dateArr[0].length-21);

     if($scope.data[0].length < 28  || $scope.data[0].length == undefined){
          $scope.notEnoughData = true;
        }
        else{
          $scope.series = ['Week 1', 'Week 2', 'Week 3', 'Week 4']; // run get for monthly sales
        $scope.labels = [weekday[weekArr[0].getDay()], weekday[weekArr[1].getDay()] ,weekday[weekArr[2].getDay()] ,weekday[weekArr[3].getDay()]
         ,weekday[weekArr[4].getDay()] ,weekday[weekArr[5].getDay()] ,weekday[weekArr[6].getDay()] ];

        $scope.data[0] = $scope.data[0].slice(Math.max($scope.data[0].length-28));

        $scope.dataMonthly = [[],[],[],[]];
        $scope.dataMonthly[3].push($scope.data[0].slice($scope.data[0].length-7));
        $scope.dataMonthly[2].push($scope.data[0].slice($scope.data[0].length-14, $scope.data[0].length-7));
        $scope.dataMonthly[1].push($scope.data[0].slice($scope.data[0].length-21, $scope.data[0].length-14));
        $scope.dataMonthly[0].push($scope.data[0].slice($scope.data[0].length-28, $scope.data[0].length-21));

        $scope.data = [$scope.dataMonthly[0][0],$scope.dataMonthly[1][0],$scope.dataMonthly[2][0],$scope.dataMonthly[3][0]];
        }

        
    }

        }


  $scope.getAverage = function(data){
    $scope.total = 0;
    $scope.average = 0;
    var days = 0;

    for (var i = 0; i < data.length; i++) {
        var week = data[i];
        for (var j = 0; j < week.length; j++) {
            //console.log(data[i][j]);
            days += 1;
            $scope.total += data[i][j];
        };
        
    };
    //console.log("total: " + $scope.total);
    $scope.average = $scope.total / days;
    $scope.average = Math.round($scope.average * 100) / 100;
    //console.log('average:' + Math.round($scope.average * 100) / 100);
    $scope.showSpecialReports = true;
    return $scope.average;


  }

  $scope.resetModal = function() {
      $scope.newLog = {

            sales: "",
            weather: "",
            message: ""
          };
}


$scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

  $scope.currentPage = 1;
  $scope.viewby = 7;
  $scope.itemsPerPage = $scope.viewby;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };


}]); //end MainController