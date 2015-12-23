<?php

require 'vendor/autoload.php'; 

$app = new \Slim\Slim();

$app->post('/business/signup', 'signup'); //Sign up
$app->post('/business/login', 'login'); //Login
$app->post('/business', 'createBusiness'); //Owner creates business
$app->post('/business/managers', 'managerSelectBusiness'); //Manager selects business, makes request to join business
$app->post('/business/managers/accept', 'acceptRequest');
$app->post('/business/logs', 'newLog'); //owner/manager create new log

$app->get('/business/:OwnerID', 'getBusiness'); //get all business info
$app->get('/business/manager/:BusinessID', 'getBusinessManager'); //get all business info
$app->get('/allBusiness', 'getAllBusiness'); //get All business in db
$app->get('/business/logs/:BusinessID', 'getBusinessLogs'); //get this business 's logs
$app->get('/business/managers/:BusinessID', 'getBusinessManagers'); //get this business's managers
$app->get('/business/managers/requests/:BusinessID', 'getRequest'); //get this business's managers requests

$app->delete('/business/manager/:ManagerID', 'deleteManager'); //owner delete manager from business
$app->delete('/business/managers/request/:ManagerID', 'removeRequest'); //owner delete manager request from business
$app->delete('/business/logs/:LogsID', 'deleteLog'); //owner delete manager request from business

$app->get('/hello/:name', function ($name) {
    echo "Hello, " . $name;
});

function signup(){

$app = new \Slim\Slim();


	$body = $app->request->getBody();
	$newUser = json_decode($body);

	$role = $newUser->role;
	if($role == 'owner'){
		$sql = "INSERT INTO owner (OwnerFullName, OwnerEmail, OwnerPass) VALUES (:OwnerFullName, :OwnerEmail, :OwnerPass)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("OwnerFullName", $newUser->fullName);
		$stmt->bindParam("OwnerEmail", $newUser->email);
		$stmt->bindParam("OwnerPass", $newUser->password);
		$stmt->execute();
		$db = null;
		echo json_encode($newUser); 
	
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	}
	elseif ($role == 'manager'){

	$sql = "INSERT INTO manager (ManagerFullName, ManagerEmail, ManagerPass) VALUES (:managerFullName, :managerEmail, :managerPass)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("managerFullName", $newUser->fullName);
		$stmt->bindParam("managerEmail", $newUser->email);
		$stmt->bindParam("managerPass", $newUser->password);
		$stmt->execute();
		$db = null;
		echo json_encode($newUser); 
	
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}

	}

}

function login(){

$app = new \Slim\Slim();

	$body = $app->request->getBody();
	$User = json_decode($body);
	$role = $User->role;
	if($role == 'owner'){
		$sql = "SELECT * FROM owner WHERE OwnerEmail = :OwnerEmail AND OwnerPass = :OwnerPass";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("OwnerEmail", $User->email);
		$stmt->bindParam("OwnerPass", $User->password);
		$stmt->execute();
		$Owner = $stmt->fetchObject();
		$db = null;
		echo json_encode($Owner); 
	
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	}
	elseif ($role == 'manager'){

$sql = "SELECT * FROM manager  WHERE ManagerEmail = :ManagerEmail AND ManagerPass = :ManagerPass";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("ManagerEmail", $User->email);
		$stmt->bindParam("ManagerPass", $User->password);
		$stmt->execute();
		$Manager = $stmt->fetchObject();
		$db = null;
		echo json_encode($Manager); 
	
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	}

}

