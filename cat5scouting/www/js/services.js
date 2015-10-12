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
        output = angular.copy(result.rows.item(0));
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