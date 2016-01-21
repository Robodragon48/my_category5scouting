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


.controller('SyncCtrl', function($scope, $cordovaFile, Robot, RobotMatch) {
  
  $scope.exportData = function() {
    
    console.log("exportData called");
    
    //Create the exported Robot data to write to a file
    var exportData = "Test data for export";
    /*
    Robot.all().then(function(robots) {
      for (var i=0; i<robots.length; i++) {
        exportData += robots[i].name;
        exportData += ", ";
      }
    })
    */
    
    console.log("exportData = " + exportData);
    
    $cordovaFile.writeFile(cordova.file.dataDirectory, "Cat5Scouting.Pit.txt", exportData, true)
      .then(function (success) {
        console.log("Data exported to Cat5Scouting.Pit.txt");
      }, function (error) {
        console.log("Problem writing text to Pit file");
      });

    //Create the exported Robot Match data to write to a file
    var exportData = "";
    RobotMatch.all().then(function(robotMatches) {
      for (var i=0; i<robotMatches.length; i++) {
        exportData += robotMatches[i].robotId;
        exportData += ", ";
      }
    })
    
    $cordovaFile.writeFile(cordova.file.dataDirectory, "Cat5Scouting.Match.txt", exportData, true)
      .then(function (success) {
        console.log("Data exported to Cat5Scouting.Match.txt");
      }, function (error) {
        console.log("Problem writing text to Match file");
      });
  }
})



.controller('SettingsCtrl', function($scope, $stateParams) {
  
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
    ],
    driveModes: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'KOP'},
      {id: '2', name: 'Mecanum'},
      {id: '3', name: 'Omni'},
      {id: '4', name: 'Omni'}
    ],
    driveSpeeds: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Slow'},
      {id: '2', name: 'Medium'},
      {id: '3', name: 'Fast'}
    ],
    autonomousCapabilities: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Bot set'},
      {id: '2', name: 'Tote set'},
      {id: '3', name: 'Container set'},
      {id: '4', name: 'Stacked Tote set'},
      {id: '5', name: 'None'}
    ],
    coopStepOptions: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1'},
      {id: '3', name: '2'},
      {id: '4', name: '3'},
      {id: '5', name: 'None'}
    ],
    pickupLocs: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Feed station'},
      {id: '2', name: 'Landfill'},
      {id: '3', name: 'Neither'},
      {id: '4', name: 'Both'}
    ],
    maxToteHeights: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1-2'},
      {id: '3', name: '3-4'},
      {id: '4', name: '5-6'}
    ],
    maxContHeights: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1-2'},
      {id: '3', name: '3-4'},
      {id: '4', name: '5-6'}
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
    the Robots fiels from the SQLite database. 
  */
  $scope.selectTeam = function() {
    //retrieve the robot(s) for the selected team
    Robot.getByTeam($scope.team.id).then(function(robots) {
      $scope.robots = robots;
    })
    //reset the selected robot
    $scope.selectedRobot = null;
    //reset all the subsequent fields
    $scope.driveMode = $scope.data.driveModes[0];
    $scope.driveSpeed = $scope.data.driveSpeeds[0];
    $scope.driveOverPlatform = $scope.data.yesNo[0];
    $scope.autonomousCapability = $scope.data.autonomousCapabilities[0];
    $scope.coopStep = $scope.data.coopStepOptions[0];
    $scope.pickupLoc = $scope.data.pickupLocs[0];
    $scope.maxToteHeight = $scope.data.maxToteHeights[0];
    $scope.maxContHeight = $scope.data.maxContHeights[0];
    $scope.stackContInd = $scope.data.yesNo[0];
    $scope.collectContStep = $scope.data.yesNo[0];
    $scope.note = "";
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
        if (robot.driveMode) $scope.driveMode = $scope.data.driveModes[robot.driveMode];
        if (robot.driveSpeed) {
          $scope.driveSpeed = $scope.data.driveSpeeds[robot.driveSpeed];
        }
        if (robot.driveOverPlatform) {
          $scope.driveOverPlatform = $scope.data.yesNo[robot.driveOverPlatform];
        }
        if (robot.autonomousCapability) {
          $scope.autonomousCapability = $scope.data.autonomousCapabilities[robot.autonomousCapability];
        }
        if (robot.coopStep) {
          $scope.coopStep = $scope.data.coopStepOptions[robot.coopStep];
        }
        if (robot.pickupLoc) {
          $scope.pickupLoc = $scope.data.pickupLocs[robot.pickupLoc];
        }
        if (robot.maxToteHeight) {
          $scope.maxToteHeight = $scope.data.maxToteHeights[robot.maxToteHeight];
        }
        if (robot.maxContHeight) {
          $scope.maxContHeight = $scope.data.maxContHeights[robot.maxContHeight];
        }
        if (robot.stackContInd) {
          $scope.stackContInd = $scope.data.yesNo[robot.stackContInd];
        }
        if (robot.collectContStep) {
          $scope.collectContStep = $scope.data.yesNo[robot.collectContStep];
        }
        if (robot.note) {
          $scope.note = robot.note;
        }
      }
    })
  }
  
  /*
    This function is called each time a field is updated.
  */
  $scope.robotChanged = function() {
    //TODO: Figure out why Stack Containers Independently isn't populating when 
    //the robot is selected after the value has been persisted
    var editRobot = angular.copy($scope.selectedRobot);
    editRobot.driveMode = $scope.driveMode || $scope.data.driveModes[0];
    editRobot.driveSpeed = $scope.driveSpeed || $scope.data.driveSpeeds[0];
    editRobot.driveOverPlatform = $scope.driveOverPlatform || $scope.data.yesNo[0];
    editRobot.autonomousCapability = $scope.autonomousCapability || $scope.data.autonomousCapabilities[0];
    editRobot.coopStep = $scope.coopStep || $scope.data.coopStepOptions[0];
    editRobot.pickupLoc = $scope.pickupLoc || $scope.data.pickupLocs[0];
    editRobot.maxToteHeight = $scope.maxToteHeight || $scope.data.maxToteHeights[0];
    editRobot.maxContHeight = $scope.maxContHeight || $scope.data.maxContHeights[0];
    editRobot.stackContInd = $scope.stackContInd || $scope.data.yesNo[0];
    editRobot.collectContStep = $scope.collectContStep || 0;
    editRobot.note = $scope.note || "";
    Robot.update($scope.selectedRobot, editRobot);
  }
})






