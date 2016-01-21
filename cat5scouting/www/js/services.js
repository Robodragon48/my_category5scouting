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
                    +    "`note` from robot "
                    +    "WHERE id = (?)", parameters)
            .then(function(result) {
                return DBA.getById(result);
            })
    }
    
    self.update = function(origRobot, editRobot) {
        //build an update statement to include only values that have selections 
        //on the form
        var parameters = [];
        var query = "UPDATE `robot` SET ";

        if (editRobot.driveMode) { 
            parameters.push(editRobot.driveMode.id); 
            query += " driveMode = (?),";
        }
        if (editRobot.driveSpeed) { 
            parameters.push(editRobot.driveSpeed.id); 
            query += " driveSpeed = (?),";
        }
        if (editRobot.driveOverPlatform) { 
            parameters.push(editRobot.driveOverPlatform.id); 
            query += " driveOverPlatform = (?),";
        }
        if (editRobot.autonomousCapability) { 
            parameters.push(editRobot.autonomousCapability.id); 
            query += " autonomousCapability = (?),";
        }
        if (editRobot.coopStep) { 
            parameters.push(editRobot.coopStep.id); 
            query += " coopStep = (?),";
        }
        if (editRobot.pickupLoc) { 
            parameters.push(editRobot.pickupLoc.id); 
            query += " pickupLoc = (?),";
        }
        if (editRobot.maxToteHeight) { 
            parameters.push(editRobot.maxToteHeight.id); 
            query += " maxToteHeight = (?),";
        }
        if (editRobot.maxContHeight) { 
            parameters.push(editRobot.maxContHeight.id); 
            query += " maxContHeight = (?),";
        }
        if (editRobot.stackContInd) { 
            parameters.push(editRobot.stackContInd.id); 
            query += " stackContInd = (?),";
        }
        if (editRobot.collectContStep) { 
            parameters.push(editRobot.collectContStep.id); 
            query += " collectContStep = (?),";
        }
        if (editRobot.note) { 
            parameters.push(editRobot.note); 
            query += " note = (?),";
        }

        //add the robot ID to the parameters
        parameters.push(editRobot.id);

        //remove the trailing comma from the last part of the query text
        var length = query.length;
        if (query.substr(length-1,1) == ",") {
            query = query.substring(0,length-1);
        }
        
        //add the robot ID and the match ID to the query
        query += "WHERE (id = (?))";
        
        //output the query to the console for testing purposes
        console.log("Query to update robot match record: " + query + " with robotId '" + editRobot.id + "'");

        //execute the query
        return DBA.query(query, parameters);
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
    
    self.update = function(origRobot, editRobot, match) {
        //build an update statement to include only values that have selections 
        //on the form
        var parameters = [];
        var query = "UPDATE `robotMatch` SET ";
        if (editRobot.driveSpeed) { 
            parameters.push(editRobot.driveSpeed.id); 
            query += " driveSpeed = (?),";
        }
        if (editRobot.driveOverPlatform) {
            parameters.push(editRobot.driveOverPlatform.id); 
            query += " driveOverPlatform = (?),";
        }
        if (editRobot.botSet) {
            parameters.push(editRobot.botSet.id); 
            query += " botSet = (?),";
        }
        if (editRobot.toteSet) {
            parameters.push(editRobot.toteSet.id); 
            query += " toteSet = (?),";
        }
        if (editRobot.containerSet) {
            parameters.push(editRobot.containerSet.id); 
            query += " containerSet = (?),";
        }
        if (editRobot.stackedToteSet) {
            parameters.push(editRobot.stackedToteSet.id); 
            query += " stackedToteSet = (?),";
        }
        if (editRobot.coopScoreStep) {
            parameters.push(editRobot.coopScoreStep); 
            query += " coopScoreStep = (?),";
        }
        if (editRobot.feedstation) {
            parameters.push(editRobot.feedstation.id); 
            query += " feedstation = (?),";
        }
        if (editRobot.landfill) {
            parameters.push(editRobot.landfill.id); 
            query += " landfill = (?),";
        }
        if (editRobot.scoredToteHeight) {
            parameters.push(editRobot.scoredToteHeight); 
            query += " scoredToteHeight = (?),";
        }
        if (editRobot.containerStep) {
            parameters.push(editRobot.containerStep.id); 
            query += " containerStep = (?),";
        }
        if (editRobot.scoredIndContainerHeight) {
            parameters.push(editRobot.scoredIndContainerHeight); 
            query += " scoredIndContainerHeight = (?),";
        }
        if (editRobot.scoredContainerHeight) {
            parameters.push(editRobot.scoredContainerHeight); 
            query += " scoredContainerHeight = (?),";
        }

        //add the robot ID and the match ID to the parameters
        parameters.push(editRobot.robotId);
        parameters.push(editRobot.matchId);
        
        //remove the trailing comma from the last part of the query text
        var length = query.length;
        if (query.substr(length-1,1) == ",") {
            query = query.substring(0,length-1);
        }
        
        //add the robot ID and the match ID to the query
        query += "WHERE (robotId = (?)) AND (matchId = (?))";
        
        //output the query to the console for testing purposes
        console.log("Query to update robot match record: " + query + " with robotId '" + editRobot.robotId + "' and matchId '" + editRobot.matchId + "'");

        //execute the query
        return DBA.query(query, parameters);
    }
    
    self.add = function(robotMatch) {
        var parameters = [
                            robotMatch.robotId, 
                            robotMatch.matchId
                         ];
        return DBA.query("INSERT INTO `robotMatch` (robotId, matchId) "
                        +"VALUES (?,?)", parameters);
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
    
