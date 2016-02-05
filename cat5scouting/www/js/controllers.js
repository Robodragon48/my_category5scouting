/*
  Much of the code in this file and services.js that has to do with SQLite is
  derived from the gist created by Borris Sondagh, here: 
  https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
*/
angular.module('cat5scouting.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('HomeCtrl', function($scope, $stateParams) {
  
})

.controller('MatchCtrl', function($scope, Team) {
  $scope.teams = [];
  $scope.teams = null;
  
  $scope.updateTeam = function() {
    Team.all().then(function(teams) {
      $scope.teams = teams;
    })
  }
  
  $scope.updateTeam();
})


//TODO: Disable all fields except Team until team is selected
//TODO: Disable all fields except Team and Robot until Robot is selected
.controller('PitCtrl', function($scope, Team) {
  $scope.teams = [];
  $scope.teams = null;
  
  $scope.updateTeam = function() {
    Team.all().then(function(teams) {
      $scope.teams = teams;
    })
  }
  
  $scope.updateTeam();
})



.controller('SyncCtrl', function($scope, $cordovaFile) {
  
  document.addEventListener('deviceready', function() {

    $scope.exportData = function() {
    
      console.log("exportData called");
      
      //Create header for the file to make it easier to keep track of where data 
      //came from
      var d = new Date();
      var exportData = "Data exported from tablet " + "[tabletname]" + " at " + d.toUTCString();

      //Create the exported Robot data to write to a file
      /*
      Robot.all().then(function(robots) {
        for (var i=0; i<robots.length; i++) {
          exportData += robots[i].name;
          exportData += ", ";
        }
      })
      */
      
      $cordovaFile.writeFile("file:///storage/emulated/0/", "Cat5Scouting.Pit.txt", exportData, true)
        .then(function (success) {
          console.log("Data exported to Cat5Scouting.Pit.txt");
        }, function (error) {
          console.log("Problem writing text to Pit file");
        });

      //Create the exported Robot Match data to write to a file
      /*
      var exportData = "Data exported from tablet " + "[tabletname]" + " at " + d.toUTCString();
      RobotMatch.all().then(function(robotMatches) {
        for (var i=0; i<robotMatches.length; i++) {
          exportData += robotMatches[i].robotId;
          exportData += ", ";
        }
      })
      
      $cordovaFile.writeFile("file:///storage/emulated/0/", "Cat5Scouting.Match.txt", exportData, true)
        .then(function (success) {
          console.log("Data exported to Cat5Scouting.Match.txt");
        }, function (error) {
          console.log("Problem writing text to Match file");
        });
      */
    }
  })

})



.controller('SettingsCtrl', function($scope, $stateParams, $cordovaSQLite) {
  $scope.generateSampleData = function() {
    console.log("generateSampleData called");

    var teams = [
                  1225, 1226, 1293, 1398, 1553, 1598, 1758, 2059, 281, 2815, 
                  283, 342, 343, 3489, 3490, 3976, 4083, 4451, 4533, 4534, 
                  4901, 4935, 4955, 4965, 8101
                ];
                
    var query = "INSERT INTO team (name, number) VALUES (?,?)";
    for (var i=0; i<teams.length; i++) {
      $cordovaSQLite.execute(db, query, ["Team "+ teams[i], i]).then(function(res) {
        console.log("team insertId: " + res.insertId);
      }, function (err) {
        console.error(err);
      });
    }
    
    var query = "INSERT INTO robot (name, teamId) VALUES (?,?)";
    for (var i=1; i<=teams.length; i++) {
      console.log("i = " + i);
      $cordovaSQLite.execute(db, query, ["Robot", i]).then(function(res) {
        console.log("robot insertId: " + res.insertId + " with teamId: " + i);
      }, function (err) {
        console.error(err);
      });
    }


    for (var i=1; i<32; i++) {
      var query = "INSERT INTO match (number) VALUES (?)";
      $cordovaSQLite.execute(db, query, [i]).then(function(res) {
        console.log("match insertId: " + res.insertId);
      }, function (err) {
        console.error(err);
      });
    }
  }  
})