.controller('MatchScoutingController', function($scope, $stateParams, Robot, RobotMatch, Match) {
  /*
    teamName: the name of the team
    robotName: the name of the robot that a team has
    matchNum: the match during which data was retrieved
    driveSpeed: how fast the robot can move about the field
    driveOverPlatform: whether the robot is capable of driving over the platform
    botSet: was the robot able to create a Robot Set?
    toteSet: was the robot able to create a Tote Set?
    containerSet: was the robot able to create a Container Set?
    stackedToteSet: was the robot able to create a Stacked Tote Set?
    coopScoreStep: how many points did the robot score on the cooperative step?
    feedstation: did the robot collect from the human player station?
    landfill: did the robot pick up from the landfill?
    scoredToteHeight: what is the highest number of totes the robot stacked?
    containerStep: did the robot pick up a container from the step?
    scoredIndContainerHeight: [TODO: Consult with Brandon on this field]
    scoredContainerHeight: [TODO: Consult with Brandon on this field]
  */
  $scope.data = {
    yesNo: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    driveSpeeds: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Slow'},
      {id: '2', name: 'Medium'},
      {id: '3', name: 'Fast'}
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
          if (robot.driveSpeed) {
            $scope.driveSpeed = $scope.data.driveSpeeds[robot.driveSpeed];
          } else {
            $scope.driveSpeed = $scope.data.driveSpeeds[0];
          }
          
          if (robot.driveOverPlatform) {
            $scope.driveOverPlatform = $scope.data.yesNo[robot.driveOverPlatform];
          } else {
            $scope.driveOverPlatform = $scope.data.yesNo[0];
          }
          
          if (robot.botSet) {
            $scope.botSet = $scope.data.yesNo[robot.botSet];
          } else {
            $scope.botSet = $scope.data.yesNo[0];
          }
          
          if (robot.toteSet) {
            $scope.toteSet = $scope.data.yesNo[robot.toteSet];
          } else {
            $scope.toteSet = $scope.data.yesNo[0];
          }
          
          if (robot.containerSet) {
            $scope.containerSet = $scope.data.yesNo[robot.containerSet];
          } else {
            $scope.containerSet = $scope.data.yesNo[0];
          }
          
          if (robot.stackedToteSet) {
            $scope.stackedToteSet = $scope.data.yesNo[robot.stackedToteSet];
          } else {
            $scope.stackedToteSet = $scope.data.yesNo[0];
          }
          
          if (robot.coopScoreStep) {
            $scope.coopScoreStep = robot.coopScoreStep
          } else {
            $scope.coopScoreStep = 0;
          }
          
          if (robot.feedstation) {
            $scope.feedstation = $scope.data.yesNo[robot.feedstation];
          } else {
            $scope.feedstation = $scope.data.yesNo[0];
          }
          
          if (robot.landfill) {
            $scope.landfill = $scope.data.yesNo[robot.landfill];
          } else {
            $scope.landfill = $scope.data.yesNo[0];
          }
          
          if (robot.scoredToteHeight) {
            $scope.scoredToteHeight = robot.scoredToteHeight;
          } else {
            $scope.scoredToteHeight = 0;
          }
          
          if (robot.containerStep) {
            $scope.containerStep = $scope.data.yesNo[robot.containerStep];
          } else {
            $scope.containerStep = $scope.data.yesNo[0];
          }
          
          if (robot.scoredIndContainerHeight) {
            $scope.scoredIndContainerHeight = robot.scoredIndContainerHeight;
          } else {
            $scope.scoredIndContainerHeight = 0;
          }
          
          if (robot.scoredContainerHeight) {
            $scope.scoredContainerHeight = robot.scoredContainerHeight;
          } else {
            $scope.scoredContainerHeight = 0;
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
