var db = null;

angular.module('cat5scouting', ['ionic', 'cat5scouting.controllers', 'cat5scouting.services', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    if (window.cordova) {
      db = $cordovaSQLite.openDB("cat5scouting.db");
    } else {
      db = window.openDatabase("cat5scouting.db", "1.0", "cat5scouting", -1);
    }
    
    /* Delete the database to start from scratch
     * Add to this section each time you add a new table definition */
     
      $cordovaSQLite.execute(db, "DROP TABLE `team`");
      $cordovaSQLite.execute(db, "DROP TABLE `robot`");
      $cordovaSQLite.execute(db, "DROP TABLE `match`");
    /**/
    
    $cordovaSQLite.execute(db, "CREATE TABLE `team` (`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `name` TEXT UNIQUE,	`number` INTEGER NOT NULL UNIQUE)");
    $cordovaSQLite.execute(db, "CREATE TABLE `robot` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL, `teamId` INTEGER NOT NULL, FOREIGN KEY(teamId) REFERENCES team(id))");
    $cordovaSQLite.execute(db, "CREATE TABLE `match` (`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `number` INTEGER NOT NULL UNIQUE)");
    
    /* Load the database with test values
     * Add to this section each time you add a new table definition */
     
    var query = "INSERT INTO team (name, number) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["Category 5", 3489]).then(function(res) {
      console.log("team insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
     
    var query = "INSERT INTO team (name, number) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["The Burning Magnetos", 342]).then(function(res) {
      console.log("team insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
    
    var query = "INSERT INTO robot (name, teamId) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["Mechatrina", 1]).then(function(res) {
      console.log("robot insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
    
    var query = "INSERT INTO match (number) VALUES (?)";
    $cordovaSQLite.execute(db, query, [1]).then(function(res) {
      console.log("match insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
    
    var query = "INSERT INTO match (number) VALUES (?)";
    $cordovaSQLite.execute(db, query, [2]).then(function(res) {
      console.log("match insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
    
    var query = "INSERT INTO match (number) VALUES (?)";
    $cordovaSQLite.execute(db, query, [3]).then(function(res) {
      console.log("match insertId: " + res.insertId);
    }, function (err) {
      console.error(err);
    });
    
    /**/
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  
  .state('app.pit', {
    url: '/pit',
    views: {
      'menuContent': {
        templateUrl: 'templates/pit.html',
        controller: 'PitCtrl'
      }
    }
  })

  .state('app.match', {
    url: '/match',
    views: {
      'menuContent': {
        templateUrl: 'templates/match.html',
        controller: 'MatchCtrl'
      }
    }
  })
  
  .state('app.sync', {
    url: '/sync',
    views: {
      'menuContent': {
        templateUrl: 'templates/sync.html',
        controller: 'SyncCtrl'
      }
    }
  })
  
  .state('app.config', {
    url: '/config', 
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
