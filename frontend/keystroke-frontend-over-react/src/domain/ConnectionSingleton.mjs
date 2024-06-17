import {HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
export var ConnectionSingleton = (function(){
    class ConnectionClass {
        connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7013/ping")
            .configureLogging(LogLevel.Information)
            .build();
    }

    let instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new ConnectionClass();
                instance.constructor = null;
            }
            return instance;
        }
    };
})();