.controller('PitScoutingController', function($scope, $stateParams, Robot) {
  ///TODO Convert these to SQLite database calls
  /*
    teamName: the name of the team; values provided via PitCtrl controller
    robotName: the name of the robot that a team has
    
  */
  
  $scope.robot = [];
  $scope.robot = null;
  
  //TODO: Add a field for "is the robot still fully functional?"
  //TODO: Investigate if iPhones and iPads can export to thumb drives
  //TODO: Capture images on the Pit Scouting page
  //TODO: Picklist for quickly choosing the best matches

  $scope.data = {
    yesNo: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ]
  }

  /*
    This function is called to determine if non-team and non-robot fields should
    be anbled. If and only if both a team and a robot have been selected, it 
    returns false (meaning don't disable the fields)
  */
  $scope.disableFields = function() {
    return $scope.selectedRobot == null;
  }
  
  /*
    This function is called when the user changes the team. It loads values for
    the Robots fields from the SQLite database. 
  */
  $scope.selectTeam = function() {
    //retrieve the robot(s) for the selected team
    Robot.getByTeam($scope.team.id).then(function(robots) {
      $scope.robots = robots;
    })
    //reset the selected robot
    $scope.selectedRobot = null;
    //reset all the subsequent fields
    $scope.runAuto = $scope.data.yesNo[0];
    $scope.driveType = ""
    $scope.height = 0
    $scope.notes = ""
    $scope.spyReq = 0
    $scope.spyDoc = 0
    $scope.OWA1 = false
    $scope.OWA2 = false
    $scope.OWA3 = false
    $scope.OWA4 = false
    $scope.OWA5 = false
    $scope.OWA6 = false
    $scope.OWA7 = false
    $scope.OWA8 = false
    $scope.OWA9 = false
    $scope.OWT1 = false
    $scope.OWT2 = false
    $scope.OWT3 = false
    $scope.OWT4 = false
    $scope.OWT5 = false
    $scope.OWT6 = false
    $scope.OWT7 = false
    $scope.OWT8 = false
    $scope.OWT9 = false
    $scope.scoreTL = false
    $scope.scoreTM = false
    $scope.scoreTR = false
    $scope.scoreBL = false
    $scope.scoreBM = false
    $scope.scoreBR = false
    $scope.scoreTop = false
    $scope.scoreBottom = false
    $scope.scale = false
    $scope.pickupF = $scope.data.judgment[0];
    $scope.pickupS = $scope.data.judgment[0];
    $scope.defense = $scope.data.judgment[0];
    $scope.spy = $scope.data.judgment[0];
    $scope.signal = $scope.data.judgment[0];
  }
  
  /*
    This function is called when the user selects the robot. It loads values for
    the fields from the SQLite database that match the team and robot. If there
    is no record for the selected team/robot combination, it sets all the fields
    to "[Unknown]."
  */
  $scope.selectRobot = function() {
    Robot.getById($scope.selectedRobot.id).then(function(robot) {
      if (robot) {
        //set the current robot
        //$scope.selectedRobot = robot;
        
        //set the values for the fields in the form based on the database if they
        //exist. Otherwise, set to the unselected value.
        if (robot.runAuto) $scope.runAuto = $scope.data.yesNo[robot.runAuto];
        if (robot.driveType) $scope.driveType = robot.driveType;
        if (robot.height) $scope.height = robot.height;
        if (robot.notes) $scope.notes = robot.notes;
        if (robot.spyReq) $scope.spyReq = $scope.data.yesNo[robot.spyReq];
        if (robot.spyDoc) $scope.spyDoc = $scope.data.yesNo[robot.spyReq];
        if (robot.OWA1) $scope.OWA1 = robot.OWA1;
        if (robot.OWA2) $scope.OWA2 = robot.OWA2;
        if (robot.OWA3) $scope.OWA3 = robot.OWA3;
        if (robot.OWA4) $scope.OWA4 = robot.OWA4;
        if (robot.OWA5) $scope.OWA5 = robot.OWA5;
        if (robot.OWA6) $scope.OWA6 = robot.OWA6;
        if (robot.OWA7) $scope.OWA7 = robot.OWA7;
        if (robot.OWA8) $scope.OWA8 = robot.OWA8;
        if (robot.OWA9) $scope.OWA9 = robot.OWA9;
        if (robot.OWT1) $scope.OWT1 = robot.OWT1;
        if (robot.OWT2) $scope.OWT2 = robot.OWT2;
        if (robot.OWT3) $scope.OWT3 = robot.OWT3;
        if (robot.OWT4) $scope.OWT4 = robot.OWT4;
        if (robot.OWT5) $scope.OWT5 = robot.OWT5;
        if (robot.OWT6) $scope.OWT6 = robot.OWT6;
        if (robot.OWT7) $scope.OWT7 = robot.OWT7;
        if (robot.OWT8) $scope.OWT8 = robot.OWT8;
        if (robot.OWT9) $scope.OWT9 = robot.OWT9;
        if (robot.scoreTL) $scope.scoreTL = robot.scoreTL;
        if (robot.scoreTM) $scope.scoreTM = robot.scoreTM;
        if (robot.scoreTR) $scope.scoreTR = robot.scoreTR;
        if (robot.scoreBL) $scope.scoreBL = robot.scoreBL;
        if (robot.scoreBM) $scope.scoreBM = robot.scoreBM;
        if (robot.scoreBR) $scope.scoreBR = robot.scoreBR
        if (robot.scoreTop) $scope.scoreTop = robot.scoreTop;
        if (robot.scoreBottom) $scope.scoreBottom = robot.scoreBottom;
        if (robot.scale) $scope.scale = robot.scale;
        if (robot.pickupF) $scope.pickupF = $scope.data.judgment[robot.pickupF];
        if (robot.pickupS) $scope.pickuptS = $scope.data.judgment[robot.pickupS];
        if (robot.defense) $scope.defense = $scope.data.judgment[robot.defense];
        if (robot.spy) $scope.spy = $scope.data.judgment[robot.spy];
        if (robot.signal) $scope.signal = $scope.data.judgment[robot.signal];
      }
    })
  }
  
  /*
    This function is called each time a field is updated.
  */
  $scope.robotChanged = function() {
    var editRobot = angular.copy($scope.selectedRobot);
    editRobot.runAuto = $scope.runAuto || $scope.data.yesNo[robot.runAuto];
    editRobot.driveType = $scope.driveType || "";
    editRobot.height = $scope.height || 0;
    editRobot.notes = $scope.notes || "";
    editRobot.spyReq = $scope.spyReq || false;
    editRobot.spyDoc = $scope.spyDoc || false;
    editRobot.OWA1 = $scope.OWA1 || false;
    editRobot.OWA2 = $scope.OWA2 || false;
    editRobot.OWA3 = $scope.OWA3 || false;
    editRobot.OWA4 = $scope.OWA4 || false;
    editRobot.OWA5 = $scope.OWA5 || false;
    editRobot.OWA6 = $scope.OWA6 || false;
    editRobot.OWA7 = $scope.OWA7 || false;
    editRobot.OWA8 = $scope.OWA8 || false;
    editRobot.OWA9 = $scope.OWA9 || false;
    editRobot.OWT1 = $scope.OWT1 || false;
    editRobot.OWT2 = $scope.OWT2 || false;
    editRobot.OWT3 = $scope.OWT3 || false;
    editRobot.OWT4 = $scope.OWT4 || false;
    editRobot.OWT5 = $scope.OWT5 || false;
    editRobot.OWT6 = $scope.OWT6 || false;
    editRobot.OWT7 = $scope.OWT7 || false;
    editRobot.OWT8 = $scope.OWT8 || false;
    editRobot.OWT9 = $scope.OWT9 || false;
    editRobot.scoreTL = $scope.scoreTL || false;
    editRobot.scoreTM = $scope.scoreTM || false;
    editRobot.scoreTR = $scope.scoreTR || false;
    editRobot.scoreBL = $scope.scoreBL || false;
    editRobot.scoreBM = $scope.scoreBM || false;
    editRobot.scoreBR = $scope.scoreBR || false;
    editRobot.scoreTop = $scope.scoreTop || false;
    editRobot.scoreBottom = $scope.scoreBottom || false;
    editRobot.scale = $scope.scale || false;
    editRobot.pickupF = $scope.pickupF || $scope.data.judgment[0];
    editRobot.pickupS = $scope.pickupS || $scope.data.judgment[0];
    editRobot.defense = $scope.defense || $scope.data.judgment[0];
    editRobot.spy = $scope.spy || $scope.data.judgment[0];
    editRobot.signal = $scope.signal || $scope.data.judgment[0];
    Robot.update($scope.selectedRobot, editRobot);
  }
})






