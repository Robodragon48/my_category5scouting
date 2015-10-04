angular.module('cat5scouting.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('HomeCtrl', function($scope, $stateParams) {
  
})

.controller('MatchCtrl', function($scope, $stateParams) {
  
})

.controller('PitCtrl', function($scope, $stateParams) {
  
})

.controller('SyncCtrl', function($scope, $stateParams) {
  
})

.controller('SettingsCtrl', function($scope, $stateParams) {
  
})

.controller('PitScoutingController', function($scope, $stateParams) {
  ///TODO Convert these to SQLite database calls
  $scope.data = {
    teamName: null,
    teamNames: [
      {id: '1', name: 'Team 1'},
      {id: '2', name: 'Team 2'},
      {id: '3', name: 'Team 3'}
    ],
    driveMode: null,
    driveModes: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'KOP'},
      {id: '2', name: 'Mecanum'},
      {id: '3', name: 'Omni'},
      {id: '4', name: 'Omni'}
    ],
    driveSpeed: null,
    driveSpeeds: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Slow'},
      {id: '2', name: 'Medium'},
      {id: '3', name: 'Fast'}
    ],
    driveOverPlatform: null,
    driveOverPlatformOptions: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    autonomousCapability: null,
    autonomousCapabilities: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Bot set'},
      {id: '2', name: 'Tote set'},
      {id: '3', name: 'Container set'},
      {id: '4', name: 'Stacked Tote set'},
      {id: '5', name: 'None'}
    ],
    coopStep: null,
    coopStepOptions: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1'},
      {id: '3', name: '2'},
      {id: '4', name: '3'},
      {id: '5', name: 'None'}
    ],
    pickupLoc: null,
    pickupLocs: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Feed station'},
      {id: '2', name: 'Landfill'},
      {id: '3', name: 'Neither'},
      {id: '4', name: 'Both'}
    ],
    maxToteHeight: null,
    maxToteHeights: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1-2'},
      {id: '3', name: '3-4'},
      {id: '4', name: '5-6'}
    ],
    maxContHeight: null,
    maxContHeights: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: '0'},
      {id: '2', name: '1-2'},
      {id: '3', name: '3-4'},
      {id: '4', name: '5-6'}
    ],
    stackContInd: null,
    stackContIndOptions: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    collectContStep: null,
    collectContStepOptions: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    note: null
  }
  
  /*
    This function is called when the user changes the team. It loads values for
    the fields from the SQLite database or, if there is no record for the 
    selected team, it sets all of the fields to [Unknown]. 
  */
  $scope.selectTeam = function() {
    //TODO: replace the following with values retrieved from SQLite
    $scope.data.driveMode = $scope.data.driveModes[0];
    $scope.data.driveSpeed = $scope.data.driveSpeeds[0];
    $scope.data.driveOverPlatform = $scope.data.driveOverPlatformOptions[0];
    $scope.data.autonomousCapability = $scope.data.autonomousCapabilities[0];
    $scope.data.coopStep = $scope.data.coopStepOptions[0];
    $scope.data.pickupLoc = $scope.data.pickupLocs[0];
    $scope.data.maxToteHeight = $scope.data.maxToteHeights[0];
    $scope.data.maxContHeight = $scope.data.maxContHeights[0];
    $scope.data.stackContInd = $scope.data.stackContIndOptions[0];
    $scope.data.collectContStep = $scope.data.collectContStepOptions[0];
  }
  
  
  /*
    This function is called each time entry pauses for more than 0.5 seconds
    in the form on the Pit Scouting page.
  */
  $scope.writeData = function() {
    //TODO: Fill in once the SQLite database is configured
  }
})

.controller('MatchScoutingController', function($scope, $stateParams) {
  $scope.data = {
    yesNo: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Yes'},
      {id: '2', name: 'No'}
    ],
    teamName: null,
    teamNames: [
      {id: '1', name: 'Team 1'},
      {id: '2', name: 'Team 2'},
      {id: '3', name: 'Team 3'}
    ],
    matchNum: null,
    matchNums: [
      {id: '1', name: 'Match 1'},
      {id: '2', name: 'Match 2'},
      {id: '3', name: 'Match 3'},
      {id: '4', name: 'Match 4'},
      {id: '5', name: 'Match 5'}
    ],
    driveSpeed: null,
    driveSpeeds: [
      {id: '0', name: '[Unknown]'},
      {id: '1', name: 'Slow'},
      {id: '2', name: 'Medium'},
      {id: '3', name: 'Fast'}
    ],    
    driveOverPlatform: null,
    botSet: null,
    toteSet: null,
    containerSet: null,
    stackedToteSet: null,
    coopScoreStep: null,
    feedstation: null,
    landfill: null,
    scoredToteHeight: null,
    containerStep: null,
    scoredIndContainerHeight: null,
    scoredContainerHeight: null
  }
  
  /*
    This function is called when the user changes the team or the match. It loads values for
    the fields from the SQLite database or, if there is no record for the 
    selected team, it sets all of the fields to [Unknown]. 
  */
  $scope.selectTeamMatch = function() {
    //TODO: replace the following with values retrieved from SQLite
    $scope.data.driveSpeed = $scope.data.driveSpeeds[0];
    $scope.data.driveOverPlatform = $scope.data.yesNo[0];
    $scope.data.botSet = $scope.data.yesNo[0];
    $scope.data.toteSet = $scope.data.yesNo[0];
    $scope.data.containerSet = $scope.data.yesNo[0];
    $scope.data.stackedToteSet = $scope.data.yesNo[0];
    $scope.data.coopScoreStep = '0';
    $scope.data.feedstation = $scope.data.yesNo[0];
    $scope.data.landfill = $scope.data.yesNo[0];
    $scope.data.scoredToteHeight = '0';
    $scope.data.containerStep = $scope.data.yesNo[0];
    $scope.data.scoredIndContainerHeight = '0';
    $scope.data.scoredContainerHeight = '0';
  }  
  
  /*
    This function is called each time entry pauses for more than 0.5 seconds
    in the form on the Match Scouting page.
  */
  $scope.writeData = function() {
    //TODO: Fill in once the SQLite database is configured
  }  
});
