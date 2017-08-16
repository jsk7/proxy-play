let config = require('./config'),
    moment = require('moment');

class Client {

    constructor(ip) {
        this.ip = ip;
        this.requests = 0;
        this.requestsPerTime = 0;
        this.config = config.client;
        this.firstReqsTime = moment().add(this.config.load.time, 'milliseconds');
    }

    getIP() {
        return this.ip;
    }

    addRequest() {
        if( this.reqPerTimeHasExpired() ) {
            this.firstReqsTime = moment().add(this.config.load.time, 'milliseconds');
            this.requestsPerTime = 0;
        }

        this.requestsPerTime++;
        return this.requests++;
    }

    reqPerTimeHasExpired() { // El tiempo desde la primera req excede el tiempo configurado
        const currentReqTime = moment();
        return currentReqTime.isAfter(this.firstReqsTime);
    }

    requestsPerTimeValid() {
        return this.reqPerTimeHasExpired() || this.requestsPerTime < this.config.load.max_requests_per_time;
    }

    requestsTotalAreValid() {
        return this.requests < this.config.max_requests;
    }

    canHaveAccess() {
        return this.requestsTotalAreValid() && this.requestsPerTimeValid();
    }
}

module.exports = Client;