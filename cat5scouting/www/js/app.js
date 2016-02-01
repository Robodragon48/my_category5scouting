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
      $cordovaSQLite.execute(db, "DROP TABLE `robotMatch`");
    /**/
    
    $cordovaSQLite.execute(db, "CREATE TABLE `team` (`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `name` TEXT UNIQUE,	`number` INTEGER NOT NULL UNIQUE)");
    $cordovaSQLite.execute(db, "CREATE TABLE `robot` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
                                                   + "`name` TEXT NOT NULL, "
                                                   + "`teamId` INTEGER NOT NULL, "
                                                   + "`runAuto` INTEGER, "
                                                   + "`driveType` TEXT, "
                                                   + "`height` INTEGER, "
                                                   + "`notes` TEXT, "
                                                   + "`spyReq` INTEGER, "
                                                   + "`spyDoc` INTEGER, "
                                                   + "`OWA1` BOOLEAN, " //low bar
                                                   + "`OWA2` BOOLEAN, " //chival de frise
                                                   + "`OWA3` BOOLEAN, " //moat
                                                   + "`OWA4` BOOLEAN, " //ramparts
                                                   + "`OWA5` BOOLEAN, " //drawbridge
                                                   + "`OWA6` BOOLEAN, " //sally port
                                                   + "`OWA7` BOOLEAN, " //portcullis
                                                   + "`OWA8` BOOLEAN, " //rock wall
                                                   + "`OWA9` BOOLEAN, " //rough terrain
                                                   + "`OWT1` BOOLEAN, "
                                                   + "`OWT2` BOOLEAN, "
                                                   + "`OWT3` BOOLEAN, "
                                                   + "`OWT4` BOOLEAN, "
                                                   + "`OWT5` BOOLEAN, "
                                                   + "`OWT6` BOOLEAN, "
                                                   + "`OWT7` BOOLEAN, "
                                                   + "`OWT8` BOOLEAN, "
                                                   + "`OWT9` BOOLEAN, "
                                                   + "`scoreTL` BOOLEAN, "
                                                   + "`scoreTM` BOOLEAN, "
                                                   + "`scoreTR` BOOLEAN, "
                                                   + "`scoreBL` BOOLEAN, "
                                                   + "`scoreBM` BOOLEAN, "
                                                   + "`scoreBR` BOOLEAN, "
                                                   + "`scoreTop` BOOLEAN, "
                                                   + "`scoreBottom` BOOLEAN, "
                                                   + "`scale` BOOLEAN, "
                                                   + "`pickupF` BOOLEAN, "
                                                   + "`pickupS` BOOLEAN, "
                                                   + "`defense` BOOLEAN, "
                                                   + "`spy` BOOLEAN, "
                                                   + "`signal` BOOLEAN, "
                                                   + "FOREIGN KEY(`teamId`) REFERENCES team ( id ))");
    $cordovaSQLite.execute(db, "CREATE TABLE `match` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `number` INTEGER NOT NULL UNIQUE)");

    $cordovaSQLite.execute(db, "CREATE TABLE `robotMatch` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
                                                        + "`matchId` INTEGER, "
                                                        + "`robotId` INTEGER, "
                                                        + "`teamId` INTEGER, "
                                                        + "`numLow` INTEGER, "
                                                        + "`numHigh` INTEGER, "
                                                        + "`lowBarA` INTEGER, "
                                                        + "`lowBarT` INTEGER, "
                                                        + "`portA` INTEGER, "
                                                        + "`portT` INTEGER, "
                                                        + "`chevA` INTEGER, "
                                                        + "`chevT` INTEGER, "
                                                        + "`moatA` INTEGER, "
                                                        + "`moatT` INTEGER, "
                                                        + "`rockA` INTEGER, "
                                                        + "`rockT` INTEGER, "
                                                        + "`roughA` INTEGER, "
                                                        + "`roughT` INTEGER, "
                                                        + "`sallyA` INTEGER, "
                                                        + "`sallyT` INTEGER, "
                                                        + "`drawA` INTEGER, "
                                                        + "`drawT` INTEGER, "
                                                        + "`scaled` INTEGER, "
                                                        + "`challenge` INTEGER, "
                                                        + "`bFloor` INTEGER, "
                                                        + "`bSecret` INTEGER, "
                                                        + "`numF` INTEGER, "
                                                        + "`borked` BOOLEAN, "
                                                        + "`defense` INTEGER, "
                                                        + "`spyComm1` INTEGER, "
                                                        + "`spyComm2` INTEGER, "
                                                        + "FOREIGN KEY(`matchId`) REFERENCES match ( id ), "
                                                        + "FOREIGN KEY(`robotId`) REFERENCES robot ( id ), "
                                                        + "FOREIGN KEY(`teamId`) REFERENCES team ( id ))");
    
    
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
