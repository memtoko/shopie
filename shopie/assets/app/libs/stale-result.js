class StaleResult {
    constructor() {
        this.hasResults = false;
        this._results = null;
    }

    set results(results) {
        if (results) {
            this._results = results;
            this.hasResults = true;
        }
    }

    get results() {
        return this._results;
    }
}

export default StaleResult;