.controller('MatchScoutingController', function($scope, $stateParams, Robot, RobotMatch, Match) {
  /*
    teamName: the name of the team
    robotName: the name of the robot that a team has
    matchNum: the match during which data was retrieved
    driveSpeed: how fast the robot can move about the field    
  */
  $scope.data = {
    yesNo: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    judgment: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: "Didn't"},
      {id: '2', name: 'Poorly'},
      {id: '3', name: 'Well'}
    ]
  }

  //retrieve the robot(s) for the selected team
  $scope.selectTeam = function() {
    //TODO: Push this to a service, as it is copied from the Pit controller and
    //we want DRY code
    Robot.getByTeam($scope.team.id).then(function(robots) {
      $scope.robots = robots;
    })
    
    //reset the selected robot
    //first, copy the existing team and match selection
    var teamCopy = angular.copy($scope.team);
    var matchCopy = angular.copy($scope.match);
    //then reset the data
    //$scope.resetData();
    //then repopulate the selected team and match
    $scope.team = teamCopy;
    $scope.match = matchCopy;
  }
  
  //Pull matches out of the database. They are not dependent on other values,
  //so there is no need to wrap them in a function
  Match.all().then(function(matches) {
    $scope.matches = matches;
  })

  /*
    This function is called when the user changes the robot. It loads values for
    the fields from the SQLite database or, if there is no record for the 
    selected team, it sets all of the fields to [Unknown]. 
  */
  $scope.selectRobot = function() {
    //the if statement skips the contents if this function was triggered by the 
    //field being set to no-value or if both a robot and match haven't been 
    //selectd
    if ($scope.selectedRobot && $scope.match) {
      //retrieve all robot data for the selected robot
      RobotMatch.getById($scope.selectedRobot.id, $scope.match.id).then(function(robot) {
        //verify that a robot was returned instead of null (null = no matching record in the db)
        if (robot) {
          //set the current robot
          $scope.robot = robot;
          
          //set the values for the fields in the form based on the database if they
          //exist. Otherwise, set to the unselected value.
          if (robot.numLow) {
            $scope.numLow = robot.numLow;
          } else {
            $scope.numLow = 0;
          }
          if (robot.numHigh) {
            $scope.numHigh = robot.numHigh;
          } else {
            $scope.numHigh = 0;
          }
          if (robot.lowBarA) {
            $scope.lowBarA = robot.lowBarA;
          } else {
            $scope.lowBarA = 0;
          }
          if (robot.lowBarT) {
            $scope.lowBarT = robot.lowBarT;
          } else {
            $scope.lowBarT = 0;
          }
          if (robot.portA) {
            $scope.portA = robot.portA;
          } else {
            $scope.portA = 0;
          }
          if (robot.portT) {
            $scope.portT = robot.portT;
          } else {
            $scope.portT = 0;
          }
          if (robot.chevA) {
            $scope.chevA = robot.chevA;
          } else {
            $scope.chevA = 0;
          }
          if (robot.chevT) {
            $scope.chevT = robot.chevT;
          } else {
            $scope.chevT = 0;
          }
          if (robot.moatA) {
            $scope.moatA = robot.moatA;
          } else {
            $scope.moatA = 0;
          }
          if (robot.moatT) {
            $scope.moatT = robot.moatT;
          } else {
            $scope.moatT = 0;
          }
          if (robot.rockA) {
            $scope.rockA = robot.rockA;
          } else {
            $scope.rockA = 0;
          }
          if (robot.rockT) {
            $scope.rockT = robot.rockT;
          } else {
            $scope.rockT = 0;
          }
          if (robot.roughA) {
            $scope.roughA = robot.roughA;
          } else {
            $scope.roughA = 0;
          }
          if (robot.roughT) {
            $scope.roughT = robot.roughT;
          } else {
            $scope.roughT = 0;
          }
          if (robot.sallyA) {
            $scope.sallyA = robot.sallyA;
          } else {
            $scope.sallyA = 0;
          }
          if (robot.sallyT) {
            $scope.sallyT = robot.sallyT;
          } else {
            $scope.sallyT = 0;
          }
          if (robot.drawA) {
            $scope.drawA = robot.drawA;
          } else {
            $scope.drawA = 0;
          }
          if (robot.drawT) {
            $scope.drawT = robot.drawT;
          } else {
            $scope.drawT = 0;
          }
          if (robot.scaled) {
            $scope.scaled = robot.scaled;
          } else {
            $scope.scaled = 0;
          }
          if (robot.challenge) {
            $scope.challenge = robot.challenge;
          } else {
            $scope.challenge = 0;
          }
          if (robot.bFloor) {
            $scope.bFloor = robot.bFloor;
          } else {
            $scope.bFloor = $scope.data.judgment[0];;
          }
          if (robot.bSecret) {
            $scope.bSecret = robot.bSecret;
          } else {
            $scope.bSecret = $scope.data.judgment[0];;
          }
          if (robot.numF) {
            $scope.numF = robot.numF;
          } else {
            $scope.numF = 0;
          }
          if (robot.borked) {
            $scope.borked = robot.borked;
          } else {
            $scope.borked = false;
          }
          if (robot.defense) {
            $scope.defense = robot.defense;
          } else {
            $scope.defense = $scope.data.judgment[0];;
          }
          if (robot.spyComm1) {
            $scope.spyComm1 = robot.spyComm1;
          } else {
            $scope.spyComm1 = $scope.data.judgment[0];;
          }
          if (robot.spyComm2) {
            $scope.spyComm2 = robot.spyComm2;
          } else {
            $scope.spyComm2 = $scope.data.judgment[0];;
          }
        } else {
          //if no database record, set all fields to unselected values for the 
          //form to display
          $scope.numLow = 0;
          $scope.numHigh = 0;
          $scope.lowBarA = 0;
          $scope.lowBarT = 0;
          $scope.portA = 0;
          $scope.portT = 0;
          $scope.chevA = 0;
          $scope.chevT = 0;
          $scope.moatA = 0;
          $scope.moatT = 0;
          $scope.rockA = 0;
          $scope.rockT = 0;
          $scope.roughA = 0;
          $scope.roughT = 0;
          $scope.sallyA = 0;
          $scope.sallyT = 0;
          $scope.drawA = 0;
          $scope.drawT = 0;
          $scope.scaled = 0;
          $scope.challenge = 0;
          $scope.bFloor = $scope.data.judgment[0];
          $scope.bSecret = $scope.data.judgment[0];
          $scope.numF = 0;
          $scope.borked = false;
          $scope.defense = $scope.data.judgment[0];
          $scope.spyComm1 = $scope.data.judgment[0];
          $scope.spyComm2 = $scope.data.judgment[0];

          //then create a robot object with the same values
          var newRobotMatch = [];
          newRobotMatch.numLow = $scope.numLow;
          newRobotMatch.numHigh = $scope.numHigh;
          newRobotMatch.lowBarA = $scope.lowBarA;
          newRobotMatch.lowBarT = $scope.lowBarT;
          newRobotMatch.portA = $scope.portA;
          newRobotMatch.portT = $scope.portT;
          newRobotMatch.chevA = $scope.chevA;
          newRobotMatch.chevT = $scope.chevT;
          newRobotMatch.moatA = $scope.moatA;
          newRobotMatch.moatT = $scope.moatT;
          newRobotMatch.rockA = $scope.rockA;
          newRobotMatch.rockT = $scope.rockT;
          newRobotMatch.roughA = $scope.roughA;
          newRobotMatch.roughT = $scope.roughT;
          newRobotMatch.sallyA = $scope.sallyA;
          newRobotMatch.sallyT = $scope.sallyT;
          newRobotMatch.drawA = $scope.drawA;
          newRobotMatch.drawT = $scope.drawT;
          newRobotMatch.scaled = $scope.scaled;
          newRobotMatch.challenge = $scope.challenge;
          newRobotMatch.bFloor = $scope.bFloor;
          newRobotMatch.bSecret = $scope.bSecret;
          newRobotMatch.numF = $scope.numF;
          newRobotMatch.borked = $scope.borked;
          newRobotMatch.defense = $scope.defense;
          newRobotMatch.spyComm1 = $scope.spyComm1;
          newRobotMatch.spyComm2 = $scope.spyComm2;
          
          //and then persist the values to a new data store record
          console.log("Adding new records to RobotMatch with robot ID '" + newRobotMatch.robotId + "' and match ID '" + newRobotMatch.matchId + "'");
          RobotMatch.add(newRobotMatch);
        }
      })
    }
  }
  
  /*
    This function is called when a match number is selected
  */
  $scope.selectMatch = function() {
    $scope.selectRobot();
  }
  
  /*
    This function is called each time a field is updated.
  */
  $scope.robotMatchChanged = function() {
    var editRobotMatch = angular.copy($scope.selectedRobot);
    
    if ($scope.numLow) {
      editRobotMatch.numLow = angular.copy($scope.numLow);
    } else {
      editRobotMatch.numLow = 0;
    }
    if ($scope.numHigh) {
      editRobotMatch.numHigh = angular.copy($scope.numHigh);
    } else {
      editRobotMatch.numHigh = 0;
    }
    if ($scope.lowBarA) {
      editRobotMatch.lowBarA = angular.copy($scope.lowBarA);
    } else {
      editRobotMatch.lowBarA = 0;
    }
    if ($scope.lowBarT) {
      editRobotMatch.lowBarT = angular.copy($scope.lowBarT);
    } else {
      editRobotMatch.lowBarT = 0;
    }
    if ($scope.portA) {
      editRobotMatch.portA = angular.copy($scope.portA);
    } else {
      editRobotMatch.portA = 0;
    }
    if ($scope.portT) {
      editRobotMatch.portT = angular.copy($scope.portT);
    } else {
      editRobotMatch.portT = 0;
    }
    if ($scope.chevA) {
      editRobotMatch.chevA = angular.copy($scope.chevA);
    } else {
      editRobotMatch.chevA = 0;
    }
    if ($scope.chevT) {
      editRobotMatch.chevT = angular.copy($scope.chevT);
    } else {
      editRobotMatch.chevT = 0;
    }
    if ($scope.moatA) {
      editRobotMatch.moatA = angular.copy($scope.moatA);
    } else {
      editRobotMatch.moatA = 0;
    }
    if ($scope.moatT) {
      editRobotMatch.moatT = angular.copy($scope.moatT);
    } else {
      editRobotMatch.moatT = 0;
    }
    if ($scope.rockA) {
      editRobotMatch.rockA = angular.copy($scope.rockA);
    } else {
      editRobotMatch.rockA = 0;
    }
    if ($scope.rockT) {
      editRobotMatch.rockT = angular.copy($scope.rockT);
    } else {
      editRobotMatch.rockT = 0;
    }
    if ($scope.roughA) {
      editRobotMatch.roughA = angular.copy($scope.roughA);
    } else {
      editRobotMatch.roughA = 0;
    }
    if ($scope.roughT) {
      editRobotMatch.roughT = angular.copy($scope.roughT);
    } else {
      editRobotMatch.roughT = 0;
    }
    if ($scope.sallyA) {
      editRobotMatch.sallyA = angular.copy($scope.sallyA);
    } else {
      editRobotMatch.sallyA = 0;
    }
    if ($scope.sallyT) {
      editRobotMatch.sallyT = angular.copy($scope.sallyT);
    } else {
      editRobotMatch.sallyT = 0;
    }
    if ($scope.drawA) {
      editRobotMatch.drawA = angular.copy($scope.drawA);
    } else {
      editRobotMatch.drawA = 0;
    }
    if ($scope.drawT) {
      editRobotMatch.drawT = angular.copy($scope.drawT);
    } else {
      editRobotMatch.drawT = 0;
    }
    if ($scope.scaled) {
      editRobotMatch.scaled = angular.copy($scope.scaled);
    } else {
      editRobotMatch.scaled = 0;
    }
    if ($scope.challenge) {
      editRobotMatch.challenge = angular.copy($scope.challenge);
    } else {
      editRobotMatch.challenge = 0;
    }
    if ($scope.bFloor) {
      editRobotMatch.bFloor = angular.copy($scope.bFloor);
    } else {
      editRobotMatch.bFloor = $scope.data.judgment[0];
    }
    if ($scope.bSecret) {
      editRobotMatch.bSecret = angular.copy($scope.bSecret);
    } else {
      editRobotMatch.bSecret = $scope.data.judgment[0];
    }
    if ($scope.numF) {
      editRobotMatch.numF = angular.copy($scope.numF);
    } else {
      editRobotMatch.numF = 0;
    }
    if ($scope.borked) {
      editRobotMatch.borked = angular.copy($scope.borked);
    } else {
      editRobotMatch.borked = false;
    }
    if ($scope.defense) {
      editRobotMatch.defense = angular.copy($scope.defense);
    } else {
      editRobotMatch.defense = $scope.data.judgment[0];
    }
    if ($scope.spyComm1) {
      editRobotMatch.spyComm1 = angular.copy($scope.spyComm1);
    } else {
      editRobotMatch.spyComm1 = $scope.data.judgment[0];
    }
    if ($scope.spyComm2) {
      editRobotMatch.spyComm2 = angular.copy($scope.spyComm2);
    } else {
      editRobotMatch.spyComm2 = $scope.data.judgment[0];
    }
    
    if ($scope.selectedRobot) {
      editRobotMatch.robotId = angular.copy($scope.selectedRobot.id);
    }
    
    if ($scope.match) {
      editRobotMatch.matchId = angular.copy($scope.match.id);
    }
    
    RobotMatch.update($scope.selectedRobot, editRobotMatch);
  }
});
