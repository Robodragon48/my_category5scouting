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



.controller('SettingsCtrl', function($scope, $stateParams) {
  
})


.controller('GenerateSampleData' function($scope, $stateParams, Team, Robot, RobotMatch) {
    /* Load the database with test values
     * Add to this section each time you add a new table definition
     * if appropriate */
    
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
    
    /*
    var query = "INSERT INTO robotMatch(robotId, matchId, driveSpeed) VALUES (?, ?, ?);";
    $cordovaSQLite.execute(db, query, [1, 1, 1]).then(function(res) {
      console.log("match insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
    */
    
    /**/

})





.controller('PitScoutingController', function($scope, $stateParams, Robot) {
  ///TODO Convert these to SQLite database calls
  /*
    teamName: the name of the team; values provided via PitCtrl controller
    robotName: the name of the robot that a team has
    driveMode: the type of wheels/locomotion that the robot uses
    driveSpeed: how fast the robot can move about the field
    driveOverPlatform: whether the robot is capable of driving over the platform
    autonomousCapability: what the robot can accomplish during autonomous play
    coopStep: how many totes the robot can load onto the cooperative step
    pickupLoc: where the robot can retrieve totes from on the field
    maxToteHeight: the maximum # of totes the robot can stack
    maxContHeight: the maximum # of totes the robot can top with a container
    stackContInd: can the robot stack containers independently?
    collectContStep: can the robot collect a container from the step?
    note: free-form field for providing additional observations
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
    editRobot.runAuto = $scope.runAuto || 
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
    editRobot.scoreTop = $scope.scoreTop || 
    editRobot.scoreBottom = $scope.scoreBottom || 
    editRobot.scale = $scope.scale || 
    editRobot.pickupF = $scope.pickupF || 
    editRobot.pickupS = $scope.pickupS || 
    editRobot.defense = $scope.defense || 
    editRobot.spy = $scope.spy || 
    editRobot.signal = $scope.signal || 
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
          if (robot.runAuto) {
              $scope.runAuto = robot.runAuto;
          } else {
              $scope.runAuto = $scope.data.yesNo[0];
          }
          if (robot.driveType) {
              $scope.driveType = robot.driveType;
          } else {
              $scope.driveType = "";
          }
          if (robot.height) {
              $scope.height = robot.height;
          } else {
              $scope.height = 0;
          }
          if (robot.notes) {
              $scope.notes = robot.notes;
          } else {
              $scope.notes = "";
          }
          if (robot.spyReq) {
              $scope.spyReq = robot.spyReq;
          } else {
              $scope.spyReq = $scope.data.yesNo[0];
          }
          if (robot.spyDoc) {
              $scope.spyDoc = robot.spyDoc;
          } else {
              $scope.spyDoc = $scope.data.yesNo[0];
          }
          if (robot.OWA1) {
              $scope.OWA1 = robot.OWA1;
          } else {
              $scope.OWA1 OWA1 = false;
          }
          if (robot.OWA2) {
              $scope.OWA2 = robot.OWA2;
          } else {
              $scope.OWA2 OWA2 = false;
          }
          if (robot.OWA3) {
              $scope.OWA3 = robot.OWA3;
          } else {
              $scope.OWA3 = false;
          }
          if (robot.OWA4) {
              $scope.OWA4 = robot.OWA4;
          } else {
              $scope.OWA4 = false;
          }
          if (robot.OWA5) {
              $scope.OWA5 = robot.OWA5;
          } else {
              $scope.OWA5 = false;
          }
          if (robot.OWA6) {
              $scope.OWA6 = robot.OWA6;
          } else {
              $scope.OWA6 = false;
          }
          if (robot.OWA7) {
              $scope.OWA7 = robot.OWA7;
          } else {
              $scope.OWA7 = false;
          }
          if (robot.OWA8) {
              $scope.OWA8 = robot.OWA8;
          } else {
              $scope.OWA8 = false;
          }
          if (robot.OWA9) {
              $scope.OWA9 = robot.OWA9;
          } else {
              $scope.OWA9 = false;
          }
          if (robot.OWT1) {
              $scope.OWT1 = robot.OWT1;
          } else {
              $scope.OWT1 = false;
          }
          if (robot.OWT2) {
              $scope.OWT2 = robot.OWT2;
          } else {
              $scope.OWT2 = false;
          }
          if (robot.OWT3) {
              $scope.OWT3 = robot.OWT3;
          } else {
              $scope.OWT3 = false;
          }
          if (robot.OWT4) {
              $scope.OWT4 = robot.OWT4;
          } else {
              $scope.OWT4 = false;
          }
          if (robot.OWT5) {
              $scope.OWT5 = robot.OWT5;
          } else {
              $scope.OWT5 = false;
          }
          if (robot.OWT6) {
              $scope.OWT6 = robot.OWT6;
          } else {
              $scope.OWT6 = false;
          }
          if (robot.OWT7) {
              $scope.OWT7 = robot.OWT7;
          } else {
              $scope.OWT7 = false;
          }
          if (robot.OWT8) {
              $scope.OWT8 = robot.OWT8;
          } else {
              $scope.OWT8 = false;
          }
          if (robot.OWT9) {
              $scope.OWT9 = robot.OWT9;
          } else {
              $scope.OWT9 = false;
          }
          if (robot.scoreTL) {
              $scope.scoreTL = robot.scoreTL;
          } else {
              $scope.scoreTL = false;
          }
          if (robot.scoreTM) {
              $scope.scoreTM = robot.scoreTM;
          } else {
              $scope.scoreTM = false;
          }
          if (robot.scoreTR) {
              $scope.scoreTR = robot.scoreTR;
          } else {
              $scope.scoreTR = false;
          }
          if (robot.scoreBL) {
              $scope.scoreBL = robot.scoreBL;
          } else {
              $scope.scoreBL = false;
          }
          if (robot.scoreBM) {
              $scope.scoreBM = robot.scoreBM;
          } else {
              $scope.scoreBM = false;
          }
          if (robot.scoreBR) {
              $scope.scoreBR = robot.scoreBR;
          } else {
              $scope.scoreBR = false;
          }
          if (robot.scoreTop) {
              $scope.scoreTop = robot.scoreTop;
          } else {
              $scope.scoreTop = false;
          }
          if (robot.scoreBottom) {
              $scope.scoreBottom = robot.scoreBottom;
          } else {
              $scope.scoreBottom = false;
          }
          if (robot.scale) {}
              $scope.scale = robot.scale;
          } else {
              $scope.scale = false;
          }
          if (robot.pickupF) {
              $scope.pickupF = robot.pickupF;
          } else {
              $scope.pickupF = false;
          }
          if (robot.pickupS) {
              $scope.pickupS = robot.pickupS;
          } else {
              $scope.pickupS = false;
          }
          if (robot.defense) {
              $scope.defense = robot.defense;
          } else {
              $scope.defense = false;
          }
          if (robot.spy) {
              $scope.spy = robot.spy;
          } else {
              $scope.spy = false;
          }
          if (robot.signal) {
              $scope.signal = robot.signal;
          } else {
              $scope.signal = false;
          }
        } else {
          //if no database record, set all fields to unselected values for the 
          //form to display
          $scope.driveSpeed = $scope.data.driveSpeeds[0];
          $scope.driveOverPlatform = $scope.data.yesNo[0];
          $scope.botSet = $scope.data.yesNo[0];
          $scope.toteSet = $scope.data.yesNo[0];
          $scope.containerSet = $scope.data.yesNo[0];
          $scope.stackedToteSet = $scope.data.yesNo[0];
          $scope.coopScoreStep = 0;
          $scope.feedstation = $scope.data.yesNo[0];
          $scope.landfill = $scope.data.yesNo[0];
          $scope.scoredToteHeight = 0;
          $scope.containerStep = $scope.data.yesNo[0];
          $scope.scoredIndContainerHeight = 0;
          $scope.scoredContainerHeight = 0;
          
          //then create a robot object with the same values
          var newRobotMatch = [];
          newRobotMatch.robotId = $scope.selectedRobot.id;
          newRobotMatch.matchId = $scope.match.id;
          newRobotMatch.driveSpeed = $scope.data.driveSpeeds[0];
          newRobotMatch.driveOverPlatform = $scope.data.yesNo[0];
          newRobotMatch.botSet = $scope.data.yesNo[0];
          newRobotMatch.toteSet = $scope.data.yesNo[0];
          newRobotMatch.containerSet = $scope.data.yesNo[0];
          newRobotMatch.stackedToteSet = $scope.data.yesNo[0];
          newRobotMatch.coopScoreStep = 0;
          newRobotMatch.feedstation = $scope.data.yesNo[0];
          newRobotMatch.landfill = $scope.data.yesNo[0];
          newRobotMatch.scoredToteHeight = 0;
          newRobotMatch.containerStep = $scope.data.yesNo[0];
          newRobotMatch.scoredIndContainerHeight = 0;
          newRobotMatch.scoredContainerHeight = 0;
          
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
    
    if ($scope.driveSpeed) {
      editRobotMatch.driveSpeed = angular.copy($scope.driveSpeed);
    } else {
      editRobotMatch.driveSpeed = $scope.data.driveSpeeds[0];
    }
    
    if ($scope.driveOverPlatform) {
      editRobotMatch.driveOverPlatform = angular.copy($scope.driveOverPlatform);
    } else {
      editRobotMatch.driveOverPlatform = $scope.data.yesNo[0];;
    }
    
    if ($scope.botSet) {
      editRobotMatch.botSet = angular.copy($scope.botSet);
    } else {
      editRobotMatch.botSet = $scope.data.yesNo[0];
    }
    
    if ($scope.toteSet) {
      editRobotMatch.toteSet = angular.copy($scope.toteSet);
    } else {
      editRobotMatch.toteSet = $scope.data.yesNo[0];
    }
    
    if ($scope.containerSet) {
      editRobotMatch.containerSet = angular.copy($scope.containerSet);
    } else {
      editRobotMatch.containerSet = $scope.data.yesNo[0];
    }
    
    if ($scope.stackedToteSet) {
      editRobotMatch.stackedToteSet = angular.copy($scope.stackedToteSet);
    } else {
      editRobotMatch.stackedToteSet = $scope.data.yesNo[0];
    }
    
    if ($scope.coopScoreStep) {
      editRobotMatch.coopScoreStep = angular.copy($scope.coopScoreStep);
    } else {
      editRobotMatch.coopScoreStep = 0;
    }
    
    if ($scope.feedstation) {
      editRobotMatch.feedstation = angular.copy($scope.feedstation);
    } else {
      editRobotMatch.feedstation = $scope.data.yesNo[0];
    }
    
    if ($scope.landfill) {
      editRobotMatch.landfill = angular.copy($scope.landfill);
    } else {
      editRobotMatch.landfill = $scope.data.yesNo[0];
    }
    
    if ($scope.scoredToteHeight) {
      editRobotMatch.scoredToteHeight = angular.copy($scope.scoredToteHeight);
    } else {
      editRobotMatch.scoredToteHeight = 0;
    }
    
    if ($scope.containerStep) {
      editRobotMatch.containerStep = angular.copy($scope.containerStep);
    } else {
      editRobotMatch.containerStep = $scope.data.yesNo[0];
    }
    
    if ($scope.scoredIndContainerHeight) {
      editRobotMatch.scoredIndContainerHeight = angular.copy($scope.scoredIndContainerHeight);
    } else {
      editRobotMatch.scoredIndContainerHeight = 0;
    }
    
    if ($scope.scoredContainerHeight) {
      editRobotMatch.scoredContainerHeight = angular.copy($scope.scoredContainerHeight);
    } else {
      editRobotMatch.scoredContainerHeight = 0;
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