function createBusiness(){

$app = new \Slim\Slim();

	$body = $app->request->getBody();
	$newBusiness = json_decode($body);
	$sql = "INSERT INTO business (BusinessName, BusinessAddress, OwnerID) VALUES (:BusinessName, :BusinessAddress, :OwnerID)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("BusinessName", $newBusiness->BusinessName);
		$stmt->bindParam("BusinessAddress", $newBusiness->BusinessAddress);
		$stmt->bindParam("OwnerID", $newBusiness->OwnerID);
		$stmt->execute();
		$db = null;
		echo json_encode($newBusiness);
	
	} catch(PDOException $e) {
		
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function managerSelectBusiness(){

$app = new \Slim\Slim();

	$body = $app->request->getBody();
      	$newRQ = json_decode($body);
	$sql = "INSERT INTO request (BusinessID, ManagerID, ManagerFullName) VALUES (:BusinessID, :ManagerID, :ManagerFullName)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("BusinessID", $newRQ->BusinessID);
		$stmt->bindParam("ManagerID", $newRQ->ManagerID);
		$stmt->bindParam("ManagerFullName", $newRQ->ManagerFullName);
		$stmt->execute();
		$db = null;
		echo json_encode($newRQ); 
	} catch(PDOException $e) {
		
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function newLog(){

$app = new \Slim\Slim();

	$body = $app->request->getBody();
	$Log = json_decode($body);
	$sql = "INSERT INTO logs (BusinessID, LogsAuthorName, Date, Sales, Weather, 
		Message, DineInNo, TakeOutNo, DeliveryNo) VALUES (:BusinessID, :LogsAuthorName, :Date, :Sales, :Weather, :Message, :DineInNo, :TakeOutNo, :DeliveryNo)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("BusinessID", $Log->businessID);
		$stmt->bindParam("LogsAuthorName", $Log->logsAuthorName);
		$stmt->bindParam("Date", $Log->date);
		$stmt->bindParam("Sales", $Log->sales);
		$stmt->bindParam("Weather", $Log->weather);
		$stmt->bindParam("Message", $Log->message);
		$stmt->bindParam("DineInNo", $Log->DineInNo);
		$stmt->bindParam("TakeOutNo", $Log->TakeOutNo);
		$stmt->bindParam("DeliveryNo", $Log->DeliveryNo);
		$stmt->execute();
		$db = null;
		echo json_encode($Log); 

	
	} catch(PDOException $e) {

		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteLog($LogsID){

$app = new \Slim\Slim();

$sql = "DELETE FROM logs WHERE LogsID = :LogsID";
	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->bindParam("LogsID", $LogsID);
 		$stmt->execute();
 		$db = null;
		echo "Delete succesful";
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function getBusiness($OwnerID){

$app = new \Slim\Slim();

$sql = "SELECT * FROM business WHERE OwnerID = :OwnerID";
	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->bindParam("OwnerID", $OwnerID);
 		$stmt->execute();
 		$Business = $stmt->fetchObject();
 		$db = null;

 		echo json_encode($Business); 
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
 	}
 }

 function getBusinessManager($BusinessID){

$app = new \Slim\Slim();

$sql = "SELECT * FROM business WHERE BusinessID = :BusinessID";
	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->bindParam("BusinessID", $BusinessID);
 		$stmt->execute();
 		$Business = $stmt->fetchObject();
 		$db = null;

 		echo json_encode($Business); 
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
 	}
 }

function getRequest($BusinessID){


$app = new \Slim\Slim();

 	$sql = "SELECT * FROM request WHERE BusinessID = :BusinessID";
 	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->bindParam("BusinessID", $BusinessID);
 		$stmt->execute();
 		$Requests = $stmt->fetchAll();  
 		$db = null;
 		echo json_encode($Requests); 
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}';    
 	}
 }

 function acceptRequest(){


$app = new \Slim\Slim();

	$body = $app->request->getBody();
	$Request = json_decode($body);
	$ManagerID = $Request->ManagerID;

 	$sql = "UPDATE manager SET BusinessID= :BusinessID WHERE ManagerID = :ManagerID";
 	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->bindParam("BusinessID", $Request->BusinessID);
 		$stmt->bindParam("ManagerID", $Request->ManagerID);
 		$stmt->execute();
 		$db = null;
 		echo json_encode($Request); 

 		removeRequest($ManagerID); // After successful added, no needed for manager in request table. delete manager here.
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}';    
 	}
 }
 function removeRequest($ManagerID){


$app = new \Slim\Slim();

 	$sql = "Delete FROM request WHERE ManagerID = :ManagerID";
 	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->bindParam("ManagerID", $ManagerID);
 		$stmt->execute();
 		$db = null;
 		echo " Deleted Manager Successful"; 
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}';    
 	}
 }
 
function getAllBusiness(){

$app = new \Slim\Slim();

 	$sql = "SELECT BusinessName, BusinessAddress, BusinessID FROM business";
 	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->execute();
 		$Business = $stmt->fetchAll();  
 		$db = null;
 		echo json_encode($Business); 
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}';    
 	}
 }

function getBusinessLogs($BusinessID){

$sql = "SELECT * FROM logs WHERE BusinessID=:BusinessID";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("BusinessID", $BusinessID);
		$stmt->execute();
		$Logs = $stmt->fetchAll();  
		$db = null;
		echo json_encode($Logs); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}

}

function getBusinessManagers($BusinessID){

$app = new \Slim\Slim();
$sql = "SELECT * FROM manager WHERE BusinessID = :BusinessID";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("BusinessID", $BusinessID);
		$stmt->execute();
		$Manager = $stmt->fetchAll();

		$db = null;
		echo json_encode($Manager); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	}

function deleteManager($ManagerID){ 

$app = new \Slim\Slim();

$sql = "UPDATE manager SET BusinessID = null WHERE ManagerID = :ManagerID";
	try {
 		$db = getConnection();
 		$stmt = $db->prepare($sql);  
 		$stmt->bindParam("ManagerID", $ManagerID);
 		$stmt->execute();
 		$db = null;
		echo "Delete Manager Successful";
 	} catch(PDOException $e) {
 		echo '{"error":{"text":'. $e->getMessage() .'}}';
}
}

function getConnection() {

// Get DB connection. May be useful help for our DB


// ubuntu connection
	
	$port=3306;
	$dbhost="localhost";
	$dbuser="root"; //wamp connection
	$dbpass="user";
	$dbname="restaurantlogs";
	$dbh = new PDO("mysql:host=$dbhost;port=$port;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

$app->run();

?>


