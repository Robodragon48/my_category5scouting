/*
  Much of the code in this file and services.js that has to do with SQLite is
  derived from the gist created by Borris Sondagh, here: 
  https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
*/
angular.module('cat5scouting.controllers', [])

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

.controller('SyncCtrl', function($scope, $stateParams) {
  
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
  }
  
  /*
    This function is called when the user selects the robot. It loads values for
    the fields from the SQLite database that match the team and robot. If there
    is no record for the selected team/robot combination, it sets all the fields
    to "[Unknown]."
  */
  $scope.selectRobot = function() {
    Robot.getById($scope.selectedRobot.id).then(function(robot) {
      //set the current robot
      $scope.robot = robot;
      
      //set the values for the fields in the form based on the database if they
      //exist. Otherwise, set to the unselected value.
      if (robot.driveMode) {
        $scope.driveMode = robot.driveMode.id;
      } else {
        $scope.driveMode = $scope.data.driveModes[0];
      }

      $scope.driveSpeed = robot.driveSpeed || $scope.data.driveSpeeds[0];
      $scope.driveOverPlatform = robot.driveOverPlatform || $scope.data.yesNo[0];;
      $scope.autonomousCapability = robot.autonomousCapability || $scope.data.autonomousCapabilities[0];;
      $scope.coopStep = robot.coopStep || $scope.data.coopStepOptions[0];;
      $scope.pickupLoc = robot.pickupLoc || $scope.data.pickupLocs[0];
      $scope.maxToteHeight = robot.maxToteHeight || $scope.data.maxToteHeights[0];
      $scope.maxContHeight = robot.maxContHeight || $scope.data.maxContHeights[0];
      $scope.stackContInd = robot.stackContInd || $scope.data.yesNo[0];
      $scope.collectContStep = robot.collectContStep || $scope.data.yesNo[0];
    })
  }
  
  /*
    This function is called each time a field is updated.
  */
  $scope.robotChanged = function() {
    var editRobot = angular.copy($scope.robot);
    editRobot.driveMode = $scope.driveMode;
    Robot.update($scope.robot, editRobot);
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
    $scope.resetData();
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
    //field being set to no-value.
    if ($scope.selectedRobot) {
      //check to make sure both a robot and a match have been selected
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
            //if no database record, set all fields to unselected values
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
          }
        })
      }
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
  $scope.robotChanged = function() {
    var editRobot = angular.copy($scope.robot);
    
    if ($scope.driveSpeed) {
      editRobot.driveSpeed = angular.copy($scope.driveSpeed);
    } else {
      editRobot.driveSpeed = $scope.data.driveSpeeds[0];
    }
    
    if ($scope.driveOverPlatform) {
      editRobot.driveOverPlatform = angular.copy($scope.driveOverPlatform);
    } else {
      editRobot.driveOverPlatform = $scope.data.yesNo[0];;
    }
    
    if ($scope.botSet) {
      editRobot.botSet = angular.copy($scope.botSet);
    } else {
      editRobot.botSet = $scope.data.yesNo[0];
    }
    
    if ($scope.toteSet) {
      editRobot.toteSet = angular.copy($scope.toteSet);
    } else {
      editRobot.toteSet = $scope.data.yesNo[0];
    }
    
    if ($scope.containerSet) {
      editRobot.containerSet = angular.copy($scope.containerSet);
    } else {
      editRobot.containerSet = $scope.data.yesNo[0];
    }
    
    if ($scope.stackedToteSet) {
      editRobot.stackedToteSet = angular.copy($scope.stackedToteSet);
    } else {
      editRobot.stackedToteSet = $scope.data.yesNo[0];
    }
    
    if ($scope.coopScoreStep) {
      editRobot.coopScoreStep = angular.copy($scope.coopScoreStep);
    } else {
      editRobot.coopScoreStep = 0;
    }
    
    if ($scope.feedstation) {
      editRobot.feedstation = angular.copy($scope.feedstation);
    } else {
      editRobot.feedstation = $scope.data.yesNo[0];
    }
    
    if ($scope.landfill) {
      editRobot.landfill = angular.copy($scope.landfill);
    } else {
      editRobot.landfill = $scope.data.yesNo[0];
    }
    
    if ($scope.scoredToteHeight) {
      editRobot.scoredToteHeight = angular.copy($scope.scoredToteHeight);
    } else {
      editRobot.scoredToteHeight = 0;
    }
    
    if ($scope.containerStep) {
      editRobot.containerStep = angular.copy($scope.containerStep);
    } else {
      editRobot.containerStep = $scope.data.yesNo[0];
    }
    
    if ($scope.scoredIndContainerHeight) {
      editRobot.scoredIndContainerHeight = angular.copy($scope.scoredIndContainerHeight);
    } else {
      editRobot.scoredIndContainerHeight = 0;
    }
    
    if ($scope.scoredContainerHeight) {
      editRobot.scoredContainerHeight = angular.copy($scope.scoredContainerHeight);
    } else {
      editRobot.scoredContainerHeight = 0;
    }
    
    RobotMatch.update($scope.robot, editRobot);
  }
});
