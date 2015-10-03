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
  $scope.data = {
    teamName: null,
    teamNames: [
      {id: '1', name: 'Team 1'},
      {id: '2', name: 'Team 2'},
      {id: '3', name: 'Team 3'}
    ]
  }
});
