/*
  Much of the code in this file and controllers.js that has to do with SQLite is
  derived from the gist created by Borris Sondagh, here: 
  https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
*/
angular.module('cat5scouting.services', [])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;
    
    self.query = function(query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();
        
        $ionicPlatform.ready(function() {
           $cordovaSQLite.execute(db, query, parameters)
           .then(function (result) {
               q.resolve(result);
           }, function (error) {
               console.warn('Error encountered: ');
               console.warn(error);
               q.reject(error);
           });
        });
        return q.promise;
    }
    
    self.getAll = function(result) {
        var output = [];
        
        for (var i=0; i<result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    }
    
    self.getById = function(result) {
        var output = null;
        if (result.rows.length > 0) {
            output = angular.copy(result.rows.item(0));
        }
        return output;
    }
    
    return self;
})
    
/******************************************************************************/
    
.factory('Team', function($cordovaSQLite, DBA) {
    var self = this;
    
    self.all = function() {
        return DBA.query("SELECT id, name, number FROM team")
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.get = function(memberId) {
        var parameters = [memberId];
        return DBA.query("SELECT id, name, number FROM team WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getById(result);
            })
    }
    
    return self;
})
    
/******************************************************************************/

.factory('Robot', function($cordovaSQLite, DBA) {
    var self = this;
    
    self.all = function() {
        return DBA.query("SELECT id, name FROM robot")
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.getByTeam = function(teamId) {
        var parameters = [teamId];
        return DBA.query("SELECT id, name FROM robot WHERE teamId = (?)", parameters)
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.getById = function(robotId) {
        var parameters = [robotId];
        return DBA.query("SELECT `id`, `name`, `teamId`, `driveMode`, `driveSpeed`, "
                    +    "`driveOverPlatform`, `autonomousCapability`, "
                    +    "`coopStep`, `pickupLoc`, `maxToteHeight`, "
                    +    "`maxContHeight`, `stackContInd`, `collectContStep`, "
                    +    "`note`, `botSet`, `toteSet`, `containerSet` from robot "
                    +    "WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getById(result);
            })
    }
    
    self.update = function(origRobot, editRobot) {
        var parameters = [  
                            editRobot.driveMode.id, editRobot.driveSpeed.id, 
                            editRobot.driveOverPlatform.id, 
                            editRobot.autonomousCapability.id, 
                            editRobot.coopStep.id, editRobot.pickupLoc.id, 
                            editRobot.maxToteHeight.id, 
                            editRobot.maxContHeight.id, 
                            editRobot.stackContInd.id, 
                            editRobot.collectContStep.id, editRobot.note, 
                            editRobot.botSet.id, editRobot.toteSet.id, 
                            editRobot.containerSet.id, origRobot.id
                         ];
                         
        return DBA.query("UPDATE robot SET `driveMode`, `driveSpeed`, "
                    +    "`driveOverPlatform`, `autonomousCapability`, "
                    +    "`coopStep`, `pickupLoc`, `maxToteHeight`, "
                    +    "`maxContHeight`, `stackContInd`, `collectContStep`, "
                    +    "`note`, `botSet`, `toteSet`, `containerSet` "
                    +    "WHERE id = (?)", parameters);

    }
    
    return self;
})

/******************************************************************************/

.factory('RobotMatch', function($cordovaSQLite, DBA, Robot) {
    var self = this;
    
    /*
        This function returns all recorded robot name/match number combinations
        by joining the `robot` table and `match` table with the `robotMatch` 
        table
    */
    self.all = function() {
        return DBA.query("SELECT "
                        +"  r.name, "
                        +"	m.number "
                        +"FROM "
                        +"	`robotMatch` rm "
                        +"LEFT OUTER JOIN "
                        +"  `match` m ON rm.matchId=m.id "
                        +"LEFT OUTER JOIN "
                        +"	`robot` r ON rm.robotId=r.id")
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.getById = function(robotId, matchId) {
        if (robotId && matchId) {
            var parameters = [robotId, matchId];
            return DBA.query("SELECT rm.id, `matchId`, `robotId`, r.`teamId`, "
                           + "rm.`driveSpeed`, rm.`driveOverPlatform`, `botSet`, "
                           + "`toteSet`, `containerSet`, `stackedToteSet`, "
                           + "`coopScoreStep`, `feedstation`, `landfill`, "
                           + "`scoredToteHeight`, `containerStep`, "
                           + "`scoredIndContainerHeight`, `scoredContainerHeight` "
                           + "FROM `robotMatch` rm "
                           + "LEFT OUTER JOIN "
                           + "`robot` r ON (rm.robotId = r.id) "
                           + "WHERE r.id = (?) "
                           + "AND rm.`matchId` = (?)", parameters)
                .then(function(result) {
                    return DBA.getById(result);
                })
        }
    }
    
    self.update = function(origRobot, editRobot) {
        var parameters = [  
                            editRobot.driveSpeed.id, editRobot.driveOverPlatform.id, 
                            editRobot.botSet.id, editRobot.toteSet.id, 
                            editRobot.containerSet.id, origRobot.id
                         ];
                         
        return DBA.query("UPDATE `robotMatch` SET driveSpeed = (?), "
                        +"driveOverPlatform = (?), botSet = (?), toteSet = (?), "
                        +"containerSet = (?) WHERE id = (?)", parameters);

    }
    
    return self;
})

/******************************************************************************/
    
.factory('Match', function($cordovaSQLite, DBA) {
    var self = this;
    
    self.all = function() {
        return DBA.query("SELECT id, number FROM match")
            .then(function(result) {
                return DBA.getAll(result);
            })
    }
    
    self.get = function(matchId) {
        var parameters = [matchId];
        return DBA.query("SELECT id, number FROM match WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getById(result);
            })
    }
    
    return self;
})
    
