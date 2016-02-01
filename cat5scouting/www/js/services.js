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
        return DBA.query("SELECT `id`, `name`, `teamId`, `runAuto`, `driveType`, "
                    +   "`height`, `notes`, `spyReq`, `spyDoc`, `OWA1`, `OWA2`, "
                    +   "`OWA3`, `OWA4`, `OWA5`, `OWA6`, `OWA7`, `OWA8`, `OWA9`, "
                    +   "`OWT1`, `OWT2`, `OWT3`, `OWT4`, `OWT5`, `OWT6`, `OWT7`, "
                    +   "`OWT8`, `OWT9`, `scoreTL`, `scoreTM`, `scoreTR`, "
                    +   "`scoreBL`, `scoreBM`, `scoreBR`, `scoreTop`, "
                    +   "`scoreBottom`, `scale`, `pickupF`, `pickupS`, `defense`, "
                    +   "`spy`, `signal` from robot "
                    +   "WHERE id = (?"), parameters)
            .then(function(result) {
                return DBA.getById(result);
            })
    }
    
    self.update = function(origRobot, editRobot) {
        //build an update statement to include only values that have selections 
        //on the form
        var parameters = [];
        var query = "UPDATE `robot` SET ";

        if (editRobot.name) { 
            parameters.push(editRobot.`name`.id); 
            query += " name = (?),";
        }
        if (editRobot.teamId) { 
            parameters.push(editRobot.teamId.id); 
            query += " teamId = (?),";
        }
        if (editRobot.runAuto) { 
            parameters.push(editRobot.runAuto.id); 
            query += " runAuto = (?),";
        }
        if (editRobot.driveType) { 
            parameters.push(editRobot.driveType.id); 
            query += " driveType = (?),";
        }
        if (editRobot.height) { 
            parameters.push(editRobot.`height`.id); 
            query += " height = (?),";
        }
        if (editRobot.notes) { 
            parameters.push(editRobot.notes.id); 
            query += " notes = (?),";
        }
        if (editRobot.spyReq) { 
            parameters.push(editRobot.spyReq.id); 
            query += " spyReq = (?),";
        }
        if (editRobot.spyDoc) { 
            parameters.push(editRobot.spyDoc.id); 
            query += " spyDoc = (?),";
        }
        if (editRobot.OWA1) { 
            parameters.push(editRobot.OWA1.id); 
            query += " OWA1 = (?),";
        }
        if (editRobot.OWA2) { 
            parameters.push(editRobot.OWA2.id); 
            query += " OWA2 = (?),";
        }
        if (editRobot.OWA3) { 
            parameters.push(editRobot.OWA3.id); 
            query += " OWA3 = (?),";
        }
        if (editRobot.OWA4) { 
            parameters.push(editRobot.OWA4.id); 
            query += " OWA4 = (?),";
        }
        if (editRobot.OWA5) { 
            parameters.push(editRobot.OWA5.id); 
            query += " OWA5 = (?),";
        }
        if (editRobot.OWA6) { 
            parameters.push(editRobot.OWA6.id); 
            query += " OWA6 = (?),";
        }
        if (editRobot.OWA7) { 
            parameters.push(editRobot.OWA7.id); 
            query += " OWA7 = (?),";
        }
        if (editRobot.OWA8) { 
            parameters.push(editRobot.OWA8.id); 
            query += " OWA8 = (?),";
        }
        if (editRobot.OWA9) { 
            parameters.push(editRobot.OWA9.id); 
            query += " OWA9 = (?),";
        }
        if (editRobot.OWT1) { 
            parameters.push(editRobot.OWT1.id); 
            query += " OWT1 = (?),";
        }
        if (editRobot.OWT2) { 
            parameters.push(editRobot.OWT2.id); 
            query += " OWT2 = (?),";
        }
        if (editRobot.OWT3) { 
            parameters.push(editRobot.OWT3.id); 
            query += " OWT3 = (?),";
        }
        if (editRobot.OWT4) { 
            parameters.push(editRobot.OWT4.id); 
            query += " OWT4 = (?),";
        }
        if (editRobot.OWT5) { 
            parameters.push(editRobot.OWT5.id); 
            query += " OWT5 = (?),";
        }
        if (editRobot.OWT6) { 
            parameters.push(editRobot.OWT6.id); 
            query += " OWT6 = (?),";
        }
        if (editRobot.OWT7) { 
            parameters.push(editRobot.OWT7.id); 
            query += " OWT7 = (?),";
        }
        if (editRobot.OWT8) { 
            parameters.push(editRobot.OWT8.id); 
            query += " OWT8 = (?),";
        }
        if (editRobot.OWT9) { 
            parameters.push(editRobot.OWT9.id); 
            query += " OWT9 = (?),";
        }
        if (editRobot.scoreTL) { 
            parameters.push(editRobot.scoreTL.id); 
            query += " scoreTL = (?),";
        }
        if (editRobot.scoreTM) { 
            parameters.push(editRobot.scoreTM.id); 
            query += " scoreTM = (?),";
        }
        if (editRobot.scoreTR) { 
            parameters.push(editRobot.scoreTR.id); 
            query += " scoreTR = (?),";
        }
        if (editRobot.scoreBL) { 
            parameters.push(editRobot.scoreBL.id); 
            query += " scoreBL = (?),";
        }
        if (editRobot.scoreBM) { 
            parameters.push(editRobot.scoreBM.id); 
            query += " scoreBM = (?),";
        }
        if (editRobot.scoreBR) { 
            parameters.push(editRobot.scoreBR.id); 
            query += " scoreBR = (?),";
        }
        if (editRobot.scoreTop) { 
            parameters.push(editRobot.scoreTop.id); 
            query += " scoreTop = (?),";
        }
        if (editRobot.scoreBottom) { 
            parameters.push(editRobot.scoreBottom.id); 
            query += " scoreBottom = (?),";
        }
        if (editRobot.scale) { 
            parameters.push(editRobot.scale.id); 
            query += " scale = (?),";
        }
        if (editRobot.pickupF) { 
            parameters.push(editRobot.pickupF.id); 
            query += " pickupF = (?),";
        }
        if (editRobot.pickupS) { 
            parameters.push(editRobot.pickupS.id); 
            query += " pickupS = (?),";
        }
        if (editRobot.defense) { 
            parameters.push(editRobot.defense.id); 
            query += " defense = (?),";
        }
        if (editRobot.spy) { 
            parameters.push(editRobot.spy.id); 
            query += " spy = (?),";
        }
        if (editRobot.signal) { 
            parameters.push(editRobot.signal.id); 
            query += " signal = (?),";
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
        console.log("Query to update robot record: " + query + " with robotId '" 
            + editRobot.id + "'");

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
                +   "rm.`numLow`, rm.`numHigh`, rm.`lowBarA`, rm.`lowBarT`, "
                +   "rm.`portA`, rm.`portT`, rm.`chevA`, rm.`chevT`, rm.`moatA`, " 
                +   "rm.`moatT`, rm.`rockA`, rm.`rockT`, rm.`roughA`, rm.`roughT`, " 
                +   "rm.`sallyA`, rm.`sallyT`, rm.`drawA`, rm.`drawT`, "
                +   "rm.`rampartA`, rm.`rampartT`, rm.`scaled`, "
                +   "rm.`challenge`, rm.`bFloor`, rm.`bSecret`, rm.`numF`, rm.`borked`, "
                +   "rm.`defense`, rm.`spyComm1`, rm.`spyComm2` "
                +   "FROM `robotMatch` rm "
                +   "LEFT OUTER JOIN "
                +   "`robot` r ON (rm.robotId = r.id) "
                +   "WHERE r.id = (?) "
                +   "AND rm.`matchId` = (?)", parameters)
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
        if (editRobot.numLow) { 
           parameters.push(editRobot.numLow.id); 
           query += " numLow = (?),";
        }         
        if (editRobot.numHigh) { 
           parameters.push(editRobot.numHigh.id); 
           query += " numHigh = (?),";
        }         
        if (editRobot.lowBarA) { 
           parameters.push(editRobot.lowBarA.id); 
           query += " lowBarA = (?),";
        }         
        if (editRobot.lowBarT) { 
           parameters.push(editRobot.lowBarT.id); 
           query += " lowBarT = (?),";
        }         
        if (editRobot.portA) { 
           parameters.push(editRobot.portA.id); 
           query += " portA = (?),";
        }         
        if (editRobot.portT) { 
           parameters.push(editRobot.portT.id); 
           query += " portT = (?),";
        }         
        if (editRobot.chevA) { 
           parameters.push(editRobot.chevA.id); 
           query += " chevA = (?),";
        }         
        if (editRobot.chevT) { 
           parameters.push(editRobot.chevT.id); 
           query += " chevT = (?),";
        }         
        if (editRobot.moatA) { 
           parameters.push(editRobot.moatA.id); 
           query += " moatA = (?),";
        }         
        if (editRobot.moatT) { 
           parameters.push(editRobot.moatT.id); 
           query += " moatT = (?),";
        }         
        if (editRobot.rampartA) { 
           parameters.push(editRobot.rampartA.id); 
           query += " rampartA = (?),";
        }         
        if (editRobot.rampartT) { 
           parameters.push(editRobot.rampartT.id); 
           query += " rampartT = (?),";
        }         
        if (editRobot.rockA) { 
           parameters.push(editRobot.rockA.id); 
           query += " rockA = (?),";
        }         
        if (editRobot.rockT) { 
           parameters.push(editRobot.rockT.id); 
           query += " rockT = (?),";
        }         
        if (editRobot.roughA) { 
           parameters.push(editRobot.roughA.id); 
           query += " roughA = (?),";
        }         
        if (editRobot.roughT) { 
           parameters.push(editRobot.roughT.id); 
           query += " roughT = (?),";
        }         
        if (editRobot.sallyA) { 
           parameters.push(editRobot.sallyA.id); 
           query += " sallyA = (?),";
        }         
        if (editRobot.sallyT) { 
           parameters.push(editRobot.sallyT.id); 
           query += " sallyT = (?),";
        }         
        if (editRobot.drawA) { 
           parameters.push(editRobot.drawA.id); 
           query += " drawA = (?),";
        }         
        if (editRobot.drawT) { 
           parameters.push(editRobot.drawT.id); 
           query += " drawT = (?),";
        }         
        if (editRobot.scaled) { 
           parameters.push(editRobot.scaled.id); 
           query += " scaled = (?),";
        }         
        if (editRobot.challenge) { 
           parameters.push(editRobot.challenge.id); 
           query += " challenge = (?),";
        }         
        if (editRobot.bFloor) { 
           parameters.push(editRobot.bFloor.id); 
           query += " bFloor = (?),";
        }         
        if (editRobot.bSecret) { 
           parameters.push(editRobot.bSecret.id); 
           query += " bSecret = (?),";
        }         
        if (editRobot.numF) { 
           parameters.push(editRobot.numF.id); 
           query += " numF = (?),";
        }         
        if (editRobot.borked) { 
           parameters.push(editRobot.borked.id); 
           query += " borked = (?),";
        }         
        if (editRobot.defense) { 
           parameters.push(editRobot.defense.id); 
           query += " defense = (?),";
        }         
        if (editRobot.spyComm1) { 
           parameters.push(editRobot.spyComm1.id); 
           query += " spyComm1 = (?),";
        }         
        if (editRobot.spyComm2) { 
           parameters.push(editRobot.spyComm2.id); 
           query += " spyComm2 = (?),";
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
        console.log("Query to update robot match record: " + query + " with robotId '" 
            + editRobot.robotId + "' and matchId '" + editRobot.matchId + "'");

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
    
